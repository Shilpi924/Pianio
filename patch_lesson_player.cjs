const fs = require('fs');
let code = fs.readFileSync('src/components/LessonPlayer.tsx', 'utf8');

// Replace playNote with startNote in handleNotePlayed
code = code.replace(
  /if \(isAudioInitialized\) \{\s*const durationInSeconds[^}]*audioService\.playNote\(playedNote,\s*durationInSeconds\);\s*\}/,
  `if (isAudioInitialized) {
        audioService.startNote(playedNote);
      }`
);

// Add handleNoteReleased
code = code.replace(
  /const handleNotePlayed = useCallback\(/,
  `const handleNoteReleased = useCallback(
    (playedNote: string) => {
      if (isAudioInitialized) {
        audioService.stopNote(playedNote);
      }
    },
    [isAudioInitialized]
  );

  const handleNotePlayed = useCallback(`
);

// Add onNoteOff to PianoKeyboard
code = code.replace(
  /onNoteOn=\{\(note\) => handleNotePlayed\(note\)\}/,
  `onNoteOn={(note) => handleNotePlayed(note)}
          onNoteOff={(note) => handleNoteReleased(note)}`
);

fs.writeFileSync('src/components/LessonPlayer.tsx', code);
