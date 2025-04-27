////////////////////////////////////////////////////////////////////////
// Author：1059387852@qq.com
// Time: 2022/10/31
// Desc: 谷歌学术界面的重要期刊标注
////////////////////////////////////////////////////////////////////////

const axios = require('axios');


function getJournalIds() {
    // 当前页面
    var paper_list = document.getElementsByClassName('gs_r gs_or gs_scl')
    var paper_ids = []
    for (let index = 0; index < paper_list.length; index++) {
        const element = paper_list[index].attributes["data-cid"].value
        paper_ids.push(element)
    }
    console.log(paper_ids)

}

function getJournalName(paper_id) {
    // var paper_id = "kg4YFrTouZMJ"
    console.log(paper_id)
    const scholar_Url = "https://scholar.google.com.hk/scholar?q=info:"+paper_id+":scholar.google.com/&output=cite&scirp=1&hl=zh-CN"
    
    const header = {
        // ':authority': 'scholar.google.com.hk',
        // ':method': 'GET',
        // ':path': '/scholar?q=info:po2gEBgAuaAJ:scholar.google.com/&output=cite&scirp=1&hl=zh-CN',
        // ':scheme': 'https',
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,de;q=0.5',
        cookie: 'AEC=AakniGOcx7jYiSZmBALILl2ZFpJBZQWs19wlc9xC4pmegvqn_-U9ePgIlw; GSP=A=GTg5hg:CPTS=1616121285:LM=1661687010:S=VYsSQ1W64NGF-fvG; NID=511=sESJbR19FXWrUbFgbMuhOCHshJZnV3wj-yXZh2Aeiam9tSPKrGI44oZemutp5cWXdmVXSnaPjSAzk1QofahHyDqILC-OyP_vzJuDMcVKf8SH8YI1kdOj1-pLzIHWwcR-XyYm-S1AHfcBQi-IHTP1vEKv_H_xU4NXvytc2LuXlUl3pEsVDRq_lFo7gwMO0OSrEsPgB1FhSvVUUlCTNw',
        referer: 'https://scholar.google.com.hk/scholar?hl=zh-CN&as_sdt=0%2C5&q=Passivity-Based+interaction+Control&btnG=',
        'sec-ch-ua': '"Microsoft Edge";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.26',
        'x-requested-with': 'XHR'
    }
    // console.log(header)
    // 注意：期刊名称全部小写
    const journal_list={"international journal of robotics research":"1",
                        "ieee robotics and automation letters":"2"}
    axios.get(scholar_Url, {headers:header})
    .then(res => {
        // console.log(res)
        var result = res.data.toLowerCase();
        console.log(result)
        var journal_names = Object.keys(journal_list)
        var journal_len = journal_names.length
        for (let index = 0; index < journal_len; index++) {
            const name = journal_names[index].toLowerCase();
            var re_ = new RegExp(name);
            console.log(re_)
            var arrMactches = result.match(re_)
            console.log(arrMactches) // null 或者 [...]
            if (!!arrMactches && arrMactches.length > 0) {
                console.log(name)
                break
            }
        }
        
    }).catch(err => {
        console.log('err: ' + err)
    })
}

