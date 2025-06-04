import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../../../utils/response";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(errorResponse("Unauthorized", 401), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const role = (decoded as any).role;

    if (role !== "admin") {
      return NextResponse.json(errorResponse("Akses ditolak. Hanya admin.", 403), { status: 403 });
    }

    // Ambil parameter page dari query
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Hitung total user
    const totalUsers = await prisma.user.count();

    // Ambil user dengan limit dan offset
    const users = await prisma.user.findMany({
      skip,
      take: pageSize,
      orderBy: {
        created_at: "desc", // Urut dari terbaru ke terlama
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        occupation: true,
        created_at: true,
      },
    });

    const totalPages = Math.ceil(totalUsers / pageSize);

    return NextResponse.json(
      successResponse("Berhasil ambil user", {
        users,
        page,
        pageSize,
        totalPages,
        totalUsers,
      })
    );
  } catch (error) {
    console.error("GET /admin/users error:", error);
    return NextResponse.json(errorResponse("Terjadi kesalahan server", 500), { status: 500 });
  }
}

