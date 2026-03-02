import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

// GET - جلب المشاريع
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const stage = searchParams.get('stage')
    const myProjects = searchParams.get('my') === 'true'
    const search = searchParams.get('search')

    const where: any = {}
    
    if (myProjects) {
      where.creatorId = user.id
    } else {
      // عرض المشاريع العامة النشطة فقط
      where.isPublic = true
      where.status = { in: ['ACTIVE', 'PENDING', 'FUNDED'] }
    }
    
    if (category && category !== 'ALL') {
      where.category = category
    }
    
    if (status && status !== 'ALL') {
      where.status = status
    }
    
    if (stage && stage !== 'ALL') {
      where.stage = stage
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }

    const projects = await db.project.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            city: true,
            trustLevel: true,
            integrityScore: true
          }
        },
        supports: {
          select: {
            id: true,
            type: true,
            amount: true,
            hours: true,
            status: true,
            supporter: {
              select: { id: true, name: true, image: true }
            }
          }
        },
        _count: {
          select: { supports: true, comments: true }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    })

    // حساب الإحصائيات
    const stats = await db.project.aggregate({
      _count: { id: true },
      _sum: { targetAmount: true, currentAmount: true },
      where: { status: 'ACTIVE' }
    })

    const byCategory = await db.project.groupBy({
      by: ['category'],
      _count: { id: true },
      where: { status: { in: ['ACTIVE', 'PENDING', 'FUNDED'] } }
    })

    return NextResponse.json({
      projects,
      stats: {
        total: stats._count.id,
        totalTarget: stats._sum.targetAmount || 0,
        totalCurrent: stats._sum.currentAmount || 0,
        byCategory: byCategory.map(c => ({
          category: c.category,
          count: c._count.id
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// POST - إنشاء مشروع جديد
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const data = await request.json()
    const {
      title,
      description,
      category,
      stage,
      needsTime,
      needsMoney,
      needsSkills,
      needsMaterials,
      targetAmount,
      targetTime,
      targetSupporters,
      isPublic,
      allowComments,
      images,
      videoUrl,
      startDate,
      endDate
    } = data

    // التحقق من البيانات المطلوبة
    if (!title || !description || !category) {
      return NextResponse.json({ error: 'العنوان والوصف والفئة مطلوبان' }, { status: 400 })
    }

    // إنشاء المشروع
    const project = await db.project.create({
      data: {
        creatorId: user.id,
        title,
        description,
        category,
        stage: stage || 'IDEA',
        needsTime: needsTime || false,
        needsMoney: needsMoney || false,
        needsSkills: needsSkills || false,
        needsMaterials: needsMaterials || false,
        targetAmount: parseFloat(targetAmount) || 0,
        targetTime: parseInt(targetTime) || 0,
        targetSupporters: parseInt(targetSupporters) || 0,
        isPublic: isPublic !== false,
        allowComments: allowComments !== false,
        images: images ? JSON.stringify(images) : null,
        videoUrl: videoUrl || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: 'PENDING'
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            city: true,
            trustLevel: true
          }
        }
      }
    })

    // مكافأة النزاهة لصاحب المشروع
    await db.user.update({
      where: { id: user.id },
      data: {
        integrityScore: Math.min(100, user.integrityScore + 3)
      }
    })

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
