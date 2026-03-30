"""
Healthcare Database Module
Handles all data storage and retrieval operations
Uses JSON files for simplicity (can be replaced with MySQL)
"""

import json
import os
import random
from datetime import datetime
from typing import Dict, List, Any, Optional


class HealthcareDatabase:
    """Healthcare Knowledge Database"""

    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        os.makedirs(self.data_dir, exist_ok=True)

        # Initialize knowledge base
        self.knowledge_base = self._initialize_knowledge_base()
        self.first_aid_data = self._initialize_first_aid()
        self.health_tips = self._initialize_health_tips()
        self.conversations_file = os.path.join(
            self.data_dir, 'conversations.json')

    def _initialize_knowledge_base(self) -> Dict:
        """Initialize comprehensive healthcare knowledge base"""
        return {
            'greeting': {
                'responses': [
                    "Hello! I'm your Intelligent Virtual Healthcare Assistant. How can I help you today?",
                    "Hi there! Welcome to your healthcare assistant. What health questions can I answer for you?",
                    "Greetings! I'm here to provide reliable healthcare information. What would you like to know?",
                    "Hello! Ready to help with your health queries. What brings you here today?"
                ],
                'suggestions': [
                    "I have a headache",
                    "What are COVID symptoms?",
                    "First aid for burns",
                    "How to stay healthy?"
                ]
            },
            'symptoms': {
                'responses': [
                    "I understand you're experiencing symptoms. Could you tell me more about what you're feeling? Common symptoms include fever, headache, cough, body ache, nausea, or fatigue.",
                    "Symptoms can indicate various conditions. Please describe your symptoms in detail - when they started, how severe they are, and if you have any other accompanying symptoms."
                ],
                'suggestions': [
                    "Check symptoms for fever",
                    "What causes headache?",
                    "Cough treatment options",
                    "When to see a doctor"
                ]
            },
            'medication': {
                'responses': [
                    "For medication advice, it's important to consult with a healthcare professional. However, I can provide general information about common medications. What specific medication or condition are you asking about?",
                    "Medication should always be taken as prescribed by a doctor. Can you tell me what condition you're trying to treat? I can provide general guidance."
                ],
                'suggestions': [
                    "Pain relief options",
                    "Fever medication",
                    "Cold and flu medicine",
                    "Consult a doctor"
                ]
            },
            'first_aid': {
                'responses': [
                    "First aid is crucial in emergencies. I can guide you through basic first aid procedures. What type of emergency are you dealing with?",
                    "For emergencies, call your local emergency number immediately. I can provide guidance while you wait for help. What happened?"
                ],
                'suggestions': [
                    "First aid for burns",
                    "CPR instructions",
                    "Choking emergency",
                    "Bleeding control"
                ]
            },
            'disease_info': {
                'responses': [
                    "I can provide information about various diseases and health conditions. Which disease or condition would you like to learn about?",
                    "Understanding diseases helps in prevention and management. What specific condition are you interested in?"
                ],
                'suggestions': [
                    "Diabetes information",
                    "Heart disease",
                    "Mental health",
                    "COVID-19 details"
                ]
            },
            'prevention': {
                'responses': [
                    "Prevention is better than cure! I can share preventive measures for various health conditions. What would you like to prevent?",
                    "Healthy lifestyle choices can prevent many diseases. Are you looking for general prevention tips or something specific?"
                ],
                'suggestions': [
                    "Prevent flu",
                    "Heart disease prevention",
                    "Healthy habits",
                    "Vaccination info"
                ]
            },
            'nutrition': {
                'responses': [
                    "Good nutrition is essential for health! I can provide dietary advice and nutritional information. What are your nutrition goals?",
                    "A balanced diet is key to good health. Are you looking for diet plans, nutritional information, or healthy eating tips?"
                ],
                'suggestions': [
                    "Balanced diet tips",
                    "Foods for immunity",
                    "Weight management",
                    "Healthy recipes"
                ]
            },
            'mental_health': {
                'responses': [
                    "Mental health is just as important as physical health. I'm here to listen and provide support. What's on your mind?",
                    "Taking care of your mental wellbeing is crucial. Would you like information about stress management, anxiety, depression, or general mental health tips?"
                ],
                'suggestions': [
                    "Stress relief tips",
                    "Anxiety management",
                    "Sleep better",
                    "Mental health resources"
                ]
            },
            'appointment': {
                'responses': [
                    "It's important to see a healthcare professional for proper diagnosis and treatment. Would you like tips on how to prepare for your doctor's appointment?",
                    "Regular check-ups are essential for maintaining good health. Are you looking to schedule a general check-up or do you have specific concerns?"
                ],
                'suggestions': [
                    "Prepare for appointment",
                    "Find a doctor",
                    "Check-up frequency",
                    "Emergency signs"
                ]
            },
            'general_health': {
                'responses': [
                    "I'm here to help with your health questions! I can provide information on symptoms, diseases, medications, first aid, nutrition, mental health, and more. What would you like to know?",
                    "Your health is important! Ask me about any health-related topic - from common symptoms to disease prevention, I'm here to assist."
                ],
                'suggestions': [
                    "Daily health tips",
                    "Common symptoms",
                    "Healthy lifestyle",
                    "First aid basics"
                ]
            },
            'goodbye': {
                'responses': [
                    "You're welcome! Take care of your health. Feel free to come back anytime you have health questions.",
                    "Goodbye! Stay healthy and don't hesitate to reach out if you need any health information.",
                    "Take care! Remember, your health is your wealth. See you soon!"
                ],
                'suggestions': [
                    "Start new conversation",
                    "Health tips",
                    "Emergency contacts"
                ]
            }
        }

    def _initialize_first_aid(self) -> Dict:
        """Initialize first aid information database"""
        return {
            'burns': {
                'title': 'First Aid for Burns',
                'steps': [
                    'Cool the burn under cool running water for at least 10 minutes',
                    'Remove any jewelry or tight items before swelling occurs',
                    'Do NOT apply ice, butter, or ointments to the burn',
                    'Cover with a sterile, non-stick bandage or clean cloth',
                    'Take over-the-counter pain relievers if needed',
                    'Seek medical attention for severe burns'
                ],
                'when_to_call_emergency': 'If burn is deep, covers large area, or is on face, hands, or genitals'
            },
            'cuts': {
                'title': 'First Aid for Cuts and Bleeding',
                'steps': [
                    'Wash your hands before treating the wound',
                    'Apply gentle pressure with a clean cloth to stop bleeding',
                    'Clean the wound with clean water and mild soap',
                    'Apply an antibiotic ointment if available',
                    'Cover with a sterile bandage',
                    'Change the dressing daily or when wet'
                ],
                'when_to_call_emergency': 'If bleeding does not stop after 10 minutes of pressure'
            },
            'choking': {
                'title': 'First Aid for Choking',
                'steps': [
                    'Encourage the person to cough if they can still breathe',
                    'If unable to breathe, perform the Heimlich maneuver',
                    'Stand behind the person and wrap your arms around their waist',
                    'Make a fist and place it above the navel',
                    'Grasp your fist with the other hand and pull inward and upward',
                    'Repeat until the object is expelled'
                ],
                'when_to_call_emergency': 'Immediately if person cannot breathe, speak, or cough'
            },
            'cpr': {
                'title': 'CPR (Cardiopulmonary Resuscitation)',
                'steps': [
                    'Check if the person is responsive and breathing',
                    'Call emergency services immediately',
                    'Place person on their back on a firm surface',
                    'Give 30 chest compressions (2 inches deep, 100-120 per minute)',
                    'Open airway and give 2 rescue breaths',
                    'Continue cycles of 30 compressions and 2 breaths'
                ],
                'when_to_call_emergency': 'Immediately when person is unresponsive and not breathing'
            },
            'fracture': {
                'title': 'First Aid for Fractures',
                'steps': [
                    'Do not move the person unless absolutely necessary',
                    'Immobilize the injured area with a splint or sturdy material',
                    'Apply ice wrapped in cloth to reduce swelling',
                    'Elevate the injured area if possible',
                    'Watch for signs of shock (pale, cold, rapid breathing)',
                    'Keep person warm and comfortable'
                ],
                'when_to_call_emergency': 'Always - fractures require professional medical treatment'
            },
            'nosebleed': {
                'title': 'First Aid for Nosebleeds',
                'steps': [
                    'Sit upright and lean slightly forward',
                    'Pinch the soft part of the nose firmly',
                    'Breathe through your mouth',
                    'Hold pressure for 10-15 minutes',
                    'Apply ice pack to the bridge of the nose',
                    'Do not lie down or tilt head back'
                ],
                'when_to_call_emergency': 'If bleeding continues for more than 20 minutes'
            },
            'general': {
                'title': 'General First Aid Tips',
                'steps': [
                    'Stay calm and assess the situation',
                    'Ensure the area is safe before helping',
                    'Call emergency services for serious conditions',
                    'Do not move injured person unless in danger',
                    'Keep a first aid kit readily available',
                    'Learn basic first aid and CPR'
                ],
                'when_to_call_emergency': 'For any life-threatening emergency'
            }
        }

    def _initialize_health_tips(self) -> Dict:
        """Initialize health tips database"""
        return {
            'general': [
                "Drink at least 8 glasses of water daily to stay hydrated",
                "Get 7-9 hours of quality sleep every night",
                "Exercise for at least 30 minutes most days of the week",
                "Eat a balanced diet with plenty of fruits and vegetables",
                "Wash your hands frequently to prevent infections",
                "Take regular breaks from screens to protect your eyes",
                "Practice good posture to prevent back pain",
                "Limit processed foods and added sugars",
                "Don't skip breakfast - it fuels your day",
                "Practice deep breathing to reduce stress"
            ],
            'nutrition': [
                "Include colorful vegetables in every meal",
                "Choose whole grains over refined grains",
                "Limit red meat and processed meats",
                "Eat fatty fish twice a week for omega-3s",
                "Include nuts and seeds in your diet",
                "Reduce salt intake to maintain healthy blood pressure",
                "Choose healthy fats like olive oil and avocado",
                "Eat mindfully and avoid distractions while eating",
                "Stay hydrated - thirst is often mistaken for hunger",
                "Plan your meals to make healthier choices"
            ],
            'mental_health': [
                "Practice mindfulness or meditation daily",
                "Stay connected with friends and family",
                "Take time for hobbies and activities you enjoy",
                "Set realistic goals and celebrate small wins",
                "Limit social media if it affects your mood negatively",
                "Get sunlight exposure to boost mood",
                "Practice gratitude - write down things you're thankful for",
                "Seek professional help when needed - it's a sign of strength",
                "Take regular breaks to prevent burnout",
                "Be kind to yourself and practice self-compassion"
            ],
            'exercise': [
                "Start with small, achievable fitness goals",
                "Find an exercise you enjoy to stay motivated",
                "Warm up before exercise and cool down after",
                "Include both cardio and strength training",
                "Take rest days to allow your body to recover",
                "Use stairs instead of elevators when possible",
                "Walk or bike for short trips instead of driving",
                "Stretch daily to maintain flexibility",
                "Listen to your body and don't overdo it",
                "Stay consistent - regular exercise is better than occasional intense workouts"
            ],
            'sleep': [
                "Maintain a consistent sleep schedule",
                "Create a relaxing bedtime routine",
                "Keep your bedroom cool, dark, and quiet",
                "Avoid screens 1 hour before bedtime",
                "Limit caffeine after 2 PM",
                "Avoid heavy meals close to bedtime",
                "Use your bed only for sleep and intimacy",
                "If you can't sleep, get up and do something relaxing",
                "Expose yourself to natural light during the day",
                "Consider relaxation techniques like progressive muscle relaxation"
            ]
        }

    def get_response(self, intent: str, entities: Dict) -> Dict:
        """Get appropriate response based on intent and entities"""
        if intent in self.knowledge_base:
            data = self.knowledge_base[intent]
            response = random.choice(data['responses'])
            suggestions = data.get('suggestions', [])

            # Customize response based on entities
            if entities.get('symptoms'):
                symptom = entities['symptoms'][0]
                response += f"\n\nI noticed you mentioned '{symptom}'. "
                if symptom in ['fever', 'headache', 'cough']:
                    response += "These symptoms could be related to common cold, flu, or other viral infections."
                elif symptom in ['chest pain', 'shortness of breath']:
                    response += "⚠️ These symptoms could be serious. If severe, please seek immediate medical attention."

            return {
                'response': response,
                'confidence': 0.85,
                'suggestions': suggestions
            }

        return {
            'response': "I'm not sure I understand. Could you rephrase your question? I can help with symptoms, diseases, medications, first aid, nutrition, and general health advice.",
            'confidence': 0.5,
            'suggestions': ["General health tips", "Common symptoms", "First aid help"]
        }

    def get_first_aid_info(self, emergency_type: str) -> Dict:
        """Get first aid information for specific emergency"""
        return self.first_aid_data.get(emergency_type.lower(), self.first_aid_data['general'])

    def get_health_tips(self, category: str = 'general') -> List[str]:
        """Get health tips for specific category"""
        return self.health_tips.get(category.lower(), self.health_tips['general'])

    def get_all_topics(self) -> List[str]:
        """Get list of all available health topics"""
        return [
            'Symptoms and Conditions',
            'First Aid',
            'Medications',
            'Disease Information',
            'Prevention',
            'Nutrition and Diet',
            'Mental Health',
            'Exercise and Fitness',
            'Sleep Health',
            'General Wellness'
        ]

    def check_symptoms(self, symptoms: List[str]) -> List[Dict]:
        """Check symptoms and return possible conditions"""
        results = []

        symptom_conditions = {
            'fever': {
                'conditions': ['Common Cold', 'Flu', 'Viral Infection', 'Malaria', 'Typhoid'],
                'severity': 'moderate',
                'advice': 'Rest, stay hydrated, and monitor temperature. See doctor if fever exceeds 103°F or lasts more than 3 days.'
            },
            'headache': {
                'conditions': ['Tension Headache', 'Migraine', 'Sinusitis', 'Eye Strain', 'Dehydration'],
                'severity': 'mild to moderate',
                'advice': 'Rest in a quiet, dark room. Stay hydrated. Over-the-counter pain relievers may help.'
            },
            'cough': {
                'conditions': ['Common Cold', 'Flu', 'Bronchitis', 'Allergies', 'Asthma'],
                'severity': 'mild to moderate',
                'advice': 'Stay hydrated, use honey for soothing (if not allergic), and avoid irritants.'
            },
            'sore throat': {
                'conditions': ['Common Cold', 'Strep Throat', 'Tonsillitis', 'Allergies'],
                'severity': 'mild to moderate',
                'advice': 'Gargle with warm salt water, drink warm fluids, and rest your voice.'
            },
            'stomach pain': {
                'conditions': ['Indigestion', 'Gastritis', 'Food Poisoning', 'Constipation', 'IBS'],
                'severity': 'mild to moderate',
                'advice': 'Avoid spicy and fatty foods. Eat bland foods like BRAT diet (bananas, rice, applesauce, toast).'
            },
            'nausea': {
                'conditions': ['Food Poisoning', 'Motion Sickness', 'Pregnancy', 'Migraine', 'Viral Infection'],
                'severity': 'mild to moderate',
                'advice': 'Eat small, bland meals. Ginger tea may help. Stay hydrated with small sips.'
            },
            'fatigue': {
                'conditions': ['Anemia', 'Thyroid Issues', 'Sleep Disorders', 'Depression', 'Chronic Fatigue'],
                'severity': 'moderate',
                'advice': 'Ensure adequate sleep, eat a balanced diet, and exercise regularly. See doctor if persistent.'
            },
            'shortness of breath': {
                'conditions': ['Asthma', 'Anxiety', 'Heart Issues', 'Pneumonia', 'COVID-19'],
                'severity': 'high',
                'advice': '⚠️ Seek immediate medical attention if severe or accompanied by chest pain.'
            },
            'chest pain': {
                'conditions': ['Heart Attack', 'Angina', 'Acid Reflux', 'Muscle Strain', 'Anxiety'],
                'severity': 'high',
                'advice': '⚠️ CHEST PAIN CAN BE SERIOUS. Call emergency services immediately, especially if accompanied by sweating, nausea, or arm pain.'
            }
        }

        for symptom in symptoms:
            symptom_lower = symptom.lower()
            if symptom_lower in symptom_conditions:
                results.append({
                    'symptom': symptom,
                    **symptom_conditions[symptom_lower]
                })

        return results

    def store_conversation(self, user_message: str, bot_response: str):
        """Store conversation for learning and improvement"""
        conversation = {
            'timestamp': datetime.now().isoformat(),
            'user_message': user_message,
            'bot_response': bot_response
        }

        conversations = []
        if os.path.exists(self.conversations_file):
            try:
                with open(self.conversations_file, 'r') as f:
                    conversations = json.load(f)
            except:
                conversations = []

        conversations.append(conversation)

        # Keep only last 1000 conversations
        conversations = conversations[-1000:]

        with open(self.conversations_file, 'w') as f:
            json.dump(conversations, f, indent=2)
