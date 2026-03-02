import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - جلب ملف مستخدم
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        neighborhood: true,
        timeBalance: true,
        integrityScore: true,
        trustLevel: true,
        rating: true,
        totalExchanges: true,
        createdAt: true,
        services: {
          where: { status: 'ACTIVE' },
          take: 10
        },
        products: {
          take: 10
        },
        posts: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            services: { where: { status: 'ACTIVE' } },
            products: true,
            exchangesAsInitiator: { where: { status: 'COMPLETED' } },
            exchangesAsProvider: { where: { status: 'COMPLETED' } }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// PUT - تحديث ملف مستخدم
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
    if (sessionId !== id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const body = await request.json()
    const { name, phone, country, city, neighborhood } = body

    const user = await db.user.update({
      where: { id },
      data: { name, phone, country, city, neighborhood }
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
