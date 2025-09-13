"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Intent = "default" | "success" | "warning" | "danger";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  intent?: Intent;
  max?: number;
}

const progressClassMap: Record<Intent, string> = {
  default: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export function Progress({
  value = 0,
  intent = "default",
  max = 100,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  const barClass = progressClassMap[intent];

  return (
    <div
      className={cn(
        "w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-500 ease-out", barClass)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
