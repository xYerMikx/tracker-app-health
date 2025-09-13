"use client";

import { signInWithGoogle } from "@/lib/actions/auth-actions";
import { Button } from "@/shared/ui/button";
import { GoogleIcon } from "@/shared/ui/icons/google-icon";
import { useTransition } from "react";

export function LoginButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignIn = () => {
    startTransition(async () => {
      await signInWithGoogle();
    });
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isPending}
      type="button"
      className="gap-2"
    >
      <GoogleIcon />
      {isPending ? "Загрузка..." : "Войти через Google"}
    </Button>
  );
}
