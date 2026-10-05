// ShebaMitro Healthcare Custom PWA Service Worker for Web Push & Alarms
self.addEventListener("install", (event) => {
  console.log("[SW] Installed ShebaMitro PWA Service Worker");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated ShebaMitro PWA Service Worker");
  event.waitUntil(self.clients.claim());
});

// 1. Web Push Event Listener
self.addEventListener("push", (event) => {
  let payload = {
    title: "Medicine Alarm Due: Napa Extra 500mg",
    body: "Take 1 Tablet After Meal now to maintain adherence.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    sound: "/sounds/alarm-chime.mp3",
    data: { dosageId: "dose-101", userId: "usr-789" },
  };

  if (event.data) {
    try {
      payload = Object.assign({}, payload, event.data.json());
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const notificationOptions = {
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    vibrate: [200, 100, 200, 100, 400],
    tag: "medicine-alarm-" + (payload.data?.dosageId || Date.now()),
    renotify: true,
    requireInteraction: true,
    data: payload.data,
    actions: [
      { action: "take_dose", title: "Take Dose 💊" },
      { action: "dismiss", title: "Dismiss ❌" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions)
  );
});

// 2. Notification Action Click Listener
self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const action = event.action;
  const dosageId = notification.data?.dosageId;

  notification.close();

  if (action === "take_dose") {
    // Send POST update to NestJS backend
    const takeDosePromise = fetch("/api/v1/dosages/take", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dosageId, takenAt: new Date().toISOString() }),
    })
      .then((res) => res.json())
      .catch((err) => console.error("Error updating NestJS DB dosage status:", err));

    // Broadcast message to active client tabs
    const broadcastPromise = self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        client.postMessage({
          type: "TAKE_DOSE_SUCCESS",
          dosageId: dosageId,
        });
      }

      if (clientList.length > 0 && clientList[0]) {
        return clientList[0].focus();
      }
      return self.clients.openWindow("/dashboard/patient");
    });

    event.waitUntil(Promise.all([takeDosePromise, broadcastPromise]));
  } else if (action === "dismiss") {
    console.log("[SW] Notification dismissed by user");
  } else {
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clientList) => {
        if (clientList.length > 0 && clientList[0]) {
          return clientList[0].focus();
        }
        return self.clients.openWindow("/dashboard/patient");
      })
    );
  }
});
