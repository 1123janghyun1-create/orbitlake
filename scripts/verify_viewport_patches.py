import os

js_path = r"c:\Users\1123j\OneDrive\Desktop\orbitlake\dist\assets\Viewport3D-CZPRPyYP.js"
with open(js_path, "r", encoding="utf-8") as f:
    content = f.read()

checks = [
    "bw=[1,1.25,1.5]",
    "antialias:!1",
    "multisampling:d?4:0",
    "intensity:.9"
]

for c in checks:
    pos = content.find(c)
    print(f"'{c}' -> found at {pos}")
