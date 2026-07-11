import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AIChatBot from '../components/AIChatBot';
import { aiService } from '../services/aiService';
import { useAppStore } from '../store/useAppStore';

// Mock the useAppStore
vi.mock('../store/useAppStore', () => ({
  useAppStore: vi.fn(() => ({
    settings: { claudeApiKey: 'fake-key' },
  })),
}));

// Mock the aiService
vi.mock('../services/aiService', () => ({
  aiService: {
    initializeChat: vi.fn(),
    sendMessage: vi.fn(),
  },
}));

describe('AIChatBot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Use proper DOM APIs instead of relying on smooth scrolling in JSDOM
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('renders the floating action button initially', () => {
    render(<AIChatBot />);
    const fab = screen.getByRole('button');
    expect(fab).toBeInTheDocument();
    // The chat window should not be visible
    expect(screen.queryByText('Pianio Bot')).not.toBeInTheDocument();
  });

  it('opens the chat window when FAB is clicked', async () => {
    render(<AIChatBot />);
    const fab = screen.getByRole('button');
    fireEvent.click(fab);
    
    await waitFor(() => {
      expect(screen.getAllByText('Pianio Bot')[0]).toBeInTheDocument();
    });
    expect(aiService.initializeChat).toHaveBeenCalled();
  });

  it('can send a message and display the reply', async () => {
    (aiService.sendMessage as any).mockResolvedValue('Hello from AI!');
    
    render(<AIChatBot />);
    
    // Open chat
    fireEvent.click(screen.getByRole('button'));
    
    // Type a message
    const input = await screen.findByPlaceholderText(/Ask a question.../i);
    fireEvent.change(input, { target: { value: 'How do I play C4?' } });
    
    // Send message
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Verify user message is displayed
    expect(await screen.findByText('How do I play C4?')).toBeInTheDocument();
    
    // Verify AI response is displayed
    expect(await screen.findByText('Hello from AI!')).toBeInTheDocument();
  });
});
