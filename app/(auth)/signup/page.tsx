"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import type { TipoNegocio } from "@/types/auth";

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);

  const [negocioNombre, setNegocioNombre] = React.useState("");
  const [tipo, setTipo] = React.useState<TipoNegocio>("purificadora");
  const [propietarioNombre, setPropietarioNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    const result = signup({
      negocioNombre: negocioNombre.trim(),
      tipo,
      propietarioNombre: propietarioNombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      password,
    });
    if (!result.ok) {
      setError(result.error ?? "No se pudo crear la cuenta");
      return;
    }
    toast.success("¡Cuenta creada! Tienes 14 días de prueba gratuita.");
    router.replace("/map");
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
        <h1 className="text-xl font-semibold text-ink">Crea tu cuenta de negocio</h1>
        <p className="text-[13px] text-ink-muted">14 días de prueba gratis, sin tarjeta</p>
      </div>

      <Card className="glass glass-shadow space-y-4 border-none">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="su-negocio">Nombre del negocio</Label>
            <Input
              id="su-negocio"
              value={negocioNombre}
              onChange={(e) => setNegocioNombre(e.target.value)}
              placeholder="Purificadora El Manantial"
              required
            />
          </div>

          <div>
            <Label>Tipo de cuenta</Label>
            <Select value={tipo} onChange={(e) => setTipo(e.target.value as TipoNegocio)}>
              <option value="purificadora">Purificadora (con repartidores)</option>
              <option value="independiente">Vendedor independiente</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="su-nombre">Tu nombre</Label>
            <Input
              id="su-nombre"
              value={propietarioNombre}
              onChange={(e) => setPropietarioNombre(e.target.value)}
              placeholder="Nombre y apellido"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="su-email">Correo</Label>
              <Input
                id="su-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="su-telefono">Teléfono</Label>
              <Input
                id="su-telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="10 dígitos"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="su-password">Contraseña</Label>
              <Input
                id="su-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mín. 6 caracteres"
                required
              />
            </div>
            <div>
              <Label htmlFor="su-password2">Confirmar</Label>
              <Input
                id="su-password2"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" className="w-full">
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-[13px] text-ink-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-primary-accent">
            Iniciar sesión
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}
