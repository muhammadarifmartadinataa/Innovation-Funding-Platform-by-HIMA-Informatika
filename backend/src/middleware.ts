import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized - token missing" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Bisa tambahkan informasi user di header jika ingin
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized - token invalid" }, { status: 403 });
  }
}

// Tentukan rute yang butuh proteksi
export const config = {
  matcher: ["/api/protected/:path*"],
};
