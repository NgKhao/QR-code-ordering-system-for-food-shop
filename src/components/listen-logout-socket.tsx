import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "./app-provider";
import { handleErrorApi } from "@/lib/utils";

// This component listens to the logout event from the socket and handles the logout process
// component này xử lý việc lắng nghe sự kiện logout phát từ socket  khi manager xóa employeee

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];

export default function ListenLogoutSocket() {
  const pathname = usePathname();
  const router = useRouter();
  const { isPending, mutateAsync } = useLogoutMutation();
  const { setRole, socket, setSocket } = useAppContext();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    async function onLogout() {
      if (isPending) return;
      try {
        await mutateAsync();
        setRole();
        socket?.disconnect();
        setSocket(undefined);

        router.push("/");
      } catch (error: any) {
        handleErrorApi({
          error,
        });
      }
    }
    socket?.on("logout", onLogout);
    return () => {
      socket?.off("logout", onLogout);
    };
  }, [pathname, socket, setSocket, router, setRole, isPending, mutateAsync]);
  return null;
}
