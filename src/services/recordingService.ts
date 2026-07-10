interface RecordedNote {
  note: string;
  timestamp: number;
  velocity: number;
  duration: number;
}

interface Recording {
  id: string;
  name: string;
  notes: RecordedNote[];
  duration: number;
  createdAt: Date;
}

class RecordingService {
  private recordings: Recording[] = [];
  private currentRecording: RecordedNote[] = [];
  private isRecording: boolean = false;
  private recordingStartTime: number = 0;
  private noteStartTimes: Map<string, number> = new Map();

  startRecording(): void {
    this.currentRecording = [];
    this.isRecording = true;
    this.recordingStartTime = Date.now();
    this.noteStartTimes.clear();
  }

  stopRecording(): Recording | null {
    if (!this.isRecording) return null;

    this.isRecording = false;
    const duration = Date.now() - this.recordingStartTime;

    const recording: Recording = {
      id: `recording-${Date.now()}`,
      name: `Recording ${this.recordings.length + 1}`,
      notes: [...this.currentRecording],
      duration,
      createdAt: new Date(),
    };

    this.recordings.push(recording);
    this.currentRecording = [];
    this.noteStartTimes.clear();

    return recording;
  }

  recordNoteOn(note: string): void {
    if (!this.isRecording) return;

    this.noteStartTimes.set(note, Date.now() - this.recordingStartTime);
  }

  recordNoteOff(note: string): void {
    if (!this.isRecording) return;

    const startTime = this.noteStartTimes.get(note);
    if (startTime !== undefined) {
      const currentTime = Date.now() - this.recordingStartTime;
      const duration = currentTime - startTime;

      this.currentRecording.push({
        note,
        timestamp: startTime,
        velocity: 0,
        duration,
      });

      this.noteStartTimes.delete(note);
    }
  }

  getRecordings(): Recording[] {
    return this.recordings;
  }

  getRecording(id: string): Recording | undefined {
    return this.recordings.find((r) => r.id === id);
  }

  deleteRecording(id: string): void {
    this.recordings = this.recordings.filter((r) => r.id !== id);
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  clearRecordings(): void {
    this.recordings = [];
  }
}

export const recordingService = new RecordingService();
