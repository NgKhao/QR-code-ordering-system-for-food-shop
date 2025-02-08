"use client";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

// Những page sẽ không check refresh token
const UNAUTHERIZED_PATHS = ["/login", "logout", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();
  console.log(pathname);
  useEffect(() => {
    if (UNAUTHERIZED_PATHS.includes(pathname)) return;
    let interval: any = null;
    const checkAndRefreshToken = async () => {
      // không nên đưa logic lấy access và refresh token ra khỏi func checkAndRefreshToken
      // vì để mỗi lần mà checkAndRefreshToken() được gọi thì nó sẽ lấy access và refresh token mới
      // nếu lấy ra ngoài thì nó chỉ lấy 1 lần khi component được render rồi gọi cho các lần tiếp theo
      const accessToken = getAccessTokenFromLocalStorage();
      const refreshToken = getRefreshTokenFromLocalStorage();
      // chưa login thì không cho chạy
      if (!accessToken || !refreshToken) return;
      const decodeAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodeRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };
      // thời điển hết hạn của token là tính theo epoch time (s)
      // còn khi dùng new Date().getTime() thì nó trả về epoch time (ms)
      const now = Math.round(new Date().getTime() / 1000);
      // trường hợp refresh token hết hạn thì không xử lý nữa
      if (decodeRefreshToken.exp <= now) return;
      // ví dụ access token của chúng ta có thời gian hết hạn là 10s
      // mình sẽ check còn 1/3 thời thì mình sẽ cho refresh token  lạilại
      // thời gian còn lại sẽ tính: decodeAccessToken.exp - now
      // thời gian hết hạn của access token: decodeAccessToken.exp - decodeAccessToken.iat
      if (
        decodeAccessToken.exp - now <
        (decodeAccessToken.exp - decodeAccessToken.iat) / 3
      ) {
        // gọi api refresh token

        try {
          const res = await authApiRequest.refreshToken();
          const { accessToken, refreshToken } = res.payload.data;
          setAccessTokenToLocalStorage(accessToken);
          setRefreshTokenToLocalStorage(refreshToken);
        } catch (error) {
          clearInterval(interval);
        }
      }
    };
    // phải gọi lần đầu tien vì interval sẽ chạy sau thời gian TIMEOUT
    checkAndRefreshToken();
    const TIMEOUT = 1000;
    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => clearInterval(interval);
  }, [pathname]);
  return null;
}
