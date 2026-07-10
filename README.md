# Piano Mentor

An interactive 88-key piano learning application built with React, TypeScript, and modern web technologies. Designed to help beginners, especially children, learn to play piano using a connected MIDI keyboard or the on-screen virtual piano.

## Features

- **88-Key Virtual Piano** - Realistic full 88-key keyboard with white and black keys
- **MIDI Support** - Automatic detection and connection of MIDI keyboards
- **Lesson Engine** - JSON-based lesson system with note highlighting and tempo control
- **Finger Guidance** - Color-coded finger hints (Thumb=Red, Index=Orange, Middle=Yellow, Ring=Green, Pinky=Blue)
- **Visual Feedback** - Animations for correct (glow) and incorrect (shake) notes
- **Statistics Tracking** - Practice time, accuracy, streak, and completed songs
- **Settings** - Customizable keyboard labels, note names, dark mode, audio volume, and animation speed
- **Beautiful UI** - Modern, kid-friendly design with smooth animations and dark mode support

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Audio**: Tone.js
- **MIDI**: Web MIDI API
- **Testing**: Vitest
- **Linting**: ESLint, Prettier
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Development

The application runs on `http://localhost:5173` during development.

## Project Structure

```
/src
  /components      # Reusable UI components
    PianoKey.tsx
    PianoKeyboard.tsx
    LessonPlayer.tsx
    FingerHint.tsx
    MIDIStatus.tsx
  /pages          # Page components
    HomePage.tsx
    FreePlayPage.tsx
    LessonLibraryPage.tsx
    StatisticsPage.tsx
    SettingsPage.tsx
  /features       # Feature-specific modules
  /hooks          # Custom React hooks
  /lib            # Third-party library configurations
  /services       # Business logic services
    midiService.ts
    audioService.ts
  /store          # State management
    useAppStore.ts
  /types          # TypeScript type definitions
    index.ts
    webmidi.d.ts
  /utils          # Utility functions
    noteUtils.ts
  /data           # Static data
    lessons.ts
  /assets         # Images, fonts, etc.
  /test           # Test setup and utilities
```

## Usage

### Home Screen

Navigate to different features:
- **Continue Lesson** - Resume your last lesson
- **Lesson Library** - Browse and select lessons
- **Practice Mode** - Practice with different modes
- **Free Play** - Play freely on the piano
- **Statistics** - View your progress
- **Settings** - Customize your experience

### Playing Lessons

1. Go to Lesson Library
2. Select a lesson by difficulty or category
3. Click "Start" or "Continue"
4. Follow the finger guidance and note highlighting
5. Play the correct note on your MIDI keyboard or click the virtual piano
6. Adjust tempo using the +/- buttons
7. Track your accuracy in real-time

### Free Play

- Click piano keys to play notes
- Connect a MIDI keyboard for better experience
- Toggle sound on/off
- View MIDI connection status

### Settings

Customize your experience:
- **Display**: Toggle keyboard labels, note names, sharps/flats, dark mode
- **Audio**: Adjust volume
- **Animation**: Control animation speed

## Sample Lessons

The app includes several sample lessons:
- Twinkle Twinkle Little Star (Beginner)
- Mary Had a Little Lamb (Beginner)
- Happy Birthday (Beginner)
- Ode to Joy (Intermediate)

## Future Features

The architecture is designed to support future additions:
- Falling notes visualization
- Sheet music display
- AI-generated lessons
- AI practice feedback
- Voice instructions
- Cloud sync
- Multiple child profiles
- Achievements system
- Multiplayer mode
- Recording and playback
- Chord trainer
- Scales trainer
- Ear training
- Sight reading practice

## License

MIT
