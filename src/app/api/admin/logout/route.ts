import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  cookieStore.delete("student_auth");
  cookieStore.delete("student_name");
  return NextResponse.redirect(new URL("/login", origin));
}
