/**
 * Intelligent Virtual Healthcare Assistant
 * Frontend JavaScript Application - Fully Client-Side
 */

// ============================================
// GLOBAL STATE
// ============================================
const state = {
    currentSection: 'chat',
    messages: [],
    selectedSymptoms: [],
    isTyping: false,
    sidebarOpen: true
};

// ============================================
// KNOWLEDGE BASE (Client-Side)
// ============================================
const knowledgeBase = {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste'],

    responses: {
        greeting: [
            "Hello! I'm your Intelligent Virtual Healthcare Assistant. How can I help you today? 💙",
            "Hi there! Welcome to your healthcare companion. What health questions can I answer for you? 🏥",
            "Greetings! I'm here to provide reliable healthcare information. What would you like to know? 👋"
        ],
        default: "I'm here to help with your health questions. I can provide information on symptoms, first aid, nutrition, mental health, and general wellness. What would you like to know?"
    },

    symptomDatabase: {
        'fever': {
            conditions: ['Common Cold', 'Flu', 'Viral Infection', 'Malaria', 'Typhoid', 'COVID-19'],
            severity: 'moderate',
            advice: 'Rest, stay hydrated, and monitor temperature. Take paracetamol for fever reduction. See doctor if fever exceeds 103°F (39.4°C) or lasts more than 3 days.'
        },
        'headache': {
            conditions: ['Tension Headache', 'Migraine', 'Sinusitis', 'Eye Strain', 'Dehydration', 'Stress'],
            severity: 'mild to moderate',
            advice: 'Rest in a quiet, dark room. Stay hydrated. Over-the-counter pain relievers may help. See doctor if severe or persistent.'
        },
        'cough': {
            conditions: ['Common Cold', 'Flu', 'Bronchitis', 'Pneumonia', 'Asthma', 'Allergies'],
            severity: 'mild to moderate',
            advice: 'Stay hydrated, use honey for soothing (if not allergic), and avoid irritants. See doctor if cough persists for more than 2 weeks or produces blood.'
        },
        'sore throat': {
            conditions: ['Common Cold', 'Strep Throat', 'Tonsillitis', 'Allergies', 'Viral Infection'],
            severity: 'mild to moderate',
            advice: 'Gargle with warm salt water, drink warm fluids, and rest your voice. See doctor if severe or accompanied by high fever.'
        },
        'stomach pain': {
            conditions: ['Indigestion', 'Gastritis', 'Food Poisoning', 'Constipation', 'IBS', 'Appendicitis'],
            severity: 'mild to high',
            advice: 'Avoid spicy and fatty foods. Eat bland foods like BRAT diet (bananas, rice, applesauce, toast). See doctor immediately if severe or localized.'
        },
        'nausea': {
            conditions: ['Food Poisoning', 'Motion Sickness', 'Pregnancy', 'Migraine', 'Viral Infection'],
            severity: 'mild to moderate',
            advice: 'Eat small, bland meals. Ginger tea may help. Stay hydrated with small sips. See doctor if persistent or with vomiting.'
        },
        'fatigue': {
            conditions: ['Anemia', 'Thyroid Issues', 'Sleep Disorders', 'Depression', 'Chronic Fatigue', 'Diabetes'],
            severity: 'moderate',
            advice: 'Ensure adequate sleep, eat a balanced diet, and exercise regularly. See doctor if persistent for more than 2 weeks.'
        },
        'shortness of breath': {
            conditions: ['Asthma', 'Anxiety', 'Heart Issues', 'Pneumonia', 'COVID-19', 'Allergies'],
            severity: 'high',
            advice: '⚠️ Seek immediate medical attention if severe or accompanied by chest pain, sweating, or confusion.'
        },
        'chest pain': {
            conditions: ['Heart Attack', 'Angina', 'Acid Reflux', 'Muscle Strain', 'Anxiety', 'Costochondritis'],
            severity: 'high',
            advice: '⚠️ CHEST PAIN CAN BE SERIOUS. Call emergency services (108) immediately, especially if accompanied by sweating, nausea, or arm pain.'
        },
        'rash': {
            conditions: ['Allergic Reaction', 'Eczema', 'Psoriasis', 'Chickenpox', 'Measles', 'Heat Rash'],
            severity: 'mild to moderate',
            advice: 'Keep area clean and dry. Avoid scratching. Apply calamine lotion for itching. See doctor if rash spreads rapidly or with fever.'
        },
        'dizziness': {
            conditions: ['Low Blood Pressure', 'Dehydration', 'Inner Ear Problems', 'Anemia', 'Hypoglycemia'],
            severity: 'mild to moderate',
            advice: 'Sit or lie down immediately. Stay hydrated. Rise slowly from sitting/lying position. See doctor if frequent or severe.'
        },
        'body ache': {
            conditions: ['Flu', 'Viral Infection', 'Fibromyalgia', 'Overexertion', 'Arthritis'],
            severity: 'mild to moderate',
            advice: 'Rest, stay hydrated, and take over-the-counter pain relievers. Warm baths may help. See doctor if persistent.'
        }
    },

    healthTopics: {
        'covid': {
            keywords: ['covid', 'coronavirus', 'covid-19', 'corona'],
            response: `COVID-19 Symptoms:
• Fever or chills
• Cough
• Shortness of breath
• Fatigue
• Body aches
• Loss of taste/smell
• Sore throat

Prevention:
• Wear masks in crowded places
• Wash hands frequently
• Maintain social distance
• Get vaccinated
• Avoid touching face

If you suspect COVID-19, get tested and self-isolate until results are available.`
        },
        'diabetes': {
            keywords: ['diabetes', 'blood sugar', 'glucose'],
            response: `Diabetes Information:

Type 1: Body doesn't produce insulin
Type 2: Body doesn't use insulin properly

Common Symptoms:
• Frequent urination
• Excessive thirst
• Unexplained weight loss
• Fatigue
• Blurred vision
• Slow healing wounds

Management:
• Monitor blood sugar regularly
• Take medications as prescribed
• Follow a balanced diet
• Exercise regularly
• Regular check-ups with doctor`
        },
        'blood pressure': {
            keywords: ['blood pressure', 'hypertension', 'bp high', 'bp low'],
            response: `Blood Pressure Information:

Normal: Less than 120/80 mmHg
Elevated: 120-129/less than 80
High (Stage 1): 130-139/80-89
High (Stage 2): 140+/90+

Lifestyle Changes:
• Reduce salt intake
• Exercise regularly
• Maintain healthy weight
• Limit alcohol
• Quit smoking
• Manage stress
• Take medications as prescribed

Monitor regularly and consult your doctor.`
        },
        'headache': {
            keywords: ['headache', 'migraine', 'head pain'],
            response: `Headache Relief Tips:

Common Causes:
• Stress and tension
• Dehydration
• Lack of sleep
• Eye strain
• Sinus issues

Relief Methods:
• Rest in a quiet, dark room
• Apply cold or warm compress
• Stay hydrated
• Over-the-counter pain relievers
• Gentle neck massage
• Deep breathing exercises

See a doctor if headaches are severe, frequent, or accompanied by other symptoms.`
        },
        'fever': {
            keywords: ['fever', 'temperature', 'high temperature'],
            response: `Fever Management:

Normal body temperature: 98.6°F (37°C)
Fever: Above 100.4°F (38°C)

Home Care:
• Rest and stay hydrated
• Wear light clothing
• Take paracetamol for comfort
• Use lukewarm sponge bath

When to See Doctor:
• Temperature above 103°F (39.4°C)
• Fever lasts more than 3 days
• Accompanied by severe headache, rash, or confusion
• Difficulty breathing

For infants under 3 months, seek medical help for any fever.`
        },
        'mental health': {
            keywords: ['stress', 'anxiety', 'depression', 'mental health', 'worried', 'sad'],
            response: `Mental Health Support:

Stress Management:
• Practice deep breathing
• Exercise regularly
• Get adequate sleep
• Connect with loved ones
• Take breaks from work
• Practice mindfulness

When to Seek Help:
• Persistent sadness (>2 weeks)
• Thoughts of self-harm
• Inability to function daily
• Severe anxiety or panic attacks

Resources:
• Talk to a mental health professional
• Join support groups
• Practice self-care daily
• Consider therapy or counseling

Remember: Seeking help is a sign of strength, not weakness. 💚`
        },
        'nutrition': {
            keywords: ['diet', 'nutrition', 'healthy eating', 'food', 'weight loss'],
            response: `Healthy Eating Guidelines:

Balanced Diet:
• Fill half plate with vegetables and fruits
• Choose whole grains over refined
• Include lean proteins
• Use healthy fats (olive oil, nuts)
• Limit processed foods

Daily Recommendations:
• 5 servings of fruits/vegetables
• 8 glasses of water
• Limit sugar and salt
• Moderate portion sizes
• Regular meal times

Tips:
• Meal prep for the week
• Read nutrition labels
• Cook at home more often
• Eat mindfully without distractions`
        },
        'exercise': {
            keywords: ['exercise', 'workout', 'fitness', 'gym', 'physical activity'],
            response: `Exercise Recommendations:

WHO Guidelines:
• 150 minutes moderate activity/week
• OR 75 minutes vigorous activity/week
• Muscle-strengthening 2+ days/week

Types of Exercise:
• Cardio: Walking, running, swimming
• Strength: Weights, resistance bands
• Flexibility: Yoga, stretching
• Balance: Tai chi, balance exercises

Getting Started:
• Start slow and gradually increase
• Choose activities you enjoy
• Set realistic goals
• Find an exercise buddy
• Track your progress

Remember: Any movement is better than none! 💪`
        },
        'sleep': {
            keywords: ['sleep', 'insomnia', 'tired', 'rest'],
            response: `Better Sleep Tips:

Sleep Hygiene:
• Consistent sleep schedule
• Cool, dark, quiet bedroom
• No screens 1 hour before bed
• Avoid caffeine after 2 PM
• Limit naps to 20-30 minutes

Bedtime Routine:
• Read a book
• Take a warm bath
• Practice meditation
• Light stretching
• Journal your thoughts

Recommended Sleep:
• Adults: 7-9 hours
• Teens: 8-10 hours
• Children: 9-12 hours

See a doctor if sleep problems persist.`
        },
        'first aid': {
            keywords: ['first aid', 'emergency', 'bleeding', 'burn', 'choking', 'cpr'],
            response: `First Aid Basics:

General Steps:
1. Ensure scene safety
2. Check responsiveness
3. Call emergency services (108) if needed
4. Provide appropriate first aid
5. Stay with the person until help arrives

Common Emergencies:
• Burns: Cool with water, cover with clean cloth
• Cuts: Apply pressure, clean, bandage
• Choking: Heimlich maneuver
• Nosebleed: Lean forward, pinch nose
• Fracture: Immobilize, don't move

Remember: In serious emergencies, call 108 immediately!`
        },
        'medication': {
            keywords: ['medicine', 'medication', 'drug', 'pill', 'tablet'],
            response: `Medication Safety:

General Guidelines:
• Take medications as prescribed
• Never share prescription drugs
• Store in cool, dry place
• Check expiration dates
• Keep out of reach of children

Over-the-Counter:
• Paracetamol: Pain and fever relief
• Ibuprofen: Pain and inflammation
• Antihistamines: Allergies
• Antacids: Indigestion

⚠️ Always consult a doctor before starting any new medication, especially if you have existing health conditions or take other medications.`
        }
    }
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    menuToggle: document.getElementById('menuToggle'),
    navItems: document.querySelectorAll('.sidebar-nav li'),
    clearChatBtn: document.getElementById('clearChat'),
    helpBtn: document.getElementById('helpBtn'),
    chatSection: document.getElementById('chatSection'),
    welcomeScreen: document.getElementById('welcomeScreen'),
    chatMessages: document.getElementById('chatMessages'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    typingIndicator: document.getElementById('typingIndicator'),
    charCount: document.getElementById('charCount'),
    suggestionChips: document.querySelectorAll('.chip'),
    symptomsSection: document.getElementById('symptomsSection'),
    symptomCards: document.querySelectorAll('.symptom-card'),
    selectedList: document.getElementById('selectedList'),
    checkSymptomsBtn: document.getElementById('checkSymptomsBtn'),
    symptomsResults: document.getElementById('symptomsResults'),
    firstaidSection: document.getElementById('firstaidSection'),
    firstaidCards: document.querySelectorAll('.firstaid-card'),
    firstaidDetail: document.getElementById('firstaidDetail'),
    healthtipsSection: document.getElementById('healthtipsSection'),
    tipCategories: document.querySelectorAll('.tip-category'),
    tipsContainer: document.getElementById('tipsContainer'),
    helpModal: document.getElementById('helpModal'),
    emergencyModal: document.getElementById('emergencyModal'),
    closeModal: document.getElementById('closeModal'),
    closeEmergencyModal: document.getElementById('closeEmergencyModal'),
    emergencyBanner: document.querySelector('.emergency-banner')
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    addEntranceAnimations();
});

function initializeApp() {
    setupEventListeners();
    setupTextareaAutoResize();
    loadHealthTips('general');

    setTimeout(() => {
        addMessage('assistant', "Hello! I'm your Intelligent Virtual Healthcare Assistant. How can I help you today? 💙");
    }, 600);
}

function addEntranceAnimations() {
    document.querySelectorAll('.feature, .symptom-card, .firstaid-card, .tip-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + i * 50);
    });
}

function setupEventListeners() {
    elements.sidebarToggle?.addEventListener('click', toggleSidebar);
    elements.menuToggle?.addEventListener('click', toggleMobileSidebar);

    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            const topic = item.dataset.topic;

            if (section) {
                switchSection(section);
            } else if (topic) {
                handleTopicClick(topic);
            }

            elements.navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    elements.sendBtn?.addEventListener('click', sendMessage);
    elements.messageInput?.addEventListener('keydown', handleInputKeydown);
    elements.messageInput?.addEventListener('input', handleInputChange);
    elements.clearChatBtn?.addEventListener('click', clearChat);

    elements.suggestionChips?.forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.dataset.question;
            elements.messageInput.value = question;
            sendMessage();
        });
    });

    elements.symptomCards?.forEach(card => {
        card.addEventListener('click', () => toggleSymptom(card));
    });
    elements.checkSymptomsBtn?.addEventListener('click', checkSymptoms);

    elements.firstaidCards?.forEach(card => {
        card.addEventListener('click', () => showFirstAidDetail(card.dataset.emergency));
    });

    elements.tipCategories?.forEach(category => {
        category.addEventListener('click', () => {
            elements.tipCategories.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');
            loadHealthTips(category.dataset.category);
        });
    });

    elements.helpBtn?.addEventListener('click', () => openModal(elements.helpModal));
    elements.closeModal?.addEventListener('click', () => closeModal(elements.helpModal));
    elements.emergencyBanner?.addEventListener('click', () => openModal(elements.emergencyModal));
    elements.closeEmergencyModal?.addEventListener('click', () => closeModal(elements.emergencyModal));

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });
}

// ============================================
// SIDEBAR FUNCTIONS
// ============================================
function toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
    elements.sidebar.classList.toggle('collapsed', !state.sidebarOpen);
}

function toggleMobileSidebar() {
    elements.sidebar.classList.toggle('open');
}

function switchSection(sectionName) {
    state.currentSection = sectionName;

    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
        section.style.opacity = '0';
        section.style.transform = 'translateX(20px)';
    });

    const sectionMap = {
        'chat': elements.chatSection,
        'symptoms': elements.symptomsSection,
        'firstaid': elements.firstaidSection,
        'healthtips': elements.healthtipsSection
    };

    if (sectionMap[sectionName]) {
        const section = sectionMap[sectionName];
        section.classList.add('active');

        setTimeout(() => {
            section.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            section.style.opacity = '1';
            section.style.transform = 'translateX(0)';
        }, 50);
    }

    elements.sidebar.classList.remove('open');
}

function handleTopicClick(topic) {
    switchSection('chat');

    const topicQuestions = {
        'general': 'Tell me about general health tips',
        'nutrition': 'What are some healthy eating recommendations?',
        'mental': 'How can I improve my mental health?',
        'exercise': 'What exercises should I do to stay fit?'
    };

    elements.messageInput.value = topicQuestions[topic] || 'Tell me about ' + topic;
    sendMessage();
}

// ============================================
// CHAT FUNCTIONS - CLIENT SIDE
// ============================================
function setupTextareaAutoResize() {
    const textarea = elements.messageInput;
    if (!textarea) return;

    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

function handleInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function handleInputChange() {
    const length = elements.messageInput.value.length;
    elements.charCount.textContent = `${length}/500`;
    elements.charCount.classList.toggle('warning', length >= 450);
}

function processMessage(message) {
    const lowerMsg = message.toLowerCase();

    // Check for greetings
    if (knowledgeBase.greetings.some(g => lowerMsg.includes(g))) {
        return getRandomResponse('greeting');
    }

    // Check health topics
    for (const [topic, data] of Object.entries(knowledgeBase.healthTopics)) {
        if (data.keywords.some(kw => lowerMsg.includes(kw))) {
            return data.response;
        }
    }

    // Check for symptoms
    const foundSymptoms = [];
    for (const [symptom, data] of Object.entries(knowledgeBase.symptomDatabase)) {
        if (lowerMsg.includes(symptom)) {
            foundSymptoms.push({ symptom, ...data });
        }
    }

    if (foundSymptoms.length > 0) {
        let response = "I noticed you mentioned some symptoms. Here's what I found:\n\n";
        foundSymptoms.forEach(s => {
            response += `**${s.symptom.charAt(0).toUpperCase() + s.symptom.slice(1)}**\n`;
            response += `• Possible conditions: ${s.conditions.join(', ')}\n`;
            response += `• Advice: ${s.advice}\n\n`;
        });
        response += "⚠️ Remember: This is general information. Please consult a healthcare professional for proper diagnosis and treatment.";
        return response;
    }

    // Default response
    return knowledgeBase.responses.default;
}

function getRandomResponse(type) {
    const responses = knowledgeBase.responses[type];
    return responses[Math.floor(Math.random() * responses.length)];
}

async function sendMessage() {
    const message = elements.messageInput.value.trim();
    if (!message || state.isTyping) return;

    elements.welcomeScreen.style.display = 'none';
    addMessage('user', message);

    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';
    elements.charCount.textContent = '0/500';

    showTypingIndicator();

    // Simulate processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const response = processMessage(message);
    hideTypingIndicator();
    addMessage('assistant', response);
}

function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatar = type === 'user'
        ? '<i class="fas fa-user"></i>'
        : '<i class="fas fa-robot"></i>';

    const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${formatMessageText(text)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;

    elements.chatMessages.appendChild(messageDiv);
    scrollToBottom();
    state.messages.push({ type, text, time });
}

function formatMessageText(text) {
    // Convert markdown-style formatting to HTML
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/•/g, '&bull;')
        .replace(/\n/g, '<br>');
}

function useSuggestion(text) {
    elements.messageInput.value = text;
    sendMessage();
}

function showTypingIndicator() {
    state.isTyping = true;
    elements.typingIndicator.style.display = 'flex';
    scrollToBottom();
}

function hideTypingIndicator() {
    state.isTyping = false;
    elements.typingIndicator.style.display = 'none';
}

function scrollToBottom() {
    const container = document.querySelector('.chat-container');
    if (container) {
        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
        });
    }
}

function clearChat() {
    if (confirm('Are you sure you want to clear the conversation?')) {
        elements.chatMessages.innerHTML = '';
        elements.welcomeScreen.style.display = 'flex';
        state.messages = [];

        setTimeout(() => {
            addMessage('assistant', "Hello! I'm your Intelligent Virtual Healthcare Assistant. How can I help you today? 💙");
        }, 300);
    }
}

// ============================================
// SYMPTOM CHECKER - CLIENT SIDE
// ============================================
function toggleSymptom(card) {
    const symptom = card.dataset.symptom;

    if (state.selectedSymptoms.includes(symptom)) {
        state.selectedSymptoms = state.selectedSymptoms.filter(s => s !== symptom);
        card.classList.remove('selected');
        card.style.transform = 'scale(1)';
    } else {
        state.selectedSymptoms.push(symptom);
        card.classList.add('selected');
        card.style.transform = 'scale(1.05)';
        setTimeout(() => card.style.transform = 'scale(1)', 200);
    }

    updateSelectedSymptoms();
}

function updateSelectedSymptoms() {
    const list = elements.selectedList;

    if (state.selectedSymptoms.length === 0) {
        list.innerHTML = '<p class="no-selection">Click on symptoms above to select them</p>';
        elements.checkSymptomsBtn.disabled = true;
    } else {
        list.innerHTML = state.selectedSymptoms.map(symptom => `
            <div class="selected-tag" style="animation: fadeInScale 0.3s ease;">
                ${formatSymptomName(symptom)}
                <button onclick="removeSymptom('${symptom}')" aria-label="Remove ${symptom}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        elements.checkSymptomsBtn.disabled = false;
    }
}

function removeSymptom(symptom) {
    state.selectedSymptoms = state.selectedSymptoms.filter(s => s !== symptom);
    const card = document.querySelector(`[data-symptom="${symptom}"]`);
    if (card) card.classList.remove('selected');
    updateSelectedSymptoms();
}

function formatSymptomName(symptom) {
    return symptom.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function checkSymptoms() {
    if (state.selectedSymptoms.length === 0) return;

    const btn = elements.checkSymptomsBtn;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    btn.disabled = true;

    // Simulate analysis delay
    setTimeout(() => {
        const results = [];

        state.selectedSymptoms.forEach(symptom => {
            const data = knowledgeBase.symptomDatabase[symptom];
            if (data) {
                results.push({
                    symptom,
                    ...data
                });
            }
        });

        displaySymptomResults(results);

        btn.innerHTML = '<i class="fas fa-search"></i> Check Symptoms';
        btn.disabled = false;
    }, 1200);
}

function displaySymptomResults(conditions) {
    const resultsDiv = elements.symptomsResults;

    if (!conditions || conditions.length === 0) {
        resultsDiv.innerHTML = `
            <div class="result-card" style="animation: slideUp 0.5s ease;">
                <h4><i class="fas fa-info-circle"></i> No Specific Conditions Found</h4>
                <p>Based on your symptoms, we couldn't identify specific conditions. Please consult a healthcare professional for proper diagnosis.</p>
            </div>
        `;
    } else {
        resultsDiv.innerHTML = conditions.map((condition, i) => `
            <div class="result-card ${condition.severity === 'high' ? 'high-severity' : ''}" 
                 style="animation: slideUp 0.5s ease ${i * 0.1}s both;">
                <h4>
                    ${condition.severity === 'high' ? '<i class="fas fa-exclamation-triangle"></i>' : '<i class="fas fa-stethoscope"></i>'}
                    ${formatSymptomName(condition.symptom)}
                </h4>
                <p><strong>Possible Conditions:</strong> ${condition.conditions.join(', ')}</p>
                <p><strong>Severity:</strong> <span class="severity-badge ${condition.severity.replace(/\s+/g, '-')}">${condition.severity}</span></p>
                <p><strong>Advice:</strong> ${condition.advice}</p>
            </div>
        `).join('');
    }

    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// FIRST AID DATA
// ============================================
const firstAidData = {
    burns: {
        title: 'First Aid for Burns',
        steps: [
            { title: 'Cool the Burn', desc: 'Hold the burned area under cool (not cold) running water for at least 10 minutes. This helps reduce pain and swelling.' },
            { title: 'Remove Tight Items', desc: 'Gently remove rings, watches, or tight clothing before swelling occurs.' },
            { title: 'Do Not Apply', desc: 'Never apply ice, butter, oil, or ointments to the burn as these can trap heat and cause infection.' },
            { title: 'Cover the Burn', desc: 'Cover with a sterile, non-stick bandage or clean cloth. Do not use fluffy cotton.' },
            { title: 'Pain Relief', desc: 'Take over-the-counter pain relievers like paracetamol if needed.' },
            { title: 'Seek Medical Help', desc: 'For severe burns (deep, large, or on face/hands/genitals), seek immediate medical attention.' }
        ],
        emergency: 'Call emergency services (108) if the burn is deep, covers a large area, or is on the face, hands, feet, genitals, or major joints.'
    },
    cuts: {
        title: 'First Aid for Cuts and Bleeding',
        steps: [
            { title: 'Wash Your Hands', desc: 'Clean your hands before treating the wound to prevent infection.' },
            { title: 'Apply Pressure', desc: 'Use a clean cloth or sterile gauze to apply gentle, direct pressure to stop bleeding.' },
            { title: 'Clean the Wound', desc: 'Once bleeding stops, rinse the wound with clean water and mild soap.' },
            { title: 'Apply Antibiotic', desc: 'Apply a thin layer of antibiotic ointment if available.' },
            { title: 'Cover the Wound', desc: 'Cover with a sterile bandage or adhesive bandage.' },
            { title: 'Change Dressing', desc: 'Change the bandage daily or whenever it becomes wet or dirty.' }
        ],
        emergency: 'Call emergency services (108) if bleeding does not stop after 10 minutes of continuous pressure.'
    },
    choking: {
        title: 'First Aid for Choking',
        steps: [
            { title: 'Encourage Coughing', desc: 'If the person can cough, encourage them to continue coughing to dislodge the object.' },
            { title: 'Back Blows', desc: 'For adults and children over 1 year: give 5 sharp back blows between the shoulder blades.' },
            { title: 'Heimlich Maneuver', desc: 'Stand behind the person, wrap your arms around their waist.' },
            { title: 'Make a Fist', desc: 'Make a fist and place the thumb side against the middle of the abdomen, above the navel.' },
            { title: 'Quick Upward Thrusts', desc: 'Grasp your fist with the other hand and give quick, upward thrusts.' },
            { title: 'Repeat', desc: 'Continue cycles of 5 back blows and 5 abdominal thrusts until the object is expelled.' }
        ],
        emergency: 'Call emergency services (108) immediately if the person cannot breathe, speak, or cough.'
    },
    cpr: {
        title: 'CPR (Cardiopulmonary Resuscitation)',
        steps: [
            { title: 'Check Responsiveness', desc: 'Tap the person and shout "Are you okay?" Check if they are breathing.' },
            { title: 'Call Emergency', desc: 'Call emergency services (108) immediately or ask someone else to call.' },
            { title: 'Position', desc: 'Place the person on their back on a firm, flat surface.' },
            { title: 'Chest Compressions', desc: 'Give 30 chest compressions: push hard and fast in the center of the chest, 2 inches deep at 100-120 per minute.' },
            { title: 'Open Airway', desc: 'Tilt the head back and lift the chin to open the airway.' },
            { title: 'Rescue Breaths', desc: 'Give 2 rescue breaths. Pinch the nose, make a seal over the mouth, and blow for 1 second each.' }
        ],
        emergency: 'Continue CPR until emergency services arrive or the person shows signs of life.'
    },
    fracture: {
        title: 'First Aid for Fractures',
        steps: [
            { title: 'Do Not Move', desc: 'Do not move the person unless absolutely necessary for safety.' },
            { title: 'Immobilize', desc: 'Immobilize the injured area using a splint or sturdy material to prevent movement.' },
            { title: 'Apply Ice', desc: 'Apply ice wrapped in a cloth to reduce swelling. Do not apply ice directly to skin.' },
            { title: 'Elevate', desc: 'If possible, elevate the injured area above heart level to reduce swelling.' },
            { title: 'Watch for Shock', desc: 'Monitor for signs of shock: pale skin, rapid breathing, weakness.' },
            { title: 'Keep Warm', desc: 'Cover the person with a blanket to keep them warm and comfortable.' }
        ],
        emergency: 'All suspected fractures require professional medical treatment. Call emergency services (108).'
    },
    nosebleed: {
        title: 'First Aid for Nosebleeds',
        steps: [
            { title: 'Sit Upright', desc: 'Sit upright and lean slightly forward. Do not tilt head back.' },
            { title: 'Pinch Nose', desc: 'Pinch the soft part of the nose (just below the bony bridge) firmly with thumb and index finger.' },
            { title: 'Breathe Through Mouth', desc: 'Breathe through your mouth while pinching the nose.' },
            { title: 'Hold Pressure', desc: 'Maintain pressure for 10-15 minutes without checking if bleeding has stopped.' },
            { title: 'Apply Ice', desc: 'Apply an ice pack to the bridge of the nose to help constrict blood vessels.' },
            { title: 'Aftercare', desc: 'Once bleeding stops, avoid blowing nose, bending down, or strenuous activity for several hours.' }
        ],
        emergency: 'Seek medical attention if bleeding continues for more than 20 minutes or is very heavy.'
    }
};

function showFirstAidDetail(emergencyType) {
    const data = firstAidData[emergencyType];
    if (!data) return;

    const detailDiv = elements.firstaidDetail;

    detailDiv.innerHTML = `
        <div class="firstaid-steps" style="animation: fadeIn 0.5s ease;">
            <button class="btn-outline" onclick="hideFirstAidDetail()" style="margin-bottom: 24px;">
                <i class="fas fa-arrow-left"></i> Back to First Aid
            </button>
            <h3>${data.title}</h3>
            <ol class="step-list">
                ${data.steps.map((step, index) => `
                    <li style="animation: slideInRight 0.4s ease ${index * 0.1}s both;">
                        <span class="step-number">${index + 1}</span>
                        <div class="step-content">
                            <h4>${step.title}</h4>
                            <p>${step.desc}</p>
                        </div>
                    </li>
                `).join('')}
            </ol>
            <div class="emergency-callout" style="animation: pulse 2s infinite;">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <h4>When to Call Emergency Services (108)</h4>
                    <p>${data.emergency}</p>
                </div>
            </div>
        </div>
    `;

    detailDiv.style.display = 'block';
    detailDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideFirstAidDetail() {
    elements.firstaidDetail.style.display = 'none';
}

// ============================================
// HEALTH TIPS DATA
// ============================================
const healthTipsData = {
    general: [
        { icon: 'fa-tint', text: 'Drink at least 8 glasses of water daily to stay hydrated and maintain optimal body function.' },
        { icon: 'fa-bed', text: 'Get 7-9 hours of quality sleep every night for better physical and mental health.' },
        { icon: 'fa-running', text: 'Exercise for at least 30 minutes most days of the week to maintain fitness.' },
        { icon: 'fa-apple-alt', text: 'Eat a balanced diet with plenty of fruits, vegetables, and whole grains.' },
        { icon: 'fa-hands-wash', text: 'Wash your hands frequently with soap and water to prevent infections.' },
        { icon: 'fa-eye', text: 'Take regular breaks from screens to protect your eyes and reduce eye strain.' },
        { icon: 'fa-walking', text: 'Practice good posture to prevent back and neck pain.' },
        { icon: 'fa-ban', text: 'Limit processed foods and added sugars for better overall health.' },
        { icon: 'fa-sun', text: 'Get regular sunlight exposure for Vitamin D, but protect your skin from excessive UV.' },
        { icon: 'fa-lungs', text: 'Practice deep breathing exercises to reduce stress and improve lung capacity.' }
    ],
    nutrition: [
        { icon: 'fa-carrot', text: 'Include colorful vegetables in every meal for diverse nutrients and antioxidants.' },
        { icon: 'fa-bread-slice', text: 'Choose whole grains over refined grains for better fiber and nutrient content.' },
        { icon: 'fa-drumstick-bite', text: 'Limit red meat and processed meats; opt for lean proteins like fish and poultry.' },
        { icon: 'fa-fish', text: 'Eat fatty fish twice a week for omega-3 fatty acids that support heart health.' },
        { icon: 'fa-seedling', text: 'Include nuts and seeds in your diet for healthy fats and protein.' },
        { icon: 'fa-shaker', text: 'Reduce salt intake to maintain healthy blood pressure levels.' },
        { icon: 'fa-oil-can', text: 'Choose healthy fats like olive oil, avocado, and nuts over saturated fats.' },
        { icon: 'fa-utensils', text: 'Eat mindfully without distractions to better recognize hunger and fullness cues.' },
        { icon: 'fa-glass-water', text: 'Stay hydrated - thirst is often mistaken for hunger.' },
        { icon: 'fa-calendar-alt', text: 'Plan your meals ahead to make healthier food choices throughout the week.' }
    ],
    mental_health: [
        { icon: 'fa-spa', text: 'Practice mindfulness or meditation daily to reduce stress and improve focus.' },
        { icon: 'fa-users', text: 'Stay connected with friends and family for emotional support and wellbeing.' },
        { icon: 'fa-smile', text: 'Take time for hobbies and activities you enjoy to boost mood and creativity.' },
        { icon: 'fa-bullseye', text: 'Set realistic goals and celebrate small wins to build confidence.' },
        { icon: 'fa-mobile-alt', text: 'Limit social media if it negatively affects your mood or self-esteem.' },
        { icon: 'fa-sun', text: 'Get sunlight exposure to boost mood and regulate your circadian rhythm.' },
        { icon: 'fa-heart', text: 'Practice gratitude - write down things you are thankful for each day.' },
        { icon: 'fa-user-md', text: 'Seek professional help when needed - it is a sign of strength, not weakness.' },
        { icon: 'fa-coffee', text: 'Take regular breaks to prevent burnout and maintain productivity.' },
        { icon: 'fa-hand-holding-heart', text: 'Be kind to yourself and practice self-compassion daily.' }
    ],
    exercise: [
        { icon: 'fa-walking', text: 'Start with small, achievable fitness goals and gradually increase intensity.' },
        { icon: 'fa-heart', text: 'Find an exercise you enjoy to stay motivated and make it a habit.' },
        { icon: 'fa-fire', text: 'Warm up before exercise and cool down after to prevent injuries.' },
        { icon: 'fa-dumbbell', text: 'Include both cardio and strength training for overall fitness.' },
        { icon: 'fa-bed', text: 'Take rest days to allow your body to recover and prevent overtraining.' },
        { icon: 'fa-stairs', text: 'Use stairs instead of elevators when possible for extra activity.' },
        { icon: 'fa-bicycle', text: 'Walk or bike for short trips instead of driving to increase daily movement.' },
        { icon: 'fa-child', text: 'Stretch daily to maintain flexibility and reduce muscle tension.' },
        { icon: 'fa-ear-listen', text: 'Listen to your body and do not push through pain or extreme fatigue.' },
        { icon: 'fa-calendar-check', text: 'Stay consistent - regular moderate exercise is better than occasional intense workouts.' }
    ],
    sleep: [
        { icon: 'fa-clock', text: 'Maintain a consistent sleep schedule, even on weekends.' },
        { icon: 'fa-moon', text: 'Create a relaxing bedtime routine to signal your body it is time to sleep.' },
        { icon: 'fa-temperature-low', text: 'Keep your bedroom cool, dark, and quiet for optimal sleep conditions.' },
        { icon: 'fa-mobile-alt', text: 'Avoid screens 1 hour before bedtime as blue light disrupts sleep hormones.' },
        { icon: 'fa-coffee', text: 'Limit caffeine after 2 PM to avoid interference with sleep.' },
        { icon: 'fa-utensils', text: 'Avoid heavy meals close to bedtime for better digestion and sleep quality.' },
        { icon: 'fa-bed', text: 'Use your bed only for sleep and intimacy to strengthen sleep associations.' },
        { icon: 'fa-book', text: 'If you cannot sleep, get up and do something relaxing until you feel sleepy.' },
        { icon: 'fa-sun', text: 'Expose yourself to natural light during the day to regulate your sleep-wake cycle.' },
        { icon: 'fa-wind', text: 'Consider relaxation techniques like progressive muscle relaxation before bed.' }
    ]
};

function loadHealthTips(category) {
    const tips = healthTipsData[category] || healthTipsData.general;
    const container = elements.tipsContainer;

    container.innerHTML = tips.map((tip, i) => `
        <div class="tip-card" style="animation: fadeInScale 0.5s ease ${i * 0.05}s both;">
            <div class="tip-icon">
                <i class="fas ${tip.icon}"></i>
            </div>
            <p>${tip.text}</p>
        </div>
    `).join('');
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const content = modal.querySelector('.modal-content');
    content.style.animation = 'modalSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        elements.sidebar.classList.remove('open');
    }
});

// Expose functions to global scope
window.useSuggestion = useSuggestion;
window.removeSymptom = removeSymptom;
window.hideFirstAidDetail = hideFirstAidDetail;