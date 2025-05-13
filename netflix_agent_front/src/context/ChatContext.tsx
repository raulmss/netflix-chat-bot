import { createContext, useContext, ReactNode } from 'react';
import useChatService from '../hooks/useChatService';
import { ChatContextType } from '../types';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const chatService = useChatService();
  
  return (
    <ChatContext.Provider value={chatService}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};