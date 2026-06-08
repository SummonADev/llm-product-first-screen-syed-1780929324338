import { useEffect, useRef } from 'react';
import { AppState, Message } from '@/types';
import TypingIndicator from '@/components/TypingIndicator';

type ChatPanelProps = {
  messages: Message[];
  appState: AppState;
};

export default function ChatPanel({ messages, appState }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, appState]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex flex-col gap-1 fade-in ${
            msg.role === 'user' ? 'items-end' : 'items-start'
          }`}
        >
          {msg.role === 'user' ? (
            <div
              className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
              style={{
                backgroundColor: '#6c47ff',
                color: '#fff',
              }}
            >
              {msg.content}
            </div>
          ) : (
            <div className="flex items-start gap-2.5 max-w-[92%]">
              <div
                className="w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-xs"
                style={{ backgroundColor: '#18181c', border: '1px solid #2e2e38', color: '#6c47ff' }}
              >
                ✦
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
                style={{
                  backgroundColor: '#18181c',
                  border: '1px solid #2e2e38',
                  color: '#f2f2f5',
                }}
              >
                {msg.content}
              </div>
            </div>
          )}
          <span className="text-xs px-1" style={{ color: '#5a5a6e' }}>
            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ))}

      {appState === 'generating' && (
        <div className="flex items-start gap-2.5 fade-in">
          <div
            className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs"
            style={{ backgroundColor: '#18181c', border: '1px solid #2e2e38', color: '#6c47ff' }}
          >
            ✦
          </div>
          <div
            className="px-4 py-3 rounded-2xl rounded-tl-sm"
            style={{ backgroundColor: '#18181c', border: '1px solid #2e2e38' }}
          >
            <TypingIndicator />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
