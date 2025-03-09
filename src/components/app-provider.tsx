"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RefreshToken from "./refresh-token";
import { useEffect } from "react";
import {
  decodeToken,
  generateSocketInstance,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import type { Socket } from "socket.io-client";
import ListenLogoutSocket from "./listen-logout-socket";
import { create } from "zustand";
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// const AppContext = createContext({
//   isAuth: false,
//   role: undefined as RoleType | undefined,
//   setRole: (role?: RoleType | undefined) => {},
//   socket: undefined as Socket | undefined,
//   setSocket: (socket?: Socket | undefined) => {},
// });

type AppContextType = {
  isAuth: boolean;
  role: RoleType | undefined;
  setRole: (role?: RoleType | undefined) => void;
  socket: Socket | undefined;
  setSocket: (socket?: Socket | undefined) => void;
};
export const useAppStore = create<AppContextType>((set) => ({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {
    set({ role, isAuth: Boolean(role) });
    if (!role) {
      removeTokensFromLocalStorage();
    }
  },
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => set({ socket }),
}));

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [socket, setSocket] = useState<Socket | undefined>();
  // const [role, setRoleState] = useState<RoleType | undefined>();
  const setRole = useAppStore((stase) => stase.setRole);
  const setSocket = useAppStore((stase) => stase.setSocket);
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const role = decodeToken(accessToken).role;
      setRole(role);
      setSocket(generateSocketInstance(accessToken));
    }
  }, [setRole, setSocket]);

  // hàm setRole giúp xử lý logic bổ sung khi thay đổi role
  // const setRole = (role?: RoleType | undefined) => {
  //   setRoleState(role);
  //   if (!role) {
  //     removeTokensFromLocalStorage();
  //   }
  // };

  // const isAuth = Boolean(role);
  return (
    // <AppContext value={{ role, setRole, isAuth, socket, setSocket }}>
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    // </AppContext>
  );
}
