import type { MIDIDevice } from '../types';

export type MIDIMessage = {
  note: number;
  velocity: number;
  timestamp: number;
};

export type MIDIEventListener = (message: MIDIMessage) => void;

class MIDIService {
  private midiAccess: any = null;
  private inputs: Map<string, any> = new Map();
  private listeners: Set<MIDIEventListener> = new Set();
  private onStateChangeCallback: ((devices: MIDIDevice[]) => void) | null = null;

  async initialize(): Promise<boolean> {
    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      
      this.midiAccess.addEventListener('statechange', () => {
        this.handleStateChange();
      });

      // Connect to existing devices
      this.connectToDevices();

      return true;
    } catch (error) {
      console.error('Failed to initialize MIDI:', error);
      return false;
    }
  }

  private connectToDevices(): void {
    if (!this.midiAccess) return;

    for (const input of Array.from(this.midiAccess.inputs.values())) {
      this.connectInput(input as any);
    }
  }

  private connectInput(input: any): void {
    if (this.inputs.has(input.id)) return;

    input.addEventListener('midimessage', (event: any) => this.handleMIDIMessage(event));
    this.inputs.set(input.id, input);
    
    console.log(`Connected to MIDI device: ${input.name}`);
  }

  private disconnectInput(input: any): void {
    input.removeEventListener('midimessage', (event: any) => this.handleMIDIMessage(event));
    this.inputs.delete(input.id);
    
    console.log(`Disconnected from MIDI device: ${input.name}`);
  }

  private handleMIDIMessage(event: any): void {
    const [status, note, velocity] = event.data;
    const isNoteOn = status >= 144 && status < 160;
    const isNoteOff = status >= 128 && status < 144;

    if (isNoteOn || isNoteOff) {
      const message: MIDIMessage = {
        note,
        velocity: isNoteOn ? velocity : 0,
        timestamp: event.timeStamp,
      };

      this.listeners.forEach((listener) => listener(message));
    }
  }

  private handleStateChange(): void {
    if (!this.midiAccess) return;

    // Check for new devices
    for (const input of Array.from(this.midiAccess.inputs.values())) {
      if (!this.inputs.has((input as any).id)) {
        this.connectInput(input);
      }
    }

    // Check for disconnected devices
    for (const [id, input] of this.inputs.entries()) {
      if (!this.midiAccess.inputs.get(id)) {
        this.disconnectInput(input);
      }
    }

    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.getDevices());
    }
  }

  getDevices(): MIDIDevice[] {
    if (!this.midiAccess) return [];

    return Array.from(this.midiAccess.inputs.values()).map((input: any) => ({
      id: input.id,
      name: input.name || 'Unknown Device',
      manufacturer: input.manufacturer,
      state: 'connected',
    }));
  }

  addListener(listener: MIDIEventListener): void {
    this.listeners.add(listener);
  }

  removeListener(listener: MIDIEventListener): void {
    this.listeners.delete(listener);
  }

  onStateChange(callback: (devices: MIDIDevice[]) => void): void {
    this.onStateChangeCallback = callback;
  }

  isSupported(): boolean {
    return 'requestMIDIAccess' in navigator;
  }
}

export const midiService = new MIDIService();
