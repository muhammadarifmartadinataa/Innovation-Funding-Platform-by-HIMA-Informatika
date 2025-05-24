import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes = ["/api/protected", "/api/user", "/api/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) return NextResponse.next();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const res = NextResponse.next();

    // Tambahkan custom header agar bisa diakses di route
    res.headers.set("x-user-id", String((decoded as any).userId));
    res.headers.set("x-user-role", String((decoded as any).role));

    return res;
  } catch (err) {
    return NextResponse.json({ message: "Token tidak valid" }, { status: 403 });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
