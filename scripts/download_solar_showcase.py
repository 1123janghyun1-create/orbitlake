import urllib.request
import os

DIST = r"c:\Users\1123j\OneDrive\Desktop\orbitlake\dist\showcase"
BASE = "https://orbitpond.pages.dev/showcase"

for name in ["solar.webp", "solar.mp4"]:
    url = f"{BASE}/{name}"
    local = os.path.join(DIST, name)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req)
        data = resp.read()
        if len(data) > 2000:
            with open(local, "wb") as f:
                f.write(data)
            print(f"Downloaded {name} ({len(data)} bytes)")
        else:
            print(f"Skipped {name} (fake fallback)")
    except Exception as e:
        print(f"Could not download {name}: {e}")
