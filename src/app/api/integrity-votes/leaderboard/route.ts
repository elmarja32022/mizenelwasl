import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET: لوحة المتصدرين للنزاهة
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // الحصول على أعلى المستخدمين نزاهة
    const users = await prisma.user.findMany({
      where: {
        isSuspended: false,
        totalVotes: { gte: 1 } // يجب أن يكون لديه تصويت واحد على الأقل
      },
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
    return NextResponse.json({ error: 'حدث خطأ في جلب لوحة المتصدرين' }, { status: 500 })
  }
}
