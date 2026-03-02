import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/auth'

// إرسال إشعارات للخلفاء
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const body = await request.json()
    const { title, message, targetScope, targetValue, type } = body

    if (!title || !message) {
      return NextResponse.json({ error: 'العنوان والرسالة مطلوبان' }, { status: 400 })
    }

    let targetUsers: { id: string }[] = []

    switch (targetScope) {
      case 'ALL':
        // لجميع الخلفاء
        targetUsers = await db.user.findMany({
          where: { isSuspended: false },
          select: { id: true }
        })
        break

      case 'COUNTRY':
        // لدولة معينة
        if (!targetValue) {
          return NextResponse.json({ error: 'اسم الدولة مطلوب' }, { status: 400 })
        }
        targetUsers = await db.user.findMany({
          where: { country: targetValue, isSuspended: false },
          select: { id: true }
        })
        break

      case 'CITY':
        // لمدينة معينة
        if (!targetValue) {
          return NextResponse.json({ error: 'اسم المدينة مطلوب' }, { status: 400 })
        }
        targetUsers = await db.user.findMany({
          where: { city: targetValue, isSuspended: false },
          select: { id: true }
        })
        break

      case 'NEIGHBORHOOD':
        // لحي معين
        if (!targetValue) {
          return NextResponse.json({ error: 'اسم الحي مطلوب' }, { status: 400 })
        }
        targetUsers = await db.user.findMany({
          where: { neighborhood: targetValue, isSuspended: false },
          select: { id: true }
        })
        break

      case 'USER':
        // لمستخدم معين
        if (!targetValue) {
          return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
        }
        targetUsers = [{ id: targetValue }]
        break

      default:
        return NextResponse.json({ error: 'نوع الهدف غير صالح' }, { status: 400 })
    }

    // إنشاء الإشعارات
    const notifications = await Promise.all(
      targetUsers.map(u =>
        db.notification.create({
          data: {
            type: type || 'ANNOUNCEMENT',
            title,
            message,
            userId: u.id,
            targetScope,
            targetValue
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: `تم إرسال الإشعار إلى ${notifications.length} خليفة`,
      count: notifications.length
    })
  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json({ error: 'حدث خطأ في إرسال الإشعار' }, { status: 500 })
  }
}

// جلب قوائم الدول والمدن والأحياء
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    // الدول المتوفرة
    const countries = await db.user.groupBy({
      by: ['country'],
      where: { country: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    // المدن المتوفرة
    const cities = await db.user.groupBy({
      by: ['city', 'country'],
      where: { city: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    // الأحياء المتوفرة
    const neighborhoods = await db.user.groupBy({
      by: ['neighborhood', 'city', 'country'],
      where: { neighborhood: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    // المستخدمين للاختيار الفردي
    const users = await db.user.findMany({
      where: { isSuspended: false },
      select: { id: true, name: true, email: true, city: true, country: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      countries: countries.map(c => ({ code: c.country, count: c._count.id })),
      cities: cities.map(c => ({ city: c.city, country: c.country, count: c._count.id })),
      neighborhoods: neighborhoods.map(n => ({ neighborhood: n.neighborhood, city: n.city, country: n.country, count: n._count.id })),
      users: users.map(u => ({ id: u.id, name: u.name, email: u.email, city: u.city, country: u.country }))
    })
  } catch (error) {
    console.error('Get locations error:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب المواقع' }, { status: 500 })
  }
}
