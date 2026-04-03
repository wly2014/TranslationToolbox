const vscode = require('vscode');
const { registerHoverTranslation } = require('./hoverTranslation');

function activate(context) {
    console.log('Congratulations, your extension "translation" is now active!');

    const transDisposable = vscode.commands.registerCommand('translationtoolbox.translate', function () {
        console.log("translationtoolbox.translate");
    });

    context.subscriptions.push(transDisposable);
    registerHoverTranslation(context);
}

function deactivate() {
}

module.exports = {
    activate,
    deactivate
};
