import { NextResponse } from 'next/server'
import https from 'https'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import fetch from 'node-fetch'

// Helper function to create HTTPS agent
export const createHttpsAgent = () => new https.Agent({
  rejectUnauthorized: false
})

// Helper function to add CORS headers
export const addCorsHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  console.error('API Error:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

// Helper function to get authenticated user token
export const getAuthToken = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    throw new Error('Unauthorized')
  }
  return session.accessToken
}

// Helper function to get authenticated username
export const getAuthUsername = async () => {
  const session = await getServerSession(authOptions)
  return session?.user?.username || ''
}

// Helper function to make API requests with automatic retry on token expiration
export const makeApiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  options: {
    params?: Record<string, string>
    body?: any
    errorMessage?: string
    retryCount?: number
  } = {}
) => {
  const maxRetries = options.retryCount || 1
  let currentRetry = 0

  while (currentRetry <= maxRetries) {
    try {
      const token = await getAuthToken()
      const baseUrl = process.env.API_BASE_URL

      // Build query string from params
      const queryString = options.params
        ? '?' + new URLSearchParams(options.params).toString()
        : ''

      const url = `${baseUrl}/${endpoint}${queryString}`
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        agent: createHttpsAgent()
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }

        // Check if token has expired
        if (errorData.message?.includes('token has expired') && currentRetry < maxRetries) {
          // Force a session refresh by throwing an error
          throw new Error('TokenExpired')
        }

        console.error('Error Response:', errorText)
        return NextResponse.json(
          { error: options.errorMessage || 'Failed to process request', details: errorText },
          { status: response.status }
        )
      }

      const data = await response.json()
      return addCorsHeaders(NextResponse.json(data))
    } catch (error: any) {
      if (error.message === 'TokenExpired' && currentRetry < maxRetries) {
        currentRetry++
        // Wait a bit before retrying to allow token refresh
        await new Promise(resolve => setTimeout(resolve, 1000))
        continue
      }
      
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      
      return NextResponse.json(
        { error: options.errorMessage || 'Failed to process request', details: error.message },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: 'Failed to process request after retries' },
    { status: 500 }
  )
} 
