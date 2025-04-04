import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import https from "https";

// Disable SSL verification completely
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Keycloak",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const tokenUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
          const tokenParams = new URLSearchParams({
            grant_type: "password",
            client_id: process.env.KEYCLOAK_ID!,
            client_secret: process.env.KEYCLOAK_SECRET!,
            username: credentials.username,
            password: credentials.password,
          });

          const tokenResponse = await fetch(tokenUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: tokenParams,
          });

          if (!tokenResponse.ok) {
            const error = await tokenResponse.text();
            console.error("Keycloak error:", error);
            throw new Error("Invalid credentials");
          }

          const tokenData = await tokenResponse.json();
          
          // Fetch user info
          const userInfoUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`;
          const userResponse = await fetch(userInfoUrl, {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          });

          if (!userResponse.ok) {
            throw new Error("Failed to fetch user info");
          }

          const userInfo = await userResponse.json();

          return {
            id: userInfo.sub,
            name: userInfo.name || userInfo.preferred_username,
            email: userInfo.email,
            accessToken: tokenData.access_token,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 
