import urllib.request
import os

BASE = "https://orbitpond.pages.dev"
DIST = r"c:\Users\1123j\OneDrive\Desktop\orbitlake\dist"

# Check and download showcase files
showcase_files = ["showcase/saturn.webp", "showcase/saturn.mp4"]

for f in showcase_files:
    url = BASE + "/" + f
    local = os.path.join(DIST, f.replace("/", os.sep))
    os.makedirs(os.path.dirname(local), exist_ok=True)
    
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        resp = urllib.request.urlopen(req)
        data = resp.read()
        with open(local, "wb") as fh:
            fh.write(data)
        print(f"OK: {f} -> {len(data)} bytes")
    except urllib.error.HTTPError as e:
        print(f"FAIL: {f} -> HTTP {e.code}")
    except Exception as e:
        print(f"ERROR: {f} -> {e}")

# Also check for any other showcase files
print("\nChecking for other showcase files...")
for name in ["earth", "jupiter", "mars", "mercury", "venus", "neptune", "uranus", "moon", "sun",
             "binary", "blackhole", "neutronstar", "pulsar", "supernova", "galaxy"]:
    for ext in [".webp", ".mp4", ".png", ".jpg"]:
        url = BASE + "/showcase/" + name + ext
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            resp = urllib.request.urlopen(req)
            data = resp.read()
            local = os.path.join(DIST, "showcase", name + ext)
            with open(local, "wb") as fh:
                fh.write(data)
            print(f"  FOUND: showcase/{name}{ext} -> {len(data)} bytes")
        except urllib.error.HTTPError:
            pass
        except Exception:
            pass

# Also check for /og.png, /preview.png, etc. that might be referenced
print("\nChecking root-level images...")
for name in ["og.png", "preview.png", "og.webp", "preview.webp", "og.jpg"]:
    url = BASE + "/" + name
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        resp = urllib.request.urlopen(req)
        data = resp.read()
        local = os.path.join(DIST, name)
        with open(local, "wb") as fh:
            fh.write(data)
        print(f"  FOUND: {name} -> {len(data)} bytes")
    except urllib.error.HTTPError:
        pass
    except Exception:
        pass

print("\nDone!")
