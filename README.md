# Plain View

基于 Chromium 的浏览器扩展。把浏览器变成 **JSON / Markdown / SQL / YAML / CSV / LOG** 等文件的友好查看器:自动美化、语法高亮、可折叠树、可排序可编辑的表格、亮白/暗黑双主题 —— 零运行时依赖、纯手写、无打包器,**完整安装包仅 ~28 KB**。

**源码仓库:** [GitHub](https://github.com/777vv/plain-view) · [Gitee](https://gitee.com/vv777/plain-view)

---

## 亮点

- **6 种格式开箱即用**:`JSON` · `Markdown` · `SQL` · `YAML` · `CSV / TSV` · `LOG / TXT`
- **JSON 树视图** —— 所有节点默认展开,可手动折叠;字符串里的 URL 直接可点
- **Markdown 渲染** —— 标题、列表、表格、任务列表、代码块全支持;`javascript:` / `data:` 等危险协议自动屏蔽,无 XSS 风险
- **SQL 美化 + 高亮** —— 自动格式化 `SELECT` / `INSERT` / `UPDATE` / `CREATE TABLE` 等语句;`IN (…)` / `VALUES (…)` 保持单行,长列定义自动换行;内置搜索定位
- **YAML 高亮** —— 注释、锚点、布尔/数字/字符串分色
- **CSV / TSV 表格**
  - 点表头排序;**表头随滚动固定**,**横向滚动条始终贴在视口底部**
  - **双击单元格直接编辑**,回车或失焦保存(改动单元格右上角带 `✱` 提示)
  - Chrome 默认会把 CSV 当附件下载,本扩展**自动拦截改成预览**
  - 「复制」「下载」永远使用最新的编辑后数据
- **LOG 高亮** —— 自动按 `ERROR` / `WARN` / `INFO` / `DEBUG` / `TRACE` 上色
- **亮白 / 暗黑双主题**(GitHub Light + VS Code Dark),右上角一键切换
- **每种格式可单独启用/禁用** —— 在扩展弹窗里设置,跨页面跨会话持久化
- **零运行时依赖** —— 所有渲染器均为手写 TypeScript,`npm run build` 只跑 `tsc` + 一段后处理脚本

---

## 安装(普通用户:免构建)

### 1. 下载发布包

直接下载已编译好的 zip,无需任何 Node.js / npm:

- **GitHub:** [plain-view.zip(永远最新版)](https://github.com/777vv/plain-view/releases/latest/download/plain-view.zip)
- **Gitee(国内更快):** [Releases 页面](https://gitee.com/vv777/plain-view/releases) → 下载最新一版的 `plain-view.zip`

### 2. 解压

把 zip 解压到你想长期放置扩展的目录(后面浏览器加载时要指向这个目录,**不要解压完就删**)。

### 3. 加载扩展

按你用的浏览器选一边操作。

#### 3a. Chrome

1. 在地址栏打开 `chrome://extensions`
2. **页面右上角**打开 **「开发者模式」** 开关
3. **页面左上角**点击 **「加载未打包的扩展程序」** 按钮
   > 部分较老版本叫「加载已解压的扩展程序」,意思一样
4. 选择上一步**解压出来的目录**(目录里要能看到 `manifest.json`)

#### 3b. Edge

1. 在地址栏打开 `edge://extensions`
2. **页面左侧边栏**找到 **「开发人员模式」** 开关并打开
3. 这时页面**上半部分**会出现 **「加载解压缩的扩展」** 按钮,点击它
4. 选择上一步**解压出来的目录**(目录里要能看到 `manifest.json`)

加载成功后,浏览器工具栏会出现 Plain View 的图标。

### 4. (推荐)允许访问本地文件

要预览**拖入浏览器的本地 `.csv` / `.tsv`** 文件,需要给扩展授予文件访问权限,否则 viewer 页面会读不到文件:

1. 在 `chrome://extensions`(Edge 是 `edge://extensions`)找到 **Plain View**
2. 点击 **「详细信息」**
3. 打开允许扩展访问本地文件的开关:
   - Chrome:**「允许访问文件网址」**
   - Edge:**「允许访问文件 URL」**

---

## 从源码构建(开发者)

如果你想自己改代码,先 clone 源码再构建:

```bash
# GitHub
git clone https://github.com/777vv/plain-view.git
# 或 Gitee
git clone https://gitee.com/vv777/plain-view.git

cd plain-view
npm install
npm run build
```

构建产物在 `dist/` 目录,然后照「加载扩展」那一步,选**项目根目录**(含 `manifest.json` 的那一层)即可。

另外 `npm run package` 会一并构建并产出 `release/plain-view.zip`,用于发布新版本。

---

## 使用

- **网页上的文件**:打开任意 `.json` / `.md` / `.yaml` / `.log` 等 URL,自动接管渲染
- **本地文件**:直接把文件拖进浏览器即可;CSV / TSV 会被扩展拦截并在预览页中打开
- **工具栏**:右上角按钮可切换「原始内容 / 格式化视图」、复制、下载、切换主题
- **扩展弹窗**:点击 Chrome 工具栏的扩展图标,可切换主题或关闭某些格式的自动渲染

---

## 支持的格式

| 格式      | 扩展名                | 内容类型识别                              |
| --------- | --------------------- | ----------------------------------------- |
| JSON      | `.json` `.jsonp`      | `application/json` `text/json`            |
| Markdown  | `.md` `.markdown`     | `text/markdown`                           |
| SQL       | `.sql`                | (仅扩展名)                                |
| YAML      | `.yaml` `.yml`        | `application/yaml` `text/yaml`            |
| CSV / TSV | `.csv` `.tsv`         | `text/csv`                                |
| LOG / TXT | `.log` `.txt`         | (内容嗅探,JSON/YAML/MD 优先)              |

未被扩展名识别的 `text/plain` 文件会做**内容嗅探**:以 `{` / `[` 开头且能解析的当 JSON、`---` 开头当 YAML、`#` 开头当 Markdown。

---

## 开发

```bash
npm run watch     # 监听 src/ 改动并增量编译
```

- 改动 `src/**/*.ts` 后,在 `chrome://extensions` 点击扩展的「刷新」按钮即可生效
- 改动 `styles/base.css` 不需要重新构建,直接刷新页面即可

---

## 项目结构

```
src/
├── background/      # Service worker:拦截 CSV/TSV 下载并跳转到预览页
├── content/         # 内容脚本:检测页面格式并加载对应渲染器
├── viewer/          # 预览页(用于被 Chrome 默认下载的格式)
├── popup/           # 扩展弹窗
├── renderers/       # 各种格式的渲染器(json / markdown / sql / yaml / csv / log)
└── ui/              # 共享组件:toolbar、themes、common helpers
styles/
└── base.css         # 所有渲染器共享的样式
scripts/
├── fix-imports.js   # 给 tsc 输出的相对 import 补 .js 扩展名
└── package.ps1      # `npm run package` 调用,把扩展打包成 release/plain-view.zip
manifest.json        # Chrome MV3 manifest
popup.html           # 扩展弹窗 HTML
viewer.html          # CSV/TSV 预览页 HTML
```
