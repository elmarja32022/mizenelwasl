import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET: التحقق من إمكانية التصويت
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const targetId = searchParams.get('targetId')

    if (!targetId) {
      return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
    }

    // التحقق من عدم التصويت للنفس
    if (targetId === session.user.id) {
      return NextResponse.json({ 
        canVote: false, 
        reason: 'لا يمكنك التصويت لنفسك' 
      })
    }

    // التحقق من وجود المستخدم
    const targetUser = await prisma.user.findUnique({
      where: { id: targetId },
      select: { id: true, name: true }
    })

    if (!targetUser) {
      return NextResponse.json({ 
        canVote: false, 
        reason: 'المستخدم غير موجود' 
      })
    }

    // التحقق من عدم وجود تصويت سابق
    const existingVote = await prisma.integrityVote.findUnique({
      where: {
        voterId_targetId: {
          voterId: session.user.id,
          targetId
        }
      }
    })

    if (existingVote) {
      return NextResponse.json({ 
        canVote: false, 
        reason: 'سبق وقمت بالتصويت لهذا المستخدم',
        existingVote
      })
    }

    // التحقق من وجود تبادل مشترك
    const sharedExchanges = await prisma.exchange.findMany({
      where: {
        OR: [
          { initiatorId: session.user.id, providerId: targetId },
          { initiatorId: targetId, providerId: session.user.id }
        ],
        status: 'COMPLETED'
      },
      select: {
        id: true,
        type: true,
        timeAmount: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    return NextResponse.json({
      canVote: true,
      targetUser,
      hasSharedExchanges: sharedExchanges.length > 0,
      sharedExchanges
    })
  } catch (error) {
    console.error('Error checking vote eligibility:', error)
    return NextResponse.json({ error: 'حدث خطأ في التحقق' }, { status: 500 })
  }
}
