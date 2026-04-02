# Harmonium Product Backlog

This backlog turns the current gap analysis into implementation slices that can ship in order without losing the SEO-first product direction.

## P0: Core Playability

- [x] Expand the visible keyboard from the short single-octave MVP to the original-style multi-key desktop mapping.
  Acceptance criteria:
  - homepage and `/keyboard` both expose the wider key range
  - desktop keyboard mapping covers the same visible keys
  - newly added notes still use the current sample bank when possible
- [x] Improve sustained harmonium feel.
  Acceptance criteria:
  - long presses sound stable instead of decaying like a short sample trigger
  - release remains soft enough to avoid clicks
  - sample playback stays the default path when sample files exist
- [x] Add a compact desktop shortcut help state.
  Acceptance criteria:
  - users can quickly understand the extended mapping without reading code
  - help works on homepage and `/keyboard`

## P1: Instrument Controls

- [x] Add reverb toggle with at least one conservative preset.
  Acceptance criteria:
  - effect can be enabled and disabled without audio glitches
  - state persists locally
- [x] Add reed layering or a simple double-reed mode.
  Acceptance criteria:
  - secondary layer is optional
  - stacked mode noticeably enriches tone without clipping
- [x] Broaden octave control once the wider board ships cleanly.
  Acceptance criteria:
  - users can move across lower and upper practice ranges
  - labels and control copy stay understandable

## P2: Advanced Input

- [x] Add Web MIDI device detection and note input.
  Acceptance criteria:
  - supported browsers can connect a MIDI keyboard
  - note on/off works for the selected device
  - unsupported browsers fail gracefully
- [x] Add basic MIDI control handling for volume or sustain-related controls.
  Acceptance criteria:
  - sustain pedal input works for the selected MIDI device
  - control changes do not break normal pointer or QWERTY input

## P3: Practice Features

- [x] Add session notes or notation capture for repeated practice.
  Acceptance criteria:
  - users can record a simple note sequence during a session
  - clear reset flow is available
- [x] Add focused practice presets.
  Acceptance criteria:
  - preset state loads quickly
  - presets are compatible with the wider keyboard

## P4: Packaging and Retention

- [ ] Revisit PWA or offline support after the instrument feels complete.
  Acceptance criteria:
  - cached assets do not break audio upgrades
  - offline behavior is explicit and testable
- [ ] Add analytics events for actual instrument usage.
  Acceptance criteria:
  - start play, key press, and sustained session events are captured
  - reports can separate traffic from real practice behavior
