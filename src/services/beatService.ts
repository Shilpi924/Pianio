import * as Tone from 'tone';

export type BeatType = 'hiphop' | 'dance' | 'rock' | 'ambient' | 'none';

export type DrumStyle = Exclude<BeatType, 'none'>;

export interface BackingTrackConfig {
  tempo: number;
  drums: DrumStyle;
  /** One chord (as an array of note names) per bar. The loop is chords.length bars long. */
  chords: string[][];
}

/** One bar of drum hits per style, as [beat, sixteenth, instrument]. */
const DRUM_PATTERNS: Record<DrumStyle, Array<[number, number, 'kick' | 'snare' | 'hihat']>> = {
  dance: [
    [0, 0, 'kick'], [0, 2, 'hihat'],
    [1, 0, 'kick'], [1, 2, 'hihat'],
    [2, 0, 'kick'], [2, 2, 'hihat'],
    [3, 0, 'kick'], [3, 2, 'hihat'],
  ],
  hiphop: [
    [0, 0, 'kick'], [0, 2, 'hihat'],
    [1, 0, 'snare'], [1, 2, 'hihat'], [1, 3, 'kick'],
    [2, 0, 'kick'], [2, 2, 'hihat'],
    [3, 0, 'snare'], [3, 2, 'hihat'],
  ],
  rock: [
    [0, 0, 'kick'], [0, 2, 'kick'],
    [1, 0, 'snare'], [1, 2, 'hihat'],
    [2, 0, 'kick'], [2, 2, 'hihat'],
    [3, 0, 'snare'], [3, 2, 'hihat'],
  ],
  ambient: [
    [0, 0, 'kick'],
    [2, 0, 'kick'],
  ],
};

class BeatService {
  private kick: Tone.MembraneSynth | null = null;
  private snare: Tone.NoiseSynth | null = null;
  private hihat: Tone.MetalSynth | null = null;
  private synth: Tone.PolySynth | null = null;
  private masterVolume: Tone.Volume | null = null;
  
  private currentPart: Tone.Part | null = null;
  private currentBeatType: BeatType = 'none';
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await Tone.start();
      if (Tone.context.state !== 'running') {
        await Tone.context.resume();
      }
    } catch (error) {
      console.error('Failed to initialize Tone.js:', error);
      return;
    }

    this.masterVolume = new Tone.Volume(-6).toDestination(); // Start slightly quieter

    // Create instruments
    this.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' }
    }).connect(this.masterVolume);

    this.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.2 }
    }).connect(this.masterVolume);

    this.hihat = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).connect(this.masterVolume);
    this.hihat.frequency.value = 200;
    this.hihat.volume.value = -12; // Keep it quiet

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 1 }
    }).connect(this.masterVolume);
    this.synth.volume.value = -16;

    this.isInitialized = true;
  }

  setVolume(db: number) {
    if (this.masterVolume) {
      this.masterVolume.volume.value = db;
    }
  }

  playBeat(type: BeatType) {
    if (!this.isInitialized) return;
    
    // Stop current beat
    if (this.currentPart) {
      this.currentPart.stop();
      this.currentPart.dispose();
      this.currentPart = null;
    }
    
    this.currentBeatType = type;
    Tone.Transport.stop();
    Tone.Transport.cancel(0);

    if (type === 'none') return;

    let sequence: { time: string; note?: string; inst: string; vel?: number }[] = [];
    
    switch (type) {
      case 'dance':
        Tone.Transport.bpm.value = 128;
        sequence = [
          { time: '0:0', inst: 'kick' },
          { time: '0:0:2', inst: 'hihat' },
          { time: '0:1', inst: 'kick' },
          { time: '0:1:2', inst: 'hihat' },
          { time: '0:2', inst: 'kick' },
          { time: '0:2:2', inst: 'hihat' },
          { time: '0:3', inst: 'kick' },
          { time: '0:3:2', inst: 'hihat' },
        ];
        break;
      case 'hiphop':
        Tone.Transport.bpm.value = 90;
        sequence = [
          { time: '0:0', inst: 'kick' },
          { time: '0:0:2', inst: 'hihat' },
          { time: '0:1', inst: 'snare' },
          { time: '0:1:2', inst: 'hihat' },
          { time: '0:1:3', inst: 'kick' },
          { time: '0:2', inst: 'kick' },
          { time: '0:2:2', inst: 'hihat' },
          { time: '0:3', inst: 'snare' },
          { time: '0:3:2', inst: 'hihat' },
        ];
        break;
      case 'rock':
        Tone.Transport.bpm.value = 110;
        sequence = [
          { time: '0:0', inst: 'kick' },
          { time: '0:0:2', inst: 'kick' },
          { time: '0:1', inst: 'snare' },
          { time: '0:1:2', inst: 'hihat' },
          { time: '0:2', inst: 'kick' },
          { time: '0:2:2', inst: 'hihat' },
          { time: '0:3', inst: 'snare' },
          { time: '0:3:2', inst: 'hihat' },
        ];
        break;
      case 'ambient':
        Tone.Transport.bpm.value = 80;
        sequence = [
          { time: '0:0', inst: 'synth', note: 'C4' },
          { time: '0:1', inst: 'synth', note: 'E4' },
          { time: '0:2', inst: 'synth', note: 'G4' },
          { time: '0:3', inst: 'synth', note: 'B4' },
        ];
        break;
    }

    this.currentPart = new Tone.Part((time, event) => {
      if (event.inst === 'kick') this.kick?.triggerAttackRelease('C1', '8n', time);
      if (event.inst === 'snare') this.snare?.triggerAttackRelease('8n', time);
      if (event.inst === 'hihat') this.hihat?.triggerAttackRelease('32n', time);
      if (event.inst === 'synth' && event.note) this.synth?.triggerAttackRelease(event.note, '4n', time);
    }, sequence).start(0);

    this.currentPart.loop = true;
    this.currentPart.loopEnd = '1m';
    Tone.Transport.start();
  }

  /**
   * Play a looping backing track: a drum pattern plus one chord per bar.
   * This is what Performance Mode plays along to — previously the track
   * buttons there only started a timer and never produced any audio.
   */
  playBackingTrack(config: BackingTrackConfig) {
    if (!this.isInitialized) return;

    if (this.currentPart) {
      this.currentPart.stop();
      this.currentPart.dispose();
      this.currentPart = null;
    }

    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    Tone.Transport.bpm.value = config.tempo;

    const bars = Math.max(1, config.chords.length);
    const events: Array<{ time: string; inst: string; note?: string; chord?: string[] }> = [];

    for (let bar = 0; bar < bars; bar += 1) {
      for (const [beat, sixteenth, inst] of DRUM_PATTERNS[config.drums]) {
        events.push({ time: `${bar}:${beat}:${sixteenth}`, inst });
      }
      const chord = config.chords[bar];
      if (chord?.length) {
        // Sustain the chord across the bar, and add a soft off-beat push so
        // the harmony doesn't feel static under the learner's playing.
        events.push({ time: `${bar}:0`, inst: 'chord', chord });
        events.push({ time: `${bar}:2`, inst: 'chord', chord });
      }
    }

    this.currentPart = new Tone.Part((time, event: any) => {
      if (event.inst === 'kick') this.kick?.triggerAttackRelease('C1', '8n', time);
      if (event.inst === 'snare') this.snare?.triggerAttackRelease('8n', time);
      if (event.inst === 'hihat') this.hihat?.triggerAttackRelease('32n', time);
      if (event.inst === 'chord' && event.chord) {
        this.synth?.triggerAttackRelease(event.chord, '2n', time);
      }
    }, events).start(0);

    this.currentPart.loop = true;
    this.currentPart.loopEnd = `${bars}m`;
    Tone.Transport.start();
  }

  stop() {
    this.playBeat('none');
    Tone.Transport.stop();
  }

  private cleanup(): void {
    if (this.currentPart) {
      this.currentPart.stop();
      this.currentPart.dispose();
      this.currentPart = null;
    }
    
    Tone.Transport.stop();
    Tone.Transport.cancel(0);

    if (this.kick) {
      this.kick.dispose();
      this.kick = null;
    }
    if (this.snare) {
      this.snare.dispose();
      this.snare = null;
    }
    if (this.hihat) {
      this.hihat.dispose();
      this.hihat = null;
    }
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    if (this.masterVolume) {
      this.masterVolume.dispose();
      this.masterVolume = null;
    }

    this.isInitialized = false;
  }

  dispose(): void {
    this.cleanup();
  }

  getCurrentBeat(): BeatType {
    return this.currentBeatType;
  }
}

export const beatService = new BeatService();
