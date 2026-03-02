import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')

    // البحث عن المستخدم
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user || user.password !== hashedPassword) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // التحقق من حالة الحساب
    if (user.trustLevel === 'مجمد') {
      return NextResponse.json(
        { error: 'تم تجميد حسابك. يرجى التواصل مع الدعم' },
        { status: 403 }
      )
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        country: user.country,
        city: user.city,
        neighborhood: user.neighborhood,
        timeBalance: user.timeBalance,
        integrityScore: user.integrityScore,
        trustLevel: user.trustLevel,
        rating: user.rating,
        totalExchanges: user.totalExchanges
      }
    })

    response.cookies.set('session_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    )
  }
}
