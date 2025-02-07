"use client";
import { getRefreshTokenToLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LougoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const ref = useRef<any>(null);
  useEffect(() => {
    if (ref.current || refreshTokenFromUrl != getRefreshTokenToLocalStorage())
      return;
    ref.current = mutateAsync;
    mutateAsync().then((res) => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      router.push("/login");
    });
  }, [mutateAsync, router, refreshTokenFromUrl]);
  return (
    <div>
      <h1>Log out...</h1>
    </div>
  );
}
