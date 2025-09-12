export const showNotification = (title: string, body: string) => {
  if (!("Notification" in window)) return;
  
  try {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body });
      }
    });
  }
  } catch (e) {
    console.error("Failed to show notification", e);
  }
};