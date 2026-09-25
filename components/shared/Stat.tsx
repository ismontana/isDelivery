import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatProps {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  tone?: "default" | "danger" | "success";
  className?: string;
}

export function Stat({ label, value, sub, icon, tone = "default", className }: StatProps) {
  return (
    <Card className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-muted">{label}</span>
        {icon && <span className="text-primary-accent">{icon}</span>}
      </div>
      <span
        className={cn(
          "text-2xl font-semibold tracking-tight text-ink",
          tone === "danger" && "text-danger",
          tone === "success" && "text-nexo-verde"
        )}
      >
        {value}
      </span>
      {sub && <span className="text-xs text-ink-muted">{sub}</span>}
    </Card>
  );
}
