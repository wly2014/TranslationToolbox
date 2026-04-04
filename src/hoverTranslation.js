const vscode = require('vscode');
const youdaoWord = require('./services/youdaoWord');
const callDoubaoAPI = require('./services/doubao');
const { getDoubaoApiKeyResolved, isValidDoubaoApiKey } = require('./config');

const MSG_LONG_TEXT_NEED_KEY =
    '**长句翻译（豆包）**\n\n未配置有效的 API Key，已取消请求。请在设置中搜索 `translationtoolbox.doubaoApiKey`，填入火山方舟的 API Key（勿使用占位符 `default`）。\n\n仍可使用较短选区（少于 3 个词）通过有道建议接口翻译。';

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
    console.log('::translatebyBigModel::');
    return callDoubaoAPI(text).then(result => 'Doubao:: ' + result);
}

function registerHoverTranslation(context) {
    let preSelection = '';
    let preResult = '';

    const disposable = vscode.languages.registerHoverProvider('*', {
        provideHover(document, position, _token) {
            let selection = document.getText(vscode.window.activeTextEditor.selection);
            console.log('selection:', selection);
            console.log('preSelection:', preSelection);
            if (selection !== '' && selection !== ' ' && selection !== preSelection) {
                preSelection = selection;
                let texts = selection.split(/\s+/);

                if (texts.length < 3) {
                    return translatebyYouDao(selection)
                        .then(function (result) {
                            preResult = result;
                            return new vscode.Hover({ language: 'markdown', value: result });
                        })
                        .catch(function (err) {
                            console.log(err);
                            const msg = String(err && err.message ? err.message : err);
                            return new vscode.Hover({
                                language: 'markdown',
                                value: '**有道翻译失败**\n\n' + msg
                            });
                        });
                }

                const key = getDoubaoApiKeyResolved();
                if (!isValidDoubaoApiKey(key)) {
                    preResult = MSG_LONG_TEXT_NEED_KEY;
                    return new vscode.Hover({ language: 'markdown', value: MSG_LONG_TEXT_NEED_KEY });
                }

                return translatebyBigModel(selection)
                    .then(function (result) {
                        preResult = result;
                        return new vscode.Hover({ language: 'markdown', value: result });
                    })
                    .catch(function (err) {
                        console.log(err);
                        const msg = String(err && err.message ? err.message : err);
                        return new vscode.Hover({
                            language: 'markdown',
                            value: '**豆包翻译失败**\n\n' + msg
                        });
                    });
            }

            console.log('鼠标发生了移动');
            let cHover = document.getText(document.getWordRangeAtPosition(position));
            if (selection.indexOf(cHover) !== -1) {
                return new vscode.Hover({ language: 'markdown', value: preResult });
            }
        }
    });

    context.subscriptions.push(disposable);
}

module.exports = { registerHoverTranslation };
