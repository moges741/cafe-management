/**
 * Service Worker Registration & PWA Lifecycle Utility
 */

export interface SWRegistrationOptions {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

export function registerSW(options: SWRegistrationOptions = {}): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Register on window load to avoid competing for bandwidth during initial page load
  window.addEventListener('load', () => {
    const swUrl = '/sw.js';

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('[PWA] Service Worker registered with scope:', registration.scope);

        // Check for updates on register
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content available; please refresh or apply update
                console.log('[PWA] New content is available and will be used when all tabs are closed.');
                options.onUpdate?.(registration);
              } else {
                // Content is cached for offline use
                console.log('[PWA] Content is cached for offline use.');
                options.onSuccess?.(registration);
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('[PWA] Network status: Online');
      options.onOnline?.();
    });

    window.addEventListener('offline', () => {
      console.log('[PWA] Network status: Offline');
      options.onOffline?.();
    });
  });
}

export function unregisterSW(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('[PWA] Service Worker unregistration failed:', error);
      });
  }
}
