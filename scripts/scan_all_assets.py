import os
import re
import urllib.request

headers = {'User-Agent': 'Mozilla/5.0'}
all_text = ''
for root, _, files in os.walk('dist'):
    for f in files:
        if f.endswith(('.js', '.css', '.html')):
            with open(os.path.join(root, f), 'r', encoding='utf-8', errors='ignore') as fp:
                all_text += fp.read() + '\n'

paths = set(re.findall(r'["\'`](/(?:[a-zA-Z0-9_\-]+/)*[a-zA-Z0-9_\-]+\.(?:webp|png|svg|jpg|jpeg|gif|ico|woff2?|ttf))["\'`]', all_text))
print(f'Total asset paths found in code: {len(paths)}')
for p in sorted(paths):
    local_p = os.path.join('dist', p.lstrip('/'))
    exists = os.path.exists(local_p)
    if not exists:
        print(f'Missing: {p} -> attempting download...')
        url = f'https://orbitpond.pages.dev{p}'
        os.makedirs(os.path.dirname(local_p), exist_ok=True)
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as resp, open(local_p, 'wb') as out:
                data = resp.read()
                if not data.startswith(b'<!doctype'):
                    out.write(data)
                    print(f'  Successfully downloaded {p} ({len(data)} bytes)')
                else:
                    print(f'  404 on {p}')
        except Exception as e:
            print(f'  Failed: {e}')
    else:
        print(f'Present: {p} ({os.path.getsize(local_p)} bytes)')
