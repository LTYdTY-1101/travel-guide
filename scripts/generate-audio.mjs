import fs from 'node:fs';
import path from 'node:path';

const sampleRate = 44100;

const writeWav = (file, samples) => {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) {
    buffer.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(samples[i] * 32767))), 44 + i * 2);
  }
  fs.writeFileSync(file, buffer);
};

const tone = (duration, generator) => {
  const length = Math.floor(duration * sampleRate);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) samples[i] = generator(i / sampleRate, i, length);
  return samples;
};

const output = path.resolve('public/audio');
fs.mkdirSync(output, {recursive: true});

const bgm = tone(72, (t) => {
  const beat = t % 0.5;
  const bar = Math.floor(t / 2);
  const kick = Math.exp(-beat * 18) * Math.sin(2 * Math.PI * (62 - beat * 30) * beat) * 0.34;
  const hatPhase = (t % 0.25);
  const noise = (((Math.sin(t * 9137.3) * 43758.5453) % 1) - 0.5) * Math.exp(-hatPhase * 80) * 0.055;
  const root = [110, 130.81, 146.83, 98][bar % 4];
  const pad = (Math.sin(2 * Math.PI * root * t) + Math.sin(2 * Math.PI * root * 1.5 * t) * 0.45) * 0.045;
  const pulse = Math.sin(2 * Math.PI * root * 2 * t) * (0.03 + 0.02 * Math.sin(2 * Math.PI * 2 * t));
  const intro = Math.min(1, t / 6);
  const outro = Math.min(1, (72 - t) / 3);
  return (kick + noise + pad + pulse) * intro * Math.max(0, outro);
});

const message = tone(0.7, (t) =>
  (Math.sin(2 * Math.PI * 880 * t) * Math.exp(-t * 9) + Math.sin(2 * Math.PI * 1320 * t) * Math.exp(-t * 12) * 0.4) * 0.35,
);

const whoosh = tone(0.9, (t) => {
  const noise = (((Math.sin(t * 14327.7) * 24634.6345) % 1) - 0.5);
  return noise * Math.sin(Math.PI * Math.min(1, t / 0.9)) * 0.28;
});

const pop = tone(0.45, (t) => Math.sin(2 * Math.PI * (120 - t * 80) * t) * Math.exp(-t * 18) * 0.6);
const shutter = tone(0.18, (t) => ((((Math.sin(t * 22711) * 7531) % 1) - 0.5) * Math.exp(-t * 35)) * 0.55);

writeWav(path.join(output, 'bgm-120bpm.wav'), bgm);
writeWav(path.join(output, 'message.wav'), message);
writeWav(path.join(output, 'whoosh.wav'), whoosh);
writeWav(path.join(output, 'pop.wav'), pop);
writeWav(path.join(output, 'shutter.wav'), shutter);

console.log(`Generated audio in ${output}`);
