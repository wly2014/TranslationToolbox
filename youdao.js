var request = require('request');

var e = {
    "action": "FY_BY_CLICKBUTTION",
    "client": "fanyideskweb",
    "doctype": "json",
    "from": "AUTO",
    "i": "hello",
    "keyfrom": "fanyi.web",
    "salt": "1507884640456",
    "sign": "4b324e531753f05f39fe718e28df61a7",
    "smartresult": "dict",
    "to": "AUTO",
    "typoResult": "true",
    "version": "2.1"
};

var header = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.8",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "DNT": "1",
    "Host": "fanyi.youdao.com",
    "Origin": "http://fanyi.youdao.com",
    "Pragma": "no-cache",
    "Referer": "http://fanyi.youdao.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest"
};

let youdaoUrl = "http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule";

request.post(youdaoUrl, {form:e,headers:header,gzip:true},function (e, r, body) {
                // console.log(r);
                console.log(body);
                if (body.trim() != "") {
                    let result = JSON.parse(body.trim());
                    let smartResult = result.smartResult;
                    if (smartResult) {
                        let texts =smartResult.entries;
                        let jointexts = texts.join(";\n");
                        resolve(jointexts);
                    } else {
                        let text = result.translateResult[0][0].tgt;
                        resolve(text);
                    }
                }
            });

// $.ajax({
//     type: "POST",
//     contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//     url: "http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule",
//     data: e,
//     dataType: "json",
//     success: function (a) {
//         console.log(a);
//         console.log("hello");
//     },
//     error: function (a) {
//         console.log(a);
//         console.log("hello!!");

//      }
// });