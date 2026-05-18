# Plain View

> [中文](README.md) · **English**

A Chromium-based browser extension that turns your browser into a friendly viewer for **JSON / Markdown / SQL / YAML / CSV / LOG** files: auto-formatting, syntax highlighting, collapsible trees, sortable & editable tables, light/dark themes — zero runtime dependencies, hand-written, no bundler.

**Repositories:** [GitHub](https://github.com/777vv/plain-view) · [Gitee](https://gitee.com/vv777/plain-view)

---

## Highlights

- **6 formats out of the box**: `JSON` · `Markdown` · `SQL` · `YAML` · `CSV / TSV` · `LOG / TXT`
- **JSON tree view** — all nodes expanded by default, manually collapsible; URLs in strings are clickable
- **Markdown rendering** — headings, lists, tables, task lists, code blocks; `javascript:` / `data:` and other dangerous protocols are auto-blocked, no XSS risk
- **SQL pretty-print + highlight** — auto-formats `SELECT` / `INSERT` / `UPDATE` / `CREATE TABLE` etc.; `IN (…)` / `VALUES (…)` stay on one line, long column definitions wrap; built-in keyword search
- **YAML highlighting** — comments, anchors, booleans/numbers/strings each in their own color
- **CSV / TSV table**
  - Click a column header to sort; **sticky header**, **horizontal scrollbar always pinned to the viewport bottom**
  - **Double-click a cell to edit**; press Enter or click outside to commit (a `✱` marker appears on changed cells)
  - Chrome would normally download `.csv` as an attachment — this extension **intercepts it and shows a preview instead**
  - "Copy" always reflects your latest edits
- **LOG highlighting** — auto-colors lines by `ERROR` / `WARN` / `INFO` / `DEBUG` / `TRACE`
- **Light / dark themes** (GitHub Light + VS Code Dark), one-click toggle in the toolbar
- **Each format can be individually enabled/disabled** — set in the extension popup, persists across pages and sessions
- **Zero runtime dependencies** — every renderer is hand-written TypeScript; `npm run build` just runs `tsc` and a tiny post-processor

---

## Install (regular users — no build needed)

### 1. Download the release zip

Grab the pre-built zip — no Node.js / npm required:

- **GitHub:** [plain-view.zip](https://github.com/777vv/plain-view/releases/latest/download/plain-view.zip)
- **Gitee** (faster in mainland China): [plain-view.zip](https://gitee.com/vv777/plain-view/releases/download/v0.1.0/plain-view.zip)

### 2. Unzip

Extract the zip to a permanent location (the browser will load it from this directory).

### 3. Load the extension

Pick the section for your browser.

#### 3.1 Chrome

1. Open `chrome://extensions` in the address bar
2. Turn on **"Developer mode"** in the **top-right corner**
3. Click **"Load unpacked"** in the **top-left corner**
4. Select the directory you just unzipped (it must contain `manifest.json`)

#### 3.2 Edge

1. Open `edge://extensions` in the address bar
2. Turn on **"Developer mode"** in the **left sidebar**
3. The **"Load unpacked"** button will appear in the **upper area of the page** — click it
4. Select the directory you just unzipped (it must contain `manifest.json`)

Once loaded, the Plain View icon will appear in the browser toolbar.

---

## Build from source (developers)

If you want to modify the code:

```bash
# GitHub
git clone https://github.com/777vv/plain-view.git
# or Gitee
git clone https://gitee.com/vv777/plain-view.git

cd plain-view
npm install
npm run build
```

Compiled output lands in `dist/`. Then follow the "Load the extension" step above, but select the **project root directory** (the one containing `manifest.json`).

`npm run package` runs the build and produces `release/plain-view.zip`, ready for publishing.

---

## Usage

- **Files on the web**: open any `.json` / `.md` / `.yaml` / `.log` URL — the extension takes over rendering automatically
- **Local files**: drag any supported file into the browser. CSV / TSV are intercepted and opened in the preview page
- **Toolbar**: top-right buttons toggle raw/formatted view, copy, switch theme, adjust font size, view source
- **Extension popup**: click the Plain View icon in the browser toolbar to switch themes or disable specific formats

---

## Supported formats

| Format    | Extensions            | Content-type detection                     |
| --------- | --------------------- | ------------------------------------------ |
| JSON      | `.json` `.jsonp`      | `application/json` `text/json`             |
| Markdown  | `.md` `.markdown`     | `text/markdown`                            |
| SQL       | `.sql`                | (extension only)                           |
| YAML      | `.yaml` `.yml`        | `application/yaml` `text/yaml`             |
| CSV / TSV | `.csv` `.tsv`         | `text/csv`                                 |
| LOG / TXT | `.log` `.txt`         | (content sniffing, JSON/YAML/MD preferred) |

Files served as `text/plain` without a known extension fall back to **content sniffing**: starts with `{` / `[` and parses → JSON; starts with `---` → YAML; starts with `#` → Markdown.

---

## Development

```bash
npm run watch     # incremental rebuild on src/ changes
```

- After editing `src/**/*.ts`, click the extension's "reload" button on `chrome://extensions`
- Editing `styles/base.css` doesn't need a rebuild — just refresh the page

---

## Project layout

```
src/
├── background/      # Service worker: intercepts CSV/TSV downloads and opens the viewer
├── content/         # Content script: detects the format and loads the matching renderer
├── viewer/          # Preview page (for formats Chrome would otherwise auto-download)
├── popup/           # Extension popup
├── renderers/       # Per-format renderers (json / markdown / sql / yaml / csv / log)
└── ui/              # Shared components: toolbar, themes, common helpers, i18n, font size
styles/
└── base.css         # Shared stylesheet for all renderers
scripts/
├── fix-imports.js   # Appends .js extensions to relative imports in tsc output
└── package.ps1      # Invoked by `npm run package` — produces release/plain-view.zip
manifest.json        # Chrome MV3 manifest
popup.html           # Popup HTML
viewer.html          # CSV/TSV preview page HTML
```
