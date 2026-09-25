"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AmountPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  label: string;
  max: number;
  prefix?: string;
  suffix?: string;
  onConfirm: (value: number) => void;
}

export function AmountPromptDialog({
  open,
  onOpenChange,
  title,
  label,
  max,
  prefix,
  suffix,
  onConfirm,
}: AmountPromptDialogProps) {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setValue("");
      setError("");
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(value);
    if (!value || isNaN(num) || num <= 0) {
      setError("Ingresa una cantidad válida");
      return;
    }
    if (num > max) {
      setError(`No puede exceder ${prefix ?? ""}${max}${suffix ?? ""}`);
      return;
    }
    onConfirm(num);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={title} open={open} className="max-w-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount-prompt">{label}</Label>
            <div className="relative">
              {prefix && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-muted">
                  {prefix}
                </span>
              )}
              <Input
                id="amount-prompt"
                type="number"
                min="0"
                step="any"
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={prefix ? "pl-7" : undefined}
                placeholder={`Máx. ${max}`}
              />
            </div>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Confirmar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
