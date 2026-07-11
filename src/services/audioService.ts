import * as Tone from 'tone';

// ---------------------------------------------------------------------------
// Salamander Grand Piano — open-licensed samples (CC BY 3.0)
// Source: https://gleitz.github.io/midi-js-soundfonts/
// Tone.Sampler automatically pitch-shifts neighbouring samples to fill gaps.
// ---------------------------------------------------------------------------
const SAMPLE_BASE = 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_grand_piano-mp3/';

const SAMPLE_URLS: Record<string, string> = {
  A0:  `${SAMPLE_BASE}A0.mp3`,
  C1:  `${SAMPLE_BASE}C1.mp3`,
  'D#1': `${SAMPLE_BASE}Ds1.mp3`,
  'F#1': `${SAMPLE_BASE}Fs1.mp3`,
  A1:  `${SAMPLE_BASE}A1.mp3`,
  C2:  `${SAMPLE_BASE}C2.mp3`,
  'D#2': `${SAMPLE_BASE}Ds2.mp3`,
  'F#2': `${SAMPLE_BASE}Fs2.mp3`,
  A2:  `${SAMPLE_BASE}A2.mp3`,
  C3:  `${SAMPLE_BASE}C3.mp3`,
  'D#3': `${SAMPLE_BASE}Ds3.mp3`,
  'F#3': `${SAMPLE_BASE}Fs3.mp3`,
  A3:  `${SAMPLE_BASE}A3.mp3`,
  C4:  `${SAMPLE_BASE}C4.mp3`,
  'D#4': `${SAMPLE_BASE}Ds4.mp3`,
  'F#4': `${SAMPLE_BASE}Fs4.mp3`,
  A4:  `${SAMPLE_BASE}A4.mp3`,
  C5:  `${SAMPLE_BASE}C5.mp3`,
  'D#5': `${SAMPLE_BASE}Ds5.mp3`,
  'F#5': `${SAMPLE_BASE}Fs5.mp3`,
  A5:  `${SAMPLE_BASE}A5.mp3`,
  C6:  `${SAMPLE_BASE}C6.mp3`,
  'D#6': `${SAMPLE_BASE}Ds6.mp3`,
  'F#6': `${SAMPLE_BASE}Fs6.mp3`,
  A6:  `${SAMPLE_BASE}A6.mp3`,
  C7:  `${SAMPLE_BASE}C7.mp3`,
  'D#7': `${SAMPLE_BASE}Ds7.mp3`,
  'F#7': `${SAMPLE_BASE}Fs7.mp3`,
  A7:  `${SAMPLE_BASE}A7.mp3`,
  C8:  `${SAMPLE_BASE}C8.mp3`,
};

class AudioService {
  private sampler: Tone.Sampler | null = null;
  private reverb: Tone.Reverb | null = null;
  private initialized: boolean = false;
  private samplesLoaded: boolean = false;
  private volume: number = 0.7;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    await Tone.start();

    // Subtle room reverb — makes the piano sound like it's in a room
    this.reverb = new Tone.Reverb({ decay: 1.8, wet: 0.2 }).toDestination();

    // Load real grand piano samples. Sampler pitch-shifts between anchor notes
    // so every key sounds like the actual recorded instrument.
    return new Promise<void>((resolve) => {
      this.sampler = new Tone.Sampler({
        urls: SAMPLE_URLS,
        onload: () => {
          this.samplesLoaded = true;
          this.initialized = true;
          resolve();
        },
        onerror: (err) => {
          console.warn('Piano samples failed to load, falling back to synth:', err);
          // Fallback: build a decent FM synth if samples fail
          this.sampler = null;
          this._buildFallbackSynth();
          this.initialized = true;
          resolve();
        },
      }).connect(this.reverb!);

      this.setVolume(this.volume);
    });
  }

  /** Fallback synth used when samples can't load (e.g. offline) */
  private _buildFallbackSynth() {
    const synth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3.01,
      modulationIndex: 14,
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.3, sustain: 0.1, release: 1.2 },
      modulation: { type: 'square' },
      modulationEnvelope: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.2 },
    });
    // Wrap in the same interface
    (this as any).sampler = synth;
  }

  playNote(note: string, duration: string = '8n'): void {
    if (!this.initialized) return;
    try {
      this.sampler?.triggerAttackRelease(note, duration);
    } catch {
      // Sampler may not have that exact note — silent fail
    }
  }

  playNotes(notes: string[], duration: string = '8n'): void {
    if (!this.initialized) return;
    try {
      this.sampler?.triggerAttackRelease(notes, duration);
    } catch {
      // silent fail
    }
  }

  stopAllNotes(): void {
    if (!this.initialized) return;
    this.sampler?.releaseAll();
  }

  setVolume(value: number): void {
    this.volume = value;
    if (this.sampler) {
      this.sampler.volume.value = Tone.gainToDb(value);
    }
  }

  getVolume(): number {
    return this.volume;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  isSamplesLoaded(): boolean {
    return this.samplesLoaded;
  }

  dispose(): void {
    this.sampler?.dispose();
    this.reverb?.dispose();
    this.sampler = null;
    this.reverb = null;
    this.initialized = false;
    this.samplesLoaded = false;
  }
}

export const audioService = new AudioService();
