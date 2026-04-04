const vscode = require('vscode');
const { registerHoverTranslation } = require('./hoverTranslation');
const { testDoubaoConnection } = require('./doubaoConnectionTest');

function activate(context) {
    console.log('Congratulations, your extension "translation" is now active!');

    const transDisposable = vscode.commands.registerCommand('translationtoolbox.translate', function () {
        console.log('translationtoolbox.translate');
    });

    const testDisposable = vscode.commands.registerCommand(
        'translationtoolbox.testDoubaoConnection',
        async function () {
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: 'TranslationToolbox：正在测试豆包连接…',
                    cancellable: false
                },
                async function () {
                    const result = await testDoubaoConnection();
                    if (result.ok) {
                        vscode.window.showInformationMessage(`${result.title}\n${result.detail}`);
                    } else {
                        vscode.window.showErrorMessage(`${result.title}\n${result.detail}`);
                    }
                }
            );
        }
    );

    context.subscriptions.push(transDisposable, testDisposable);
    registerHoverTranslation(context);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
