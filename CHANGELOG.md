# Change Log

All notable changes to the "translationtoolbox" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [0.6.0] - 2026-04-03

### Changed

- 激活方式改为 `onStartupFinished`：窗口启动完成后自动激活，无需先执行快捷键或命令。
- 最低 VS Code 版本要求提升至 `^1.74.0`（与 `onStartupFinished` 一致）。
- 配置项统一为 `translationtoolbox.doubaoApiKey`、`translationtoolbox.doubaoModel`；保留对 `DouBaoApiKey` / `DouBaoModel` 旧键的读取。
- 长句（豆包）路径：仅在配置有效 API Key 时发起请求；无效或占位时 Hover 提示且不请求网关。
- 豆包请求中的 `model` 与设置一致；修复错误处理中在缺少 `error.response` 时可能崩溃的问题。

## [0.5.0] and earlier

See README Release Notes section for historical entries.
