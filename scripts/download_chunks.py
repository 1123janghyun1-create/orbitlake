import urllib.request
import os

chunks = [
    'Viewport3D-CZPRPyYP.js',
    'AnalysisPanel-Cqqtlwxf.js',
    'DocsPage-BHssFNno.js',
    'sim.worker-BQXDNcfs.js'
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

os.makedirs('download', exist_ok=True)
for c in chunks:
    url = f"https://orbitpond.pages.dev/assets/{c}"
    path = os.path.join('download', c)
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp, open(path, 'wb') as out:
            out.write(resp.read())
        print(f"Downloaded {c}: {os.path.getsize(path)} bytes")
    except Exception as e:
        print(f"Failed {c}: {e}")
