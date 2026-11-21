import os
import shutil

# Target distribution directory
dist_dir = 'dist'
assets_dir = os.path.join(dist_dir, 'assets')
brand_dir = os.path.join(dist_dir, 'brand')

os.makedirs(assets_dir, exist_ok=True)
os.makedirs(brand_dir, exist_ok=True)

# Copy assets
shutil.copyfile('download/bundle.js', os.path.join(assets_dir, 'index-inCOgxLd.js'))
shutil.copyfile('download/style.css', os.path.join(assets_dir, 'index-kf8V3_nX.css'))
shutil.copyfile('download/Viewport3D-CZPRPyYP.js', os.path.join(assets_dir, 'Viewport3D-CZPRPyYP.js'))
shutil.copyfile('download/AnalysisPanel-Cqqtlwxf.js', os.path.join(assets_dir, 'AnalysisPanel-Cqqtlwxf.js'))
shutil.copyfile('download/DocsPage-BHssFNno.js', os.path.join(assets_dir, 'DocsPage-BHssFNno.js'))
shutil.copyfile('download/sim.worker-BQXDNcfs.js', os.path.join(assets_dir, 'sim.worker-BQXDNcfs.js'))

# Copy root/brand files
shutil.copyfile('download/favicon.svg', os.path.join(dist_dir, 'favicon.svg'))
shutil.copyfile('download/apple-touch-icon.png', os.path.join(dist_dir, 'apple-touch-icon.png'))
shutil.copyfile('download/site.webmanifest', os.path.join(dist_dir, 'site.webmanifest'))
shutil.copyfile('download/brand/icon-192.png', os.path.join(brand_dir, 'icon-192.png'))
shutil.copyfile('download/brand/icon-512.png', os.path.join(brand_dir, 'icon-512.png'))
shutil.copyfile('download/brand/symbol.svg', os.path.join(brand_dir, 'symbol.svg'))

# Write index.html
index_html = """<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="192x192" href="/brand/icon-192.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#05070d" />
    <meta name="description" content="Orbit Pond — 브라우저에서 우주를 설계하고 중력 시뮬레이션을 돌려 보세요. Create. Simulate. Explore." />
    <title>Orbit Pond</title>
    <script type="module" crossorigin src="/assets/index-inCOgxLd.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-kf8V3_nX.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
"""

with open(os.path.join(dist_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(index_html)

print("Files successfully organized in dist/")
