import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const country = searchParams.get('country')
    const city = searchParams.get('city')

    const where: any = {
      isSuspended: false,
      totalVotes: { gte: 1 }
    }
    if (country) where.country = country
    if (city) where.city = city

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        image: true,
        city: true,
        country: true,
        integrityScore: true,
        trustLevel: true,
        totalVotes: true,
        rating: true,
        totalExchanges: true
      },
      orderBy: [
        { integrityScore: 'desc' },
        { totalVotes: 'desc' }
      ],
      take: limit
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
