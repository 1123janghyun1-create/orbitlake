import os, re

with open('dist/assets/index-inCOgxLd.js', 'r', encoding='utf-8') as f:
    text = f.read()

print('index JS: Founder check:')
for m in re.finditer(r'credit:`[^`]+`', text):
    print(' ', m.group(0))

print('index JS: Brand obj check:')
idx = text.find('var of=')
print(' ', text[idx:idx+100])

with open('dist/assets/DocsPage-BHssFNno.js', 'r', encoding='utf-8') as f:
    docs_text = f.read()

print('DocsPage JS: hyun check:')
for m in re.finditer(r'.{0,30}hyun.{0,30}', docs_text):
    print(' ', m.group(0))

print('Remaining Hawon in dist:')
found_any = False
for root, dirs, files in os.walk('dist'):
    for file in files:
        if file.endswith(('.js', '.html')):
            p = os.path.join(root, file)
            with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                c = f.read()
                if 'Hawon' in c or '민하원' in c:
                    print(' Found in', p)
                    found_any = True
if not found_any:
    print(' None! All Hawon / 민하원 references cleanly replaced.')

print('\nCheck Pond in dist:')
found_pond = False
for root, dirs, files in os.walk('dist'):
    for file in files:
        if file.endswith(('.js', '.html')):
            p = os.path.join(root, file)
            with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                c = f.read()
                if 'Orbit Pond' in c:
                    print(' Found in', p)
                    found_pond = True
if not found_pond:
    print(' None! All Orbit Pond references in JS/HTML cleanly replaced.')
