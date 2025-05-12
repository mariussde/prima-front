import { NextResponse } from 'next/server'
import { makeApiRequest, getAuthUsername } from '@/lib/api-utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      COMPID: searchParams.get('COMPID') || 'PLL',
      pageNumber: searchParams.get('pageNumber') || '1',
      pageSize: searchParams.get('pageSize') || '300',
      CARID: searchParams.get('CARID') || '',
      FilterId: searchParams.get('FilterId') || '',
      FilterName: searchParams.get('FilterName') || ''
    }

    return makeApiRequest('carrier', 'GET', {
      params,
      errorMessage: 'Failed to fetch carrier data'
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const username = await getAuthUsername()
    const body = await request.json()

    return makeApiRequest('carrier', 'POST', {
      body: {
        ...body,
        CRTUSR: username
      },
      errorMessage: 'Failed to create carrier'
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const username = await getAuthUsername()
    const body = await request.json()

    return makeApiRequest('carrier', 'PUT', {
      body: {
        ...body,
        CHGUSR: username
      },
      errorMessage: 'Failed to update carrier'
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

    return makeApiRequest('carrier', 'DELETE', {
      params: { COMPID: compid, CARID: carid },
      errorMessage: 'Failed to delete carrier'
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(null, { status: 204 })
} 
