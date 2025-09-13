"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}

export async function signOutUser() {
  await signOut({ redirectTo: "/signin" });
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return session.user;
}
