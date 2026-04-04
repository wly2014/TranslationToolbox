const vscode = require('vscode');
const youdaoWord = require('./services/youdaoWord');
const callDoubaoAPI = require('./services/doubao');
const { getDoubaoApiKeyResolved, isValidDoubaoApiKey } = require('./config');
const { containsJapaneseScript } = require('./japaneseDetect');

const MSG_LONG_TEXT_NEED_KEY =
    '**长句翻译（豆包）**\n\n未配置有效的 API Key，已取消请求。请在设置中搜索 `translationtoolbox.DouBaoApiKey`，填入火山方舟的 API Key（勿使用占位符 `default`）。\n\n仍可使用较短选区（少于 3 个词、且**非日文假名**）通过有道建议接口翻译。';

const MSG_JAPANESE_NEED_KEY =
    '**日文翻译（豆包）**\n\n检测到日文假名，本扩展对日文**仅使用豆包**，不使用有道。请配置有效的 `translationtoolbox.DouBaoApiKey`（勿使用占位符 `default`）。';

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

function wordCount(selection) {
    return selection.split(/\s+/).filter(function (w) {
        return w.length > 0;
    }).length;
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

                const isJapanese = containsJapaneseScript(selection);
                const longByWords = wordCount(selection) >= 3;
                const useDoubao = isJapanese || longByWords;

                if (!useDoubao) {
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
                    const needMsg = isJapanese ? MSG_JAPANESE_NEED_KEY : MSG_LONG_TEXT_NEED_KEY;
                    preResult = needMsg;
                    return new vscode.Hover({ language: 'markdown', value: needMsg });
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
