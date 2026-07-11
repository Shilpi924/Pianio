const fs = require('fs');

const parseNotes = (noteString, defaultHand) => {
  // Format: "C4:1 D4:0.5 E4:0.5" -> { note, duration, finger: 1, hand }
  return noteString.trim().split(/\s+/).map(part => {
    const [note, durationStr] = part.split(':');
    return {
      note: note.replace('s', '#'),
      duration: parseFloat(durationStr || '1'),
      finger: 1,
      hand: defaultHand
    };
  });
};

const odeToJoyFull = parseNotes(`
  E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 E4:1.5 D4:0.5 D4:2
  E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 D4:1.5 C4:0.5 C4:2
  D4:1 D4:1 E4:1 C4:1 D4:1 E4:0.5 F4:0.5 E4:1 C4:1 D4:1 E4:0.5 F4:0.5 E4:1 D4:1 C4:1 D4:1 G3:2
  E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 D4:1.5 C4:0.5 C4:2
`, 'right');

const furEliseFull = parseNotes(`
  E5:0.5 Ds5:0.5 E5:0.5 Ds5:0.5 E5:0.5 B4:0.5 D5:0.5 C5:0.5 A4:1.5
  C4:0.5 E4:0.5 A4:0.5 B4:1.5
  E4:0.5 Gs4:0.5 B4:0.5 C5:1.5
  E4:0.5 E5:0.5 Ds5:0.5 E5:0.5 Ds5:0.5 E5:0.5 B4:0.5 D5:0.5 C5:0.5 A4:1.5
  C4:0.5 E4:0.5 A4:0.5 B4:1.5
  E4:0.5 C5:0.5 B4:0.5 A4:2
`, 'right');

const canonInDFull = parseNotes(`
  D4:2 A3:2 B3:2 Fs3:2 G3:2 D3:2 G3:2 A3:2
  D4:1 Cs4:1 B3:1 A3:1 G3:1 Fs3:1 E3:1 D3:1
  Fs4:1 E4:1 D4:1 Cs4:1 B3:1 A3:1 B3:1 Cs4:1
  D4:0.5 Cs4:0.5 D4:0.5 D3:0.5 Cs3:0.5 B2:0.5 A2:0.5 G2:0.5
`, 'right');

const carolOfTheBells = parseNotes(`
  G4:1 Fs4:0.5 G4:0.5 E4:1
  G4:1 Fs4:0.5 G4:0.5 E4:1
  G4:1 Fs4:0.5 G4:0.5 E4:1
  G4:1 Fs4:0.5 G4:0.5 E4:1
  B4:1 A4:0.5 B4:0.5 G4:1
  B4:1 A4:0.5 B4:0.5 G4:1
  B4:1 A4:0.5 B4:0.5 G4:1
  B4:1 A4:0.5 B4:0.5 G4:1
  D5:0.5 D5:0.5 C5:0.5 B4:0.5 A4:0.5 G4:0.5
  D5:0.5 D5:0.5 C5:0.5 B4:0.5 A4:0.5 G4:0.5
`, 'right');

console.log(JSON.stringify({
  odeToJoyFull,
  furEliseFull,
  canonInDFull,
  carolOfTheBells
}));
