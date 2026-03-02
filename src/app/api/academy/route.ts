import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/auth'

// جلب الدورات المنشورة للمستخدمين
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)

    const courses = await db.academyCourse.findMany({
      where: { isPublished: true },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            duration: true,
            order: true,
            imageUrl: true
          }
        },
        _count: {
          select: { lessons: { where: { isPublished: true } } }
        }
      },
      orderBy: { order: 'asc' }
    })

    // إذا كان المستخدم مسجل، جلب تقدمه
    let userProgress: any[] = []
    if (user) {
      userProgress = await db.userLessonProgress.findMany({
        where: { userId: user.id }
      })
    }

    // حساب نسبة التقدم لكل دورة
    const coursesWithProgress = courses.map(course => {
      const totalLessons = course._count.lessons
      const completedLessons = userProgress.filter(p =>
        course.lessons.some(l => l.id === p.lessonId) && p.completed
      ).length
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

      return {
        ...course,
        progressPercentage,
        completedLessons,
        totalLessons
      }
    })

    return NextResponse.json({ 
      courses: coursesWithProgress,
      progress: userProgress 
    })
  } catch (error) {
    console.error('Get public academy error:', error)
    return NextResponse.json({ error: 'حدث خطأ في جلب الدورات' }, { status: 500 })
  }
}
