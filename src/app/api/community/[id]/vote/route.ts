import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// التصويت على منشور
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionId = request.cookies.get('session')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { type } = body // POSITIVE | NEGATIVE

    if (!type || !['POSITIVE', 'NEGATIVE'].includes(type)) {
      return NextResponse.json({ error: 'نوع التصويت غير صالح' }, { status: 400 })
    }

    // التحقق من التصويت السابق
    const existingVote = await db.postVote.findFirst({
      where: { postId: id, userId: sessionId }
    })

    if (existingVote) {
      // تحديث التصويت
      const vote = await db.postVote.update({
        where: { id: existingVote.id },
        data: { type }
      })
      return NextResponse.json({ success: true, vote })
    }

    // إنشاء تصويت جديد
    const vote = await db.postVote.create({
      data: {
        type,
        postId: id,
        userId: sessionId
      }
    })

    return NextResponse.json({ success: true, vote })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
