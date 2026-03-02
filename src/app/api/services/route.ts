import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - جلب الخدمات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const country = searchParams.get('country')
    const search = searchParams.get('search')

    const where: any = { status: 'ACTIVE' }
    
    if (type && (type === 'OFFER' || type === 'REQUEST')) {
      where.type = type
    }
    if (category) {
      where.category = category
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleAr: { contains: search } },
        { description: { contains: search } }
      ]
    }
    if (city || country) {
      where.user = {}
      if (city) where.user.city = city
      if (country) where.user.country = country
    }

    const services = await db.service.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
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

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Get services error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// POST - إضافة خدمة جديدة
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_user_id')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const body = await request.json()
    const { title, titleAr, description, type, category, duration, images, videoUrl } = body

    if (!title || !type || !category || !duration) {
      return NextResponse.json({ error: 'جميع الحقول المطلوبة يجب ملؤها' }, { status: 400 })
    }

    const service = await db.service.create({
      data: {
        title,
        titleAr: titleAr || title,
        description: description || '',
        type,
        category,
        duration: parseInt(duration),
        images: images ? JSON.stringify(images) : null,
        videoUrl,
        userId: sessionId
      }
    })

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('Create service error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
