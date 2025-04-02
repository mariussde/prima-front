import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getKeycloakToken } from "./keycloak"

export interface TokenResponse {
  access_token: string
  refresh_token: string
  sub?: string
  error?: string
  error_description?: string
}

export const authConfig: NextAuthOptions = {
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
          const data = await getKeycloakToken(credentials.username, credentials.password)

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
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
} 
