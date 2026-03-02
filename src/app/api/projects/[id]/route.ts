import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

// GET - جلب تفاصيل مشروع
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const { id } = await params

    const project = await db.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            city: true,
            country: true,
            trustLevel: true,
            integrityScore: true
          }
        },
        supports: {
          include: {
            supporter: {
              select: { id: true, name: true, image: true, trustLevel: true }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 })
    }

    // التحقق من الصلاحية
    if (!project.isPublic && project.creatorId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 403 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// PUT - تحديث مشروع
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const project = await db.project.findUnique({
      where: { id }
    })

    if (!project) {
      return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 })
    }

    // فقط صاحب المشروع أو المشرف يمكنه التحديث
    if (project.creatorId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'غير مصرح بالتحديث' }, { status: 403 })
    }

    const updatedProject = await db.project.update({
      where: { id },
      data: {
        ...data,
        images: data.images ? JSON.stringify(data.images) : project.images,
        updatedAt: new Date()
      },
      include: {
        creator: {
          select: { id: true, name: true, image: true }
        }
      }
    })

    return NextResponse.json({ success: true, project: updatedProject })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// DELETE - حذف مشروع
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const { id } = await params

    const project = await db.project.findUnique({
      where: { id }
    })

    if (!project) {
      return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 })
    }

    // فقط صاحب المشروع أو المشرف يمكنه الحذف
    if (project.creatorId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'غير مصرح بالحذف' }, { status: 403 })
    }

    await db.project.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
