// Shared utilities used by every renderer + the content/viewer entry points.

import { applyTheme, getStoredTheme } from './themes';

export function setupPage(title: string): void {
  document.title = title;
  document.body.innerHTML = '';
  document.body.className = 'fv-body';
  applyTheme(getStoredTheme());
}

export function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function download(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Inject the base stylesheet. Returns a promise that resolves once the
// stylesheet has loaded (or failed), so the caller can render afterwards
// without a flash of unstyled content.
export function injectStyles(): Promise<void> {
  const existing = document.getElementById('fv-base-styles') as HTMLLinkElement | null;
  if (existing) return existing.sheet ? Promise.resolve() : waitFor(existing);

  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = chrome.runtime.getURL('styles/base.css');
  link.id   = 'fv-base-styles';
  (document.head ?? document.documentElement).appendChild(link);
  return waitFor(link);
}

function waitFor(link: HTMLLinkElement): Promise<void> {
  return new Promise((resolve) => {
    if (link.sheet) { resolve(); return; }
    link.addEventListener('load',  () => resolve(), { once: true });
    link.addEventListener('error', () => resolve(), { once: true });
  });
}
