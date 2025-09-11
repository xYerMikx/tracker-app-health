import { HTMLAttributes } from "react";
import { cn } from "./cn";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number; 
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-gray-900 dark:bg-white transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
