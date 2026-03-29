const fs = require('fs');
const path = require('path');

const inputPath = String.raw`D:\bikai\saas\harmonium\download\haarmonium-samples\harmonium-samples-all-keys-and-drones.wav`;
const outputDir = String.raw`D:\bikai\saas\harmonium\public\audio\harmonium`;

const segments = [
  { id: 'c4', start: 228.55, end: 239.35 },
  { id: 'csharp4', start: 239.60, end: 249.00 },
  { id: 'd4', start: 249.25, end: 259.40 },
  { id: 'dsharp4', start: 259.85, end: 270.00 },
  { id: 'e4', start: 270.30, end: 279.85 },
  { id: 'f4', start: 280.05, end: 291.25 },
  { id: 'fsharp4', start: 291.55, end: 301.45 },
  { id: 'g4', start: 301.70, end: 311.25 },
  { id: 'gsharp4', start: 311.50, end: 318.50 },
  { id: 'a4', start: 318.80, end: 328.65 },
  { id: 'asharp4', start: 328.85, end: 337.05 },
  { id: 'b4', start: 337.85, end: 346.55 },
  { id: 'c5', start: 346.75, end: 363.65 },
];

const prePad = 0.03;
const postPad = 0.12;

const buf = fs.readFileSync(inputPath);
function readString(offset, len) { return buf.toString('ascii', offset, offset + len); }
function findChunk(id, start = 12) {
  let offset = start;
  while (offset + 8 <= buf.length) {
    const chunkId = readString(offset, 4);
    const size = buf.readUInt32LE(offset + 4);
    if (chunkId === id) return { offset, size, dataOffset: offset + 8 };
    offset += 8 + size + (size % 2);
  }
  return null;
}
const fmt = findChunk('fmt ');
const data = findChunk('data');
if (!fmt || !data) throw new Error('Missing fmt/data chunk');
const channels = buf.readUInt16LE(fmt.dataOffset + 2);
const sampleRate = buf.readUInt32LE(fmt.dataOffset + 4);
const byteRate = buf.readUInt32LE(fmt.dataOffset + 8);
const blockAlign = buf.readUInt16LE(fmt.dataOffset + 12);
const bitsPerSample = buf.readUInt16LE(fmt.dataOffset + 14);
const dataStart = data.dataOffset;
const dataSize = data.size;
const totalDuration = dataSize / byteRate;

fs.mkdirSync(outputDir, { recursive: true });

function buildWav(dataBytes) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0, 4, 'ascii');
  header.writeUInt32LE(36 + dataBytes.length, 4);
  header.write('WAVE', 8, 4, 'ascii');
  header.write('fmt ', 12, 4, 'ascii');
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36, 4, 'ascii');
  header.writeUInt32LE(dataBytes.length, 40);
  return Buffer.concat([header, dataBytes]);
}

const manifest = [];
for (const segment of segments) {
  const start = Math.max(0, segment.start - prePad);
  const end = Math.min(totalDuration, segment.end + postPad);
  const startByte = dataStart + Math.floor(start * byteRate / blockAlign) * blockAlign;
  const endByte = dataStart + Math.floor(end * byteRate / blockAlign) * blockAlign;
  const slice = buf.subarray(startByte, endByte);
  const wav = buildWav(slice);
  const outPath = path.join(outputDir, `${segment.id}.wav`);
  fs.writeFileSync(outPath, wav);
  manifest.push({ id: segment.id, start, end, duration: Number((end - start).toFixed(2)), outPath });
}
console.log(JSON.stringify({ sampleRate, channels, bitsPerSample, manifest }, null, 2));
