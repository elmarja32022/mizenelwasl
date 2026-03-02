import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// إضافة تعليق
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
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: 'المحتوى مطلوب' }, { status: 400 })
    }

    const comment = await db.comment.create({
      data: {
        content,
        postId: id,
        userId: sessionId
      },
      include: {
        user: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
