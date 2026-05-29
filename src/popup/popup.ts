import { THEMES, Theme, applyTheme, getStoredTheme, themeLabel } from '../ui/themes';

const FORMATS: { id: string; label: string }[] = [
  { id: 'json',     label: 'JSON / JSONP' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'sql',      label: 'SQL' },
  { id: 'yaml',     label: 'YAML' },
  { id: 'csv',      label: 'CSV / TSV' },
  { id: 'log',      label: 'LOG / TXT' },
];

const DISABLED_KEY = 'disabledFormats';
const LOCAL_ONLY_KEY = 'localFilesOnly';
const DISABLED_HOSTS_KEY = 'disabledHosts';

async function getDisabled(): Promise<Set<string>> {
  const data = await chrome.storage.local.get(DISABLED_KEY);
  return new Set((data[DISABLED_KEY] as string[]) ?? []);
}

async function setDisabled(disabled: Set<string>): Promise<void> {
  await chrome.storage.local.set({ [DISABLED_KEY]: [...disabled] });
}

async function getLocalOnly(): Promise<boolean> {
  const data = await chrome.storage.local.get(LOCAL_ONLY_KEY);
  return !!data[LOCAL_ONLY_KEY];
}

async function setLocalOnly(value: boolean): Promise<void> {
  await chrome.storage.local.set({ [LOCAL_ONLY_KEY]: value });
}

async function getDisabledHosts(): Promise<string[]> {
  const data = await chrome.storage.local.get(DISABLED_HOSTS_KEY);
  return (data[DISABLED_HOSTS_KEY] as string[]) ?? [];
}

async function setDisabledHosts(hosts: string[]): Promise<void> {
  await chrome.storage.local.set({ [DISABLED_HOSTS_KEY]: hosts });
}

// ── Init ──────────────────────────────────────────────────────

const disabled = await getDisabled();
const localOnly = await getLocalOnly();
const disabledHosts = await getDisabledHosts();

// Theme buttons
const themeGrid = document.getElementById('theme-grid')!;
THEMES.forEach((t) => {
  const btn = document.createElement('button');
  btn.className = 'theme-btn' + (t === getStoredTheme() ? ' active' : '');
  btn.textContent = themeLabel(t);
  btn.addEventListener('click', () => {
    applyTheme(t);
    // Send message to active tab to switch theme
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId != null) {
        chrome.tabs.sendMessage(tabId, { type: 'SET_THEME', theme: t }).catch(() => {});
      }
    });
    themeGrid.querySelectorAll('.theme-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  });
  themeGrid.appendChild(btn);
});

// Format toggles
const toggleContainer = document.getElementById('format-toggles')!;
FORMATS.forEach(({ id, label }) => {
  const row = document.createElement('div');
  row.className = 'format-row';

  const nameEl = document.createElement('span');
  nameEl.className = 'format-name';
  nameEl.textContent = label;

  const switchWrap = document.createElement('label');
  switchWrap.className = 'toggle-switch';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = !disabled.has(id);

  input.addEventListener('change', () => {
    if (input.checked) disabled.delete(id);
    else disabled.add(id);
    setDisabled(disabled);
  });

  const track = document.createElement('span');
  track.className = 'toggle-track';

  switchWrap.append(input, track);
  row.append(nameEl, switchWrap);
  toggleContainer.appendChild(row);
});

// Host settings
const localOnlyToggle = document.getElementById('local-only-toggle') as HTMLInputElement;
localOnlyToggle.checked = localOnly;
localOnlyToggle.addEventListener('change', () => setLocalOnly(localOnlyToggle.checked));

const disabledHostsTextarea = document.getElementById('disabled-hosts') as HTMLTextAreaElement;
disabledHostsTextarea.value = disabledHosts.join('\n');
disabledHostsTextarea.addEventListener('change', () => {
  const hosts = disabledHostsTextarea.value
    .split('\n')
    .map(h => h.trim().toLowerCase())
    .filter(h => h.length > 0);
  setDisabledHosts(hosts);
});

// Status: query active tab for current format
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  const url = tab?.url ?? '';
  const statusDot  = document.getElementById('status-dot')!;
  const statusText = document.getElementById('status-text')!;

  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  const extMap: Record<string, string> = {
    json: 'JSON', jsonp: 'JSON',
    md: 'Markdown', markdown: 'Markdown',
    sql: 'SQL',
    yaml: 'YAML', yml: 'YAML',
    csv: 'CSV', tsv: 'TSV',
    log: 'LOG', txt: 'LOG',
  };

  if (ext in extMap) {
    statusDot.classList.add('active');
    statusText.textContent = `Rendering as ${extMap[ext]}`;
  } else {
    statusDot.classList.add('inactive');
    statusText.textContent = 'No file detected on this page';
  }
});
