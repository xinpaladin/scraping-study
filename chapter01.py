# from urllib.request import urlopen
# from bs4 import BeautifulSoup

# html = urlopen('http://www.hanfan.cc/')
# bsobj = BeautifulSoup(html.read())
# # print(html.read())
# print(bsobj)

# # 处理异常
# from urllib.error import HTTPError
# try:
#     html = urlopen('http://www.hanfan.cc/')
# except HTTPError as e:
#     print(e)
#     # 返回空值 中断程序 或者执行另一个方案
# else:
#     # 程序继续 如果try 已经return/break 不需要else
#     bsobj = BeautifulSoup(html.read())
#     # print(html.read())
#     print(bsobj)

# 较完整的代码块

from urllib.request import urlopen
from bs4 import BeautifulSoup
from urllib.error import HTTPError, URLError


def getTitle(url):
    # 处理HTTP请求错误
    try:
        html = urlopen(url)
    except (HTTPError, URLError) as e:
        return None

    # 数据不匹配 假设不存在h1 属性
    try:
        bsobj = BeautifulSoup(html.read(), 'html5lib')
        title = bsobj.body.h1
    except AttributeError as e:
        return None
    return title


title = getTitle("http://www.hanfan.cc/")
if title is None:
    print("Title could not be found")
else:
    print(title)