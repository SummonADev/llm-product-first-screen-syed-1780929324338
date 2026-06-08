export type AppState = 'idle' | 'generating' | 'done';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type PromptSuggestion = {
  icon: string;
  text: string;
};
