import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password, phone, country, city, neighborhood } = body

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني والاسم وكلمة المرور مطلوبون' },
        { status: 400 }
      )
    }

    // التحقق من وجود المستخدم
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')

    // إنشاء المستخدم
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone,
        country,
        city,
        neighborhood,
        timeBalance: 300, // 5 ساعات
        integrityScore: 100,
        trustLevel: 'موثوق',
        covenantSigned: true,
        covenantSignedAt: new Date()
      }
    })

    // إنشاء إشعار ترحيب
    await db.notification.create({
      data: {
        type: 'SYSTEM',
        title: 'مرحباً بك يا خليفة!',
        message: `أهلاً ${name}! أصبحت "ابن الوصل" في مذهب ميزان الوصل. لا حدود • لا فوارق • رصيدك 5 ساعات. ابدأ رحلة العودة للأصل!`,
        userId: user.id
      }
    })

    // إنشاء response مع cookie
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
        covenantSigned: user.covenantSigned
      }
    })

    // تعيين cookie
    response.cookies.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 يوم
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    )
  }
}
