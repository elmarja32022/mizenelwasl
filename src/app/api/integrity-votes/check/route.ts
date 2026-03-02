import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const targetId = searchParams.get('targetId')

    if (!targetId) {
      return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
    }

    if (targetId === user.id) {
      return NextResponse.json({ canVote: false, reason: 'لا يمكنك التصويت لنفسك' })
    }

    const targetUser = await db.user.findUnique({
      where: { id: targetId },
      select: { id: true, name: true, image: true, city: true, country: true }
    })
    if (!targetUser) {
      return NextResponse.json({ canVote: false, reason: 'المستخدم غير موجود' })
    }

    const existingVote = await db.integrityVote.findUnique({
      where: { voterId_targetId: { voterId: user.id, targetId } }
    })
    if (existingVote) {
      return NextResponse.json({ canVote: false, reason: 'سبق وقمت بالتصويت لهذا المستخدم', existingVote })
    }

    return NextResponse.json({ canVote: true, targetUser })
  } catch (error) {
    console.error('Error checking vote eligibility:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
