# 2026-03-29 Harmonium MP3 Conversion Log

## Source

Input directory:
- `public/audio/harmonium/`

Tooling used:
- `ffmpeg-static`
- bundled `ffmpeg.exe`
- output bitrate: `128k`

## Result

Generated MP3 files:
- `a4.mp3`
- `asharp4.mp3`
- `b4.mp3`
- `c4.mp3`
- `c5.mp3`
- `csharp4.mp3`
- `d4.mp3`
- `dsharp4.mp3`
- `e4.mp3`
- `f4.mp3`
- `fsharp4.mp3`
- `g4.mp3`
- `gsharp4.mp3`

## Compression Summary

All files were reduced by about `95.8%` compared with the WAV source slices.

Examples:
- `c4.wav`: 4,204,844 bytes -> `c4.mp3`: 176,301 bytes
- `f4.wav`: 4,358,444 bytes -> `f4.mp3`: 182,445 bytes
- `c5.wav`: 6,547,244 bytes -> `c5.mp3`: 273,837 bytes

## Notes

- The player already prefers `.mp3` before `.wav`, so no code change was required.
- WAV files remain in the same folder as higher-quality local masters.
