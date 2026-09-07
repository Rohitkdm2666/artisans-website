import urllib.request
import urllib.parse
import json

title = "File:Chanderi Craft Village – Traditional Weaving and Handicrafts in Madhya Pradesh 01.jpg"
url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|extmetadata&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'ArtisanProject/1.0'})
response = urllib.request.urlopen(req)
data = json.loads(response.read())

for page_id in data['query']['pages']:
    info = data['query']['pages'][page_id]['imageinfo'][0]
    print(info['url'])
    print(info['extmetadata'].get('Artist', {}).get('value', 'Unknown Artist'))
