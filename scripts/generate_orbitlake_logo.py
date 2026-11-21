from PIL import Image, ImageDraw, ImageFont
import numpy as np
import scipy.ndimage
import os

# Load original wordmark
orig = Image.open('dist/brand/wordmark.png')
orig_arr = np.array(orig)

# 1. Left part: Keep "Orbit" and the lower orbit arc intact
orbit_part = orig_arr[:, :710].copy()

# 2. Extract upper orbit arc with the planet dot
lbl, num = scipy.ndimage.label(orig_arr[:, :, 3] > 50)
slices = scipy.ndimage.find_objects(lbl)
upper_arc_mask = np.zeros(orig_arr.shape[:2], dtype=bool)
for i, s in enumerate(slices):
    area = (orig_arr[s][:, :, 3] > 50).sum()
    if 3500 < area < 4500 and s[1].start > 650:
        upper_arc_mask = (lbl == (i+1))
        break

# Create canvas
new_img = np.zeros_like(orig_arr)
new_img[:, :710] = orbit_part
new_img[upper_arc_mask] = orig_arr[upper_arc_mask]

# 3. Render 'Lake' matching exact font, slant (11.7 deg), baseline (y=278), cap-height (144)
font = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuiz.ttf', 205)
target_baseline = 278
start_x = 740
gap = 26

for ch in ['L', 'a', 'k', 'e']:
    t = Image.new('RGBA', (350, 350), (0, 0, 0, 0))
    dt = ImageDraw.Draw(t)
    dt.text((50, 50), ch, font=font, fill=(255, 255, 255, 255))
    t_arr = np.array(t)[:, :, 3]
    ys, xs = np.where(t_arr > 30)
    crop = t.crop((xs.min(), ys.min(), xs.max()+1, ys.max()+1))
    
    y_pos = target_baseline - crop.height
    c_arr = np.array(crop)
    h, w = c_arr.shape[:2]
    for y in range(h):
        for x in range(w):
            if c_arr[y, x, 3] > 0:
                new_img[y_pos+y, start_x+x] = c_arr[y, x]
    start_x += w + gap

result_im = Image.fromarray(new_img)

# Save high-res PNG and WEBP (1364 x 401)
result_im.save('dist/brand/wordmark.png')
result_im.save('dist/brand/wordmark.webp', 'WEBP')

# Save downscaled navbar WEBP (327 x 96) using Lanczos
sm = result_im.resize((327, 96), Image.Resampling.LANCZOS)
sm.save('dist/brand/wordmark-sm.webp', 'WEBP')

print("Successfully generated and saved Orbit Lake brand wordmark assets:")
print(" - dist/brand/wordmark.png (1364x401)")
print(" - dist/brand/wordmark.webp (1364x401)")
print(" - dist/brand/wordmark-sm.webp (327x96)")
