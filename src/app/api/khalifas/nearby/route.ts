import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - جلب الخلفاء القريبين حسب الموقع
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    // جلب بيانات المستخدم الحالي
    const currentUser = await db.user.findUnique({
      where: { id: sessionId },
      select: { country: true, city: true, neighborhood: true }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // جلب كل الخلفاء مع ترتيب حسب القرب
    const allUsers = await db.user.findMany({
      where: {
        id: { not: sessionId } // استبعاد المستخدم الحالي
      },
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        neighborhood: true,
        trustLevel: true,
        integrityScore: true,
        rating: true,
        totalExchanges: true,
        timeBalance: true,
        createdAt: true
      }
    })

    // ترتيب حسب القرب الجغرافي
    const sortedUsers = allUsers.map(user => {
      let proximityScore = 0
      let proximityLevel = ''
      
      // نفس الحي = الأقرب
      if (user.country === currentUser.country && 
          user.city === currentUser.city && 
          user.neighborhood === currentUser.neighborhood &&
          user.neighborhood) {
        proximityScore = 100
        proximityLevel = 'نفس الحي'
      }
      // نفس المدينة
      else if (user.country === currentUser.country && 
               user.city === currentUser.city) {
        proximityScore = 80
        proximityLevel = 'نفس المدينة'
      }
      // نفس الدولة
      else if (user.country === currentUser.country) {
        proximityScore = 60
        proximityLevel = 'نفس الدولة'
      }
      // دول مجاورة (يمكن إضافة منطق أكثر تعقيداً)
      else if (user.country) {
        proximityScore = 30
        proximityLevel = 'دولة أخرى'
      }
      // بدون موقع محدد
      else {
        proximityScore = 10
        proximityLevel = 'غير محدد'
      }

      return {
        ...user,
        proximityScore,
        proximityLevel
      }
    }).sort((a, b) => {
      // ترتيب حسب القرب أولاً، ثم حسب النزاهة
      if (b.proximityScore !== a.proximityScore) {
        return b.proximityScore - a.proximityScore
      }
      return b.integrityScore - a.integrityScore
    })

    // تقسيم الخلفاء حسب مستوى القرب
    const nearbyKhalifas = {
      sameNeighborhood: sortedUsers.filter(u => u.proximityLevel === 'نفس الحي'),
      sameCity: sortedUsers.filter(u => u.proximityLevel === 'نفس المدينة'),
      sameCountry: sortedUsers.filter(u => u.proximityLevel === 'نفس الدولة'),
      otherCountries: sortedUsers.filter(u => u.proximityLevel === 'دولة أخرى')
    }

    // إحصائيات
    const stats = {
      total: allUsers.length,
      sameNeighborhood: nearbyKhalifas.sameNeighborhood.length,
      sameCity: nearbyKhalifas.sameCity.length,
      sameCountry: nearbyKhalifas.sameCountry.length,
      otherCountries: nearbyKhalifas.otherCountries.length
    }

    return NextResponse.json({
      khalifas: sortedUsers.slice(0, 50), // أول 50 خليفة
      nearbyKhalifas,
      stats,
      currentUserLocation: {
        country: currentUser.country,
        city: currentUser.city,
        neighborhood: currentUser.neighborhood
      }
    })
  } catch (error) {
    console.error('Get nearby khalifas error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
