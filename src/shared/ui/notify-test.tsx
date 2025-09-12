"use client";

import { Button } from "@/shared/ui/button";

export function NotificationTestButton() {
  async function sendTest() {
    try {
      if (!("serviceWorker" in navigator)) return;
      const reg = await navigator.serviceWorker.ready;
      reg.active?.postMessage({ type: "TEST" });
    } catch {}
  }
  return (
    <Button variant="outline" onClick={sendTest}>
      Отправить тестовое уведомление
    </Button>
  );
}
