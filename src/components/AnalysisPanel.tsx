import React from 'react';
import { Brain, TrendingUp, Zap, AlertTriangle, BarChart3 } from 'lucide-react';
import { AnalysisData } from '../types/Message';

interface AnalysisPanelProps {
  analysis: AnalysisData;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis }) => {
  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      'depression': 'text-blue-600 bg-blue-100',
      'anxiety': 'text-yellow-600 bg-yellow-100',
      'anger': 'text-red-600 bg-red-100',
      'grief': 'text-purple-600 bg-purple-100',
      'trauma': 'text-orange-600 bg-orange-100',
      'loneliness': 'text-indigo-600 bg-indigo-100',
      'self_harm': 'text-red-800 bg-red-200',
      'neutral': 'text-gray-600 bg-gray-100'
    };
    return colors[emotion] || colors.neutral;
  };

  const getSentimentColor = (sentiment: string) => {
    const colors: { [key: string]: string } = {
      'positive': 'text-green-600 bg-green-100',
      'negative': 'text-red-600 bg-red-100',
      'neutral': 'text-gray-600 bg-gray-100'
    };
    return colors[sentiment] || colors.neutral;
  };

  const getIntensityColor = (intensity: string) => {
    const colors: { [key: string]: string } = {
      'high': 'text-red-600 bg-red-100',
      'medium': 'text-yellow-600 bg-yellow-100',
      'low': 'text-green-600 bg-green-100'
    };
    return colors[intensity] || colors.medium;
  };

  const confidencePercentage = Math.round((analysis.confidence || 0) * 100);

  return (
    <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4">
      <div className="flex items-center mb-3">
        <Brain className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="font-semibold text-gray-800">Advanced NLP Analysis</h3>
        {analysis.crisis_detected && (
          <div className="ml-auto flex items-center text-red-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Crisis Detected</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Primary Emotion */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500 font-medium">PRIMARY EMOTION</span>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getEmotionColor(analysis.emotion)}`}>
            {analysis.emotion.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {/* Sentiment */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center mb-2">
            <BarChart3 className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500 font-medium">SENTIMENT</span>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getSentimentColor(analysis.sentiment)}`}>
            {analysis.sentiment.toUpperCase()}
          </div>
        </div>

        {/* Intensity */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center mb-2">
            <Zap className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500 font-medium">INTENSITY</span>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getIntensityColor(analysis.intensity)}`}>
            {analysis.intensity.toUpperCase()}
          </div>
        </div>

        {/* Confidence */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center mb-2">
            <Brain className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500 font-medium">CONFIDENCE</span>
          </div>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${confidencePercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{confidencePercentage}%</span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-600">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
          AI Analysis
        </span>
        This analysis uses advanced natural language processing to understand emotional context and provide appropriate therapeutic responses.
      </div>
    </div>
  );
};

export default AnalysisPanel;