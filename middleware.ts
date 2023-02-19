import jwt_decode from "jwt-decode";

import { NextRequest, NextResponse } from "next/server";

import { CHATTING_TOKEN_KEY, pathname } from "@/src/constant";

const bypass = [
  pathname.auth,
  pathname.loading,
  "favicon/",
  "manifest/",
  "assets/",
  "_next/static/",
];

// noinspection JSUnusedGlobalSymbols
export default async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname) return;
  if (bypass.some((page) => req.nextUrl.pathname?.includes(page))) return;

  try {
    const userInfo = jwt_decode(
      req.cookies.get(CHATTING_TOKEN_KEY)?.value as string
    );

    if (userInfo) {
      NextResponse.redirect(new URL("/", req.url));
    } else {
      NextResponse.redirect(new URL(pathname.auth, req.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL(pathname.auth, req.url));
  }
}
