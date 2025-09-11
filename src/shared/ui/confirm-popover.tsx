"use client";

import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";

type ConfirmPopoverProps = {
  children: ReactNode; // trigger
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  disabled?: boolean;
};

export function ConfirmPopover({
  children,
  title = "Подтверждение",
  description = "Вы уверены, что хотите выполнить это действие?",
  confirmText = "Да",
  cancelText = "Отмена",
  onConfirm,
  disabled,
}: ConfirmPopoverProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <div className="space-y-2">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-gray-500">{description}</div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              {cancelText}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
              disabled={disabled}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
