////////////////////////////////////////////////////////////////////////
// 使用GET请求代替POST请求可以获取正确的翻译数据。
// Author：1059387852@qq.com
// Time: 2022/10/25
// Desc: 百度翻译接口
// Based: https://blog.csdn.net/wangzirui32/article/details/118735332
// Key：https://axios-http.com/docs/urlencoded
////////////////////////////////////////////////////////////////////////

const axios = require('axios');
const querystring = require('querystring');

// 保存全局变量cookie
// 判断是否更新了cookie
baidu("spring").then(result => {
    console.log("Final");
    console.log(result);
});
// module.exports = 
function baidu(content) {
    console.log("[[BAIDU translation]]")
    // 获取cookie
    var url_baidu = "https://fanyi.baidu.com/"
    var headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.47"
    }
    return new Promise((resolve, reject) => {
        axios.get(url_baidu, {headers:headers})
        .then(function (response) {
            console.log(response.headers['set-cookie'])
            var cookie_str = response.headers['set-cookie'][0]
            console.log(typeof(cookie_str))
            var re_ = /BAIDUID=(.+?);/gi;
            var arrMactches = cookie_str.match(re_)
            var BAIDUID = arrMactches[0] //.slice(0,-1)
            // console.log(arrMactches[0])
            // console.log(BAIDUID)
            var Cookie = BAIDUID
            // /////////////////////////////////////////////////////
            Cookie = "BAIDUID=D41F71D2D4B3AAF41F15452D1CE6A2D8:FG=1; BAIDUID_BFESS=8CFCCD3848AC417D86E03D2D0AF5C4B3:FG=1"
            console.log(Cookie)

            // get token
            var headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.47",
                "Cookie": Cookie
            }
            axios.get(url_baidu, {headers:headers})
            .then(function (response) {
                // console.log(response)
                // var cookie_str = response.headers['set-cookie'][0]
                // console.log(cookie_str)
                var re_ = /token: '(.+?)'/gi;
                var arrMactches = response.data.match(re_)
                console.log(arrMactches)
                var token = arrMactches[0].slice(8,-1)
                console.log(token)
                // //////////////////
                token = "af10435b99924f39614bd86996c40221"

                // translation
                // var content = "a collection of facts from which conclusions may be drawn"
                translation(content, token, headers).then(result => {
                    resolve(result);
                });
                
            })
            .catch(function (error) {
                console.log(error);
                reject("Translate by Baidu errors 1.")
            });
            
        })
        .catch(function (error) {
            console.log(error);
            reject("Translate by Baidu errors 2.")
        });
    });
}

function translation(content, token, headers) {
    console.log(headers)
    // var content = "Hi"
    var sign = e(content)
    // /////////////////////
    sign = "381491.78082"

    var data = {
        'from': 'en',
        'to': 'zh',
        'query': content,
        'transtype': 'translang',
        'simple_means_flag': '3',
        'sign': sign,
        'token': token,
        'domain': 'common',
    }
    console.log(data)
    var url = "https://fanyi.baidu.com/v2transapi"
    return new Promise((resolve, reject) => {
        axios.post(url, querystring.stringify(data), {headers:headers})
        .then(function (response) {
            // 1. 完整结果
            // console.log(response)
            var parts = response.data["dict_result"]['simple_means']["symbols"][0]["parts"]
            // console.log(parts)
            var r1 = ""
            for (let index = 0; index < parts.length; index++) {
                const element = parts[index];
                // console.log(parts[index])
                // console.log(element.part)
                // console.log(element.means.join(";"))
                r1 = r1.concat(element.part, " ", element.means.slice(0,3).join(","), " ")
            }
            // console.log(r1)
            resolve(r1)

            // 2. 简单结果
            // var result = response.data["trans_result"]['data'][0]['dst']
            // console.log(result)
            // return result

        })
        .catch(function (error) {
            console.log(error);
            reject("Translate by Baidu errors 3.")
        });
    });
}


function e(r) {
    var i = "320305.131321201";
    var o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
    if (null === o) {
        var t = r.length;
        t > 30 && (r = "" + r.substr(0, 10) + r.substr(Math.floor(t / 2) - 5, 10) + r.substr(-10, 10))
    } else {
        for (var e = r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), C = 0, h = e.length, f = []; h > C; C++)
            "" !== e[C] && f.push.apply(f, a(e[C].split(""))),
            C !== h - 1 && f.push(o[C]);
        var g = f.length;
        g > 30 && (r = f.slice(0, 10).join("") + f.slice(Math.floor(g / 2) - 5, Math.floor(g / 2) + 5).join("") + f.slice(-10).join(""))
    }
    var u = void 0
      , l = "" + String.fromCharCode(103) + String.fromCharCode(116) + String.fromCharCode(107);
    u = null !== i ? i : (i = window[l] || "") || "";
    for (var d = u.split("."), m = Number(d[0]) || 0, s = Number(d[1]) || 0, S = [], c = 0, v = 0; v < r.length; v++) {
        var A = r.charCodeAt(v);
        128 > A ? S[c++] = A : (2048 > A ? S[c++] = A >> 6 | 192 : (55296 === (64512 & A) && v + 1 < r.length && 56320 === (64512 & r.charCodeAt(v + 1)) ? (A = 65536 + ((1023 & A) << 10) + (1023 & r.charCodeAt(++v)),
        S[c++] = A >> 18 | 240,
        S[c++] = A >> 12 & 63 | 128) : S[c++] = A >> 12 | 224,
        S[c++] = A >> 6 & 63 | 128),
        S[c++] = 63 & A | 128)
    }
    for (var p = m, F = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(97) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(54)), D = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(51) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(98)) + ("" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(102)), b = 0; b < S.length; b++)
        p += S[b],
        p = n(p, F);
    return p = n(p, D),
    p ^= s,
    0 > p && (p = (2147483647 & p) + 2147483648),
    p %= 1e6,
    p.toString() + "." + (p ^ m)
}

function n(r, o) {
    for (var t = 0; t < o.length - 2; t += 3) {
        var a = o.charAt(t + 2);
        a = a >= "a" ? a.charCodeAt(0) - 87 : Number(a),
        a = "+" === o.charAt(t + 1) ? r >>> a : r << a,
        r = "+" === o.charAt(t) ? r + a & 4294967295 : r ^ a
    }
    return r
}
