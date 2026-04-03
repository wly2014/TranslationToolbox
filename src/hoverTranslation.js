const vscode = require('vscode');
const youdaoWord = require('./services/youdaoWord');
const youdaoSentence = require('./services/youdaoSentence');
const callDoubaoAPI = require('./services/doubao');

function translatebyYouDao(text, flag) {
    return new Promise(function (resolve, _reject) {
        console.log('::translatebyYouDao::');
        console.log("flag=", flag);
        if (flag == "word") {
            youdaoWord(text).then(result => {
                console.log(result);
                resolve(result);
            });
        } else if (flag == "sentence") {
            youdaoSentence(text).then(result => {
                console.log(result);
                resolve(result);
            });
        } else {
            resolve("Flag is not correct.");
        }
    });
}

function translatebyBigModel(text, flag) {
    return new Promise(function (resolve, _reject) {
        console.log('::translatebyBigModel::');
        console.log("flag=", flag);
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
                    return translatebyYouDao(selection, "word").then(function (result) {
                            preResult = result;
                            return new vscode.Hover({ language: "markdown", value: result });
                        }).catch(function (err) {
                            console.log(err);
                        });
                } else {
                    return translatebyBigModel(selection, "sentence").then(function (result) {
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
