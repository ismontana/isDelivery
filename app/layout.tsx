import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { BottomTabBar } from "@/components/shared/BottomTabBar";
import { AppGate } from "@/components/shared/AppGate";

export const metadata: Metadata = {
  title: "isDelivery",
  description: "Gestión de ruta, clientes y ventas de garrafones de agua.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "isDelivery",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F8FB" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1620" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>
          <AppGate>
            <div className="mx-auto flex min-h-screen w-full max-w-md flex-col pb-[var(--tabbar-height)] pt-[var(--header-top-pad)] sm:max-w-lg md:max-w-2xl">
              {children}
            </div>
            <BottomTabBar />
          </AppGate>
        </Providers>
      </body>
    </html>
  );
}
