"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Map, ClipboardList, Users, ShoppingCart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/map", label: "Mapa", icon: Map },
  { href: "/orders", label: "Pedidos", icon: ClipboardList },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/sales", label: "Ventas", icon: ShoppingCart },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      aria-label="Navegación principal"
    >
      <div className="glass glass-shadow flex w-full max-w-md items-center justify-between rounded-capsule px-2 py-2">
        {TABS.map((tab) => {
          const active = pathname?.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="tap-target relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-capsule py-1.5 text-ink-muted"
            >
              {active && (
                <motion.div
                  layoutId="tab-active"
                  className="absolute inset-0 rounded-capsule bg-primary-base"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className={cn("relative z-10", active && "text-white")}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              </span>
              <span
                className={cn(
                  "relative z-10 text-[10.5px] font-medium",
                  active && "text-white"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
