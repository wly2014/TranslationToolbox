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
    let pendingRequestSelection = null;
    let lastResolvedSelection = '';
    let lastResolvedResult = '';
    /** 当前选区正在进行的 Hover Promise；同选区再次触发时返回同一引用，由 VS Code 在 resolve 前显示加载、resolve 后显示译文 */
    let inFlightHoverPromise = null;

    const disposable = vscode.languages.registerHoverProvider('*', {
        provideHover(document, position, _token) {
            const selection = document.getText(vscode.window.activeTextEditor.selection);
            console.log('selection:', selection);
            console.log('preSelection:', preSelection);

            if (selection === '' || selection === ' ') {
                return undefined;
            }

            // 选区未变且仍有进行中的请求：返回同一 Promise → 编辑器持续 loading，直至 resolve 后展示译文
            if (selection === preSelection && inFlightHoverPromise && pendingRequestSelection === selection) {
                return inFlightHoverPromise;
            }

            // 选区未变且已有结果：展示缓存（保留原「悬停词须在选区内」的判断）
            if (selection === preSelection && lastResolvedSelection === selection) {
                const wordRange = document.getWordRangeAtPosition(position);
                const cHover = wordRange ? document.getText(wordRange) : '';
                if (!cHover || selection.indexOf(cHover) === -1) {
                    return undefined;
                }
                return new vscode.Hover({ language: 'markdown', value: lastResolvedResult });
            }

            // 选区变化：发起新请求，只返回一个 Promise，resolve 后再给出 Hover
            if (selection !== preSelection) {
                preSelection = selection;
                const reqSel = selection;
                pendingRequestSelection = reqSel;

                const isJapanese = containsJapaneseScript(selection);
                const longByWords = wordCount(selection) >= 3;
                const useDoubao = isJapanese || longByWords;

                if (!useDoubao) {
                    const hoverPromise = translatebyYouDao(selection)
                        .then(function (result) {
                            if (reqSel !== preSelection) {
                                return undefined;
                            }
                            pendingRequestSelection = null;
                            inFlightHoverPromise = null;
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
                            inFlightHoverPromise = null;
                            const msg = String(err && err.message ? err.message : err);
                            const errHover = '**有道翻译失败**\n\n' + msg;
                            lastResolvedSelection = reqSel;
                            lastResolvedResult = errHover;
                            return new vscode.Hover({
                                language: 'markdown',
                                value: errHover
                            });
                        });
                    inFlightHoverPromise = hoverPromise;
                    return hoverPromise;
                }

                const key = getDoubaoApiKeyResolved();
                if (!isValidDoubaoApiKey(key)) {
                    pendingRequestSelection = null;
                    inFlightHoverPromise = null;
                    const needMsg = isJapanese ? MSG_JAPANESE_NEED_KEY : MSG_LONG_TEXT_NEED_KEY;
                    lastResolvedSelection = selection;
                    lastResolvedResult = needMsg;
                    return new vscode.Hover({ language: 'markdown', value: needMsg });
                }

                const hoverPromise = translatebyBigModel(selection)
                    .then(function (result) {
                        if (reqSel !== preSelection) {
                            return undefined;
                        }
                        pendingRequestSelection = null;
                        inFlightHoverPromise = null;
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
                        inFlightHoverPromise = null;
                        const msg = String(err && err.message ? err.message : err);
                        const errHover = '**豆包翻译失败**\n\n' + msg;
                        lastResolvedSelection = reqSel;
                        lastResolvedResult = errHover;
                        return new vscode.Hover({
                            language: 'markdown',
                            value: errHover
                        });
                    });
                inFlightHoverPromise = hoverPromise;
                return hoverPromise;
            }

            return undefined;
        }
    });

    context.subscriptions.push(disposable);
}

module.exports = { registerHoverTranslation };
