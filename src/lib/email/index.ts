import { db } from '@/lib/db'
import crypto from 'crypto'

interface EmailSettings {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  fromEmail: string
  fromName: string
}

// إرسال بريد التحقق للمستخدم الجديد
export async function sendVerificationEmail(userId: string, userEmail: string, userName: string): Promise<boolean> {
  try {
    // التحقق من إعدادات البريد
    const emailSettings = await db.emailSettings.findFirst()
    if (!emailSettings || !emailSettings.emailVerified) {
      console.log('Email verification not enabled')
      return false
    }

    // إنشاء رمز التحقق
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ساعة

    // حفظ الرمز في قاعدة البيانات
    await db.user.update({
      where: { id: userId },
      data: {
        verificationToken,
        verificationExpires
      }
    })

    // إرسال البريد
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const verifyUrl = `${appUrl}/api/auth/verify-email?token=${verificationToken}`

    await transporter.sendMail({
      from: `"${emailSettings.fromName}" <${emailSettings.fromEmail}>`,
      to: userEmail,
      subject: 'تأكيد البريد الإلكتروني - ميزان الوصل',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #059669; margin: 0;">⚖️ ميزان الوصل</h1>
            </div>
            <h2 style="color: #059669; text-align: center;">مرحباً ${userName}</h2>
            <p style="text-align: center; color: #666; line-height: 1.8;">
              شكراً لتسجيلك في ميزان الوصل. يرجى تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background: linear-gradient(135deg, #059669, #0d9488); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                تأكيد البريد الإلكتروني
              </a>
            </div>
            <p style="text-align: center; color: #999; font-size: 12px;">
              هذا الرابط صالح لمدة 24 ساعة فقط
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="text-align: center; color: #999; font-size: 11px;">
              إذا لم تكن قد سجلت في ميزان الوصل، يمكنك تجاهل هذه الرسالة.
            </p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Send verification email error:', error)
    return false
  }
}

// إرسال إشعار بريد إلكتروني
export async function sendNotificationEmail(
  toEmail: string,
  toName: string,
  title: string,
  message: string
): Promise<boolean> {
  try {
    const emailSettings = await db.emailSettings.findFirst()
    if (!emailSettings) {
      return false
    }

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

    await transporter.sendMail({
      from: `"${emailSettings.fromName}" <${emailSettings.fromEmail}>`,
      to: toEmail,
      subject: title,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #059669; margin: 0;">⚖️ ميزان الوصل</h1>
            </div>
            <h2 style="color: #059669; text-align: center;">${title}</h2>
            <p style="text-align: center; color: #666; line-height: 1.8;">
              ${message}
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="text-align: center; color: #999; font-size: 11px;">
              هذه رسالة آلية من منصة ميزان الوصل
            </p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Send notification email error:', error)
    return false
  }
}
