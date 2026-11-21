import os

viewport_path = r"c:\Users\1123j\OneDrive\Desktop\orbitlake\dist\assets\Viewport3D-CZPRPyYP.js"

with open(viewport_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Boost DPR array
target1 = "bw=[1,1.25,1.5]"
repl1 = "bw=[1.5,2,2.5]"
assert target1 in code, "Target 1 not found"
code = code.replace(target1, repl1, 1)

# 2. Enable antialias
target2 = "logarithmicDepthBuffer:!0,antialias:!1,powerPreference:`high-performance`"
repl2 = "logarithmicDepthBuffer:!0,antialias:!0,powerPreference:`high-performance`"
assert target2 in code, "Target 2 not found"
code = code.replace(target2, repl2, 1)

# 3. Always 4x multisampling
target3 = "multisampling:d?4:0"
repl3 = "multisampling:4"
assert target3 in code, "Target 3 not found"
code = code.replace(target3, repl3, 1)

# 4. In pointerdown handler: allow dragging any body when in edit mode
target4 = "o!==null&&o===O.current&&(a=o,t.stopImmediatePropagation(),e.setPointerCapture(t.pointerId))"
repl4 = "o!==null&&(window.__EDIT_MODE__||o===O.current)&&(a=o,window.__ORBIT_STORE__?.getState()?.select(o),t.stopImmediatePropagation(),e.setPointerCapture(t.pointerId))"
assert target4 in code, "Target 4 not found"
code = code.replace(target4, repl4, 1)

# 5. In hit-test: expand clickable radius when in edit mode
target5 = "let r=(t.x*.5+.5)*i.width,u=(-t.y*.5+.5)*i.height,d=Math.max(x.radius[e]/n*s,dw);"
repl5 = "let r=(t.x*.5+.5)*i.width,u=(-t.y*.5+.5)*i.height,d=Math.max(x.radius[e]/n*s,window.__EDIT_MODE__?32:dw);"
assert target5 in code, "Target 5 not found"
code = code.replace(target5, repl5, 1)

with open(viewport_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Successfully applied patches to Viewport3D-CZPRPyYP.js!")
