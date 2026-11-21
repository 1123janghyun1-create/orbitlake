import os
import re
from PIL import Image, ImageDraw, ImageFont

# 1. Update dist/index.html
index_path = 'dist/index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('Orbit Pond', 'orbitlake')
html = html.replace('orbitpond', 'orbitlake')
with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated dist/index.html")

# 2. Update dist/site.webmanifest
manifest_path = 'dist/site.webmanifest'
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = f.read()

manifest = manifest.replace('"Orbit Pond"', '"orbitlake"')
manifest = manifest.replace('orbitpond', 'orbitlake')
with open(manifest_path, 'w', encoding='utf-8') as f:
    f.write(manifest)
print("Updated dist/site.webmanifest")

# 3. Update dist/assets/index-inCOgxLd.js
js_path = 'dist/assets/index-inCOgxLd.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace of={name:`Orbit Pond`,slug:`orbit-pond`,...}
js_content = js_content.replace('name:`Orbit Pond`', 'name:`orbitlake`')
js_content = js_content.replace('slug:`orbit-pond`', 'slug:`orbitlake`')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Updated dist/assets/index-inCOgxLd.js")

# 4. Update SVGs
for svg_file in ['dist/favicon.svg', 'dist/brand/symbol.svg']:
    with open(svg_file, 'r', encoding='utf-8') as f:
        svg_content = f.read()
    svg_content = svg_content.replace('Orbit Pond', 'orbitlake')
    with open(svg_file, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"Updated {svg_file}")

# 5. Generate high-resolution wordmark for orbitlake
# Size: 1364 x 400 (4x) and downsample to 327 x 96 for wordmark-sm.webp
w, h = 1364, 400
im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
draw = ImageDraw.Draw(im)

font_path = r'C:\Windows\Fonts\segoeuib.ttf'
font_size = 180
font = ImageFont.truetype(font_path, font_size)

# Draw "orbitlake" in clean white with tracked styling
text = "orbitlake"
bbox = draw.textbbox((0, 0), text, font=font)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]

# Center in canvas
x = (w - tw) // 2
y = (h - th) // 2 - bbox[1]

# Draw soft glow
for dx in [-2, -1, 0, 1, 2]:
    for dy in [-2, -1, 0, 1, 2]:
        if dx != 0 or dy != 0:
            draw.text((x + dx, y + dy), text, font=font, fill=(255, 255, 255, 30))

draw.text((x, y), text, font=font, fill=(255, 255, 255, 255))

# Save full size wordmark
im.save('dist/brand/wordmark.png')
im.save('dist/brand/wordmark.webp', 'WEBP')

# Downscale with high quality Lanczos filter for wordmark-sm.webp (327 x 96)
im_sm = im.resize((327, 96), Image.Resampling.LANCZOS)
im_sm.save('dist/brand/wordmark-sm.webp', 'WEBP')
print("Generated brand wordmark images (PNG, WEBP, and sm.webp)")

# 6. Also update README.md
readme_path = 'README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    readme = f.read()
readme = readme.replace('Orbit Pond (OrbitLake)', 'orbitlake')
readme = readme.replace('Orbit Pond', 'orbitlake')
with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(readme)
print("Updated README.md")

print("All name replacements to 'orbitlake' completed successfully!")
