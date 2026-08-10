import * as Tone from 'tone';

// ---------------------------------------------------------------------------
// Salamander Grand Piano samples (CC BY 3.0 — Alexander Holm)
// Hosted publicly at gleitz.github.io/midi-js-soundfonts
// ---------------------------------------------------------------------------
const SAMPLE_BASE = 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_grand_piano-mp3/';

const SAMPLE_URLS: Record<string, string> = {
  C2: 'C2', C3: 'C3', C4: 'C4', C5: 'C5', C6: 'C6'
};


const urls: Record<string, string> = {};
Object.keys(SAMPLE_URLS).forEach(k => {
  urls[k] = `${SAMPLE_BASE}${k}.mp3`;
});

class AudioService {
  private sampler: Tone.Sampler | null = null;
  private fallbackSynth: Tone.PolySynth | null = null;
  private reverb: Tone.Reverb | null = null;
  private initialized = false;
  private samplesLoaded = false;
  private volume = 0.7;

  /**
   * Returns true only when the AudioContext is actually running and able to
   * make sound. Safe (and expected) to call on every user gesture.
   *
   * Important: Tone.start() does NOT throw when the browser's autoplay policy
   * blocks audio — it resolves normally and leaves the context "suspended".
   * So success has to be judged by the context state, never by the absence of
   * an exception, or the app happily believes audio is live while every note
   * goes into a dead context.
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) {
      if (Tone.context.state !== 'running') {
        try {
          await Tone.start();
          await Tone.context.resume();
        } catch (e) {
          console.warn('Failed to resume audio context:', e);
        }
      }
      return Tone.context.state === 'running';
    }

    // MUST call Tone.start() inside a user-gesture handler
    try {
      await Tone.start();
      // Ensure audio context is running (critical for iOS/iPad)
      if (Tone.context.state !== 'running') {
        await Tone.context.resume();
      }
    } catch (e) {
      console.warn('Failed to start Tone.js:', e);
    }

    if (Tone.context.state !== 'running') {
      // Autoplay policy blocked us (no user gesture yet). Stay uninitialized
      // so the next real tap retries, instead of leaving audio permanently
      // dead for the rest of the session.
      return false;
    }

    this.reverb = new Tone.Reverb({ decay: 1.5, wet: 0.2 }).toDestination();

    // Start the fallback synth immediately so first keypress is never silent
    this.fallbackSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.006, decay: 0.5, sustain: 0.1, release: 1.0 },
    }).connect(this.reverb);

    this.initialized = true;
    this._setVolumeOnInstrument(this.fallbackSynth);

    // Then load real samples in background — swap when ready
    this.sampler = new Tone.Sampler({
      urls,
      onload: () => {
        this.samplesLoaded = true;
        // Disconnect fallback once real samples are ready
        this.fallbackSynth?.disconnect();
        this.sampler!.connect(this.reverb!);
        this._setVolumeOnInstrument(this.sampler!);
        console.log('🎹 Real piano samples loaded!');
      },
      onerror: (err) => {
        console.warn('Piano samples failed, using synth fallback:', err);
        this.samplesLoaded = false;
      },
    });

    return true;
  }

  private _setVolumeOnInstrument(inst: Tone.PolySynth | Tone.Sampler) {
    inst.volume.value = Tone.gainToDb(this.volume);
  }

  private get _instrument(): Tone.PolySynth | Tone.Sampler | null {
    // Use real samples if loaded, otherwise fallback synth
    if (this.samplesLoaded && this.sampler) return this.sampler;
    return this.fallbackSynth;
  }

  playNote(note: string, duration: string | number = '8n'): void {
    if (!this.initialized) return;
    try {
      this._instrument?.triggerAttackRelease(note, duration);
    } catch {
      // note may be out of sampler range — silent
    }
  }

  startNote(note: string): void {
    if (!this.initialized) return;
    try {
      this._instrument?.triggerAttack(note);
    } catch {}
  }

  stopNote(note: string): void {
    if (!this.initialized) return;
    try {
      this._instrument?.triggerRelease(note);
    } catch {}
  }

  playNotes(notes: string[], duration: string = '8n'): void {
    if (!this.initialized) return;
    try {
      this._instrument?.triggerAttackRelease(notes, duration);
    } catch { /* silent */ }
  }

  stopAllNotes(): void {
    if (!this.initialized) return;
    this.fallbackSynth?.releaseAll();
    this.sampler?.releaseAll();
  }

  setVolume(value: number): void {
    this.volume = value;
    if (this.fallbackSynth) this._setVolumeOnInstrument(this.fallbackSynth);
    if (this.samplesLoaded && this.sampler) this._setVolumeOnInstrument(this.sampler);
  }

  getVolume(): number { return this.volume; }
  isInitialized(): boolean { return this.initialized; }
  isSamplesLoaded(): boolean { return this.samplesLoaded; }

  dispose(): void {
    this.sampler?.dispose();
    this.fallbackSynth?.dispose();
    this.reverb?.dispose();
    this.sampler = null;
    this.fallbackSynth = null;
    this.reverb = null;
    this.initialized = false;
    this.samplesLoaded = false;
  }
}

export const audioService = new AudioService();
