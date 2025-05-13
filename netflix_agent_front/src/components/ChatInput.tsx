import React, { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const ChatInput: React.FC = () => {
  const { input, setInput, sendMessage, isLoading } = useChat();
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4">
      <div className="bg-netflix-dark border border-netflix-gray/30 rounded-full overflow-hidden flex items-center px-4 py-2 w-full max-w-3xl mx-auto shadow-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Netflix Help..."
          className="flex-1 bg-transparent outline-none text-white py-2 placeholder-netflix-gray"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className={`ml-2 p-2 rounded-full ${
            isLoading || !input.trim()
              ? 'text-netflix-gray cursor-not-allowed'
              : 'text-white bg-netflix-red hover:bg-red-700 transition-colors'
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;