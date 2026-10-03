"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";

export function RepartidorFormModal({
  open,
  onOpenChange,
  negocioId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  negocioId: string;
}) {
  const crearRepartidor = useAuthStore((s) => s.crearRepartidor);

  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setNombre("");
    setEmail("");
    setTelefono("");
    setPassword("");
    setError("");
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !password) {
      setError("Completa nombre, correo y contraseña");
      return;
    }
    const result = crearRepartidor(negocioId, {
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      password,
    });
    if (!result.ok) {
      setError(result.error ?? "No se pudo crear la cuenta");
      return;
    }
    toast.success("Repartidor agregado");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Nuevo repartidor" open={open} className="max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <Label>Correo</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mín. 6 caracteres — se la compartes tú"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Agregar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
