import { Midi } from '@tonejs/midi';
import type { Lesson, Note } from '../types';

type ImportedSongFormat = 'musicxml' | 'midi';

function buildLesson(notes: Note[], title: string, tempo: number, format: ImportedSongFormat): Lesson | null {
  if (notes.length === 0) return null;

  const totalBeats = notes.reduce((sum, note) => sum + Math.max(note.duration, 0), 0);
  const averageDensity = notes.length / Math.max(totalBeats, 1);
  const tempoConfidence: NonNullable<Lesson['importMetadata']>['tempoConfidence'] =
    format === 'musicxml' ? 'high' : averageDensity > 3 ? 'medium' : 'low';
  const difficulty: Lesson['difficulty'] =
    notes.length > 160 || averageDensity > 4 ? 'advanced' : notes.length > 70 ? 'intermediate' : 'beginner';

  return {
    id: `user-${format}-${Date.now()}`,
    title,
    tempo,
    difficulty,
    category: 'Imported Song',
    source: 'user-uploaded',
    sourceName: format === 'musicxml' ? 'MusicXML Import' : 'MIDI Import',
    synopsis: `Imported ${format.toUpperCase()} song with ${notes.length} notes.`,
    tags: ['imported', format],
    importMetadata: {
      sourceType: format === 'musicxml' ? 'MusicXML' : 'MIDI',
      tempoConfidence,
      savedToLibrary: true,
      rightsStatus: 'needs-clearance',
      rightsNote: 'Import confirms file format, not publishing rights. Verify license before making public.',
    },
    notes,
  };
}

function inferHand(midiNumber: number): 'left' | 'right' {
  return midiNumber >= 60 ? 'right' : 'left';
}

function inferFinger(midiNumber: number): Note['finger'] {
  return inferHand(midiNumber) === 'right' ? 1 : 5;
}

function parseMusicXmlTempo(xmlDoc: Document): number {
  const soundTempo = xmlDoc.querySelector('sound')?.getAttribute('tempo');
  if (soundTempo) {
    const parsed = Number.parseFloat(soundTempo);
    if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed);
  }

  const metronomePerMinute = xmlDoc.querySelector('direction-type metronome per-minute')?.textContent;
  if (metronomePerMinute) {
    const parsed = Number.parseFloat(metronomePerMinute);
    if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed);
  }

  return 80;
}

function parseMusicXmlTitle(xmlDoc: Document): string {
  return (
    xmlDoc.querySelector('work-title')?.textContent?.trim() ||
    xmlDoc.querySelector('movement-title')?.textContent?.trim() ||
    'Untitled Song'
  );
}

export class SongImportService {
  static validate(content: string, fileName: string): boolean {
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.mid') || lower.endsWith('.midi')) {
      return true;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');
      return !xmlDoc.querySelector('parsererror') && !!(xmlDoc.querySelector('score-partwise') || xmlDoc.querySelector('score-timewise'));
    } catch {
      return false;
    }
  }

  static async parseFile(file: File): Promise<Lesson | null> {
    const lower = file.name.toLowerCase();
    if (lower.endsWith('.mid') || lower.endsWith('.midi')) {
      return this.parseMidi(await file.arrayBuffer(), file.name);
    }

    return this.parseMusicXml(await file.text(), file.name);
  }

  private static parseMidi(content: ArrayBuffer, fileName: string): Lesson | null {
    try {
      const midi = new Midi(new Uint8Array(content));
      const track = midi.tracks.find((candidate) => candidate.notes.length > 0);
      if (!track) return null;

      const notes = track.notes.map((midiNote) => ({
        note: midiNote.name,
        duration: midiNote.durationTicks > 0 ? midiNote.durationTicks / midi.header.ppq : 1,
        finger: inferFinger(midiNote.midi),
        hand: inferHand(midiNote.midi),
      }));

      return buildLesson(notes, midi.name || fileName.replace(/\.(mid|midi)$/i, '') || 'Imported MIDI Song', Math.round(midi.header.tempos[0]?.bpm || 120), 'midi');
    } catch (error) {
      console.error('Failed to parse MIDI import:', error);
      return null;
    }
  }

  private static parseMusicXml(content: string, fileName: string): Lesson | null {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');

      if (xmlDoc.querySelector('parsererror')) return null;
      if (!xmlDoc.querySelector('score-partwise') && !xmlDoc.querySelector('score-timewise')) return null;

      const title = parseMusicXmlTitle(xmlDoc) || fileName.replace(/\.(xml|musicxml)$/i, '') || 'Untitled Song';
      const tempo = parseMusicXmlTempo(xmlDoc);
      const notes: Note[] = [];

      xmlDoc.querySelectorAll('part').forEach((part) => {
        let divisions = 1;

        part.querySelectorAll('measure').forEach((measure) => {
          const measureDivisions = measure.querySelector('attributes > divisions')?.textContent;
          if (measureDivisions) {
            const parsed = Number.parseInt(measureDivisions, 10);
            if (Number.isFinite(parsed) && parsed > 0) {
              divisions = parsed;
            }
          }

          measure.querySelectorAll('note').forEach((noteElement) => {
            if (noteElement.querySelector('rest') || noteElement.querySelector('chord')) return;

            const pitch = noteElement.querySelector('pitch');
            if (!pitch) return;

            const step = pitch.querySelector('step')?.textContent?.trim();
            const octave = Number.parseInt(pitch.querySelector('octave')?.textContent || '4', 10);
            const alter = Number.parseInt(pitch.querySelector('alter')?.textContent || '0', 10);
            if (!step || !Number.isFinite(octave)) return;

            let noteName = step;
            if (alter === 1) noteName += '#';
            else if (alter === -1) noteName += 'b';

            const rawDuration = Number.parseFloat(noteElement.querySelector('duration')?.textContent || '1');
            const duration = Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration / divisions : 1;

            notes.push({
              note: `${noteName}${octave}`,
              duration,
              finger: inferFinger(octave >= 4 ? 60 : 48),
              hand: octave >= 4 ? 'right' : 'left',
            });
          });
        });
      });

      return buildLesson(notes, title, tempo, 'musicxml');
    } catch (error) {
      console.error('Failed to parse MusicXML import:', error);
      return null;
    }
  }
}
