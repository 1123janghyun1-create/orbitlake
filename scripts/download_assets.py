import urllib.request
import os
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def download_file(rel_path):
    url = f"https://orbitpond.pages.dev/{rel_path.lstrip('/')}"
    local_path = os.path.join('download', rel_path.lstrip('/'))
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp, open(local_path, 'wb') as out:
            out.write(resp.read())
        print(f"Downloaded {rel_path}: {os.path.getsize(local_path)} bytes")
        return True
    except Exception as e:
        print(f"Failed {rel_path}: {e}")
        return False

# Base assets from HTML
for p in ['favicon.svg', 'brand/icon-192.png', 'apple-touch-icon.png', 'site.webmanifest']:
    download_file(p)

# Scan all downloaded JS and CSS for asset references
all_text = ""
for root, _, files in os.walk('download'):
    for f in files:
        if f.endswith('.js') or f.endswith('.css'):
            with open(os.path.join(root, f), 'r', encoding='utf-8', errors='ignore') as fp:
                all_text += fp.read() + "\n"

# Find paths
found_assets = set(re.findall(r'["\'](/?[a-zA-Z0-9_\-\./]+\.(?:png|jpg|jpeg|svg|webp|webm|mp3|wav|ogg|hdr|glb|gltf|bin|json|wasm))["\']', all_text))
print("Found potential assets:", found_assets)
for a in found_assets:
    if not a.startswith('http') and not a.startswith('//'):
        download_file(a)
