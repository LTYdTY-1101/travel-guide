from pathlib import Path
from subprocess import run
from PIL import Image, ImageDraw
import os

root = Path(__file__).resolve().parents[1]
video = root / 'out/china-first-leg-normal.mp4'
ffmpeg_dir = root / 'node_modules/@remotion/compositor-darwin-x64'
ffmpeg = ffmpeg_dir / 'ffmpeg'
times = [0.1, .9, 1.35, 2.2, 3.2, 4.3, 5.4, 6.4, 7.3, 8.0, 9.1, 10.5, 11.3, 12.3, 13.5, 14.6, 15.7, 16.7, 18.0, 20.2]
thumbs = []
env = {**os.environ, 'DYLD_LIBRARY_PATH': str(ffmpeg_dir)}
for index, second in enumerate(times):
    frame = root / f'out/review-{index:02d}.png'
    run([str(ffmpeg), '-loglevel', 'error', '-y', '-ss', str(second), '-i', str(video), '-frames:v', '1', str(frame)], check=True, env=env)
    image = Image.open(frame).convert('RGB').resize((216, 384))
    thumbs.append(image)

sheet = Image.new('RGB', (216 * 5, 414 * 4), '#202328')
draw = ImageDraw.Draw(sheet)
for index, (image, second) in enumerate(zip(thumbs, times)):
    left = index % 5 * 216
    top = index // 5 * 414
    sheet.paste(image, (left, top))
    draw.text((left + 8, top + 388), f'{second:04.1f}s', fill='white')
sheet.save(root / 'out/china-first-leg-sheet.jpg', quality=90)
