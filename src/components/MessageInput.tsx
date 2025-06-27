import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Zap } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const examplePrompts = [
    "I've been feeling really anxious about work lately...",
    "I'm struggling with depression and can't seem to get motivated...",
    "I lost someone close to me and I'm having trouble coping...",
    "I'm having panic attacks and don't know what to do..."
  ];

  return (
    <div className="border-t border-gray-200 p-4">
      {message.length === 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Try these examples or share anything on your mind:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setMessage(prompt)}
                className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
              >
                {prompt.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts, feelings, or concerns... I can understand complex emotions and provide personalized support."
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed max-h-32"
            rows={1}
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Brain className="w-4 h-4 mr-1 text-blue-500" />
            <span>Advanced NLP Analysis</span>
          </div>
          <div className="flex items-center">
            <Zap className="w-4 h-4 mr-1 text-yellow-500" />
            <span>Real-time Processing</span>
          </div>
        </div>
        <span>This AI provides support, not professional therapy</span>
      </div>
    </div>
  );
};

export default MessageInput;