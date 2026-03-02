import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - إرسال رسالة تواصل
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, category } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        category: category || 'GENERAL'
      }
    })

    return NextResponse.json({ success: true, id: contactMessage.id })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
