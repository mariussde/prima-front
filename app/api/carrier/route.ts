import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import https from 'https'
import fetch from 'node-fetch'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const carrierUrl = 'https://us.prima.pacorini.com/api/v1.0/BackendTest/Flask_Carrier?page_number=1&page_size=100&carID&carDsc'
    
    // Create an HTTPS agent that ignores SSL verification
    const agent = new https.Agent({
      rejectUnauthorized: false
    })

    const response = await fetch(carrierUrl, {
      headers: {
        token: session.accessToken,
      },
      agent
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error Response:', errorText)
      return NextResponse.json(
        { error: 'Failed to fetch carrier data' },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Create a new response with CORS headers
    const corsResponse = NextResponse.json(data)
    corsResponse.headers.set('Access-Control-Allow-Origin', '*')
    corsResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    corsResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return corsResponse
  } catch (error) {
    console.error('Error in carrier API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
