import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

// GET: جلب جميع التصويتات للإدارة
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    // جلب جميع التصويتات
    const votes = await db.integrityVote.findMany({
      include: {
        voter: {
          select: { id: true, name: true, email: true, image: true }
        },
        target: {
          select: { id: true, name: true, email: true, image: true, integrityScore: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // إحصائيات
    const totalVotes = votes.length
    const activeVotes = votes.filter(v => v.status === 'ACTIVE').length
    const disputedVotes = votes.filter(v => v.status === 'DISPUTED').length

    return NextResponse.json({ 
      votes, 
      stats: {
        total: totalVotes,
        positive: votes.filter(v => v.overallScore >= 4).length,
        negative: votes.filter(v => v.overallScore < 3).length,
        disputed: disputedVotes
      }
    })
  } catch (error) {
    console.error('Error fetching admin votes:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب التصويتات' }, { status: 500 })
  }
}

// PATCH: إجراء على تصويت (إزالة أو تحديد للنزاع)
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await request.json()
    const { voteId, action } = body

    if (!voteId || !action) {
      return NextResponse.json({ error: 'معرف التصويت والإجراء مطلوبان' }, { status: 400 })
    }

    const vote = await db.integrityVote.findUnique({
      where: { id: voteId },
      include: { target: true }
    })

    if (!vote) {
      return NextResponse.json({ error: 'التصويت غير موجود' }, { status: 404 })
    }

    if (action === 'remove') {
      const avgScore = (vote.honestyScore + vote.commitmentScore + vote.qualityScore + vote.cooperationScore + vote.overallScore) / 5
      const integrityImpact = Math.round((avgScore - 3) * 5) * -1

      await db.integrityVote.update({
        where: { id: voteId },
        data: { status: 'REMOVED' }
      })

      await db.user.update({
        where: { id: vote.targetId },
        data: {
          integrityScore: { increment: integrityImpact },
          totalVotes: { decrement: 1 }
        }
      })

      return NextResponse.json({ 
        success: true, 
        message: 'تم إزالة التصويت وإعادة حساب النزاهة',
        integrityImpact 
      })
    } else if (action === 'dispute') {
      await db.integrityVote.update({
        where: { id: voteId },
        data: { status: 'DISPUTED' }
      })

      await db.notification.create({
        data: {
          type: 'SYSTEM',
          title: 'تصويت محل نزاع',
          message: `تم تحديد تصويت على نزاهتك للمراجعة`,
          userId: vote.targetId
        }
      })

      return NextResponse.json({ 
        success: true, 
        message: 'تم تحديد التصويت للنزاع' 
      })
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 })
  } catch (error) {
    console.error('Error updating vote:', error)
    return NextResponse.json({ error: 'حدث خطأ في تحديث التصويت' }, { status: 500 })
  }
}
