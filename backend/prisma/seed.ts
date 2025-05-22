import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = '@dmin123' // ganti sesuai keinginan
  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      name: 'Admin Utama',
      occupation: 'Administrator',
      email: 'admin@gmail.com',
      password_hash: hashedPassword,
      avatar_file_name: 'admin.png',
      role: 'admin',
      token: '',
      created_at: new Date(),
    },
  })

  console.log('✅ Admin seeded:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
