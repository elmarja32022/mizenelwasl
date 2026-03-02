import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// التصويت على مستخدم (تأثير على النزاهة)
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_user_id')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const body = await request.json()
    const { targetId, type } = body // type: POSITIVE | NEGATIVE

    if (!targetId || !type) {
      return NextResponse.json({ error: 'بيانات غير كاملة' }, { status: 400 })
    }

    if (targetId === sessionId) {
      return NextResponse.json({ error: 'لا يمكنك التصويت على نفسك' }, { status: 400 })
    }

    // التحقق من التصويت السابق
    const existingVote = await db.userVote.findFirst({
      where: { targetId, userId: sessionId }
    })

    if (existingVote) {
      return NextResponse.json({ error: 'سبق وصوّت على هذا المستخدم' }, { status: 400 })
    }

    // إنشاء التصويت
    await db.userVote.create({
      data: {
        type,
        targetId,
        userId: sessionId
      }
    })

    // تحديث رصيد النزاهة
    const user = await db.user.findUnique({ where: { id: targetId } })
    if (user) {
      const change = type === 'POSITIVE' ? 2 : -5
      const newScore = Math.max(0, Math.min(100, user.integrityScore + change))
      
      // تحديد مستوى الثقة
      let trustLevel = 'موثوق'
      if (newScore >= 90) trustLevel = 'مميز'
      else if (newScore >= 70) trustLevel = 'موثوق جداً'
      else if (newScore >= 50) trustLevel = 'موثوق'
      else if (newScore >= 30) trustLevel = 'محذر'
      else trustLevel = 'مجمد'

      await db.user.update({
        where: { id: targetId },
        data: { integrityScore: newScore, trustLevel }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Integrity vote error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// GET - جلب تقييمات النزاهة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
    }

    const votes = await db.userVote.findMany({
      where: { targetId: userId },
      include: {
        user: { select: { id: true, name: true, trustLevel: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { integrityScore: true, trustLevel: true, totalExchanges: true, rating: true }
    })

    return NextResponse.json({ votes, user })
  } catch (error) {
    console.error('Get integrity error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
