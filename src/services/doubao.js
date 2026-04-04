////////////////////////////////////////////////////////////////////////
// Author：1059387852@qq.com
// Time: 2025/4/27
// Desc: 豆包大模型翻译接口
////////////////////////////////////////////////////////////////////////

const { getDoubaoApiKeyResolved, getDoubaoModelResolved, isValidDoubaoApiKey } = require('../config');
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
        const response = await arkChatCompletions({
            apiKey,
            model: String(model).trim(),
            messages: [
                {
                    role: 'system',
                    content: '你是专业翻译助手，精准转换中英内容.'
                },
                {
                    role: 'user',
                    content: word
                }
            ]
        });

        console.log('API响应:', response.data);
        return response.data['choices'][0]['message']['content'];
    } catch (error) {
        console.error('调用API时出错:', error.message);

        if (error.response) {
            console.error('状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        } else if (error.request) {
            console.error('请求已发送，但没有收到响应');
        } else {
            console.error('设置请求时出错:', error.message);
        }

        const payload =
            error.response && error.response.data !== undefined
                ? error.response.data
                : { message: error.message || 'unknown error' };
        return Promise.reject(new Error(typeof payload === 'string' ? payload : JSON.stringify(payload)));
    }
};
