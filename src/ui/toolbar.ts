import { cycleTheme, getStoredTheme, themeLabel } from './themes';

export interface ToolbarCallbacks {
  onRaw: (isRaw: boolean) => void;
  onCopy: () => void;
  onDownload: () => void;
  onSearch?: (query: string) => void;
}

function icon(svg: string): string {
  return `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svg}</svg>`;
}

const ICONS = {
  raw:      icon('<polyline points="4 6 1 8 4 10"/><polyline points="12 6 15 8 12 10"/><line x1="9" y1="3" x2="7" y2="13"/>'),
  copy:     icon('<rect x="4" y="4" width="8" height="10" rx="1"/><path d="M6 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/>'),
  download: icon('<path d="M8 2v8m-3-3 3 3 3-3"/><path d="M3 13h10"/>'),
  search:   icon('<circle cx="6.5" cy="6.5" r="4"/><line x1="10" y1="10" x2="14" y2="14"/>'),
  theme:    icon('<circle cx="8" cy="8" r="4"/><line x1="8" y1="1" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="1" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/>'),
  prevMatch: icon('<polyline points="4 10 8 6 12 10"/>'),
  nextMatch: icon('<polyline points="4 6 8 10 12 6"/>'),
};

export function createToolbar(
  format: string,
  filename: string,
  raw: string,
  callbacks: ToolbarCallbacks,
): { toolbar: HTMLElement; searchBar: HTMLElement } {
  // ── Toolbar ───────────────────────────────────────────────────
  const toolbar = document.createElement('div');
  toolbar.className = 'fv-toolbar';

  const left = document.createElement('div');
  left.className = 'fv-toolbar-left';

  const badge = document.createElement('span');
  badge.className = 'fv-badge';
  badge.textContent = format;

  const fname = document.createElement('span');
  fname.className = 'fv-filename';
  fname.textContent = filename;
  fname.title = filename;

  left.append(badge, fname);

  const right = document.createElement('div');
  right.className = 'fv-toolbar-right';

  let searchBtn: HTMLButtonElement | null = null;
  if (callbacks.onSearch) {
    searchBtn = btn(ICONS.search, '搜索 (Ctrl+F)');
  }

  const rawBtn   = btn(ICONS.raw, '切换原始内容');
  const copyBtn  = btn(ICONS.copy, '复制');
  const dlBtn    = btn(ICONS.download, '下载');
  const themeBtn = btn(ICONS.theme, `主题：${themeLabel(getStoredTheme())}`);

  const divider = document.createElement('div');
  divider.className = 'fv-divider';

  if (searchBtn) right.append(searchBtn, divider.cloneNode() as HTMLElement);
  right.append(rawBtn, copyBtn, dlBtn, divider, themeBtn);
  toolbar.append(left, right);

  // ── Search Bar ────────────────────────────────────────────────
  const searchBar = document.createElement('div');
  searchBar.className = 'fv-search-bar';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'fv-search-close';
  closeBtn.textContent = '×';
  closeBtn.dataset.tip = '关闭搜索 (Esc)';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'fv-search-nav';
  prevBtn.innerHTML = ICONS.prevMatch;
  prevBtn.dataset.tip = '上一个 (Shift+Enter)';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'fv-search-nav';
  nextBtn.innerHTML = ICONS.nextMatch;
  nextBtn.dataset.tip = '下一个 (Enter)';

  const searchInput = document.createElement('input');
  searchInput.className = 'fv-search-input';
  searchInput.type = 'text';
  searchInput.placeholder = '搜索…';

  const countSpan = document.createElement('span');
  countSpan.className = 'fv-search-count';

  searchBar.append(closeBtn, prevBtn, nextBtn, searchInput, countSpan);

  // ── Search state ──────────────────────────────────────────────
  let highlights: HTMLElement[] = [];
  let currentIdx = -1;

  function runSearch(q: string): void {
    callbacks.onSearch!(q);
    highlights = Array.from(document.querySelectorAll<HTMLElement>('.fv-highlight'));
    currentIdx = highlights.length > 0 ? 0 : -1;
    updateCount();
    if (currentIdx >= 0) scrollToMatch(currentIdx);
  }

  function navigate(dir: 1 | -1): void {
    if (highlights.length === 0) return;
    currentIdx = (currentIdx + dir + highlights.length) % highlights.length;
    updateCount();
    scrollToMatch(currentIdx);
  }

  function scrollToMatch(idx: number): void {
    highlights.forEach((el, i) => el.classList.toggle('fv-highlight-current', i === idx));
    highlights[idx]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function updateCount(): void {
    if (highlights.length === 0) {
      countSpan.textContent = searchInput.value.trim() ? '无结果' : '';
    } else {
      countSpan.textContent = `${currentIdx + 1} / ${highlights.length}`;
    }
  }

  // ── Events ────────────────────────────────────────────────────
  let isRaw = false;

  rawBtn.addEventListener('click', () => {
    isRaw = !isRaw;
    rawBtn.classList.toggle('active', isRaw);
    rawBtn.dataset.tip = isRaw ? '显示格式化视图' : '切换原始内容';
    callbacks.onRaw(isRaw);
  });

  copyBtn.addEventListener('click', async () => {
    callbacks.onCopy();
    const orig = copyBtn.innerHTML;
    copyBtn.innerHTML = icon('<polyline points="3 8 6 11 13 4"/>');
    setTimeout(() => { copyBtn.innerHTML = orig; }, 1200);
  });

  dlBtn.addEventListener('click', () => callbacks.onDownload());

  themeBtn.addEventListener('click', () => {
    const next = cycleTheme();
    themeBtn.dataset.tip = `主题：${themeLabel(next)}`;
  });

  if (searchBtn && callbacks.onSearch) {
    searchBtn.addEventListener('click', () => toggleSearch(true));

    searchInput.addEventListener('input', () => {
      runSearch(searchInput.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleSearch(false);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        navigate(e.shiftKey ? -1 : 1);
      }
    });

    closeBtn.addEventListener('click', () => toggleSearch(false));
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));
  }

  function toggleSearch(open: boolean): void {
    searchBar.classList.toggle('visible', open);
    if (open) {
      searchInput.focus();
      searchInput.select();
    } else {
      searchInput.value = '';
      highlights.forEach(el => el.classList.remove('fv-highlight-current'));
      callbacks.onSearch?.('');
      highlights = [];
      currentIdx = -1;
      countSpan.textContent = '';
    }
  }

  // Ctrl+F shortcut
  if (callbacks.onSearch) {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        toggleSearch(!searchBar.classList.contains('visible'));
      }
    });
  }

  return { toolbar, searchBar };
}

function btn(html: string, tip: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = 'fv-btn';
  b.innerHTML = html;
  b.dataset.tip = tip;
  return b;
}
