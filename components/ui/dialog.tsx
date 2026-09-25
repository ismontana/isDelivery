"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

function DialogContent({
  children,
  className,
  title,
  open,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  open?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <DialogPrimitive.Portal forceMount>
          <DialogPrimitive.Overlay asChild forceMount>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
          </DialogPrimitive.Overlay>
          <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className={cn(
                "fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-sheet glass glass-shadow p-5 outline-none",
                className
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <DialogPrimitive.Title className="text-base font-semibold text-ink">
                  {title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Close asChild>
                  <button
                    className="tap-target flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-black/5 dark:hover:bg-white/10"
                    aria-label="Cerrar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </DialogPrimitive.Close>
              </div>
              {children}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

export { Dialog, DialogTrigger, DialogContent };
