"use client";
import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "./app-provider";

// Những page sẽ không check refresh token
const UNAUTHERIZED_PATHS = ["/login", "/logout", "/refresh-token"];
export default function RefreshToken() {
  const { socket, setSocket } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();
  // console.log(pathname);
  useEffect(() => {
    if (UNAUTHERIZED_PATHS.includes(pathname)) return;
    let interval: any = null;
    // phải gọi lần đầu tien vì interval sẽ chạy sau thời gian TIMEOUT
    const onRefreshToken = (forceRefresh?: boolean) =>
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          socket?.disconnect();
          setSocket(undefined);
          router.push("/login");
        },
      });
    onRefreshToken();
    const TIMEOUT = 1000;
    interval = setInterval(onRefreshToken, TIMEOUT);

    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true);
    }
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("refresh-token", onRefreshTokenSocket);

    return () => {
      clearInterval(interval);
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("refresh-token", onRefreshTokenSocket);
    };
  }, [pathname, router, socket, setSocket]);
  return null;
}
