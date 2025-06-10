import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../../../utils/response";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(errorResponse("Unauthorized", 401), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    const userId = decoded.userId;
    const campaignId = parseInt(params.id, 10);
    const body = await req.json();

    // Cek apakah campaign ada dan milik user
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(errorResponse("Campaign tidak ditemukan", 404), { status: 404 });
    }

    if (campaign.user_id !== userId) {
      return NextResponse.json(errorResponse("Tidak diizinkan mengedit campaign ini", 403), { status: 403 });
    }

    // Update campaign dan sertakan data user
    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        name: body.name,
        short_description: body.short_description,
        description: body.description,
        goal_amount: body.goal_amount,
        perks: body.perks,
        slug: body.slug,
      },
      select: {
        id: true,
        name: true,
        short_description: true,
        description: true,
        goal_amount: true,
        current_amount: true,
        perks: true,
        slug: true,
        backer_count: true,
        user_id: true,
        user: {
          select: {
            name: true,
            email: true,
            occupation: true,
          },
        },
      },
    });

    return NextResponse.json(successResponse("Campaign berhasil diperbarui", updatedCampaign));
  } catch (error) {
    console.error("PUT /campaigns/[id] error:", error);
    return NextResponse.json(errorResponse("Terjadi kesalahan server", 500), { status: 500 });
  }
}
