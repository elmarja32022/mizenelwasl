import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - جلب رسائل محادثة معينة
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const sessionId = request.cookies.get('session_user_id')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const { conversationId } = await params

    // التحقق من أن المستخدم جزء من هذه المحادثة
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: { select: { id: true, name: true, city: true, country: true, trustLevel: true } },
        user2: { select: { id: true, name: true, city: true, country: true, trustLevel: true } }
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'المحادثة غير موجودة' }, { status: 404 })
    }

    if (conversation.user1Id !== sessionId && conversation.user2Id !== sessionId) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 })
    }

    // جلب الرسائل
    const messages = await db.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'asc' }
    })

    // تحديد المستخدم الآخر
    const otherUser = conversation.user1Id === sessionId ? conversation.user2 : conversation.user1

    // تحديث الرسائل غير المقروءة كمقروءة
    await db.message.updateMany({
      where: {
        conversationId,
        receiverId: sessionId,
        read: false
      },
      data: { read: true }
    })

    return NextResponse.json({
      conversation,
      messages,
      otherUser
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
