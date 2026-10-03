"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";

function useHydrateStore() {
  const setHydrated = useStore((s) => s.setHydrated);
  const setAuthHydrated = useAuthStore((s) => s.setHydrated);
  useEffect(() => {
    useStore.persist.rehydrate();
    useAuthStore.persist.rehydrate();
    setHydrated();
    setAuthHydrated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function useThemeSync() {
  const theme = useStore((s) => s.theme);
  const hydrated = useStore((s) => s.hydrated);
  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme, hydrated]);
}

function useServiceWorker() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* offline registration is best-effort */
      });
    }
  }, []);
}

export function Providers({ children }: { children: React.ReactNode }) {
  useHydrateStore();
  useThemeSync();
  useServiceWorker();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {children}
      {mounted && (
        <Toaster
          position="top-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "glass glass-shadow rounded-capsule px-5 py-3 text-sm font-medium text-ink flex items-center gap-2 w-fit mx-auto",
            },
          }}
        />
      )}
    </>
  );
}
