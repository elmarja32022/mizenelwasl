import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - جلب المنشورات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const where: any = {}
    if (type) {
      where.type = type
    }

    const posts = await db.communityPost.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, image: true, trustLevel: true, integrityScore: true }
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, image: true } }
          },
          orderBy: { createdAt: 'asc' }
        },
        votes: {
          include: {
            user: { select: { id: true, name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 30
    })

    // حساب الأصوات
    const postsWithVotes = posts.map(post => ({
      ...post,
      positiveVotes: post.votes.filter(v => v.type === 'POSITIVE').length,
      negativeVotes: post.votes.filter(v => v.type === 'NEGATIVE').length
    }))

    return NextResponse.json({ posts: postsWithVotes })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// POST - إضافة منشور
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, type } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'العنوان والمحتوى مطلوبان' }, { status: 400 })
    }

    const post = await db.communityPost.create({
      data: {
        title,
        content,
        type: type || 'POST',
        userId: sessionId
      },
      include: {
        user: { select: { id: true, name: true, trustLevel: true } }
      }
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
