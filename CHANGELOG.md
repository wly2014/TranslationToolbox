# Change Log

All notable changes to the "translationtoolbox" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [0.8.0] - 2026-04-04

### Removed（破坏性变更）

- 配置项 **`translationtoolbox.doubaoApiKey`**、**`translationtoolbox.doubaoModel`** 已删除，不再读取。
- 请统一使用 **`translationtoolbox.DouBaoApiKey`**、**`translationtoolbox.DouBaoModel`**，或顶层 **`DouBaoApiKey`** / **`DouBaoModel`**。

## [0.7.1] - 2026-04-04

### Changed

- 连通性测试入口改为设置在 **设置 UI** 中：`doubaoApiKey` / `doubaoModel` 的说明内可点击链接执行测试；移除状态栏「豆包测试」按钮。

## [0.7.0] - 2026-04-04

### Added

- `translationtoolbox.doubaoModel` 改为可自由填写字符串，便于使用方舟控制台中的最新模型 ID。
- 命令 **TranslationToolbox: 测试豆包连接（API Key 与模型）**（`translationtoolbox.testDoubaoConnection`）：向方舟发起最小请求，校验 Key 与模型并反馈 HTTP/业务错误说明。
- 状态栏 **「豆包测试」** 入口，与上述命令相同。

### Changed

- 豆包 HTTP 调用抽取为共享 `arkClient`，翻译与连通性测试共用同一 Endpoint 与鉴权方式。

## [0.6.0] - 2026-04-03

### Changed

- 激活方式改为 `onStartupFinished`：窗口启动完成后自动激活，无需先执行快捷键或命令。
- 最低 VS Code 版本要求提升至 `^1.74.0`（与 `onStartupFinished` 一致）。
- （历史）曾短期使用 `doubaoApiKey` / `doubaoModel` 新键名；0.8 起已移除，仅保留 `DouBaoApiKey` / `DouBaoModel` 风格。
- 长句（豆包）路径：仅在配置有效 API Key 时发起请求；无效或占位时 Hover 提示且不请求网关。
- 豆包请求中的 `model` 与设置一致；修复错误处理中在缺少 `error.response` 时可能崩溃的问题。

## [0.5.0] and earlier

See README Release Notes section for historical entries.
