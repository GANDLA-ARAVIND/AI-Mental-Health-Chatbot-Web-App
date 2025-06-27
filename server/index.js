import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock emotion detection responses
const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'];

// Mock sentiment analysis
function analyzeSentiment(text) {
  const negativeWords = ['sad', 'depressed', 'anxious', 'worried', 'scared', 'angry', 'hopeless', 'down', 'upset', 'stressed'];
  const positiveWords = ['happy', 'joy', 'excited', 'good', 'great', 'wonderful', 'amazing', 'love', 'excellent', 'fantastic'];
  
  const words = text.toLowerCase().split(' ');
  let score = 0;
  
  words.forEach(word => {
    if (negativeWords.some(neg => word.includes(neg))) score -= 1;
    if (positiveWords.some(pos => word.includes(pos))) score += 1;
  });
  
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

// Mock emotion detection
function detectEmotion(text) {
  const sadWords = ['sad', 'depressed', 'down', 'hopeless', 'lonely', 'empty'];
  const angryWords = ['angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated'];
  const fearWords = ['scared', 'afraid', 'anxious', 'worried', 'nervous', 'terrified'];
  const joyWords = ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing'];
  
  const words = text.toLowerCase().split(' ');
  
  if (words.some(word => sadWords.some(sad => word.includes(sad)))) return 'sadness';
  if (words.some(word => angryWords.some(angry => word.includes(angry)))) return 'anger';
  if (words.some(word => fearWords.some(fear => word.includes(fear)))) return 'fear';
  if (words.some(word => joyWords.some(joy => word.includes(joy)))) return 'joy';
  
  return 'neutral';
}

// CBT techniques for different emotions
const cbtTechniques = {
  sadness: [
    "Try deep breathing: Inhale for 4 counts, hold for 4, exhale for 6.",
    "Consider journaling about what you're grateful for today.",
    "Challenge negative thoughts: Is this thought helpful or realistic?",
    "Engage in a small activity you usually enjoy, even if you don't feel like it."
  ],
  anger: [
    "Practice the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.",
    "Try progressive muscle relaxation starting from your toes.",
    "Reframe the situation: What would you tell a friend in this situation?",
    "Take a 10-minute walk to help process these feelings."
  ],
  fear: [
    "Use the STOP technique: Stop, Take a breath, Observe, Proceed mindfully.",
    "Question your fears: What evidence do I have? What's the worst that could realistically happen?",
    "Practice mindfulness: Focus on the present moment rather than future worries.",
    "Try box breathing: Breathe in for 4, hold for 4, out for 4, hold for 4."
  ]
};

// Generate contextual responses
function generateResponse(text, emotion, sentiment) {
  const responses = {
    sadness: [
      "I hear that you're going through a difficult time. Your feelings are valid, and it's okay to feel sad sometimes.",
      "It sounds like you're experiencing some tough emotions right now. Would you like to talk more about what's troubling you?",
      "I'm here to listen and support you. Sadness is a natural human emotion, and you don't have to face it alone."
    ],
    anger: [
      "I can sense your frustration. It's completely normal to feel angry sometimes, and I'm here to help you work through it.",
      "Your anger is telling you something important. Let's explore what might be behind these feelings.",
      "It's okay to feel angry. What matters is how we process and respond to these emotions in healthy ways."
    ],
    fear: [
      "I understand you're feeling anxious or worried. These feelings can be overwhelming, but they're temporary.",
      "Anxiety can feel very real and intense. Let's work together to find some strategies that might help you feel more grounded.",
      "Fear is a natural response, but it doesn't have to control you. You're stronger than you know."
    ],
    joy: [
      "It's wonderful to hear some positivity! I'm glad you're experiencing some joy today.",
      "That sounds really great! It's important to acknowledge and celebrate these positive moments.",
      "I'm happy to hear that! Positive emotions are just as important to process and appreciate."
    ],
    neutral: [
      "Thank you for sharing that with me. How are you feeling right now?",
      "I'm here to listen and support you. What's on your mind today?",
      "It sounds like you have some thoughts you'd like to explore. I'm here to help."
    ]
  };
  
  const emotionResponses = responses[emotion] || responses.neutral;
  return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const emotion = detectEmotion(message);
    const sentiment = analyzeSentiment(message);
    const response = generateResponse(message, emotion, sentiment);
    
    // Get CBT techniques if negative emotion
    const cbtSuggestions = ['sadness', 'anger', 'fear'].includes(emotion) 
      ? cbtTechniques[emotion] || []
      : [];
    
    res.json({
      id: uuidv4(),
      response,
      emotion,
      sentiment,
      cbtSuggestions,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Mental Health Chatbot server running on port ${PORT}`);
});