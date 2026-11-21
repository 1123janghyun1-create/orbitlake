import re

with open('download/bundle.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Look for dynamic imports or asset chunks
chunks = re.findall(r'["\']([a-zA-Z0-9_\-\./]+\.js)["\']', text)
print("Referenced .js:", set(chunks))

assets = re.findall(r'/assets/[a-zA-Z0-9_\-\.]+', text)
print("Assets referenced:", set(assets))

# Also look for any vite dynamic imports like import("./...") or __vitePreload
vite_preloads = re.findall(r'([a-zA-Z0-9_\-]+\-[a-zA-Z0-9_]{8}\.js)', text)
print("Vite hashed chunks:", set(vite_preloads))
