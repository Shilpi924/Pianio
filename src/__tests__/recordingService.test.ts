import { describe, it, expect, beforeEach } from 'vitest';
import { recordingService } from '../services/recordingService';

describe('RecordingService', () => {
  beforeEach(() => {
    // Clear all recordings before each test
    recordingService.clearRecordings();
  });

  it('should start a new recording', () => {
    recordingService.startRecording();
    expect(recordingService.isCurrentlyRecording()).toBe(true);
  });

  it('should record note on events', () => {
    recordingService.startRecording();
    recordingService.recordNoteOn('C4');
    recordingService.recordNoteOff('C4');
    const recordings = recordingService.getRecordings();
    expect(recordings).toHaveLength(0); // Not stopped yet
  });

  it('should stop recording and save it', () => {
    recordingService.startRecording();
    recordingService.recordNoteOn('C4');
    recordingService.recordNoteOff('C4');
    const recording = recordingService.stopRecording();
    expect(recording).toBeDefined();
    expect(recording?.notes.length).toBeGreaterThan(0);
  });

  it('should retrieve all recordings', () => {
    recordingService.startRecording();
    recordingService.recordNoteOn('C4');
    recordingService.stopRecording();
    
    recordingService.startRecording();
    recordingService.recordNoteOn('D4');
    recordingService.stopRecording();
    
    const recordings = recordingService.getRecordings();
    expect(recordings).toHaveLength(2);
  });

  it('should delete a recording', () => {
    recordingService.startRecording();
    recordingService.recordNoteOn('C4');
    const recording = recordingService.stopRecording();
    
    if (recording) {
      recordingService.deleteRecording(recording.id);
    }
    
    const recordings = recordingService.getRecordings();
    expect(recordings).toHaveLength(0);
  });

  it('should calculate recording duration', async () => {
    recordingService.startRecording();
    recordingService.recordNoteOn('C4');
    // Add a small delay to ensure duration is calculated
    await new Promise(resolve => setTimeout(resolve, 10));
    recordingService.recordNoteOff('C4');
    const recording = recordingService.stopRecording();
    
    expect(recording?.duration).toBeGreaterThanOrEqual(0);
  });
});
