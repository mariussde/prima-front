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
      // Handle the clean URL without query parameters, only when redirecting from the sign-in page
      if (url.startsWith("/login") && url.includes('?callbackUrl=')) {
        const cleanUrl = url.split('?')[0];
        return cleanUrl;
      }
      
      // Regular redirect logic
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
