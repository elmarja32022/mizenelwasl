import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

// GET - جلب التبرعات
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const myDonations = searchParams.get('my') === 'true'

    const where: any = {}
    
    if (myDonations) {
      where.donorId = user.id
    }
    
    if (type && type !== 'ALL') {
      where.type = type
    }
    
    if (status && status !== 'ALL') {
      where.status = status
    }
    
    if (category) {
      where.category = category
    }

    const donations = await db.donation.findMany({
      where,
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            image: true,
            city: true,
            trustLevel: true,
            integrityScore: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // حساب الإحصائيات
    const stats = await db.donation.aggregate({
      _count: { id: true },
      _sum: { amount: true },
      where: { status: 'COMPLETED' }
    })

    const byType = await db.donation.groupBy({
      by: ['type'],
      _count: { id: true },
      _sum: { amount: true },
      where: { status: 'COMPLETED' }
    })

    return NextResponse.json({
      donations,
      stats: {
        total: stats._count.id,
        totalAmount: stats._sum.amount || 0,
        byType: byType.map(t => ({
          type: t.type,
          count: t._count.id,
          amount: t._sum.amount || 0
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// POST - إنشاء تبرع جديد
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const data = await request.json()
    const { 
      type, 
      title, 
      description, 
      amount, 
      unit, 
      category, 
      priority,
      isAnonymous, 
      beneficiary, 
      notes 
    } = data

    // التحقق من البيانات المطلوبة
    if (!type || !title) {
      return NextResponse.json({ error: 'نوع التبرع والعنوان مطلوبان' }, { status: 400 })
    }

    // التحقق من نوع التبرع
    const validTypes = ['TIME', 'MONEY', 'GOODS', 'SKILL']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'نوع التبرع غير صالح' }, { status: 400 })
    }

    // إنشاء التبرع
    const donation = await db.donation.create({
      data: {
        donorId: user.id,
        type,
        title,
        description: description || null,
        amount: parseFloat(amount) || 0,
        unit: unit || null,
        category: category || null,
        priority: priority || 'NORMAL',
        isAnonymous: isAnonymous || false,
        beneficiary: beneficiary || null,
        notes: notes || null,
        status: 'PENDING'
      },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            image: true,
            city: true,
            trustLevel: true,
            integrityScore: true
          }
        }
      }
    })

    // تحديث رصيد النزاهة للمتبرع (مكافأة على التبرع)
    const integrityBonus = type === 'MONEY' ? 2 : type === 'TIME' ? 3 : type === 'SKILL' ? 4 : 1
    
    await db.user.update({
      where: { id: user.id },
      data: {
        integrityScore: Math.min(100, user.integrityScore + integrityBonus)
      }
    })

    return NextResponse.json({
      success: true,
      donation,
      integrityBonus
    })
  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
