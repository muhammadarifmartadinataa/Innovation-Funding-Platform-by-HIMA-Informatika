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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(errorResponse("User tidak ditemukan", 404), { status: 404 });
    }

    // Siapkan data yang akan diupdate hanya jika disediakan di body
    const dataToUpdate: any = {};
    if (body.name) dataToUpdate.name = body.name;
    if (body.email) dataToUpdate.email = body.email;
    if (body.occupation) dataToUpdate.occupation = body.occupation;
    if (body.role) dataToUpdate.role = body.role;

    // Cek jika tidak ada field yang diberikan
    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(errorResponse("Tidak ada data yang diubah", 400), { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
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


