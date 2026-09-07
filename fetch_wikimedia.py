import urllib.request
import json
import random

categories = [
    "Category:Artisans_from_India",
    "Category:Weaving_in_India",
    "Category:Potters_from_India"
]

def get_images_from_category(category, limit=5):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle={category}&cmtype=file&cmlimit={limit}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    data = json.loads(response.read())
    return data['query']['categorymembers']

def get_imageinfo(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|extmetadata&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    data = json.loads(response.read())
    pages = data['query']['pages']
    for page_id in pages:
        return pages[page_id]['imageinfo'][0]
    return None

results = []
for cat in categories:
    members = get_images_from_category(cat)
    for m in members:
        info = get_imageinfo(m['title'])
        if info:
            results.append({
                'title': m['title'],
                'url': info['url'],
                'author': info['extmetadata'].get('Artist', {}).get('value', 'Unknown'),
                'license': info['extmetadata'].get('LicenseShortName', {}).get('value', 'Unknown'),
                'credit': info['extmetadata'].get('Credit', {}).get('value', 'Unknown')
            })

print(json.dumps(results, indent=2))
