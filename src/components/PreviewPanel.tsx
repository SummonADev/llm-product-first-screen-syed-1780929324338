import { AppState, Message } from '@/types';

type PreviewPanelProps = {
  appState: AppState;
  messages: Message[];
};

function ShimmerBlock({ width, height }: { width: string; height: string }) {
  return (
    <div
      className="preview-shimmer rounded-lg"
      style={{ width, height }}
    />
  );
}

function GeneratingView() {
  return (
    <div className="p-6 flex flex-col gap-4">
      <ShimmerBlock width="60%" height="28px" />
      <ShimmerBlock width="100%" height="180px" />
      <div className="flex gap-3">
        <ShimmerBlock width="48%" height="80px" />
        <ShimmerBlock width="48%" height="80px" />
      </div>
      <ShimmerBlock width="100%" height="120px" />
      <ShimmerBlock width="40%" height="20px" />
      <ShimmerBlock width="70%" height="20px" />
      <ShimmerBlock width="55%" height="20px" />
    </div>
  );
}

function DoneView({ messages }: { messages: Message[] }) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const title = lastUserMsg ? lastUserMsg.content : 'Your generated output';
  const shortTitle = title.length > 40 ? title.slice(0, 40) + '...' : title;

  return (
    <div className="p-6 flex flex-col gap-5 fade-in">
      {/* Mock browser chrome */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid #30363d', backgroundColor: '#161b22' }}
      >
        {/* Nav mock */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #30363d', backgroundColor: '#1c2333' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#1a56db' }} />
            <div className="w-20 h-3 rounded" style={{ backgroundColor: '#30363d' }} />
          </div>
          <div className="flex gap-4">
            {[60, 40, 50].map((w, i) => (
              <div key={i} className="h-3 rounded" style={{ width: w, backgroundColor: '#30363d' }} />
            ))}
          </div>
          <div className="w-20 h-8 rounded-lg" style={{ backgroundColor: '#1a56db', opacity: 0.8 }} />
        </div>

        {/* Hero section mock */}
        <div className="px-5 py-8 flex flex-col items-center text-center gap-4">
          <div
            className="px-3 py-1 rounded-full text-xs"
            style={{ backgroundColor: 'rgba(26,86,219,0.15)', color: '#3b71f5', border: '1px solid rgba(26,86,219,0.3)' }}
          >
            ✦ AI Generated
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 rounded" style={{ width: '70%', backgroundColor: '#30363d' }} />
            <div className="h-6 rounded" style={{ width: '55%', backgroundColor: '#21262d' }} />
          </div>
          <div className="flex flex-col items-center gap-1.5 w-full">
            {[80, 65, 72].map((w, i) => (
              <div key={i} className="h-3 rounded" style={{ width: `${w}%`, backgroundColor: '#21262d' }} />
            ))}
          </div>
          <div className="flex gap-3 mt-1">
            <div className="w-24 h-9 rounded-lg" style={{ backgroundColor: '#1a56db' }} />
            <div className="w-24 h-9 rounded-lg" style={{ backgroundColor: '#21262d' }} />
          </div>
        </div>

        {/* Cards row mock */}
        <div className="px-5 pb-6 grid grid-cols-3 gap-3">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{ backgroundColor: '#1c2333', border: '1px solid #30363d' }}
            >
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: 'rgba(26,86,219,0.2)' }} />
              <div className="h-3 rounded" style={{ width: '70%', backgroundColor: '#30363d' }} />
              <div className="h-2.5 rounded" style={{ width: '90%', backgroundColor: '#21262d' }} />
              <div className="h-2.5 rounded" style={{ width: '60%', backgroundColor: '#21262d' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl text-xs"
        style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
      >
        <span style={{ color: '#8b949e' }}>Based on: <span style={{ color: '#e6edf3' }}>"{shortTitle}"</span></span>
        <span
          className="px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(40,200,64,0.1)', color: '#28c840', border: '1px solid rgba(40,200,64,0.2)' }}
        >
          Ready
        </span>
      </div>
    </div>
  );
}

export default function PreviewPanel({ appState, messages }: PreviewPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#0d1117' }}>
      {appState === 'generating' && <GeneratingView />}
      {appState === 'done' && <DoneView messages={messages} />}
    </div>
  );
}
