import * as Tone from 'tone';

export type BeatType = 'hiphop' | 'dance' | 'rock' | 'ambient' | 'none';

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
    
    await Tone.start();

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

  stop() {
    this.playBeat('none');
  }

  getCurrentBeat(): BeatType {
    return this.currentBeatType;
  }
}

export const beatService = new BeatService();
