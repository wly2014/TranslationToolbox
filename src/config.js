const vscode = require('vscode');

/**
 * API Key：`translationtoolbox.DouBaoApiKey`，或顶层 `DouBaoApiKey`。
 * @returns {string}
 */
function getDoubaoApiKeyResolved() {
    const c = vscode.workspace.getConfiguration('translationtoolbox');
    const root = vscode.workspace.getConfiguration();

    let k = c.get('DouBaoApiKey');
    if (typeof k === 'string' && k.trim().length > 0) {
        return k.trim();
    }
    k = root.get('translationtoolbox.DouBaoApiKey');
    if (typeof k === 'string' && k.trim().length > 0) {
        return k.trim();
    }
    k = root.get('DouBaoApiKey');
    if (typeof k === 'string' && k.trim().length > 0) {
        return k.trim();
    }
    return '';
}

function pickModelString(value) {
    if (typeof value !== 'string') {
        return '';
    }
    const t = value.trim();
    return t.length > 0 ? t : '';
}

/**
 * 模型 ID：`translationtoolbox.DouBaoModel`，或顶层 `DouBaoModel`。
 * @returns {string}
 */
function getDoubaoModelResolved() {
    const c = vscode.workspace.getConfiguration('translationtoolbox');
    const root = vscode.workspace.getConfiguration();

    let m = pickModelString(c.get('DouBaoModel'));
    if (m) {
        return m;
    }
    m = pickModelString(root.get('translationtoolbox.DouBaoModel'));
    if (m) {
        return m;
    }
    m = pickModelString(root.get('DouBaoModel'));
    if (m) {
        return m;
    }
    return 'doubao-1.5-pro-32k-250115';
}

function isValidDoubaoApiKey(key) {
    return typeof key === 'string' && key.trim().length > 0 && key.trim() !== 'default';
}

module.exports = {
    getDoubaoApiKeyResolved,
    getDoubaoModelResolved,
    isValidDoubaoApiKey
};
