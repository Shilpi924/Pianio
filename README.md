<div align="center">
  
# 🎹 Pianio: The Premium Piano Learning App

**[Try the Live Demo](https://pianio-demo.vercel.app)** 

![Pianio Banner](https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=1200&h=400)

*Pianio makes learning piano interactive, intelligent, and highly accessible across all age groups.*
</div>

---

## 🌟 The Learning Experience

Pianio bridges the gap between professional music theory and accessible, gamified learning. Inspired by industry leaders like Skoove and Flowkey, the app provides a premium interactive experience right in your browser.

### ✨ Core Features
*   **🎼 Professional Sheet Music Rendering:** Powered by VexFlow, Pianio renders real-time, scrolling sheet music for an authentic classical learning experience.
*   **🧠 Adaptive "Smart Tutor" Algorithm:** If a student struggles and misses the same note repeatedly, the Smart Tutor automatically activates. It drops the tempo, isolates the tricky section, and guides the student to play it perfectly 3 times before seamlessly continuing the song.
*   **🎨 Skoove-Inspired UI:** A beautiful, card-based library UI allowing users to easily filter by skill level (Beginner 1, 2, 3) and mood/category (Pop, Classical, Kids, etc.).
*   **🎤 Acoustic Microphone Pitch Detection:** No MIDI keyboard? No problem. Pianio uses an advanced auto-correlation algorithm via the device microphone to hear the notes you play on a real acoustic piano!
*   **🎧 DJ Remix Free Play:** A built-in studio where users can trigger drum beats, backing tracks, and record their own multi-track masterpieces using Tone.js.

---

## 👨‍👩‍👧 Built for Families

*   **Multi-Profile Support:** Switch between unlimited local profiles for everyone in the family.
*   **Google Sign-In:** Seamlessly back up profiles and learning progress using Firebase authentication.
*   **Infinite Library Expandability:** Users can search the **MusicBrainz** database for pop songs, or import raw **Public Domain** scores on the fly to practice.

---

## 🛠 For Developers

Pianio is a robust Progressive Web App (PWA) demonstrating complex browser APIs.

### Tech Stack
| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Framer Motion |
| **Sheet Music** | VexFlow |
| **Audio Engine** | Tone.js (PolySynth & Sampler) |
| **State Management**| Zustand (Persisted) |
| **Database/Auth** | Firebase |

### Hardware & Web APIs
*   **Web MIDI API:** Plug-and-play support for digital pianos via USB.
*   **Web Audio API:** High-fidelity soundfonts, real-time microphone analysis, and dynamic tempo adjustment.
*   **PWA (Offline Ready):** Installable on mobile and desktop. Practice built-in lessons without an internet connection!

### Getting Started

Want to run Pianio locally or contribute?

```bash
# Clone and install dependencies
npm install

# Start the local server
npm run dev
```
The app will run locally at `http://localhost:5173`.

### Testing

Pianio ships with over 90+ unit tests with near-perfect business logic coverage.

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test -- --coverage
```

---

<div align="center">
  <i>Built to turn screen time into music time.</i>
</div>
