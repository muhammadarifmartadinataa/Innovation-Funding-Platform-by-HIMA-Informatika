import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../../../../utils/response";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(errorResponse("Unauthorized", 401), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json(errorResponse("Akses ditolak. Hanya admin.", 403), { status: 403 });
    }

    const userId = parseInt(params.id, 10);

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(errorResponse("User tidak ditemukan", 404), { status: 404 });
    }

    // Optional: hapus campaign dan data terkait user ini jika diperlukan
    await prisma.campaign.deleteMany({
      where: { user_id: userId },
    });

    // Hapus user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(successResponse("User berhasil dihapus oleh admin", null));
  } catch (error) {
    console.error("DELETE /admin/users/[id] error:", error);
    return NextResponse.json(errorResponse("Terjadi kesalahan server", 500), { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(errorResponse("Unauthorized", 401), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json(errorResponse("Akses ditolak. Hanya admin.", 403), { status: 403 });
    }

    const userId = parseInt(params.id, 10);
    const body = await req.json();

    const { name, email, occupation, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json(errorResponse("Data tidak lengkap", 400), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(errorResponse("User tidak ditemukan", 404), { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        occupation,
        role,
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

    return NextResponse.json(successResponse("User berhasil diperbarui oleh admin", updatedUser));
  } catch (error) {
    console.error("PUT /admin/users/[id] error:", error);
    return NextResponse.json(errorResponse("Terjadi kesalahan server", 500), { status: 500 });
  }
}
