/** Sự kiện để PWARegister mở hộp cài app (Android/Chrome) hoặc hướng dẫn cài (iPhone, trình duyệt khác). */
export const INSTALL_EVENT = 'bhh:install-app';

/** Sự kiện cài app đã bắt sớm ở <head> (layout.tsx) sẵn sàng. */
export const INSTALL_READY_EVENT = 'bhh:install-ready';

export type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** Sự kiện cài app Chrome/Android đã bắt được (null = trình duyệt chưa cho cài bằng 1 nút). */
export function pendingInstall(): InstallPromptEvent | null {
  return (window as unknown as { __bhhInstall?: InstallPromptEvent | null }).__bhhInstall ?? null;
}

export function clearPendingInstall() {
  (window as unknown as { __bhhInstall?: InstallPromptEvent | null }).__bhhInstall = null;
}
