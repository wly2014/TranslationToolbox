////////////////////////////////////////////////////////////////////////
// Author：1059387852@qq.com
// Time: 2022/10/25
// Desc: 利用有道的sug接口查询单词
// Key: https://axios-http.com/docs/urlencoded
////////////////////////////////////////////////////////////////////////

const axios = require('axios');

const YOUDAO_SUGGEST_URL = 'https://dict.youdao.com/suggest';

module.exports = function youdao(source) {
    return new Promise((resolve, _reject) => {
        axios
            .get(YOUDAO_SUGGEST_URL, {
                params: {
                    num: 5,
                    ver: '3.0',
                    doctype: 'json',
                    cache: 'false',
                    le: 'en',
                    q: source
                }
            })
            .then(res => {
                console.log(res.data);
                var txt = res.data.data.entries[0].explain;
                console.log(txt);
                resolve(txt);
            })
            .catch(err => {
                console.log('错误: ' + err);
                resolve('error::' + err);
            });
    });
};
