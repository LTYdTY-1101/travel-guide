"""Make a compact visual review sheet from the exported flight clip."""

import os
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
FFMPEG_DIR = ROOT / 'node_modules/@remotion/compositor-darwin-x64'
VIDEO = ROOT / 'out/flight-review-normal.mp4'
OUT = ROOT / 'out/flight-review-contact-sheet.jpg'
TIMES = [0, 0.7, 1.2, 1.5, 2.0, 2.8, 3.7, 4.8, 5.8, 6.8, 7.8, 8.6]

sheet = Image.new('RGB', (4 * 270, 3 * 505), '#ffffff')
draw = ImageDraw.Draw(sheet)
env = dict(os.environ, DYLD_LIBRARY_PATH=str(FFMPEG_DIR))
for index, second in enumerate(TIMES):
    frame = ROOT / f'out/review-frame-{index:02d}.jpg'
    subprocess.run([str(FFMPEG_DIR / 'ffmpeg'), '-loglevel', 'error', '-y',
                    '-ss', str(second), '-i', str(VIDEO), '-frames:v', '1',
                    '-q:v', '3', str(frame)], check=True, env=env)
    with Image.open(frame) as image:
        sheet.paste(image.resize((270, 480)), ((index % 4) * 270, (index // 4) * 505 + 25))
    draw.text(((index % 4) * 270 + 8, (index // 4) * 505 + 5), f'{second:.1f}s', fill='#111111')
sheet.save(OUT, quality=90)
print(OUT)
