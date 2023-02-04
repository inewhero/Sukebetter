import requests
import re
import json
from bs4 import BeautifulSoup

def check_status():
    '''
    check if nyaa.si/javbee.org/fc2hub.com/fc2.com is available
    '''
    network_result = {'nyaa':None,'javbee':None,'fc2hub':None,'fc2':None}

    try:
        reqcode_nyaa = requests.get(url='https://sukebei.nyaa.si/static/img/icons/sukebei/2_2.png', 
                               headers=header,proxies=proxy, timeout=15).status_code
        network_result['nyaa'] = reqcode_nyaa
    except:
        print('Network Error: nyaa.si Response Timeout.')
    try:
        reqcode_javbee = requests.get(url='https://javbee.org/storage/155080/67af1b3315b0cef9c2d0bc4c2b6ef983.png', 
                               headers=header,proxies=proxy, timeout=15).status_code
        network_result['javbee'] = reqcode_javbee
    except:
        print('Network Error: javbee.org Response Timeout.')
    try:
        reqcode_fc2hub = requests.get(url='https://fc2hub.com/images/fc2hub.svg', 
                               headers=header,proxies=proxy, timeout=15).status_code
        network_result['fc2hub'] = reqcode_fc2hub
    except:
        print('Network Error: fc2hub.com Response Timeout.')
    try:
        reqcode_fc2 = requests.get(url='https://adult.contents.fc2.com/images/dot_arrow.png', 
                               headers=header,proxies=proxy, timeout=15).status_code
        network_result['fc2'] = reqcode_fc2
    except:
        print('Network Error: fc2.com Response Timeout.')
    
    return network_result


def get_nyaapage(current_page: int, load_num: int, header: dict, proxy: dict):
    '''
    get pages from sukebei.nyaa.si/user/offkab?f=0&c=0_0&q=FC2
    '''
    jav = [[], [], [], []]
    jav_temp = []
    for current_page in range(current_page, current_page+load_num):
        javurl = 'https://sukebei.nyaa.si/user/offkab?f=0&c=0_0&q=FC2&p=' + \
            str(current_page)

        try:
            req = requests.get(url=javurl, headers=header,
                               proxies=proxy, timeout=20)
        except:
            print('Network Error: Response Timeout.')
            jav = None
            break

        if req.status_code == 200:
            print('Success. Page = '+str(current_page))
            jav_temp = get_nyaaresource(BeautifulSoup(req.text, features='lxml'))
            if jav is None:
                jav = jav_temp
            else:
                for res_catalogue in range(4):
                    jav[res_catalogue].extend(jav_temp[res_catalogue])
        else:
            print(str(req.status_code)+' Fail. Page = '+str(current_page))
            break

    return jav
    

def get_nyaaresource(soup: BeautifulSoup) -> list:
    '''
    get resources from sukebei.nyaa.si/user/offkab?f=0&c=0_0&q=FC2
    '''
    titlelist = []
    for soup_title in soup.find_all('a', attrs={'title': re.compile('FC2-PPV')}):
        titlelist.append(soup_title.get('title'))

    sizelist = []
    soup_size = soup.select('body > div > div.row > div.table-responsive > table > tbody > tr > td:nth-child(4)')
    size_addr = len(soup_size)
    sizelist = [soup_size[size_addr].string for size_addr in range(size_addr)]

    timestamplist = []
    for soup_timestamp in soup.find_all('td', attrs={'data-timestamp': re.compile('\d{10}')}):
        timestamplist.append(soup_timestamp.get('data-timestamp'))

    magnetlist = []
    for soup_magnet in soup.find_all('a', attrs={'href': re.compile('^magnet:')}):
            magnetlist.append(soup_magnet.get('href'))
    
    omni_list = [titlelist, sizelist, timestamplist, magnetlist]

    return omni_list


def get_javbeepage(current_page: int, load_num: int, header: dict, proxy: dict):
    '''
    get pages from javbee.org
    '''
    
    jav = [[], [], [], []]
    jav_temp = []

    for current_page in range(current_page, current_page+load_num):
        javurl = 'https://javbee.org/new?page='+str(current_page)

        try:
            req = requests.get(url=javurl, headers=header,
                               proxies=proxy, timeout=20)
        except:
            print('Network Error: Response Timeout.')
            jav = None
            break

        if req.status_code == 200:
            print('Success. Page = '+str(current_page))
            jav_temp = get_javbeeresource(BeautifulSoup(req.text,features='lxml'))
            if jav is None:
                jav = jav_temp
            else:
                for res_catalogue in range(4):
                    jav[res_catalogue].extend(jav_temp[res_catalogue])
        else:
            print(str(req.status_code)+' Fail. Page = '+str(current_page))
            break

    return jav


def get_javbeeresource(soup: BeautifulSoup) -> list:
    '''
    get resources from javbee.org
    '''
    titlelist = []
    sizelist = []
    soup_info = soup.find_all(class_='title is-4 is-spaced')
    for info_addr in range(0, len(soup_info)):
        info_temp = [text for text in soup_info[info_addr].stripped_strings]
        titlelist.append(info_temp[0])
        sizelist.append(info_temp[1])

    imagelist = []
    for soup_image in soup.find_all('button', attrs={'data-image': re.compile('src')}):
        image_temp = soup_image.get('data-image')
        image_temp_list = [json.loads(image_temp)[image_addr]['src'] for image_addr in range(
            0, len(json.loads(image_temp)))]  # an ugly way to create imagelists but...
        imagelist.append(image_temp_list)

    magnetlist = []
    for soup_magnet in soup.find_all('a', attrs={'href': re.compile('^magnet:')}):
        magnetlist.append(soup_magnet.get('href'))

    omni_list = [titlelist, sizelist, imagelist, magnetlist]

    return omni_list


header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
}
proxy = {
    'http': 'http://127.0.0.1:10809',
    'https': 'http://127.0.0.1:10809'
}

if __name__ == '__main__':
    check_status()
    pagenum = input('How many page(s) do you want?\n')
    print('Now Loading...\n')
    jav = get_nyaapage(1, int(pagenum), header, proxy)
    if jav is None:
        print('No Data.')
    else:
        print(jav)
    
