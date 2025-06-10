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
