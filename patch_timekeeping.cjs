const fs = require('fs');

// 1. Patch LessonPlayer.tsx
let lpCode = fs.readFileSync('src/components/LessonPlayer.tsx', 'utf8');

// Remove setCurrentTime(0)
lpCode = lpCode.replace(/setCurrentTime\(0\);/g, '// setCurrentTime(0);');

// Update tick function
const tickRegex = /const tick = \(timestamp: number\) => \{[\s\S]*?setCurrentTime\(\(prev\) => prev \+ deltaSeconds\);/;
const newTick = `
    const tick = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }
      const deltaSeconds = Math.min((timestamp - lastFrameTimeRef.current) / 1000, 0.05);
      lastFrameTimeRef.current = timestamp;
      
      setCurrentTime((prev) => {
        let newTime = prev + deltaSeconds;
        if (waitModeEnabled && practiceMode === 'guided') {
          let targetBeat = 0;
          for (let i = 0; i < currentNoteIndex; i++) {
            targetBeat += lesson.notes[i].duration;
          }
          const targetTime = (targetBeat * 60) / tempo;
          if (newTime >= targetTime) {
            newTime = targetTime;
          }
        }
        return newTime;
      });`;
lpCode = lpCode.replace(tickRegex, newTick);

fs.writeFileSync('src/components/LessonPlayer.tsx', lpCode);

// 2. Patch FallingNotes.tsx
let fnCode = fs.readFileSync('src/components/FallingNotes.tsx', 'utf8');
const fnRegex = /let beat = 0;\s*notes\.slice\(currentNoteIndex, currentNoteIndex \+ 12\)\.forEach\(\(n, vi\) => \{/
const newFn = `let beat = 0;
    for (let i = 0; i < currentNoteIndex; i++) {
      beat += notes[i].duration;
    }

    notes.slice(currentNoteIndex, currentNoteIndex + 12).forEach((n, vi) => {`;
fnCode = fnCode.replace(fnRegex, newFn);
fs.writeFileSync('src/components/FallingNotes.tsx', fnCode);

