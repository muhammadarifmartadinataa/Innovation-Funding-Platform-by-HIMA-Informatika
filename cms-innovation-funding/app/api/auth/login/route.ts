import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password wajib diisi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
   const expiresIn: string | number = process.env.JWT_EXPIRES_IN || "1d";


    if (!secret) {
      return NextResponse.json({ message: "JWT_SECRET belum diatur di .env" }, { status: 500 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn }
    );

    await prisma.user.update({ where: { id: user.id }, data: { token } });

    return NextResponse.json({
      message: "Login berhasil",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
