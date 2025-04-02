import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import https from "https"

interface TokenResponse {
  access_token: string
  refresh_token: string
  sub?: string
  error?: string
  error_description?: string
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Keycloak",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          const formData = new URLSearchParams()
          formData.append('client_id', process.env.KEYCLOAK_ID!)
          formData.append('client_secret', process.env.KEYCLOAK_SECRET!)
          formData.append('grant_type', 'password')
          formData.append('username', credentials.username)
          formData.append('password', credentials.password)

          const tokenUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`
          
          const data = await new Promise<TokenResponse>((resolve, reject) => {
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
                  resolve(JSON.parse(data))
                } catch (error) {
                  reject(error)
                }
              })
            })

            req.on('error', (error) => reject(error))
            req.write(formData.toString())
            req.end()
          })

          if (!data || data.error) {
            throw new Error(data.error_description || 'Authentication failed')
          }

          return {
            id: data.sub || credentials.username,
            name: credentials.username,
            email: credentials.username,
            accessToken: data.access_token,
            refreshToken: data.refresh_token
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 
