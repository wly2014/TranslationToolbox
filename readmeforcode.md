
# 如何调试 VSCode 插件

1, 在 VSCode 中打开插件项目文件夹，启动调试模式（Run -> Start Debugging)


2. 将启动一个带有插件加载的 VSCode 开发者版实例的新窗口。扩展在 **`onStartupFinished`** 下会自动激活；选中文本并悬停即可调试划词翻译。可选：快捷键 `Ctrl+Alt+T`（macOS：`Cmd+Alt+T`）执行 **translate**。


# 如何更新发布 VSCode 插件

1，vsce package打包生成vsix文件

2，登录https://marketplace.visualstudio.com/manage，手动上传更新


