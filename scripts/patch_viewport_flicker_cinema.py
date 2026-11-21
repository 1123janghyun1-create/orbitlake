import os

viewport_path = r"c:\Users\1123j\OneDrive\Desktop\orbitlake\dist\assets\Viewport3D-CZPRPyYP.js"

with open(viewport_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Stop Ay performance monitor from flip-flopping resolution (stops light flicker)
target1 = "!d&&e.quality===`high`&&(0,Q.jsx)(Ay,{onDecline:()=>c(e=>Math.max(0,e-1)),onIncline:()=>c(e=>Math.min(bw.length-1,e+1)),flipflops:4,onFallback:()=>c(0)})"
repl1 = "!d&&e.quality===`high`&&(0,Q.jsx)(Q.Fragment,{})"
assert target1 in code, "Target 1 not found"
code = code.replace(target1, repl1, 1)

# 2. Smooth Bloom thresholds to eliminate threshold popping/flicker
target2 = "luminanceThreshold:1,luminanceSmoothing:.2,intensity:.9"
repl2 = "luminanceThreshold:.6,luminanceSmoothing:.5,intensity:.75"
assert target2 in code, "Target 2 not found"
code = code.replace(target2, repl2, 1)

# 3. Allow changing target planet during cinema/recording
target3 = "let h=_?p(_,performance.now()):null,y=h?h.shot.focusId:n,C=y===null?void 0:x.indexOf.get(y)"
repl3 = "let h=_?p(_,performance.now()):null,y=n||(h?h.shot.focusId:null),C=y===null?void 0:x.indexOf.get(y)"
assert target3 in code, "Target 3 not found"
code = code.replace(target3, repl3, 1)

# 4. Remove ||h from camera cut so camera smoothly glides during cinema recording
target4 = "!o.hasOrigin||h?(o.hasOrigin=!0,o.progress=1,o.offset.fill(0),S.position.set(0,Math.sin(uw)*o.toDistance,Math.cos(uw)*o.toDistance)):(o.progress=0,o.offset[0]=x.origin[0]-e,o.offset[1]=x.origin[1]-t,o.offset[2]=x.origin[2]-r,o.fromDistance=S.position.length())"
repl4 = "!o.hasOrigin?(o.hasOrigin=!0,o.progress=1,o.offset.fill(0),S.position.set(0,Math.sin(uw)*o.toDistance,Math.cos(uw)*o.toDistance)):(o.progress=0,o.offset[0]=x.origin[0]-e,o.offset[1]=x.origin[1]-t,o.offset[2]=x.origin[2]-r,o.fromDistance=S.position.length())"
assert target4 in code, "Target 4 not found"
code = code.replace(target4, repl4, 1)

# 5. Increase transition duration lw to 1.4s for cinematic smoothness
target5 = "lw=.9"
repl5 = "lw=1.4"
assert target5 in code, "Target 5 not found"
code = code.replace(target5, repl5, 1)

with open(viewport_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Successfully applied flicker fix and cinema smooth transition patches to Viewport3D!")
