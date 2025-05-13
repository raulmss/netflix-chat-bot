export interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp?: number;
}

export interface ChatContextType {
  chat: Message[];
  input: string;
  isLoading: boolean;
  setInput: (input: string) => void;
  sendMessage: () => Promise<void>;
}