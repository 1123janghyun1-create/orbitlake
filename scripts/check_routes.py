with open('download/bundle.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("React router / routes found:")
for r in set(re.findall(r'path:\s*["\']([^"\']+)["\']', text)):
    print(" - path:", r)

print("URL patterns:")
for u in set(re.findall(r'["\'](/app[^"\']*|/docs[^"\']*|/about[^"\']*)["\']', text)):
    print(" - url:", u)
