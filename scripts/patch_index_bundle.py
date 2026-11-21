import os

bundle_path = r"c:\Users\1123j\OneDrive\Desktop\orbitlake\dist\assets\index-inCOgxLd.js"

with open(bundle_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Expose U store
target1 = "var nd=1,rd=0,H=ed(),U="
repl1 = "var nd=1,rd=0,H=ed(),U=window.__ORBIT_STORE__="
assert target1 in code, "Target 1 not found"
code = code.replace(target1, repl1, 1)

# 2. Expose V worker
target2 = "V=new hu(gu)"
repl2 = "V=window.__ORBIT_WORKER__=new hu(gu)"
assert target2 in code, "Target 2 not found"
code = code.replace(target2, repl2, 1)

# 3. Unblock asteroid belt & moon in Add Menu
target3 = "s=i.bodies.some(e=>e.kind===`planet`),c=i.bodies.some(e=>e.kind===`star`);"
repl3 = "s=i.bodies.length>0,c=true;"
assert target3 in code, "Target 3 not found"
code = code.replace(target3, repl3, 1)

# 4. In Hu (addBelt), fallback gracefully if no star exists so it never throws needsHost
target4 = "function Hu(e,t,n,r){let i=zu(e,ku(e,t));if(!i)throw new Eu(`needsHost`);"
repl4 = "function Hu(e,t,n,r){let i=zu(e,ku(e,t));if(!i){let _h={id:'star-'+Date.now(),name:'태양',kind:'star',mass:1,radius:.00465,state:{pos:[0,0,0],vel:[0,0,0]},star:{temperature:5778,luminosity:1}};e={...e,bodies:[_h,...e.bodies]};i=_h;}"
assert target4 in code, "Target 4 not found"
code = code.replace(target4, repl4, 1)

with open(bundle_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Successfully applied patches to index-inCOgxLd.js!")
