import * as Tone from 'tone';

// A piano-like synth using FM synthesis layered with a pluck envelope.
// Each octave gets progressively brighter and shorter decay — just like a real piano.
function buildPianoSynth(): Tone.PolySynth {
  return new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      // Sine base + 3rd harmonic partial gives a warm, piano-like tone
      type: 'custom',
      partials: [1, 0, 0.4, 0, 0.1, 0, 0.05],
    },
    envelope: {
      attack: 0.005,    // Very fast attack — like a hammer strike
      decay: 0.8,       // Noticeable string decay
      sustain: 0.15,    // Low sustain (piano strings don't "hold" like organ pipes)
      release: 1.2,     // Natural ring-off
    },
  });
}

class AudioService {
  private synth: Tone.PolySynth | null = null;
  private reverb: Tone.Reverb | null = null;
  private initialized: boolean = false;
  private volume: number = 0.7;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    await Tone.start();

    // Build reverb (acoustic room effect — makes it sound like a real instrument)
    this.reverb = new Tone.Reverb({
      decay: 1.5,
      wet: 0.25,
    }).toDestination();

    // Build the piano-like polyphonic synth and route through reverb
    this.synth = buildPianoSynth();
    this.synth.connect(this.reverb);

    this.setVolume(this.volume);
    this.initialized = true;
  }

  playNote(note: string, duration: string = '8n'): void {
    if (!this.synth || !this.initialized) return;

    // Scale decay based on octave: higher octaves decay faster (like a real piano)
    const octave = parseInt(note.slice(-1), 10);
    if (!isNaN(octave)) {
      // Octave 2-3: slow decay, 6-7: fast bright decay
      const decayTime = Math.max(0.2, 1.2 - (octave - 2) * 0.15);
      this.synth.set({ envelope: { decay: decayTime } });
    }

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
    if (this.reverb) {
      this.reverb.dispose();
      this.reverb = null;
    }
    this.initialized = false;
  }
}

export const audioService = new AudioService();
