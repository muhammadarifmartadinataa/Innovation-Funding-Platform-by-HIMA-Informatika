import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Disable Next.js built-in body parser (ini buat api route biasa, tapi di app dir masih harus dihandle manual)
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Baca seluruh body sebagai Uint8Array
    const reader = req.body?.getReader();
    if (!reader) {
      return NextResponse.json({ message: "Request body tidak tersedia" }, { status: 400 });
    }

    let chunks: Uint8Array[] = [];
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      if (value) chunks.push(value);
      done = doneReading;
    }

    // Gabungkan semua chunk menjadi satu Uint8Array
    const fullBuffer = concatUint8Arrays(chunks);

    // Ambil boundary dari header content-type
    const contentType = req.headers.get("content-type") || "";
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      return NextResponse.json({ message: "Boundary tidak ditemukan di header" }, { status: 400 });
    }
    const boundary = boundaryMatch[1];

    // Parse multipart form-data
    const parts = parseMultipart(fullBuffer, boundary);

    if (!parts.file || !parts.file.filename) {
      return NextResponse.json({ message: "Tidak ada file yang diupload" }, { status: 400 });
    }

    // Tentukan path simpan file
    const filename = `${Date.now()}_${parts.file.filename}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const uploadPath = path.join(uploadDir, filename);

    // Simpan file, ubah data jadi Buffer
    fs.writeFileSync(uploadPath, Buffer.from(parts.file.data));

    return NextResponse.json({
      message: "Upload berhasil",
      fileName: filename,
      fileUrl: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// Helper untuk gabungkan array Uint8Array
function concatUint8Arrays(chunks: Uint8Array[]): Uint8Array {
  const totalLength = chunks.reduce((acc, curr) => acc + curr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

// Parser multipart sederhana, mirip contoh kamu
function parseMultipart(buffer: Uint8Array, boundary: string) {
  const parts: Record<string, { filename?: string; data: Uint8Array }> = {};

  // Convert boundary ke bentuk Buffer untuk split
  const boundaryBuffer = Buffer.from(`--${boundary}`);

  // Ubah buffer ke string (latin1 / binary supaya byte-by-byte cocok)
  const bufferStr = Buffer.from(buffer).toString("latin1");

  // Split dengan boundary
  const split = bufferStr.split(boundaryBuffer.toString("latin1")).filter((s) => s.trim() && !s.includes("--"));

  for (const part of split) {
    const dispositionMatch = /name="(.+?)"(; filename="(.+?)")?/.exec(part);
    if (!dispositionMatch) continue;

    const name = dispositionMatch[1];
    const filename = dispositionMatch[3];

    // Ambil data setelah double CRLF (\r\n\r\n)
    const dataStart = part.indexOf("\r\n\r\n");
    if (dataStart < 0) continue;

    // Data raw dalam string latin1
    const dataRaw = part.substring(dataStart + 4, part.length - 2); // -2 untuk hapus trailing \r\n

    // Ubah data raw string ke Uint8Array (binary)
    const dataBuffer = Buffer.from(dataRaw, "latin1");

    parts[name] = {
      filename,
      data: new Uint8Array(dataBuffer),
    };
  }

  return parts;
}
