import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

// POST - تقييم كتاب
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

    const { rating, review } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'التقييم يجب أن يكون بين 1 و 5' }, { status: 400 })
    }

    // التحقق من وجود الكتاب
    const book = await db.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return NextResponse.json({ error: 'الكتاب غير موجود' }, { status: 404 })
    }

    // التحقق إذا كان المستخدم قد قيّم الكتاب مسبقاً
    const existingRating = await db.bookRating.findUnique({
      where: { bookId_userId: { bookId, userId: user.id } }
    })

    let bookRating
    if (existingRating) {
      // تحديث التقييم
      bookRating = await db.bookRating.update({
        where: { id: existingRating.id },
        data: { rating, review }
      })
    } else {
      // إنشاء تقييم جديد
      bookRating = await db.bookRating.create({
        data: {
          bookId,
          userId: user.id,
          rating,
          review
        }
      })
    }

    // تحديث متوسط التقييم للكتاب
    const ratings = await db.bookRating.findMany({
      where: { bookId }
    })

    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length

    await db.book.update({
      where: { id: bookId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        totalRatings: ratings.length
      }
    })

    return NextResponse.json({ success: true, rating: bookRating })
  } catch (error: any) {
    console.error('Error rating book:', error)
    return NextResponse.json({ error: 'حدث خطأ في تقييم الكتاب' }, { status: 500 })
  }
}
