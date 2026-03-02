import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET: الحصول على التصويتات
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'received' // received | given
    const targetId = searchParams.get('targetId') // معرف المستخدم المحدد

    if (type === 'given') {
      // التصويتات التي قدمها المستخدم
      const votes = await prisma.integrityVote.findMany({
        where: { voterId: session.user.id },
        include: {
          target: {
            select: { id: true, name: true, image: true, city: true, country: true }
          },
          exchange: {
            select: { id: true, type: true, timeAmount: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json({ votes })
    } else if (targetId) {
      // التصويتات لمستخدم محدد
      const votes = await prisma.integrityVote.findMany({
        where: { 
          targetId,
          status: 'ACTIVE'
        },
        include: {
          voter: {
            select: { id: true, name: true, image: true, city: true, country: true }
          },
          exchange: {
            select: { id: true, type: true, timeAmount: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json({ votes })
    } else {
      // التصويتات التي حصل عليها المستخدم الحالي
      const votes = await prisma.integrityVote.findMany({
        where: { 
          targetId: session.user.id,
          status: 'ACTIVE'
        },
        include: {
          voter: {
            select: { id: true, name: true, image: true, city: true, country: true }
          },
          exchange: {
            select: { id: true, type: true, timeAmount: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // إحصائيات التصويت
      const stats = await prisma.integrityVote.aggregate({
        where: { 
          targetId: session.user.id,
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

      return NextResponse.json({ 
        votes,
        stats: {
          totalVotes: stats._count,
          avgHonesty: stats._avg.honestyScore || 0,
          avgCommitment: stats._avg.commitmentScore || 0,
          avgQuality: stats._avg.qualityScore || 0,
          avgCooperation: stats._avg.cooperationScore || 0,
          avgOverall: stats._avg.overallScore || 0
        }
      })
    }
  } catch (error) {
    console.error('Error fetching integrity votes:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب التصويتات' }, { status: 500 })
  }
}

// POST: إنشاء تصويت جديد
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await request.json()
    const {
      targetId,
      exchangeId,
      honestyScore,
      commitmentScore,
      qualityScore,
      cooperationScore,
      overallScore,
      comment,
      isAnonymous
    } = body

    // التحقق من أن المستخدم لا يصوت لنفسه
    if (targetId === session.user.id) {
      return NextResponse.json({ error: 'لا يمكنك التصويت لنفسك' }, { status: 400 })
    }

    // التحقق من وجود المستخدم المستهدف
    const targetUser = await prisma.user.findUnique({
      where: { id: targetId }
    })
    if (!targetUser) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // التحقق من عدم وجود تصويت سابق
    const existingVote = await prisma.integrityVote.findUnique({
      where: {
        voterId_targetId: {
          voterId: session.user.id,
          targetId
        }
      }
    })

    if (existingVote) {
      return NextResponse.json({ error: 'سبق وقمت بالتصويت لهذا المستخدم' }, { status: 400 })
    }

    // حساب التأثير على رصيد النزاهة
    const avgScore = (honestyScore + commitmentScore + qualityScore + cooperationScore + overallScore) / 5
    const integrityImpact = Math.round((avgScore - 3) * 5) // -10 إلى +10 نقاط

    // إنشاء التصويت
    const vote = await prisma.integrityVote.create({
      data: {
        voterId: session.user.id,
        targetId,
        exchangeId: exchangeId || null,
        honestyScore: honestyScore || 5,
        commitmentScore: commitmentScore || 5,
        qualityScore: qualityScore || 5,
        cooperationScore: cooperationScore || 5,
        overallScore: overallScore || 5,
        comment: comment || null,
        isAnonymous: isAnonymous || false,
        status: 'ACTIVE'
      },
      include: {
        voter: {
          select: { id: true, name: true, image: true }
        },
        target: {
          select: { id: true, name: true, image: true }
        }
      }
    })

    // تحديث رصيد النزاهة للمستخدم المستهدف
    await prisma.user.update({
      where: { id: targetId },
      data: {
        integrityScore: {
          increment: integrityImpact
        },
        totalVotes: {
          increment: 1
        },
        rating: await calculateNewRating(targetId)
      }
    })

    // إرسال إشعار للمستخدم المستهدف
    if (!isAnonymous) {
      await prisma.notification.create({
        data: {
          type: 'RATING',
          title: 'تصويت جديد على نزاهتك',
          message: `قام ${vote.voter.name} بالتصويت على نزاهتك`,
          userId: targetId
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      vote,
      integrityImpact 
    })
  } catch (error) {
    console.error('Error creating integrity vote:', error)
    return NextResponse.json({ error: 'حدث خطأ في إنشاء التصويت' }, { status: 500 })
  }
}

// دالة لحساب التقييم الجديد
async function calculateNewRating(userId: string): Promise<number> {
  const votes = await prisma.integrityVote.findMany({
    where: { 
      targetId: userId,
      status: 'ACTIVE'
    },
    select: { overallScore: true }
  })

  if (votes.length === 0) return 0

  const sum = votes.reduce((acc, vote) => acc + vote.overallScore, 0)
  return Math.round((sum / votes.length) * 10) / 10
}
