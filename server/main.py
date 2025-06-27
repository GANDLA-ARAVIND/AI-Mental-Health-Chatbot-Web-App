import json
import re
import random
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import urllib.parse
import threading
import time

class MentalHealthNLP:
    def __init__(self):
        # Advanced emotion patterns with context
        self.emotion_patterns = {
            'depression': {
                'keywords': ['depressed', 'hopeless', 'worthless', 'empty', 'numb', 'meaningless', 'pointless', 
                           'dark', 'heavy', 'burden', 'tired of life', 'no energy', 'cant get out of bed',
                           'nothing matters', 'feel like giving up', 'lost interest', 'dont care anymore'],
                'phrases': ['i feel like', 'i am so', 'everything is', 'life is', 'i cant', 'nothing seems'],
                'intensity_words': ['extremely', 'completely', 'totally', 'absolutely', 'really', 'very']
            },
            'anxiety': {
                'keywords': ['anxious', 'worried', 'panic', 'nervous', 'scared', 'afraid', 'terrified', 
                           'overwhelmed', 'stressed', 'tense', 'restless', 'on edge', 'cant relax',
                           'heart racing', 'cant breathe', 'sweating', 'shaking', 'dizzy', 'nauseous'],
                'phrases': ['what if', 'i worry about', 'scared that', 'afraid of', 'panic about'],
                'intensity_words': ['extremely', 'really', 'so', 'very', 'incredibly']
            },
            'anger': {
                'keywords': ['angry', 'furious', 'mad', 'rage', 'frustrated', 'irritated', 'annoyed',
                           'pissed off', 'hate', 'cant stand', 'fed up', 'sick of', 'boiling',
                           'want to scream', 'want to hit', 'losing it', 'explosive'],
                'phrases': ['i hate', 'i cant stand', 'makes me so', 'really pisses me off'],
                'intensity_words': ['extremely', 'really', 'so', 'very', 'incredibly']
            },
            'grief': {
                'keywords': ['loss', 'died', 'death', 'funeral', 'miss', 'gone', 'passed away',
                           'grieving', 'mourning', 'heartbroken', 'devastated', 'lost someone'],
                'phrases': ['i lost', 'they died', 'passed away', 'no longer here', 'miss them'],
                'intensity_words': ['deeply', 'terribly', 'so much', 'incredibly']
            },
            'trauma': {
                'keywords': ['trauma', 'ptsd', 'flashbacks', 'nightmares', 'triggered', 'abuse',
                           'assault', 'accident', 'violence', 'hurt', 'damaged', 'broken',
                           'cant forget', 'haunts me', 'reliving', 'memories wont stop'],
                'phrases': ['happened to me', 'did to me', 'cant get over', 'keeps coming back'],
                'intensity_words': ['severely', 'deeply', 'completely', 'totally']
            },
            'loneliness': {
                'keywords': ['lonely', 'alone', 'isolated', 'no friends', 'no one understands',
                           'disconnected', 'abandoned', 'rejected', 'left out', 'invisible'],
                'phrases': ['i have no one', 'feel so alone', 'nobody cares', 'all by myself'],
                'intensity_words': ['completely', 'totally', 'so', 'really', 'extremely']
            },
            'self_harm': {
                'keywords': ['cut myself', 'hurt myself', 'self harm', 'cutting', 'burning',
                           'want to die', 'suicide', 'kill myself', 'end it all', 'not worth living'],
                'phrases': ['want to hurt', 'thinking about', 'plan to', 'going to'],
                'intensity_words': ['really', 'seriously', 'definitely', 'probably']
            }
        }
        
        # Advanced therapeutic responses with multiple variations
        self.therapeutic_responses = {
            'depression': [
                "I hear how heavy and difficult things feel for you right now. Depression can make everything seem overwhelming and meaningless, but your feelings are valid and you're not alone in this struggle.",
                "What you're experiencing sounds like depression, which is a real medical condition that affects millions of people. The emptiness and hopelessness you feel are symptoms, not reflections of your worth as a person.",
                "Depression can make it feel like you're trapped in darkness, but I want you to know that this feeling, while very real and painful, is temporary. You matter, and there are ways to work through this.",
                "The numbness and lack of energy you're describing are common symptoms of depression. It takes courage to reach out and talk about these feelings - that's already a step toward healing."
            ],
            'anxiety': [
                "Anxiety can feel overwhelming and all-consuming. The physical symptoms you're experiencing - racing heart, difficulty breathing - are your body's natural response to perceived threat, even when you're safe.",
                "What you're describing sounds like anxiety, which can create a cycle of worry and physical symptoms. Remember that anxiety lies to us about danger that often isn't real or as severe as it seems.",
                "The 'what if' thoughts and constant worry are hallmarks of anxiety. Your mind is trying to protect you by preparing for every possible scenario, but this can become exhausting and counterproductive.",
                "Panic and anxiety can feel terrifying, but they cannot actually harm you. These intense feelings will pass, and there are techniques we can explore to help you manage them."
            ],
            'anger': [
                "Anger is often a secondary emotion that masks hurt, frustration, or feeling powerless. It's okay to feel angry - it's a valid emotion that's telling you something important about your needs or boundaries.",
                "The intensity of your anger suggests there might be deeper pain or unmet needs underneath. Anger can be protective, but it can also isolate us from others when we need support most.",
                "Feeling this level of rage and frustration must be exhausting. Anger often signals that something important to us is being threatened or that we feel unheard or invalidated.",
                "Your anger is valid, and it's important to acknowledge it rather than suppress it. The key is finding healthy ways to express and process these intense feelings."
            ],
            'grief': [
                "Losing someone important to you is one of life's most profound and painful experiences. Grief is love with nowhere to go, and the pain you feel reflects the depth of your connection.",
                "There's no 'right' way to grieve or timeline for healing. Your loss is significant, and it's natural to feel devastated, confused, or even angry. All of these feelings are part of the grieving process.",
                "The person you lost clearly meant a great deal to you. Grief can feel overwhelming, but it's also a testament to the love and bond you shared. That love doesn't disappear, even though they're gone.",
                "Grief comes in waves and can feel unpredictable. Some days might feel manageable, others overwhelming. This is normal, and it's important to be patient and gentle with yourself through this process."
            ],
            'trauma': [
                "Trauma can have lasting effects on how we see ourselves and the world. The flashbacks, nightmares, and intrusive memories you're experiencing are your mind's way of trying to process something overwhelming.",
                "What happened to you was significant and has understandably affected you deeply. Trauma can make us feel broken or damaged, but you are not defined by what happened to you.",
                "The symptoms you're describing - being triggered, reliving memories - are common responses to trauma. Your reactions are normal responses to abnormal experiences.",
                "Healing from trauma takes time and often professional support. You've survived something difficult, which shows your strength, even if you don't feel strong right now."
            ],
            'loneliness': [
                "Feeling isolated and disconnected from others is deeply painful. Humans are social beings, and loneliness can affect us both emotionally and physically. Your need for connection is valid and important.",
                "Loneliness can create a cycle where we withdraw further, making it harder to connect with others. It's not a reflection of your worth or likability - sometimes it's about circumstances, social anxiety, or past hurts.",
                "The feeling that no one understands or cares can be overwhelming. Sometimes loneliness persists even when we're around people, which can feel even more confusing and painful.",
                "Reaching out, even in small ways, takes courage when you're feeling isolated. Building connections often starts with small steps and being patient with the process."
            ],
            'self_harm': [
                "I'm very concerned about what you're sharing. Thoughts of self-harm or suicide are signs that you're in significant emotional pain. Please know that you don't have to face this alone.",
                "The thoughts you're having about hurting yourself are a sign that you need immediate support. These feelings can be temporary, even when they feel permanent. Please reach out to a crisis helpline or emergency services.",
                "When we're in intense emotional pain, sometimes hurting ourselves can feel like the only way to cope or communicate our distress. But there are other ways to manage these feelings, and people who want to help.",
                "If you're having thoughts of suicide or self-harm, please contact a mental health professional or crisis line immediately. Your life has value, and there are people trained to help you through this crisis."
            ]
        }
        
        # CBT techniques mapped to emotions
        self.cbt_techniques = {
            'depression': [
                "Behavioral Activation: Try to engage in one small activity you used to enjoy, even if you don't feel like it. Start with just 5-10 minutes.",
                "Thought Record: Write down negative thoughts and examine the evidence for and against them. Ask: 'Is this thought helpful or accurate?'",
                "Daily Structure: Create a simple daily routine with small, achievable goals. This can help combat the lack of motivation depression brings.",
                "Gratitude Practice: Each day, try to identify three small things you're grateful for, even if they seem insignificant.",
                "Self-Compassion: Speak to yourself as you would a good friend. Depression often comes with harsh self-criticism."
            ],
            'anxiety': [
                "Grounding Technique (5-4-3-2-1): Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
                "Box Breathing: Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat until you feel calmer.",
                "Worry Time: Set aside 15 minutes daily to worry. When anxious thoughts arise outside this time, remind yourself to save them for 'worry time.'",
                "Catastrophic Thinking Challenge: Ask yourself 'What's the worst that could realistically happen?' and 'How would I cope if it did?'",
                "Progressive Muscle Relaxation: Tense and release each muscle group in your body, starting from your toes and working up."
            ],
            'anger': [
                "STOP Technique: Stop what you're doing, Take a breath, Observe your feelings and thoughts, Proceed mindfully.",
                "Anger Log: Track what triggers your anger, your thoughts, physical sensations, and how you responded. Look for patterns.",
                "Reframing: Ask 'Is there another way to look at this situation?' or 'What would I tell a friend in this situation?'",
                "Physical Release: Engage in intense physical activity like running, boxing a pillow, or doing jumping jacks to release tension.",
                "Time-Out Strategy: Remove yourself from the triggering situation for 20-30 minutes to cool down before responding."
            ],
            'grief': [
                "Memory Box: Create a collection of photos, letters, or items that remind you of your loved one. Visit it when you want to feel connected.",
                "Letter Writing: Write letters to your loved one expressing things you wish you could say. This can help process unfinished business.",
                "Grief Journaling: Write about your feelings, memories, and the impact of your loss. There's no right or wrong way to do this.",
                "Ritual Creation: Develop meaningful ways to honor your loved one on special dates or when you're missing them particularly.",
                "Support Connection: Reach out to others who have experienced similar losses. Grief can feel very isolating, but you're not alone."
            ],
            'trauma': [
                "Grounding Techniques: Use your senses to stay present. Hold an ice cube, listen to calming music, or focus on your breathing.",
                "Safe Place Visualization: Create a detailed mental image of a place where you feel completely safe and calm. Practice going there in your mind.",
                "Body Awareness: Notice where you hold tension or trauma in your body. Gentle stretching or yoga can help release physical stress.",
                "Trigger Identification: Keep track of what situations, sounds, or smells trigger flashbacks so you can prepare coping strategies.",
                "Self-Care Routine: Establish consistent daily self-care practices that help you feel grounded and safe."
            ],
            'loneliness': [
                "Social Exposure: Start small - make eye contact with a cashier, say hello to a neighbor, or comment on a social media post.",
                "Volunteer Work: Helping others can provide purpose and natural opportunities to connect with like-minded people.",
                "Interest-Based Groups: Join clubs, classes, or online communities centered around your hobbies or interests.",
                "Self-Relationship: Practice enjoying your own company through activities you find meaningful or relaxing.",
                "Reach Out Practice: Send one text or make one call to someone each week, even if it's just to say hello."
            ]
        }
        
        # Crisis keywords that require immediate attention
        self.crisis_keywords = [
            'suicide', 'kill myself', 'end it all', 'not worth living', 'want to die',
            'plan to hurt', 'going to hurt', 'cutting myself', 'overdose', 'jump off'
        ]
        
    def analyze_text(self, text):
        """Advanced NLP analysis of user input"""
        text_lower = text.lower()
        
        # Check for crisis situations first
        crisis_detected = any(keyword in text_lower for keyword in self.crisis_keywords)
        
        # Emotion detection with scoring
        emotion_scores = {}
        detected_emotions = []
        
        for emotion, patterns in self.emotion_patterns.items():
            score = 0
            
            # Check keywords
            for keyword in patterns['keywords']:
                if keyword in text_lower:
                    score += 2
                    
            # Check phrases with context
            for phrase in patterns['phrases']:
                if phrase in text_lower:
                    score += 3
                    
            # Check intensity modifiers
            for intensity in patterns['intensity_words']:
                if intensity in text_lower:
                    score += 1
                    
            emotion_scores[emotion] = score
            if score > 0:
                detected_emotions.append(emotion)
        
        # Determine primary emotion
        primary_emotion = max(emotion_scores.items(), key=lambda x: x[1])[0] if emotion_scores else 'neutral'
        
        # Sentiment analysis
        sentiment = self.analyze_sentiment(text)
        
        # Intensity analysis
        intensity = self.analyze_intensity(text)
        
        return {
            'primary_emotion': primary_emotion,
            'all_emotions': detected_emotions,
            'emotion_scores': emotion_scores,
            'sentiment': sentiment,
            'intensity': intensity,
            'crisis_detected': crisis_detected,
            'text_length': len(text.split()),
            'question_detected': '?' in text
        }
    
    def analyze_sentiment(self, text):
        """Simple but effective sentiment analysis"""
        positive_words = ['good', 'great', 'happy', 'joy', 'love', 'wonderful', 'amazing', 'excellent', 'fantastic', 'better', 'improving', 'hopeful', 'grateful', 'thankful', 'blessed', 'peaceful', 'calm', 'relaxed', 'confident', 'strong', 'proud', 'accomplished', 'successful', 'excited', 'optimistic']
        negative_words = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'sad', 'depressed', 'angry', 'frustrated', 'worried', 'anxious', 'scared', 'afraid', 'hopeless', 'worthless', 'empty', 'lonely', 'isolated', 'overwhelmed', 'stressed', 'tired', 'exhausted', 'broken', 'damaged', 'hurt', 'pain', 'suffering', 'struggling', 'difficult', 'hard', 'impossible', 'can\'t', 'won\'t', 'never', 'nothing', 'nobody', 'no one']
        
        words = text.lower().split()
        positive_count = sum(1 for word in words if any(pos in word for pos in positive_words))
        negative_count = sum(1 for word in words if any(neg in word for neg in negative_words))
        
        if negative_count > positive_count:
            return 'negative'
        elif positive_count > negative_count:
            return 'positive'
        else:
            return 'neutral'
    
    def analyze_intensity(self, text):
        """Analyze emotional intensity"""
        intensity_indicators = {
            'high': ['extremely', 'completely', 'totally', 'absolutely', 'really really', 'so so', 'very very', 'incredibly', 'unbearably', 'overwhelmingly'],
            'medium': ['very', 'really', 'quite', 'pretty', 'fairly', 'somewhat', 'rather'],
            'low': ['a little', 'slightly', 'kind of', 'sort of', 'maybe', 'perhaps']
        }
        
        text_lower = text.lower()
        
        for level, indicators in intensity_indicators.items():
            if any(indicator in text_lower for indicator in indicators):
                return level
                
        return 'medium'  # default
    
    def generate_response(self, analysis, user_text):
        """Generate contextual therapeutic response"""
        if analysis['crisis_detected']:
            return self.generate_crisis_response()
        
        primary_emotion = analysis['primary_emotion']
        intensity = analysis['intensity']
        sentiment = analysis['sentiment']
        
        # Select appropriate response
        if primary_emotion in self.therapeutic_responses:
            responses = self.therapeutic_responses[primary_emotion]
            base_response = random.choice(responses)
        else:
            base_response = self.generate_neutral_response(user_text, analysis)
        
        # Add intensity-appropriate language
        if intensity == 'high':
            base_response = f"I can hear how intensely you're feeling this. {base_response}"
        elif intensity == 'low':
            base_response = f"Even though these feelings might seem small, they're still important. {base_response}"
        
        return base_response
    
    def generate_crisis_response(self):
        """Generate immediate crisis intervention response"""
        crisis_responses = [
            "I'm very concerned about what you're sharing. If you're having thoughts of hurting yourself, please reach out for immediate help. In the US, you can call 988 (Suicide & Crisis Lifeline) or text 'HELLO' to 741741 (Crisis Text Line). You don't have to face this alone.",
            "What you're describing sounds like you might be in crisis. Please consider reaching out to a mental health professional or crisis line immediately. Your safety is the most important thing right now. The 988 Lifeline is available 24/7.",
            "I'm worried about your safety based on what you've shared. Please know that these intense feelings can be temporary, even when they feel permanent. Reach out to 988 or go to your nearest emergency room if you're in immediate danger."
        ]
        return random.choice(crisis_responses)
    
    def generate_neutral_response(self, user_text, analysis):
        """Generate response for neutral or unclear input"""
        if analysis['question_detected']:
            return "That's a thoughtful question. I'm here to listen and support you. Can you tell me more about what's on your mind or how you're feeling right now?"
        
        neutral_responses = [
            "Thank you for sharing that with me. I'm here to listen and support you. How are you feeling about what you've shared?",
            "I hear you. It sounds like you have some important thoughts and feelings you're processing. Would you like to explore any of this further?",
            "I appreciate you opening up. Sometimes it helps just to put our thoughts into words. What feels most important for you to talk about right now?",
            "It takes courage to reach out and share personal thoughts. I'm here to provide a safe space for you to express whatever is on your mind."
        ]
        return random.choice(neutral_responses)
    
    def get_cbt_techniques(self, primary_emotion):
        """Get relevant CBT techniques"""
        if primary_emotion in self.cbt_techniques:
            return random.sample(self.cbt_techniques[primary_emotion], min(3, len(self.cbt_techniques[primary_emotion])))
        return []

class ChatHandler(BaseHTTPRequestHandler):
    nlp_processor = MentalHealthNLP()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        if self.path == '/api/chat':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                user_message = data.get('message', '')
                
                if not user_message.strip():
                    self.send_error_response('Message cannot be empty')
                    return
                
                # Simulate processing time for realism
                time.sleep(0.5 + random.random() * 1.0)
                
                # Analyze the message
                analysis = self.nlp_processor.analyze_text(user_message)
                
                # Generate response
                response_text = self.nlp_processor.generate_response(analysis, user_message)
                
                # Get CBT techniques if applicable
                cbt_techniques = self.nlp_processor.get_cbt_techniques(analysis['primary_emotion'])
                
                response_data = {
                    'id': str(int(time.time() * 1000)),
                    'response': response_text,
                    'emotion': analysis['primary_emotion'],
                    'sentiment': analysis['sentiment'],
                    'intensity': analysis['intensity'],
                    'cbtSuggestions': cbt_techniques,
                    'crisis_detected': analysis['crisis_detected'],
                    'confidence': min(max(analysis['emotion_scores'].get(analysis['primary_emotion'], 0) / 5, 0.1), 1.0),
                    'timestamp': datetime.now().isoformat()
                }
                
                self.send_json_response(response_data)
                
            except Exception as e:
                print(f"Error processing request: {e}")
                self.send_error_response('Internal server error')
    
    def send_json_response(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def send_error_response(self, message):
        self.send_response(400)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        error_data = {'error': message}
        self.wfile.write(json.dumps(error_data).encode('utf-8'))

def run_server():
    server_address = ('', 3001)
    httpd = HTTPServer(server_address, ChatHandler)
    print(f"Advanced Mental Health Chatbot server running on port 3001")
    print("Advanced NLP processing with emotion detection, sentiment analysis, and CBT techniques")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()