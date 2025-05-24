import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    return NextResponse.json({
      message: "Data profil berhasil diambil",
      user,
    });
  } catch (err) {
    return NextResponse.json({ message: "Token tidak valid" }, { status: 403 });
  }
}
