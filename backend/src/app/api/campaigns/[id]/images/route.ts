import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseForm } from "../../../../utils/parseForm";
import { errorResponse, successResponse } from "../../../../utils/response";
import path from "path";
import fs from "fs";
import type { File } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").at(-2);
    const campaignId = parseInt(id ?? "", 10);

    if (isNaN(campaignId)) {
      return NextResponse.json(errorResponse("ID campaign tidak valid", 400), { status: 400 });
    }

    // Ambil data campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) {
      return NextResponse.json(errorResponse("Campaign tidak ditemukan", 404), { status: 404 });
    }

    // Parse form
    const { fields, files } = await parseForm(req);

    const isPrimaryRaw = fields.is_primary;
    const isPrimary = Array.isArray(isPrimaryRaw)
      ? isPrimaryRaw[0] === "true"
      : isPrimaryRaw === "true";

    const rawFile = files.image;
    let file: File | undefined = Array.isArray(rawFile) ? rawFile[0] : rawFile;

    if (!file || !file.filepath) {
      return NextResponse.json(errorResponse("Gambar tidak valid", 400), { status: 400 });
    }

    // Dapatkan ekstensi file
    const originalExt = path.extname(file.originalFilename || "").toLowerCase();

    // Buat nama file baru berdasarkan slug campaign + timestamp
    const safeName = campaign.slug.replace(/[^a-zA-Z0-9\-]/g, "");
    const newFileName = `${safeName}-${Date.now()}${originalExt}`;
    const newFilePath = path.join(process.cwd(), "public/uploads", newFileName);

    // Pindahkan file dari temp ke public/uploads
    fs.copyFileSync(file.filepath, newFilePath);

    // Simpan ke database
    const image = await prisma.campaignImage.create({
      data: {
        file_name: newFileName,
        is_primary: isPrimary,
        campaign_id: campaignId,
      },
    });

    // Hapus properti yang tidak diinginkan
    const { created_at, updated_at, campaign_id, ...cleanedImage } = image;

    return NextResponse.json(successResponse("Gambar berhasil diupload", cleanedImage), { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(errorResponse("Terjadi kesalahan server", 500), { status: 500 });
  }
}
