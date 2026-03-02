import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// التحقق من البريد الإلكتروني
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/?verified=false&error=no_token', request.url))
    }

    // البحث عن المستخدم برمز التحقق
    const user = await db.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: { gt: new Date() }
      }
    })

    if (!user) {
      return NextResponse.redirect(new URL('/?verified=false&error=invalid_token', request.url))
    }

    // تحديث حالة التحقق
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null
      }
    })

    // إنشاء إشعار بالتحقق
    await db.notification.create({
      data: {
        type: 'SYSTEM',
        title: 'تم التحقق من بريدك',
        message: 'شكراً لك! تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن الاستمتاع بجميع مميزات ميزان الوصل.',
        userId: user.id
      }
    })

    return NextResponse.redirect(new URL('/?verified=true', request.url))
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.redirect(new URL('/?verified=false&error=server', request.url))
  }
}

// إعادة إرسال بريد التحقق
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'البريد غير مسجل' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'البريد موثق بالفعل' }, { status: 400 })
    }

    // التحقق من إعدادات البريد
    const emailSettings = await db.emailSettings.findFirst()
    if (!emailSettings || !emailSettings.emailVerified) {
      return NextResponse.json({ error: 'نظام التحقق من البريد غير مفعل' }, { status: 400 })
    }

    // إنشاء رمز تحقق جديد
    const crypto = await import('crypto')
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ساعة

    await db.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationExpires
      }
    })

    // إرسال بريد التحقق
    const nodemailer = await import('nodemailer')

    const transporter = nodemailer.createTransport({
      host: emailSettings.smtpHost,
      port: emailSettings.smtpPort,
      secure: emailSettings.smtpPort === 465,
      auth: {
        user: emailSettings.smtpUser,
        pass: emailSettings.smtpPassword
      }
    })

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}`

    await transporter.sendMail({
      from: `"${emailSettings.fromName}" <${emailSettings.fromEmail}>`,
      to: email,
      subject: 'تأكيد البريد الإلكتروني - ميزان الوصل',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #059669; text-align: center;">مرحباً ${user.name}</h2>
            <p style="text-align: center; color: #666;">
              شكراً لتسجيلك في ميزان الوصل. يرجى تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background: #059669; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                تأكيد البريد الإلكتروني
              </a>
            </div>
            <p style="text-align: center; color: #999; font-size: 12px;">
              هذا الرابط صالح لمدة 24 ساعة فقط
            </p>
          </div>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'تم إرسال بريد التحقق بنجاح'
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json({ error: 'حدث خطأ في إرسال البريد' }, { status: 500 })
  }
}
