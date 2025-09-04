
import React from 'react';

type View = 'home' | 'tools' | 'chat';

interface HeaderProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate }) => {
  const navLinkClasses = (view: View) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      activeView === view
        ? 'bg-purple-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div onClick={() => onNavigate('home')} className="cursor-pointer flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 className="text-2xl font-bold text-white">
              <span className="text-purple-400">Moriati</span> AI
            </h1>
          </div>
          {activeView !== 'home' && (
            <nav className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg">
              <button onClick={() => onNavigate('tools')} className={navLinkClasses('tools')}>
                الأدوات
              </button>
              <button onClick={() => onNavigate('chat')} className={navLinkClasses('chat')}>
                المحادثة
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
