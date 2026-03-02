import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/auth'

// إحصائيات لوحة تحكم الخليفة
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    // إحصائيات عامة
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalServices,
      totalProducts,
      totalExchanges,
      completedExchanges,
      pendingExchanges,
      totalPosts
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isSuspended: false } }),
      db.user.count({ where: { isSuspended: true } }),
      db.service.count(),
      db.product.count(),
      db.exchange.count(),
      db.exchange.count({ where: { status: 'COMPLETED' } }),
      db.exchange.count({ where: { status: 'PENDING' } }),
      db.communityPost.count()
    ])

    // المستخدمون حسب الدول
    const usersByCountry = await db.user.groupBy({
      by: ['country'],
      _count: { id: true },
      where: { country: { not: null } },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    })

    // المستخدمون حسب المدن
    const usersByCity = await db.user.groupBy({
      by: ['city', 'country'],
      _count: { id: true },
      where: { city: { not: null } },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    })

    // الخدمات حسب الفئة
    const servicesByCategory = await db.service.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    // المنتجات حسب الفئة
    const productsByCategory = await db.product.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    // أعلى المستخدمين في النزاهة
    const topIntegrityUsers = await db.user.findMany({
      take: 10,
      orderBy: { integrityScore: 'desc' },
      select: { id: true, name: true, integrityScore: true, trustLevel: true, city: true, country: true }
    })

    // المستخدمون الجدد (آخر 7 أيام)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const newUsersThisWeek = await db.user.count({
      where: { createdAt: { gte: sevenDaysAgo } }
    })

    // التبادلات هذا الأسبوع
    const exchangesThisWeek = await db.exchange.count({
      where: { createdAt: { gte: sevenDaysAgo } }
    })

    // ساعات التبادل الإجمالية
    const totalHours = await db.exchange.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { timeAmount: true }
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalServices,
        totalProducts,
        totalExchanges,
        completedExchanges,
        pendingExchanges,
        totalPosts,
        newUsersThisWeek,
        exchangesThisWeek,
        totalHoursExchanged: Math.floor((totalHours._sum.timeAmount || 0) / 60)
      },
      charts: {
        usersByCountry: usersByCountry.map(u => ({ country: u.country, count: u._count.id })),
        usersByCity: usersByCity.map(u => ({ city: u.city, country: u.country, count: u._count.id })),
        servicesByCategory,
        productsByCategory
      },
      topUsers: topIntegrityUsers
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب الإحصائيات' }, { status: 500 })
  }
}
