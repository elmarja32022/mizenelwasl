import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

// GET: الحصول على التصويتات
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'received'
    const targetId = searchParams.get('targetId')

    if (type === 'given') {
      const votes = await db.integrityVote.findMany({
        where: { voterId: user.id },
        include: {
          target: { select: { id: true, name: true, image: true, city: true, country: true } }
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json({ votes })
    } else if (targetId) {
      const votes = await db.integrityVote.findMany({
        where: { targetId, status: 'ACTIVE' },
        include: {
          voter: { select: { id: true, name: true, image: true, city: true, country: true } }
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json({ votes })
    } else {
      const votes = await db.integrityVote.findMany({
        where: { targetId: user.id, status: 'ACTIVE' },
        include: {
          voter: { select: { id: true, name: true, image: true, city: true, country: true } }
        },
        orderBy: { createdAt: 'desc' }
      })

      const stats = await db.integrityVote.aggregate({
        where: { targetId: user.id, status: 'ACTIVE' },
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
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await request.json()
    const { targetId, honestyScore, commitmentScore, qualityScore, cooperationScore, overallScore, comment, isAnonymous } = body

    if (!targetId) {
      return NextResponse.json({ error: 'معرف المستخدم المستهدف مطلوب' }, { status: 400 })
    }

    if (targetId === user.id) {
      return NextResponse.json({ error: 'لا يمكنك التصويت لنفسك' }, { status: 400 })
    }

    const targetUser = await db.user.findUnique({ where: { id: targetId } })
    if (!targetUser) {
      return NextResponse.json({ error: 'المستخدم المستهدف غير موجود' }, { status: 404 })
    }

    const existingVote = await db.integrityVote.findUnique({
      where: { voterId_targetId: { voterId: user.id, targetId } }
    })
    if (existingVote) {
      return NextResponse.json({ error: 'سبق وقمت بالتصويت لهذا المستخدم' }, { status: 400 })
    }

    const avgScore = (honestyScore + commitmentScore + qualityScore + cooperationScore + overallScore) / 5
    const integrityImpact = Math.round((avgScore - 3) * 5)

    const vote = await db.integrityVote.create({
      data: {
        voterId: user.id,
        targetId,
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
        voter: { select: { id: true, name: true, image: true } },
        target: { select: { id: true, name: true, image: true } }
      }
    })

    await db.user.update({
      where: { id: targetId },
      data: {
        integrityScore: { increment: integrityImpact },
        totalVotes: { increment: 1 }
      }
    })

    if (!isAnonymous) {
      await db.notification.create({
        data: {
          type: 'RATING',
          title: 'تصويت جديد على نزاهتك',
          message: `قام ${vote.voter.name} بالتصويت على نزاهتك`,
          userId: targetId
        }
      })
    }

    return NextResponse.json({ success: true, vote, integrityImpact })
  } catch (error) {
    console.error('Error creating integrity vote:', error)
    return NextResponse.json({ error: 'حدث خطأ في إنشاء التصويت' }, { status: 500 })
  }
}
