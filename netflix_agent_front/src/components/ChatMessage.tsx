import React from 'react';
import { clsx } from 'clsx';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Function to format text with markdown-style formatting
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Handle bold text (**word**)
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Handle italic text (*word*)
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return (
        <React.Fragment key={i}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
          {i < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };
  
  return (
    <div
      className={clsx(
        'mb-4 flex w-full animate-message-appear',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={clsx(
          'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm',
          isUser 
            ? 'bg-netflix-red text-white rounded-tr-none' 
            : 'bg-netflix-dark border border-netflix-gray/30 text-white rounded-tl-none'
        )}
      >
        <div className="flex items-start">
          {!isUser && (
            <div className="mr-2 mt-1 flex-shrink-0 w-6 h-6 bg-netflix-red rounded-full flex items-center justify-center text-xs font-bold text-white">
              N
            </div>
          )}
          <div className="flex-1">
            <p className={clsx(
              'text-sm whitespace-pre-line leading-relaxed [&>strong]:font-bold [&>em]:italic',
              isUser ? 'text-white' : 'text-white'
            )}>
              {formatText(message.text)}
            </p>
            {message.timestamp && (
              <div className={clsx(
                'text-xs mt-2 text-right',
                isUser ? 'text-white/70' : 'text-netflix-lightGray/70'
              )}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;