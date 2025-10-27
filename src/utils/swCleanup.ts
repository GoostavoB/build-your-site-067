// Temporary Service Worker cleanup to avoid stale cached UI during major layout changes
// Remove this once the new layout is confirmed live everywhere
export const swCleanup = () => {
  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => registrations.forEach((reg) => reg.unregister()))
        .catch(() => {});
    }

    if ('caches' in window) {
      caches.keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .catch(() => {});
    }
  } catch (_) {
    // no-op
  }
};
