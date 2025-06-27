import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import CBTSuggestions from './CBTSuggestions';
import LoadingIndicator from './LoadingIndicator';
import AnalysisPanel from './AnalysisPanel';
import { Message, AnalysisData } from '../types/Message';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm an advanced AI mental health companion with sophisticated natural language processing capabilities. I can understand complex emotions, context, and nuanced mental health concerns. Feel free to share anything that's on your mind - whether it's anxiety, depression, relationship issues, work stress, trauma, grief, or any other mental health topic. I'm here to provide empathetic support and evidence-based techniques tailored to your specific situation.",
      sender: 'bot',
      timestamp: new Date().toISOString(),
      emotion: 'neutral',
      sentiment: 'positive'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCbtSuggestions, setCurrentCbtSuggestions] = useState<string[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add bot response
      const botMessage: Message = {
        id: data.id,
        text: data.response,
        sender: 'bot',
        timestamp: data.timestamp,
        emotion: data.emotion,
        sentiment: data.sentiment,
        intensity: data.intensity,
        confidence: data.confidence
      };

      setMessages(prev => [...prev, botMessage]);
      setCurrentCbtSuggestions(data.cbtSuggestions || []);
      
      // Set analysis data
      setCurrentAnalysis({
        emotion: data.emotion,
        sentiment: data.sentiment,
        intensity: data.intensity,
        confidence: data.confidence,
        crisis_detected: data.crisis_detected
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm sorry, I'm having trouble connecting to my advanced processing systems right now. Please try again in a moment. If you're in crisis, please contact a mental health professional or emergency services immediately.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        emotion: 'neutral',
        sentiment: 'neutral'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="h-[700px] flex flex-col">
        {/* Analysis Toggle */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 px-6 py-3 border-b border-gray-200">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            {showAnalysis ? 'Hide' : 'Show'} Advanced Analysis
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <MessageList messages={messages} />
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        
        {showAnalysis && currentAnalysis && (
          <AnalysisPanel analysis={currentAnalysis} />
        )}
        
        {currentCbtSuggestions.length > 0 && (
          <CBTSuggestions 
            suggestions={currentCbtSuggestions}
            onClose={() => setCurrentCbtSuggestions([])}
          />
        )}
        
        <MessageInput onSendMessage={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;