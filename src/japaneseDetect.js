/**
 * 是否包含日文假名（平假名、片假名、半角片假名）。用于路由：含日文则仅走豆包，不走有道。
 * 注：纯汉字日语文本无假名时无法与中文区分，仍按「词数」规则走有道/豆包。
 */
function containsJapaneseScript(text) {
    if (typeof text !== 'string' || text.length === 0) {
        return false;
    }
    return /[\u3040-\u309F\u30A0-\u30FF\uFF66-\uFF9F]/.test(text);
}

module.exports = { containsJapaneseScript };
