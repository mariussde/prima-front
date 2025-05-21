import { NextResponse } from 'next/server'
import { makeApiRequest, getAuthUsername } from '@/lib/api-utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      COMPID: searchParams.get('COMPID') || 'PLL',
      pageNumber: searchParams.get('pageNumber') || '1',
      pageSize: searchParams.get('pageSize') || '300',
      CLNTID: searchParams.get('CLNTID') || '',
      CLNTDSC: searchParams.get('CLNTDSC') || '',
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
      CLBILL: searchParams.get('CLBILL') || '',
      CLEC1: searchParams.get('CLEC1') || '',
      CLEC2: searchParams.get('CLEC2') || '',
      CLEC3: searchParams.get('CLEC3') || '',
      CLEC4: searchParams.get('CLEC4') || '',
      CLEC5: searchParams.get('CLEC5') || '',
      CLEN1: searchParams.get('CLEN1') || '',
      CLEN2: searchParams.get('CLEN2') || '',
      CLEN3: searchParams.get('CLEN3') || '',
      CLEN4: searchParams.get('CLEN4') || '',
      CLEN5: searchParams.get('CLEN5') || '',
      CNTYCOD: searchParams.get('CNTYCOD') || '',
      STAID: searchParams.get('STAID') || '',
      SortField: searchParams.get('sortColumn') || '',
      SortDirection: searchParams.get('sortDirection') || ''
    }

    return makeApiRequest('client', 'GET', {
      params,
      errorMessage: 'Failed to fetch clients data'
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

    return makeApiRequest('client', 'POST', {
      body: {
        ...body,
        CRTUSR: username
      },
      errorMessage: 'Failed to create client'
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

    return makeApiRequest('client', 'PUT', {
      body: {
        ...body,
        CHGUSR: username
      },
      errorMessage: 'Failed to update client'
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
    const clntid = searchParams.get('CLNTID')

    if (!compid || !clntid) {
      return NextResponse.json(
        { error: 'Missing required parameters: COMPID and CLNTID' },
        { status: 400 }
      )
    }

    return makeApiRequest('client', 'DELETE', {
      params: { COMPID: compid, CLNTID: clntid },
      errorMessage: 'Failed to delete client'
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
