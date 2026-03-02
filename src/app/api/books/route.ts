import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

// GET - جلب قائمة الكتب
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isFree = searchParams.get('isFree')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    const where: any = { status: 'PUBLISHED' }
    
    if (category) where.category = category
    if (isFree !== null) where.isFree = isFree === 'true'
    if (featured === 'true') where.featured = true
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { description: { contains: search } }
      ]
    }

    const books = await db.book.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        _count: {
          select: { ratings: true, purchases: true }
        }
      }
    })

    return NextResponse.json({ books })
  } catch (error: any) {
    console.error('Error fetching books:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب الكتب' }, { status: 500 })
  }
}

// POST - إضافة كتاب جديد (للأدمن فقط)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // التحقق من صلاحيات الأدمن
    if (!user.isAdmin) {
      return NextResponse.json({ error: 'لا تملك صلاحية إضافة الكتب' }, { status: 403 })
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
      order
    } = data

    if (!title || !category) {
      return NextResponse.json({ error: 'العنوان والفئة مطلوبان' }, { status: 400 })
    }

    const book = await db.book.create({
      data: {
        title,
        author,
        description,
        coverImage,
        category,
        isFree: isFree ?? true,
        price: price ?? 0,
        currency: currency ?? 'ريال',
        fileUrl,
        externalUrl,
        pages,
        language: language ?? 'العربية',
        publisher,
        publishYear,
        isbn,
        featured: featured ?? false,
        order: order ?? 0
      }
    })

    return NextResponse.json({ success: true, book })
  } catch (error: any) {
    console.error('Error creating book:', error)
    return NextResponse.json({ error: 'حدث خطأ في إضافة الكتاب' }, { status: 500 })
  }
}
