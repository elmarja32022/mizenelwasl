import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

// POST - شراء كتاب
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookId } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // جلب الكتاب
    const book = await db.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return NextResponse.json({ error: 'الكتاب غير موجود' }, { status: 404 })
    }

    // التحقق إذا كان الكتاب مجاني
    if (book.isFree) {
      // تسجيل كشراء مجاني
      const existingPurchase = await db.bookPurchase.findUnique({
        where: { bookId_userId: { bookId, userId: user.id } }
      })

      if (existingPurchase) {
        return NextResponse.json({ success: true, message: 'تم الحصول على الكتاب مسبقاً', purchase: existingPurchase })
      }

      const purchase = await db.bookPurchase.create({
        data: {
          bookId,
          userId: user.id,
          pricePaid: 0,
          currency: book.currency,
          status: 'COMPLETED'
        }
      })

      // تحديث عدد التحميلات
      await db.book.update({
        where: { id: bookId },
        data: { downloadCount: { increment: 1 } }
      })

      return NextResponse.json({ success: true, purchase, book })
    }

    // التحقق إذا كان المستخدم قد اشترى الكتاب مسبقاً
    const existingPurchase = await db.bookPurchase.findUnique({
      where: { bookId_userId: { bookId, userId: user.id } }
    })

    if (existingPurchase) {
      return NextResponse.json({ success: true, message: 'تم شراء الكتاب مسبقاً', purchase: existingPurchase, book })
    }

    // للكتب المدفوعة - هنا يمكن إضافة منطق الدفع
    // حالياً سنعتبر الشراء مباشر (يمكن تطويره لاحقاً مع بوابة دفع)
    
    const purchase = await db.bookPurchase.create({
      data: {
        bookId,
        userId: user.id,
        pricePaid: book.price,
        currency: book.currency,
        status: 'COMPLETED'
      }
    })

    // تحديث عدد التحميلات
    await db.book.update({
      where: { id: bookId },
      data: { downloadCount: { increment: 1 } }
    })

    return NextResponse.json({ success: true, purchase, book })
  } catch (error: any) {
    console.error('Error purchasing book:', error)
    return NextResponse.json({ error: 'حدث خطأ في عملية الشراء' }, { status: 500 })
  }
}
