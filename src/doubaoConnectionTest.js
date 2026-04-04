const { getDoubaoApiKeyResolved, getDoubaoModelResolved, isValidDoubaoApiKey } = require('./config');
const { arkChatCompletions } = require('./services/arkClient');

/**
 * @returns {Promise<{ ok: boolean, title: string, detail: string }>}
 */
async function testDoubaoConnection() {
    const apiKey = getDoubaoApiKeyResolved();
    if (!isValidDoubaoApiKey(apiKey)) {
        return {
            ok: false,
            title: 'API Key 无效或未配置',
            detail:
                '请在设置中填写 `translationtoolbox.DouBaoApiKey`（火山方舟 API Key），且不能为空白或占位符 `default`。'
        };
    }

    const modelRaw = getDoubaoModelResolved();
    const model = typeof modelRaw === 'string' ? modelRaw.trim() : '';
    if (!model) {
        return {
            ok: false,
            title: '模型 ID 为空',
            detail:
                '请在设置中填写 `translationtoolbox.DouBaoModel`，可从火山方舟控制台（console.volcengine.com/ark）模型列表复制 Endpoint 中的模型 ID。'
        };
    }

    try {
        const response = await arkChatCompletions({
            apiKey,
            model,
            messages: [{ role: 'user', content: 'ping' }],
            timeout: 45000
        });

        const text = response.data && response.data.choices && response.data.choices[0]
            ? response.data.choices[0].message && response.data.choices[0].message.content
            : '';
        const snippet = text ? String(text).replace(/\s+/g, ' ').slice(0, 120) : '(空回复)';
        return {
            ok: true,
            title: '豆包连接成功',
            detail: `模型「${model}」已正常响应。示例回复: ${snippet}${String(text).length > 120 ? '…' : ''}`
        };
    } catch (error) {
        return {
            ok: false,
            title: '豆包连接失败',
            detail: formatArkFailure(error)
        };
    }
}

/**
 * @param {Error & { response?: { status?: number, data?: unknown } }} error
 */
function formatArkFailure(error) {
    const status = error.response && error.response.status;
    const data = error.response && error.response.data;

    let serverMsg = '';
    if (data && typeof data === 'object') {
        if (data.error) {
            const e = data.error;
            serverMsg =
                typeof e === 'string'
                    ? e
                    : (e.message || e.msg || JSON.stringify(e));
        } else if (data.message) {
            serverMsg = String(data.message);
        }
    } else if (typeof data === 'string') {
        serverMsg = data;
    }

    const parts = [];
    if (status) {
        parts.push(`HTTP ${status}`);
    }
    if (serverMsg) {
        parts.push(serverMsg);
    }

    if (status === 401) {
        parts.push('（请检查 API Key 是否正确、是否过期。）');
    } else if (status === 404) {
        parts.push('（请检查模型 ID 是否与方舟已开通的模型一致。）');
    } else if (!error.response && error.request) {
        parts.push('网络超时或无法连接方舟服务，请检查网络与防火墙。');
    }

    if (parts.length === 0) {
        parts.push(error.message || String(error));
    }

    return parts.join(' ');
}

module.exports = {
    testDoubaoConnection
};
