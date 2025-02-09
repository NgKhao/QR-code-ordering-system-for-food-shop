"use client";
import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Những page sẽ không check refresh token
const UNAUTHERIZED_PATHS = ["/login", "/logout", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();
  console.log(pathname);
  useEffect(() => {
    if (UNAUTHERIZED_PATHS.includes(pathname)) return;
    let interval: any = null;
    // phải gọi lần đầu tien vì interval sẽ chạy sau thời gian TIMEOUT
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);

        router.push("/login");
      },
    });
    const TIMEOUT = 1000;
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval);

            router.push("/login");
          },
        }),
      TIMEOUT
    );
    return () => {
      clearInterval(interval);
    };
  }, [pathname, router]);
  return null;
}
