# Pianio

Pianio is a kid-friendly piano learning app built for first wins: pick a familiar song, hear the melody, and press the glowing key. It combines an 88-key virtual piano, guided lessons, MIDI input, falling-note practice, and progress tracking in a React + TypeScript experience designed for children and families.

## Why Pianio

Most beginner piano apps quickly become too abstract for kids: too many modes, too many stats, and not enough obvious cause-and-effect. Pianio keeps the first loop simple.

1. Choose a starter song.
2. Hear what it should sound like.
3. Press the highlighted key.
4. Let the app wait until the right note is played.
5. Build confidence one note at a time.

The interface is tuned for children first, with parent-facing progress and catalog expansion tools kept nearby but quieter.

## Highlights

- **Simple song-first home**: starts with “Hear the song” and “Start lesson,” not a wall of menus.
- **Guided lesson player**: shows the current note, finger, hand, and glowing piano key.
- **Smoother falling notes**: responsive practice lane with animation-frame timing and iPad-friendly sizing.
- **Wait mode**: pauses lesson progress until the learner plays the correct note.
- **88-key virtual piano**: playable on screen with note labels and highlights.
- **MIDI keyboard support**: listens to connected MIDI keyboards through the Web MIDI API.
- **MusicXML import**: turns uploaded MusicXML files into playable lessons.
- **Song discovery path**: searches metadata and public-domain sources while keeping modern-song rights clear.
- **Real progress tracking**: practice time, completed songs, accuracy, and streaks come from app state, not hardcoded numbers.
- **Personalized learning profile**: age group, skill level, goals, favorite genres, and practice rhythm.

## Practice Flow

Pianio is designed around a small, repeatable practice loop.

```text
Home
  -> Pick a starter song
  -> Hear the song
  -> Start lesson
  -> Watch the falling note
  -> Press the glowing key
  -> Advance only after the right note
```

For younger learners, the best default is **Copy me** mode with **Wait for me** enabled. For more confident learners, **Try alone**, **Slow song**, **One hand**, and **Repeat** provide more challenge without changing the lesson structure.

## Song Library

The built-in lesson library includes public-domain and starter songs such as:

- Twinkle Twinkle Little Star
- Mary Had a Little Lamb
- Happy Birthday
- Ode to Joy
- Für Elise

The library is organized by quest-style learning tracks and supports filtering by difficulty, category, and focus.

## Adding More Songs

There are two different problems to solve:

- **Finding songs**: metadata search can help discover artists, titles, trends, and public-domain works.
- **Playing songs**: Pianio needs note-level data, such as MusicXML, MIDI, licensed score data, or authored JSON lessons.

Modern teen/trendy songs are usually copyrighted. Pianio can help discover them, but they should only become playable when you have the right to use the note data.

Current expansion paths:

- **MusicXML upload** for user-owned or legally usable scores.
- **MusicBrainz metadata search** for song, artist, genre, and recording discovery.
- **IMSLP/public-domain search** for classical repertoire.
- **Future MIDI/MusicXML pipeline** for licensed or user-authored song imports.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Zustand**
- **Framer Motion**
- **Tone.js**
- **Lucide React**
- **Vitest**
- **Web MIDI API**

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

## Project Structure

```text
src/
  components/        reusable UI and practice components
  data/              built-in lesson data
  pages/             app screens and flows
  services/          audio, MIDI, catalog, recommendation, import logic
  store/             Zustand app and profile state
  test/              Vitest coverage
  types/             shared TypeScript types
  utils/             note conversion and piano helpers
```

## Key Screens

- **Home**: starter-song selection, preview playback, and simple entry into lessons.
- **Lesson Player**: falling notes, current key guidance, tempo controls, and practice modes.
- **Song Library**: filters, recommendations, source roadmap, and song discovery.
- **Upload Song**: MusicXML import and lesson preview.
- **Progress**: real learner stats and achievements.
- **Settings**: display, sound, personalization, and practice preferences.

## Development Notes

- Browser audio requires a user gesture, so sound is started from learner actions like “Hear song,” “Hear note,” or “Start.”
- Progress should always come from Zustand stores, not hardcoded demo values.
- Trendy/popular song discovery should be separated from playable lesson import because licensing and note-level data are separate concerns.
- The lesson layout should stay usable on an iPad landscape screen without making the learner hunt for controls.

## License

MIT
