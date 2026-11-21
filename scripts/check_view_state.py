with open('download/bundle.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(?:view|page|mode|screen)\s*:\s*["\']([a-zA-Z0-9_\-]+)["\']', text)
print("View/page/screen values:", set(matches))

# Look for history.pushState or location.pathname
print("History/location references:")
for h in set(re.findall(r'(?:history|location)\.[a-zA-Z0-9_]+', text)):
    print(" -", h)
