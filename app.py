"""
Intelligent Virtual Healthcare Assistant
Flask Backend Application
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import os
from modules.nlp_processor import HealthcareNLP
from modules.database import HealthcareDatabase

app = Flask(__name__)
CORS(app)

# Initialize components
nlp_processor = HealthcareNLP()
database = HealthcareDatabase()

@app.route('/')
def index():
    """Render the main chatbot interface"""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Process user healthcare queries and return responses"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({
                'success': False,
                'error': 'Please enter a valid question'
            }), 400
        
        # Process the query using NLP
        intent, entities = nlp_processor.process_query(user_message)
        
        # Get response from database based on intent
        response_data = database.get_response(intent, entities)
        
        # Store the conversation for learning
        database.store_conversation(user_message, response_data['response'])
        
        return jsonify({
            'success': True,
            'response': response_data['response'],
            'intent': intent,
            'confidence': response_data.get('confidence', 0.85),
            'suggestions': response_data.get('suggestions', [])
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health-topics', methods=['GET'])
def get_health_topics():
    """Get list of available health topics"""
    topics = database.get_all_topics()
    return jsonify({
        'success': True,
        'topics': topics
    })

@app.route('/api/first-aid', methods=['GET'])
def get_first_aid():
    """Get first aid information"""
    emergency_type = request.args.get('type', 'general')
    first_aid_info = database.get_first_aid_info(emergency_type)
    return jsonify({
        'success': True,
        'data': first_aid_info
    })

@app.route('/api/symptoms-checker', methods=['POST'])
def symptoms_checker():
    """Check symptoms and provide possible conditions"""
    try:
        data = request.get_json()
        symptoms = data.get('symptoms', [])
        
        if not symptoms:
            return jsonify({
                'success': False,
                'error': 'Please provide symptoms'
            }), 400
        
        conditions = database.check_symptoms(symptoms)
        
        return jsonify({
            'success': True,
            'conditions': conditions
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health-tips', methods=['GET'])
def get_health_tips():
    """Get daily health tips"""
    category = request.args.get('category', 'general')
    tips = database.get_health_tips(category)
    return jsonify({
        'success': True,
        'tips': tips
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)