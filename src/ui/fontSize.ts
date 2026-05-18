// Font-size preference: small / medium / large, persisted in localStorage.
// Applied by toggling a body class that overrides the --fv-font-size CSS var,
// so every renderer that uses that variable scales automatically.

import { isZh } from './i18n';

export const FONT_SIZES = ['small', 'medium', 'large'] as const;
export type FontSize = typeof FONT_SIZES[number];

const STORAGE_KEY = 'fv_font_size';
const CLASSES = ['fv-size-small', 'fv-size-medium', 'fv-size-large'];

export function getStoredFontSize(): FontSize {
  try {
    const val = localStorage.getItem(STORAGE_KEY) as FontSize | null;
    if (val && (FONT_SIZES as readonly string[]).includes(val)) return val;
  } catch { /* sandboxed / disabled storage — fall through */ }
  return 'medium';
}

export function applyFontSize(size: FontSize): void {
  document.body.classList.remove(...CLASSES);
  document.body.classList.add(`fv-size-${size}`);
  try { localStorage.setItem(STORAGE_KEY, size); } catch {}
}

export function cycleFontSize(): FontSize {
  const current = getStoredFontSize();
  const idx = FONT_SIZES.indexOf(current);
  const next = FONT_SIZES[(idx + 1) % FONT_SIZES.length];
  applyFontSize(next);
  return next;
}

export function fontSizeLabel(size: FontSize): string {
  const labels: Record<FontSize, { zh: string; en: string }> = {
    small:  { zh: '小', en: 'Small' },
    medium: { zh: '中', en: 'Medium' },
    large:  { zh: '大', en: 'Large' },
  };
  const l = labels[size];
  return isZh() ? l.zh : l.en;
}
