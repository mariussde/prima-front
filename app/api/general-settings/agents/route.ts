import { NextResponse } from 'next/server'
import { makeApiRequest, getAuthUsername } from '@/lib/api-utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      COMPID: searchParams.get('COMPID') || 'PLL',
      pageNumber: searchParams.get('pageNumber') || '1',
      pageSize: searchParams.get('pageSize') || '300',
      AGNTID: searchParams.get('AGNTID') || '',
      AGNTDSC: searchParams.get('AGNTDSC') || '',
      ADDRL1: searchParams.get('ADDRL1') || '',
      ADDRL2: searchParams.get('ADDRL2') || '',
      City: searchParams.get('City') || '',
      ZIPCODE: searchParams.get('ZIPCODE') || '',
      Phone: searchParams.get('Phone') || '',
      Fax: searchParams.get('Fax') || '',
      eMail: searchParams.get('eMail') || '',
      WebSite: searchParams.get('WebSite') || '',
      FEDTXID: searchParams.get('FEDTXID') || '',
      STETXID: searchParams.get('STETXID') || '',
      CNTYCOD: searchParams.get('CNTYCOD') || '',
      STAID: searchParams.get('STAID') || '',
      SortField: searchParams.get('sortColumn') || '',
      SortDirection: searchParams.get('sortDirection') || ''
    }

    return makeApiRequest('agent', 'GET', {
      params,
      errorMessage: 'Failed to fetch agents data'
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

    return makeApiRequest('agent', 'POST', {
      body: {
        ...body,
        CRTUSR: username
      },
      errorMessage: 'Failed to create agent'
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

    return makeApiRequest('agent', 'PUT', {
      body: {
        ...body,
        CHGUSR: username
      },
      errorMessage: 'Failed to update agent'
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
    const agntid = searchParams.get('AGNTID')

    if (!compid || !agntid) {
      return NextResponse.json(
        { error: 'Missing required parameters: COMPID and AGNTID' },
        { status: 400 }
      )
    }

    return makeApiRequest('agent', 'DELETE', {
      params: { COMPID: compid, AGNTID: agntid },
      errorMessage: 'Failed to delete agent'
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
