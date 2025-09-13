"use client";

import { signOutUser } from "@/lib/actions/auth-actions";
import { Button } from "@/shared/ui/button";
import { useTransition } from "react";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOutUser();
    });
  };

  return (
    <Button onClick={handleLogout} disabled={isPending} type="button">
      {isPending ? "Загрузка..." : "Выйти"}
    </Button>
  );
}
