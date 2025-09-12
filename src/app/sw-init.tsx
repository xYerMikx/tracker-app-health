"use client";

import { useEffect } from "react";
import { showNotification } from "@/shared/utils/notifications";

export function ServiceWorkerInit() {
  useEffect(() => {
    let interval: number | null = null;

    async function playChime() {
      try {
        const audio = new Audio("/notify.mp3");
        audio.volume = 0.6;
        await audio.play();
      } catch {
       // skip
      }
    }

    async function init() {
      if (!("serviceWorker" in navigator)) return;
      try {
        if (typeof Notification !== "undefined" && Notification.permission === "default") {
          try {
            await Notification.requestPermission();
          } catch (e) {
            console.error("Failed to request notification permission", e);
            showNotification("Ошибка загрузки", "Не удалось запросить разрешение на уведомления")
          }
        }

        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        await navigator.serviceWorker.ready;

        const post = (type: "INIT" | "PING") => {
          navigator.serviceWorker.controller?.postMessage({ type });
          reg.active?.postMessage({ type });
        };

        post("INIT");
        if (interval == null) {
          interval = window.setInterval(() => post("PING"), 60_000);
        }

        const onVis = () => post("PING");
        document.addEventListener("visibilitychange", onVis);
        window.addEventListener("focus", onVis);

        const onMessage = (event: MessageEvent) => {
          const { type } = (event.data || {}) as { type?: string };
          if (type === "PLAY_SOUND") {
            playChime();
          }
        };
        navigator.serviceWorker.addEventListener("message", onMessage);

        return () => {
          if (interval != null) { 
            window.clearInterval(interval);
          }

          document.removeEventListener("visibilitychange", onVis);
          window.removeEventListener("focus", onVis);
          navigator.serviceWorker.removeEventListener("message", onMessage);
        };
      } catch (e) {
        // noop
      }
    }

    const cleanupPromise = init();
    return () => {
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  return null;
}
