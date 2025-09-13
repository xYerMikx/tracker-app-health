import { auth } from "@/lib/auth";
import { PUBLIC_PATHS } from "@/shared/config/constants";
import { NextResponse } from "next/server";

export const middleware = auth((req) => {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const signinUrl = new URL("/signin", req.url);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
