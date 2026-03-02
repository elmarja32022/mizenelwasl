import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - جلب بيانات الملف الشخصي
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_user_id')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        country: true,
        city: true,
        neighborhood: true,
        timeBalance: true,
        integrityScore: true,
        trustLevel: true,
        rating: true,
        totalExchanges: true,
        covenantSigned: true,
        covenantSignedAt: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// PUT - تحديث الملف الشخصي
export async function PUT(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_user_id')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, image, country, city, neighborhood } = body

    const user = await db.user.update({
      where: { id: sessionId },
      data: {
        name,
        phone,
        image,
        country,
        city,
        neighborhood
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        country: true,
        city: true,
        neighborhood: true,
        timeBalance: true,
        integrityScore: true,
        trustLevel: true,
        rating: true,
        totalExchanges: true
      }
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
