
import React, { useState } from 'react';
import HomePage from './components/HomePage';
import ImageToolsPage from './components/ImageToolsPage';
import ChatPage from './components/ChatPage';
import Header from './components/Header';
import Footer from './components/Footer';

type View = 'home' | 'tools' | 'chat';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header 
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)} 
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {activeView === 'home' && <HomePage onEnterApp={() => setActiveView('tools')} />}
        {activeView === 'tools' && <ImageToolsPage />}
        {activeView === 'chat' && <ChatPage />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
