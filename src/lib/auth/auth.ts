import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import crypto from 'crypto';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  timeBalance: number;
  integrityScore: number;
  trustLevel: string;
  rating: number;
  totalExchanges: number;
  isAdmin: boolean;
  isSuspended: boolean;
}

// Hash password using SHA-256
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Verify password
export function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

// Create session
export async function createSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set('session_user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Get current user
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_user_id')?.value;
    
    if (!userId) return null;
    
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      country: user.country,
      city: user.city,
      neighborhood: user.neighborhood,
      timeBalance: user.timeBalance,
      integrityScore: user.integrityScore,
      trustLevel: user.trustLevel,
      rating: user.rating,
      totalExchanges: user.totalExchanges,
      isAdmin: user.isAdmin,
      isSuspended: user.isSuspended,
    };
  } catch {
    return null;
  }
}

// Clear session
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session_user_id');
}

// Calculate trust level based on integrity score
export function calculateTrustLevel(integrityScore: number): string {
  if (integrityScore >= 90) return 'مميز';
  if (integrityScore >= 70) return 'موثوق جداً';
  if (integrityScore >= 50) return 'موثوق';
  if (integrityScore >= 30) return 'محذر';
  return 'مجمد';
}

// Verify token from request cookies (for API routes)
export async function verifyToken(request: any): Promise<SessionUser | null> {
  try {
    const sessionId = request.cookies.get('session')?.value || 
                      request.cookies.get('session_user_id')?.value;
    
    if (!sessionId) return null;
    
    const user = await db.user.findUnique({
      where: { id: sessionId },
    });
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      country: user.country,
      city: user.city,
      neighborhood: user.neighborhood,
      timeBalance: user.timeBalance,
      integrityScore: user.integrityScore,
      trustLevel: user.trustLevel,
      rating: user.rating,
      totalExchanges: user.totalExchanges,
      isAdmin: user.isAdmin,
      isSuspended: user.isSuspended,
    };
  } catch {
    return null;
  }
}
