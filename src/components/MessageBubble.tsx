import React from 'react';
import { Bot, User, Brain } from 'lucide-react';
import EmotionBadge from './EmotionBadge';
import { Message } from '../types/Message';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  const time = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex items-start space-x-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      )}
      
      <div className={`max-w-[80%] ${isBot ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isBot
              ? 'bg-gradient-to-r from-gray-50 to-blue-50 text-gray-800 rounded-tl-sm border border-gray-200'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-sm shadow-md'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        
        <div className={`flex items-center mt-2 space-x-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
          <span className="text-xs text-gray-500">{time}</span>
          {message.emotion && message.emotion !== 'neutral' && (
            <EmotionBadge emotion={message.emotion} />
          )}
          {message.confidence && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {Math.round(message.confidence * 100)}% confidence
            </div>
          )}
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;