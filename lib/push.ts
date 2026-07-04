export async function registerServiceWorkerAndRequestPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push notifications are not supported in this browser.");
    return null;
  }

  try {
    // 1. Register the Service Worker
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("Service Worker registered successfully.");

    // 2. Request Notification Permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return null;
    }

    // 3. You would typically generate a push subscription here to send to your backend.
    // Since you have no backend, you will rely on the local Service Worker 
    // or Web Notifications API triggered from the client-side app.
    return registration;

  } catch (error) {
    console.error("Error setting up push notifications:", error);
    return null;
  }
}