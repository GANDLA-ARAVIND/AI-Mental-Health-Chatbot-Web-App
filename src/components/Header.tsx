import React from 'react';
import { Brain, Shield, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-gradient-to-r from-blue-100 to-green-100 p-3 rounded-full mr-3">
          <Brain className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Advanced MindCare AI
        </h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed mb-4">
        An advanced AI mental health companion powered by sophisticated NLP and emotion recognition. 
        Share anything on your mind - I understand context, emotions, and provide personalized therapeutic support.
      </p>
      
      <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-500" />
          <span>Advanced NLP Processing</span>
        </div>
        <div className="flex items-center">
          <Brain className="w-4 h-4 mr-2 text-blue-500" />
          <span>Emotion Recognition</span>
        </div>
        <div className="flex items-center">
          <Shield className="w-4 h-4 mr-2 text-green-500" />
          <span>Private & Secure</span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 max-w-3xl mx-auto">
        <p className="text-sm text-gray-700">
          <strong>How it works:</strong> I analyze your text using advanced natural language processing to understand 
          emotions, context, and mental health indicators. I then provide empathetic responses and evidence-based 
          CBT techniques tailored to your specific situation.
        </p>
      </div>
    </div>
  );
};

export default Header;