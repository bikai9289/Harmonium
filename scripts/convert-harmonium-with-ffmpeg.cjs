const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const inputDir = String.raw`D:\bikai\saas\harmonium\public\audio\harmonium`;
const files = fs.readdirSync(inputDir).filter((name) => name.endsWith('.wav'));
const manifest = [];

for (const file of files) {
  const wavPath = path.join(inputDir, file);
  const mp3Path = wavPath.replace(/\.wav$/i, '.mp3');
  const result = spawnSync(ffmpegPath, [
    '-y',
    '-i', wavPath,
    '-codec:a', 'libmp3lame',
    '-b:a', '128k',
    mp3Path,
  ], { encoding: 'utf8' });

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }

  const wavBytes = fs.statSync(wavPath).size;
  const mp3Bytes = fs.statSync(mp3Path).size;
  manifest.push({
    wav: file,
    mp3: path.basename(mp3Path),
    wavBytes,
    mp3Bytes,
    reductionPct: Number((100 - (mp3Bytes / wavBytes) * 100).toFixed(1)),
  });
}

console.log(JSON.stringify(manifest, null, 2));
