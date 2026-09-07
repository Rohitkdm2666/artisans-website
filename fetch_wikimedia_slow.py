import urllib.request
import json
import time

def get_images_from_category(category, limit=5):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle={category}&cmtype=file&cmlimit={limit}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ArtisanProject/1.0 (test@example.com)'})
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read())
        return data['query']['categorymembers']
    except Exception as e:
        print(f"Error fetching {category}: {e}")
        return []

def get_imageinfo(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|extmetadata&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ArtisanProject/1.0 (test@example.com)'})
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read())
        pages = data['query']['pages']
        for page_id in pages:
            return pages[page_id]['imageinfo'][0]
    except Exception as e:
        print(f"Error fetching imageinfo for {title}: {e}")
    return None

categories = [
    "Category:Weavers_from_India",
    "Category:Potters_from_India",
    "Category:Artisans_from_India"
]

results = []
for cat in categories:
    members = get_images_from_category(cat, 3)
    time.sleep(1)
    for m in members:
        info = get_imageinfo(m['title'])
        if info:
            results.append({
                'title': m['title'],
                'url': info['url'],
                'author': info['extmetadata'].get('Artist', {}).get('value', 'Unknown'),
                'license': info['extmetadata'].get('LicenseShortName', {}).get('value', 'Unknown')
            })
        time.sleep(1)

print(json.dumps(results, indent=2))
