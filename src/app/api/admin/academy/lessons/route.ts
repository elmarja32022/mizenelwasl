import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/auth'

// جلب دروس دورة معينة
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const url = new URL(request.url)
    const courseId = url.searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'معرف الدورة مطلوب' }, { status: 400 })
    }

    const lessons = await db.academyLesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Get lessons error:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب الدروس' }, { status: 500 })
  }
}

// إنشاء درس جديد
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const body = await request.json()
    const { courseId, title, content, videoUrl, imageUrl, order, duration, isPublished } = body

    if (!courseId || !title || !content) {
      return NextResponse.json({ error: 'الدورة والعنوان والمحتوى مطلوبون' }, { status: 400 })
    }

    const lesson = await db.academyLesson.create({
      data: {
        courseId,
        title,
        content,
        videoUrl,
        imageUrl,
        order: order || 0,
        duration: duration || 0,
        isPublished: isPublished || false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الدرس بنجاح',
      lesson
    })
  } catch (error) {
    console.error('Create lesson error:', error)
    return NextResponse.json({ error: 'حدث خطأ في إنشاء الدرس' }, { status: 500 })
  }
}

// تحديث درس
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const body = await request.json()
    const { id, title, content, videoUrl, imageUrl, order, duration, isPublished } = body

    if (!id) {
      return NextResponse.json({ error: 'معرف الدرس مطلوب' }, { status: 400 })
    }

    const lesson = await db.academyLesson.update({
      where: { id },
      data: {
        title,
        content,
        videoUrl,
        imageUrl,
        order,
        duration,
        isPublished
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الدرس بنجاح',
      lesson
    })
  } catch (error) {
    console.error('Update lesson error:', error)
    return NextResponse.json({ error: 'حدث خطأ في تحديث الدرس' }, { status: 500 })
  }
}

// حذف درس
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'معرف الدرس مطلوب' }, { status: 400 })
    }

    await db.academyLesson.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الدرس بنجاح'
    })
  } catch (error) {
    console.error('Delete lesson error:', error)
    return NextResponse.json({ error: 'حدث خطأ في حذف الدرس' }, { status: 500 })
  }
}
