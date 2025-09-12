import { forwardRef, LabelHTMLAttributes } from "react";
import { cn } from "./cn";

export const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-gray-700 dark:text-gray-300",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";
