import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import { MessageSquare, HelpCircle, PlayCircle, User, Info, AlertCircle, MonitorSmartphone, Subtitles } from 'lucide-react';

const ChatContainer: React.FC = () => {
  const { chat, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [chat]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = [
    { icon: User, title: 'Account & Access' },
    { icon: PlayCircle, title: 'Playback & Quality' },
    { icon: Info, title: 'General Info' },
    { icon: AlertCircle, title: 'Error Codes' },
    { icon: MonitorSmartphone, title: 'Playback Display Issues' },
    { icon: Subtitles, title: 'Subtitles' },
  ];
  
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 mb-20 scrollbar-thin scrollbar-thumb-netflix-gray scrollbar-track-transparent">
      <div className="container mx-auto max-w-3xl">
        {chat.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
            <div className="bg-netflix-red/10 p-6 rounded-full mb-4">
              <MessageSquare size={40} className="text-netflix-red" />
            </div>
            <h2 className="text-xl font-medium text-white mb-4">Netflix Help Agent</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mb-8">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-netflix-dark rounded-lg border border-netflix-gray/30"
                >
                  <category.icon size={24} className="text-netflix-red mb-2" />
                  <span className="text-sm text-center text-netflix-lightGray">{category.title}</span>
                </div>
              ))}
            </div>
            <p className="text-netflix-lightGray max-w-md">
              Ask any questions about these topics to get instant help with your Netflix experience.
            </p>
          </div>
        ) : (
          <>
            {chat.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4 animate-message-appear">
                <div className="bg-netflix-dark border border-netflix-gray/30 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0 w-6 h-6 bg-netflix-red rounded-full flex items-center justify-center text-xs font-bold text-white">
                      N
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-netflix-gray/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-netflix-gray/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-netflix-gray/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;