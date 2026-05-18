// Minimal i18n helper: pick between two strings based on browser language.
// Chinese (any zh-* locale) → Chinese; everything else → English.

export function isZh(): boolean {
  return (navigator.language || '').toLowerCase().startsWith('zh');
}

export function t(zh: string, en: string): string {
  return isZh() ? zh : en;
}
