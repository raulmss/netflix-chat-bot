import React from 'react';

const ChatFooter: React.FC = () => {
  return (
    <footer className="bg-white py-4 text-center">
      <p className="text-netflix-dark text-sm">
        Built by <a href="https://www.raulsouto.com" target="_blank" rel="noopener noreferrer" className="text-netflix-red hover:underline">Raul Souto</a>
      </p>
    </footer>
  );
};

export default ChatFooter;