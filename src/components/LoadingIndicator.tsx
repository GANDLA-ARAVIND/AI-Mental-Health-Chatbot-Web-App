import React from 'react';
import { Brain } from 'lucide-react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
          <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 text-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-200">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-gray-600 ml-2">Processing with advanced NLP...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;