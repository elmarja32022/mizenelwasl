import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - جلب الإحصائيات
export async function GET() {
  try {
    const [
      totalUsers,
      totalServices,
      totalProducts,
      totalExchanges,
      completedExchanges,
      recentUsers,
      topCategories
    ] = await Promise.all([
      db.user.count(),
      db.service.count({ where: { status: 'ACTIVE' } }),
      db.product.count(),
      db.exchange.count(),
      db.exchange.count({ where: { status: 'COMPLETED' } }),
      db.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, city: true, trustLevel: true }
      }),
      db.service.groupBy({
        by: ['category'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
      })
    ])

    // حساب الساعات المتداولة
    const exchanges = await db.exchange.findMany({
      where: { status: 'COMPLETED' },
      select: { timeAmount: true }
    })
    const totalHoursExchanged = exchanges.reduce((sum, e) => sum + e.timeAmount, 0) / 60

    return NextResponse.json({
      totalUsers,
      totalServices,
      totalProducts,
      totalExchanges,
      completedExchanges,
      totalHoursExchanged: Math.round(totalHoursExchanged),
      recentUsers,
      topCategories
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
