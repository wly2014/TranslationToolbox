const vscode = require('vscode');

/**
 * Resolve API key: new `translationtoolbox.doubaoApiKey`, then legacy keys.
 * @returns {string}
 */
function getDoubaoApiKeyResolved() {
    const c = vscode.workspace.getConfiguration('translationtoolbox');
    const root = vscode.workspace.getConfiguration();

    let k = c.get('doubaoApiKey');
    if (typeof k === 'string' && k.trim().length > 0) {
        return k.trim();
    }
    k = c.get('DouBaoApiKey');
    if (typeof k === 'string' && k.trim().length > 0) {
        return k.trim();
    }

    k = root.get('translationtoolbox.doubaoApiKey');
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

/**
 * @returns {string}
 */
function getDoubaoModelResolved() {
    const c = vscode.workspace.getConfiguration('translationtoolbox');
    const root = vscode.workspace.getConfiguration();

    let m = c.get('doubaoModel');
    if (typeof m === 'string' && m.length > 0) {
        return m;
    }
    m = c.get('DouBaoModel');
    if (typeof m === 'string' && m.length > 0) {
        return m;
    }
    m = root.get('translationtoolbox.doubaoModel');
    if (typeof m === 'string' && m.length > 0) {
        return m;
    }
    m = root.get('translationtoolbox.DouBaoModel');
    if (typeof m === 'string' && m.length > 0) {
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
