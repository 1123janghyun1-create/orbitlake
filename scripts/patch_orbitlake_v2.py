import os
import shutil

# 1. Update dist/index.html
with open('dist/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('https://orbitlake.pages.dev/', 'https://orbitlake.vercel.app/')
with open('dist/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Updated dist/index.html canonical url')

# 2. Update dist/assets/index-inCOgxLd.js
with open('dist/assets/index-inCOgxLd.js', 'r', encoding='utf-8') as f:
    js_index = f.read()

target_pond = 'var of={name:`Orbit Pond`,slug:`orbit-pond`'
replace_pond = 'var of={name:`orbitlake`,slug:`orbitlake`'

target_hawon = 'credit:`Founder, Hawon Min`'
replace_hawon = 'credit:`Founder, hyun`'

print('target_pond in js:', target_pond in js_index)
print('count target_hawon:', js_index.count(target_hawon))

assert target_pond in js_index, 'target_pond not found'
assert js_index.count(target_hawon) == 2, 'target_hawon count != 2'

js_index = js_index.replace(target_pond, replace_pond)
js_index = js_index.replace(target_hawon, replace_hawon)

with open('dist/assets/index-inCOgxLd.js', 'w', encoding='utf-8') as f:
    f.write(js_index)
print('Successfully patched dist/assets/index-inCOgxLd.js')

# 3. Update dist/assets/DocsPage-BHssFNno.js
with open('dist/assets/DocsPage-BHssFNno.js', 'r', encoding='utf-8') as f:
    docs_js = f.read()

docs_js = docs_js.replace('**Hawon Min** (Founder)', '**hyun** (Founder)')
docs_js = docs_js.replace('**민하원** (Founder)', '**hyun** (Founder)')
docs_js = docs_js.replace('Privacy officer: Hawon Min', 'Privacy officer: hyun')
docs_js = docs_js.replace('개인정보 보호책임자: 민하원', '개인정보 보호책임자: hyun')

with open('dist/assets/DocsPage-BHssFNno.js', 'w', encoding='utf-8') as f:
    f.write(docs_js)
print('Successfully patched dist/assets/DocsPage-BHssFNno.js')

# 4. Update package.json
with open('package.json', 'r', encoding='utf-8') as f:
    pkg = f.read()
pkg = pkg.replace('Orbit Pond - High-Fidelity N-Body Universe Gravity Simulator & 3D Celestial Engine', 'orbitlake - High-Fidelity N-Body Universe Gravity Simulator & 3D Celestial Engine')
with open('package.json', 'w', encoding='utf-8') as f:
    f.write(pkg)
print('Updated package.json')

# 5. Generate static HTML files for all doc/legal routes to prevent 404 on Vercel
routes = [
    'docs/guide',
    'docs/templates',
    'docs/faq',
    'docs/engine',
    'docs/physics',
    'docs/accuracy',
    'docs/changelog',
    'docs/credits',
    'legal/terms',
    'legal/privacy'
]

for r in routes:
    dir_path = os.path.join('dist', r)
    os.makedirs(dir_path, exist_ok=True)
    html_file = os.path.join(dir_path, 'index.html')
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    # Also create flat <route>.html just in case cleanUrls looks for it
    flat_file = os.path.join('dist', f'{r}.html')
    with open(flat_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'Generated fallback HTML for /{r}')

print('All routes generated successfully!')
