import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || user.id

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
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
      }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    const votes = await prisma.integrityVote.findMany({
      where: { targetId: userId, status: 'ACTIVE' },
      select: {
        honestyScore: true,
        commitmentScore: true,
        qualityScore: true,
        cooperationScore: true,
        overallScore: true
      }
    })

    let totalVotes = votes.length
    let avgHonesty = 0, avgCommitment = 0, avgQuality = 0, avgCooperation = 0, avgOverall = 0
    if (totalVotes > 0) {
      votes.forEach(v => {
        avgHonesty += v.honestyScore
        avgCommitment += v.commitmentScore
        avgQuality += v.qualityScore
        avgCooperation += v.cooperationScore
        avgOverall += v.overallScore
      })
      avgHonesty = Math.round((avgHonesty / totalVotes) * 10) / 10
      avgCommitment = Math.round((avgCommitment / totalVotes) * 10) / 10
      avgQuality = Math.round((avgQuality / totalVotes) * 10) / 10
      avgCooperation = Math.round((avgCooperation / totalVotes) * 10) / 10
      avgOverall = Math.round((avgOverall / totalVotes) * 10) / 10
    }

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    votes.forEach(v => { distribution[v.overallScore] = (distribution[v.overallScore] || 0) + 1 })

    const categories = [
      { name: 'الصدق والأمانة', score: avgHonesty, color: 'blue' },
      { name: 'الالتزام بالمواعيد', score: avgCommitment, color: 'amber' },
      { name: 'جودة العمل', score: avgQuality, color: 'purple' },
      { name: 'روح التعاون', score: avgCooperation, color: 'rose' }
    ]

    return NextResponse.json({
      user: targetUser,
      stats: {
        totalVotes,
        avgOverall,
        distribution: Object.entries(distribution).map(([score, count]) => ({ score: parseInt(score), count })),
        categories
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
