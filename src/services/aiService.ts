type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const offlineHelp = (question: string) => {
  const text = question.toLowerCase();
  if (text.includes('middle c')) {
    return 'Middle C is the white key immediately to the left of the pair of two black keys nearest the center of your piano. 🎹';
  }
  if (text.includes('falling note')) {
    return 'Follow each falling bar to the glowing line. Press when its bottom reaches the line, then hold until the bright fill reaches the top of the bar.';
  }
  if (text.includes('midi')) {
    return 'Connect your MIDI keyboard before opening a lesson, allow MIDI access in the browser, and then press Start. Chrome-based browsers provide the best WebMIDI support.';
  }
  if (text.includes('upload') || text.includes('custom song')) {
    return 'Open **Library → My Music** and upload a licensed MusicXML or MIDI file. MusicXML usually gives Pianio the best rhythm and note-duration information.';
  }
  if (text.includes('finger')) {
    return 'Finger numbers are: **1 thumb, 2 index, 3 middle, 4 ring, 5 pinky**. The lesson shows which hand to use.';
  }
  if (text.includes('wait for me') || text.includes('practice')) {
    return 'Turn on **Wait for me** in Practice Settings. Pianio will pause at each note until you play the correct key.';
  }
  return 'My online piano brain is temporarily unavailable. I can still help with falling notes, MIDI keyboards, finger numbers, practice mode, Middle C, and uploading songs.';
};

class AIService {
  private history: ChatMessage[] = [];

  initializeChat() {
    this.history = [];
  }

  async sendMessage(message: string): Promise<string> {
    const userMessage: ChatMessage = { role: 'user', content: message };
    const messages = [...this.history, userMessage].slice(-12);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 25_000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({})) as { reply?: string; error?: string };

      if (!response.ok || !payload.reply) {
        throw new Error(payload.error || `Pianio Bot request failed (${response.status})`);
      }

      const assistantMessage: ChatMessage = { role: 'assistant', content: payload.reply };
      this.history = [...messages, assistantMessage].slice(-12);
      return payload.reply;
    } catch (error) {
      console.error('Pianio Bot request failed:', error);
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'My piano brain is taking too long to answer. Please try once more in a moment! 🎹';
      }
      const detail = error instanceof Error ? error.message : '';
      if (detail.includes('not configured') || detail.includes('API credits')) {
        return offlineHelp(message);
      }
      if (detail.includes('busy')) {
        return 'I am getting lots of questions right now! Please try again in a few seconds. 🎶';
      }
      return 'I could not reach the piano helper service just now. Please check your connection and try again.';
    } finally {
      window.clearTimeout(timeout);
    }
  }
}

export const aiService = new AIService();
