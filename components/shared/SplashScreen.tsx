import { Droplets } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-3">
      <div className="flex h-16 w-16 items-center justify-center rounded-card bg-primary-base text-white">
        <Droplets className="h-8 w-8" />
      </div>
      <p className="text-sm font-medium text-ink-muted">isDelivery</p>
    </div>
  );
}
