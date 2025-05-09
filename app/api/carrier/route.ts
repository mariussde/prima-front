import { NextResponse } from 'next/server'
import https from 'https'
import fetch from 'node-fetch'
import settingsConfig from '@/lib/settings_config.json'

const API_BASE_URL = 'https://nfeij1whc8.execute-api.us-east-1.amazonaws.com/dev/primaapi/v1/data'
const TEMP_TOKEN = 'eyJraWQiOiJkamNHZXhsb29uTHBGVnczR1ZrUTRXM2F1RGpOYUxmTGFtc0hUY1JYaHNFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkNGQ4MjRiOC03MDQxLTcwM2MtZDAzMi1lNzExN2Y3ODdmZTgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9LWU1ib21kYWIiLCJjbGllbnRfaWQiOiI3dGx2cXJzNDdnZ2cwcDRycTNycWs0cHEycyIsIm9yaWdpbl9qdGkiOiJlOWIxZGYzOS04M2M3LTQyMDQtOTAzYS03MGE5NWI1MWI1MDAiLCJldmVudF9pZCI6IjM4M2RiMjJkLTc2NDgtNDQ4Ni05Y2EzLTdhNzVhNGU2MmNhOSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NDY4MDEyNTYsImV4cCI6MTc0NjgwNDg1NiwiaWF0IjoxNzQ2ODAxMjU2LCJqdGkiOiIyOGVlZWY3NS1kN2NiLTQzMjUtYjZiZC0zOTVmMDgwMGRmMjIiLCJ1c2VybmFtZSI6Im1pa2ViIn0.Zptyq1fN9UPGS8lC-P1g3R9GKizouPv8D0jFWsIfoFsnv5BWzXoMQ_otT4n0LEvpeVfM7RylioAd8iSz2JBvPCoabuv5X5UpYGCgMcpxm3Zk-pTVYJVtisLSjyxWfvb4gMu3wUfA0OtansBV-lW-wzftCQyifG2gV_Yw1xaw9N1icILV3pU4DAP9iTqyBCBKaJIZ4sswAxGaTRIzpKBZUgFq-WEBo6nHmbz2MWM5JPp-FeCkqGpyj_wyJrBJrQ4IOfqub8iF8E1Rosv1HIXkDTuoz3ABKeN6KSiYauLnYuOKb5Zxwp3zy3DnsgaPqXOevTzdd6WcNoXoBTd8m1Tvvw'

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const compid = searchParams.get('COMPID') || 'PLL'
    const pageNumber = searchParams.get('pageNumber') || '1'
    const pageSize = searchParams.get('pageSize') || '300'
    const carid = searchParams.get('CARID') || ''
    const filterId = searchParams.get('FilterId') || ''
    const filterName = searchParams.get('FilterName') || ''

    // Build URL exactly like Postman
    const url = `${API_BASE_URL}/carrier?COMPID=${compid}&pageNumber=${pageNumber}&pageSize=${pageSize}&CARID=${carid}&FilterId=${filterId}&FilterName=${filterName}`
    
    console.log('Making request to:', url)
    console.log('With headers:', { token: TEMP_TOKEN })

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': TEMP_TOKEN
      },
      agent: createHttpsAgent()
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error Response:', errorText)
      return NextResponse.json(
        { error: 'Failed to fetch carrier data', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Response data:', data)

    return addCorsHeaders(NextResponse.json(data))
  } catch (error) {
    console.error('Detailed error:', error)
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const requiredParams = settingsConfig.carrier.create.params
    const missingParams = requiredParams.filter(param => !body[param])

    if (missingParams.length > 0) {
      return NextResponse.json(
        { error: `Missing required parameters: ${missingParams.join(', ')}` },
        { status: 400 }
      )
    }

    const url = `${API_BASE_URL}/carrier`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: TEMP_TOKEN,
      },
      body: JSON.stringify(body),
      agent: createHttpsAgent()
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error Response:', errorText)
      return NextResponse.json(
        { error: 'Failed to create carrier' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return addCorsHeaders(NextResponse.json(data))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const requiredParams = settingsConfig.carrier.update.params
    const missingParams = requiredParams.filter(param => !body[param])

    if (missingParams.length > 0) {
      return NextResponse.json(
        { error: `Missing required parameters: ${missingParams.join(', ')}` },
        { status: 400 }
      )
    }

    const url = `${API_BASE_URL}/carrier`
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: TEMP_TOKEN,
      },
      body: JSON.stringify(body),
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
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const compid = searchParams.get('COMPID')
    const carid = searchParams.get('CARID')

    if (!compid || !carid) {
      return NextResponse.json(
        { error: 'Missing required parameters: COMPID and CARID' },
        { status: 400 }
      )
    }

    const url = `${API_BASE_URL}/carrier?COMPID=${compid}&CARID=${carid}`
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        token: TEMP_TOKEN,
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
  } catch (error) {
    return handleApiError(error)
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }))
} 
