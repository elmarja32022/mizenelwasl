import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, calculateTrustLevel } from '@/lib/auth/auth';

// POST - Vote on user (integrity)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { targetId, type } = body; // type: POSITIVE | NEGATIVE

    if (!targetId || !type || !['POSITIVE', 'NEGATIVE'].includes(type)) {
      return NextResponse.json(
        { error: 'بيانات غير صالحة' },
        { status: 400 }
      );
    }

    if (targetId === user.id) {
      return NextResponse.json(
        { error: 'لا يمكنك التصويت على نفسك' },
        { status: 400 }
      );
    }

    const targetUser = await db.user.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // Check if user already voted on this user
    const existingVote = await db.vote.findFirst({
      where: {
        targetType: 'USER',
        targetId,
        userId: user.id,
      },
    });

    if (existingVote) {
      // If same vote type, remove it (toggle off)
      if (existingVote.type === type) {
        await db.vote.delete({
          where: { id: existingVote.id },
        });

        // Adjust integrity score
        const scoreChange = type === 'POSITIVE' ? -5 : 5;
        const newScore = Math.max(0, Math.min(100, targetUser.integrityScore + scoreChange));
        
        await db.user.update({
          where: { id: targetId },
          data: {
            integrityScore: newScore,
            trustLevel: calculateTrustLevel(newScore),
          },
        });

        return NextResponse.json({ success: true, action: 'removed' });
      }

      // Update vote type
      await db.vote.update({
        where: { id: existingVote.id },
        data: { type },
      });

      // Adjust integrity score (reverse previous and add new)
      const previousChange = existingVote.type === 'POSITIVE' ? -5 : 5;
      const newChange = type === 'POSITIVE' ? 5 : -5;
      const newScore = Math.max(0, Math.min(100, targetUser.integrityScore + previousChange + newChange));
      
      await db.user.update({
        where: { id: targetId },
        data: {
          integrityScore: newScore,
          trustLevel: calculateTrustLevel(newScore),
        },
      });

      return NextResponse.json({ success: true, action: 'updated' });
    }

    // Create new vote
    await db.vote.create({
      data: {
        type,
        targetType: 'USER',
        targetId,
        userId: user.id,
      },
    });

    // Update integrity score
    const scoreChange = type === 'POSITIVE' ? 5 : -5;
    const newScore = Math.max(0, Math.min(100, targetUser.integrityScore + scoreChange));
    
    await db.user.update({
      where: { id: targetId },
      data: {
        integrityScore: newScore,
        trustLevel: calculateTrustLevel(newScore),
      },
    });

    return NextResponse.json({ success: true, action: 'created' });
  } catch (error) {
    console.error('Vote on user error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التصويت' },
      { status: 500 }
    );
  }
}
