# Pianio

Pianio is a kid-friendly piano learning app built for first wins: pick a familiar song, hear the melody, and press the glowing key. It combines an 88-key virtual piano, guided lessons, MIDI input, a **3D WebGL falling-note practice lane**, and progress tracking in a React + TypeScript experience designed for children and families.

## Why Pianio

Most beginner piano apps quickly become too abstract for kids: too many modes, too many stats, and not enough obvious cause-and-effect. Pianio keeps the first loop simple.

1. Choose a starter song.
2. Hear what it should sound like.
3. Press the highlighted key.
4. Let the app wait until the right note is played.
5. Build confidence one note at a time.

The interface is tuned for children first, with parent-facing progress and catalog expansion tools kept nearby but quieter.

---

## What's New — v2.0

### 🎮 3D WebGL Falling Notes (React Three Fiber)
The falling-notes practice lane is now powered by **React Three Fiber + Three.js**, rendering all notes on the GPU via WebGL. This delivers buttery-smooth 60fps animations even during dense chord passages. Notes are rendered as glowing 3D boxes with emissive materials. A post-processing **Bloom** glow effect (via `@react-three/postprocessing`) makes correctly-timed notes pop with light.

> Toggle `3D High Performance Graphics (Bloom)` in Settings to disable the Bloom effect on older iPads.

### 🎹 Piano-Modelled Audio Engine
The audio engine has been completely replaced. Instead of a flat triangle wave that made all notes sound the same, the new engine uses:
- **Custom harmonic partials** (overtone series: 1st, 3rd, 5th, 7th) to create a warm, piano-like timbre.
- **Octave-aware decay** — high notes fade quickly like a real piano string; bass notes ring longer.
- **Room reverb** (Tone.js `Reverb`) to add acoustic depth and make the instrument feel alive.

### 🗂 Renamed Song Discovery Sources
- **Discover Songs (MusicBrainz)** — search any artist or song to discover metadata, then import by ID.
- **Classical Masterpieces (IMSLP)** — browse public-domain sheet music and import via the Upload tab.

---

## Highlights

- **Simple song-first home**: starts with "Hear the song" and "Start lesson," not a wall of menus.
- **Guided lesson player**: shows the current note, finger, hand, and glowing piano key.
- **3D falling-note lane**: GPU-rendered, 60fps WebGL practice lane with note glow and bloom effects.
- **Piano-modelled sound**: harmonic synth with octave-aware decay and room reverb.
- **Wait mode**: pauses lesson progress until the learner plays the correct note.
- **88-key virtual piano**: playable on screen with note labels and highlights.
- **MIDI keyboard support**: listens to connected MIDI keyboards through the Web MIDI API.
- **Microphone pitch detection**: auto-correlate algorithm to detect notes from a real acoustic piano.
- **MusicXML import**: turns uploaded MusicXML files into playable lessons.
- **Song discovery path**: searches metadata and public-domain sources while keeping modern-song rights clear.
- **Real progress tracking**: practice time, completed songs, accuracy, and streaks.
- **Multi-user profiles**: switch between family member profiles locally — no subscription needed.
- **Personalized learning profile**: age group, skill level, goals, favorite genres, and practice rhythm.

---

## Practice Flow

Pianio is designed around a small, repeatable practice loop.

```text
Home
  -> Pick a starter song
  -> Hear the song
  -> Start lesson
  -> Watch the 3D falling note (WebGL)
  -> Press the glowing key
  -> Advance only after the right note
```

For younger learners, the best default is **Copy me** mode with **Wait for me** enabled. For more confident learners, **Try alone**, **Slow song**, **One hand**, and **Repeat** provide more challenge without changing the lesson structure.

---

## Song Library

The built-in lesson library includes public-domain and starter songs such as:

- Twinkle Twinkle Little Star
- Mary Had a Little Lamb
- Happy Birthday
- Ode to Joy
- Für Elise
- Canon in D

The library is organized by quest-style learning tracks and supports filtering by difficulty, category, and focus.

## Adding More Songs

There are two different problems to solve:

- **Finding songs**: use **Discover Songs (MusicBrainz)** to search for any artist, title, or genre. Copy the MBID and paste into the Pianio importer.
- **Playing classical pieces**: browse **Classical Masterpieces (IMSLP)** for free public-domain scores. Download a MusicXML file and import it in the Upload tab.

Modern teen/trendy songs are usually copyrighted. Pianio can help discover them, but they should only become playable when you have the right to use the note data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + Framer Motion |
| 3D Engine | React Three Fiber + Three.js + `@react-three/drei` |
| Post-Processing | `@react-three/postprocessing` (Bloom) |
| Audio | Tone.js (custom harmonic synth + reverb) |
| State | Zustand (persisted) |
| Icons | Lucide React |
| Testing | Vitest |
| MIDI | Web MIDI API |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

---

## Project Structure

```text
src/
  components/
    3d/              React Three Fiber 3D scene components
      PianoScene3D.tsx   Main WebGL canvas with camera + lighting + bloom
      Note3D.tsx         Falling note mesh with emissive glow material
      Keyboard3D.tsx     3D keyboard that highlights on key press
      HitZone3D.tsx      Glowing hit-target line
    FallingNotes.tsx   Bridges lesson logic → 3D world space
    LessonPlayer.tsx   Full lesson experience
    PianoKeyboard.tsx  2D touch keyboard for iPad
  data/              Built-in lesson JSON
  pages/             App screens and flows
  services/
    audioService.ts          Piano-modelled harmonic synth
    pitchDetectionService.ts Auto-correlate microphone pitch detection
    musicCatalogService.ts   Built-in + external catalog sources
    recommendationService.ts Personalized lesson ranking
  store/             Zustand app and profile state
  __tests__/         Vitest unit tests
  types/             Shared TypeScript types
  utils/             Note conversion and piano helpers
```

---

## Key Screens

- **Home**: starter-song selection, preview playback, and simple entry into lessons.
- **Lesson Player**: 3D falling notes, current key guidance, tempo controls, and practice modes.
- **Song Library**: filters, recommendations, external source guide, and song discovery.
- **Upload Song**: MusicXML import and lesson preview.
- **Progress**: real learner stats and achievements.
- **Settings**: display, sound, 3D graphics toggle, personalization, and practice preferences.

---

## Development Notes

- Browser audio requires a user gesture, so sound is started from learner actions like "Hear song," "Hear note," or "Start."
- Progress always comes from Zustand stores, not hardcoded demo values.
- The 3D scene uses a top-down angled camera (Synthesia-style) with ambient + directional lighting and a city environment preset for reflections.
- Trendy/popular song discovery should be separated from playable lesson import because licensing and note-level data are separate concerns.
- The lesson layout should stay usable on an iPad landscape screen without making the learner hunt for controls.
- Disable Bloom (`highPerformanceGraphics: false` in settings) on older devices for smooth 60fps.

---

## License

MIT
