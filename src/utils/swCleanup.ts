// Aggressive cache cleanup for subscription system refactor
export const swCleanup = () => {
  try {
    console.log('[Cache] Starting aggressive cleanup...');
    
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => {
          console.log('[Cache] Unregistering', registrations.length, 'service workers');
          registrations.forEach((reg) => reg.unregister());
        })
        .catch(() => {});
    }

    // Delete all caches
    if ('caches' in window) {
      caches.keys()
        .then((keys) => {
          console.log('[Cache] Deleting', keys.length, 'caches');
          return Promise.all(keys.map((k) => caches.delete(k)));
        })
        .then(() => console.log('[Cache] All caches deleted'))
        .catch(() => {});
    }

    // Clear localStorage subscription data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('subscription') || key.includes('credit') || key.includes('plan') || key.includes('tier'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => {
      console.log('[Cache] Removing localStorage key:', key);
      localStorage.removeItem(key);
    });

    console.log('[Cache] Cleanup complete');
  } catch (err) {
    console.error('[Cache] Cleanup failed:', err);
  }
};
