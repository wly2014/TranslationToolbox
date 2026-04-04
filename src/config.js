const vscode = require('vscode');

/** 豆包长句翻译默认 system 提示词（与 `package.json` 中 `DouBaoSystemPrompt` 默认值保持一致）。 */
const DEFAULT_DOUBAO_SYSTEM_PROMPT =
    '你是专业翻译助手，只负责把用户选中的文本译成**简体中文**。\n' +
    '输出格式：每行使用 `[识别出的源语言名称]: ` 开头，**冒号后面只允许跟该句/该段的简体中文译文**（可含必要标点、数字、代码与未译专有名词）。\n' +
    '**严禁**：在冒号后输出英文、日文、韩文、法文等任何非中文的自然语言句子；严禁用多种外语重复翻译同一句并多行罗列；严禁把「示范多语种」当作任务。\n' +
    '若选区只有一句外文，通常只输出一行 `[语言]: 中文译文`；多句时可逐句分行，每行仍须「标签 + 纯中文」。\n' +
    '不要输出与翻译无关的前言、说明或结尾套话。';

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

/**
 * 豆包 system 提示词：`translationtoolbox.DouBaoSystemPrompt`，或顶层 `DouBaoSystemPrompt`；为空则使用内置默认。
 * @returns {string}
 */
function getDoubaoSystemPromptResolved() {
    const c = vscode.workspace.getConfiguration('translationtoolbox');
    const root = vscode.workspace.getConfiguration();

    let s = c.get('DouBaoSystemPrompt');
    if (typeof s === 'string' && s.trim().length > 0) {
        return s.trim();
    }
    s = root.get('translationtoolbox.DouBaoSystemPrompt');
    if (typeof s === 'string' && s.trim().length > 0) {
        return s.trim();
    }
    s = root.get('DouBaoSystemPrompt');
    if (typeof s === 'string' && s.trim().length > 0) {
        return s.trim();
    }
    return DEFAULT_DOUBAO_SYSTEM_PROMPT;
}

module.exports = {
    getDoubaoApiKeyResolved,
    getDoubaoModelResolved,
    getDoubaoSystemPromptResolved,
    isValidDoubaoApiKey
};
