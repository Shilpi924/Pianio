import * as Tone from 'tone';

class AudioService {
  private synth: Tone.PolySynth | null = null;
  private initialized: boolean = false;
  private volume: number = 0.7;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    await Tone.start();

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle',
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
    }).toDestination();

    this.setVolume(this.volume);
    this.initialized = true;
  }

  playNote(note: string, duration: string = '8n'): void {
    if (!this.synth || !this.initialized) return;

    this.synth.triggerAttackRelease(note, duration);
  }

  playNotes(notes: string[], duration: string = '8n'): void {
    if (!this.synth || !this.initialized) return;

    this.synth.triggerAttackRelease(notes, duration);
  }

  stopAllNotes(): void {
    if (!this.synth || !this.initialized) return;

    this.synth.releaseAll();
  }

  setVolume(value: number): void {
    this.volume = value;
    if (this.synth) {
      this.synth.volume.value = Tone.gainToDb(value);
    }
  }

  getVolume(): number {
    return this.volume;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  dispose(): void {
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    this.initialized = false;
  }
}

export const audioService = new AudioService();
