# 💡Innovation-Funding-Platform-by-HIMA-Informatika
# Backend
Backend ini dibuat dengan Node.js + Prisma ORM menggunakan database relasional (PostgreSQL/MySQL/SQLite - sesuaikan dengan .env) dan digunakan untuk mengelola otentikasi serta fitur terkait platform pendanaan inovasi.
# 📦 Teknologi yang Digunakan
- Node.js
- Prisma ORM
- TypeScript
- JWT (jsonwebtoken)
- bcrypt
- MySQL

# Cara Instalasi 
- git clone https://github.com/muhammadarifmartadinataa/Innovation-Funding-Platform-by-HIMA-Informatika.git
- cd backend
- Buat file .env di root folder backend/, lalu isi seperti berikut
- ( DATABASE_URL="mysql://root:@password@localhost:3306/db_innovation_funding_hima_informatika"
    JWT_SECRET="rahasia_anda_disini" )
- NPM Install
- npx prisma studi (ditab berbeda)
- npx prisma generate
- npx prisma migrate dev --name init
- npx prisma db seed
- npm run dev

