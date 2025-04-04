import https from "https"
import { TokenResponse } from "./config"

export async function getKeycloakToken(username: string, password: string): Promise<TokenResponse> {
  const formData = new URLSearchParams()
  formData.append('client_id', process.env.KEYCLOAK_ID!)
  formData.append('client_secret', process.env.KEYCLOAK_SECRET!)
  formData.append('grant_type', 'password')
  formData.append('username', username)
  formData.append('password', password)

  const tokenUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`
  
  return new Promise<TokenResponse>((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      rejectUnauthorized: false // WARNING: Only for development
    }

    const req = https.request(tokenUrl, options, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          if (res.statusCode !== 200) {
            let errorMessage = 'Authentication failed';
            if (response.error_description) {
              errorMessage = response.error_description;
            } else if (response.error) {
              errorMessage = response.error;
            } else if (res.statusCode === 400) {
              errorMessage = 'Invalid request';
            } else if (res.statusCode === 401) {
              errorMessage = 'Invalid credentials';
            }
            reject(new Error(errorMessage));
          } else {
            resolve(response)
          }
        } catch (error) {
          reject(new Error('Failed to parse server response'))
        }
      })
    })

    req.on('error', (error) => reject(new Error('Failed to connect to authentication server')))
    req.write(formData.toString())
    req.end()
  })
} 
