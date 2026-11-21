with open(r"c:\Users\1123j\OneDrive\Desktop\orbitlake\dist\assets\Viewport3D-CZPRPyYP.js", "r", encoding="utf-8") as f:
    content = f.read()

pos = content.find("l=t=>{if(r=t.clientX,i=t.clientY,a=null,c=!1,t.button!==0)return;let o=n(t.clientX,t.clientY);")
print(f"pointerdown pos: {pos}")
print(content[pos:pos+300])
