import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { toast } from "@/hooks/use-toast";
import { EntityError } from "./http";
import authApiRequest from "@/apiRequests/auth";
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type";
import envConfig from "@/config";
import guestApiRequest from "@/apiRequests/guest";
import { format } from "date-fns";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { io } from "socket.io-client";
import { decodeToken } from "@/middleware";

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
  forceRefresh?: boolean;
}) => {
  // không nên đưa logic lấy access và refresh token ra khỏi func checkAndRefreshToken
  // vì để mỗi lần mà checkAndRefreshToken() được gọi thì nó sẽ lấy access và refresh token mới
  // nếu lấy ra ngoài thì nó chỉ lấy 1 lần khi component được render rồi gọi cho các lần tiếp theo
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  // chưa login thì không cho chạy
  if (!accessToken || !refreshToken) return;
  const decodeAccessToken = decodeToken(accessToken);
  const decodeRefreshToken = decodeToken(refreshToken);
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
    param?.forceRefresh ||
    decodeAccessToken.exp - now <
      (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) {
    // gọi api refresh token

    try {
      const role = decodeRefreshToken.role;
      const res =
        role == Role.Guest
          ? await guestApiRequest.refreshToken()
          : await authApiRequest.refreshToken();
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

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    default:
      return "Từ chối";
  }
};

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
  );
};

export function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  );
};

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    "HH:mm:ss dd/MM/yyyy"
  );
};

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), "HH:mm:ss");
};

export const generateSocketInstance = (accessToken: string) => {
  return io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};
export { decodeToken };
