import type { Lesson } from '../types';

export interface CommunitySong {
  id: string;
  lesson: Lesson;
  uploader: string;
  uploadDate: string;
  downloads: number;
  rating: number;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
}

class CommunityLibraryService {
  private storageKey = 'pianio_community_library';
  private library: CommunitySong[] = [];

  constructor() {
    this.loadLibrary();
  }

  private loadLibrary() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.library = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load community library:', error);
      this.library = [];
    }
  }

  private saveLibrary() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.library));
    } catch (error) {
      console.error('Failed to save community library:', error);
    }
  }

  async uploadToCommunity(
    lesson: Lesson,
    uploaderName: string,
    tags: string[] = []
  ): Promise<CommunitySong> {
    const communitySong: CommunitySong = {
      id: `community_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lesson,
      uploader: uploaderName,
      uploadDate: new Date().toISOString(),
      downloads: 0,
      rating: 0,
      tags,
      status: 'pending' // Requires approval
    };

    this.library.push(communitySong);
    this.saveLibrary();

    return communitySong;
  }

  getCommunitySongs(status?: 'pending' | 'approved' | 'rejected'): CommunitySong[] {
    if (status) {
      return this.library.filter(song => song.status === status);
    }
    return this.library.filter(song => song.status === 'approved');
  }

  getSongById(id: string): CommunitySong | undefined {
    return this.library.find(song => song.id === id);
  }

  searchSongs(query: string): CommunitySong[] {
    const lowerQuery = query.toLowerCase();
    return this.library.filter(song => 
      song.status === 'approved' && (
        song.lesson.title.toLowerCase().includes(lowerQuery) ||
        song.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        song.uploader.toLowerCase().includes(lowerQuery)
      )
    );
  }

  async approveSong(id: string): Promise<boolean> {
    const song = this.getSongById(id);
    if (song) {
      song.status = 'approved';
      this.saveLibrary();
      return true;
    }
    return false;
  }

  async rejectSong(id: string): Promise<boolean> {
    const song = this.getSongById(id);
    if (song) {
      song.status = 'rejected';
      this.saveLibrary();
      return true;
    }
    return false;
  }

  incrementDownloads(id: string): void {
    const song = this.getSongById(id);
    if (song) {
      song.downloads++;
      this.saveLibrary();
    }
  }

  rateSong(id: string, rating: number): void {
    const song = this.getSongById(id);
    if (song && rating >= 1 && rating <= 5) {
      // Simple average rating calculation
      const currentRating = song.rating || 0;
      song.rating = (currentRating + rating) / 2;
      this.saveLibrary();
    }
  }

  getPendingSongs(): CommunitySong[] {
    return this.getCommunitySongs('pending');
  }

  getLibraryStats() {
    return {
      total: this.library.length,
      approved: this.library.filter(s => s.status === 'approved').length,
      pending: this.library.filter(s => s.status === 'pending').length,
      rejected: this.library.filter(s => s.status === 'rejected').length,
      totalDownloads: this.library.reduce((sum, s) => sum + s.downloads, 0)
    };
  }
}

export const communityLibraryService = new CommunityLibraryService();
