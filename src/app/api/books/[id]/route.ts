import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

// GET - جلب تفاصيل كتاب
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    const book = await db.book.findUnique({
      where: { id },
      include: {
        ratings: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { ratings: true, purchases: true }
        }
      }
    })

    if (!book) {
      return NextResponse.json({ error: 'الكتاب غير موجود' }, { status: 404 })
    }

    // تحديث عدد المشاهدات
    await db.book.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    })

    // التحقق إذا كان المستخدم قد اشترى الكتاب
    let hasPurchased = false

    if (user && !book.isFree) {
      const purchase = await db.bookPurchase.findUnique({
        where: { bookId_userId: { bookId: id, userId: user.id } }
      })
      hasPurchased = !!purchase
    }

    // التحقق إذا كان المستخدم قد قيّم الكتاب
    let userRating = null
    if (user) {
      userRating = await db.bookRating.findUnique({
        where: { bookId_userId: { bookId: id, userId: user.id } }
      })
    }

    return NextResponse.json({ 
      book, 
      hasPurchased,
      userRating
    })
  } catch (error: any) {
    console.error('Error fetching book:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب الكتاب' }, { status: 500 })
  }
}

// PUT - تحديث كتاب (للأدمن فقط)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    if (!user.isAdmin) {
      return NextResponse.json({ error: 'لا تملك صلاحية تعديل الكتب' }, { status: 403 })
    }

    const data = await request.json()
    const {
      title,
      author,
      description,
      coverImage,
      category,
      isFree,
      price,
      currency,
      fileUrl,
      externalUrl,
      pages,
      language,
      publisher,
      publishYear,
      isbn,
      featured,
      order,
      status
    } = data

    const book = await db.book.update({
      where: { id },
      data: {
        title,
        author,
        description,
        coverImage,
        category,
        isFree,
        price,
        currency,
        fileUrl,
        externalUrl,
        pages,
        language,
        publisher,
        publishYear,
        isbn,
        featured,
        order,
        status
      }
    })

    return NextResponse.json({ success: true, book })
  } catch (error: any) {
    console.error('Error updating book:', error)
    return NextResponse.json({ error: 'حدث خطأ في تحديث الكتاب' }, { status: 500 })
  }
}

// DELETE - حذف كتاب (للأدمن فقط)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    if (!user.isAdmin) {
      return NextResponse.json({ error: 'لا تملك صلاحية حذف الكتب' }, { status: 403 })
    }

    await db.book.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting book:', error)
    return NextResponse.json({ error: 'حدث خطأ في حذف الكتاب' }, { status: 500 })
  }
}
