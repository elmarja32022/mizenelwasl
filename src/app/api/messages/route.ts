import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - جلب المحادثات
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    // جلب كل المحادثات التي يشارك فيها المستخدم
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { user1Id: sessionId },
          { user2Id: sessionId }
        ]
      },
      include: {
        user1: {
          select: { id: true, name: true, city: true, country: true, trustLevel: true, integrityScore: true }
        },
        user2: {
          select: { id: true, name: true, city: true, country: true, trustLevel: true, integrityScore: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    // تحويل البيانات لعرض الطرف الآخر فقط
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.user1Id === sessionId ? conv.user2 : conv.user1
      const unreadCount = 0 // يمكن إضافة حساب الرسائل غير المقروءة لاحقاً
      
      return {
        id: conv.id,
        otherUser,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount
      }
    })

    return NextResponse.json({ conversations: formattedConversations })
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// POST - بدء محادثة جديدة أو إرسال رسالة
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const body = await request.json()
    const { receiverId, content } = body

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'بيانات غير كاملة' }, { status: 400 })
    }

    // التحقق من وجود المستقبل
    const receiver = await db.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // ترتيب المعرفات لضمان عدم تكرار المحادثات
    const [user1Id, user2Id] = [sessionId, receiverId].sort()

    // البحث عن محادثة موجودة أو إنشاء جديدة
    let conversation = await db.conversation.findUnique({
      where: {
        user1Id_user2Id: { user1Id, user2Id }
      }
    })

    if (!conversation) {
      conversation = await db.conversation.create({
        data: { user1Id, user2Id }
      })
    }

    // إنشاء الرسالة
    const message = await db.message.create({
      data: {
        content,
        senderId: sessionId,
        receiverId,
        conversationId: conversation.id
      },
      include: {
        sender: {
          select: { id: true, name: true }
        }
      }
    })

    // تحديث آخر رسالة في المحادثة
    await db.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: content,
        lastMessageAt: new Date()
      }
    })

    // إنشاء إشعار للمستقبل
    const sender = await db.user.findUnique({
      where: { id: sessionId }
    })

    await db.notification.create({
      data: {
        type: 'MESSAGE',
        title: 'رسالة جديدة',
        message: `${sender?.name} أرسل لك رسالة`,
        userId: receiverId
      }
    })

    return NextResponse.json({ success: true, message, conversation })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
