# Harmonium Sample Audio Pipeline

## Goal

Move from oscillator-only playback to real harmonium sample playback without blocking the current MVP.

## Current Behavior

The player now tries sample files first and falls back to oscillator synthesis when files are missing.

Sample lookup path:
- `/audio/harmonium/c4.mp3`
- `/audio/harmonium/c4.wav`
- `/audio/harmonium/c4.ogg`
- repeated for each key id in the keyboard layout

Supported note ids:
- `c4`
- `csharp4`
- `d4`
- `dsharp4`
- `e4`
- `f4`
- `fsharp4`
- `g4`
- `gsharp4`
- `a4`
- `asharp4`
- `b4`
- `c5`

## What To Add Later

Place licensed or self-recorded harmonium files under:
- `public/audio/harmonium/`

Recommended delivery format:
- mono or stereo `.mp3` for smallest footprint
- optional `.wav` master files during editing
- trimmed attack with minimal silence
- normalized levels across all notes

## Implementation Notes

- The player uses playback-rate shifting for octave and transpose changes.
- Once one or more sample files are present, those keys automatically switch to sampled playback.
- Missing notes continue to use oscillator fallback, so rollout can happen incrementally.

## Validation Checklist

- add at least one real sample file
- open `/keyboard`
- trigger the matching note
- confirm the UI badge changes from `Oscillator fallback` to `Sample audio`
- test transpose and octave shifts after the sample loads
