"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Droplets, Eye, EyeOff, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { DEMO_CREDENTIALS } from "@/store/authSeed";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showDemo, setShowDemo] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = login(email.trim(), password);
    if (!result.ok) {
      setError(result.error ?? "No se pudo iniciar sesión");
      return;
    }
    router.replace("/");
  }

  function fillDemo(kind: keyof typeof DEMO_CREDENTIALS) {
    setEmail(DEMO_CREDENTIALS[kind].email);
    setPassword(DEMO_CREDENTIALS[kind].password);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-card bg-primary-base text-white">
          <Droplets className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold text-ink">isDelivery</h1>
        <p className="text-[13px] text-ink-muted">Inicia sesión para continuar tu ruta</p>
      </div>

      <Card className="glass glass-shadow space-y-4 border-none">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login-email">Correo electrónico</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="login-password">Contraseña</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="tap-target absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-ink-muted"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
        </form>

        <p className="text-center text-[13px] text-ink-muted">
          ¿No tienes cuenta de negocio?{" "}
          <Link href="/signup" className="font-medium text-primary-accent">
            Crear cuenta
          </Link>
        </p>
      </Card>

      <div className="rounded-card border border-dashed border-border p-3">
        <button
          type="button"
          onClick={() => setShowDemo((v) => !v)}
          className="flex w-full items-center gap-1.5 text-xs font-medium text-ink-muted"
        >
          <Info className="h-3.5 w-3.5" />
          Cuentas de prueba (demo)
        </button>
        {showDemo && (
          <div className="mt-2 space-y-1.5 text-[12px] text-ink-muted">
            <button
              type="button"
              onClick={() => fillDemo("superAdmin")}
              className="block w-full rounded-lg px-2 py-1 text-left hover:bg-black/5 dark:hover:bg-white/5"
            >
              <span className="font-medium text-ink">Plataforma</span> — {DEMO_CREDENTIALS.superAdmin.email}
            </button>
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="block w-full rounded-lg px-2 py-1 text-left hover:bg-black/5 dark:hover:bg-white/5"
            >
              <span className="font-medium text-ink">Admin del negocio</span> — {DEMO_CREDENTIALS.admin.email}
            </button>
            <button
              type="button"
              onClick={() => fillDemo("repartidor")}
              className="block w-full rounded-lg px-2 py-1 text-left hover:bg-black/5 dark:hover:bg-white/5"
            >
              <span className="font-medium text-ink">Repartidor</span> — {DEMO_CREDENTIALS.repartidor.email}
            </button>
            <p className="px-2 pt-1 text-[11px]">Toca una para rellenar el formulario.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
