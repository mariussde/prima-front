import https from "https"
import { TokenResponse } from "./config"

interface KeycloakError extends Error {
  code?: string;
}

export async function getKeycloakToken(username: string, password: string): Promise<TokenResponse> {
  if (!process.env.KEYCLOAK_ID || !process.env.KEYCLOAK_SECRET || !process.env.KEYCLOAK_ISSUER) {
    throw new Error("Keycloak configuration is missing")
  }

  const formData = new URLSearchParams()
  formData.append('client_id', process.env.KEYCLOAK_ID)
  formData.append('client_secret', process.env.KEYCLOAK_SECRET)
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
      rejectUnauthorized: process.env.NODE_ENV === 'production' // Only allow self-signed certs in development
    }

    const req = https.request(tokenUrl, options, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          
          if (res.statusCode && res.statusCode !== 200) {
            let errorMessage = 'Authentication failed'
            
            if (response.error === 'invalid_grant') {
              errorMessage = 'Invalid username or password'
            } else if (response.error === 'unauthorized_client') {
              errorMessage = 'Client authentication failed'
            } else if (response.error_description) {
              errorMessage = response.error_description
            } else if (response.error) {
              errorMessage = response.error
            } else if (res.statusCode === 400) {
              errorMessage = 'Invalid request'
            } else if (res.statusCode === 401) {
              errorMessage = 'Invalid credentials'
            } else if (res.statusCode === 403) {
              errorMessage = 'Access denied'
            } else if (res.statusCode === 404) {
              errorMessage = 'Authentication server not found'
            } else if (res.statusCode >= 500) {
              errorMessage = 'Authentication server error'
            }
            
            reject(new Error(errorMessage))
            return
          }
          
          resolve(response)
        } catch (error) {
          reject(new Error('Failed to parse authentication server response'))
        }
      })
    })

    req.on('error', (error: KeycloakError) => {
      if (error.code === 'ECONNREFUSED') {
        reject(new Error('Unable to connect to authentication server'))
      } else if (error.code === 'ETIMEDOUT') {
        reject(new Error('Connection to authentication server timed out'))
      } else {
        reject(new Error('Failed to connect to authentication server'))
      }
    })

    req.write(formData.toString())
    req.end()
  })
} 
