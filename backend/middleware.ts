import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes = ["/api/protected", "/api/user", "/api/admin"];
const allowedOrigins = ["http://localhost:3001"];

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const { pathname } = req.nextUrl;

  const setCorsHeaders = (res: NextResponse) => {
    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.headers.set("Access-Control-Allow-Credentials", "true");
    }
    return res;
  };

  // ✅ Tangani preflight request (OPTIONS) lebih awal
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    return setCorsHeaders(res);
  }

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!isProtected) {
    return setCorsHeaders(NextResponse.next());
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return setCorsHeaders(NextResponse.json({ message: "Unauthorized" }, { status: 401 }));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const res = NextResponse.next();
    res.headers.set("x-user-id", String((decoded as any).userId));
    res.headers.set("x-user-role", String((decoded as any).role));
    return setCorsHeaders(res);
  } catch {
    return setCorsHeaders(NextResponse.json({ message: "Token tidak valid" }, { status: 403 }));
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
