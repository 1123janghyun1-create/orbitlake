import json
import re

bundle = open('download/bundle.js', 'r', encoding='utf-8').read()
vp = open('download/Viewport3D-CZPRPyYP.js', 'r', encoding='utf-8').read()
worker = open('download/sim.worker-BQXDNcfs.js', 'r', encoding='utf-8').read()
docs = open('download/DocsPage-BHssFNno.js', 'r', encoding='utf-8').read()
analysis = open('download/AnalysisPanel-Cqqtlwxf.js', 'r', encoding='utf-8').read()

print("--- PRESETS & LABELS ---")
# Find preset names / templates
presets = re.findall(r'(\{[^{}]*name:[^{}]*id:[^{}]*\})', bundle)
print(f"Preset snippets count: {len(presets)}")
for p in presets[:10]:
    print("Preset:", p[:100])

# Search for preset names
preset_names = re.findall(r'name:\s*["\']([^"\']+)["\']', bundle)
print("Names:", set(preset_names))

print("\n--- 3D VIEWPORT ANALYSIS ---")
# Look at controls and camera
print("Camera/controls:", re.findall(r'(OrbitControls|PerspectiveCamera|OrthographicCamera|TrackballControls|FlyControls)', vp))
print("Post-processing:", re.findall(r'(EffectComposer|RenderPass|UnrealBloomPass|ShaderPass|FilmPass)', vp))
print("Lighting & shadows:", re.findall(r'(DirectionalLight|PointLight|AmbientLight|HemisphereLight)', vp))
print("Geometries:", set(re.findall(r'([A-Z][a-zA-Z]+Geometry)', vp)))
print("Materials:", set(re.findall(r'([A-Z][a-zA-Z]+Material)', vp)))

print("\n--- SIMULATION PHYSICS ---")
# G constant, integrations, etc.
print("G constant or physics params in worker:", re.findall(r'(?:G\s*=|softening|dt|theta|collision|merge)', worker)[:10])
print("Integrator types:", re.findall(r'(verlet|rk4|yoshida|euler|leapfrog)', worker, re.IGNORECASE))
