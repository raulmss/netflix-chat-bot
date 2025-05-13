import React, { useState } from 'react';
import { HelpCircle, Menu } from 'lucide-react';
import SettingsMenu from './SettingsMenu';

const ChatHeader: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className="bg-black p-4 sticky top-0 z-10 shadow-md border-b border-netflix-gray/20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-netflix-red font-bold text-2xl mr-2">N</div>
            <h1 className="text-white text-xl font-medium">Netflix Help</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="text-netflix-lightGray hover:text-white transition-colors"
                onClick={() => setShowHelp(!showHelp)}
              >
                <HelpCircle size={20} />
              </button>
              {showHelp && (
                <div className="absolute right-0 mt-2 w-64 bg-netflix-dark border border-netflix-gray/30 rounded-lg shadow-lg p-4 text-sm text-netflix-lightGray">
                  <h3 className="text-white font-medium mb-2">How to use Netflix Help</h3>
                  <p className="mb-2">This AI-powered chat assistant can help you with:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Account & billing questions</li>
                    <li>Playback issues</li>
                    <li>Technical support</li>
                    <li>Content information</li>
                    <li>General Netflix inquiries</li>
                  </ul>
                  <p className="mt-2">Simply type your question and get instant help!</p>
                </div>
              )}
            </div>
            <button 
              className="text-netflix-lightGray hover:text-white transition-colors"
              onClick={() => setShowSettings(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
      <SettingsMenu isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

export default ChatHeader;