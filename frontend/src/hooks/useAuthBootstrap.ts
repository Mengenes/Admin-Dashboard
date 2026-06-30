import { useEffect } from "react";
import { apiBaseUrl } from "../config/axios";
import { useUserStore } from "../store/Zustand";

export function useAuthBootstrap() {
  const setUser = useUserStore((state) => state.setUser);
  const setHydrated = useUserStore((state) => state.setHydrated);

  useEffect(() => {
    apiBaseUrl
      .post("/auth/refresh")
      .then((res) => {
        setUser(res.data?.user ?? null);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setHydrated(true);
      });
  }, [setUser, setHydrated]);
}