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
      totalHoursResult
    ] = await Promise.all([
      db.user.count(),
      db.service.count({ where: { status: 'ACTIVE' } }),
      db.product.count(),
      db.exchange.count(),
      db.exchange.count({ where: { status: 'COMPLETED' } }),
      // Aggregate instead of fetching all records
      db.exchange.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { timeAmount: true }
      })
    ])

    const totalHoursExchanged = Math.round((totalHoursResult._sum.timeAmount || 0) / 60)

    const response = NextResponse.json({
      totalUsers,
      totalServices,
      totalProducts,
      totalExchanges,
      completedExchanges,
      totalHoursExchanged
    })
    
    // Add cache headers
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60')
    
    return response
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
