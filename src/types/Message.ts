export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  emotion?: string;
  sentiment?: string;
  intensity?: string;
  confidence?: number;
}

export interface AnalysisData {
  emotion: string;
  sentiment: string;
  intensity: string;
  confidence: number;
  crisis_detected: boolean;
}