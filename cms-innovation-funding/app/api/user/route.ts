import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const user = await prisma.user.create({
    data: {
      name: body.name,
      occupation: body.occupation,
      email: body.email,
      password_hash: hashedPassword,
      role: body.role,
    },
  });
  return NextResponse.json(user);
}
