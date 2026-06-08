import { useState, useRef, useCallback } from 'react';
import { ArrowUp, RefreshCw, Zap } from 'lucide-react';
import clsx from 'clsx';
import { AppState, Message } from '@/types';
import ChatPanel from '@/components/ChatPanel';
import PreviewPanel from '@/components/PreviewPanel';

type AfterPromptProps = {
  messages: Message[];
  appState: AppState;
  credits: number;
  onFollowUp: (prompt: string) => void;
};

export default function AfterPrompt({ messages, appState, credits, onFollowUp }: AfterPromptProps) {
  const [followUp, setFollowUp] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (followUp.trim() && appState !== 'generating') {
        onFollowUp(followUp);
        setFollowUp('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
      }
    }
  }, [followUp, onFollowUp, appState]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFollowUp(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  }, []);

  const handleSend = useCallback(() => {
    if (followUp.trim() && appState !== 'generating') {
      onFollowUp(followUp);
      setFollowUp('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  }, [followUp, onFollowUp, appState]);

  const canSubmit = followUp.trim().length > 0 && appState !== 'generating';

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#0d1117' }}>
      {/* Slim top bar */}
      <header
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid #21262d', backgroundColor: '#0d1117' }}
      >
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#1a56db"/>
            <path d="M8 20 L14 8 L20 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 16h7" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          <span className="font-semibold text-sm" style={{ color: '#e6edf3' }}>Lumina</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Credits badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
          >
            <Zap size={11} style={{ color: '#1a56db' }} />
            <span style={{ color: '#e6edf3' }}>{credits}</span>
            <span style={{ color: '#8b949e' }}>credits</span>
          </div>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#161b22', color: '#8b949e', border: '1px solid #30363d' }}
          >
            <RefreshCw size={12} />
            New chat
          </button>
        </div>
      </header>

      {/* Two-panel layout */}
      <div className="flex-1 flex overflow-hidden slide-left">
        {/* LEFT: Chat history + input */}
        <div
          className="flex flex-col w-[42%] shrink-0"
          style={{ borderRight: '1px solid #21262d' }}
        >
          <ChatPanel messages={messages} appState={appState} />

          {/* Follow-up input pinned at bottom */}
          <div
            className="shrink-0 p-4"
            style={{ borderTop: '1px solid #21262d', backgroundColor: '#0d1117' }}
          >
            <div
              className="rounded-2xl"
              style={{
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                boxShadow: '0 4px 24px rgba(26,86,219,0.06)',
              }}
            >
              <div className="px-4 pt-4 pb-2">
                <textarea
                  ref={textareaRef}
                  className="prompt-textarea text-sm"
                  rows={2}
                  placeholder="Refine or ask a follow-up…"
                  value={followUp}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  disabled={appState === 'generating'}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-b-2xl"
                style={{ borderTop: '1px solid #21262d' }}
              >
                <span className="text-xs" style={{ color: '#484f58' }}>Enter to send</span>
                <button
                  onClick={handleSend}
                  disabled={!canSubmit}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150',
                    canSubmit
                      ? 'text-white cursor-pointer hover:opacity-90 active:scale-95'
                      : 'cursor-not-allowed opacity-30'
                  )}
                  style={{
                    backgroundColor: canSubmit ? '#1a56db' : '#21262d',
                    color: canSubmit ? '#fff' : '#484f58',
                    boxShadow: canSubmit ? '0 0 12px rgba(26,86,219,0.28)' : 'none',
                  }}
                >
                  <ArrowUp size={13} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview top bar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 shrink-0"
            style={{ borderBottom: '1px solid #21262d', backgroundColor: '#0d1117' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#febc2e' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28c840' }} />
              <span className="ml-3 text-xs" style={{ color: '#484f58' }}>Preview</span>
            </div>
            {appState === 'done' && (
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(40,200,64,0.08)',
                  color: '#28c840',
                  border: '1px solid rgba(40,200,64,0.18)',
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: '#28c840' }}
                />
                Ready
              </span>
            )}
          </div>
          <PreviewPanel appState={appState} messages={messages} />
        </div>
      </div>
    </div>
  );
}
