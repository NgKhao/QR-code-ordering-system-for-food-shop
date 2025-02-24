"use client";
import { useAppContext } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function LougoutComponent() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const { setRole } = useAppContext();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");

  const ref = useRef<any>(null);
  useEffect(() => {
    if (
      !ref.current &&
      ((refreshTokenFromUrl &&
        refreshTokenFromUrl == getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromUrl &&
          accessTokenFromUrl == getAccessTokenFromLocalStorage()))
    ) {
      ref.current = mutateAsync;
      mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        setRole();
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole]);
  return (
    <div>
      <h1>Log out...</h1>
    </div>
  );
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <LougoutComponent />
    </Suspense>
  );
}
