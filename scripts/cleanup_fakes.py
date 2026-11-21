import os

# Remove fake 1096-byte files (SPA fallback HTML, not real assets)
DIST = r"c:\Users\1123j\OneDrive\Desktop\orbitlake\dist"
showcase_dir = os.path.join(DIST, "showcase")

removed = 0
kept = 0
for f in os.listdir(showcase_dir):
    fp = os.path.join(showcase_dir, f)
    size = os.path.getsize(fp)
    if size == 1096:
        os.remove(fp)
        print(f"REMOVED (fake): {f} ({size} bytes)")
        removed += 1
    else:
        print(f"KEPT: {f} ({size} bytes)")
        kept += 1

print(f"\nRemoved {removed} fake files, kept {kept} real files")
