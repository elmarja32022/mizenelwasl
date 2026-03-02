import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/auth'

// جلب تقدم المستخدم في درس معين
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const url = new URL(request.url)
    const lessonId = url.searchParams.get('lessonId')

    if (!lessonId) {
      // جلب كل تقدم المستخدم
      const progress = await db.userLessonProgress.findMany({
        where: { userId: user.id }
      })
      return NextResponse.json({ progress })
    }

    const lessonProgress = await db.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId
        }
      }
    })

    return NextResponse.json({ progress: lessonProgress })
  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// تسجيل إكمال درس
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const body = await request.json()
    const { lessonId, completed } = body

    if (!lessonId) {
      return NextResponse.json({ error: 'معرف الدرس مطلوب' }, { status: 400 })
    }

    // التحقق من وجود الدرس
    const lesson = await db.academyLesson.findUnique({
      where: { id: lessonId }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 })
    }

    const progress = await db.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId
        }
      },
      update: {
        completed: completed !== false,
        completedAt: completed !== false ? new Date() : null
      },
      create: {
        userId: user.id,
        lessonId,
        completed: completed !== false,
        completedAt: completed !== false ? new Date() : null
      }
    })

    // إذا أكمل الدرس، أضف إشعار
    if (completed !== false) {
      // التحقق من إكمال جميع دروس الدورة
      const courseLessons = await db.academyLesson.findMany({
        where: { courseId: lesson.courseId, isPublished: true }
      })

      const allProgress = await db.userLessonProgress.findMany({
        where: {
          userId: user.id,
          lessonId: { in: courseLessons.map(l => l.id) },
          completed: true
        }
      })

      if (allProgress.length === courseLessons.length && courseLessons.length > 0) {
        // أكمل جميع دروس الدورة
        const course = await db.academyCourse.findUnique({
          where: { id: lesson.courseId }
        })

        await db.notification.create({
          data: {
            type: 'SYSTEM',
            title: 'تهانينا! 🎉',
            message: `لقد أكملت دورة "${course?.title}" بنجاح في أكاديمية ميزان الوصل!`,
            userId: user.id
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: completed !== false ? 'تم تسجيل إكمال الدرس' : 'تم إلغاء إكمال الدرس',
      progress
    })
  } catch (error) {
    console.error('Update progress error:', error)
    return NextResponse.json({ error: 'حدث خطأ في تحديث التقدم' }, { status: 500 })
  }
}
