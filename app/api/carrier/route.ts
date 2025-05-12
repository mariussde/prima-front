import { NextResponse } from 'next/server'
import https from 'https'
import fetch from 'node-fetch'
import settingsConfig from '@/lib/settings_config.json'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const API_BASE_URL = 'https://nfeij1whc8.execute-api.us-east-1.amazonaws.com/dev/primaapi/v1/data'

// Helper function to create HTTPS agent
const createHttpsAgent = () => new https.Agent({
  rejectUnauthorized: false
})

// Helper function to add CORS headers
const addCorsHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

// Helper function to validate required parameters
const validateRequiredParams = (params: any, requiredParams: string[]) => {
  const missingParams = requiredParams.filter(param => !params[param])
  if (missingParams.length > 0) {
    throw new Error(`Missing required parameters: ${missingParams.join(', ')}`)
  }
}

// Helper function to get authenticated user token
const getAuthToken = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    throw new Error('Unauthorized')
  }
  return session.accessToken
}

export async function GET(request: Request) {
  try {
    const token = await getAuthToken()
    const { searchParams } = new URL(request.url)
    const compid = searchParams.get('COMPID') || 'PLL'
    const pageNumber = searchParams.get('pageNumber') || '1'
    const pageSize = searchParams.get('pageSize') || '300'
    const carid = searchParams.get('CARID') || ''
    const filterId = searchParams.get('FilterId') || ''
    const filterName = searchParams.get('FilterName') || ''

    const url = `${API_BASE_URL}/carrier?COMPID=${compid}&pageNumber=${pageNumber}&pageSize=${pageSize}&CARID=${carid}&FilterId=${filterId}&FilterName=${filterName}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      agent: createHttpsAgent()
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error Response:', errorText)
      return NextResponse.json(
        { error: 'Failed to fetch carrier data', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return addCorsHeaders(NextResponse.json(data))
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAuthToken()
    const body = await request.json()
    const session = await getServerSession(authOptions)
    const username = session?.user?.name || ''

    //validateRequiredParams(body, settingsConfig.carrier.create.params)

    const url = `${API_BASE_URL}/carrier`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        ...body,
        CRTUSR: username // Set the creator user to the logged-in user
      }),
      agent: createHttpsAgent()
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error Response:', errorText)
      return NextResponse.json(
        { error: 'Failed to create carrier', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return addCorsHeaders(NextResponse.json(data))
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message.startsWith('Missing required parameters')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return handleApiError(error)
  }
}

export async function PUT(request: Request) {
  try {
    const token = await getAuthToken()
    const body = await request.json()
    const session = await getServerSession(authOptions)
    const username = session?.user?.name || ''

    //validateRequiredParams(body, settingsConfig.carrier.update.params)

    const url = `${API_BASE_URL}/carrier`
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        ...body,
        CHGUSR: username // Set the change user to the logged-in user
      }),
      agent: createHttpsAgent()
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error Response:', errorText)
      return NextResponse.json(
        { error: 'Failed to update carrier' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return addCorsHeaders(NextResponse.json(data))
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message.startsWith('Missing required parameters')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return handleApiError(error)
  }
}

export async function DELETE(request: Request) {
  try {
    const token = await getAuthToken()
    const { searchParams } = new URL(request.url)
    const compid = searchParams.get('COMPID')
    const carid = searchParams.get('CARID')

    //validateRequiredParams({ COMPID: compid, CARID: carid }, settingsConfig.carrier.delete.params)

    const url = `${API_BASE_URL}/carrier?COMPID=${compid}&CARID=${carid}`
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        token: token,
      },
      agent: createHttpsAgent()
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error Response:', errorText)
      return NextResponse.json(
        { error: 'Failed to delete carrier' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return addCorsHeaders(NextResponse.json(data))
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message.startsWith('Missing required parameters')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return handleApiError(error)
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }))
} 
