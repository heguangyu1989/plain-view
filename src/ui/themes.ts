export const THEMES = ['github-light', 'github-dark'] as const;
export type Theme = typeof THEMES[number];

const STORAGE_KEY = 'fv_theme';

export function getStoredTheme(): Theme {
  try {
    const val = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (val && (THEMES as readonly string[]).includes(val)) return val;
  } catch {}
  return 'github-light';
}

export function applyTheme(theme: Theme): void {
  if (theme === 'github-light') {
    document.documentElement.removeAttribute('data-fv-theme');
  } else {
    document.documentElement.setAttribute('data-fv-theme', theme);
  }
  try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
}

export function cycleTheme(): Theme {
  const current = getStoredTheme();
  const idx = THEMES.indexOf(current);
  const next = THEMES[(idx + 1) % THEMES.length];
  applyTheme(next);
  return next;
}

export function themeLabel(theme: Theme): string {
  const labels: Record<Theme, string> = {
    'github-light': '亮白',
    'github-dark':  '暗黑',
  };
  return labels[theme];
}
