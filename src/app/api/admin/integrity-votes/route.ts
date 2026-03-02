import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

import { IntegrityVoteStatus } from '@prisma/client'

import { VoteStats } from '@/types/integrity'

// GET: جلب جميع التصويتات للإدارة
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as IntegrityVoteStatus | null
    const skip = (page - 1) * limit

    // جلب جميع التصويتات
    const votes = await prisma.integrityVote.findMany({
      where: status ? { status } : undefined,
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
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    // إحصائيات
    const totalVotes = await prisma.integrityVote.count()
    const activeVotes = await prisma.integrityVote.count({ where: { status: 'ACTIVE' } })
    const disputedVotes = await prisma.integrityVote.count({ where: { status: 'DISPUTED' } })
    const removedVotes = await prisma.integrityVote.count({ where: { status: 'REMOVED' } })

    // متوسط التقييمات
    const avgScores = await prisma.integrityVote.aggregate({
      where: { status: 'ACTIVE' },
      _avg: {
        honestyScore: true,
        commitmentScore: true,
        qualityScore: true,
        cooperationScore: true,
        overallScore: true
      }
    })
    
    const stats: VoteStats = {
      total: totalVotes,
      active: activeVotes,
      disputed: disputedVotes,
      removed: removedVotes,
      avgScores: {
        honesty: avgScores._avg.honestyScore || 0,
        commitment: avgScores._avg.commitmentScore || 0,
        quality: avgScores._avg.qualityScore || 0,
        cooperation: avgScores._avg.cooperationScore || 0,
        overall: avgScores._avg.overallScore || 0
      }
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
    const user = await getCurrentUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await request.json()
    const { voteId, action } = body

    if (!voteId || !action) {
      return NextResponse.json({ error: 'معرف التصويت والإجراء مطلوبان' }, { status: 400 })
    }

    const vote = await prisma.integrityVote.findUnique({
      where: { id: voteId },
      include: { target: true }
    })

    if (!vote) {
      return NextResponse.json({ error: 'التصويت غير موجود' }, { status: 404 })
    }

    if (action === 'remove') {
      // عكس التأثير على النزاهة
      const avgScore = (vote.honestyScore + vote.commitmentScore + vote.qualityScore + vote.cooperationScore + vote.overallScore) / 5
      const integrityImpact = Math.round((avgScore - 3) * 5) * -1
      
      // إزالة التصويت
      await prisma.integrityVote.update({
        where: { id: voteId },
        data: { status: 'REMOVED' }
      })
      
      // تحديث رصيد النزاهة للمستخدم المستهدف
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
      
      // إرسال إشعار للمستخدم المستهدف
      await prisma.notification.create({
        data: {
          type: 'SYSTEM',
          title: 'تصويت محلنزاع',
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
