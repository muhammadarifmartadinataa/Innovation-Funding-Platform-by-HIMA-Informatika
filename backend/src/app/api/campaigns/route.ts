import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { errorResponse, successResponse } from "../../utils/response";
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!; // jangan lupa set di .env

function getUserIdFromToken(req: NextRequest): number | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      short_description,
      description,
      goal_amount,
      perks,
    } = body;

    const userId = getUserIdFromToken(req);

    if (!userId) {
      return NextResponse.json(errorResponse("Unauthorized", 401), { status: 401 });
    }

    if (!name || !short_description || !description || !goal_amount || !perks) {
      return NextResponse.json(errorResponse("Data tidak lengkap", 400), { status: 400 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    const newCampaign = await prisma.campaign.create({
      data: {
        user_id: userId,
        name,
        short_description,
        description,
        goal_amount,
        current_amount: 0,
        perks,
        slug,
        backer_count: 0,
      },
    });

    const responseData = {
      id: newCampaign.id,
      user_id: newCampaign.user_id,
      name: newCampaign.name,
      short_description: newCampaign.short_description,
      description: newCampaign.description,
      goal_amount: newCampaign.goal_amount,
      current_amount: newCampaign.current_amount,
      perks: newCampaign.perks,
      slug: newCampaign.slug,
      backer_count: newCampaign.backer_count,
    };

    return NextResponse.json(successResponse("Campaign berhasil dibuat", responseData), { status: 201 });
  } catch (error) {
    console.error("POST /campaigns error:", error);
    return NextResponse.json(errorResponse("Terjadi kesalahan server", 500), { status: 500 });
  }
}
