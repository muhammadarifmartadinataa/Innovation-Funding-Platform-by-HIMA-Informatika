import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: any) {
  const body = await request.json();
  const user = await prisma.user.update({
    where: { id: Number(params.id) },
    data: {
      name: body.name,
      occupation: body.occupation,
      role: body.role,
    },
  });
  return NextResponse.json(user);
}

export async function DELETE(request: Request, { params }: any) {
  await prisma.user.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ message: 'User deleted' });
}
