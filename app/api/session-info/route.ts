import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authConfig } from "@/lib/auth/config"

export async function GET() {
  const session = await getServerSession(authConfig)

  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    )
  }

  return NextResponse.json({
    user: session.user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    expires: session.expires,
  })
} 
