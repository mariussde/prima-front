'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SalesReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [carrierData, setCarrierData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchCarrierData()
    }
  }, [status, router])

  const fetchCarrierData = async () => {
    try {
      console.log('Fetching carrier data from our API...')
      
      const response = await fetch('/api/carrier')
      console.log('Response Status:', response.status)
      console.log('Response Headers:', response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error Response:', errorText)
        throw new Error(`Failed to fetch carrier data: ${errorText}`)
      }

      const data = await response.json()
      console.log('Carrier Data:', data)
      setCarrierData(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load carrier data')
      console.error('Error fetching carrier data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatJsonWithWordBreak = (obj: any) => {
    if (!obj) return ''
    return JSON.stringify(obj, null, 2)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading carrier data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[600px]">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchCarrierData}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Carrier Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-all">
              {formatJsonWithWordBreak(carrierData)}
            </pre>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 
