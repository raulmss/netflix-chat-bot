import React from 'react';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import ChatFooter from './ChatFooter';

const ChatLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <ChatHeader />
      <div className="flex-1 relative">
        <ChatContainer />
        <ChatInput />
      </div>
      <ChatFooter />
    </div>
  );
};

export default ChatLayout