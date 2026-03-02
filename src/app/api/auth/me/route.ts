import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value

    if (!sessionId) {
      return NextResponse.json({ user: null })
    }

    const user = await db.user.findUnique({
      where: { id: sessionId },
      include: {
        services: { where: { status: 'ACTIVE' }, take: 5 },
        products: { where: { type: 'OFFER' }, take: 5 },
        _count: {
          select: {
            services: true,
            products: true,
            exchangesAsInitiator: true,
            exchangesAsProvider: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        image: user.image,
        country: user.country,
        city: user.city,
        neighborhood: user.neighborhood,
        timeBalance: user.timeBalance,
        integrityScore: user.integrityScore,
        trustLevel: user.trustLevel,
        rating: user.rating,
        totalExchanges: user.totalExchanges,
        covenantSigned: user.covenantSigned,
        services: user.services,
        products: user.products,
        counts: user._count
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ user: null })
  }
}
