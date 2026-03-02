# ⚖️ ميزان الوصل

## مذهب العدل والتبادل

**منصة عالمية للتبادل العادل للخدمات والمنتجات** - دعوة للبشرية جمعاء للعودة إلى الأصل.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌟 الرؤية

**ميزان الوصل** ليس مجرد منصة رقمية، بل هو **مذهب حياة** يقوم على:

| القيمة | المعنى |
|--------|--------|
| ⚖️ **العدل** | أساس كل تعامل وتبادل |
| 💚 **النية الحسنة** | جوهر كل عمل وقول |
| 🤝 **التكافل** | روح المجتمع الواحد |
| 🛡️ **النزاهة** | عملة الثقة الحقيقية |
| 🔗 **الوصل والذكر** | الرابط مع الأصل |

---

## ✨ المميزات الرئيسية

### 🔄 بنك الوقت (Time Banking)
- كل خليفة يحصل على **5 ساعات** (300 دقيقة) عند التسجيل
- تبادل الخدمات بالوقت لا بالمال
- نظام عادل بدون ربا أو استغلال
- تحويل دقيق للوقت حسب نوع الخدمة

### 🛡️ نظام النزاهة والثقة
- **مقياس النزاهة**: 0-100% يقيس حسن النية والالتزام
- **مستويات الثقة**:
  - ⭐ خليفة مميز (90-100%)
  - ✨ خليفة صادق (75-89%)
  - ✓ خليفة موثوق (50-74%)
  - ⚠ تحت المراقبة (أقل من 50%)
- تقييم المجتمع الشفاف والعادل

### 📜 ميثاق الوصل والعهد
5 عهود ملزمة لكل خليفة ينضم للمنصة:

| العهد | الالتزام |
|-------|----------|
| ١. عهد النية والصدق | النية أساس كل الأفعال والمبادلات |
| ٢. عهد الاستخلاف والبيئة | خليفة في الأرض لا مستهلك لها |
| ٣. عهد العدالة والتبادل | لا ضرر ولا ضرار، تبادل منصف |
| ٤. عهد العلم والابتكار | العلم عبادة والابتكار خدمة |
| ٥. عهد الوصل والذكر | الرابط مع الأصل والذكر |

### 🖼️ دعم الصور
- رفع صور للخدمات (حتى 4 صور)
- رفع صور للمنتجات (حتى 4 صور)
- صورة الملف الشخصي للخليفة
- تخزين آمن بصيغة Base64

### 💬 التفاعلات الإسلامية
تفاعلات متوافقة مع المذهب:
- 🤲 **بارك الله** - تفاعل إيجابي
- 💚 **ما شاء الله** - تقدير وإعجاب
- ✨ **جزاك الله خيراً** - شكر وامتنان
- 💭 **نصيحة** - تغذية راجعة بناءة

### 🔔 نظام الإشعارات المتقدم
- إشعارات فورية للتبادلات
- تنبيهات التقييمات
- إشعارات من الخليفة المختار
- تصنيف الإشعارات (مقروءة/غير مقروءة)

---

## 🔐 لوحة تحكم الخليفة المختار

### الميزات الإدارية:
- **📊 نظرة عامة**: إحصائيات شاملة عن المنصة
- **👥 إدارة الخلفاء**: عرض، بحث، إيقاف، تفعيل، تعيين صلاحيات
- **📢 إرسال إشعارات**: للجميع/دولة/مدينة/حي/فرد
- **📜 المنشورات الرسمية**: نشر وإدارة الإعلانات الرسمية

### بيانات الدخول الافتراضية:
```
البريد: khalifa@mizan.com
كلمة المرور: 123456
```

---

## 🏗️ البنية التقنية

### الإطار الأساسي
| التقنية | الإصدار | الوصف |
|---------|---------|-------|
| Next.js | 16.1 | App Router مع Turbopack |
| TypeScript | 5.0 | نوعية آمنة |
| Tailwind CSS | 4.0 | تصميم متجاوب |
| Prisma | 6.0 | ORM لقاعدة البيانات |
| SQLite | - | قاعدة بيانات خفيفة |

### المكتبات المستخدمة
- **Framer Motion** - حركات سلسة وانيميشن
- **shadcn/ui** - مكونات جميلة وقابلة للتخصيص
- **Lucide React** - أيقونات متعددة
- **Radix UI** - وصولية عالية (Accessibility)

---

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── api/                    # واجهات البرمجة (APIs)
│   │   ├── auth/               # المصادقة
│   │   │   ├── login/          # تسجيل الدخول
│   │   │   ├── register/       # إنشاء حساب
│   │   │   ├── logout/         # تسجيل الخروج
│   │   │   └── me/             # بيانات المستخدم الحالي
│   │   ├── services/           # الخدمات (CRUD)
│   │   ├── products/           # المنتجات (CRUD)
│   │   ├── exchanges/          # التبادلات
│   │   ├── community/          # المجتمع والمنشورات
│   │   │   └── [id]/
│   │   │       ├── vote/       # التصويت على المنشورات
│   │   │       └── comment/    # التعليقات
│   │   ├── notifications/      # الإشعارات
│   │   ├── categories/         # فئات الخدمات والمنتجات
│   │   ├── locations/          # الدول والمدن
│   │   ├── stats/              # الإحصائيات
│   │   ├── upload/             # رفع الصور
│   │   ├── admin/              # لوحة تحكم الخليفة
│   │   │   ├── stats/          # إحصائيات الإدارة
│   │   │   ├── notifications/  # إرسال الإشعارات
│   │   │   ├── announcements/  # المنشورات الرسمية
│   │   │   └── users/          # إدارة المستخدمين
│   │   ├── khalifas/           # الخلفاء القريبون
│   │   ├── messages/           # الرسائل المباشرة
│   │   ├── integrity/          # نظام النزاهة
│   │   ├── contact/            # نموذج التواصل
│   │   └── seed/               # البيانات الأولية
│   ├── globals.css             # الأنماط العامة
│   ├── layout.tsx              # التخطيط الرئيسي
│   └── page.tsx                # الصفحة الرئيسية
├── components/
│   ├── ui/                     # مكونات shadcn/ui
│   ├── auth/                   # مكونات المصادقة
│   ├── admin/                  # لوحة تحكم الخليفة
│   └── time-bank/              # مكونات بنك الوقت
├── hooks/                      # React Hooks مخصصة
│   ├── use-toast.ts            # إشعارات Toast
│   └── use-mobile.ts           # اكتشاف الأجهزة المحمولة
└── lib/
    ├── db.ts                   # اتصال Prisma
    ├── auth/                   # أدوات المصادقة
    │   └── auth.ts             # التحقق والجلسات
    ├── utils.ts                # أدوات مساعدة
    └── env.ts                  # متغيرات البيئة
```

---

## 🚀 التشغيل

### المتطلبات
- Node.js 18+
- Bun (أو npm/yarn)

### التثبيت والتشغيل

```bash
# استنساخ المشروع
git clone https://github.com/elmarja32022/mizenelwasl.git
cd mizenelwasl

# تثبيت المتطلبات
bun install

# توليد Prisma Client
bun run db:generate

# تهيئة قاعدة البيانات
bun run db:push

# إنشاء البيانات الأولية (اختياري)
curl -X POST http://localhost:3000/api/seed

# تشغيل الخادم التطويري
bun run dev

# بناء للإنتاج
bun run build

# تشغيل الإنتاج
bun run start
```

### فتح المنصة
```
http://localhost:3000
```

---

## 📊 API Endpoints

### المصادقة
| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/auth/register` | POST | تسجيل خليفة جديد |
| `/api/auth/login` | POST | تسجيل الدخول |
| `/api/auth/logout` | POST | تسجيل الخروج |
| `/api/auth/me` | GET | بيانات الخليفة الحالي |

### الخدمات والمنتجات
| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/services` | GET/POST | عرض/إضافة خدمات |
| `/api/services/[id]` | GET/PUT/DELETE | عرض/تعديل/حذف خدمة |
| `/api/products` | GET/POST | عرض/إضافة منتجات |
| `/api/products/[id]` | GET/PUT/DELETE | عرض/تعديل/حذف منتج |

### التبادلات
| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/exchanges` | GET/POST | عرض/إنشاء تبادل |
| `/api/exchanges/[id]` | PUT | تحديث حالة التبادل |

### المجتمع
| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/community` | GET/POST | المنشورات المجتمعية |
| `/api/community/[id]/vote` | POST | التصويت على منشور |
| `/api/community/[id]/comment` | POST | إضافة تعليق |

### الإدارة (للخليفة المختار)
| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/admin/stats` | GET | إحصائيات المنصة |
| `/api/admin/users` | GET/PATCH | إدارة المستخدمين |
| `/api/admin/notifications` | GET/POST | إرسال إشعارات |
| `/api/admin/announcements` | GET/POST/DELETE | المنشورات الرسمية |

### أخرى
| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/stats` | GET | إحصائيات عامة |
| `/api/categories` | GET | فئات الخدمات والمنتجات |
| `/api/locations` | GET | الدول والمدن |
| `/api/upload` | POST | رفع الصور |
| `/api/notifications` | GET | إشعارات المستخدم |
| `/api/khalifas/nearby` | GET | الخلفاء القريبون |
| `/api/messages` | GET/POST | الرسائل المباشرة |

---

## 🗄️ نماذج قاعدة البيانات

### User (الخليفة)
```prisma
model User {
  id             String   @id
  email          String   @unique
  name           String
  password       String
  phone          String?
  image          String?          // صورة الملف الشخصي
  country        String?
  city           String?
  neighborhood   String?
  timeBalance    Int      @default(300)  // 5 ساعات
  integrityScore Int      @default(100)
  trustLevel     String   @default("موثوق")
  isAdmin        Boolean  @default(false)
  isSuspended    Boolean  @default(false)
  covenantSigned Boolean  @default(false)
  // ... علاقات أخرى
}
```

### Service (الخدمة)
```prisma
model Service {
  id          String
  title       String
  description String
  type        String   // OFFER | REQUEST
  category    String
  duration    Int      // بالدقائق
  status      String   // ACTIVE | PENDING | COMPLETED
  images      String?  // JSON array of base64
  userId      String
  // ... علاقات
}
```

### Product (المنتج)
```prisma
model Product {
  id          String
  name        String
  description String?
  quantity    Float
  unit        String
  quality     String
  type        String   // OFFER | REQUEST
  category    String
  images      String?
  userId      String
  // ... علاقات
}
```

### KhalifaAnnouncement (المنشورات الرسمية)
```prisma
model KhalifaAnnouncement {
  id          String
  title       String
  content     String
  type        String   // ANNOUNCEMENT | WARNING | UPDATE | EVENT
  priority    String   // HIGH | NORMAL | LOW
  isPinned    Boolean  @default(true)
  targetScope String   // ALL | COUNTRY | CITY | NEIGHBORHOOD
  targetValue String?
  expiresAt   DateTime?
}
```

---

## 🌍 الدول المدعومة

المنصة تدعم أكثر من **60 دولة** من جميع القارات:

| القارة | عدد الدول |
|--------|----------|
| آسيا | 15+ |
| أفريقيا | 20+ |
| أوروبا | 15+ |
| الأمريكتين | 10+ |
| أوقيانوسيا | 5+ |

---

## 🎨 تصميم الواجهة

- **RTL**: واجهة من اليمين لليسار
- **متجاوبة**: تعمل على جميع الأجهزة
- **ألوان**: تدرجات الزمرد والفيروزي
- **خطوط**: خطوط عربية واضحة
- **أرقام غربية**: استخدام 1, 2, 3 بدلاً من ١، ٢، ٣

---

## 💡 الفلسفة

> **"كلُّ إنسانٍ خليفةٌ في هذه الأرض، والانتماء الحقيقي للأصل لا للأوطان المصطنعة"**

### المبادئ الأساسية:
- ❌ لا حدود جغرافية
- ❌ لا فوارق عنصرية  
- ✅ المعيار هو الالتزام بالدستور
- ✅ النية الصادقة أساس القبول

---

## 🔒 الأمان

- تشفير كلمات المرور بـ SHA-256
- جلسات HTTP-only cookies
- حماية من CSRF
- التحقق من الصلاحيات في كل طلب

---

## 📞 التواصل والدعم

- **GitHub**: [github.com/elmarja32022/mizenelwasl](https://github.com/elmarja32022/mizenelwasl)
- **من خلال المنصة**: نموذج التواصل

---

## 📄 الترخيص

هذا المشروع مفتوح المصدر لخدمة البشرية.

---

<div align="center">

**صُنع بـ ❤️ للبشرية جمعاء**

⚖️ **ميزان الوصل - مذهب العدل والتبادل**

</div>
