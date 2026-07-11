const fs = require('fs');
const lessonsPath = 'src/data/lessons.ts';
let code = fs.readFileSync(lessonsPath, 'utf8');
const notes = JSON.parse(fs.readFileSync('output.json', 'utf8'));

// Format note array nicely
function formatNotes(noteArray) {
  return '[\n      ' + noteArray.map(n => `{ note: '${n.note}', duration: ${n.duration}, finger: ${n.finger}, hand: '${n.hand}' }`).join(',\n      ') + ',\n    ]';
}

code = code.replace(
  /(id:\s*'ode-to-joy'[\s\S]*?notes:\s*)\[[\s\S]*?\],\n\s*\},/g,
  `$1${formatNotes(notes.odeToJoyFull)},\n  },`
);

code = code.replace(
  /(id:\s*'fur-elise'[\s\S]*?notes:\s*)\[[\s\S]*?\],\n\s*\},/g,
  `$1${formatNotes(notes.furEliseFull)},\n  },`
);

code = code.replace(
  /(id:\s*'canon-in-d'[\s\S]*?notes:\s*)\[[\s\S]*?\],\n\s*\},/g,
  `$1${formatNotes(notes.canonInDFull)},\n  },`
);

// Add carol-of-the-bells at the end of the array
const newLesson = `  {
    id: 'carol-of-the-bells',
    title: 'Carol of the Bells',
    tempo: 120,
    difficulty: 'beginner',
    category: 'Holiday',
    source: 'public-domain',
    notes: ${formatNotes(notes.carolOfTheBells)},
  },
];`;

code = code.replace(/];[\s\n]*$/, newLesson + '\n');

fs.writeFileSync(lessonsPath, code);
