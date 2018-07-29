from urllib.request import urlopen
from bs4 import BeautifulSoup

url = 'http://www.pythonscraping.com/pages/warandpeace.html'
html = urlopen(url)
bsobj = BeautifulSoup(html, 'html5lib')
nameList = bsobj.findAll('span', {"class": "green"})
# findAll(tag,attributes,recursive,text,limit,keywords)
# find(tag,attributes,recursive,text,keywords)
# .findAll({"h1","h1",...,"h6"})
# .findAll("span",{"class":{"green","red"}})
#
# for name in nameList:
#     # get_text() 会清除正在处理的html标签，返回一个只包含文字的字符串
#     print(name.get_text())


# 子标签（child） 父标签的下一级
# 后代标签 （descentdant）父标签下面所有级别的标签 会有重复
url23 = 'http://www.pythonscraping.com/pages/page3.html'
html23 = urlopen(url23)
bsobj23 = BeautifulSoup(html23, 'html5lib')
# for child in bsobj23.find("table", {"id": "giftList"}).children:
for child in bsobj23.find("table", {"id": "giftList"}).descendants:
    print(child)


# 