const axios = require('axios');

const ARK_CHAT_COMPLETIONS_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

/**
 * @param {{ apiKey: string, model: string, messages: Array<{role: string, content: string}>, timeout?: number }} opts
 */
async function arkChatCompletions(opts) {
    const { apiKey, model, messages, timeout = 120000 } = opts;
    return axios.post(
        ARK_CHAT_COMPLETIONS_URL,
        { model, messages },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            timeout
        }
    );
}

module.exports = {
    arkChatCompletions,
    ARK_CHAT_COMPLETIONS_URL
};
