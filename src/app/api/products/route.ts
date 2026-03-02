import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - جلب المنتجات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const country = searchParams.get('country')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (type && (type === 'OFFER' || type === 'REQUEST')) {
      where.type = type
    }
    if (category) {
      where.category = category
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nameAr: { contains: search } },
        { description: { contains: search } }
      ]
    }
    if (city || country) {
      where.user = {}
      if (city) where.user.city = city
      if (country) where.user.country = country
    }

    const products = await db.product.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
            trustLevel: true,
            integrityScore: true,
            rating: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// POST - إضافة منتج جديد
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const body = await request.json()
    const { name, nameAr, description, quantity, unit, quality, type, category, images, videoUrl } = body

    if (!name || !quantity || !unit || !type || !category) {
      return NextResponse.json({ error: 'جميع الحقول المطلوبة يجب ملؤها' }, { status: 400 })
    }

    const product = await db.product.create({
      data: {
        name,
        nameAr: nameAr || name,
        description,
        quantity: parseFloat(quantity),
        unit,
        quality: quality || 'جيد جداً',
        type,
        category,
        images: images ? JSON.stringify(images) : null,
        videoUrl,
        userId: sessionId
      }
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
