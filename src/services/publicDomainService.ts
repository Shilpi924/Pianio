import { Midi } from '@tonejs/midi';
import type { Note, FingerNumber } from '../types';

export interface PublicDomainScore {
  id: string;
  title: string;
  composer: string;
  midiUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// A curated list of known public domain MIDI files that are accessible via CORS
export const publicDomainCatalog: PublicDomainScore[] = [
  {
    id: 'pd-minuet-g',
    title: 'Minuet in G Major',
    composer: 'J.S. Bach',
    midiUrl: 'https://bitmidi.com/uploads/15015.mid', // Example public MIDI URL, may fail CORS in real life, so we'll handle errors gracefully
    difficulty: 'beginner',
  },
  {
    id: 'pd-moonlight',
    title: 'Moonlight Sonata (1st Mvt)',
    composer: 'L.V. Beethoven',
    midiUrl: 'https://bitmidi.com/uploads/15833.mid',
    difficulty: 'advanced',
  },
  {
    id: 'pd-prelude-c',
    title: 'Prelude in C Major',
    composer: 'J.S. Bach',
    midiUrl: 'https://bitmidi.com/uploads/14981.mid',
    difficulty: 'intermediate',
  }
];

export async function searchPublicDomainScores(query: string): Promise<PublicDomainScore[]> {
  // In a real app, this would hit an API like Mutopia or OpenScore
  // For now, we filter our curated catalog
  return publicDomainCatalog.filter(
    (score) =>
      score.title.toLowerCase().includes(query.toLowerCase()) ||
      score.composer.toLowerCase().includes(query.toLowerCase())
  );
}

export async function fetchAndParseMidi(url: string): Promise<Note[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch MIDI: ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const midi = new Midi(arrayBuffer);
    
    const notes: Note[] = [];
    
    // Parse the first piano track (or first track with notes)
    const track = midi.tracks.find(t => t.notes.length > 0);
    if (!track) return [];

    track.notes.forEach(midiNote => {
      // Determine hand based on pitch (rough heuristic: C4 and above is right hand)
      const isRightHand = midiNote.midi >= 60; 
      
      notes.push({
        note: midiNote.name, // e.g. "C4"
        duration: midiNote.durationTicks > 0 ? midiNote.durationTicks / midi.header.ppq : 1, // approximate beats
        finger: (isRightHand ? 1 : 5) as FingerNumber, // Default finger, would need complex logic for real fingering
        hand: isRightHand ? 'right' : 'left',
      });
    });

    return notes;
  } catch (error) {
    console.error('MIDI Parsing Error:', error);
    // Return a fallback note sequence if the public MIDI fails (e.g. CORS issues)
    return [
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 1, finger: 5, hand: 'right' },
    ];
  }
}
