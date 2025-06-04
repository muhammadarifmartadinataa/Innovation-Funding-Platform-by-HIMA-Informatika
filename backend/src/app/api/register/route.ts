import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { successResponse, errorResponse } from "../../utils/response";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, occupation, avatar } = body;

    if (!name || !email || !password || !occupation) {
      return NextResponse.json(
        errorResponse("Semua field wajib diisi", 400),
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        errorResponse("Email sudah terdaftar", 409),
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        occupation,
        password_hash: hashedPassword,
        role: "user", // Default role
        avatar_file_name: avatar || "user.png", // Jika avatar tidak dikirim, pakai "user.png"
      },
    });

    return NextResponse.json(
      successResponse("Registrasi berhasil", {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        occupation: newUser.occupation,
        role: newUser.role,
        avatar: `/uploads/${newUser.avatar_file_name}`, // contoh path akses avatar
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      errorResponse("Terjadi kesalahan server", 500),
      { status: 500 }
    );
  }
}

