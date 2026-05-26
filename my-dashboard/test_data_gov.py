import requests
from bs4 import BeautifulSoup
import json

def get_data():
    url = "https://data.gov.tw/dataset/4523"
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")
    # find all a tags where href contains Download.ashx
    links = [a['href'] for a in soup.find_all('a', href=True) if 'Download.ashx' in a['href'] or 'ndc.gov.tw' in a['href']]
    print("Links found:", links)

if __name__ == "__main__":
    get_data()
