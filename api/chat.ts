import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_INSTRUCTION = `You are Pianio Bot, a cheerful, accurate piano teacher and guide for the Pianio learning app.

Pianio includes a Song Library, falling-note lessons, a touchscreen piano, MIDI keyboard support, microphone pitch detection, Wait for me practice, finger hints, sheet music, Free Play, and progress tracking. MusicXML or MIDI files can be uploaded for custom lessons; MP3 files cannot currently be converted automatically.

Give short, clear answers suitable for children and beginners. Use occasional music emojis, simple analogies, and numbered steps when explaining app actions. Be honest when a feature does not exist. Never claim to have added, licensed, or published a song. For medical, legal, payment, account-security, or copyright questions, encourage help from a responsible adult or qualified professional.`;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
});

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_CLAUDE_API_KEY;
  if (!apiKey) {
    return json({ error: 'Pianio Bot is not configured' }, 503);
  }

  try {
    const body = await request.json() as { messages?: unknown };
    if (!Array.isArray(body.messages)) {
      return json({ error: 'A messages array is required' }, 400);
    }

    const messages: ChatMessage[] = body.messages
      .slice(-12)
      .filter((item): item is ChatMessage => {
        if (!item || typeof item !== 'object') return false;
        const candidate = item as Partial<ChatMessage>;
        return (candidate.role === 'user' || candidate.role === 'assistant')
          && typeof candidate.content === 'string'
          && candidate.content.trim().length > 0
          && candidate.content.length <= 2_000;
      })
      .map((item) => ({ role: item.role, content: item.content.trim() }));

    if (!messages.length || messages[messages.length - 1]?.role !== 'user') {
      return json({ error: 'A valid user message is required' }, 400);
    }

    const anthropic = new Anthropic({ apiKey, timeout: 15_000, maxRetries: 0 });
    const result = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-opus-4-8',
      max_tokens: 600,
      system: SYSTEM_INSTRUCTION,
      messages,
    });
    const reply = result.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    if (!reply) {
      return json({ error: 'The piano helper returned an empty answer' }, 502);
    }
    return json({ reply });
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error
      ? Number((error as { status?: unknown }).status)
      : 0;
    console.error('Pianio Bot API error:', error);

    const message = error instanceof Error ? error.message.toLowerCase() : '';
    if (message.includes('credit balance')) {
      return json({ error: 'Pianio Bot needs API credits' }, 503);
    }
    if (status === 401 || status === 403 || status === 404) {
      return json({ error: 'Pianio Bot is not configured correctly' }, 503);
    }
    if (status === 429 || status === 529) {
      return json({ error: 'Pianio Bot is busy' }, 503);
    }
    return json({ error: 'Pianio Bot service failed' }, 502);
  }
}
