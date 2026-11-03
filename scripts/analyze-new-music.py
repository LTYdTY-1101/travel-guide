import json
import math
import wave
from pathlib import Path

import numpy as np

WAV = Path('/private/tmp/feel-free-analysis.wav')
OUT = Path(__file__).resolve().parents[1] / 'public/journey/feel-free-beats.json'

with wave.open(str(WAV), 'rb') as stream:
    rate = stream.getframerate()
    channels = stream.getnchannels()
    samples = np.frombuffer(stream.readframes(stream.getnframes()), dtype='<i2').astype(np.float64)
if channels > 1:
    samples = samples.reshape(-1, channels).mean(axis=1)
samples /= 32768.0

window_size = 2048
hop = 512
window = np.hanning(window_size)
frames = 1 + (len(samples) - window_size) // hop
spectra = np.empty((frames, window_size // 2 + 1), dtype=np.float32)
for index in range(frames):
    start = index * hop
    spectra[index] = np.abs(np.fft.rfft(samples[start:start + window_size] * window))
flux = np.maximum(0, np.diff(spectra, axis=0)).sum(axis=1)
flux = np.concatenate([[0], flux])
local = np.convolve(flux, np.ones(max(3, round(rate / hop))) / max(3, round(rate / hop)), mode='same')
onset = np.maximum(0, flux - local * 1.06)
onset /= np.percentile(onset, 99.5) or 1
onset = np.clip(onset, 0, 2.5)

frame_rate = rate / hop
tempo_scores = []
# Treat the quarter-note pulse as 72–130 BPM. Faster transients are retained
# in the onset envelope but are interpreted as subdivisions, not a new tempo.
for lag in range(math.floor(frame_rate * 60 / 130), math.ceil(frame_rate * 60 / 72) + 1):
    bpm = frame_rate * 60 / lag
    score = float(np.dot(onset[lag:], onset[:-lag]) / max(1, len(onset) - lag))
    tempo_scores.append((score, bpm, lag))
tempo_scores.sort(reverse=True)

selected = tempo_scores[:8]

def grid_score(lag: int, phase: int) -> float:
    indexes = np.arange(phase, len(onset), lag)
    return float(onset[indexes].sum())

best = None
for score, bpm, lag in selected[:5]:
    phase_scores = [(grid_score(lag, phase), phase) for phase in range(lag)]
    phase_score, phase = max(phase_scores)
    combined = phase_score * score
    candidate = (combined, bpm, lag, phase, phase_score)
    if best is None or candidate > best:
        best = candidate

_, bpm, lag, phase, _ = best
grid = np.arange(phase, len(onset), lag)
refined = []
radius = max(1, round(lag * 0.18))
for expected in grid:
    left, right = max(0, expected - radius), min(len(onset), expected + radius + 1)
    refined.append(left + int(np.argmax(onset[left:right])))
refined = np.array(refined, dtype=int)
refined = refined[np.concatenate([[True], np.diff(refined) > lag * 0.55])]
beat_times = refined * hop / rate
strengths = onset[refined]

bar_phase = max(range(4), key=lambda offset: float(strengths[offset::4].mean()))
downbeats = beat_times[bar_phase::4]
phrase_phase = max(range(4), key=lambda offset: float(strengths[bar_phase + offset * 4::16].mean()))
phrase_start_index = bar_phase + phrase_phase * 4
phrases = beat_times[phrase_start_index::16]

strong_indices = np.argsort(strengths)[::-1][:48]
strong_accents = sorted(float(beat_times[i]) for i in strong_indices)
duration = len(samples) / rate
payload = {
    'source': 'audio/feel-free-ccmixter.mp3',
    'durationSeconds': duration,
    'analysisSampleRate': rate,
    'bpm': float(60 / np.median(np.diff(beat_times))),
    'beatZeroSeconds': float(beat_times[0]),
    'beats': [round(float(value), 6) for value in beat_times],
    'downbeats': [round(float(value), 6) for value in downbeats],
    'phraseStarts': [round(float(value), 6) for value in phrases],
    'strongAccents': [round(value, 6) for value in strong_accents],
    'tempoCandidates': [{'bpm': round(float(value), 3), 'score': round(float(score), 5)} for score, value, _ in selected],
}
OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({
    'durationSeconds': round(duration, 3),
    'estimatedBpm': round(payload['bpm'], 3),
    'beatZeroSeconds': round(payload['beatZeroSeconds'], 3),
    'tempoCandidates': payload['tempoCandidates'],
    'firstBeats': payload['beats'][:32],
    'phraseStarts': payload['phraseStarts'][:12],
    'strongAccents': payload['strongAccents'][:24],
}, ensure_ascii=False, indent=2))
