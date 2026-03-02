import { NextRequest, NextResponse } from 'next/server'

// POST - رفع الصور وتحويلها إلى base64
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('images') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'لم يتم إرسال صور' }, { status: 400 })
    }

    const maxFileSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    
    const images: string[] = []
    
    for (const file of files) {
      if (file.size > maxFileSize) {
        return NextResponse.json({ 
          error: `الصورة "${file.name}" كبيرة جداً. الحد الأقصى 5MB` 
        }, { status: 400 })
      }
      
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: `نوع الملف "${file.type}" غير مدعوم. الأنواع المدعومة: JPEG, PNG, GIF, WebP` 
        }, { status: 400 })
      }
      
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
      images.push(base64)
    }

    return NextResponse.json({ 
      success: true, 
      images,
      count: images.length 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء رفع الصور' }, { status: 500 })
  }
}
