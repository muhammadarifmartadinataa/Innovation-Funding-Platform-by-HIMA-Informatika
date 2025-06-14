import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes = ["/api/protected", "/api/user", "/api/admin"];
const allowedOrigins = ["http://localhost:3001"]; // sesuaikan dengan URL frontend

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin") || "";

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const setCorsHeaders = (res: NextResponse) => {
    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      res.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
    }
    return res;
  };

  if (!isProtected) {
    const res = NextResponse.next();
    return setCorsHeaders(res);
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const res = NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return setCorsHeaders(res);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const res = NextResponse.next();

    res.headers.set("x-user-id", String((decoded as any).userId));
    res.headers.set("x-user-role", String((decoded as any).role));

    return setCorsHeaders(res);
  } catch (err) {
    const res = NextResponse.json({ message: "Token tidak valid" }, { status: 403 });
    return setCorsHeaders(res);
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
