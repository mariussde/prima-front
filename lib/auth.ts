import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import crypto from "crypto";

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

// Function to calculate the secret hash for Cognito
const calculateSecretHash = (username: string) => {
  const message = username + process.env.AWS_COGNITO_CLIENT_ID!;
  const key = process.env.AWS_COGNITO_CLIENT_SECRET!;
  return crypto
    .createHmac("SHA256", key)
    .update(message)
    .digest("base64");
};

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
          
          // Ensure password is properly escaped
          const escapedPassword = credentials.password.replace(/"/g, '\\"');
          
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
                  PASSWORD: escapedPassword,
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
            // Log the full request details for debugging
            console.log("Request details:", {
              url: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/`,
              headers: {
                "Content-Type": "application/x-amz-json-1.1",
                "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
              },
              body: {
                AuthParameters: {
                  USERNAME: credentials.username,
                  PASSWORD: credentials.password,
                  SECRET_HASH: secretHash,
                },
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: process.env.AWS_COGNITO_CLIENT_ID,
              },
            });
            
            // Handle specific Cognito error messages
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

          return {
            id: idTokenPayload.sub,
            name: idTokenPayload.name || idTokenPayload["cognito:username"],
            email: idTokenPayload.email,
            accessToken: data.AuthenticationResult.AccessToken,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  debug: true, // Enable debug mode to see more detailed logs
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
