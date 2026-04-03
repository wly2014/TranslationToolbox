# TranslationToolbox 扩展开发快速入门

本文说明本仓库的目录结构、如何本地调试、运行测试与代码检查，以及与划词翻译功能相关的配置。

## 目录与职责

| 路径 | 说明 |
|------|------|
| `package.json` | 扩展清单：命令、快捷键、激活事件、`main` 入口、依赖等。 |
| `src/extension.js` | **扩展入口**：`activate` / `deactivate`，注册命令并在激活后注册划词 Hover。 |
| `src/hoverTranslation.js` | 划词翻译逻辑：根据选中文本长度选择有道单词建议或豆包长句翻译。 |
| `src/services/youdaoWord.js` | 有道词典「单词/短语」建议接口。 |
| `src/services/youdaoSentence.js` | 有道网页翻译接口（句子级，当前主流程中长文本走豆包，保留供扩展）。 |
| `src/services/doubao.js` | 豆包（火山方舟）Chat Completions 调用，读取用户配置中的 API Key。 |
| `test/index.js` | 测试运行器（导出 `run()`，供 VS Code 测试宿主加载）。 |
| `test/extension.test.js` | 示例单元测试。 |
| `test/runTest.js` | CLI 用：`npm test` 时通过 `@vscode/test-electron` 拉起 VS Code 并执行测试。 |
| `jsconfig.json` | JavaScript 工程配置（含 `@types/vscode` 等，便于编辑器智能提示）。 |

根目录下的 `baidu.js` 等为历史/独立脚本，**未**被扩展主流程引用；修改翻译行为请以 `src/` 下文件为准。

## 环境要求

- 安装 **Node.js**（建议 LTS），在本仓库根目录执行 `npm install` 安装依赖。
- 使用 **VS Code**（或 Cursor）打开本仓库；`engines.vscode` 见 `package.json`，请使用兼容版本。

## 本地运行与调试

1. 在侧栏打开 **运行和调试**（`Ctrl+Shift+D` / macOS：`Cmd+Shift+D`）。
2. 在顶部配置下拉框中选择 **Launch Extension**，按 **F5**（或点击绿色运行按钮）。
3. 会打开一个新的「扩展开发宿主」窗口，其中已加载本扩展。
4. **激活扩展**：本扩展的激活事件为 `onCommand:translationtoolbox.translate`，需至少执行一次该命令后，划词 Hover 等逻辑才会注册。  
   - 在宿主窗口中按 `Ctrl+Alt+T`（macOS：`Cmd+Alt+T`，且焦点在编辑器内），或  
   - 命令面板（`Ctrl+Shift+P` / `Cmd+Shift+P`）搜索并执行 **`translate`**（命令 ID：`translationtoolbox.translate`）。
5. 在编辑器中选中文本并悬停，应出现翻译 Hover（短文本走有道，较长文本走豆包；豆包需在设置中配置 API Key，见下文）。
6. 修改 `src/` 下代码后，可在调试工具栏点击 **重启** 重新加载扩展，或在扩展开发宿主窗口中 **重新加载窗口**（`Ctrl+R` / `Cmd+R`）以加载最新代码。
7. 在 `src/` 中设置断点即可按常规方式单步调试；输出可在 **调试控制台** 查看。

## 用户设置（豆包 API）

长句翻译使用火山方舟接口，需在设置中填写密钥（与 `package.json` 中 `configuration` 一致）：

- **`DouBaoApiKey`**：豆包 / 方舟 API Key（Bearer Token）。

在 JSON 设置中示例：

```json
{
  "DouBaoApiKey": "你的 API Key"
}
```

未正确配置时，豆包请求可能失败；短词仍可有道结果。

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

- **划词无反应**：先执行一次 **`translate` 命令**（或快捷键）以激活扩展，再选中文本悬停。
- **仅短词有翻译、长句失败**：检查 **`DouBaoApiKey`** 与网络；查看调试控制台中的错误输出。
- **`npm test` 很慢或下载大文件**：来自 `@vscode/test-electron` 下载测试用 VS Code；可将 `.vscode-test/` 加入个人忽略列表（本仓库 `.gitignore` 已包含）。

---

更多通用扩展开发说明见官方文档：[Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension)。
