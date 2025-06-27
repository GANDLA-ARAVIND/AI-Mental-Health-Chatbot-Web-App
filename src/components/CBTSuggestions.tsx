import React from 'react';
import { Lightbulb, X, BookOpen } from 'lucide-react';

interface CBTSuggestionsProps {
  suggestions: string[];
  onClose: () => void;
}

const CBTSuggestions: React.FC<CBTSuggestionsProps> = ({ suggestions, onClose }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="border-t border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 p-1 rounded-full">
            <Lightbulb className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Helpful Techniques</h3>
          <div className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            CBT
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-white p-3 rounded-lg border-l-4 border-green-400 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start space-x-2">
              <BookOpen className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-600 flex items-center">
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium mr-2">
          Note
        </span>
        These are general wellness techniques. For persistent concerns, consider speaking with a mental health professional.
      </div>
    </div>
  );
};

export default CBTSuggestions;