import { useState, useCallback } from 'react';
import { AppState, Message } from '@/types';
import BeforePrompt from '@/components/BeforePrompt';
import AfterPrompt from '@/components/AfterPrompt';

export default function LandingPage() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [credits, setCredits] = useState<number>(50);

  const handleSubmit = useCallback((prompt: string) => {
    if (!prompt.trim() || appState === 'generating') return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setAppState('generating');
    setCredits(prev => Math.max(0, prev - 1));

    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've generated a response based on your prompt: "${prompt}". Here is your result — a fully crafted output ready to preview and iterate upon. You can refine it further by typing a follow-up prompt below.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setAppState('done');
    }, 2800);
  }, [appState]);

  const handleFollowUp = useCallback((prompt: string) => {
    if (!prompt.trim() || appState === 'generating') return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setAppState('generating');
    setCredits(prev => Math.max(0, prev - 1));

    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Updated! Here's the refined version based on your feedback: "${prompt}". The changes have been applied and your preview has been updated accordingly.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setAppState('done');
    }, 2200);
  }, [appState]);

  if (appState === 'idle') {
    return (
      <BeforePrompt
        onSubmit={handleSubmit}
        credits={credits}
      />
    );
  }

  return (
    <AfterPrompt
      messages={messages}
      appState={appState}
      credits={credits}
      onFollowUp={handleFollowUp}
    />
  );
}
