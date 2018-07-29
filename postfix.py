from urllib.parse import urljoin
from urllib.request import urlopen, urlretrieve
from bs4 import BeautifulSoup


base_url = 'https://view42.book118.com'
htmlf = open('./postfix.html', 'r', encoding="utf-8")
bsobj = BeautifulSoup(htmlf, 'html5lib')
divs = bsobj.find_all('div')

for div in divs:
    print(div)
    page_id = div.attrs['id']
    relative_url = div.img.attrs['src']
    file_name = './postfix_' + page_id + '.png'
    real_url = urljoin(base_url, relative_url)
    image_name = 'postfix_' + page_id.replace('p', '')
    urlretrieve(real_url, file_name)


