import type { Note, Lesson } from '../types';

export class MusicXMLParser {
  static parse(xmlString: string): Lesson | null {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        console.error('XML Parse Error:', parseError.textContent);
        return null;
      }

      // Extract title
      const workTitle = xmlDoc.querySelector('work-title')?.textContent || 
                       xmlDoc.querySelector('movement-title')?.textContent || 
                       'Untitled';
      
      // Extract tempo if available
      const tempo = parseInt(xmlDoc.querySelector('sound tempo')?.getAttribute('tempo') || '80');
      
      // Extract notes
      const notes: Note[] = [];
      const parts = xmlDoc.querySelectorAll('part');
      
      parts.forEach((part) => {
        const measures = part.querySelectorAll('measure');
        measures.forEach((measure) => {
          const noteElements = measure.querySelectorAll('note');
          
          noteElements.forEach((noteElement) => {
            // Skip rest notes
            if (noteElement.querySelector('rest')) return;
            
            // Skip chord notes (only take first note of chord)
            if (noteElement.querySelector('chord')) return;
            
            const pitch = noteElement.querySelector('pitch');
            if (!pitch) return;
            
            const step = pitch.querySelector('step')?.textContent;
            const octave = parseInt(pitch.querySelector('octave')?.textContent || '4');
            const alter = parseInt(pitch.querySelector('alter')?.textContent || '0');
            
            if (!step) return;
            
            // Convert to note name
            let noteName = step;
            if (alter === 1) noteName += '#';
            else if (alter === -1) noteName += 'b';
            
            const fullNote = `${noteName}${octave}`;
            
            // Get duration
            const duration = parseFloat(noteElement.querySelector('duration')?.textContent || '1');
            
            // Default finger and hand (user can edit later)
            const note: Note = {
              note: fullNote,
              duration: duration,
              finger: 1,
              hand: 'right',
            };
            
            notes.push(note);
          });
        });
      });

      if (notes.length === 0) {
        console.error('No notes found in MusicXML');
        return null;
      }

      return {
        id: `user-${Date.now()}`,
        title: workTitle,
        tempo: tempo,
        difficulty: 'beginner',
        category: 'User Uploaded',
        source: 'user-uploaded',
        notes,
      };
    } catch (error) {
      console.error('Error parsing MusicXML:', error);
      return null;
    }
  }

  static validate(xmlString: string): boolean {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) return false;
      
      // Check if it has MusicXML root elements
      const scorePartwise = xmlDoc.querySelector('score-partwise');
      const scoreTimewise = xmlDoc.querySelector('score-timewise');
      
      return !!(scorePartwise || scoreTimewise);
    } catch {
      return false;
    }
  }
}
