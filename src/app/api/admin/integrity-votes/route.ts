import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET: جلب جميع التصويتات للإدارة
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    // جلب جميع التصويتات
    const votes = await prisma.integrityVote.findMany({
      include: {
        voter: {
          select: { id: true, name: true, email: true, image: true }
        },
        target: {
          select: { id: true, name: true, email: true, image: true, integrityScore: true }
        },
        exchange: {
          select: { id: true, type: true, timeAmount: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // إحصائيات
    const stats = {
      total: votes.length,
      positive: votes.filter(v => v.overallScore >= 4).length,
      negative: votes.filter(v => v.overallScore < 3).length,
      disputed: votes.filter(v => v.status === 'DISPUTED').length
    }

    return NextResponse.json({ votes, stats })
  } catch (error) {
    console.error('Error fetching admin votes:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب التصويتات' }, { status: 500 })
  }
}

// PATCH: إجراء على تصويت (إزالة أو تحديد للنزاع)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await request.json()
    const { voteId, action } = body

    if (!voteId || !action) {
      return NextResponse.json({ error: 'معرف التصويت والإجراء مطلوبان' }, { status: 400 })
    }

    // جلب التصويت
    const vote = await prisma.integrityVote.findUnique({
      where: { id: voteId },
      include: { target: true }
    })

    if (!vote) {
      return NextResponse.json({ error: 'التصويت غير موجود' }, { status: 404 })
    }

    if (action === 'remove') {
      // حساب التأثير العكسي على النزاهة
      const avgScore = (vote.honestyScore + vote.commitmentScore + vote.qualityScore + vote.cooperationScore + vote.overallScore) / 5
      const integrityImpact = Math.round((avgScore - 3) * 5) * -1 // عكس التأثير

      // إزالة التصويت
      await prisma.integrityVote.delete({
        where: { id: voteId }
      })

      // تحديث رصيد النزاهة
      await prisma.user.update({
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
      // تحديد التصويت للنزاع
      await prisma.integrityVote.update({
        where: { id: voteId },
        data: { status: 'DISPUTED' }
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
