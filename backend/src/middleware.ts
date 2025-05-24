import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // bisa juga set data ke request.nextUrl.searchParams atau cookies
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ message: 'Token tidak valid' }, { status: 403 });
  }
}

// Tentukan route mana yang ingin diamankan
export const config = {
  matcher: ["/api/protected/:path*"], // sesuaikan sesuai kebutuhan
};
