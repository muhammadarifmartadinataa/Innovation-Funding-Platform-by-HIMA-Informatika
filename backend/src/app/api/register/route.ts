import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { successResponse, errorResponse } from "../../utils/response";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, occupation, role } = body;

    if (!name || !email || !password || !occupation || !role) {
      return NextResponse.json(errorResponse("Semua field wajib diisi", 400));
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(errorResponse("Email sudah terdaftar", 400));
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        occupation,
        password_hash,
        role,
      },
    });

    return NextResponse.json(successResponse("Registrasi berhasil", user), { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(errorResponse("Server error", 500));
  }
}
