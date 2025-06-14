import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../../../utils/response";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // ✅ Cek token
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

    // ✅ Pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const totalCampaigns = await prisma.campaign.count();

    const campaigns = await prisma.campaign.findMany({
      skip,
      take: pageSize,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        name: true,
        short_description: true,
        goal_amount: true,
        current_amount: true,
        perks: true,
        slug: true,
        backer_count: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        campaign_images: {
          select: {
            id: true,
            file_name: true,
            is_primary: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalCampaigns / pageSize);

    return NextResponse.json(
      successResponse("Berhasil ambil campaign", {
        campaigns,
        page,
        pageSize,
        totalPages,
        totalCampaigns,
      })
    );
  } catch (error) {
    console.error("GET /admin/campaigns error:", error);
    return NextResponse.json(errorResponse("Terjadi kesalahan server", 500), { status: 500 });
  }
}

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

    const campaignId = parseInt(params.id, 10);

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(errorResponse("Campaign tidak ditemukan", 404), { status: 404 });
    }

    // Jika campaign punya gambar, hapus dulu relasinya (jika diperlukan)
    await prisma.campaignImage.deleteMany({
      where: { campaign_id: campaignId },
    });

    // Hapus campaign
    await prisma.campaign.delete({
      where: { id: campaignId },
    });

    return NextResponse.json(successResponse("Campaign berhasil dihapus oleh admin", null));
  } catch (error) {
    console.error("DELETE /admin/campaigns/[id] error:", error);
    return NextResponse.json(errorResponse("Terjadi kesalahan server", 500), { status: 500 });
  }
}
