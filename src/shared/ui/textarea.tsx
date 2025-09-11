import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
