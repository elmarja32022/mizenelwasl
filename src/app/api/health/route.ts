import { NextResponse } from 'next/server'

// Health check endpoint - minimal for quick response
export async function GET() {
  const startTime = Date.now()
  
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      isVercel: process.env.VERCEL === '1',
      region: process.env.VERCEL_REGION || 'local',
      responseTime: `${Date.now() - startTime}ms`
    }
    
    const response = NextResponse.json(health)
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${Date.now() - startTime}ms`
    }, { status: 500 })
  }
}
