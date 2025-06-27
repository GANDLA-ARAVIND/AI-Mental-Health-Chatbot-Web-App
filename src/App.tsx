import React from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Header />
        <ChatInterface />
      </div>
    </div>
  );
}

export default App;