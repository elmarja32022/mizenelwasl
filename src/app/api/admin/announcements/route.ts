import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/auth'

// جلب جميع المنشورات الرسمية
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const scope = url.searchParams.get('scope') || 'ALL'
    const value = url.searchParams.get('value')

    const now = new Date()

    const whereClause: any = {
      isPinned: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } }
      ]
    }

    if (scope !== 'ALL') {
      whereClause.OR = [
        { targetScope: 'ALL' },
        { targetScope: scope, targetValue: value }
      ]
    }

    const announcements = await db.khalifaAnnouncement.findMany({
      where: whereClause,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 10
    })

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error('Get announcements error:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب المنشورات' }, { status: 500 })
  }
}

// إنشاء منشور رسمي جديد
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, type, priority, targetScope, targetValue, expiresAt } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'العنوان والمحتوى مطلوبان' }, { status: 400 })
    }

    const announcement = await db.khalifaAnnouncement.create({
      data: {
        title,
        content,
        type: type || 'ANNOUNCEMENT',
        priority: priority || 'NORMAL',
        targetScope: targetScope || 'ALL',
        targetValue,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isPinned: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم نشر المنشور الرسمي بنجاح',
      announcement
    })
  } catch (error) {
    console.error('Create announcement error:', error)
    return NextResponse.json({ error: 'حدث خطأ في نشر المنشور' }, { status: 500 })
  }
}

// حذف منشور رسمي
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'صلاحيات الخليفة مطلوبة' }, { status: 403 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'معرف المنشور مطلوب' }, { status: 400 })
    }

    await db.khalifaAnnouncement.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف المنشور بنجاح'
    })
  } catch (error) {
    console.error('Delete announcement error:', error)
    return NextResponse.json({ error: 'حدث خطأ في حذف المنشور' }, { status: 500 })
  }
}
