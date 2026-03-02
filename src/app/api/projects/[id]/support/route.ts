import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

// POST - دعم مشروع
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const { id: projectId } = await params
    const data = await request.json()
    const { type, amount, hours, description } = data

    // التحقق من وجود المشروع
    const project = await db.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 })
    }

    // لا يمكن للمستخدم دعم مشروعه الخاص
    if (project.creatorId === user.id) {
      return NextResponse.json({ error: 'لا يمكنك دعم مشروعك الخاص' }, { status: 400 })
    }

    // التحقق من نوع الدعم
    const validTypes = ['TIME', 'MONEY', 'SKILL', 'MATERIALS']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'نوع الدعم غير صالح' }, { status: 400 })
    }

    // التحقق من أن المشروع يقبل هذا النوع من الدعم
    if (type === 'TIME' && !project.needsTime) {
      return NextResponse.json({ error: 'المشروع لا يحتاج دعم وقت' }, { status: 400 })
    }
    if (type === 'MONEY' && !project.needsMoney) {
      return NextResponse.json({ error: 'المشروع لا يحتاج دعم مالي' }, { status: 400 })
    }
    if (type === 'SKILL' && !project.needsSkills) {
      return NextResponse.json({ error: 'المشروع لا يحتاج مهارات' }, { status: 400 })
    }
    if (type === 'MATERIALS' && !project.needsMaterials) {
      return NextResponse.json({ error: 'المشروع لا يحتاج مواد' }, { status: 400 })
    }

    // التحقق من عدم وجود دعم سابق من نفس النوع
    const existingSupport = await db.projectSupport.findUnique({
      where: {
        projectId_supporterId_type: {
          projectId,
          supporterId: user.id,
          type
        }
      }
    })

    if (existingSupport) {
      return NextResponse.json({ error: 'سبق لك تقديم هذا النوع من الدعم' }, { status: 400 })
    }

    // إنشاء الدعم
    const support = await db.projectSupport.create({
      data: {
        projectId,
        supporterId: user.id,
        type,
        amount: type === 'MONEY' ? parseFloat(amount) || 0 : 0,
        hours: type === 'TIME' ? parseInt(hours) || 0 : 0,
        description: type === 'SKILL' || type === 'MATERIALS' ? description : null
      },
      include: {
        supporter: {
          select: { id: true, name: true, image: true }
        }
      }
    })

    // تحديث إحصائيات المشروع
    const updateData: any = {
      currentSupporters: { increment: 1 }
    }

    if (type === 'MONEY' && amount > 0) {
      updateData.currentAmount = { increment: parseFloat(amount) }
    }
    if (type === 'TIME' && hours > 0) {
      updateData.currentTime = { increment: parseInt(hours) }
    }

    // التحقق من اكتمال التمويل
    if (project.needsMoney && project.targetAmount > 0) {
      const newAmount = project.currentAmount + parseFloat(amount || 0)
      if (newAmount >= project.targetAmount) {
        updateData.status = 'FUNDED'
      }
    }

    await db.project.update({
      where: { id: projectId },
      data: updateData
    })

    // مكافأة النزاهة للداعم
    const integrityBonus = type === 'MONEY' ? 2 : type === 'TIME' ? 3 : type === 'SKILL' ? 4 : 2
    await db.user.update({
      where: { id: user.id },
      data: {
        integrityScore: Math.min(100, user.integrityScore + integrityBonus)
      }
    })

    // إشعار لصاحب المشروع
    await db.notification.create({
      data: {
        type: 'ANNOUNCEMENT',
        title: 'دعم جديد لمشروعك',
        message: `${user.name} قدم دعم ${type === 'MONEY' ? 'مالي' : type === 'TIME' ? 'وقت' : type === 'SKILL' ? 'مهارة' : 'مواد'} لمشروعك "${project.title}"`,
        userId: project.creatorId
      }
    })

    return NextResponse.json({
      success: true,
      support,
      integrityBonus
    })
  } catch (error) {
    console.error('Error supporting project:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// GET - جلب داعمي المشروع
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const { id: projectId } = await params

    const supports = await db.projectSupport.findMany({
      where: { projectId },
      include: {
        supporter: {
          select: { id: true, name: true, image: true, trustLevel: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ supports })
  } catch (error) {
    console.error('Error fetching supporters:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
