export interface MusicBrainzRecording {
  id: string;
  title: string;
  artist: string;
  releaseDate?: string;
}

export async function searchRecordings(query: string): Promise<MusicBrainzRecording[]> {
  try {
    const response = await fetch(`https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(query)}&fmt=json`);
    
    if (!response.ok) {
      throw new Error(`MusicBrainz API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.recordings || !Array.isArray(data.recordings)) {
      return [];
    }

    return data.recordings.map((recording: any) => {
      let artistName = 'Unknown Artist';
      if (recording['artist-credit'] && recording['artist-credit'].length > 0) {
        artistName = recording['artist-credit'][0].name || recording['artist-credit'][0].artist?.name || 'Unknown Artist';
      }

      let releaseDate = undefined;
      if (recording.releases && recording.releases.length > 0) {
        releaseDate = recording.releases[0].date;
      }

      return {
        id: recording.id,
        title: recording.title,
        artist: artistName,
        releaseDate: releaseDate,
      };
    });
  } catch (error) {
    console.error('Failed to search MusicBrainz:', error);
    return [];
  }
}
