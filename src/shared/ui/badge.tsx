import { HTMLAttributes } from "react";
import { cn } from "./cn";

type Variant = "default" | "success" | "warning" | "danger";

const badgeClassesMap: Record<Variant, string> = {
  default: "bg-white/80 dark:bg-white/5 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700",
  success: "bg-green-100 text-green-800 dark:bg-green-400/10 dark:text-green-300 border-green-200 dark:border-green-900",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300 border-amber-200 dark:border-amber-900",
  danger: "bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-300 border-red-200 dark:border-red-900",
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  const { variant = "default", ...rest } = props;
  const variantClass = badgeClassesMap[variant];    

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border",
        variantClass,
        className
      )}
      {...rest}
    />
  );
}
