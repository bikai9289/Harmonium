# 2026-03-29 Harmonium Sample Slice Log

## Source File

- `download/haarmonium-samples/harmonium-samples-all-keys-and-drones.wav`

## Approach

Instead of searching Freesound for each single note, the downloaded multisample WAV was analyzed and sliced directly.

Reason:
- Freesound search for note names like `Harmonium-C4` produced noisy or unrelated results.
- The downloaded source file already contains ascending harmonium notes and drones.
- Auto-analysis showed that segments 25 through 37 map to `C4` through `C5`.

## Output Files

The following files were generated in `public/audio/harmonium/`:
- `c4.wav`
- `csharp4.wav`
- `d4.wav`
- `dsharp4.wav`
- `e4.wav`
- `f4.wav`
- `fsharp4.wav`
- `g4.wav`
- `gsharp4.wav`
- `a4.wav`
- `asharp4.wav`
- `b4.wav`
- `c5.wav`

## Slice Map

- `c4`: 228.52s - 239.47s
- `csharp4`: 239.57s - 249.12s
- `d4`: 249.22s - 259.52s
- `dsharp4`: 259.82s - 270.12s
- `e4`: 270.27s - 279.97s
- `f4`: 280.02s - 291.37s
- `fsharp4`: 291.52s - 301.57s
- `g4`: 301.67s - 311.37s
- `gsharp4`: 311.47s - 318.62s
- `a4`: 318.77s - 328.77s
- `asharp4`: 328.82s - 337.17s
- `b4`: 337.82s - 346.67s
- `c5`: 346.72s - 363.77s

## Notes

- A small pre-roll and release tail were preserved for each exported note.
- Files were saved as WAV because that format is already supported by the current player.
- If needed later, these WAV files can be converted to smaller MP3 web assets.
