////////////////////////////////////////////////////////////////////////
// Author：1059387852@qq.com
// Time: 2025/4/27
// Desc: 豆包大模型翻译接口
////////////////////////////////////////////////////////////////////////

const axios = require('axios');
const URLSearchParams = require('url').URLSearchParams
var md5 = require('crypto-js/md5')
var vscode = require('vscode');

module.exports = async function callDoubaoAPI(word) {
    const apiKey = vscode.workspace.getConfiguration().get("DouBaoApiKey");
    console.log(apiKey)
    const apiUrl = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
    
    try {
        const response = await axios.post(apiUrl, {
            model: "doubao-1.5-pro-32k-250115",
            messages: [
                {
                    role: "system",
                    content: "你是专业翻译助手，精准转换中英内容."
                },
                {
                    role: "user",
                    content: word
                }
            ]
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            }
        });

        console.log("API响应:", response.data);
        return response.data["choices"][0]["message"]["content"];
    } catch (error) {
        console.error("调用API时出错:", error.message);
        
        // 打印详细的错误信息
        if (error.response) {
            console.error("状态码:", error.response.status);
            console.error("响应数据:", error.response.data);
        } else if (error.request) {
            console.error("请求已发送，但没有收到响应");
        } else {
            console.error("设置请求时出错:", error.message);
        }
        
        return JSON.stringify(error.response.data);
    }
}




