import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// بيانات تجريبية
export async function POST(request: NextRequest) {
  try {
    // Check if this is a Vercel deployment with read-only filesystem
    const isVercel = process.env.VERCEL === '1'
    
    if (isVercel) {
      return NextResponse.json({ 
        error: 'هذه الميزة غير متوفرة في بيئة الإنتاج. قاعدة البيانات للقراءة فقط.',
        hint: 'استخدم قاعدة بيانات سحابية مثل Vercel Postgres أو Supabase للبيانات الديناميكية.'
      }, { status: 403 })
    }
    
    // التحقق من وجود بيانات مسبقة
    const existingUsers = await db.user.count()
    if (existingUsers > 0) {
      return NextResponse.json({ message: 'البيانات موجودة مسبقاً', count: existingUsers })
    }

    // إنشاء مستخدمين تجريبيين
    const hashedPassword = crypto.createHash('sha256').update('123456').digest('hex')
    
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
          trustLevel: 'مميز',
          rating: 4.8,
          totalExchanges: 12
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
          trustLevel: 'موثوق جداً',
          rating: 4.5,
          totalExchanges: 8
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
          trustLevel: 'موثوق جداً',
          rating: 4.2,
          totalExchanges: 5
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
          trustLevel: 'موثوق',
          rating: 3.9,
          totalExchanges: 3
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
          trustLevel: 'مميز',
          rating: 4.9,
          totalExchanges: 15
        }
      })
    ])

    // إنشاء فئات
    const categories = await Promise.all([
      // فئات الخدمات
      db.category.create({ data: { name: 'Education', nameAr: 'التعليم', type: 'SERVICE', icon: 'book' } }),
      db.category.create({ data: { name: 'Technology', nameAr: 'التكنولوجيا', type: 'SERVICE', icon: 'laptop' } }),
      db.category.create({ data: { name: 'Health', nameAr: 'الصحة والعافية', type: 'SERVICE', icon: 'heart' } }),
      db.category.create({ data: { name: 'Professional', nameAr: 'الخدمات المهنية', type: 'SERVICE', icon: 'briefcase' } }),
      db.category.create({ data: { name: 'Home', nameAr: 'الخدمات المنزلية', type: 'SERVICE', icon: 'home' } }),
      
      // فئات المنتجات
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
    const services = await Promise.all([
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
      }),
      db.service.create({
        data: {
          title: 'أحتاج دروس في الرياضيات',
          titleAr: 'أحتاج دروس في الرياضيات',
          description: 'أبحث عن معلم رياضيات لمساعدة ابني في الصف الثالث المتوسط.',
          type: 'REQUEST',
          category: 'Education',
          duration: 60,
          userId: users[3].id
        }
      }),
      db.service.create({
        data: {
          title: 'خدمات سباكة',
          titleAr: 'خدمات سباكة',
          description: 'جميع أعمال السباكة. تصليح تسريبات، تركيب صواني، وصيانة عامة.',
          type: 'OFFER',
          category: 'Home',
          duration: 120,
          userId: users[4].id
        }
      }),
      db.service.create({
        data: {
          title: 'أحتاج مصمم جرافيك',
          titleAr: 'أحتاج مصمم جرافيك',
          description: 'أبحث عن مصمم جرافيك لتصميم شعار لمشروعي الجديد.',
          type: 'REQUEST',
          category: 'Professional',
          duration: 180,
          userId: users[0].id
        }
      })
    ])

    // إنشاء منتجات تجريبية
    const products = await Promise.all([
      db.product.create({
        data: {
          name: 'عسل طبيعي سدر',
          nameAr: 'عسل طبيعي سدر',
          description: 'عسل سدر طبيعي 100% من مناحلنا في جبال السروات. جودة ممتازة.',
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
          description: 'تمر خلاص من مزرعتنا في الأحساء. طعم ممتاز وجودة عالية.',
          quantity: 20,
          unit: 'كيلو',
          quality: 'ممتاز',
          type: 'OFFER',
          category: 'Dates',
          userId: users[0].id
        }
      }),
      db.product.create({
        data: {
          name: 'بيض بلدي طازج',
          nameAr: 'بيض بلدي طازج',
          description: 'بيض بلدي طازج من دجاج تربيتنا المنزلية. طبيعي 100%.',
          quantity: 30,
          unit: 'قطعة',
          quality: 'جيد جداً',
          type: 'OFFER',
          category: 'Eggs',
          userId: users[1].id
        }
      }),
      db.product.create({
        data: {
          name: 'خضروات عضوية',
          nameAr: 'خضروات عضوية',
          description: 'خضروات طازجة من مزرعتنا. طماطم، خيار، فلفل، بقدونس.',
          quantity: 10,
          unit: 'كيلو',
          quality: 'جيد جداً',
          type: 'OFFER',
          category: 'Vegetables',
          userId: users[2].id
        }
      }),
      db.product.create({
        data: {
          name: 'أحتاج حليب طازج',
          nameAr: 'أحتاج حليب طازج',
          description: 'أبحث عن حليب طازج يومياً. الكمية: 2 لتر يومياً.',
          quantity: 14,
          unit: 'لتر',
          quality: 'جيد جداً',
          type: 'REQUEST',
          category: 'Dairy',
          userId: users[3].id
        }
      }),
      db.product.create({
        data: {
          name: 'سمك طازج',
          nameAr: 'سمك طازج',
          description: 'سمك هامور طازج من سواحل الخليج. يتم صيده يومياً.',
          quantity: 8,
          unit: 'كيلو',
          quality: 'ممتاز',
          type: 'OFFER',
          category: 'Fish',
          userId: users[4].id
        }
      })
    ])

    // إنشاء منشورات مجتمعية
    const posts = await Promise.all([
      db.communityPost.create({
        data: {
          title: 'قصة نجاح: كيف غيّر الميزان حياتي',
          content: 'كنت أبحث عن طريقة لأستفيد من مهاراتي في التعليم. من خلال الميزان، تمكنت من تبادل دروس الرياضيات مع خدمات أحتاجها. شكراً لهذه المنصة الرائعة!',
          type: 'SUCCESS_STORY',
          userId: users[0].id
        }
      }),
      db.communityPost.create({
        data: {
          title: 'اقتراح: إضافة نظام التقييم بالنجوم',
          content: 'أقترح إضافة نظام تقييم بالنجوم لكل خدمة ومنتج. هذا سيساعد في تحسين جودة التبادلات وزيادة الثقة بين الأعضاء.',
          type: 'SUGGESTION',
          userId: users[1].id
        }
      }),
      db.communityPost.create({
        data: {
          title: 'نقاش: أفضل طريقة لزيادة رصيد الساعات',
          content: 'ما هي أفضل طريقة لزيادة رصيد الساعات؟ هل تعتمدون على الخدمات أم المنتجات؟ شاركونا تجاربكم!',
          type: 'DISCUSSION',
          userId: users[2].id
        }
      })
    ])

    // إنشاء إشعارات تجريبية
    await Promise.all([
      db.notification.create({
        data: {
          type: 'SYSTEM',
          title: 'مرحباً بك في الميزان!',
          message: 'أهلاً أحمد! رصيدك الافتتاحي 5 ساعات. ابدأ التبادل الآن!',
          userId: users[0].id
        }
      }),
      db.notification.create({
        data: {
          type: 'EXCHANGE_REQUEST',
          title: 'طلب تبادل جديد',
          message: 'لديك طلب تبادل جديد من فاطمة علي',
          userId: users[0].id
        }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء البيانات التجريبية بنجاح',
      stats: {
        users: users.length,
        categories: categories.length,
        services: services.length,
        products: products.length,
        posts: posts.length
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء البيانات' }, { status: 500 })
  }
}
