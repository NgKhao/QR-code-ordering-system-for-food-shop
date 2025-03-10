"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import React from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sticky top-0 bg-background z-10">
          <VisuallyHidden>Chi tiết món ăn</VisuallyHidden>
        </DialogTitle>
        <div className="space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
