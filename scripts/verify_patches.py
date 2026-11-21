import os

js_path = r"c:\Users\1123j\OneDrive\Desktop\orbitlake\dist\assets\index-inCOgxLd.js"
with open(js_path, "r", encoding="utf-8") as f:
    content = f.read()

checks = [
    "var nd=1,rd=0,H=ed(),U=",
    "V=new hu(gu)",
    "s=i.bodies.some(e=>e.kind===`planet`),c=i.bodies.some(e=>e.kind===`star`);",
    "function Hu(e,t,n,r){let i=zu(e,ku(e,t));if(!i)throw new Eu(`needsHost`);"
]

for c in checks:
    pos = content.find(c)
    print(f"'{c[:40]}' -> found at {pos}")
