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
        token: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJRazhObGRRT2pwRE1jQkJKazUzV2wwanFuemNmWTNickJTUi1hMXJXNXRBIn0.eyJqdGkiOiJmN2YwYWJmZi03MDkyLTQ5ZjQtODE3ZC1jMDdkYjI2Y2ViOWUiLCJleHAiOjE3NDM3NzM4NDksIm5iZiI6MCwiaWF0IjoxNzQzNzczNTQ5LCJpc3MiOiJodHRwczovL2F1dGgucGFjb3JpbmkuY29tL2F1dGgvcmVhbG1zL1BhY29yaW5pIiwiYXVkIjoicGFjb3JpbmktYXBpIiwic3ViIjoiODBhNzZiZWUtOTNlMS00OTExLWIyMDMtODY5ZTI5YTliNTk5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicGFjb3JpbmktYXBpIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiMmU1YWEyZGEtNGYwZS00MDYyLTljYzUtZmI2OWE0NTg2ODg0IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZnVsbC1hY2Nlc3MiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJwcmltYSBwcmltYSIsInByZWZlcnJlZF91c2VybmFtZSI6InByaW1hIiwiZ2l2ZW5fbmFtZSI6InByaW1hIiwiZmFtaWx5X25hbWUiOiJwcmltYSIsImVtYWlsIjoicHJpbWFzdXBwb3J0QHBhY29yaW5pLmNvbSJ9.WWlqzosQeUv_HFin9YFQ6n4QJCrr-u4YOZCIaw8iKFIpKYUBSLXJUv0uipRvIaStpwLGTCA0wetbh1gJq8or23S6SCGSgzjfDYTxA1wT2aUU-EZrc-4VBoWjbKyGrg6xksDPQCZwv41SLefO04XyB_uwLlxHTmJIpgsbOpq4KJPqrbMLrAc6fwPpJwExQjYiA8IPQS_z2NoD2wlexpr4vF7eWvUticYI60tW4xl_nN8IB7JqqbnXYrSnKg8mNM4EbcdSdTePCKXv6aVtzs431rH_7nVj5aMI8hVkna7VcZDGk0owRYkkN7g5NKhlAR6gwWg2-5Qfvn58ixBwtqTflw',
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
