import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const articles = {
  'Account & Access': [
    'https://help.netflix.com/en/node/470',
    'https://help.netflix.com/en/node/13243',
    'https://help.netflix.com/en/node/129831',
    'https://help.netflix.com/en/node/24926',
    'https://help.netflix.com/en/node/62990',
  ],
  'Playback & Quality': [
    'https://help.netflix.com/en/node/13444',
    'https://help.netflix.com/en/node/230',
    'https://help.netflix.com/en/node/1887',
    'https://help.netflix.com/en/node/104515',
    'https://help.netflix.com/en/node/116472',
  ],
  'General Info': [
    'https://help.netflix.com/en/node/33335',
    'https://help.netflix.com/en/node/412',
    'https://help.netflix.com/en/node/100639',
    'https://help.netflix.com/en/node/321880164349028',
  ],
  'Error Codes': [
    'https://help.netflix.com/en/node/14424',
    'https://help.netflix.com/en/node/12232',
    'https://help.netflix.com/en/node/14423',
    'https://help.netflix.com/en/node/12888',
    'https://help.netflix.com/en/node/59985',
    'https://help.netflix.com/en/node/45117',
  ],
  'Playback Display Issues': [
    'https://help.netflix.com/en/node/11634',
    'https://help.netflix.com/en/node/95',
    'https://help.netflix.com/en/node/13811',
    'https://help.netflix.com/en/node/47922',
    'https://help.netflix.com/en/node/25892',
  ],
  'Subtitles': [
    'https://help.netflix.com/en/node/23439',
    'https://help.netflix.com/en/node/116806',
  ],
};

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50">
      <div ref={menuRef} className="absolute right-0 top-0 h-full w-full max-w-lg bg-netflix-dark border-l border-netflix-gray/30 overflow-y-auto">
        <div className="sticky top-0 bg-netflix-dark p-4 border-b border-netflix-gray/30 flex justify-between items-center">
          <h2 className="text-xl font-medium text-white">Articles Used</h2>
          <button
            onClick={onClose}
            className="text-netflix-lightGray hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          {Object.entries(articles).map(([category, urls]) => (
            <div key={category} className="mb-6">
              <h3 className="text-netflix-red font-medium mb-2">{category}</h3>
              <ul className="space-y-2">
                {urls.map((url, index) => (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-netflix-lightGray hover:text-white transition-colors block"
                    >
                      {url.split('/').pop()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;