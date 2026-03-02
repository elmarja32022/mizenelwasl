import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// إنشاء البيانات الأولية بما فيها الخليفة المختار
export async function POST(request: NextRequest) {
  try {
    // التحقق من وجود بيانات مسبقة
    const existingUsers = await db.user.count()
    if (existingUsers > 0) {
      return NextResponse.json({ message: 'البيانات موجودة مسبقاً', count: existingUsers })
    }

    const hashedPassword = crypto.createHash('sha256').update('123456').digest('hex')
    
    // إنشاء الخليفة المختار (الأدمن)
    const khalifa = await db.user.create({
      data: {
        email: 'khalifa@mizan.com',
        name: 'الخليفة المختار',
        password: hashedPassword,
        phone: '0500000000',
        country: 'SA',
        city: 'مكة المكرمة',
        neighborhood: 'الحرم',
        timeBalance: 999999,
        integrityScore: 100,
        trustLevel: 'خليفة مميز',
        rating: 5.0,
        totalExchanges: 0,
        isAdmin: true,
        covenantSigned: true,
        covenantSignedAt: new Date()
      }
    })
    
    // إنشاء مستخدمين تجريبيين
    const users = await Promise.all([
      db.user.create({
        data: {
          email: 'ahmed@example.com',
          name: 'أحمد محمد',
          password: hashedPassword,
          phone: '0501234567',
          country: 'SA',
          city: 'الرياض',
          neighborhood: 'النرجس',
          timeBalance: 480,
          integrityScore: 95,
          trustLevel: 'خليفة مميز',
          rating: 4.8,
          totalExchanges: 12,
          covenantSigned: true,
          covenantSignedAt: new Date()
        }
      }),
      db.user.create({
        data: {
          email: 'fatima@example.com',
          name: 'فاطمة علي',
          password: hashedPassword,
          phone: '0507654321',
          country: 'SA',
          city: 'جدة',
          neighborhood: 'الحمرة',
          timeBalance: 320,
          integrityScore: 88,
          trustLevel: 'خليفة صادق',
          rating: 4.5,
          totalExchanges: 8,
          covenantSigned: true,
          covenantSignedAt: new Date()
        }
      }),
      db.user.create({
        data: {
          email: 'omar@example.com',
          name: 'عمر خالد',
          password: hashedPassword,
          phone: '0509876543',
          country: 'AE',
          city: 'دبي',
          neighborhood: 'المرسي',
          timeBalance: 200,
          integrityScore: 75,
          trustLevel: 'خليفة موثوق',
          rating: 4.2,
          totalExchanges: 5,
          covenantSigned: true,
          covenantSignedAt: new Date()
        }
      }),
      db.user.create({
        data: {
          email: 'sara@example.com',
          name: 'سارة أحمد',
          password: hashedPassword,
          phone: '0501112233',
          country: 'EG',
          city: 'القاهرة',
          neighborhood: 'مصر الجديدة',
          timeBalance: 150,
          integrityScore: 65,
          trustLevel: 'خليفة موثوق',
          rating: 3.9,
          totalExchanges: 3,
          covenantSigned: true,
          covenantSignedAt: new Date()
        }
      }),
      db.user.create({
        data: {
          email: 'khalid@example.com',
          name: 'خالد سعيد',
          password: hashedPassword,
          phone: '0504445566',
          country: 'SA',
          city: 'الدمام',
          neighborhood: 'الفيصلية',
          timeBalance: 400,
          integrityScore: 92,
          trustLevel: 'خليفة مميز',
          rating: 4.9,
          totalExchanges: 15,
          covenantSigned: true,
          covenantSignedAt: new Date()
        }
      })
    ])

    // إنشاء فئات
    const categories = await Promise.all([
      db.category.create({ data: { name: 'Education', nameAr: 'التعليم', type: 'SERVICE', icon: 'book' } }),
      db.category.create({ data: { name: 'Technology', nameAr: 'التكنولوجيا', type: 'SERVICE', icon: 'laptop' } }),
      db.category.create({ data: { name: 'Health', nameAr: 'الصحة والعافية', type: 'SERVICE', icon: 'heart' } }),
      db.category.create({ data: { name: 'Professional', nameAr: 'الخدمات المهنية', type: 'SERVICE', icon: 'briefcase' } }),
      db.category.create({ data: { name: 'Home', nameAr: 'الخدمات المنزلية', type: 'SERVICE', icon: 'home' } }),
      db.category.create({ data: { name: 'Dairy', nameAr: 'الألبان', type: 'PRODUCT', icon: 'milk' } }),
      db.category.create({ data: { name: 'Eggs', nameAr: 'البيض', type: 'PRODUCT', icon: 'egg' } }),
      db.category.create({ data: { name: 'Dates', nameAr: 'التمر', type: 'PRODUCT', icon: 'date' } }),
      db.category.create({ data: { name: 'Vegetables', nameAr: 'الخضروات', type: 'PRODUCT', icon: 'vegetable' } }),
      db.category.create({ data: { name: 'Honey', nameAr: 'العسل', type: 'PRODUCT', icon: 'honey' } }),
      db.category.create({ data: { name: 'Fish', nameAr: 'الأسماك', type: 'PRODUCT', icon: 'fish' } }),
      db.category.create({ data: { name: 'Nuts', nameAr: 'المكسرات', type: 'PRODUCT', icon: 'nut' } }),
      db.category.create({ data: { name: 'Bakery', nameAr: 'المخبوزات', type: 'PRODUCT', icon: 'bread' } })
    ])

    // إنشاء خدمات تجريبية
    await Promise.all([
      db.service.create({
        data: {
          title: 'دروس في اللغة الإنجليزية',
          titleAr: 'دروس في اللغة الإنجليزية',
          description: 'أقدم دروس خصوصية في اللغة الإنجليزية لجميع المستويات. خبرة 5 سنوات في التدريس.',
          type: 'OFFER',
          category: 'Education',
          duration: 60,
          userId: users[0].id
        }
      }),
      db.service.create({
        data: {
          title: 'تصليح أجهزة الكمبيوتر',
          titleAr: 'تصليح أجهزة الكمبيوتر',
          description: 'تصليح وصيانة أجهزة الكمبيوتر واللابتوب. تركيب البرامج وإزالة الفيروسات.',
          type: 'OFFER',
          category: 'Technology',
          duration: 90,
          userId: users[2].id
        }
      }),
      db.service.create({
        data: {
          title: 'طبخ وجبات منزلية',
          titleAr: 'طبخ وجبات منزلية',
          description: 'أطبخ وجبات منزلية صحية ولذيذة. متخصصة في المطبخ السعودي والخليجي.',
          type: 'OFFER',
          category: 'Home',
          duration: 120,
          userId: users[1].id
        }
      })
    ])

    // إنشاء منتجات تجريبية
    await Promise.all([
      db.product.create({
        data: {
          name: 'عسل طبيعي سدر',
          nameAr: 'عسل طبيعي سدر',
          description: 'عسل سدر طبيعي 100% من مناحلنا في جبال السروات.',
          quantity: 5,
          unit: 'كيلو',
          quality: 'ممتاز',
          type: 'OFFER',
          category: 'Honey',
          userId: users[4].id
        }
      }),
      db.product.create({
        data: {
          name: 'تمر خلاص',
          nameAr: 'تمر خلاص',
          description: 'تمر خلاص من مزرعتنا في الأحساء.',
          quantity: 20,
          unit: 'كيلو',
          quality: 'ممتاز',
          type: 'OFFER',
          category: 'Dates',
          userId: users[0].id
        }
      })
    ])

    // إنشاء منشور رسمي من الخليفة
    await db.khalifaAnnouncement.create({
      data: {
        title: 'مرحباً بكم في ميزان الوصل',
        content: 'يسرنا انضمامكم لمذهب ميزان الوصل. هذا المكان مخصص للتبادل العادل والتعاون بين الخلفاء. نرجو منكم الالتزام بميثاق الوصل والعهد.',
        type: 'ANNOUNCEMENT',
        priority: 'HIGH',
        isPinned: true,
        targetScope: 'ALL'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء البيانات الأولية بنجاح',
      khalifa: {
        email: 'khalifa@mizan.com',
        password: '123456'
      },
      stats: {
        users: users.length + 1,
        categories: categories.length
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء البيانات' }, { status: 500 })
  }
}
