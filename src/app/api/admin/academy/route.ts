import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/auth'

// جلب جميع الدورات
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const courses = await db.academyCourse.findMany({
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { lessons: true }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Get academy courses error:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب الدورات' }, { status: 500 })
  }
}

// إنشاء دورة جديدة
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, icon, color, order, isPublished } = body

    if (!title) {
      return NextResponse.json({ error: 'عنوان الدورة مطلوب' }, { status: 400 })
    }

    const course = await db.academyCourse.create({
      data: {
        title,
        description: description || '',
        icon: icon || 'BookOpen',
        color: color || 'emerald',
        order: order || 0,
        isPublished: isPublished || false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الدورة بنجاح',
      course
    })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json({ error: 'حدث خطأ في إنشاء الدورة' }, { status: 500 })
  }
}

// تحديث دورة
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const body = await request.json()
    const { id, title, description, icon, color, order, isPublished } = body

    if (!id) {
      return NextResponse.json({ error: 'معرف الدورة مطلوب' }, { status: 400 })
    }

    const course = await db.academyCourse.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        color,
        order,
        isPublished
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الدورة بنجاح',
      course
    })
  } catch (error) {
    console.error('Update course error:', error)
    return NextResponse.json({ error: 'حدث خطأ في تحديث الدورة' }, { status: 500 })
  }
}

// حذف دورة
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'معرف الدورة مطلوب' }, { status: 400 })
    }

    await db.academyCourse.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الدورة بنجاح'
    })
  } catch (error) {
    console.error('Delete course error:', error)
    return NextResponse.json({ error: 'حدث خطأ في حذف الدورة' }, { status: 500 })
  }
}
