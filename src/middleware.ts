import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = Boolean(request.cookies.get("accessToken")?.value);
  const refreshToken = Boolean(request.cookies.get("refreshToken")?.value);
  // console.log(isAuth);

  // chưa login thì k cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // login rồi thì không cho vào login nữa
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // case login rồi nhưng acccessToken hết hạn
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL("/logout", request.url);
    url.searchParams.set(
      "refreshToken",
      request.cookies.get("refreshToken")?.value ?? ""
    );
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // Đường dẫn cố định (e.g., "/login").
  // Đường dẫn động với tham số (e.g., "/manage/:path*").
  matcher: ["/manage/:path*", "/login"],
};
