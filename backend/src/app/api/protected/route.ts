// src/app/api/protected/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Protected route accessed" }, { status: 200 });
}
