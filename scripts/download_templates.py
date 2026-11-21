import urllib.request
import os

headers = {'User-Agent': 'Mozilla/5.0'}

templates = [
    'binary.webp',
    'binaryBlackHole.webp',
    'blackHole.webp',
    'empty.webp',
    'figureEight.webp',
    'galacticCenter.webp',
    'inspiral.webp',
    'neutronStars.webp',
    'random.webp',
    'solarSystem.webp',
    'sunEarthMoon.webp',
    'supernova.webp',
    'tripleStar.webp',
    'trojans.webp'
]

os.makedirs('dist/templates', exist_ok=True)

for t in templates:
    url = f"https://orbitpond.pages.dev/templates/{t}"
    dest = os.path.join('dist/templates', t)
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as out:
            out.write(resp.read())
        print(f"Downloaded {t}: {os.path.getsize(dest)} bytes")
    except Exception as e:
        print(f"Failed {t}: {e}")

# Also download other CSS chunks if available
for css in ['assets/AnalysisPanel-CnsZ1jie.css', 'assets/DocsPage-B5JExhp2.css']:
    url = f"https://orbitpond.pages.dev/{css}"
    dest = os.path.join('dist', css)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as out:
            out.write(resp.read())
        print(f"Downloaded {css}: {os.path.getsize(dest)} bytes")
    except Exception as e:
        print(f"Failed {css}: {e}")
