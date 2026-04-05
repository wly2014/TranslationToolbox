const vscode = require('vscode');
const youdaoWord = require('./services/youdaoWord');
const callDoubaoAPI = require('./services/doubao');
const { getDoubaoApiKeyResolved, isValidDoubaoApiKey } = require('./config');
const { containsJapaneseScript } = require('./japaneseDetect');

const MSG_LONG_TEXT_NEED_KEY =
    '**长句翻译（豆包）**\n\n未配置有效的 API Key，已取消请求。请在设置中搜索 `translationtoolbox.DouBaoApiKey`，填入火山方舟的 API Key（勿使用占位符 `default`）。\n\n仍可使用较短选区（少于 3 个词、且**非日文假名**）通过有道建议接口翻译。';

const MSG_JAPANESE_NEED_KEY =
    '**日文翻译（豆包）**\n\n检测到日文假名，本扩展对日文**仅使用豆包**，不使用有道。请配置有效的 `translationtoolbox.DouBaoApiKey`（勿使用占位符 `default`）。';

const MSG_WAITING_TRANSLATION =
    '**翻译中…**\n正在请求翻译结果，请稍候。';

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
    /** 当前选中的文本（用于判断选区是否变化） */
    let preSelection = '';
    /** 正在等待接口返回的选区文本；与 preSelection 相同时表示「加载中」 */
    let pendingRequestSelection = null;
    /** 最近一次已成功对应到 preSelection 的选区文本 */
    let lastResolvedSelection = '';
    /** 与 lastResolvedSelection 对应的展示内容 */
    let lastResolvedResult = '';

    const disposable = vscode.languages.registerHoverProvider('*', {
        provideHover(document, position, _token) {
            const selection = document.getText(vscode.window.activeTextEditor.selection);
            console.log('selection:', selection);
            console.log('preSelection:', preSelection);

            if (selection === '' || selection === ' ') {
                return undefined;
            }

            // 选区变化：发起新请求
            if (selection !== preSelection) {
                preSelection = selection;
                const reqSel = selection;
                pendingRequestSelection = reqSel;

                const isJapanese = containsJapaneseScript(selection);
                const longByWords = wordCount(selection) >= 3;
                const useDoubao = isJapanese || longByWords;

                if (!useDoubao) {
                    return translatebyYouDao(selection)
                        .then(function (result) {
                            if (reqSel !== preSelection) {
                                return undefined;
                            }
                            pendingRequestSelection = null;
                            lastResolvedSelection = reqSel;
                            lastResolvedResult = result;
                            return new vscode.Hover({ language: 'markdown', value: result });
                        })
                        .catch(function (err) {
                            console.log(err);
                            if (reqSel !== preSelection) {
                                return undefined;
                            }
                            pendingRequestSelection = null;
                            const msg = String(err && err.message ? err.message : err);
                            const errHover = '**有道翻译失败**\n\n' + msg;
                            lastResolvedSelection = reqSel;
                            lastResolvedResult = errHover;
                            return new vscode.Hover({
                                language: 'markdown',
                                value: errHover
                            });
                        });
                }

                const key = getDoubaoApiKeyResolved();
                if (!isValidDoubaoApiKey(key)) {
                    pendingRequestSelection = null;
                    const needMsg = isJapanese ? MSG_JAPANESE_NEED_KEY : MSG_LONG_TEXT_NEED_KEY;
                    lastResolvedSelection = selection;
                    lastResolvedResult = needMsg;
                    return new vscode.Hover({ language: 'markdown', value: needMsg });
                }

                return translatebyBigModel(selection)
                    .then(function (result) {
                        if (reqSel !== preSelection) {
                            return undefined;
                        }
                        pendingRequestSelection = null;
                        lastResolvedSelection = reqSel;
                        lastResolvedResult = result;
                        return new vscode.Hover({ language: 'markdown', value: result });
                    })
                    .catch(function (err) {
                        console.log(err);
                        if (reqSel !== preSelection) {
                            return undefined;
                        }
                        pendingRequestSelection = null;
                        const msg = String(err && err.message ? err.message : err);
                        const errHover = '**豆包翻译失败**\n\n' + msg;
                        lastResolvedSelection = reqSel;
                        lastResolvedResult = errHover;
                        return new vscode.Hover({
                            language: 'markdown',
                            value: errHover
                        });
                    });
            }

            // 选区未变：可能是鼠标移动触发的再次 hover，不得展示「上一段选区」的译文
            console.log('鼠标发生了移动（同选区）');
            const wordRange = document.getWordRangeAtPosition(position);
            const cHover = wordRange ? document.getText(wordRange) : '';
            if (!cHover || selection.indexOf(cHover) === -1) {
                return undefined;
            }

            if (pendingRequestSelection === selection) {
                return new vscode.Hover({ language: 'markdown', value: MSG_WAITING_TRANSLATION });
            }
            if (lastResolvedSelection === selection) {
                return new vscode.Hover({ language: 'markdown', value: lastResolvedResult });
            }
            return undefined;
        }
    });

    context.subscriptions.push(disposable);
}

module.exports = { registerHoverTranslation };
