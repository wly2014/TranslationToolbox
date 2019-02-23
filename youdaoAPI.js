
var request = require('request');
var crypto = require('crypto');
var $ = require('jquery');

let text = "hello";

// MD5算法
var md5 = crypto.createHash('md5');

// 先获取salt和sign参数
let salt = "" + ((new Date).getTime() + parseInt(10 * Math.random(), 10));
// let str = "fanyideskweb" + text + salt + "rY0D^0'nM0}g5Mm1z%1G4";
let str = "fanyideskweb" + "hello" + "1507817910839" + "rY0D^0'nM0}g5Mm1z%1G4";
let sign = md5.update(str).digest('hex');
console.log(sign);

var e = {"action":"FY_BY_CLICKBUTTION",
"client":"fanyideskweb",
"doctype":"json",
"from":"AUTO",
"i":"hello",
"keyfrom":"fanyi.web",
"salt":"1507884640456",
"sign":"4b324e531753f05f39fe718e28df61a7",
"smartresult":"dict",
"to":"AUTO",
"typoResult":true,
"version":"2.1"
};

let youdaoUrl = "http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule";

$.ajax({
    type: "POST",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    url: "http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule",
    data: e,
    dataType: "json",
    success: function (e) {
        console.log(e);
    },
    error: function (e) {
        console.log(e);
     }
});



// request.post(youdaoUrl, {
//     form: {
//         i: text, from: "AUTO", to: "AUTO", smartresult: "dict"
//         , client: "fanyideskweb", salt: salt, sign: sign, doctype: "json", version: "2.1", keyfrom: "fanyi.web", action: "FY_BY_CLICKBUTTION", typoResult: "true"
//     }
// }, function (e, r, body) {
//     // console.log(r);
//     console.log(body);
//     // if (body.trim() != "") {
//     //     let result = JSON.parse(body.trim());
//     //     let smartResult = result.smartResult;
//     //     if (smartResult) {
//     //         let texts = smartResult.entries;
//     //         let jointexts = texts.join(";\n");
//     //         resolve(jointexts);
//     //     } else {
//     //         let text = result.translateResult[0][0].tgt;
//     //         resolve(text);
//     //     }
//     // }
// });