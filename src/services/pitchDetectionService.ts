// A simple auto-correlation algorithm for pitch detection
// Note: In a production environment, you might want to use a robust WASM library,
// but this serves as a good foundational algorithm using the Web Audio API.

type PitchCallback = (noteName: string, frequency: number) => void;
type CalibrationCallback = (isCalibrating: boolean, progress: number, threshold: number) => void;
type AudioLevelCallback = (level: number) => void;

export type CalibrationPreset = 'quiet' | 'normal' | 'noisy';

interface CalibrationSettings {
  preset: CalibrationPreset;
  duration: number;
  sensitivity: number;
}

class PitchDetectionService {
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private mediaStream: MediaStream | null = null;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private callback: PitchCallback | null = null;
  private sessionId: number = 0;
  private buffer!: Float32Array;
  private sampleRate: number = 44100;
  
  // Note frequency data
  private readonly notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  private lastDetectedNote: string | null = null;
  private noteHoldCounter: number = 0;

  // Adaptive noise threshold
  private noiseLevelHistory: number[] = [];
  private readonly noiseHistorySize = 100;
  private adaptiveThreshold: number = 0.008; // Lowered for better iPad sensitivity
  private readonly minThreshold = 0.002; // Lowered minimum for quiet environments
  private readonly maxThreshold = 0.05;
  private calibrationFrames = 0;
  private calibrationDuration = 60; // frames to calibrate
  private isManualCalibration = false;
  private calibrationCallback: CalibrationCallback | null = null;
  private audioLevelCallback: AudioLevelCallback | null = null;
  private calibrationSettings: CalibrationSettings = {
    preset: 'normal',
    duration: 60,
    sensitivity: 1.5
  };
  private retryCount = 0;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second initial delay
  private retryTimeoutId: number | null = null;

  async start(callback: PitchCallback, calibrationCallback?: CalibrationCallback, audioLevelCallback?: AudioLevelCallback): Promise<void> {
    this.callback = callback;
    if (this.isRunning) return;
    
    const activeSessionId = ++this.sessionId;
    this.retryCount = 0;

    try {
      // Check browser support
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        throw new Error('AudioContext is not supported in this browser');
      }

      this.lastDetectedNote = null;
      this.noteHoldCounter = 0;
      this.noiseLevelHistory = [];
      this.adaptiveThreshold = 0.008; // Lowered for better iPad sensitivity
      this.calibrationFrames = 0;
      this.isManualCalibration = false;
      this.calibrationCallback = calibrationCallback || null;
      this.audioLevelCallback = audioLevelCallback || null;
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.sampleRate = this.audioContext.sampleRate;
      
      console.log('Pitch detection starting with threshold:', this.adaptiveThreshold);
      
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
      this.buffer = new Float32Array(this.analyzer.frequencyBinCount);
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
        this.cleanup();
        throw err;
      }
      
      // Retry logic for recoverable errors
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        const delay = this.retryDelay * Math.pow(2, this.retryCount - 1); // Exponential backoff
        console.log(`Retrying microphone access (${this.retryCount}/${this.maxRetries}) in ${delay}ms...`);
        
        await new Promise((resolve) => {
          this.retryTimeoutId = window.setTimeout(resolve, delay);
        });
        
        // Check if session is still valid
        if (activeSessionId !== this.sessionId) {
          console.log('Session changed during retry, aborting');
          this.cleanup();
          return;
        }
        
        // Retry the start process
        return this.start(callback, calibrationCallback, audioLevelCallback);
      } else {
        console.error('Max retries reached, giving up on microphone access');
        this.cleanup();
        throw err;
      }
    }
  }

  private cleanup() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.retryTimeoutId !== null) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
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

  stop() {
    this.sessionId++;
    this.isRunning = false;
    this.callback = null;
    this.calibrationCallback = null;
    this.audioLevelCallback = null;
    this.lastDetectedNote = null;
    this.noteHoldCounter = 0;
    this.retryCount = 0;
    if (this.retryTimeoutId !== null) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
    this.cleanup();
  }

  startManualCalibration(preset: CalibrationPreset = 'normal'): void {
    if (!this.isRunning) return;
    
    this.isManualCalibration = true;
    this.calibrationFrames = 0;
    this.noiseLevelHistory = [];
    
    // Set calibration settings based on preset
    switch (preset) {
      case 'quiet':
        this.calibrationSettings = { preset, duration: 30, sensitivity: 2.0 };
        break;
      case 'noisy':
        this.calibrationSettings = { preset, duration: 90, sensitivity: 1.2 };
        break;
      default:
        this.calibrationSettings = { preset: 'normal', duration: 60, sensitivity: 1.5 };
    }
    
    this.calibrationDuration = this.calibrationSettings.duration;
    
    if (this.calibrationCallback) {
      this.calibrationCallback(true, 0, this.adaptiveThreshold);
    }
    
    console.log(`Starting manual calibration: ${preset} mode, ${this.calibrationDuration} frames`);
  }

  private tick = () => {
    if (!this.isRunning || !this.analyzer) return;

    this.analyzer.getFloatTimeDomainData(this.buffer as any);
    const { frequency, rms } = this.autoCorrelate(this.buffer, this.sampleRate);
    
    // Update adaptive threshold based on noise level
    this.updateAdaptiveThreshold(rms);
    
    // Send audio level to callback for UI visualization
    if (this.audioLevelCallback) {
      this.audioLevelCallback(rms);
    }
    
    // Log detection info every 30 frames (approx 0.5 seconds)
    if (this.calibrationFrames % 30 === 0) {
      console.log(`[Pitch Detection] RMS: ${rms.toFixed(4)}, Threshold: ${this.adaptiveThreshold.toFixed(4)}, Frequency: ${frequency.toFixed(1)}Hz, Note: ${frequency !== -1 ? this.frequencyToNote(frequency) : 'none'}`);
    }
    
    if (frequency !== -1) {
      const noteName = this.frequencyToNote(frequency);
      
      // Debounce logic: trigger on first detection of each note
      if (noteName !== this.lastDetectedNote) {
        this.lastDetectedNote = noteName;
        this.noteHoldCounter = 0;
        console.log(`[Pitch Detection] Note detected: ${noteName} (${frequency.toFixed(1)}Hz)`);
        if (this.callback) {
          this.callback(noteName, frequency);
        }
      } else {
        this.noteHoldCounter++;
      }
    } else {
      this.lastDetectedNote = null;
      this.noteHoldCounter = 0;
    }

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private updateAdaptiveThreshold(rms: number): void {
    // During calibration, collect noise samples
    if (this.calibrationFrames < this.calibrationDuration) {
      this.noiseLevelHistory.push(rms);
      this.calibrationFrames++;
      
      // Update calibration progress
      if (this.calibrationCallback) {
        const progress = this.calibrationFrames / this.calibrationDuration;
        this.calibrationCallback(true, progress, this.adaptiveThreshold);
      }
      
      // After calibration, set initial threshold
      if (this.calibrationFrames === this.calibrationDuration) {
        const avgNoise = this.noiseLevelHistory.reduce((a, b) => a + b, 0) / this.noiseLevelHistory.length;
        const sensitivity = this.calibrationSettings.sensitivity;
        this.adaptiveThreshold = Math.min(Math.max(avgNoise * sensitivity, this.minThreshold), this.maxThreshold);
        console.log(`Calibrated noise threshold: ${this.adaptiveThreshold.toFixed(4)} (preset: ${this.calibrationSettings.preset})`);
        
        if (this.calibrationCallback) {
          this.calibrationCallback(false, 1, this.adaptiveThreshold);
        }
        
        this.isManualCalibration = false;
      }
      return;
    }
    
    // After calibration, continuously adapt to changing noise levels
    this.noiseLevelHistory.push(rms);
    if (this.noiseLevelHistory.length > this.noiseHistorySize) {
      this.noiseLevelHistory.shift();
    }
    
    // Calculate moving average of noise levels
    const avgNoise = this.noiseLevelHistory.reduce((a, b) => a + b, 0) / this.noiseLevelHistory.length;
    
    // Gradually adjust threshold (smoothing factor of 0.1)
    const sensitivity = this.isManualCalibration ? this.calibrationSettings.sensitivity : 1.5;
    const targetThreshold = Math.min(Math.max(avgNoise * sensitivity, this.minThreshold), this.maxThreshold);
    this.adaptiveThreshold = this.adaptiveThreshold * 0.9 + targetThreshold * 0.1;
  }

  getCurrentThreshold(): number {
    return this.adaptiveThreshold;
  }

  isCalibrating(): boolean {
    return this.calibrationFrames < this.calibrationDuration;
  }

  getCalibrationProgress(): number {
    return this.calibrationFrames / this.calibrationDuration;
  }

  private autoCorrelate(buf: Float32Array, sampleRate: number): { frequency: number; rms: number } {
    let size = buf.length;
    let rms = 0;

    for (let i = 0; i < size; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / size);
    
    // Use adaptive threshold after calibration
    const threshold = this.calibrationFrames >= this.calibrationDuration ? this.adaptiveThreshold : 0.015;
    if (rms < threshold) return { frequency: -1, rms };

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
    if (T0 <= 0) return { frequency: -1, rms }; // Prevent division by zero

    // parabolic interpolation with bounds checking
    if (T0 > 0 && T0 < size - 1) {
      const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
      const a = (x1 + x3 - 2 * x2) / 2;
      const b = (x3 - x1) / 2;
      if (a !== 0) T0 = T0 - b / (2 * a);
    }

    const frequency = sampleRate / T0;
    
    // Validate frequency is in piano range (C2-C8: ~65Hz-4186Hz)
    if (frequency < 65 || frequency > 4200) return { frequency: -1, rms };
    
    return { frequency, rms };
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
