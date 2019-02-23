////////////////////////////////////////////////////////////////////////
// 使用GET请求代替POST请求可以获取正确的翻译数据。
// Author：1059387852@qq.com
// Time: 2019/2/23
// Desc: 百度翻译接口
// Based: 基础版代码（Python3）作者链接：https://www.devtool.top/article/55
////////////////////////////////////////////////////////////////////////

var request = require('request');

module.exports = function baidu(source) {
	var gtk = ""
	var token = ""
	var translation_result = "";
	var header = {
		"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
		"Cookie": "BAIDUID=B39E1775B9F1707A3D6121253D24EDE2:FG=1; BIDUPSID=B39E1775B9F1707A3D6121253D24EDE2; PSTM=1550837901; H_PS_PSSID=1468_21113_18560_28558_28415_20719; delPer=0; PSINO=1; locale=zh; Hm_lvt_64ecd82404c51e03dc91cb9e8c025574=1548324797,1548335580,1550837198,1550890816; Hm_lpvt_64ecd82404c51e03dc91cb9e8c025574=1550890816; REALTIME_TRANS_SWITCH=1; FANYI_WORD_SWITCH=1; HISTORY_SWITCH=1; SOUND_SPD_SWITCH=1; SOUND_PREFER_SWITCH=1; to_lang_often=%5B%7B%22value%22%3A%22zh%22%2C%22text%22%3A%22%u4E2D%u6587%22%7D%2C%7B%22value%22%3A%22en%22%2C%22text%22%3A%22%u82F1%u8BED%22%7D%5D; from_lang_often=%5B%7B%22value%22%3A%22en%22%2C%22text%22%3A%22%u82F1%u8BED%22%7D%2C%7B%22value%22%3A%22zh%22%2C%22text%22%3A%22%u4E2D%u6587%22%7D%5D",
	}

	var options = {
		url: 'https://fanyi.baidu.com',
		headers: header
	};
	return new Promise((resolve, reject) => {
		var request_type = request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				// console.log(body) // Show the HTML for the Google homepage.
				html = body;
				var gtk = html.match("window.gtk = '(.*?)';")[1];
				console.log(gtk);
				var token = html.match("token: '(.*?)'")[1];
				console.log(token);
				// var source = 'There is one word too many in this sentence';
				var sign = hash(source, gtk);
				console.log('source = ' + source + ', sign = ' + sign);
				var fromLanguage = 'en';
				var toLanguage = 'zh';
				var v2transapi = 'https://fanyi.baidu.com/v2transapi?from=' + fromLanguage + '&to=' + toLanguage + '&query=' + source + '&transtype=translang&simple_means_flag=3&sign=' + sign + '&token=' + token;
				v2transapi = encodeURI(v2transapi);
				// console.log(v2transapi);
				var options = {
					url: v2transapi,
					headers: header
				};
				request(options, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						// console.log(body);
						body = eval('(' + body + ')');

						// 如果输入是句话，body.dict_result = [];
						isSentence = true;
						// console.log(body.dict_result)
						for (var i in body.dict_result) {
							isSentence = false;
							break;
						}
						if (!isSentence) {
							// 是个单词或者短语   
							// 如果body.dict_result.simple_means.symbols[0].parts[0]中没有part这个key，应该是个短语。
							var parts = body.dict_result.simple_means.symbols[0].parts;

							for (var i in parts) {
								var part = parts[i];
								if (part.hasOwnProperty("part")) {
									// 单词
									if (translation_result != "") {
										translation_result = translation_result + "\n";
									}
									translation_result = translation_result + "[" + part.part + "] ";
									// console.log(part.part);
								}
								for (var i in part.means) {
									var element = part.means[i];
									translation_result = translation_result + element + ";";
								}
								// console.log(part.means);
							}
						} else {
							// 是个句子
							var result = body.trans_result.data[0].dst;
							translation_result = result;
							// console.log(result);
						}
					} else {
						translation_result = error;
						console.warn(error);
					}
					resolve(translation_result);
				});
			} else {
				translation_result = error;
				console.warn(error);
				resolve(translation_result);
			}
		});
	});
}

function a(r, o) {
	for (var t = 0; t < o.length - 2; t += 3) {
		var a = o.charAt(t + 2);
		a = a >= "a" ? a.charCodeAt(0) - 87 : Number(a), a = "+" === o.charAt(t + 1) ? r >>> a : r << a, r = "+" === o.charAt(t) ? r + a & 4294967295 : r ^ a
	}
	return r
}
var C = null;
var hash = function (r, _gtk) {
	var o = r.length;
	o > 30 && (r = "" + r.substr(0, 10) + r.substr(Math.floor(o / 2) - 5, 10) + r.substr(-10, 10));
	var t = void 0,
		t = null !== C ? C : (C = _gtk || "") || "";
	for (var e = t.split("."), h = Number(e[0]) || 0, i = Number(e[1]) || 0, d = [], f = 0, g = 0; g < r.length; g++) {
		var m = r.charCodeAt(g);
		128 > m ? d[f++] = m : (2048 > m ? d[f++] = m >> 6 | 192 : (55296 === (64512 & m) && g + 1 < r.length && 56320 === (64512 & r.charCodeAt(g + 1)) ? (m = 65536 + ((1023 & m) << 10) + (1023 & r.charCodeAt(++g)), d[f++] = m >> 18 | 240, d[f++] = m >> 12 & 63 | 128) : d[f++] = m >> 12 | 224, d[f++] = m >> 6 & 63 | 128), d[f++] = 63 & m | 128)
	}
	for (var S = h, u = "+-a^+6", l = "+-3^+b+-f", s = 0; s < d.length; s++) S += d[s], S = a(S, u);
	return S = a(S, l), S ^= i, 0 > S && (S = (2147483647 & S) + 2147483648), S %= 1e6, S.toString() + "." + (S ^ h)
};