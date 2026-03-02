import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/auth';

// GET - Get single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await db.service.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
            country: true,
            trustLevel: true,
            rating: true,
            totalExchanges: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Get service error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الخدمة' },
      { status: 500 }
    );
  }
}

// PUT - Update service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const existingService = await db.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });
    }

    if (existingService.userId !== user.id) {
      return NextResponse.json({ error: 'غير مصرح بتعديل هذه الخدمة' }, { status: 403 });
    }

    const body = await request.json();
    const { title, titleAr, description, type, category, duration, status, images, videoUrl } = body;

    const service = await db.service.update({
      where: { id },
      data: {
        title,
        titleAr,
        description,
        type,
        category,
        duration: duration ? parseInt(duration) : undefined,
        status,
        images,
        videoUrl,
      },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الخدمة' },
      { status: 500 }
    );
  }
}

// DELETE - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const existingService = await db.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });
    }

    if (existingService.userId !== user.id) {
      return NextResponse.json({ error: 'غير مصرح بحذف هذه الخدمة' }, { status: 403 });
    }

    await db.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الخدمة' },
      { status: 500 }
    );
  }
}
