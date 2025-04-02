'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function SessionInfoPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchSessionInfo()
    }
  }, [status, router])

  const fetchSessionInfo = async () => {
    try {
      const response = await fetch('/api/session-info')
      if (!response.ok) {
        throw new Error('Failed to fetch session info')
      }
      const data = await response.json()
      setSessionInfo(data)
    } catch (error) {
      setError('Failed to load session information')
      console.error('Error fetching session info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Format JSON to respect container width and wrap long lines
  const formatJsonWithWordBreak = (obj: any) => {
    if (!obj) return ''
    return JSON.stringify(obj, null, 2)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading session information...</span>
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
            <Button 
              onClick={fetchSessionInfo}
              className="mt-4"
            >
              Retry
            </Button>
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
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">User Information</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-all">
                  {formatJsonWithWordBreak(sessionInfo?.user)}
                </pre>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Token Information</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-all">
                  {formatJsonWithWordBreak({
                    accessToken: sessionInfo?.accessToken,
                    refreshToken: sessionInfo?.refreshToken,
                    expiresIn: sessionInfo?.expiresIn,
                    expires: sessionInfo?.expires,
                  })}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
