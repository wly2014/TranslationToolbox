////////////////////////////////////////////////////////////////////////
// Author：1059387852@qq.com
// Time: 2022/10/25
// Desc: 有道翻译接口
// Key: https://axios-http.com/docs/urlencoded
////////////////////////////////////////////////////////////////////////

// var request = require('request');
const axios = require('axios');
const querystring = require('querystring');
var md5 = require('crypto-js/md5')

//////// TEST ////////
// youdao_sen("It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of light, it was the season of darkness, it was the spring of hope, it was the winter of despair.")
// .then(result => {
//     console.log("Result");
//     console.log(result);
// });
/////////////////////
module.exports = function youdao_sen(word) {
    // console.log(word)
    const youdaoUrl = "https://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule"
    
    var lts = ""+(new Date).getTime()
    var salt = lts + parseInt(10 * Math.random(), 10);
    var sign = md5('fanyideskweb' + word + salt + 'Y2FYu%TNSbMCxc3t2u^XT').toString()
    
    var data = {
        'i': word,
        'from': 'AUTO',
        'to': 'AUTO',
        'smartresult': 'dict',
        'client': 'fanyideskweb',
        'salt': salt,
        'sign': sign,
        'lts': lts,
        'bv': 'e70edeacd2efbca394a58b9e43a6ed2a',
        'doctype': 'json',
        'version': '2.1',
        'keyfrom': 'fanyi.web',
        'action': 'FY_BY_CLICKBUTTION'
    };
    // console.log(data)
    const header = {
        Accept: '*/*',
        "Accept-Encoding": 'gzip, deflate, br',
        // "Accept-Language": 'zh-CN,zh;q=0.9',
        Connection: 'keep-alive',
        // "Content-Length": '240',
        "Content-Type": 'application/x-www-form-urlencoded',
        "Cookie": 'OUTFOX_SEARCH_USER_ID=-1@10.1.1.1',
        Host: 'fanyi.youdao.com',
        // Origin: 'https://fanyi.youdao.com',
        Referer: 'https://fanyi.youdao.com/',
        // "sec-ch-ua": '"Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        // "sec-ch-ua-mobile": '?0',
        // "sec-ch-ua-platform": '"Windows"',
        // "Sec-Fetch-Dest": 'empty',
        // "Sec-Fetch-Mode": 'cors',
        // "Sec-Fetch-Site": 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'
        // 'X-Requested-With': "XMLHttpRequest"
    }
    // console.log(header)

    return new Promise((resolve, reject) => {
        axios.post(youdaoUrl, querystring.stringify(data), {headers:header})
        .then(res => {
            // console.log(res)
            // console.log("result of Youdao:")
            // console.log(res.data.translateResult)
            var result = res.data.translateResult[0][0]["tgt"]
            resolve(result)
        }).catch(err => {
            console.log('err: ' + err)
            resolve(err)
        })
    })

}


