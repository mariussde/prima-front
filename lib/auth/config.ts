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
          throw new Error('Please provide both username and password')
        }

        try {
          const data = await getKeycloakToken(credentials.username, credentials.password)

          if (!data || data.error) {
            console.log('Error from getKeycloakToken:', data?.error_description || data?.error);
            throw new Error(data.error_description || data.error || 'Invalid username or password')
          }

          return {
            id: data.sub || credentials.username,
            name: credentials.username,
            email: credentials.username,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          };
        } catch (error) {
          if (error instanceof Error) {
            // Pass the error message directly to NextAuth
            return Promise.reject(new Error(error.message))
          }
          return Promise.reject(new Error('Authentication failed'))
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
      // Allow relative URLs
      if (url.startsWith("/")) return url
      // Allow URLs from the same origin
      if (new URL(url).origin === baseUrl) return url
      // Default to home page
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
