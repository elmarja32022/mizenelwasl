import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - جلب الفئات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // SERVICE | PRODUCT

    const where: any = {}
    if (type) {
      where.type = type
    }

    let categories = await db.category.findMany({
      where,
      orderBy: { nameAr: 'asc' }
    })

    // إزالة التكرارات حسب الاسم
    const uniqueCategories = categories.filter((cat, index, self) =>
      index === self.findIndex(c => c.name === cat.name)
    )

    // إذا لم تكن هناك فئات، أضف الفئات الافتراضية
    if (uniqueCategories.length === 0) {
      const defaultCategories = [
        // فئات الخدمات
        { id: 'edu', name: 'Education', nameAr: 'التعليم', type: 'SERVICE', icon: 'book' },
        { id: 'tech', name: 'Technology', nameAr: 'التكنولوجيا', type: 'SERVICE', icon: 'laptop' },
        { id: 'health', name: 'Health', nameAr: 'الصحة والعافية', type: 'SERVICE', icon: 'heart' },
        { id: 'prof', name: 'Professional', nameAr: 'الخدمات المهنية', type: 'SERVICE', icon: 'briefcase' },
        { id: 'home', name: 'Home', nameAr: 'الخدمات المنزلية', type: 'SERVICE', icon: 'home' },
        { id: 'transport', name: 'Transport', nameAr: 'النقل', type: 'SERVICE', icon: 'car' },
        { id: 'crafts', name: 'Crafts', nameAr: 'الحرف اليدوية', type: 'SERVICE', icon: 'hammer' },
        { id: 'other-svc', name: 'Other Services', nameAr: 'خدمات أخرى', type: 'SERVICE', icon: 'more' },
        
        // فئات المنتجات
        { id: 'dairy', name: 'Dairy', nameAr: 'الألبان', type: 'PRODUCT', icon: 'milk' },
        { id: 'eggs', name: 'Eggs', nameAr: 'البيض', type: 'PRODUCT', icon: 'egg' },
        { id: 'dates', name: 'Dates', nameAr: 'التمر', type: 'PRODUCT', icon: 'date' },
        { id: 'vegetables', name: 'Vegetables', nameAr: 'الخضروات', type: 'PRODUCT', icon: 'vegetable' },
        { id: 'honey', name: 'Honey', nameAr: 'العسل', type: 'PRODUCT', icon: 'honey' },
        { id: 'oils', name: 'Oils', nameAr: 'الزيوت', type: 'PRODUCT', icon: 'oil' },
        { id: 'grains', name: 'Grains', nameAr: 'الحبوب', type: 'PRODUCT', icon: 'grain' },
        { id: 'nuts', name: 'Nuts', nameAr: 'المكسرات', type: 'PRODUCT', icon: 'nut' },
        { id: 'bakery', name: 'Bakery', nameAr: 'المخبوزات', type: 'PRODUCT', icon: 'bread' },
        { id: 'fish', name: 'Fish', nameAr: 'الأسماك', type: 'PRODUCT', icon: 'fish' },
        { id: 'fruits', name: 'Fruits', nameAr: 'الفواكه', type: 'PRODUCT', icon: 'fruit' },
        { id: 'other-prod', name: 'Other Products', nameAr: 'منتجات أخرى', type: 'PRODUCT', icon: 'package' }
      ]

      await db.category.createMany({ data: defaultCategories })
      return NextResponse.json({ categories: defaultCategories })
    }

    return NextResponse.json({ categories: uniqueCategories })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
