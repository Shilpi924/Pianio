<div align="center">
  
# 🎹 Pianio: The Piano App Kids Want to Open Every Day

**[Try the Live Demo](https://pianio-demo.vercel.app)** (Example link) • **[Watch the Video](https://youtube.com)**

![Pianio Banner](https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=1200&h=400)

*Pianio makes learning piano as fun as playing a game, replacing abstract theory with immediate, magical musical moments.*
</div>

---

## 🌟 Why Kids Love Pianio

Most beginner piano apps quickly become too abstract for kids: too many modes, too many stats, and not enough obvious cause-and-effect. 

Pianio keeps the first loop magical and simple:
1. **Choose a song they know.**
2. **Hear it play.**
3. **Press the glowing key on the screen.**
4. **The app waits patiently until they play the right note.**

No stress, no penalties. Just building confidence, one note at a time.

### ✨ What Makes It Special?

*   **🎮 3D WebGL Falling Notes:** A buttery-smooth, 60fps practice lane. Notes fall like glowing stars (powered by React Three Fiber), making practice visually rewarding.
*   **🏆 Trophy Case Gamification:** Earning badges for "First Song" or "3-Day Streaks" keeps learners coming back.
*   **🧠 Adaptive Teaching:** If they miss a few notes in a row, Pianio kindly steps in: *"This part is tricky! Want to try a slower tempo?"*
*   **🌍 Multi-Language Support:** Play in English, Mandarin, Japanese, German, or Spanish.
*   **🎹 Authentic Sound Engine:** It actually sounds like a piano, complete with room reverb and octave-aware decay, rather than a robotic beep.

---

## 👩‍👦 For Parents

Pianio is built for families, keeping the learning environment safe and transparent.

*   **Parent Dashboard:** Track real progress, practice time, and completed songs in the Progress Center without interrupting the child's play.
*   **Multiple Profiles:** Create unlimited local profiles for everyone in the family. No subscription required.
*   **Curated Content:** Built-in starter songs (like *Ode to Joy* and *Twinkle Twinkle*) with the ability to safely discover and import classical masterpieces.

---

## 🛠 For Developers

While it looks like a playful product, Pianio is an engineering powerhouse under the hood.

### Tech Stack
| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Styling** | Tailwind CSS + Framer Motion |
| **3D Engine** | React Three Fiber + Three.js |
| **Audio** | Tone.js (custom harmonic synth) |
| **State** | Zustand |
| **Internationalization** | i18next |

### Hardware Integration
*   **MIDI Keyboard Support:** Plug in a digital piano via USB; Pianio reads it instantly using the Web MIDI API.
*   **Acoustic Pitch Detection:** No digital piano? Pianio uses your device microphone and an auto-correlate algorithm to hear notes from a real acoustic piano.

### Getting Started

Want to run Pianio locally or contribute?

```bash
# Clone and install dependencies
npm install

# Start the local server
npm run dev
```
The app will run at `http://localhost:5173`.

---

<div align="center">
  <i>Built to turn screen time into music time.</i>
</div>
