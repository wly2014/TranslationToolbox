////////////////////////////////////////////////////////////////////////
// Author：1059387852@qq.com
// Time: 2022/10/25
// Desc: 有道翻译接口
// Key: https://axios-http.com/docs/urlencoded
////////////////////////////////////////////////////////////////////////

const axios = require('axios');
const URLSearchParams = require('url').URLSearchParams
var md5 = require('crypto-js/md5')

module.exports = function youdao_sen(word) {
    const youdaoUrl = "https://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule"

    var lts = ""+(new Date).getTime()
    var salt = lts + parseInt(10 * Math.random(), 10);
    var sign = md5('fanyideskweb' + word + salt + 'Ygy_4c=r#e#4EX^NUGUc5').toString()

    var data = {
        'i': word,
        'from': 'AUTO',
        'to': 'AUTO',
        'smartresult': 'dict',
        'client': 'fanyideskweb',
        'salt': salt,
        'sign': sign,
        'lts': lts,
        'bv': 'be559818a402acf44a9a990b7ef68fe9',
        'doctype': 'json',
        'version': '2.1',
        'keyfrom': 'fanyi.web',
        'action': 'FY_BY_CLICKBUTTION'
    };
    const header = {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        "Accept-Encoding": 'gzip, deflate, br',
        "Accept-Language": 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,de;q=0.5',
        Connection: 'keep-alive',
        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
        "Cookie": 'OUTFOX_SEARCH_USER_ID=-177960100@10.105.137.203; OUTFOX_SEARCH_USER_ID_NCOO=1124885976.2343872; ___rl__test__cookies=1666701333891',
        "Host": 'fanyi.youdao.com',
        Origin: 'https://fanyi.youdao.com',
        Referer: 'https://fanyi.youdao.com/',
        "sec-ch-ua": '"Chromium";v="106", "Microsoft Edge";v="106", "Not;A=Brand";v="99"',
        "sec-ch-ua-mobile": '?0',
        "sec-ch-ua-platform": '"Windows"',
        "Sec-Fetch-Dest": 'empty',
        "Sec-Fetch-Mode": 'cors',
        "Sec-Fetch-Site": 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.47',
        'X-Requested-With': "XMLHttpRequest"
    }

    return new Promise((resolve, _reject) => {
        const searchParams = new URLSearchParams(data)
        axios.post(youdaoUrl, searchParams.toString(), {headers:header})
        .then(res => {
            var result = res.data.translateResult[0][0]["tgt"]
            resolve(result)
        }).catch(err => {
            console.log('err: ' + err)
            resolve(err)
        })
    })

}

