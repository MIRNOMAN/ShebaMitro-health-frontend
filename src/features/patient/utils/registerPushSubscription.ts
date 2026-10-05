/**
 * Registers Web Push Notifications VAPID subscription keys with NestJS Backend.
 */
export async function registerPushSubscriptionKeys(userId: string) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Web Push Notifications are not supported in this browser.");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Public VAPID Key from environment or fallback
    const publicVapidKey =
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
      "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgT8iG1bU1kX1x2Y3z";

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    // Send push subscription keys payload to NestJS backend API
    const response = await fetch("/api/v1/notifications/push-subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        subscription,
      }),
    });

    console.log("Web Push Subscription Keys registered with NestJS Backend successfully.");
    return subscription;
  } catch (error) {
    console.error("Error registering Web Push subscription keys:", error);
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
