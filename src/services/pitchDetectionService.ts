// A simple auto-correlation algorithm for pitch detection
// Note: In a production environment, you might want to use a robust WASM library,
// but this serves as a good foundational algorithm using the Web Audio API.

type PitchCallback = (noteName: string, frequency: number) => void;

class PitchDetectionService {
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private mediaStream: MediaStream | null = null;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private callback: PitchCallback | null = null;
  private sessionId: number = 0;
  private buffer: Float32Array<ArrayBuffer> = new Float32Array(2048);
  private sampleRate: number = 44100;
  
  // Note frequency data
  private readonly notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  private lastDetectedNote: string | null = null;
  private noteHoldCounter: number = 0;

  async start(callback: PitchCallback) {
    this.callback = callback;
    if (this.isRunning) return;
    
    const activeSessionId = ++this.sessionId;

    try {
      this.lastDetectedNote = null;
      this.noteHoldCounter = 0;
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.sampleRate = this.audioContext.sampleRate;
      
      // Resume AudioContext if suspended (required on iOS/Safari)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Request microphone with optimized settings for pitch detection
      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        channelCount: 1,
        // iOS Safari may not support custom sampleRate, so handle gracefully
        sampleRate: this.sampleRate
      } });

      if (activeSessionId !== this.sessionId) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      
      this.mediaStream = stream;
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
      this.analyzer = this.audioContext.createAnalyser();
      // Use smaller FFT for faster response on mobile/iPad
      this.analyzer.fftSize = 2048;
      this.buffer = new Float32Array(2048);
      this.analyzer.smoothingTimeConstant = 0.1;
      this.analyzer.minDecibels = -100;
      this.analyzer.maxDecibels = -30;
      
      this.mediaStreamSource.connect(this.analyzer);
      this.isRunning = true;
      this.tick();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      // Provide more specific error message for iOS
      if (err instanceof Error && err.name === 'NotAllowedError') {
        console.error('Microphone permission denied. Please allow microphone access in Settings.');
      }
      throw err;
    }
  }

  stop() {
    this.sessionId++;
    this.isRunning = false;
    this.callback = null;
    this.lastDetectedNote = null;
    this.noteHoldCounter = 0;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
      this.mediaStreamSource = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.analyzer) {
      this.analyzer.disconnect();
      this.analyzer = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  private tick = () => {
    if (!this.isRunning || !this.analyzer) return;

    this.analyzer.getFloatTimeDomainData(this.buffer);
    const frequency = this.autoCorrelate(this.buffer, this.sampleRate);
    
    if (frequency !== -1) {
      const noteName = this.frequencyToNote(frequency);
      
      // Improved debounce logic: trigger immediately for better responsiveness
      if (noteName === this.lastDetectedNote) {
        this.noteHoldCounter++;
      } else {
        this.lastDetectedNote = noteName;
        this.noteHoldCounter = 0;
      }
      
      // Trigger on first detection for immediate response
      if (this.callback && this.noteHoldCounter === 0) {
        this.callback(noteName, frequency);
      }
    } else {
      this.lastDetectedNote = null;
      this.noteHoldCounter = 0;
    }

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private autoCorrelate(buf: Float32Array, sampleRate: number): number {
    let size = buf.length;
    let rms = 0;

    for (let i = 0; i < size; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1; // Lowered threshold for better iPad microphone sensitivity

    let r1 = 0, r2 = size - 1, thres = 0.2;
    for (let i = 0; i < size / 2; i++)
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < size / 2; i++)
      if (Math.abs(buf[size - i]) < thres) { r2 = size - i; break; }

    buf = buf.slice(r1, r2);
    size = buf.length;

    const c = new Array(size).fill(0);
    for (let i = 0; i < size; i++)
      for (let j = 0; j < size - i; j++)
        c[i] = c[i] + buf[j] * buf[j + i];

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    // parabolic interpolation
    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }

  private frequencyToNote(frequency: number): string {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const midiNum = Math.round(noteNum) + 69;
    const octave = Math.floor(midiNum / 12) - 1;
    const noteName = this.notes[midiNum % 12];
    return `${noteName}${octave}`;
  }
}

export const pitchDetectionService = new PitchDetectionService();
