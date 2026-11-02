"""Analyze the supplied recording and extend its clean four-bar music phrase.

No time stretch, pitch shift or replacement music. Requires only NumPy.
The PCM extraction is retained beside the audit, not served to the browser.
"""
from pathlib import Path
import json
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / 'previews/six-stop-reference'
with wave.open(str(AUDIT / 'source.wav')) as reader:
    sr = reader.getframerate()
    samples = np.frombuffer(reader.readframes(reader.getnframes()), '<i2').reshape(-1, 2)

data = np.load(AUDIT / 'onsets.npz')
times, flux = data['times'], data['flux']
# Strong recurring attacks measured in the continuous, already-playing section.
# Excludes the screen recorder's silent lead-in, notification and final UI sounds.
start = 13.725351473922903
end = 21.65732426303855
phrase_seconds = end - start
period = phrase_seconds / 16
local_beats = [0.0]
for n in range(1, 16):
    predicted = start + n * period
    candidates = np.flatnonzero(abs(times - predicted) < .035)
    selected = candidates[np.argmax(flux[candidates])]
    local_beats.append(float(times[selected] - start))
local_beats.append(phrase_seconds)

instrumental = AUDIT / 'instrumental.npy'
if not instrumental.exists():
    raise RuntimeError('Run separate-reference-music.py before preparing the final score')
phrase = np.load(instrumental)[round(start * sr):round(end * sr)].astype(np.float64)
# Preserve all music at its original speed. An 8-ms edge taper prevents a PCM
# click at the same musical boundary without shifting the next downbeat.
edge = round(.008 * sr)
phrase[:edge] *= np.linspace(0, 1, edge)[:, None]
phrase[-edge:] *= np.linspace(1, 0, edge)[:, None]
phrase *= .80
cue = np.tile(phrase, (14, 1))
destination = ROOT / 'public/audio/reference/europe-reference-score.wav'
destination.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(destination), 'wb') as writer:
    writer.setnchannels(2)
    writer.setsampwidth(2)
    writer.setframerate(sr)
    writer.writeframes(np.clip(cue * 32767, -32768, 32767).astype('<i2').tobytes())

beats = [float((n // 16) * phrase_seconds + local_beats[n % 16]) for n in range(225)]
grid = dict(sourceFile='ScreenRecording_10-27-2026 11-31-01_1.MP4',
            musicFile='audio/reference/europe-reference-score.wav',
            sourceStart=start, sourceEnd=end, sourcePhraseBeats=16,
            measuredBpm=60 / period, phraseSeconds=phrase_seconds,
            beatSeconds=period, localBeats=local_beats, beats=beats,
            treatment='UVR-MDX-NET-Inst_HQ_3 accompaniment; original-speed stereo phrase; 4 bars x 4 beats; 8-ms edge taper; 14 repeats; no pitch shift',
            excluded='0–13.725 s lead-in / notification / video-player UI; after 21.657 s fireworks / closing UI')
(ROOT / 'public/journey/music-grid.json').write_text(json.dumps(grid, indent=2))
(AUDIT / 'music-analysis.json').write_text(json.dumps(grid, indent=2))
print(json.dumps({k: grid[k] for k in ['measuredBpm', 'sourceStart', 'sourceEnd', 'phraseSeconds']}, indent=2))
print('Final cue seconds:', len(cue) / sr)
