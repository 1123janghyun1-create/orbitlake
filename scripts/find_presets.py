import re

bundle = open('download/bundle.js', 'r', encoding='utf-8').read()

# Let's search for presets text like "태양계", "8자", "쌍성", "트로이", "라그랑주", "카오스", "은하"
matches = re.findall(r'(\b[a-zA-Z0-9_]+\s*:\s*\[(?:\{[^{}]+\},?)+\])', bundle)
print(f"Object array matches: {len(matches)}")

# Let's search for celestial body templates (sun, earth, moon, etc.)
keywords = ["태양", "지구", "달", "목성", "화성", "수성", "금성", "토성", "천왕성", "해왕성", "블랙홀", "중성자별", "펄서"]
for kw in keywords:
    pos = [m.start() for m in re.finditer(kw, bundle)]
    print(f"Keyword '{kw}': {len(pos)} occurrences")
    for p in pos[:3]:
        print("   Context:", bundle[max(0, p-60):min(len(bundle), p+100)])
