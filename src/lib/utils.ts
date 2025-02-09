import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { toast } from "@/hooks/use-toast";
import { EntityError } from "./http";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window != "undefined";

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLocalStorage = (accessToken: string) =>
  isBrowser && localStorage.setItem("accessToken", accessToken);

export const setRefreshTokenToLocalStorage = (refreshToken: string) =>
  isBrowser && localStorage.setItem("refreshToken", refreshToken);

export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
  }
  if (isBrowser) {
    localStorage.removeItem("refreshToken");
  }
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
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
  const now = new Date().getTime() / 1000 - 1;
  // trường hợp refresh token hết hạn thì không xử lý nữa
  if (decodeRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return param?.onError && param.onError();
  }
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
      if (param?.onSuccess) {
        param.onSuccess();
      }
    } catch (error) {
      if (param?.onError) {
        param.onError();
      }
    }
  }
};
