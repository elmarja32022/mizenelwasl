import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// نفس طريقة التشفير المستخدمة في login
const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function main() {
  // إنشاء مستخدم أدمن للتجربة
  const hashedPassword = hashPassword('admin123')
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mizan.com' },
    update: {},
    create: {
      email: 'admin@mizan.com',
      name: 'الخليفة المختار',
      password: hashedPassword,
      country: 'SA',
      city: 'الرياض',
      timeBalance: 300,
      integrityScore: 100,
      trustLevel: 'خليفة مميز',
      isAdmin: true,
      covenantSigned: true,
      covenantSignedAt: new Date(),
      emailVerified: true
    }
  })

  console.log('Admin user created:', admin.email)
  console.log('Password: admin123')
  
  // إنشاء مستخدم عادي للتجربة
  const userPassword = hashPassword('user123')
  
  const user = await prisma.user.upsert({
    where: { email: 'user@mizan.com' },
    update: {},
    create: {
      email: 'user@mizan.com',
      name: 'خليفة تجريبي',
      password: userPassword,
      country: 'SA',
      city: 'جدة',
      timeBalance: 300,
      integrityScore: 85,
      trustLevel: 'خليفة صادق',
      isAdmin: false,
      covenantSigned: true,
      covenantSignedAt: new Date(),
      emailVerified: true
    }
  })

  console.log('Test user created:', user.email)
  console.log('Password: user123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
