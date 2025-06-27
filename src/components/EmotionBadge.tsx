import React from 'react';
import { Heart, Frown, Angry, AlertCircle, Smile, Meh, Cloud, Users, Scissors } from 'lucide-react';

interface EmotionBadgeProps {
  emotion: string;
}

const EmotionBadge: React.FC<EmotionBadgeProps> = ({ emotion }) => {
  const getEmotionConfig = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'joy':
        return { icon: Smile, color: 'bg-green-100 text-green-700', label: 'Joy' };
      case 'depression':
        return { icon: Cloud, color: 'bg-blue-100 text-blue-700', label: 'Depression' };
      case 'anxiety':
        return { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700', label: 'Anxiety' };
      case 'anger':
        return { icon: Angry, color: 'bg-red-100 text-red-700', label: 'Anger' };
      case 'grief':
        return { icon: Heart, color: 'bg-purple-100 text-purple-700', label: 'Grief' };
      case 'trauma':
        return { icon: AlertCircle, color: 'bg-orange-100 text-orange-700', label: 'Trauma' };
      case 'loneliness':
        return { icon: Users, color: 'bg-indigo-100 text-indigo-700', label: 'Loneliness' };
      case 'self_harm':
        return { icon: Scissors, color: 'bg-red-200 text-red-800', label: 'Self-Harm' };
      case 'sadness':
        return { icon: Frown, color: 'bg-blue-100 text-blue-700', label: 'Sadness' };
      case 'fear':
        return { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700', label: 'Fear' };
      default:
        return { icon: Meh, color: 'bg-gray-100 text-gray-600', label: 'Neutral' };
    }
  };

  const { icon: Icon, color, label } = getEmotionConfig(emotion);

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </div>
  );
};

export default EmotionBadge;