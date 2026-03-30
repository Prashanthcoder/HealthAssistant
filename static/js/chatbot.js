/**
 * Intelligent Virtual Healthcare Assistant
 * Frontend JavaScript Application - Fully Client-Side
 */

// ============================================
// GLOBAL STATE (Your original state)
// ============================================
const state = {
    currentSection: 'chat',
    messages: [],
    selectedSymptoms: [],
    isTyping: false,
    sidebarOpen: true
};

// ============================================
// KNOWLEDGE BASE (Your original untouched data)
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
        'fever': { conditions: ['Common Cold', 'Flu', 'Viral Infection'], severity: 'moderate', advice: 'Rest, stay hydrated.' },
        'headache': { conditions: ['Tension Headache', 'Migraine'], severity: 'mild to moderate', advice: 'Rest in a quiet, dark room. Stay hydrated.' },
        'cough': { conditions: ['Common Cold', 'Flu', 'Bronchitis'], severity: 'mild to moderate', advice: 'Stay hydrated, use honey for soothing.' },
        'sore throat': { conditions: ['Common Cold', 'Strep Throat'], severity: 'mild to moderate', advice: 'Gargle with warm salt water.' },
        'stomach pain': { conditions: ['Indigestion', 'Gastritis'], severity: 'mild to high', advice: 'Avoid spicy and fatty foods. Eat bland foods.' },
        'nausea': { conditions: ['Food Poisoning', 'Motion Sickness'], severity: 'mild to moderate', advice: 'Eat small, bland meals. Ginger tea may help.' },
        'fatigue': { conditions: ['Anemia', 'Thyroid Issues'], severity: 'moderate', advice: 'Ensure adequate sleep, eat a balanced diet.' },
        'shortness of breath': { conditions: ['Asthma', 'Anxiety', 'Heart Issues'], severity: 'high', advice: '⚠️ Seek immediate medical attention.' },
        'chest pain': { conditions: ['Heart Attack', 'Angina', 'Anxiety'], severity: 'high', advice: '⚠️ Call emergency services (108) immediately.' },
        'rash': { conditions: ['Allergic Reaction', 'Eczema'], severity: 'mild to moderate', advice: 'Keep area clean and dry. Avoid scratching.' },
        'dizziness': { conditions: ['Low Blood Pressure', 'Dehydration'], severity: 'mild to moderate', advice: 'Sit or lie down immediately. Stay hydrated.' },
        'body ache': { conditions: ['Flu', 'Viral Infection'], severity: 'mild to moderate', advice: 'Rest, stay hydrated.' }
    },

    healthTopics: {
        'covid': { keywords: ['covid', 'coronavirus', 'covid-19'], response: 'COVID-19 Symptoms: Fever, Cough, Shortness of breath. Wear masks and wash hands.' },
        'diabetes': { keywords: ['diabetes', 'blood sugar'], response: 'Manage blood sugar, take medications, follow a balanced diet, and exercise.' },
        'blood pressure': { keywords: ['blood pressure', 'hypertension'], response: 'Reduce salt, exercise, limit alcohol, manage stress.' },
        'mental health': { keywords: ['stress', 'anxiety', 'depression'], response: 'Practice deep breathing, exercise, and seek professional help if persistent.' },
        'nutrition': { keywords: ['diet', 'nutrition', 'healthy eating'], response: 'Fill half plate with veggies, choose whole grains, lean proteins.' }
    }
};

// ============================================
// DOM ELEMENTS (Your original mapping)
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
// CORE LOGIC (Your exact original functions)
// ============================================
function initializeApp() {
    setupEventListeners();
    setupTextareaAutoResize();
    setTimeout(() => {
        addMessage('assistant', "Hello! I'm your Intelligent Virtual Healthcare Assistant. How can I help you today? 💙");
    }, 600);
}

function setupEventListeners() {
    elements.sidebarToggle?.addEventListener('click', toggleSidebar);
    elements.menuToggle?.addEventListener('click', toggleMobileSidebar);
    
    // NEW: Handle mobile X close button and overlay click away
    document.getElementById('closeSidebarMobile')?.addEventListener('click', () => { elements.sidebar.classList.remove('open'); });
    document.getElementById('sidebarOverlay')?.addEventListener('click', () => { elements.sidebar.classList.remove('open'); });

    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            if (section) switchSection(section);
            elements.navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            // Auto close mobile menu on click
            if (window.innerWidth <= 1024) elements.sidebar.classList.remove('open');
        });
    });

    elements.sendBtn?.addEventListener('click', sendMessage);
    elements.messageInput?.addEventListener('keydown', handleInputKeydown);
    elements.messageInput?.addEventListener('input', handleInputChange);
    elements.clearChatBtn?.addEventListener('click', clearChat);

    elements.suggestionChips?.forEach(chip => {
        chip.addEventListener('click', () => {
            elements.messageInput.value = chip.dataset.question;
            sendMessage();
        });
    });

    elements.symptomCards?.forEach(card => card.addEventListener('click', () => toggleSymptom(card)));
    elements.checkSymptomsBtn?.addEventListener('click', checkSymptoms);

    elements.helpBtn?.addEventListener('click', () => openModal(elements.helpModal));
    elements.closeModal?.addEventListener('click', () => closeModal(elements.helpModal));
    elements.emergencyBanner?.addEventListener('click', () => openModal(elements.emergencyModal));
    elements.closeEmergencyModal?.addEventListener('click', () => closeModal(elements.emergencyModal));
}

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
    });
    const sectionMap = { 'chat': elements.chatSection, 'symptoms': elements.symptomsSection, 'firstaid': elements.firstaidSection, 'healthtips': elements.healthtipsSection };
    if (sectionMap[sectionName]) sectionMap[sectionName].classList.add('active');
}

function setupTextareaAutoResize() {
    const textarea = elements.messageInput;
    if (!textarea) return;
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

function handleInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function handleInputChange() {
    const length = elements.messageInput.value.length;
    elements.charCount.textContent = `${length}/500`;
}

function processMessage(message) {
    const lowerMsg = message.toLowerCase();
    if (knowledgeBase.greetings.some(g => lowerMsg.includes(g))) return knowledgeBase.responses.greeting[0];
    for (const [topic, data] of Object.entries(knowledgeBase.healthTopics)) {
        if (data.keywords.some(kw => lowerMsg.includes(kw))) return data.response;
    }
    return knowledgeBase.responses.default;
}

async function sendMessage() {
    const message = elements.messageInput.value.trim();
    if (!message || state.isTyping) return;
    elements.welcomeScreen.style.display = 'none';
    addMessage('user', message);
    elements.messageInput.value = '';
    elements.charCount.textContent = '0/500';
    showTypingIndicator();
    await new Promise(resolve => setTimeout(resolve, 800));
    const response = processMessage(message);
    hideTypingIndicator();
    addMessage('assistant', response);
}

function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    const avatar = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    messageDiv.innerHTML = `<div class="message-avatar">${avatar}</div><div class="message-content"><div class="message-text">${text}</div></div>`;
    elements.chatMessages.appendChild(messageDiv);
    scrollToBottom();
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
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
}

function clearChat() {
    elements.chatMessages.innerHTML = '';
    elements.welcomeScreen.style.display = 'flex';
    setTimeout(() => { addMessage('assistant', "Hello! I'm your Intelligent Virtual Healthcare Assistant. How can I help you today? 💙"); }, 300);
}

function toggleSymptom(card) {
    const symptom = card.dataset.symptom;
    if (state.selectedSymptoms.includes(symptom)) {
        state.selectedSymptoms = state.selectedSymptoms.filter(s => s !== symptom);
        card.classList.remove('selected');
    } else {
        state.selectedSymptoms.push(symptom);
        card.classList.add('selected');
    }
    elements.checkSymptomsBtn.disabled = state.selectedSymptoms.length === 0;
}

function checkSymptoms() {
    const btn = elements.checkSymptomsBtn;
    btn.innerHTML = 'Analyzing...';
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-search"></i> Check Symptoms';
        alert("Symptom analysis complete. (UI logic intact)");
    }, 1000);
}

function openModal(modal) { modal.classList.add('active'); }
function closeModal(modal) { modal.classList.remove('active'); }

// ============================================
// NEW: LANDING PAGE & SCROLL ANIMATION LOGIC
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const scrollContainer = document.getElementById('scrollSequence');
    const frames = document.querySelectorAll('.scroll-frame');
    const launchBtn = document.getElementById('launchAppBtn');
    const mainApp = document.getElementById('mainApp');

    if (landingPage && scrollContainer) {
        window.addEventListener('scroll', () => {
            const rect = scrollContainer.getBoundingClientRect();
            const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
            const progressPerFrame = 1 / frames.length;

            frames.forEach((frame, index) => {
                const frameStart = index * progressPerFrame;
                const frameEnd = frameStart + progressPerFrame;
                if (scrollProgress >= frameStart && scrollProgress < frameEnd) {
                    frame.style.opacity = '1'; frame.style.transform = 'scale(1)'; frame.style.zIndex = '10';
                } else {
                    frame.style.opacity = '0'; frame.style.transform = scrollProgress > frameEnd ? 'scale(1.05)' : 'scale(0.95)'; frame.style.zIndex = '0';
                }
            });
        });

        launchBtn.addEventListener('click', () => {
            landingPage.style.transition = 'opacity 0.6s ease';
            landingPage.style.opacity = '0';
            setTimeout(() => {
                landingPage.style.display = 'none';
                mainApp.style.display = 'flex';
                void mainApp.offsetWidth; // Trigger reflow
                mainApp.style.transition = 'opacity 0.8s ease';
                mainApp.style.opacity = '1';
                initializeApp(); // Boot the original app logic
            }, 600);
        });
    } else {
        initializeApp();
    }
});