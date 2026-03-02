import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/auth'

// جلب إعدادات البريد
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const settings = await db.emailSettings.findFirst()

    if (!settings) {
      // إرجاع إعدادات افتراضية
      return NextResponse.json({
        settings: {
          id: null,
          smtpHost: '',
          smtpPort: 587,
          smtpUser: '',
          smtpPassword: '',
          fromEmail: '',
          fromName: 'ميزان الوصل',
          useTLS: true,
          emailVerified: false
        }
      })
    }

    // إخفاء كلمة المرور في الاستجابة
    return NextResponse.json({
      settings: {
        ...settings,
        smtpPassword: '••••••••' // إخفاء كلمة المرور
      }
    })
  } catch (error) {
    console.error('Get email settings error:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب الإعدادات' }, { status: 500 })
  }
}

// حفظ إعدادات البريد
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const body = await request.json()
    const { smtpHost, smtpPort, smtpUser, smtpPassword, fromEmail, fromName, useTLS, emailVerified } = body

    if (!smtpHost || !smtpUser || !fromEmail) {
      return NextResponse.json({ error: 'الحقول المطلوبة: خادم SMTP، المستخدم، البريد المرسل' }, { status: 400 })
    }

    // التحقق من وجود إعدادات سابقة
    const existing = await db.emailSettings.findFirst()

    let settings
    if (existing) {
      // تحديث الإعدادات
      const updateData: any = {
        smtpHost,
        smtpPort: smtpPort || 587,
        smtpUser,
        fromEmail,
        fromName: fromName || 'ميزان الوصل',
        useTLS: useTLS !== false,
        emailVerified: emailVerified === true
      }

      // تحديث كلمة المرور فقط إذا تم تقديمها وليست مخفية
      if (smtpPassword && smtpPassword !== '••••••••') {
        updateData.smtpPassword = smtpPassword
      }

      settings = await db.emailSettings.update({
        where: { id: existing.id },
        data: updateData
      })
    } else {
      // إنشاء إعدادات جديدة
      if (!smtpPassword) {
        return NextResponse.json({ error: 'كلمة مرور SMTP مطلوبة' }, { status: 400 })
      }

      settings = await db.emailSettings.create({
        data: {
          smtpHost,
          smtpPort: smtpPort || 587,
          smtpUser,
          smtpPassword,
          fromEmail,
          fromName: fromName || 'ميزان الوصل',
          useTLS: useTLS !== false,
          emailVerified: emailVerified === true
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ إعدادات البريد بنجاح',
      settings: {
        ...settings,
        smtpPassword: '••••••••'
      }
    })
  } catch (error) {
    console.error('Save email settings error:', error)
    return NextResponse.json({ error: 'حدث خطأ في حفظ الإعدادات' }, { status: 500 })
  }
}

// اختبار إعدادات البريد
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const body = await request.json()
    const { testEmail } = body

    if (!testEmail) {
      return NextResponse.json({ error: 'البريد الاختباري مطلوب' }, { status: 400 })
    }

    const settings = await db.emailSettings.findFirst()
    if (!settings) {
      return NextResponse.json({ error: 'لم يتم تكوين إعدادات البريد' }, { status: 400 })
    }

    // محاولة إرسال بريد اختباري
    const nodemailer = await import('nodemailer')

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpPort === 465,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword
      }
    })

    await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.fromEmail}>`,
      to: testEmail,
      subject: 'اختبار البريد - ميزان الوصل',
      text: 'هذا بريد اختباري من منصة ميزان الوصل. إذا وصلتك هذه الرسالة، فإعدادات البريد صحيحة.',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #059669; text-align: center;">اختبار البريد</h2>
            <p style="text-align: center; color: #666;">
              هذا بريد اختباري من منصة ميزان الوصل.
            </p>
            <p style="text-align: center; color: #059669; font-weight: bold;">
              ✅ إذا وصلتك هذه الرسالة، فإعدادات البريد صحيحة!
            </p>
          </div>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'تم إرسال البريد الاختباري بنجاح'
    })
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json({
      error: 'فشل إرسال البريد الاختباري',
      details: error.message
    }, { status: 500 })
  }
}
