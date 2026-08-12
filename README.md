<div align="center">
  
# 🎹 Pianio: The Premium Piano Learning App

**[Try the Live Demo](https://pianio-demo.vercel.app)** 

![Pianio Banner](https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=1200&h=400)

*Pianio makes learning piano interactive, intelligent, and highly accessible across all age groups.*
</div>

---

## 🌟 The Learning Experience

Pianio bridges the gap between professional music theory and accessible, gamified learning. Inspired by industry leaders like Skoove and Flowkey, the app provides a premium interactive experience across web, mobile, and desktop platforms.

### ✨ Core Features
*   **🎮 Gamified Learning Curriculum:** A structured, level-based path that tracks experience points (XP), unlocking harder songs as students master their skills.
*   **✋ Typing-Style Finger Guide:** Real-time visual hand graphics that illuminate the exact finger needed for upcoming notes, eliminating guesswork and rapidly building muscle memory.
*   **🎼 Professional Sheet Music Rendering:** Powered by VexFlow, Pianio renders real-time, scrolling sheet music for an authentic classical learning experience.
*   **🧠 Adaptive "Smart Tutor" Algorithm:** If a student struggles and misses the same note repeatedly, the Smart Tutor automatically activates. It drops the tempo, isolates the tricky section, and guides the student to play it perfectly 3 times before seamlessly continuing the song.
*   **🎨 Skoove-Inspired UI:** A beautiful, card-based library UI allowing users to easily filter by skill level (Beginner, Intermediate, Advanced) and mood/category.
*   **🎤 Acoustic Microphone Pitch Detection:** No MIDI keyboard? No problem. Pianio uses an advanced auto-correlation algorithm via the device microphone to hear the notes you play on a real acoustic piano!
*   **🎧 DJ Remix Free Play:** A built-in studio where users can trigger drum beats, backing tracks, and record their own multi-track masterpieces using Tone.js.
*   **🤖 AI-Powered Learning Assistant:** Integrated AI chatbot provides personalized guidance, answers music theory questions, and offers practice tips tailored to your progress.
*   **🌐 Multi-Language Support:** Full internationalization support for learners worldwide, with easy language switching.
*   **🥽 Immersive 3D/VR Experience:** Optional 3D piano visualization and VR mode for an immersive learning environment using WebXR.

---

## 👨‍👩‍👧 Built for Families

*   **Multi-Profile Support:** Switch between unlimited local profiles for everyone in the family.
*   **Google Sign-In:** Seamlessly back up profiles and learning progress using Firebase authentication.
*   **Infinite Library Expandability:** Users can search the **MusicBrainz** database for pop songs, or import raw **Public Domain** scores on the fly to practice.

---

## 🛠 For Developers

Pianio is a robust multi-platform application available as a Progressive Web App (PWA), Android mobile app, and Electron desktop application, demonstrating complex browser APIs and cross-platform development.

### Tech Stack
| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Framer Motion |
| **Sheet Music** | VexFlow |
| **Audio Engine** | Tone.js (PolySynth & Sampler) |
| **State Management**| Zustand (Persisted) |
| **Database/Auth** | Firebase |
| **3D/VR Graphics** | React Three Fiber + Three.js + React Three XR |
| **AI Integration** | Anthropic AI SDK |
| **Internationalization** | i18next + react-i18next |
| **Analytics** | Vercel Analytics |
| **Mobile Platform** | Capacitor (Android) |
| **Desktop Platform** | Electron |

### Hardware & Web APIs
*   **Web MIDI API:** Plug-and-play support for digital pianos via USB.
*   **Web Audio API:** High-fidelity soundfonts, real-time microphone analysis, and dynamic tempo adjustment.
*   **PWA (Offline Ready):** Installable on mobile and desktop. Practice built-in lessons without an internet connection!
*   **WebXR API:** VR/AR support for immersive piano learning experiences.

### Getting Started

Want to run Pianio locally or contribute?

```bash
# Clone and install dependencies
npm install

# Start the local web server
npm run dev
```
The app will run locally at `http://localhost:5173`.

### Platform-Specific Builds

**Android (via Capacitor):**
```bash
# Sync Capacitor with Android project
npm run android:sync

# Open Android Studio
npm run android:open

# Build debug APK
npm run android:build

# Build release APK for Play Store
npm run android:release
```

**Desktop (via Electron):**
```bash
# Build for desktop
npm run build
```

**Web Production Build:**
```bash
# Build for web deployment
npm run build

# Preview production build
npm run preview
```

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
