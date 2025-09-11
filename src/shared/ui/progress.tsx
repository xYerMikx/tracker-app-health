import { HTMLAttributes } from "react";
import { cn } from "./cn";

type Intent = "default" | "success" | "warning" | "danger";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  intent?: Intent;
}

const progressClassMap: Record<Intent, string> = {
  default: "bg-gray-900 dark:bg-white",
  success: "bg-green-600 dark:bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
}

export function Progress({ value = 0, intent = "default", className, ...props }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const barClass = progressClassMap[intent];

  return (
    <div
      className={cn(
        "w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden",
        className
      )}
      {...props}
    >
      <div className={cn("h-full transition-[width] duration-300", barClass)} style={{ width: `${clamped}%` }} />
    </div>
  );
}
