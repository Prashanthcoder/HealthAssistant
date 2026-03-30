/**
 * Intelligent Virtual Healthcare Assistant
 * Frontend JavaScript Application
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
// DOM ELEMENTS
// ============================================
const elements = {
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    menuToggle: document.getElementById('menuToggle'),
    navItems: document.querySelectorAll('.sidebar-nav li'),

    // Header
    clearChatBtn: document.getElementById('clearChat'),
    helpBtn: document.getElementById('helpBtn'),

    // Chat Section
    chatSection: document.getElementById('chatSection'),
    welcomeScreen: document.getElementById('welcomeScreen'),
    chatMessages: document.getElementById('chatMessages'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    typingIndicator: document.getElementById('typingIndicator'),
    charCount: document.getElementById('charCount'),
    suggestionChips: document.querySelectorAll('.chip'),

    // Symptoms Section
    symptomsSection: document.getElementById('symptomsSection'),
    symptomCards: document.querySelectorAll('.symptom-card'),
    selectedList: document.getElementById('selectedList'),
    checkSymptomsBtn: document.getElementById('checkSymptomsBtn'),
    symptomsResults: document.getElementById('symptomsResults'),

    // First Aid Section
    firstaidSection: document.getElementById('firstaidSection'),
    firstaidCards: document.querySelectorAll('.firstaid-card'),
    firstaidDetail: document.getElementById('firstaidDetail'),

    // Health Tips Section
    healthtipsSection: document.getElementById('healthtipsSection'),
    tipCategories: document.querySelectorAll('.tip-category'),
    tipsContainer: document.getElementById('tipsContainer'),

    // Modals
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
});

function initializeApp() {
    setupEventListeners();
    setupTextareaAutoResize();
    loadHealthTips('general');

    // Add initial greeting
    setTimeout(() => {
        addMessage('assistant', "Hello! I'm your Intelligent Virtual Healthcare Assistant. How can I help you today?");
    }, 500);
}

function setupEventListeners() {
    // Sidebar navigation
    elements.sidebarToggle.addEventListener('click', toggleSidebar);
    elements.menuToggle.addEventListener('click', toggleMobileSidebar);

    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            const topic = item.dataset.topic;

            if (section) {
                switchSection(section);
            } else if (topic) {
                handleTopicClick(topic);
            }

            // Update active state
            elements.navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Chat functionality
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keydown', handleInputKeydown);
    elements.messageInput.addEventListener('input', handleInputChange);
    elements.clearChatBtn.addEventListener('click', clearChat);

    // Suggestion chips
    elements.suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.dataset.question;
            elements.messageInput.value = question;
            sendMessage();
        });
    });

    // Symptom checker
    elements.symptomCards.forEach(card => {
        card.addEventListener('click', () => toggleSymptom(card));
    });
    elements.checkSymptomsBtn.addEventListener('click', checkSymptoms);

    // First aid cards
    elements.firstaidCards.forEach(card => {
        card.addEventListener('click', () => showFirstAidDetail(card.dataset.emergency));
    });

    // Health tips categories
    elements.tipCategories.forEach(category => {
        category.addEventListener('click', () => {
            elements.tipCategories.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');
            loadHealthTips(category.dataset.category);
        });
    });

    // Modals
    elements.helpBtn.addEventListener('click', () => openModal(elements.helpModal));
    elements.closeModal.addEventListener('click', () => closeModal(elements.helpModal));
    elements.emergencyBanner.addEventListener('click', () => openModal(elements.emergencyModal));
    elements.closeEmergencyModal.addEventListener('click', () => closeModal(elements.emergencyModal));

    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
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

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const sectionMap = {
        'chat': elements.chatSection,
        'symptoms': elements.symptomsSection,
        'firstaid': elements.firstaidSection,
        'healthtips': elements.healthtipsSection
    };

    if (sectionMap[sectionName]) {
        sectionMap[sectionName].classList.add('active');
    }

    // Close mobile sidebar
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
// CHAT FUNCTIONS
// ============================================
function setupTextareaAutoResize() {
    const textarea = elements.messageInput;

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

    if (length >= 450) {
        elements.charCount.classList.add('warning');
    } else {
        elements.charCount.classList.remove('warning');
    }
}

async function sendMessage() {
    const message = elements.messageInput.value.trim();

    if (!message || state.isTyping) return;

    // Hide welcome screen
    elements.welcomeScreen.style.display = 'none';

    // Add user message
    addMessage('user', message);

    // Clear input
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';
    elements.charCount.textContent = '0/500';

    // Show typing indicator
    showTypingIndicator();

    try {
        // Send to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        hideTypingIndicator();

        if (data.success) {
            addMessage('assistant', data.response, data.suggestions);
        } else {
            addMessage('assistant', 'I apologize, but I encountered an error. Please try again.');
        }
    } catch (error) {
        hideTypingIndicator();
        addMessage('assistant', 'Sorry, I\'m having trouble connecting. Please check your internet connection and try again.');
        console.error('Chat error:', error);
    }
}

function addMessage(type, text, suggestions = []) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatar = type === 'user'
        ? '<i class="fas fa-user"></i>'
        : '<i class="fas fa-robot"></i>';

    const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    let suggestionsHtml = '';
    if (suggestions && suggestions.length > 0) {
        suggestionsHtml = `
            <div class="message-suggestions">
                ${suggestions.map(s => `<button onclick="useSuggestion('${s}')">${s}</button>`).join('')}
            </div>
        `;
    }

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${escapeHtml(text)}</div>
            <div class="message-time">${time}</div>
            ${suggestionsHtml}
        </div>
    `;

    elements.chatMessages.appendChild(messageDiv);
    scrollToBottom();

    // Store message
    state.messages.push({ type, text, time });
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
    container.scrollTop = container.scrollHeight;
}

function clearChat() {
    if (confirm('Are you sure you want to clear the conversation?')) {
        elements.chatMessages.innerHTML = '';
        elements.welcomeScreen.style.display = 'flex';
        state.messages = [];

        // Add greeting back
        setTimeout(() => {
            addMessage('assistant', "Hello! I'm your Intelligent Virtual Healthcare Assistant. How can I help you today?");
        }, 300);
    }
}

// ============================================
// SYMPTOM CHECKER FUNCTIONS
// ============================================
function toggleSymptom(card) {
    const symptom = card.dataset.symptom;

    if (state.selectedSymptoms.includes(symptom)) {
        state.selectedSymptoms = state.selectedSymptoms.filter(s => s !== symptom);
        card.classList.remove('selected');
    } else {
        state.selectedSymptoms.push(symptom);
        card.classList.add('selected');
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
            <div class="selected-tag">
                ${formatSymptomName(symptom)}
                <button onclick="removeSymptom('${symptom}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        elements.checkSymptomsBtn.disabled = false;
    }
}

function removeSymptom(symptom) {
    state.selectedSymptoms = state.selectedSymptoms.filter(s => s !== symptom);
    document.querySelector(`[data-symptom="${symptom}"]`).classList.remove('selected');
    updateSelectedSymptoms();
}

function formatSymptomName(symptom) {
    return symptom.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

async function checkSymptoms() {
    if (state.selectedSymptoms.length === 0) return;

    elements.checkSymptomsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
    elements.checkSymptomsBtn.disabled = true;

    try {
        const response = await fetch('/api/symptoms-checker', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symptoms: state.selectedSymptoms })
        });

        const data = await response.json();

        if (data.success) {
            displaySymptomResults(data.conditions);
        } else {
            alert('Error checking symptoms. Please try again.');
        }
    } catch (error) {
        console.error('Symptom check error:', error);
        alert('Error connecting to server. Please try again.');
    } finally {
        elements.checkSymptomsBtn.innerHTML = '<i class="fas fa-search"></i> Check Symptoms';
        elements.checkSymptomsBtn.disabled = false;
    }
}

function displaySymptomResults(conditions) {
    const resultsDiv = elements.symptomsResults;

    if (!conditions || conditions.length === 0) {
        resultsDiv.innerHTML = `
            <div class="result-card">
                <h4><i class="fas fa-info-circle"></i> No Specific Conditions Found</h4>
                <p>Based on your symptoms, we couldn't identify specific conditions. Please consult a healthcare professional for proper diagnosis.</p>
            </div>
        `;
    } else {
        resultsDiv.innerHTML = conditions.map(condition => `
            <div class="result-card ${condition.severity === 'high' ? 'high-severity' : ''}">
                <h4>
                    ${condition.severity === 'high' ? '<i class="fas fa-exclamation-triangle"></i>' : '<i class="fas fa-stethoscope"></i>'}
                    ${formatSymptomName(condition.symptom)}
                </h4>
                <p><strong>Possible Conditions:</strong> ${condition.possible_conditions.join(', ')}</p>
                <p><strong>Severity:</strong> ${condition.severity}</p>
                <p><strong>Advice:</strong> ${condition.advice}</p>
            </div>
        `).join('');
    }

    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// FIRST AID FUNCTIONS
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
        emergency: 'Call emergency services if the burn is deep, covers a large area, or is on the face, hands, feet, genitals, or major joints.'
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
        emergency: 'Call emergency services if bleeding does not stop after 10 minutes of continuous pressure.'
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
        emergency: 'Call emergency services immediately if the person cannot breathe, speak, or cough.'
    },
    cpr: {
        title: 'CPR (Cardiopulmonary Resuscitation)',
        steps: [
            { title: 'Check Responsiveness', desc: 'Tap the person and shout "Are you okay?" Check if they are breathing.' },
            { title: 'Call Emergency', desc: 'Call emergency services immediately or ask someone else to call.' },
            { title: 'Position', desc: 'Place the person on their back on a firm, flat surface.' },
            { title: 'Chest Compressions', desc: 'Give 30 chest compressions: push hard and fast in the center of the chest, 2 inches deep.' },
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
        emergency: 'All suspected fractures require professional medical treatment. Call emergency services.'
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
        <div class="firstaid-steps">
            <button class="btn-outline" onclick="hideFirstAidDetail()" style="margin-bottom: 20px;">
                <i class="fas fa-arrow-left"></i> Back to First Aid
            </button>
            <h3>${data.title}</h3>
            <ol class="step-list">
                ${data.steps.map((step, index) => `
                    <li>
                        <span class="step-number">${index + 1}</span>
                        <div class="step-content">
                            <h4>${step.title}</h4>
                            <p>${step.desc}</p>
                        </div>
                    </li>
                `).join('')}
            </ol>
            <div class="emergency-callout">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <h4>When to Call Emergency Services</h4>
                    <p>${data.emergency}</p>
                </div>
            </div>
        </div>
    `;

    detailDiv.style.display = 'block';
    detailDiv.scrollIntoView({ behavior: 'smooth' });
}

function hideFirstAidDetail() {
    elements.firstaidDetail.style.display = 'none';
}

// ============================================
// HEALTH TIPS FUNCTIONS
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

    container.innerHTML = tips.map(tip => `
        <div class="tip-card">
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

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        elements.sidebar.classList.remove('open');
    }
});

// Expose functions to global scope for onclick handlers
window.useSuggestion = useSuggestion;
window.removeSymptom = removeSymptom;
window.hideFirstAidDetail = hideFirstAidDetail;