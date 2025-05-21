import { NextResponse } from 'next/server'
import { makeApiRequest, getAuthUsername } from '@/lib/api-utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      COMPID: searchParams.get('COMPID') || 'PLL',
      pageNumber: searchParams.get('pageNumber') || '1',
      pageSize: searchParams.get('pageSize') || '100',
      GetOne_CarId: searchParams.get('GetOne_CarId') || '',
      CARID: searchParams.get('CARID') || '',
      CARDSC: searchParams.get('CARDSC') || '',
      ADDRL1: searchParams.get('ADDRL1') || '',
      ADDRL2: searchParams.get('ADDRL2') || '',
      City: searchParams.get('City') || '',
      ZIPCODE: searchParams.get('ZIPCODE') || '',
      Phone: searchParams.get('Phone') || '',
      Fax: searchParams.get('Fax') || '',
      eMail: searchParams.get('eMail') || '',
      WebSite: searchParams.get('WebSite') || '',
      CONNME: searchParams.get('CONNME') || '',
      CNTYCOD: searchParams.get('CNTYCOD') || '',
      STAID: searchParams.get('STAID') || '',
      SortField: searchParams.get('sortColumn') || '',
      SortDirection: searchParams.get('sortDirection') || ''
    }

    return makeApiRequest('carrier', 'GET', {
      params,
      errorMessage: 'Failed to fetch carriers data'
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
