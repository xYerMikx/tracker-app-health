"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

interface TagProps {
  value: number;
  onClick: (value: number) => void;
  isSelected?: boolean;
  className?: string;
}

export function WaterTag({ value, onClick, isSelected, className }: TagProps) {
  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      size="sm"
      className={cn(
        "rounded-full px-3 py-1 text-sm font-medium transition-all",
        "hover:scale-105 hover:shadow-sm",
        isSelected && "bg-primary text-primary-foreground",
        className
      )}
      onClick={() => onClick(value)}
    >
      {value} мл
    </Button>
  );
}
