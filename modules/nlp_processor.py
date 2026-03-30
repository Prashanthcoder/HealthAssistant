"""
NLP Processor Module for Healthcare Chatbot
Implements intent recognition and entity extraction using pattern matching
and keyword analysis (simulating NLP without heavy ML dependencies)
"""

import re
import json
import os
from typing import Dict, List, Tuple, Any


class HealthcareNLP:
    """Natural Language Processing for Healthcare Queries"""

    def __init__(self):
        self.intent_patterns = self._load_intent_patterns()
        self.medical_keywords = self._load_medical_keywords()
        self.symptoms_db = self._load_symptoms_database()

    def _load_intent_patterns(self) -> Dict:
        """Load intent recognition patterns"""
        return {
            'greeting': {
                'patterns': [
                    r'\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b',
                    r'\bhow are you\b',
                    r'\bstart\b'
                ],
                'keywords': ['hi', 'hello', 'hey', 'morning', 'afternoon', 'evening']
            },
            'symptoms': {
                'patterns': [
                    r'\b(i have|i am feeling|i feel|suffering from|experiencing)\b.*\b(pain|fever|cough|headache|nausea|dizziness|fatigue)\b',
                    r'\bsymptoms?\b.*\b(of|for)\b',
                    r'\bwhat\b.*\bsymptoms?\b',
                    r'\b(i am|i\'m)\b.*\b(sick|ill|unwell|not feeling well)\b'
                ],
                'keywords': ['symptom', 'pain', 'fever', 'cough', 'headache', 'nausea', 'dizzy', 'tired', 'sick', 'ill']
            },
            'medication': {
                'patterns': [
                    r'\b(medicine|medication|drug|pill|tablet|capsule|dose|dosage)\b',
                    r'\bwhat\b.*\b(should i take|can i take|medicine for)\b',
                    r'\btreatment\b.*\bfor\b'
                ],
                'keywords': ['medicine', 'medication', 'drug', 'pill', 'tablet', 'treatment', 'cure', 'remedy']
            },
            'first_aid': {
                'patterns': [
                    r'\b(first aid|emergency|urgent|accident|injury|wound|bleeding|burn|fracture)\b',
                    r'\bwhat\b.*\b(should i do|to do)\b.*\b(emergency|accident|injury)\b',
                    r'\bhelp\b.*\b(emergency|accident|injured|hurt)\b'
                ],
                'keywords': ['first aid', 'emergency', 'urgent', 'accident', 'injury', 'bleeding', 'burn', 'fracture', 'choking']
            },
            'disease_info': {
                'patterns': [
                    r'\b(what is|tell me about|information about|details about)\b.*\b(disease|condition|disorder|illness|syndrome)\b',
                    r'\b(disease|condition|disorder)\b.*\b(information|details|explain)\b',
                    r'\b(caused by|causes of|symptoms of)\b.*\b(disease|condition)\b'
                ],
                'keywords': ['disease', 'condition', 'disorder', 'illness', 'diabetes', 'hypertension', 'asthma', 'cancer']
            },
            'prevention': {
                'patterns': [
                    r'\b(prevent|avoid|stop|reduce risk|prevention)\b',
                    r'\bhow\b.*\b(prevent|avoid|stop)\b',
                    r'\b(preventive|precautionary)\b.*\b(measures|steps)\b'
                ],
                'keywords': ['prevent', 'avoid', 'prevention', 'precaution', 'protect', 'reduce risk']
            },
            'nutrition': {
                'patterns': [
                    r'\b(diet|nutrition|food|eat|eating|meal|healthy food)\b',
                    r'\bwhat\b.*\b(should i eat|to eat|diet for)\b',
                    r'\b(healthy|good|nutritious)\b.*\b(food|diet|eating)\b'
                ],
                'keywords': ['diet', 'nutrition', 'food', 'eat', 'healthy', 'vitamin', 'protein', 'calories']
            },
            'mental_health': {
                'patterns': [
                    r'\b(stress|anxiety|depression|mental health|worried|sad|anxious)\b',
                    r'\b(feeling|feel)\b.*\b(stressed|anxious|depressed|sad|worried)\b',
                    r'\b(mental|emotional|psychological)\b.*\b(health|wellbeing|issue|problem)\b'
                ],
                'keywords': ['stress', 'anxiety', 'depression', 'mental', 'worried', 'sad', 'anxious', 'panic']
            },
            'appointment': {
                'patterns': [
                    r'\b(appointment|consultation|see a doctor|visit doctor|schedule)\b',
                    r'\b(when|how)\b.*\b(see|consult|visit)\b.*\b(doctor|physician|specialist)\b',
                    r'\b(book|make|schedule)\b.*\b(appointment)\b'
                ],
                'keywords': ['appointment', 'consult', 'doctor', 'physician', 'specialist', 'schedule', 'book']
            },
            'general_health': {
                'patterns': [
                    r'\b(health|healthy|wellness|wellbeing|fitness)\b',
                    r'\b(how to stay|tips for|advice on)\b.*\b(healthy|health|fit)\b',
                    r'\b(general|overall)\b.*\b(health|wellness)\b'
                ],
                'keywords': ['health', 'healthy', 'wellness', 'fitness', 'exercise', 'lifestyle']
            },
            'goodbye': {
                'patterns': [
                    r'\b(bye|goodbye|see you|take care|thanks|thank you)\b',
                    r'\b(thank|thanks)\b.*\b(you|help|assistance)\b',
                    r'\bthat\'s all|done|finished\b'
                ],
                'keywords': ['bye', 'goodbye', 'thanks', 'thank', 'done', 'finished']
            }
        }

    def _load_medical_keywords(self) -> Dict:
        """Load medical keywords for entity recognition"""
        return {
            'body_parts': [
                'head', 'chest', 'stomach', 'abdomen', 'back', 'neck', 'throat',
                'arm', 'leg', 'hand', 'foot', 'eye', 'ear', 'nose', 'mouth',
                'heart', 'lungs', 'liver', 'kidney', 'brain', 'skin', 'muscle',
                'joint', 'bone', 'tooth', 'teeth', 'knee', 'shoulder', 'wrist'
            ],
            'symptoms': [
                'pain', 'ache', 'fever', 'cough', 'cold', 'headache', 'migraine',
                'nausea', 'vomiting', 'diarrhea', 'constipation', 'dizziness',
                'fatigue', 'tiredness', 'weakness', 'shortness of breath',
                'chest pain', 'palpitation', 'sweating', 'chills', 'rash',
                'itching', 'swelling', 'bruising', 'bleeding', 'numbness',
                'tingling', 'blurred vision', 'sore throat', 'runny nose'
            ],
            'diseases': [
                'diabetes', 'hypertension', 'asthma', 'arthritis', 'cancer',
                'migraine', 'depression', 'anxiety', 'flu', 'cold', 'pneumonia',
                'bronchitis', 'malaria', 'dengue', 'typhoid', 'tuberculosis',
                'covid', 'coronavirus', 'heart disease', 'stroke', 'epilepsy'
            ],
            'medications': [
                'paracetamol', 'aspirin', 'ibuprofen', 'antibiotic', 'antiviral',
                'insulin', 'inhaler', 'ointment', 'cream', 'syrup', 'tablet',
                'capsule', 'injection', 'vaccine', 'vitamin', 'supplement'
            ]
        }

    def _load_symptoms_database(self) -> Dict:
        """Load symptoms to conditions mapping"""
        return {
            'fever': {
                'conditions': ['Flu', 'Common Cold', 'Malaria', 'Typhoid', 'COVID-19', 'Viral Infection'],
                'severity': 'moderate',
                'when_to_see_doctor': 'If fever persists for more than 3 days or exceeds 103°F (39.4°C)'
            },
            'headache': {
                'conditions': ['Tension Headache', 'Migraine', 'Sinusitis', 'Eye Strain', 'Dehydration'],
                'severity': 'mild to moderate',
                'when_to_see_doctor': 'If headache is severe, sudden, or accompanied by other symptoms'
            },
            'cough': {
                'conditions': ['Common Cold', 'Flu', 'Bronchitis', 'Pneumonia', 'Asthma', 'Allergies'],
                'severity': 'mild to moderate',
                'when_to_see_doctor': 'If cough persists for more than 2 weeks or produces blood'
            },
            'chest_pain': {
                'conditions': ['Heart Attack', 'Angina', 'Acid Reflux', 'Muscle Strain', 'Anxiety'],
                'severity': 'high',
                'when_to_see_doctor': 'Immediately - chest pain can be serious'
            },
            'stomach_pain': {
                'conditions': ['Indigestion', 'Gastritis', 'Food Poisoning', 'Appendicitis', 'IBS'],
                'severity': 'mild to high',
                'when_to_see_doctor': 'If pain is severe, persistent, or accompanied by vomiting'
            },
            'shortness_of_breath': {
                'conditions': ['Asthma', 'Pneumonia', 'Heart Failure', 'Anxiety', 'COVID-19'],
                'severity': 'high',
                'when_to_see_doctor': 'Immediately if severe or accompanied by chest pain'
            },
            'rash': {
                'conditions': ['Allergic Reaction', 'Eczema', 'Psoriasis', 'Chickenpox', 'Measles'],
                'severity': 'mild to moderate',
                'when_to_see_doctor': 'If rash spreads rapidly or is accompanied by fever'
            }
        }

    def process_query(self, query: str) -> Tuple[str, Dict]:
        """
        Process user query and identify intent and entities
        Returns: (intent, entities_dict)
        """
        query_lower = query.lower().strip()

        # Identify intent
        intent = self._identify_intent(query_lower)

        # Extract entities
        entities = self._extract_entities(query_lower)

        return intent, entities

    def _identify_intent(self, query: str) -> str:
        """Identify the intent of the user query"""
        intent_scores = {}

        for intent_name, intent_data in self.intent_patterns.items():
            score = 0

            # Check regex patterns
            for pattern in intent_data['patterns']:
                if re.search(pattern, query, re.IGNORECASE):
                    score += 3  # Higher weight for pattern matches

            # Check keywords
            for keyword in intent_data['keywords']:
                if keyword in query:
                    score += 1

            intent_scores[intent_name] = score

        # Return intent with highest score, default to general_health
        if max(intent_scores.values(), default=0) > 0:
            return max(intent_scores, key=intent_scores.get)

        return 'general_health'

    def _extract_entities(self, query: str) -> Dict:
        """Extract medical entities from the query"""
        entities = {
            'body_parts': [],
            'symptoms': [],
            'diseases': [],
            'medications': []
        }

        # Extract body parts
        for part in self.medical_keywords['body_parts']:
            if part in query:
                entities['body_parts'].append(part)

        # Extract symptoms
        for symptom in self.medical_keywords['symptoms']:
            if symptom in query:
                entities['symptoms'].append(symptom)

        # Extract diseases
        for disease in self.medical_keywords['diseases']:
            if disease in query:
                entities['diseases'].append(disease)

        # Extract medications
        for med in self.medical_keywords['medications']:
            if med in query:
                entities['medications'].append(med)

        return entities

    def analyze_symptoms(self, symptoms: List[str]) -> List[Dict]:
        """Analyze symptoms and return possible conditions"""
        results = []

        for symptom in symptoms:
            symptom_key = symptom.lower().replace(' ', '_')
            if symptom_key in self.symptoms_db:
                data = self.symptoms_db[symptom_key]
                results.append({
                    'symptom': symptom,
                    'possible_conditions': data['conditions'],
                    'severity': data['severity'],
                    'when_to_see_doctor': data['when_to_see_doctor']
                })

        return results

    def get_sentiment(self, query: str) -> str:
        """Simple sentiment analysis for user query"""
        positive_words = ['good', 'great', 'excellent',
                          'happy', 'better', 'relief', 'thanks']
        negative_words = ['bad', 'worst', 'terrible', 'pain',
                          'hurt', 'suffering', 'worried', 'scared', 'afraid']

        query_lower = query.lower()

        positive_count = sum(
            1 for word in positive_words if word in query_lower)
        negative_count = sum(
            1 for word in negative_words if word in query_lower)

        if negative_count > positive_count:
            return 'negative'
        elif positive_count > negative_count:
            return 'positive'
        else:
            return 'neutral'
