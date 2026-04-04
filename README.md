# TranslationToolbox README

翻译工具箱：窗口加载完成后扩展自动激活；快捷键 `ctrl+alt+t` / `cmd+alt+t` 仍可用于执行 **translate** 命令（可选）。

## Features

短词/短语使用**有道**建议接口，较长文本使用**豆包（火山方舟）**大模型翻译；**含日文假名的选区仅走豆包**（不走有道）。支持**选中即翻译**（鼠标悬停查看结果）。

- **模型 ID**：在设置 **`translationtoolbox.DouBaoModel`** 中可**手动填写**方舟控制台提供的最新模型 ID。
- **豆包系统提示词**：在 **`translationtoolbox.DouBaoSystemPrompt`** 中可自定义长句翻译的 system 角色说明（多行）；默认即为内置的多语言译中文提示。
- **连通性测试**：在设置中打开 **TranslationToolbox**，在 **DouBaoApiKey** 或 **DouBaoModel** 的说明里点击 **「测试 API Key 与模型连通性」**；或在命令面板运行 **TranslationToolbox: 测试豆包连接**。

## Quick Start

* 安装该扩展（启动即激活，**无需**先按快捷键）
* 选中要翻译的文本，**鼠标悬停**即可查看结果（短词走有道；长句走豆包，需配置 API Key）
* 可选：快捷键 `ctrl+alt+t` / `cmd+alt+t` 执行 `translate` 命令

![](./images/Animation.gif)

## Release Notes

### 0.8.1

> 新增 **`translationtoolbox.DouBaoSystemPrompt`**，可在设置中自定义豆包长句的 system 提示词（默认与此前内置文案一致）。

### 0.8.0

> **破坏性变更**：移除 `translationtoolbox.doubaoApiKey` / `translationtoolbox.doubaoModel`。请仅使用 **`translationtoolbox.DouBaoApiKey`** 与 **`translationtoolbox.DouBaoModel`**（或顶层 `DouBaoApiKey`）。若曾填写旧键名，请在 `settings.json` 中改名后删除旧键。

### 0.1.2

> 整合了**百度，Google，Bing，及有道**翻译的相关API
> 支持**选中即可翻译**

### 0.2.0

> 更新修复了有道翻译的相关API

### 0.3.0

> 更新修复了**百度翻译**的相关API

### 0.4.1

> 更新修复了**有道翻译**的相关API

> TODO: 修复`百度翻译`


### 0.7.1

> 连通性测试入口改为**设置项说明中的可点击链接**（不再使用状态栏按钮）。

### 0.7.0

> 支持**自定义豆包模型 ID**；新增**豆包连接测试**命令（0.7.1 起主要入口为设置项说明中的链接）。

### 0.6.0

> **启动即激活**（`onStartupFinished`）；**长句翻译**须配置有效 API Key；**模型 ID** 与设置一致（0.8 起仅 `DouBaoApiKey` / `DouBaoModel`）。

### 0.5.0

> 删除了有道翻译的部分API，增加了对**豆包大模型**翻译的支持。

启用豆包大模型需要注册个人账号以获取免费的大模型API，具体配置步骤如下：

1. 注册 [火山引擎](https://www.volcengine.com/) 账号，并完成验证

2. 在火山方舟中的 API Key 管理中申请并复制 API Key

![](./images/apikey.png)

3. 在火山方舟「开通管理」中激活模型 `Doubao-1.5-pro-32k`

![](./images/model.png)

4. 在 VS Code 设置中搜索 **`translationtoolbox.DouBaoApiKey`**（或顶层 **`DouBaoApiKey`**），填入 API Key。

![](./images/vscode.png)

## Source

`软件出现翻译的API错误时，请通过Github提交issue通知我。`

[GitHub](https://github.com/wly2014/TranslationToolbox)

                
## License

[MIT](https://raw.githubusercontent.com/DonJayamanne/pythonVSCode/master/LICENSE)

-----------------------------------------------------------------------------------------------------------