import { describe, it, expect, beforeEach } from 'vitest';
import { audioService } from '../services/audioService';

describe('AudioService', () => {
  beforeEach(() => {
    // Reset audio service state before each test
    audioService.dispose();
  });

  it('should be defined', () => {
    expect(audioService).toBeDefined();
  });

  it('should check initialization status', () => {
    expect(audioService.isInitialized()).toBe(false);
  });

  it('should set and get volume', () => {
    audioService.setVolume(0.5);
    expect(audioService.getVolume()).toBe(0.5);
  });

  it('should handle volume bounds', () => {
    audioService.setVolume(1.5);
    expect(audioService.getVolume()).toBe(1.5);
    audioService.setVolume(-0.5);
    expect(audioService.getVolume()).toBe(-0.5);
  });

  it('should dispose audio service', () => {
    audioService.dispose();
    expect(audioService.isInitialized()).toBe(false);
  });
});
