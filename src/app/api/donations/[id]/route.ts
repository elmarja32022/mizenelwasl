import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/auth'

// PUT - تحديث حالة التبرع
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const donation = await prisma.donation.findUnique({
      where: { id: params.id },
      include: { donor: true }
    })

    if (!donation) {
      return NextResponse.json({ error: 'التبرع غير موجود' }, { status: 404 })
    }

    // فقط صاحب التبرع أو المشرف يمكنه تحديثه
    if (donation.donorId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'غير مصرح بتحديث هذا التبرع' }, { status: 403 })
    }

    const data = await request.json()
    const { status, notes } = data

    const validStatuses = ['PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 })
    }

    const updateData: any = {}
    if (status) {
      updateData.status = status
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date()
      }
    }
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const updatedDonation = await prisma.donation.update({
      where: { id: params.id },
      data: updateData,
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            image: true,
            city: true,
            trustLevel: true,
            integrityScore: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      donation: updatedDonation
    })
  } catch (error) {
    console.error('Error updating donation:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// DELETE - حذف التبرع
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const donation = await prisma.donation.findUnique({
      where: { id: params.id }
    })

    if (!donation) {
      return NextResponse.json({ error: 'التبرع غير موجود' }, { status: 404 })
    }

    // فقط صاحب التبرع أو المشرف يمكنه حذفه
    if (donation.donorId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'غير مصرح بحذف هذا التبرع' }, { status: 403 })
    }

    // فقط التبرعات المعلقة يمكن حذفها
    if (donation.status !== 'PENDING' && !user.isAdmin) {
      return NextResponse.json({ error: 'لا يمكن حذف تبرع تمت معالجته' }, { status: 400 })
    }

    await prisma.donation.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting donation:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
