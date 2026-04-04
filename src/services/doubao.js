////////////////////////////////////////////////////////////////////////
// Author：1059387852@qq.com
// Time: 2025/4/27
// Desc: 豆包大模型翻译接口
////////////////////////////////////////////////////////////////////////

const {
    getDoubaoApiKeyResolved,
    getDoubaoModelResolved,
    getDoubaoSystemPromptResolved,
    isValidDoubaoApiKey
} = require('../config');
const { arkChatCompletions } = require('./arkClient');

module.exports = async function callDoubaoAPI(word) {
    const apiKey = getDoubaoApiKeyResolved();
    if (!isValidDoubaoApiKey(apiKey)) {
        return Promise.reject(new Error('INVALID_DOUBAO_API_KEY'));
    }

    const model = getDoubaoModelResolved();
    if (!model || !String(model).trim()) {
        return Promise.reject(new Error('INVALID_DOUBAO_MODEL'));
    }

    try {
        const systemPrompt = getDoubaoSystemPromptResolved();
        const response = await arkChatCompletions({
            apiKey,
            model: String(model).trim(),
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: word
                }
            ]
        });

        const raw = response.data;
        console.log('[TranslationToolbox][Doubao] HTTP', response.status, response.statusText || '');
        try {
            console.log('[TranslationToolbox][Doubao] 响应体(原始 JSON):\n', JSON.stringify(raw, null, 2));
        } catch (_e) {
            console.log('[TranslationToolbox][Doubao] 响应体(无法 JSON 序列化):', raw);
        }
        return raw['choices'][0]['message']['content'];
    } catch (error) {
        console.error('[TranslationToolbox][Doubao] 调用失败:', error.message);

        if (error.response) {
            console.error('[TranslationToolbox][Doubao] HTTP', error.response.status, error.response.statusText || '');
            const errBody = error.response.data;
            try {
                console.error(
                    '[TranslationToolbox][Doubao] 错误响应体(原始 JSON):\n',
                    typeof errBody === 'string' ? errBody : JSON.stringify(errBody, null, 2)
                );
            } catch (_e) {
                console.error('[TranslationToolbox][Doubao] 错误响应体:', errBody);
            }
        } else if (error.request) {
            console.error('[TranslationToolbox][Doubao] 请求已发出但未收到有效 HTTP 响应');
        } else {
            console.error('[TranslationToolbox][Doubao] 请求构造/发送异常:', error.message);
        }

        const payload =
            error.response && error.response.data !== undefined
                ? error.response.data
                : { message: error.message || 'unknown error' };
        return Promise.reject(new Error(typeof payload === 'string' ? payload : JSON.stringify(payload)));
    }
};
