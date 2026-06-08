import { useState, useRef, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
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

export default function BeforePrompt({ onSubmit }: BeforePromptProps) {
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0d1117' }}>
      {/* Minimal top bar */}
      <header className="flex items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#1a56db"/>
            <path d="M8 20 L14 8 L20 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 16h7" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          <span className="font-semibold text-sm tracking-tight" style={{ color: '#e6edf3' }}>Lumina</span>
        </div>
      </header>

      {/* Main centred content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
        {/* Glow backdrop */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: 520,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(26,86,219,0.11) 0%, transparent 70%)',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(8px)',
          }}
        />

        {/* Headline */}
        <div className="text-center mb-10 fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="font-bold mb-3 leading-tight" style={{ color: '#e6edf3', fontSize: '2.6rem', letterSpacing: '-0.02em' }}>
            What do you want to build?
          </h1>
          <p className="text-base" style={{ color: '#8b949e' }}>
            Describe your idea and watch it come to life instantly.
          </p>
        </div>

        {/* Prompt box */}
        <div
          className="w-full max-w-2xl rounded-2xl fade-in"
          style={{
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            boxShadow: '0 0 0 1px transparent, 0 8px 48px rgba(26,86,219,0.10)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div className="px-5 pt-5 pb-2">
            <textarea
              ref={textareaRef}
              className="prompt-textarea"
              rows={4}
              placeholder="Describe what you want to create…"
              value={prompt}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              style={{ minHeight: '108px', maxHeight: '200px', fontSize: '1rem' }}
              autoFocus
            />
          </div>

          <div
            className="flex items-center justify-between px-4 py-3 rounded-b-2xl"
            style={{ borderTop: '1px solid #21262d' }}
          >
            <span className="text-xs" style={{ color: '#484f58' }}>Shift + Enter for new line</span>
            <button
              onClick={() => canSubmit && onSubmit(prompt)}
              disabled={!canSubmit}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
                canSubmit
                  ? 'text-white cursor-pointer hover:opacity-90 active:scale-95'
                  : 'cursor-not-allowed opacity-30'
              )}
              style={{
                backgroundColor: canSubmit ? '#1a56db' : '#21262d',
                color: canSubmit ? '#fff' : '#484f58',
                boxShadow: canSubmit ? '0 0 16px rgba(26,86,219,0.3)' : 'none',
              }}
            >
              <ArrowUp size={15} />
              Generate
            </button>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="mt-5 flex flex-wrap gap-2 justify-center max-w-2xl fade-in" style={{ position: 'relative', zIndex: 1 }}>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(s.text)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full text-sm transition-all duration-150 hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: '#161b22',
                color: '#8b949e',
                border: '1px solid #30363d',
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
