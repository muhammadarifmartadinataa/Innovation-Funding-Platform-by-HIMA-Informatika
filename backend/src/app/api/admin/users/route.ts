import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../../../utils/response";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        errorResponse("Unauthorized", 401),
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const role = (decoded as any).role;

    if (role !== "admin") {
      return NextResponse.json(
        errorResponse("Akses ditolak. Hanya admin.", 403),
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        occupation: true,
        created_at: true,
      },
    });

    return NextResponse.json(successResponse("Berhasil ambil semua user", users));
  } catch (error) {
    console.error("GET /admin/users error:", error);
    return NextResponse.json(
      errorResponse("Terjadi kesalahan server", 500),
      { status: 500 }
    );
  }
}
