import requests, time, random, hashlib
 
word = "Hi"
url = "https://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule"
 
# lts = str(int(time.time() * 1000))
# salt = lts + str(random.randint(0, 10))
lts = "1665912034931"
salt = "16659120349313"

fty = hashlib.md5()
fty.update(f"fanyideskweb{word+salt}Y2FYu%TNSbMCxc3t2u^XT".encode())
sign = fty.hexdigest()  # 十六进制
 
data = {
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
    'action': 'FY_BY_REALTlME',
}
print(data)
headers = {
    # "Accept": 'application/json, text/javascript, */*; q=0.01',
    # "Accept-Encoding": 'gzip, deflate, br',
    # "Accept-Language": 'zh-CN,zh;q=0.9',
    # "Connection": 'keep-alive',
    # "Content-Length": '240',
    # "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
    # "Cookie": 'OUTFOX_SEARCH_USER_ID=-949133387@10.108.160.105; JSESSIONID=aaa4cDSAL97NifsHDVP6x; OUTFOX_SEARCH_USER_ID_NCOO=1028423508.6875325; ___rl__test__cookies=1643526331520',
    "Cookie": 'OUTFOX_SEARCH_USER_ID=-1@10.1.1.1',
    # "Host": 'fanyi.youdao.com',
    # "Origin": 'https://fanyi.youdao.com',
    "Referer": 'https://fanyi.youdao.com/',
    # "sec-ch-ua": '"Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
    # "sec-ch-ua-mobile": '?0',
    # "sec-ch-ua-platform": '"Windows"',
    # "Sec-Fetch-Dest": 'empty',
    # "Sec-Fetch-Mode": 'cors',
    # "Sec-Fetch-Site": 'same-origin',
    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
    # "X-Requested-With": "XMLHttpRequest"
}
print(headers)
resp = requests.post(url=url, data=data, headers=headers).json()
print(resp)