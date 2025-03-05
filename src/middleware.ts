import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "./lib/utils";
import { Role } from "./constants/type";

const managePaths = ["/manage"];
const onlyOwnerPaths = ["/manage/accounts"];
const guestPaths = ["/guest"];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // console.log(isAuth);

  //1. chưa login thì k cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  // 2. đã login
  if (refreshToken) {
    // 2.1 cố tình vào trang login sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // nhưng acccessToken hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // 2.3 vào không đúng role, redirect về trang chủ
    const role = decodeToken(refreshToken).role;
    // guest nhưng vào route owner
    const isGuestGoToManagePath =
      role == Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));
    // không phải guest như vào route guest
    const isNotGuestGoToManagePath =
      role != Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path));
    //không phải owner nhưng cố tình truy cập vào route dành cho owner
    const isNotOwnerGoToOwnerPath =
      role != Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path));
    if (
      isGuestGoToManagePath ||
      isNotGuestGoToManagePath ||
      isNotOwnerGoToOwnerPath
    )
      return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  // Đường dẫn cố định (e.g., "/login").
  // Đường dẫn động với tham số (e.g., "/manage/:path*").
  matcher: ["/manage/:path*", "/guest/:path*", "/login"],
};
