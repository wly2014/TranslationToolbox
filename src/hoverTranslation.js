const vscode = require('vscode');
const youdaoWord = require('./services/youdaoWord');
const callDoubaoAPI = require('./services/doubao');

function translatebyYouDao(text) {
    return new Promise(function (resolve, _reject) {
        console.log('::translatebyYouDao::');
        youdaoWord(text).then(result => {
            console.log(result);
            resolve(result);
        });
    });
}

function translatebyBigModel(text) {
    return new Promise(function (resolve, _reject) {
        console.log('::translatebyBigModel::');
        callDoubaoAPI(text).then(result => {
            console.log(result);
            resolve("Doubao:: " + result);
        });
    });
}

function registerHoverTranslation(context) {
    let preSelection = "";
    let preResult = "";

    const disposable = vscode.languages.registerHoverProvider('*', {
        provideHover(document, position, _token) {
            let selection = document.getText(vscode.window.activeTextEditor.selection);
            console.log("selection:", selection);
            console.log("preSelection:", preSelection);
            if (selection != "" && selection != " " && selection != preSelection) {
                preSelection = selection;
                let texts = selection.split(/\s+/);

                if (texts.length < 3) {
                    return translatebyYouDao(selection).then(function (result) {
                            preResult = result;
                            return new vscode.Hover({ language: "markdown", value: result });
                        }).catch(function (err) {
                            console.log(err);
                        });
                } else {
                    return translatebyBigModel(selection).then(function (result) {
                            preResult = result;
                            return new vscode.Hover({ language: "markdown", value: result });
                        }).catch(function (err) {
                            console.log(err);
                            return new vscode.Hover({ language: "markdown", value: "BigModel:: something wrong." });
                        });
                }

            } else {
                console.log("鼠标发生了移动");
                let cHover = document.getText(document.getWordRangeAtPosition(position));
                if (selection.indexOf(cHover) != -1) {
                    return new vscode.Hover({ language: "markdown", value: preResult });
                }
            }

        }
    });

    context.subscriptions.push(disposable);
}

module.exports = { registerHoverTranslation };
