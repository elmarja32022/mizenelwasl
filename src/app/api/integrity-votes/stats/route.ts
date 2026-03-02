import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET: إحصائيات التصويت لمستخدم محدد
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id

    // الحصول على المستخدم مع معلومات التصويت
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        integrityScore: true,
        totalVotes: true,
        rating: true,
        trustLevel: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // إحصائيات التصويت التفصيلية
    const voteStats = await prisma.integrityVote.aggregate({
      where: {
        targetId: userId,
        status: 'ACTIVE'
      },
      _count: true,
      _avg: {
        honestyScore: true,
        commitmentScore: true,
        qualityScore: true,
        cooperationScore: true,
        overallScore: true
      }
    })

    // توزيع التقييمات
    const ratingDistribution = await prisma.integrityVote.groupBy({
      by: ['overallScore'],
      where: {
        targetId: userId,
        status: 'ACTIVE'
      },
      _count: true
    })

    // التصويتات الأخيرة
    const recentVotes = await prisma.integrityVote.findMany({
      where: {
        targetId: userId,
        status: 'ACTIVE',
        isAnonymous: false
      },
      include: {
        voter: {
          select: { id: true, name: true, image: true, city: true, country: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // حساب مستوى الثقة
    const avgScore = voteStats._avg.overallScore || 0
    const totalVotes = voteStats._count
    let trustLevel = 'موثوق'
    let trustColor = 'blue'

    if (totalVotes >= 10 && avgScore >= 4.5) {
      trustLevel = 'خليفة مميز'
      trustColor = 'emerald'
    } else if (totalVotes >= 5 && avgScore >= 4) {
      trustLevel = 'خليفة صادق'
      trustColor = 'teal'
    } else if (totalVotes >= 3 && avgScore >= 3.5) {
      trustLevel = 'خليفة موثوق'
      trustColor = 'blue'
    } else if (totalVotes >= 1 && avgScore < 3) {
      trustLevel = 'تحت المراقبة'
      trustColor = 'orange'
    }

    // تصنيفات النزاهة
    const categories = [
      {
        name: 'الصدق والأمانة',
        score: voteStats._avg.honestyScore || 0,
        icon: 'Shield',
        color: 'blue'
      },
      {
        name: 'الالتزام بالمواعيد',
        score: voteStats._avg.commitmentScore || 0,
        icon: 'Clock',
        color: 'amber'
      },
      {
        name: 'جودة العمل',
        score: voteStats._avg.qualityScore || 0,
        icon: 'Star',
        color: 'purple'
      },
      {
        name: 'روح التعاون',
        score: voteStats._avg.cooperationScore || 0,
        icon: 'Heart',
        color: 'rose'
      }
    ]

    return NextResponse.json({
      user: {
        ...user,
        trustLevel,
        trustColor
      },
      stats: {
        totalVotes,
        avgOverall: avgScore,
        ratingDistribution: ratingDistribution.map(r => ({
          score: r.overallScore,
          count: r._count
        })),
        categories
      },
      recentVotes
    })
  } catch (error) {
    console.error('Error fetching voting stats:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب الإحصائيات' }, { status: 500 })
  }
}
