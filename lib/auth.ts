import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import crypto from "crypto";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    username?: string;
  }
}

// Function to calculate the secret hash for Cognito
const calculateSecretHash = (username: string) => {
  const message = username + process.env.AWS_COGNITO_CLIENT_ID!;
  const key = process.env.AWS_COGNITO_CLIENT_SECRET!;
  return crypto
    .createHmac("SHA256", key)
    .update(message)
    .digest("base64");
};

// Function to refresh the token
async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(
      `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        },
        body: JSON.stringify({
          AuthParameters: {
            REFRESH_TOKEN: token.refreshToken,
            SECRET_HASH: calculateSecretHash(token.username || ""),
          },
          AuthFlow: "REFRESH_TOKEN_AUTH",
          ClientId: process.env.AWS_COGNITO_CLIENT_ID,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return {
      ...token,
      accessToken: data.AuthenticationResult.AccessToken,
      expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "AWS Cognito",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const secretHash = calculateSecretHash(credentials.username);
          
          const response = await fetch(
            `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-amz-json-1.1",
                "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
              },
              body: JSON.stringify({
                AuthParameters: {
                  USERNAME: credentials.username,
                  PASSWORD: credentials.password,
                  SECRET_HASH: secretHash,
                },
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: process.env.AWS_COGNITO_CLIENT_ID,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            console.error("Cognito error:", data);
            
            if (data.__type === "NotAuthorizedException") {
              if (data.message === "Password attempts exceeded") {
                throw new Error("Account temporarily locked due to too many failed login attempts. Please try again later or reset your password.");
              } else {
                throw new Error("Invalid username or password");
              }
            } else if (data.__type === "UserNotConfirmedException") {
              throw new Error("User is not confirmed");
            } else if (data.__type === "UserNotFoundException") {
              throw new Error("User not found");
            } else {
              throw new Error(data.message || "Authentication failed");
            }
          }

          // Get user info from the ID token
          const idTokenPayload = JSON.parse(
            Buffer.from(data.AuthenticationResult.IdToken.split(".")[1], "base64").toString()
          );

          // Only return essential user data
          return {
            id: idTokenPayload.sub,
            name: idTokenPayload["cognito:username"],
            email: idTokenPayload.email,
            accessToken: data.AuthenticationResult.AccessToken,
            refreshToken: data.AuthenticationResult.RefreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + 3600,
            username: idTokenPayload["cognito:username"]
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV !== "production",
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        // Initial sign in - only store essential data
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresAt: user.expiresAt,
          username: user.username,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt || 0) * 1000) {
        return token;
      }

      // Access token has expired, try to refresh it
      return refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.error === "RefreshAccessTokenError") {
        throw new Error("RefreshAccessTokenError");
      }

      // Only include essential session data
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt: token.expiresAt,
        user: {
          name: token.username,
          email: session.user?.email,
          username: token.username,
        },
      };
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
