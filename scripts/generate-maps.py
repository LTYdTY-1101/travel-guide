"""Generate deterministic maps from AMap, Esri World Street Map and Natural Earth.

Only AMap receives AMAP_KEY. OSM public raster tiles are never downloaded.
The source datasets are retained alongside the maps for attribution and reuse.
"""
import concurrent.futures
import html
import json
import math
import pathlib
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/maps'
DATA = OUT / 'data'
DATA.mkdir(parents=True, exist_ok=True)
WIDTH, HEIGHT = 1080, 1920
VIEWS = {
    'paris': (2.3522, 48.8566, 14),
    'barcelona': (2.1734, 41.3851, 14),
    'rome': (12.4964, 41.9028, 14),
    'vatican': (12.4534, 41.9029, 16),
    'eurasia': (62, 47, 3.1),
    'france-spain': (2.26, 45.2, 6.8),
    'mediterranean': (7.35, 41.9, 6.1),
    'europe': (7.4, 45.4, 5.3),
}
UA = 'EuropeTravelVideo/1.0 (+https://github.com/LTYdTY-1101/travel-guide)'

def request(url, data=None):
    with urlopen(Request(url, data=data, headers={'User-Agent': UA}), timeout=100) as response:
        return response.read()

def world(lon, lat, zoom):
    size = 256 * 2 ** zoom
    lat = max(-85.0511, min(85.0511, lat))
    return ((lon + 180) / 360 * size,
            (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * size)

def project(lon, lat, view):
    cx, cy = world(*view)
    x, y = world(lon, lat, view[2])
    return x - cx + WIDTH / 2, y - cy + HEIGHT / 2

def bounds(view):
    cx, cy = world(*view)
    size = 256 * 2 ** view[2]
    lon = lambda x: x / size * 360 - 180
    lat = lambda y: math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / size))))
    return [lon(cx-WIDTH/2), lat(cy+HEIGHT/2), lon(cx+WIDTH/2), lat(cy-HEIGHT/2)]

def get_city(name):
    target = OUT / f'{name}.jpg'
    viewport_cache = DATA / f'{name}.viewport.json'
    if target.exists() and viewport_cache.exists() and json.loads(viewport_cache.read_text()) == list(VIEWS[name]):
        return name
    params = dict(bbox=','.join(str(n) for n in bounds(VIEWS[name])), bboxSR='4326', imageSR='3857', size='1080,1920', format='jpg', f='image')
    data = request('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/export?' + urlencode(params))
    if not data.startswith(b'\xff\xd8'):
        raise RuntimeError(f'{name}: map service did not return a JPEG')
    target.write_bytes(data)
    viewport_cache.write_text(json.dumps(VIEWS[name]))
    print(f'{name}: downloaded street map ({len(data)} bytes)', flush=True)
    return name

def svg_path(points, view, close=False):
    xy = [project(*point, view) for point in points]
    return 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in xy) + (' Z' if close else '')

def make_map(name, countries):
    view = VIEWS[name]
    pieces = [f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">',
              '<rect width="1080" height="1920" fill="#c8e5ed"/>']
    for feature in countries['features']:
        geometry = feature['geometry']
        polygons = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
        for polygon in polygons:
            path = ' '.join(svg_path(ring, view, True) for ring in polygon)
            pieces.append(f'<path d="{path}" fill="#f3f1e8" stroke="#bdc8b7" stroke-width="2" fill-rule="evenodd"/>')
    labels = [(f['properties']['NAME'], f['properties']['LABEL_X'], f['properties']['LABEL_Y']) for f in countries['features'] if f['properties']['LABELRANK'] <= (3 if view[2] < 4 else 5)]
    for lon in range(-180, 181, 10):
        x, _ = project(lon, view[1], view)
        pieces.append(f'<path d="M{x:.1f},0 V1920" stroke="#82afbc" stroke-opacity=".17"/>')
    for lat in range(-80, 81, 10):
        _, y = project(view[0], lat, view)
        pieces.append(f'<path d="M0,{y:.1f} H1080" stroke="#82afbc" stroke-opacity=".17"/>')
    placed = []
    for label, lon, lat in labels:
        x, y = project(lon, lat, view)
        if 65 < x < 960 and 130 < y < 1780 and all(abs(x-px) > 130 or abs(y-py) > 55 for px, py in placed):
            placed.append((x, y))
            pieces.append(f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#6d7e80" stroke="#fff" stroke-width="4" paint-order="stroke">{html.escape(label)}</text>')
    pieces.append('</svg>')
    (OUT / f'{name}.svg').write_text(''.join(pieces))

def main():
    country_file = DATA / 'ne_50m_admin_0_countries.geojson'
    if not country_file.exists():
        country_file.write_bytes(request('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson'))
    countries = json.loads(country_file.read_text())
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        cities = list(pool.map(get_city, ['paris', 'barcelona', 'rome', 'vatican']))
    for name in VIEWS:
        if name in cities:
            continue
        make_map(name, countries)
        print(f'Generated {name}.svg', flush=True)
        if name in ['eurasia', 'france-spain', 'mediterranean']:
            svg = (OUT / f'{name}.svg').read_text()
            svg = svg.replace('width="1080" height="1920" viewBox="0 0 1080 1920"', 'width="3240" height="3840" viewBox="-1080 -960 3240 3840"', 1)
            svg = svg.replace('<rect width="1080" height="1920"', '<rect x="-1080" y="-960" width="3240" height="3840"', 1)
            (OUT / f'{name}-camera.svg').write_text(svg)
    key = next((line.split('=', 1)[1].strip() for line in (ROOT / '.env.local').read_text().splitlines() if line.startswith('AMAP_KEY=')), '')
    if not key:
        raise RuntimeError('Set AMAP_KEY in .env.local')
    if not (OUT / 'shanghai.png').exists():
        response = request('https://restapi.amap.com/v3/staticmap?' + urlencode(dict(key=key,location='121.4737,31.2304',zoom=11,size='540*960',scale=2)))
        if not response.startswith(b'\x89PNG'):
            raise RuntimeError('AMap did not return a PNG; check Web Service key permissions')
        (OUT / 'shanghai.png').write_bytes(response)
    manifest = {'views': {name: {'center': list(view[:2]), 'zoom': view[2], 'bounds': bounds(view)} for name, view in VIEWS.items()},
                'sources': ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer', 'https://www.naturalearthdata.com/about/terms-of-use/', 'https://lbs.amap.com/api/webservice/guide/api/staticmaps'],
                'naturalEarthLicense': 'Public domain',
                'esriAttribution': 'Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, © OpenStreetMap contributors, and the GIS User Community',
                'shanghai': {'center': [121.4737, 31.2304], 'zoom': 11, 'size': [540, 960], 'scale': 2},
                'note': 'Shanghai: AMap static API. European city streets: Esri World Street Map (see service attribution). Coastlines and regional maps: Natural Earth. No public OSM raster tiles used.'}
    (OUT / 'SOURCES.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
