const fs = require('fs');
const path = require('path');
const lamejs = require('lamejs');

const inputDir = String.raw`D:\bikai\saas\harmonium\public\audio\harmonium`;
const files = fs.readdirSync(inputDir).filter((name) => name.endsWith('.wav'));

function parseWav(buffer) {
  function readString(offset, len) {
    return buffer.toString('ascii', offset, offset + len);
  }
  function findChunk(id, start = 12) {
    let offset = start;
    while (offset + 8 <= buffer.length) {
      const chunkId = readString(offset, 4);
      const size = buffer.readUInt32LE(offset + 4);
      if (chunkId === id) return { offset, size, dataOffset: offset + 8 };
      offset += 8 + size + (size % 2);
    }
    return null;
  }

  const fmt = findChunk('fmt ');
  const data = findChunk('data');
  if (!fmt || !data) throw new Error('Missing fmt/data chunk');

  const audioFormat = buffer.readUInt16LE(fmt.dataOffset);
  const channels = buffer.readUInt16LE(fmt.dataOffset + 2);
  const sampleRate = buffer.readUInt32LE(fmt.dataOffset + 4);
  const blockAlign = buffer.readUInt16LE(fmt.dataOffset + 12);
  const bitsPerSample = buffer.readUInt16LE(fmt.dataOffset + 14);
  if (audioFormat !== 1 || bitsPerSample !== 16) {
    throw new Error(`Unsupported WAV format: format=${audioFormat}, bits=${bitsPerSample}`);
  }

  const frameCount = Math.floor(data.size / blockAlign);
  const left = new Int16Array(frameCount);
  const right = channels === 2 ? new Int16Array(frameCount) : null;

  for (let i = 0; i < frameCount; i++) {
    const frameOffset = data.dataOffset + i * blockAlign;
    left[i] = buffer.readInt16LE(frameOffset);
    if (channels === 2) {
      right[i] = buffer.readInt16LE(frameOffset + 2);
    }
  }

  return { channels, sampleRate, left, right };
}

function encodeMp3({ channels, sampleRate, left, right }) {
  const bitrate = 128;
  const encoder = new lamejs.Mp3Encoder(channels, sampleRate, bitrate);
  const chunkSize = 1152;
  const mp3Chunks = [];

  for (let i = 0; i < left.length; i += chunkSize) {
    const leftChunk = left.subarray(i, i + chunkSize);
    let mp3buf;
    if (channels === 2 && right) {
      const rightChunk = right.subarray(i, i + chunkSize);
      mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
    } else {
      mp3buf = encoder.encodeBuffer(leftChunk);
    }
    if (mp3buf.length > 0) {
      mp3Chunks.push(Buffer.from(mp3buf));
    }
  }

  const endBuf = encoder.flush();
  if (endBuf.length > 0) {
    mp3Chunks.push(Buffer.from(endBuf));
  }

  return Buffer.concat(mp3Chunks);
}

const manifest = [];
for (const file of files) {
  const wavPath = path.join(inputDir, file);
  const mp3Path = wavPath.replace(/\.wav$/i, '.mp3');
  const wavBuffer = fs.readFileSync(wavPath);
  const wav = parseWav(wavBuffer);
  const mp3 = encodeMp3(wav);
  fs.writeFileSync(mp3Path, mp3);
  manifest.push({
    file,
    mp3: path.basename(mp3Path),
    wavBytes: wavBuffer.length,
    mp3Bytes: mp3.length,
    reductionPct: Number((100 - (mp3.length / wavBuffer.length) * 100).toFixed(1)),
  });
}

console.log(JSON.stringify(manifest, null, 2));
