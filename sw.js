self.addEventListener("install", (event) => {
  self.skipWaiting(); // Instantly activate the new service worker
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// Handle incoming Web Push
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || "Habit Reminder";
  const options = {
    body: data.body || "Time for your next task!",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle user clicking the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  // Open the app or focus it if it's already open
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});