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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const userId = decoded.userId;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    // Hitung total campaign milik user
    const totalCampaigns = await prisma.campaign.count({
      where: { user_id: userId },
    });

    // Ambil campaign sesuai halaman
    const campaigns = await prisma.campaign.findMany({
      where: { user_id: userId },
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
        campaign_images: {
          select: {
            file_name: true,
            is_primary: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalCampaigns / pageSize);

    return NextResponse.json(
      successResponse("Campaign user berhasil diambil", {
        campaigns,
        page,
        pageSize,
        totalCampaigns,
        totalPages,
      })
    );
  } catch (error) {
    console.error("GET /user/campaigns error:", error);
    return NextResponse.json(errorResponse("Terjadi kesalahan server", 500), { status: 500 });
  }
}
