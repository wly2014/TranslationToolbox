# TranslationToolbox 扩展开发快速入门

本文说明本仓库的目录结构、如何本地调试、运行测试与代码检查，以及与划词翻译功能相关的配置。

## 目录与职责

| 路径 | 说明 |
|------|------|
| `package.json` | 扩展清单：命令、快捷键、激活事件、`main` 入口、依赖等。 |
| `src/extension.js` | **扩展入口**：`activate` / `deactivate`，注册命令并在激活后注册划词 Hover。 |
| `src/hoverTranslation.js` | 划词翻译逻辑：日文（含假名）仅豆包；否则短词有道、长句豆包。 |
| `src/japaneseDetect.js` | 假名检测，用于日文路由。 |
| `src/services/youdaoWord.js` | 有道词典「单词/短语」建议接口。 |
| `src/services/arkClient.js` | 火山方舟 Chat Completions HTTP 封装（翻译与连通性测试共用）。 |
| `src/services/doubao.js` | 豆包翻译：组装 system/user 消息并调用 `arkClient`。 |
| `src/doubaoConnectionTest.js` | 连通性测试：最小 `ping` 请求，格式化错误信息。 |
| `src/config.js` | 解析 `translationtoolbox.DouBaoApiKey` / `DouBaoApiKey`（顶层）及 `DouBaoModel`（trim）。 |
| `test/index.js` | 测试运行器（导出 `run()`，供 VS Code 测试宿主加载）。 |
| `test/extension.test.js` | 示例单元测试。 |
| `test/runTest.js` | CLI 用：`npm test` 时通过 `@vscode/test-electron` 拉起 VS Code 并执行测试。 |
| `jsconfig.json` | JavaScript 工程配置（含 `@types/vscode` 等，便于编辑器智能提示）。 |

## 环境要求

- 安装 **Node.js**（建议 LTS），在本仓库根目录执行 `npm install` 安装依赖。
- 使用 **VS Code**（或 Cursor）打开本仓库；`engines.vscode` 见 `package.json`，请使用兼容版本。

## 本地运行与调试

1. 在侧栏打开 **运行和调试**（`Ctrl+Shift+D` / macOS：`Cmd+Shift+D`）。
2. 在顶部配置下拉框中选择 **Launch Extension**，按 **F5**（或点击绿色运行按钮）。
3. 会打开一个新的「扩展开发宿主」窗口，其中已加载本扩展。
4. **激活扩展**：本扩展使用 **`onStartupFinished`**，窗口启动完成后即激活并注册划词 Hover，**无需**先执行命令。可选：按 `Ctrl+Alt+T`（macOS：`Cmd+Alt+T`）或命令面板执行 **`translate`**（`translationtoolbox.translate`）。
5. 在编辑器中选中文本并悬停：短文本走有道；**较长文本（≥3 个词）走豆包**，须在设置中配置有效 API Key（见下文），否则 Hover 会提示且不请求网关。
6. 修改 `src/` 下代码后，可在调试工具栏点击 **重启** 重新加载扩展，或在扩展开发宿主窗口中 **重新加载窗口**（`Ctrl+R` / `Cmd+R`）以加载最新代码。
7. 在 `src/` 中设置断点即可按常规方式单步调试；输出可在 **调试控制台** 查看。

## 用户设置（豆包 API）

长句翻译使用火山方舟接口，配置项为：

- **`translationtoolbox.DouBaoApiKey`**：方舟 API Key。也可在 `settings.json` **用户级顶层**使用 **`DouBaoApiKey`**（无 `translationtoolbox.` 前缀）。
- **`translationtoolbox.DouBaoModel`**：模型 ID；也可顶层 **`DouBaoModel`**。
- **`translationtoolbox.DouBaoSystemPrompt`**：豆包长句的 **system** 提示词（设置 UI 中为多行文本）；留空则使用扩展内置默认。

JSON 示例：

```json
{
  "translationtoolbox.DouBaoApiKey": "你的 API Key",
  "translationtoolbox.DouBaoModel": "doubao-1.5-pro-32k-250115",
  "translationtoolbox.DouBaoSystemPrompt": "你是专业翻译助手……"
}
```

未配置有效 Key（空、`default` 等）时，长句不会请求豆包；短词仍可有道结果。

## 测试豆包连接（API Key 与模型）

配置好 Key 与模型 ID 后，建议先验证连通性：

1. **设置 UI**：打开设置并搜索 **TranslationToolbox**，在 **DouBaoApiKey** 或 **DouBaoModel** 下方的说明中，点击 **「测试 API Key 与模型连通性」**（通过 `command:` 链接触发，与划词使用相同配置）。  
2. **命令面板**（`Ctrl+Shift+P` / `Cmd+Shift+P`）→ **TranslationToolbox: 测试豆包连接（API Key 与模型）**。

成功会弹出简要说明；失败会提示 HTTP 状态、方舟返回的错误信息或网络问题，便于排查 Key、模型 ID 与开通状态。

## 浏览 VS Code 扩展 API 类型

类型定义来自开发依赖 **`@types/vscode`**，一般位于：

`node_modules/@types/vscode/index.d.ts`

在编辑器中按住 `Ctrl`（macOS：`Cmd`）并点击代码里的 `require('vscode')` 或从「转到定义」进入，即可查看完整 API。

## 运行测试

### 方式一：调试配置（与日常 F5 类似）

1. 在 **运行和调试** 中选择 **Launch Tests**。
2. 按 **F5**，会在新窗口中加载扩展并执行 `test/` 下由 `test/index.js` 驱动的 Mocha 测试。
3. 在 **调试控制台** 查看通过/失败信息。

### 方式二：命令行

在项目根目录执行：

```bash
npm test
```

首次运行可能下载用于测试的 VS Code 到 `.vscode-test/`（体积较大，属正常现象）。测试通过则进程退出码为 0。

新增测试时，可将 `*.test.js` 加入 `test/index.js` 的 Mocha 加载列表（当前示例只加载 `extension.test.js`）。

## 代码检查（ESLint）

```bash
npm run lint
```

默认检查 `src/**/*.js`。修改 `.eslintrc.json` 可调整规则。

## 打包与发布（可选）

若已全局安装 **`@vscode/vsce`**：

```bash
npx @vscode/vsce package
```

会在根目录生成 `.vsix`。发布前请确认 `package.json` 中 `publisher`、`repository` 等信息正确，并阅读 [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) 官方文档。

## 常见问题

- **划词无反应**：确认扩展已随窗口启动完成加载（`onStartupFinished`）；检查输出面板中本扩展是否有报错；再试选区与悬停。
- **仅短词有翻译、长句失败**：检查 **`translationtoolbox.DouBaoApiKey`**（或顶层 **`DouBaoApiKey`**）是否为有效 Key（非空、非 `default`）；检查网络；查看调试控制台错误。
- **`npm test` 很慢或下载大文件**：来自 `@vscode/test-electron` 下载测试用 VS Code；可将 `.vscode-test/` 加入个人忽略列表（本仓库 `.gitignore` 已包含）。

---

更多通用扩展开发说明见官方文档：[Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension)。
