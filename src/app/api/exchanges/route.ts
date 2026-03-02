import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - جلب التبادلات
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_user_id')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {
      OR: [
        { initiatorId: sessionId },
        { providerId: sessionId }
      ]
    }

    if (status) {
      where.status = status
    }
    if (type) {
      where.type = type
    }

    const exchanges = await db.exchange.findMany({
      where,
      include: {
        initiator: {
          select: { id: true, name: true, city: true, trustLevel: true }
        },
        provider: {
          select: { id: true, name: true, city: true, trustLevel: true }
        },
        service: true,
        product: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ exchanges })
  } catch (error) {
    console.error('Get exchanges error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// POST - طلب تبادل جديد
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_user_id')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const body = await request.json()
    const { type, providerId, serviceId, productId, timeAmount, notes } = body

    if (!type || !providerId) {
      return NextResponse.json({ error: 'بيانات غير كاملة' }, { status: 400 })
    }

    // التحقق من رصيد الوقت
    const user = await db.user.findUnique({ where: { id: sessionId } })
    if (!user || user.timeBalance < (timeAmount || 60)) {
      return NextResponse.json({ error: 'رصيد الوقت غير كافٍ' }, { status: 400 })
    }

    const exchange = await db.exchange.create({
      data: {
        type,
        initiatorId: sessionId,
        providerId,
        serviceId,
        productId,
        timeAmount: timeAmount || 60,
        notes
      }
    })

    // إنشاء إشعار للمزود
    await db.notification.create({
      data: {
        type: 'EXCHANGE_REQUEST',
        title: 'طلب تبادل جديد',
        message: `لديك طلب تبادل جديد من ${user.name}`,
        userId: providerId
      }
    })

    return NextResponse.json({ success: true, exchange })
  } catch (error) {
    console.error('Create exchange error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
