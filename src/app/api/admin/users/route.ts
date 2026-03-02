import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/auth'

// جلب قائمة المستخدمين
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const search = url.searchParams.get('search') || ''
    const country = url.searchParams.get('country')
    const city = url.searchParams.get('city')
    const status = url.searchParams.get('status') // 'active' | 'suspended'

    const skip = (page - 1) * limit

    const whereClause: any = {}

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ]
    }

    if (country) {
      whereClause.country = country
    }

    if (city) {
      whereClause.city = city
    }

    if (status === 'suspended') {
      whereClause.isSuspended = true
    } else if (status === 'active') {
      whereClause.isSuspended = false
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          country: true,
          city: true,
          neighborhood: true,
          timeBalance: true,
          integrityScore: true,
          trustLevel: true,
          rating: true,
          totalExchanges: true,
          covenantSigned: true,
          isAdmin: true,
          isSuspended: true,
          createdAt: true,
          _count: {
            select: {
              services: true,
              products: true,
              exchangesAsInitiator: true,
              exchangesAsProvider: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.user.count({ where: whereClause })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب المستخدمين' }, { status: 500 })
  }
}

// تحديث حالة مستخدم
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, action, value } = body

    if (!userId || !action) {
      return NextResponse.json({ error: 'معرف المستخدم والإجراء مطلوبان' }, { status: 400 })
    }

    let updateData: any = {}

    switch (action) {
      case 'suspend':
        updateData.isSuspended = true
        break
      case 'activate':
        updateData.isSuspended = false
        break
      case 'setAdmin':
        updateData.isAdmin = value === true
        break
      case 'adjustTimeBalance':
        updateData.timeBalance = value
        break
      case 'adjustIntegrity':
        updateData.integrityScore = Math.max(0, Math.min(100, value))
        // تحديث مستوى الثقة تلقائياً
        if (value >= 90) updateData.trustLevel = 'خليفة مميز'
        else if (value >= 75) updateData.trustLevel = 'خليفة صادق'
        else if (value >= 50) updateData.trustLevel = 'خليفة موثوق'
        else updateData.trustLevel = 'تحت المراقبة'
        break
      default:
        return NextResponse.json({ error: 'إجراء غير صالح' }, { status: 400 })
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المستخدم بنجاح',
      user: updatedUser
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'حدث خطأ في تحديث المستخدم' }, { status: 500 })
  }
}
