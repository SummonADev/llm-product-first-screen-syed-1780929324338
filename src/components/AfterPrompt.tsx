import { useState, useRef, useCallback } from 'react';
import { Sparkles, ArrowUp, Zap, RefreshCw, Maximize2 } from 'lucide-react';
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
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#0f0f11' }}>
      {/* Slim top bar */}
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid #2e2e38', backgroundColor: '#0f0f11' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#6c47ff' }}>
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="font-semibold text-sm" style={{ color: '#f2f2f5' }}>Lumina</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Credits badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#18181c', border: '1px solid #2e2e38' }}
          >
            <Zap size={11} style={{ color: '#6c47ff' }} />
            <span style={{ color: '#f2f2f5' }}>{credits}</span>
            <span style={{ color: '#9191a4' }}>credits</span>
          </div>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#18181c', color: '#9191a4', border: '1px solid #2e2e38' }}
          >
            <RefreshCw size={12} />
            New chat
          </button>
        </div>
      </header>

      {/* Two-panel layout */}
      <div className="flex-1 flex overflow-hidden slide-left">
        {/* LEFT: Chat history */}
        <div
          className="flex flex-col w-[38%] shrink-0"
          style={{ borderRight: '1px solid #2e2e38' }}
        >
          <ChatPanel messages={messages} appState={appState} />

          {/* Follow-up input pinned at bottom of chat panel */}
          <div
            className="shrink-0 p-3"
            style={{ borderTop: '1px solid #2e2e38', backgroundColor: '#0f0f11' }}
          >
            <div
              className="rounded-xl p-3"
              style={{ backgroundColor: '#18181c', border: '1px solid #2e2e38' }}
            >
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
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSend}
                  disabled={!canSubmit}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
                    canSubmit
                      ? 'text-white cursor-pointer hover:opacity-90 active:scale-95'
                      : 'cursor-not-allowed opacity-40'
                  )}
                  style={{
                    backgroundColor: canSubmit ? '#6c47ff' : '#2e2e38',
                    color: canSubmit ? '#fff' : '#5a5a6e',
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
          <div
            className="flex items-center justify-between px-4 py-2.5 shrink-0"
            style={{ borderBottom: '1px solid #2e2e38', backgroundColor: '#0f0f11' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#febc2e' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28c840' }} />
              <span className="ml-3 text-xs" style={{ color: '#5a5a6e' }}>Preview</span>
            </div>
            <button
              className="p-1.5 rounded-md transition-opacity hover:opacity-70"
              style={{ color: '#5a5a6e' }}
            >
              <Maximize2 size={13} />
            </button>
          </div>
          <PreviewPanel appState={appState} messages={messages} />
        </div>
      </div>
    </div>
  );
}
