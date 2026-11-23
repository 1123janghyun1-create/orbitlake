import os
import zipfile

zip_filename = 'orbitlake-deploy.zip'

if os.path.exists(zip_filename):
    os.remove(zip_filename)

include_root_files = [
    'index.html',
    'package.json',
    'package-lock.json',
    'vercel.json',
    'server.py',
    '.gitignore',
    'README.md',
    'skills-lock.json',
    'supabase_schema.sql'
]

with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # Add root files
    for f in include_root_files:
        if os.path.exists(f):
            zipf.write(f, arcname=f)
            print(f'Added root file: {f}')
    
    # Add dist directory completely
    for root, dirs, files in os.walk('dist'):
        for file in files:
            full_path = os.path.join(root, file)
            arc_name = os.path.relpath(full_path, '.')
            zipf.write(full_path, arcname=arc_name)

print(f'Successfully created {zip_filename} with total size: {os.path.getsize(zip_filename) / (1024*1024):.2f} MB')
