import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// تحديث حالة التبادل
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionId = request.cookies.get('session_user_id')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, rating, review } = body

    const exchange = await db.exchange.findUnique({
      where: { id },
      include: { initiator: true, provider: true }
    })

    if (!exchange) {
      return NextResponse.json({ error: 'التبادل غير موجود' }, { status: 404 })
    }

    // التحقق من الصلاحية
    if (exchange.initiatorId !== sessionId && exchange.providerId !== sessionId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    // تحديث التبادل
    const updatedExchange = await db.exchange.update({
      where: { id },
      data: { status, rating, review }
    })

    // إذا تم قبول التبادل، خصم الوقت
    if (status === 'ACCEPTED') {
      await db.$transaction([
        db.user.update({
          where: { id: exchange.initiatorId },
          data: { timeBalance: { decrement: exchange.timeAmount } }
        }),
        db.user.update({
          where: { id: exchange.providerId },
          data: { timeBalance: { increment: exchange.timeAmount } }
        })
      ])
    }

    // إذا تم الإكمال، تحديث التقييمات
    if (status === 'COMPLETED' && rating) {
      const provider = await db.user.findUnique({ where: { id: exchange.providerId } })
      if (provider) {
        const newTotal = provider.totalExchanges + 1
        const newRating = ((provider.rating * provider.totalExchanges) + rating) / newTotal
        await db.user.update({
          where: { id: exchange.providerId },
          data: {
            rating: newRating,
            totalExchanges: newTotal
          }
        })
      }
    }

    // إنشاء إشعار
    const notifyUserId = exchange.initiatorId === sessionId ? exchange.providerId : exchange.initiatorId
    await db.notification.create({
      data: {
        type: 'EXCHANGE_RESPONSE',
        title: 'تحديث التبادل',
        message: `تم ${status === 'ACCEPTED' ? 'قبول' : status === 'COMPLETED' ? 'إكمال' : 'رفض'} طلب التبادل`,
        userId: notifyUserId
      }
    })

    return NextResponse.json({ success: true, exchange: updatedExchange })
  } catch (error) {
    console.error('Update exchange error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
