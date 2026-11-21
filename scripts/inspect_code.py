import re

with open('download/Viewport3D-CZPRPyYP.js', 'r', encoding='utf-8') as f:
    vp = f.read()

print("Viewport3D length:", len(vp))
print("Three.js references:", len(re.findall(r'THREE', vp)))
print("Shaders / GLSL keywords:", len(re.findall(r'varying|uniform|gl_Position|gl_FragColor', vp)))

with open('download/sim.worker-BQXDNcfs.js', 'r', encoding='utf-8') as f:
    sim = f.read()

print("sim.worker length:", len(sim))
# Look for physics methods
methods = re.findall(r'[a-zA-Z0-9_]+(?=\s*=\s*function|\s*\([^)]*\)\s*\{)', sim)[:30]
print("Worker sample symbols:", methods[:20])
