import os

viewport_path = r"c:\Users\1123j\OneDrive\Desktop\orbitlake\dist\assets\Viewport3D-CZPRPyYP.js"

with open(viewport_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Accretion Disk Shader (yS): smooth noise, slow spin, eliminate sub-pixel shimmer
old_ys = """    float r = length(vObject.xz);
    float t = (r - uInner) / (uOuter - uInner);
    if (t < 0.0 || t > 1.0) discard;
    float angle = atan(vObject.z, vObject.x);
    // 케플러 회전: 안쪽일수록 빠르게 돕니다.
    float spin = uTime * 1.6 / pow(max(r, 0.5), 1.5);
    float a = angle + spin;
    vec3 swirlPoint = vec3(cos(a) * r, sin(a) * r, t * 3.0);
    float streaks = 0.55 + 0.45 * olFbm(vec3(r * 2.4, cos(a) * 2.0, sin(a) * 2.0) + vec3(0.0, 0.0, uTime * 0.05), 3);
    float fine = 0.75 + 0.25 * olSnoise(swirlPoint * 4.0);

    // 온도: 안쪽은 흰빛, 바깥으로 갈수록 주황·붉은빛
    vec3 hot = vec3(1.0, 0.96, 0.88);
    vec3 warm = vec3(1.0, 0.62, 0.22);
    vec3 cool = vec3(0.7, 0.18, 0.05);
    vec3 color = mix(hot, warm, smoothstep(0.0, 0.35, t));
    color = mix(color, cool, smoothstep(0.4, 1.0, t));

    // 도플러 효과: 카메라 쪽으로 다가오는 쪽은 밝게, 멀어지는 쪽은 어둡게
    vec3 tangent = normalize(mat3(modelMatrix) * vec3(-vObject.z, 0.0, vObject.x));
    vec3 toCamera = normalize(cameraPosition - vWorldPos);
    float beaming = 1.0 + 0.75 * dot(tangent, toCamera);

    float edges = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.55, t);
    float brightness = edges * streaks * fine * beaming * (1.6 - 1.1 * t);
    gl_FragColor = vec4(color * brightness * uIntensity * 2.2, 1.0);"""

new_ys = """    float r = length(vObject.xz);
    float t = (r - uInner) / (uOuter - uInner);
    if (t < 0.0 || t > 1.0) discard;
    float angle = atan(vObject.z, vObject.x);
    // 케플러 회전: 부드럽고 안정적으로 회전하여 깜빡임 제거
    float spin = uTime * 0.35 / pow(max(r, 1.2), 1.1);
    float a = angle + spin;
    vec3 swirlPoint = vec3(cos(a) * r, sin(a) * r, t * 1.5);
    float streaks = 0.75 + 0.25 * olFbm(vec3(r * 1.5, cos(a) * 1.2, sin(a) * 1.2) + vec3(0.0, 0.0, uTime * 0.02), 2);
    float fine = 0.88 + 0.12 * olSnoise(swirlPoint * 1.8);

    // 온도: 안쪽은 흰빛, 바깥으로 갈수록 주황·붉은빛
    vec3 hot = vec3(1.0, 0.96, 0.88);
    vec3 warm = vec3(1.0, 0.62, 0.22);
    vec3 cool = vec3(0.7, 0.18, 0.05);
    vec3 color = mix(hot, warm, smoothstep(0.0, 0.35, t));
    color = mix(color, cool, smoothstep(0.4, 1.0, t));

    // 도플러 효과
    vec3 tangent = normalize(mat3(modelMatrix) * vec3(-vObject.z, 0.0, vObject.x));
    vec3 toCamera = normalize(cameraPosition - vWorldPos);
    float beaming = 1.0 + 0.45 * dot(tangent, toCamera);

    float edges = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.55, t);
    float brightness = edges * streaks * fine * beaming * (1.5 - 0.9 * t);
    gl_FragColor = vec4(color * brightness * uIntensity * 1.7, 1.0);"""

assert old_ys in code, "old_ys not found"
code = code.replace(old_ys, new_ys, 1)

# 2. Photon Sphere / Glow Shader (xS): widen sub-pixel line, smooth noise
old_xs = """    // 광자 고리: 그림자 가장자리의 아주 가늘고 밝은 고리
    float photon = exp(-pow((r - 1.04) / 0.035, 2.0)) * 1.4;
    // 원반 뒤쪽의 상: 그림자를 감싸는 넓은 띠. 위아래(원반 평면과 수직인 쪽)가 더 두껍고 밝습니다.
    float vertical = abs(sin(angle));
    float width = 0.22 + 0.55 * vertical;
    float band = smoothstep(1.08, 1.18, r) * (1.0 - smoothstep(1.18, 1.18 + width, r));
    float streaks = 0.6 + 0.4 * olFbm(vec3(r * 6.0, angle * 2.0 + uTime * 0.6, uTime * 0.08), 2);
    float glow = band * streaks * (0.3 + 0.7 * vertical) * 2.4;
    vec3 color = mix(vec3(1.0, 0.62, 0.25), vec3(1.0, 0.93, 0.8), photon);
    // 판의 가장자리(반지름 2.6)에 닿기 전에 완전히 사라지게 합니다.
    float edge = 1.0 - smoothstep(2.0, 2.5, r);
    float alpha = (photon + glow) * uIntensity * edge;
    if (r < 1.0) discard;
    gl_FragColor = vec4(color * alpha * 2.0, 1.0);"""

new_xs = """    // 광자 고리: 두께를 키워 서브픽셀 계단/깜빡임 제거
    float photon = exp(-pow((r - 1.04) / 0.075, 2.0)) * 1.15;
    // 원반 뒤쪽의 상: 부드러운 발광
    float vertical = abs(sin(angle));
    float width = 0.22 + 0.55 * vertical;
    float band = smoothstep(1.08, 1.18, r) * (1.0 - smoothstep(1.18, 1.18 + width, r));
    float streaks = 0.75 + 0.25 * olFbm(vec3(r * 3.0, angle * 1.2 + uTime * 0.15, uTime * 0.03), 2);
    float glow = band * streaks * (0.35 + 0.65 * vertical) * 1.8;
    vec3 color = mix(vec3(1.0, 0.62, 0.25), vec3(1.0, 0.93, 0.8), photon);
    // 가장자리 감쇄
    float edge = 1.0 - smoothstep(2.0, 2.5, r);
    float alpha = (photon + glow) * uIntensity * edge;
    if (r < 1.0) discard;
    gl_FragColor = vec4(color * alpha * 1.6, 1.0);"""

assert old_xs in code, "old_xs not found"
code = code.replace(old_xs, new_xs, 1)

# 3. Star Surface Shader (LS): smooth granulation frequency
old_ls = """    // 표면의 끓는 얼룩(쌀알무늬)과 그보다 큰 밝고 어두운 영역
    float cells = olFbm(vObject * 9.0 + vec3(0.0, uTime * 0.05, uTime * 0.025));
    float regions = olFbm(vObject * 2.2 + vec3(uTime * 0.01, 0.0, 0.0));
    float granulation = 0.78 + 0.3 * cells + 0.22 * regions;
    // 흑점: 드문드문 생기는 어두운 점 (주변보다 온도가 낮은 곳)
    float spots = smoothstep(0.66, 0.74, olFbm(vObject * 3.3 + vec3(4.1, uTime * 0.003, 1.7)));
    granulation *= 1.0 - 0.55 * spots;
    vec3 color = uColor * limb * granulation;
    color = mix(color, vec3(limb), 0.22 * mu);
    gl_FragColor = vec4(color * 2.4, 1.0);"""

new_ls = """    // 표면의 끓는 얼룩(쌀알무늬): 주파수를 낮춰 원거리 깜빡임 방지
    float cells = olFbm(vObject * 3.5 + vec3(0.0, uTime * 0.02, uTime * 0.01));
    float regions = olFbm(vObject * 1.6 + vec3(uTime * 0.006, 0.0, 0.0));
    float granulation = 0.86 + 0.14 * cells + 0.1 * regions;
    float spots = smoothstep(0.66, 0.74, olFbm(vObject * 2.2 + vec3(4.1, uTime * 0.002, 1.7)));
    granulation *= 1.0 - 0.45 * spots;
    vec3 color = uColor * limb * granulation;
    color = mix(color, vec3(limb), 0.22 * mu);
    gl_FragColor = vec4(color * 2.0, 1.0);"""

assert old_ls in code, "old_ls not found"
code = code.replace(old_ls, new_ls, 1)

# 4. Star Corona Shader (JS): smooth streaks
old_js = """    float streaks = 0.55 + 0.45 * olFbm(direction * 3.2 + vec3(0.0, uTime * 0.03, uTime * 0.02), 4);
    float glow = pow(rim, 2.6) * streaks;
    gl_FragColor = vec4(uColor * glow * 1.5, 1.0);"""

new_js = """    float streaks = 0.75 + 0.25 * olFbm(direction * 2.0 + vec3(0.0, uTime * 0.015, uTime * 0.01), 3);
    float glow = pow(rim, 2.2) * streaks;
    gl_FragColor = vec4(uColor * glow * 1.3, 1.0);"""

assert old_js in code, "old_js not found"
code = code.replace(old_js, new_js, 1)

# 5. Velvet Bloom Smoothing
old_bloom = "luminanceThreshold:.6,luminanceSmoothing:.5,intensity:.75"
new_bloom = "luminanceThreshold:.4,luminanceSmoothing:.7,intensity:.7"
assert old_bloom in code, "old_bloom not found"
code = code.replace(old_bloom, new_bloom, 1)

with open(viewport_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Successfully applied black hole, star, and bloom anti-flicker patches!")
