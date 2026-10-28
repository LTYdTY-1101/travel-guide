"""Cache aligned Esri World Street Map images for the PVG-to-Paris camera.

Each image uses the same Web Mercator pixel grid at its declared zoom.
The wide atlases are assembled from 1080 x 1920 exports so the moving camera
can cross image boundaries without exposing empty edges.
"""

import gzip
import io
import json
import math
import concurrent.futures
import time
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'maps'
SERVICE_ROOT = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
SERVICE = SERVICE_ROOT + '/export'
USER_AGENT = 'EuropeTravelVideo/1.0 (+https://github.com/LTYdTY-1101/travel-guide)'
WIDTH, HEIGHT = 1080, 1920

VIEWS = {
    'pvg-runway': {'center': [121.805, 31.1434], 'zoom': 15, 'grid': [3, 2]},
    'pvg-district': {'center': [121.805, 31.1434], 'zoom': 12.6, 'grid': [1, 1]},
    'shanghai-region': {'center': [121.64, 31.19], 'zoom': 10.5, 'grid': [1, 1]},
    'china-coast': {'center': [119.0, 32.0], 'zoom': 8.2, 'grid': [3, 2]},
    'east-asia-camera': {'center': [100, 35], 'zoom': 5.8, 'grid': [3, 2]},
    'eurasia-camera-esri': {'center': [62, 47], 'zoom': 3.1, 'grid': [3, 2]},
    'europe-region': {'center': [2.5, 49], 'zoom': 5.8, 'grid': [3, 2]},
    'paris-region': {'center': [2.45, 48.94], 'zoom': 10.5, 'grid': [1, 1]},
    'france-region': {'center': [2.45, 48.94], 'zoom': 8.2, 'grid': [3, 2]},
    'paris-city': {'center': [2.3522, 48.8566], 'zoom': 14, 'grid': [1, 1]},
    'china-overview': {'center': [115.5, 25.0], 'zoom': 5.5, 'grid': [3, 2]},
    'hainan-island': {'center': [110.0, 19.1], 'zoom': 8.5, 'grid': [3, 2]},
    'hainan-route': {'center': [109.86, 18.50], 'zoom': 10.7, 'grid': [3, 2]},
    'sanya-area': {'center': [109.49, 18.26], 'zoom': 13.0, 'grid': [3, 2]},
    'sanya-bay-close': {'center': [109.489, 18.260], 'zoom': 15, 'grid': [2, 2]},
    'wanning-area': {'center': [110.193, 18.735], 'zoom': 13.0, 'grid': [3, 2]},
    'wanning-xinglong-close': {'center': [110.193, 18.735], 'zoom': 15, 'grid': [2, 2]},
    'pvg-district-wide': {'center': [121.805, 31.1434], 'zoom': 12.6, 'grid': [3, 2]},
    'shanghai-region-wide': {'center': [121.64, 31.19], 'zoom': 10.5, 'grid': [3, 2]},
}


def mercator(lon, lat, zoom):
    size = 256 * 2 ** zoom
    lat = max(-85.0511, min(85.0511, lat))
    return ((lon + 180) / 360 * size,
            (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * size)


def unproject(x, y, zoom):
    size = 256 * 2 ** zoom
    return (x / size * 360 - 180,
            math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / size)))))


def export_tile(center, zoom, grid, column, row):
    cx, cy = mercator(*center, zoom)
    atlas_width, atlas_height = grid[0] * WIDTH, grid[1] * HEIGHT
    left = cx - atlas_width / 2 + column * WIDTH
    top = cy - atlas_height / 2 + row * HEIGHT
    # Use one Web Mercator pixel grid for every atlas. Geographic BBOX values
    # caused adjacent Esri exports to resample at different scales.
    resolution = 40075016.68557849 / (256 * 2 ** zoom)
    west = -20037508.342789244 + left * resolution
    east = -20037508.342789244 + (left + WIDTH) * resolution
    north = 20037508.342789244 - top * resolution
    south = 20037508.342789244 - (top + HEIGHT) * resolution
    params = {
        'bbox': f'{west},{south},{east},{north}',
        'bboxSR': '3857',
        'imageSR': '3857',
        'size': f'{WIDTH},{HEIGHT}',
        'format': 'jpg',
        'f': 'image',
    }
    url = SERVICE + '?' + urlencode(params)
    request = Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urlopen(request, timeout=90) as response:
            data = response.read()
    except HTTPError as error:
        body = error.read()
        if body.startswith(b'\x1f\x8b'):
            body = gzip.decompress(body)
        raise RuntimeError(f'Esri HTTP {error.code}: {body[:500]!r}; URL: {url}') from error
    if not data.startswith(b'\xff\xd8'):
        raise RuntimeError(f'Esri did not return a JPEG for {center}, {zoom}, {column}, {row}: {data[:150]!r}')
    with Image.open(io.BytesIO(data)) as image:
        return image.convert('RGB')


def export_cached_tiles(center, zoom, grid):
    """Fetch actual cached JPEG tiles where high zoom image export is unavailable."""
    cx, cy = mercator(*center, zoom)
    atlas_width, atlas_height = grid[0] * WIDTH, grid[1] * HEIGHT
    left, top = round(cx - atlas_width / 2), round(cy - atlas_height / 2)
    columns = range(math.floor(left / 256), math.ceil((left + atlas_width) / 256))
    rows = range(math.floor(top / 256), math.ceil((top + atlas_height) / 256))
    atlas = Image.new('RGB', (atlas_width, atlas_height))
    cache = Path('/private/tmp/travel-flight-map-tiles')
    cache.mkdir(exist_ok=True)

    def fetch(item):
        column, row = item
        url = f'{SERVICE_ROOT}/tile/{zoom}/{row}/{column}'
        target = cache / f'{zoom}-{row}-{column}.jpg'
        if target.exists():
            data = target.read_bytes()
        else:
            for attempt in range(5):
                try:
                    request = Request(url, headers={'User-Agent': USER_AGENT})
                    with urlopen(request, timeout=45) as response:
                        data = response.read()
                    target.write_bytes(data)
                    break
                except Exception:
                    if attempt == 4:
                        raise
                    time.sleep((attempt + 1) * .6)
        with Image.open(io.BytesIO(data)) as image:
            return column, row, image.convert('RGB')

    coordinates = [(column, row) for row in rows for column in columns]
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for index, (column, row, tile) in enumerate(pool.map(fetch, coordinates), 1):
            atlas.paste(tile, (column * 256 - left, row * 256 - top))
            if index % 25 == 0 or index == len(coordinates):
                print(f'Cached tiles: {index}/{len(coordinates)}', flush=True)
    return atlas


def generate(name):
    spec = VIEWS[name]
    grid = spec['grid']
    if spec['zoom'] >= 14:
        atlas = export_cached_tiles(spec['center'], spec['zoom'], grid)
    else:
        atlas = Image.new('RGB', (grid[0] * WIDTH, grid[1] * HEIGHT))
        for row in range(grid[1]):
            for column in range(grid[0]):
                tile = export_tile(spec['center'], spec['zoom'], grid, column, row)
                atlas.paste(tile, (column * WIDTH, row * HEIGHT))
                print(f'{name}: {column + 1}/{grid[0]}, {row + 1}/{grid[1]}', flush=True)
    atlas.save(OUT / f'{name}.jpg', quality=88, subsampling=0, optimize=True)
    if name == 'pvg-runway':
        # Put the eastern north-south runway on the middle of the ticket-to-map frame.
        left = (atlas.width - WIDTH) // 2 + 310
        top = (atlas.height - HEIGHT) // 2
        atlas.crop((left, top, left + WIDTH, top + HEIGHT)).save(OUT / 'pvg-runway-card.jpg', quality=90, subsampling=0, optimize=True)
    print(f'Saved {name}.jpg', flush=True)


if __name__ == '__main__':
    import sys

    names = sys.argv[1:] or list(VIEWS)
    for name in names:
        if name not in VIEWS:
            raise SystemExit(f'Unknown map {name}')
        generate(name)
    (OUT / 'flight-map-views.json').write_text(json.dumps({name: VIEWS[name] for name in VIEWS}, ensure_ascii=False, indent=2))
