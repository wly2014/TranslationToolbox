// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
// var baidu = require('./baidu');
// var youdao = require('./youdao2');
var youdao_sen = require('./youdao');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "translation" is now active!');

    // translatebyGoogle("hello");

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
     var transDisposable = vscode.commands.registerCommand('translationtoolbox.translate', function () {
        // The code you place here will be executed every time your command is executed

        console.log("translationtoolbox.translate");

    });

    context.subscriptions.push(transDisposable);
    // 调用
    hover2translate();

}

function hover2translate() {
    // 保存上一次选择的内容，防止重复请求
    let preSelection="";
    let preResult="";
    vscode.languages.registerHoverProvider('*', {
		provideHover(document, position, token) {
			// 不可以获取选取的内容，而只是hover的内容
			// let text=document.getText(document.getWordRangeAtPosition(position));
			// 获取当前选择的内容
			let selection = document.getText(vscode.window.activeTextEditor.selection);
            console.log("selection:",selection);
            console.log("preSelection:",preSelection);
            if (selection != "" && selection != " " && selection != preSelection) {
                preSelection = selection;
                let texts = selection.split(/\s+/);
                // if (texts.length < 3) {
                // 词或短语时     
                // youdao("Hello") // 测试
                // baidu("Hello") // 测试
                // translatebyBaiDu(selection)
                return translatebyYouDao(selection, "sentence").then(function (result) {
                        preResult = result;
                        return new vscode.Hover({language:"markdown",value:result});
                    }).catch(function(err){
                        console.log(err);
                    });
                // } else {
                //     return new vscode.Hover({language:"markdown",value:"目前仅支持单词或短语"});
                //     // 句子时
                //     var encodeText="";
                //     texts.forEach(function(v){
                //         encodeText += encodeURI(v)+' '
                //     });
                //     // console.log("encodeText",encodeText);
                    
                //     // return translatebyBaiDu(encodeText).then(function (result) {
                //     //     preResult = result;
                //     //     return new vscode.Hover({language:"markdown",value:"[BaiDu]: \n"+result+"\n----------\nHello"});
                //     // }).catch(function(err){
                //     //     console.log(err);
                //     // });

                //     var translations = {};
                //     return translatebyBing(encodeText).then(function (result) {
                //         // preResult = result;
                //         console.log(result);
                //         translations["Bing"]=result;
                //         return translatebyBaiDu(encodeText);
                //         // return result;
                //         // return new vscode.Hover({language:"markdown",value:"[BaiDu]: \n"+result+"\n----------\nHello"});
                //     }).then(function (result) {
                //         console.log(result);
                //         translations["Baidu"]=result;
                //         return translatebyGoogle(encodeText);
                //     }).then(function (result) {
                //         console.log(result);
                //         translations["Google"]=result;
                //     }) .then(function () {
                //         let allResult = "";
                //         for (var key in translations) {
                //             if (translations.hasOwnProperty(key)) {
                //                 var element = translations[key];
                //                 allResult = allResult +"["+ key +"]\n"+element+"\n";
                //             }
                //         }
                //         console.log(allResult);
                //         preResult = allResult;
                //         return new vscode.Hover({language:"markdown",value:allResult});
                //     }) .catch(function(err){
                //         console.log(err);
                //         return new vscode.Hover({language:"markdown",value:"出错了"});
                //     });
                    
                // }

            } else {
                console.log("鼠标发生了移动");
                // 当前Hover的内容
                let cHover = document.getText(document.getWordRangeAtPosition(position));
                if (selection.indexOf(cHover) != -1) {
                    return new vscode.Hover({language:"markdown",value:preResult});
                }
            }
            
		}
	});
}

function translatebyBaiDu(text) {
    return new Promise(function (resolve,reject) {
        console.log('::translatebyBaiDu::');
        baidu(text).then(result => {
            console.log(result);
            resolve(result);
        });
    });
}

function translatebyYouDao(text, flag) {
    return new Promise(function (resolve,reject) {
        console.log('::translatebyYouDao::');
        console.log("flag=", flag);
        if (flag == "word") {
            // youdao(text).then(result => {
            //     console.log(result);
            //     resolve(result);
            // });
        }else if(flag == "sentence"){
            youdao_sen(text).then(result => {
                console.log(result);
                resolve(result);
            });
        }else{
            resolve("Flag is not correct.");
        }
    });
}


// function translatebyBing(text) {
//     // bing
//     return new Promise(function (resolve,reject) {
//         // 获取cookie
//         var j = request.jar()
//         let cookieUrl = "http://www.bing.com/translator/?_=1487063092407";
//         request({url: cookieUrl, jar: j}, function () {
//             // var cookie_string = j.getCookieString(cookieUrl); // "key1=value1; key2=value2; ..."
//             // var cookies = j.getCookies(url);
//             // console.log(cookie_string);
//             // [{key: 'key1', value: 'value1', domain: "www.google.com", ...}, ...]
//             let bingURl = "http://www.bing.com/translator/api/Translate/TranslateArray?from=-&to=zh-CHS";
//             let id = hashCode(text);
//             let postData = [{"id":id,"text":text}];
//             // console.log(postData);
            
//             let bing_options = {
//                 body: postData,
//                 json: true,
//                 url: bingURl,
//                 jar: j
//             }
//             request.post(bing_options,function (e, r, body) {
//                 if (!e && body) {
//                     let text = body.items[0].text;
//                     resolve(text);
//                     // console.log(text);
//                     // vscode.window.showInformationMessage("bing: "+text);
//                 }
//             });
//             // post_req.write(JSON.stringify([{"id":1794106052,"text":"hello world"}]));

//         });
//     });
// }

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;