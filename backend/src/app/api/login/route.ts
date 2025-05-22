import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../../utils/response";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        errorResponse("Email dan password wajib diisi", 400),
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        errorResponse("Email tidak ditemukan", 401),
        { status: 401 }
      );
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        errorResponse("Password salah", 401),
        { status: 401 }
      );
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as string,
      }
    );

    // Simpan token ke database
    await prisma.user.update({
      where: { id: user.id },
      data: { token },
    });

    // Kirim response sukses
    return NextResponse.json(
      successResponse("Login successful", {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      errorResponse("Terjadi kesalahan server", 500),
      { status: 500 }
    );
  }
}
