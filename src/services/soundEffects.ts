import { audioService } from './audioService';

export class SoundEffects {
  private static audioContext: AudioContext | null = null;

  static async init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    await audioService.initialize();
  }

  static playCorrect() {
    this.init();
    // Play a happy ascending arpeggio
    if (this.audioContext) {
      const notes = ['C5', 'E5', 'G5', 'C6'];
      notes.forEach((note, i) => {
        setTimeout(() => {
          audioService.playNote(note, '8n');
        }, i * 100);
      });
    }
  }

  static playIncorrect() {
    this.init();
    // Play a gentle descending tone
    if (this.audioContext) {
      const notes = ['G4', 'E4', 'C4'];
      notes.forEach((note, i) => {
        setTimeout(() => {
          audioService.playNote(note, '8n');
        }, i * 100);
      });
    }
  }

  static playLevelUp() {
    this.init();
    // Play a celebratory fanfare
    if (this.audioContext) {
      const notes = ['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C7'];
      notes.forEach((note, i) => {
        setTimeout(() => {
          audioService.playNote(note, '4n');
        }, i * 150);
      });
    }
  }

  static playAchievement() {
    this.init();
    // Play a sparkle effect
    if (this.audioContext) {
      const notes = ['C6', 'E6', 'G6', 'C7', 'G6', 'E6', 'C6'];
      notes.forEach((note, i) => {
        setTimeout(() => {
          audioService.playNote(note, '8n');
        }, i * 80);
      });
    }
  }

  static playStreak() {
    this.init();
    // Play a building excitement
    if (this.audioContext) {
      const notes = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
      notes.forEach((note, i) => {
        setTimeout(() => {
          audioService.playNote(note, '8n');
        }, i * 60);
      });
    }
  }

  static playCombo(combo: number) {
    this.init();
    // Play increasingly exciting sounds for combos
    if (this.audioContext) {
      const baseNote = combo > 10 ? 'C6' : combo > 5 ? 'G5' : 'C5';
      const notes = [baseNote, baseNote + '5', baseNote + '6'];
      notes.forEach((note, i) => {
        setTimeout(() => {
          audioService.playNote(note, '8n');
        }, i * 50);
      });
    }
  }
}
