import { useState, useRef, useCallback } from 'react';
import { Sparkles, ArrowUp, Zap } from 'lucide-react';
import clsx from 'clsx';
import { PromptSuggestion } from '@/types';

type BeforePromptProps = {
  onSubmit: (prompt: string) => void;
  credits: number;
};

const SUGGESTIONS: PromptSuggestion[] = [
  { icon: '🛍️', text: 'Build a landing page for my SaaS product' },
  { icon: '📊', text: 'Create a dashboard with analytics charts' },
  { icon: '🤖', text: 'Design a chatbot interface for customer support' },
  { icon: '🎨', text: 'Generate a portfolio site with dark theme' },
];

export default function BeforePrompt({ onSubmit, credits }: BeforePromptProps) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) onSubmit(prompt);
    }
  }, [prompt, onSubmit]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  }, []);

  const handleSuggestion = useCallback((text: string) => {
    setPrompt(text);
    textareaRef.current?.focus();
  }, []);

  const canSubmit = prompt.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f0f11' }}>
      {/* Minimal top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6c47ff' }}>
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm" style={{ color: '#f2f2f5' }}>Lumina</span>
        </div>

        {/* Credits — prominent in header */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#18181c', color: '#9191a4', border: '1px solid #2e2e38' }}>
          <Zap size={12} style={{ color: '#6c47ff' }} />
          <span style={{ color: '#f2f2f5' }}>{credits}</span>
          <span>credits remaining</span>
        </div>
      </header>

      {/* Main centred content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        {/* Headline */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl font-bold mb-3 leading-tight" style={{ color: '#f2f2f5' }}>
            What do you want to build?
          </h1>
          <p className="text-base" style={{ color: '#9191a4' }}>
            Describe your idea and watch it come to life instantly.
          </p>
        </div>

        {/* Prompt box */}
        <div
          className="w-full max-w-2xl rounded-2xl p-4 fade-in"
          style={{
            backgroundColor: '#18181c',
            border: '1px solid #2e2e38',
            boxShadow: '0 0 0 1px transparent, 0 8px 40px rgba(108,71,255,0.08)',
          }}
        >
          <textarea
            ref={textareaRef}
            className="prompt-textarea"
            rows={4}
            placeholder="Describe what you want to create…"
            value={prompt}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            style={{ minHeight: '96px', maxHeight: '200px' }}
          />

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs" style={{ color: '#5a5a6e' }}>Shift + Enter for new line</span>
            <button
              onClick={() => canSubmit && onSubmit(prompt)}
              disabled={!canSubmit}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
                canSubmit
                  ? 'text-white cursor-pointer hover:opacity-90 active:scale-95'
                  : 'cursor-not-allowed opacity-40'
              )}
              style={{
                backgroundColor: canSubmit ? '#6c47ff' : '#2e2e38',
                color: canSubmit ? '#fff' : '#5a5a6e',
              }}
            >
              <ArrowUp size={15} />
              Generate
            </button>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-2xl fade-in">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(s.text)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-all duration-150 hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: '#18181c',
                color: '#9191a4',
                border: '1px solid #2e2e38',
              }}
            >
              <span>{s.icon}</span>
              <span>{s.text}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
