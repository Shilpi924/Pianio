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
  private iosUnlocked = false;

  /**
   * True when the context can be expected to make sound.
   *
   * iOS/iPadOS is the reason this is not just `state === 'running'`:
   *  - Safari has an 'interrupted' state (after a call, another app taking
   *    audio, or a screen lock) which is perfectly recoverable.
   *  - resume() frequently resolves *before* the state flips to 'running',
   *    so sampling the state right after awaiting it reports a stale value.
   * Treating anything other than a hard 'suspended' as usable avoids
   * declaring a healthy iPad dead.
   */
  private isContextUsable(): boolean {
    const state = String(Tone.context.state);
    return state !== 'suspended' && state !== 'closed';
  }

  /**
   * Sets up the audio graph and tries to start the context. Safe (and
   * expected) to call on every user gesture.
   *
   * Note: Tone.start() does NOT throw when the browser's autoplay policy
   * blocks audio — it resolves and leaves the context suspended — so the
   * return value reflects context state rather than absence of an exception.
   */
  /**
   * iOS/iPadOS will not let a WebAudio context start from an async
   * continuation, and it stays locked until something is actually rendered
   * through it. Resuming synchronously and pushing one silent buffer inside
   * the gesture is what unlocks it. Cheap and harmless on other platforms.
   */
  private unlockIOS(): void {
    try {
      const raw = Tone.context.rawContext as unknown as AudioContext;
      if (!raw) return;
      // Kick off resume without awaiting — the call itself must happen inside
      // the gesture; awaiting it first is what iOS refuses.
      raw.resume?.();
      if (!this.iosUnlocked) {
        const buffer = raw.createBuffer(1, 1, 22050);
        const source = raw.createBufferSource();
        source.buffer = buffer;
        source.connect(raw.destination);
        source.start(0);
        this.iosUnlocked = true;
      }
    } catch {
      // Non-fatal: this is a best-effort unlock.
    }
  }

  async initialize(): Promise<boolean> {
    // Do this first and synchronously, before any await.
    this.unlockIOS();

    if (this.initialized) {
      if (Tone.context.state !== 'running') {
        try {
          await Tone.start();
          await Tone.context.resume();
        } catch (e) {
          console.warn('Failed to resume audio context:', e);
        }
      }
      return this.isContextUsable();
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

    // Build the audio graph unconditionally, even if the context has not
    // reported 'running' yet. Refusing to build here is what broke iPad:
    // iOS commonly still reads 'suspended'/'interrupted' at this instant, so
    // no instruments were ever created and every later gesture found nothing
    // to play through. With the graph in place, sound simply starts working
    // the moment the context does.
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

    return this.isContextUsable();
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
