export interface MIDIMessageEvent extends Event {
  data: Uint8Array;
  timeStamp: number;
}

interface Navigator {
  requestMIDIAccess(options?: { sysex?: boolean }): Promise<MIDIAccess>;
}
