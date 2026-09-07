import urllib.request
import json

url = "https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Artisans_from_India&cmtype=file&cmlimit=20&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'ArtisanProject/1.0'})
response = urllib.request.urlopen(req)
data = json.loads(response.read())

for m in data['query']['categorymembers']:
    title = m['title']
    print(title)
