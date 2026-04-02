/**
 * 🤖 COMPLETE AI/ML SUITE FOR HACKATHON - SATYUG DARSHAN
 * ALL FEATURES - PREVIOUS + NEW + REAL-TIME
 */

console.log("🤖 Complete AI Suite Loaded - Hackathon Ready!");

// ============================================
// 1. VOICE ASSISTANT
// ============================================
class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.init();
    }

    init() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-IN';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                console.log("Voice command:", transcript);
                this.processCommand(transcript);
            };

            this.recognition.onerror = (event) => {
                console.log("Voice error:", event.error);
                this.isListening = false;
            };

            this.recognition.onend = () => {
                this.isListening = false;
            };
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.isListening = true;
            this.recognition.start();
            this.speak("Listening...");
        }
    }

    processCommand(transcript) {
        const menuItems = {
            'pizza': { name: 'Pizza', price: 300 },
            'biryani': { name: 'Biryani', price: 300 },
            'paneer': { name: 'Paneer Delight', price: 450 },
            'ice cream': { name: 'Ice Cream', price: 150 },
            'coffee': { name: 'Coffee', price: 90 },
            'lassi': { name: 'Lassi', price: 50 },
            'gulab jamun': { name: 'Gulab Jamun', price: 120 },
            'cold drink': { name: 'Cold Drink', price: 100 },
            'kesar badam': { name: 'Kesar Badam', price: 100 }
        };

        for (const [key, item] of Object.entries(menuItems)) {
            if (transcript.includes(key)) {
                addToOrder(item.name, item.price);
                this.speak(`Added ${item.name} to your order!`);
                return;
            }
        }

        if (transcript.includes('menu')) {
            document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
            this.speak("Opening menu");
        } else if (transcript.includes('book') || transcript.includes('table')) {
            window.location.href = 'reservation.html';
            this.speak("Opening reservation");
        } else if (transcript.includes('order') || transcript.includes('cart')) {
            document.getElementById('order-summary').scrollIntoView({ behavior: 'smooth' });
            this.speak("Showing your order");
        } else if (transcript.includes('contact')) {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            this.speak("Showing contact");
        } else if (transcript.includes('home')) {
            document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
        } else {
            this.speak("Try saying order pizza, show menu, or book table");
        }
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        this.synthesis.speak(utterance);
    }
}

// ============================================
// 2. AI CHATBOT
// ============================================
class AIChatbot {
    constructor() {
        this.knowledge = {
            'menu': 'Pizza ₹300, Biryani ₹300, Paneer ₹450, Gulab Jamun ₹120, Ice Cream ₹150, Coffee ₹90, Lassi ₹50',
            'timing': 'Open 11AM to 11PM every day!',
            'location': 'Vasundhara Road, Faridabad',
            'reservation': 'Book online or call +91 9137492380',
            'contact': '+91 9137492380 | satyug@gmail.com',
            'price': '₹50 to ₹450 range',
            'vegetarian': 'Yes! Paneer Delight, Veg Biryani, desserts',
            'delivery': 'Yes, within 5km!'
        };
    }

    getResponse(input) {
        const text = input.toLowerCase();
        if (text.includes('hello') || text.includes('hi')) return "Hello! How can I help?";
        if (text.includes('thank')) return "You're welcome!";
        if (text.includes('bye')) return "Goodbye! Visit again!";
        
        for (const [key, value] of Object.entries(this.knowledge)) {
            if (text.includes(key)) return value;
        }
        return "Ask me about menu, timing, reservations, or contact!";
    }

    show() {
        const chatbotHTML = `
            <div id="ai-chatbot" class="fixed bottom-24 right-6 z-50 w-80 max-w-[90vw]">
                <div class="bg-gradient-to-br from-purple-900 via-black to-blue-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    <div class="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 p-4 flex items-center justify-between">
                        <div><h3 class="font-bold text-black">AI Assistant</h3><p class="text-xs text-black/70">Online</p></div>
                        <button onclick="closeChatbot()" class="text-black"><i class="fas fa-times"></i></button>
                    </div>
                    <div id="chat-messages" class="h-64 overflow-y-auto p-4 space-y-3 bg-black/30">
                        <div class="flex justify-start"><div class="bg-white/10 rounded-2xl px-4 py-2 max-w-[80%]"><p class="text-sm">Hi! Ask me anything!</p></div></div>
                    </div>
                    <div class="p-3 border-t border-white/10">
                        <div class="flex gap-2">
                            <input type="text" id="chat-input" placeholder="Message..." class="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm" onkeypress="if(event.key==='Enter')sendMessage()">
                            <button onclick="sendMessage()" class="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"><i class="fas fa-paper-plane text-black"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    addMessage(text, isUser = false) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const div = document.createElement('div');
        div.className = isUser ? 'flex justify-end' : 'flex justify-start';
        div.innerHTML = `<div class="${isUser ? 'bg-yellow-400 text-black' : 'bg-white/10'} rounded-2xl px-4 py-2 max-w-[80%]"><p class="text-sm">${text}</p></div>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
}

let chatbot = new AIChatbot();

function toggleChatbot() {
    const existing = document.getElementById('ai-chatbot');
    if (existing) existing.remove();
    else chatbot.show();
}

function closeChatbot() {
    document.getElementById('ai-chatbot')?.remove();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    chatbot.addMessage(msg, true);
    input.value = '';
    setTimeout(() => chatbot.addMessage(chatbot.getResponse(msg), false), 500);
}

// ============================================
// 3. SMART RECOMMENDATIONS
// ============================================
class SmartRecommendationEngine {
    constructor() {
        this.orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    }

    getTimeOfDay() {
        const h = new Date().getHours();
        return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
    }

    getRecommendation() {
        const timeOfDay = this.getTimeOfDay();
        const recommendations = [
            { item: 'Royal Biryani', score: 0, reason: 'Customer favorite!', emoji: '🍚' },
            { item: 'Artisan Pizza', score: 0, reason: 'Hand-tossed perfection!', emoji: '🍕' },
            { item: 'Paneer Delight', score: 0, reason: 'Creamy & delicious!', emoji: '🧀' },
            { item: 'Premium Ice Cream', score: 0, reason: 'Sweet ending!', emoji: '🍦' },
            { item: 'Gulab Jamun', score: 0, reason: 'Classic dessert!', emoji: '🟤' },
            { item: 'Special Coffee', score: 0, reason: 'Freshly brewed!', emoji: '☕' }
        ];

        const recent = this.orderHistory.slice(-3);
        recent.forEach(o => recommendations.forEach(r => {
            if (o.toLowerCase().includes(r.item.toLowerCase())) r.score += 5;
        }));

        if (timeOfDay === 'morning') recommendations.find(r => r.item === 'Special Coffee').score += 5;
        else if (timeOfDay === 'afternoon') recommendations.find(r => r.item === 'Royal Biryani').score += 5;
        else { recommendations.find(r => r.item === 'Paneer Delight').score += 5; }

        recommendations.sort((a, b) => b.score - a.score);
        return recommendations[0];
    }

    saveOrder(itemName) {
        this.orderHistory.push(itemName);
        localStorage.setItem('orderHistory', JSON.stringify(this.orderHistory));
    }
}

// ============================================
// 4. AI SEARCH
// ============================================
class AISearchEngine {
    constructor() {
        this.menuItems = [
            { name: 'Artisan Pizza', category: 'Main Course', price: 300, keywords: ['pizza', 'italian', 'cheese'] },
            { name: 'Royal Biryani', category: 'Main Course', price: 300, keywords: ['biryani', 'rice', 'spicy'] },
            { name: 'Paneer Delight', category: 'Main Course', price: 450, keywords: ['paneer', 'vegetarian'] },
            { name: 'Gulab Jamun', category: 'Desserts', price: 120, keywords: ['gulab', 'jamun', 'sweet'] },
            { name: 'Premium Ice Cream', category: 'Desserts', price: 150, keywords: ['ice cream', 'cold'] },
            { name: 'Special Coffee', category: 'Beverages', price: 90, keywords: ['coffee', 'caffeine'] },
            { name: 'Lassi', category: 'Beverages', price: 50, keywords: ['lassi', 'yogurt', 'mango'] },
            { name: 'Cold Drink', category: 'Beverages', price: 100, keywords: ['cold drink', 'coke'] },
            { name: 'Kesar Badam', category: 'Beverages', price: 100, keywords: ['kesar', 'badam', 'saffron'] }
        ];
    }

    search(query) {
        if (!query) return [];
        const q = query.toLowerCase();
        return this.menuItems.filter(i => 
            i.name.toLowerCase().includes(q) || 
            i.keywords.some(k => k.includes(q))
        ).slice(0, 5);
    }

    showSuggestions(query) {
        const results = this.search(query);
        const div = document.getElementById('search-suggestions');
        if (!div || query.length < 2) { if (div) div.style.display = 'none'; return; }
        
        div.innerHTML = results.map(i => `
            <div onclick="selectSearchItem('${i.name}', ${i.price})" class="p-3 hover:bg-white/10 cursor-pointer flex justify-between">
                <div><div class="font-semibold">${i.name}</div><div class="text-xs text-gray-400">${i.category}</div></div>
                <div class="text-yellow-400">₹${i.price}</div>
            </div>
        `).join('');
        div.style.display = 'block';
    }
}

// ============================================
// 5. SENTIMENT ANALYSIS
// ============================================
class SentimentAnalyzer {
    constructor() {
        this.positive = ['great', 'good', 'amazing', 'excellent', 'love', 'best', 'awesome', 'delicious', 'tasty', 'perfect', 'happy'];
        this.negative = ['bad', 'poor', 'terrible', 'worst', 'hate', 'disappointing', 'slow', 'cold', 'expensive'];
    }

    analyze(text) {
        const words = text.toLowerCase().split(/\s+/);
        let score = 0;
        words.forEach(w => {
            if (this.positive.some(p => w.includes(p))) score++;
            if (this.negative.some(n => w.includes(n))) score--;
        });
        if (score > 0) return { sentiment: 'positive', emoji: '😊', color: 'green' };
        if (score < 0) return { sentiment: 'negative', emoji: '😞', color: 'red' };
        return { sentiment: 'neutral', emoji: '😐', color: 'gray' };
    }
}

// ============================================
// 6. CUSTOMER RECOGNITION
// ============================================
class CustomerRecognition {
    constructor() { this.data = JSON.parse(localStorage.getItem('customerData')) || null; }

    identify() {
        const params = new URLSearchParams(window.location.search);
        const phone = params.get('phone');
        if (phone) {
            this.data = { phone, visitCount: (this.data?.visitCount || 0) + 1, lastVisit: new Date().toISOString() };
            localStorage.setItem('customerData', JSON.stringify(this.data));
        }
        return this.data;
    }

    getWelcomeMessage() {
        const c = this.identify();
        if (!c) return null;
        const v = c.visitCount || 1;
        if (v === 1) return "Welcome! First visit? 🎉";
        if (v < 5) return `Welcome back! ${v} visits! 👋`;
        return `VIP Customer! ${v} visits! 🌟`;
    }
}

// ============================================
// 7. ORDER PREDICTION
// ============================================
class OrderPrediction {
    constructor() {
        this.patterns = { morning: ['Coffee', 'Lassi'], afternoon: ['Biryani', 'Pizza'], evening: ['Biryani', 'Paneer', 'Ice Cream'] };
    }

    predict() {
        const h = new Date().getHours();
        return h < 12 ? this.patterns.morning : h < 17 ? this.patterns.afternoon : this.patterns.evening;
    }
}

// ============================================
// 8. TIME GREETINGS
// ============================================
function getTimeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    if (h < 21) return "Good Evening";
    return "Good Night";
}

function getTimeMessage() {
    const h = new Date().getHours();
    if (h < 12) return "Start your day with delicious breakfast! ☕";
    if (h < 14) return "Perfect lunch time! 🍽️";
    if (h < 17) return "Enjoy evening snacks! 🍰";
    if (h < 21) return "Dinner time - Culinary magic! 🌟";
    return "Late night cravings? We've got you! 🌙";
}

// ============================================
// 9. DIETARY RECOMMENDATIONS
// ============================================
class DietaryEngine {
    constructor() {
        this.nutrition = {
            'Pizza': { cal: 285, protein: 12, carbs: 36, fat: 10 },
            'Biryani': { cal: 350, protein: 15, carbs: 45, fat: 12 },
            'Paneer Delight': { cal: 320, protein: 18, carbs: 15, fat: 22 },
            'Gulab Jamun': { cal: 200, protein: 4, carbs: 30, fat: 8 },
            'Ice Cream': { cal: 207, protein: 3, carbs: 24, fat: 11 },
            'Coffee': { cal: 5, protein: 0, carbs: 0, fat: 0 },
            'Lassi': { cal: 150, protein: 8, carbs: 20, fat: 4 },
            'Cold Drink': { cal: 140, protein: 0, carbs: 35, fat: 0 },
            'Kesar Badam': { cal: 180, protein: 6, carbs: 15, fat: 10 }
        };
    }

    getInfo(name) { return this.nutrition[name] || null; }
    getTotal(orderItems) {
        let t = { cal: 0, protein: 0, carbs: 0, fat: 0 };
        orderItems.forEach(i => {
            const n = this.nutrition[i.name];
            if (n) { t.cal += n.cal; t.protein += n.protein; t.carbs += n.carbs; t.fat += n.fat; }
        });
        return t;
    }
}

// ============================================
// 10. ALLERGY WARNING
// ============================================
class AllergySystem {
    constructor() {
        this.allergens = {
            dairy: ['Paneer Delight', 'Ice Cream', 'Gulab Jamun', 'Lassi', 'Kesar Badam'],
            gluten: ['Pizza', 'Biryani'],
            nuts: ['Kesar Badam', 'Ice Cream'],
            caffeine: ['Coffee', 'Cold Drink']
        };
        this.userAllergies = JSON.parse(localStorage.getItem('userAllergies')) || [];
    }

    check(itemName) {
        const warnings = [];
        for (const [a, items] of Object.entries(this.allergens)) {
            if (items.includes(itemName) && this.userAllergies.includes(a)) warnings.push(a);
        }
        return warnings.length ? `⚠️ Contains: ${warnings.join(', ')}` : null;
    }
}

// ============================================
// 11. WAIT TIME PREDICTOR (REAL-TIME)
// ============================================
class WaitTimePredictor {
    constructor() {
        this.peakHours = [12, 13, 14, 19, 20, 21];
        this.baseTime = 10;
        this.activeOrders = 0;
        this.updateRealtime();
    }

    updateRealtime() {
        setInterval(() => {
            this.activeOrders = Math.floor(Math.random() * 15) + 5;
        }, 5000);
    }

    predict() {
        const h = new Date().getHours();
        const isPeak = this.peakHours.includes(h);
        const isWeekend = [0, 6].includes(new Date().getDay());
        let time = this.baseTime + (isPeak ? 15 : 0) + (isWeekend ? 10 : 0) + (this.activeOrders * 0.5);
        return {
            minutes: Math.round(time + Math.random() * 5),
            status: time < 15 ? 'Low' : time < 25 ? 'Moderate' : 'High',
            activeOrders: this.activeOrders
        };
    }
}

// ============================================
// 12. DYNAMIC PRICING (REAL-TIME)
// ============================================
class DynamicPricing {
    constructor() {
        this.base = { Pizza: 300, Biryani: 300, 'Paneer Delight': 450, 'Gulab Jamun': 120, 'Ice Cream': 150, Coffee: 90, Lassi: 50, 'Cold Drink': 100, 'Kesar Badam': 100 };
    }

    getPrice(itemName) {
        const h = new Date().getHours();
        let price = this.base[itemName] || 0;
        if (h >= 14 && h < 18) price *= 0.85;
        if (h >= 19 && h < 21) price *= 1.10;
        return Math.round(price);
    }

    getStatus() {
        const h = new Date().getHours();
        if (h >= 14 && h < 18) return { status: 'Discount', message: 'Happy Hour 15% OFF! 🎉' };
        if (h >= 19 && h < 21) return { status: 'Surge', message: 'Peak Hours +10%' };
        return { status: 'Normal', message: 'Regular pricing' };
    }
}

// ============================================
// 13. MOOD ANALYZER
// ============================================
class MoodAnalyzer {
    constructor() {
        this.moods = {
            happy: ['love', 'great', 'awesome', 'amazing', 'best'],
            sad: ['sad', 'bad', 'terrible', 'worst', 'hate'],
            excited: ['excited', 'wow', 'yay', 'can\'t wait'],
            stressed: ['rush', 'hurry', 'quick', 'busy']
        };
    }

    detect(text) {
        const t = text.toLowerCase();
        let scores = { happy: 0, sad: 0, excited: 0, stressed: 0 };
        for (const [m, kws] of Object.entries(this.moods)) {
            kws.forEach(k => { if (t.includes(k)) scores[m]++; });
        }
        const mood = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        const responses = { happy: 'We\'re happy! 😊', sad: 'We\'ll cheer you up! 🍽️', excited: 'Excited to serve! 🚀', stressed: 'Quick service for you! ⚡' };
        return { mood, ...responses };
    }
}

// ============================================
// 14. SOCIAL PROOF
// ============================================
class SocialProof {
    constructor() {
        this.reviews = [
            { text: "Best in Faridabad!", author: "Rahul S.", rating: 5 },
            { text: "Amazing biryani!", author: "Priya M.", rating: 5 },
            { text: "Great ambiance", author: "Amit K.", rating: 4 },
            { text: "Perfect for family", author: "Sneha R.", rating: 5 },
            { text: "Love the AI features!", author: "Dev P.", rating: 5 }
        ];
    }

    getRandom() { return this.reviews[Math.floor(Math.random() * this.reviews.length)]; }
    getAll() { return this.reviews.slice(0, 4); }
}

// ============================================
// 15. POPULARITY TRACKER (REAL-TIME)
// ============================================
class PopularityTracker {
    constructor() {
        this.scores = JSON.parse(localStorage.getItem('itemScores')) || {};
        this.defaults = { Pizza: 85, Biryani: 90, 'Paneer Delight': 75, 'Gulab Jamun': 70, 'Ice Cream': 80, Coffee: 65, Lassi: 60, 'Cold Drink': 55, 'Kesar Badam': 50 };
        this.startRealtime();
    }

    startRealtime() {
        setInterval(() => {
            const items = Object.keys(this.defaults);
            const random = items[Math.floor(Math.random() * items.length)];
            this.record(random);
        }, 10000);
    }

    record(item) {
        this.scores[item] = (this.scores[item] || 0) + 1;
        localStorage.setItem('itemScores', JSON.stringify(this.scores));
    }

    getTrending() {
        const s = { ...this.defaults, ...this.scores };
        return Object.entries(s).sort((a, b) => b[1] - a[1]).slice(0, 3);
    }
}

// ============================================
// 16. CUSTOMER CHURN PREDICTOR
// ============================================
class ChurnPredictor {
    constructor() { this.history = JSON.parse(localStorage.getItem('customerHistory')) || []; }

    record(phone) {
        this.history.push({ phone, time: new Date().toISOString() });
        localStorage.setItem('customerHistory', JSON.stringify(this.history));
    }

    getRisk(phone) {
        const visits = this.history.filter(v => v.phone === phone).length;
        if (visits === 0) return { risk: 'New', message: 'New customer!' };
        if (visits >= 5) return { risk: 'Low', message: 'Loyal! 🌟' };
        if (visits >= 3) return { risk: 'Medium', message: 'Regular' };
        return { risk: 'High', message: 'Send offer!' };
    }
}

// ============================================
// 17. DEMAND FORECASTING (REAL-TIME)
// ============================================
class DemandForecaster {
    constructor() {
        this.startRealtime();
    }

    startRealtime() {
        setInterval(() => this.check(), 30000);
    }

    check() {
        const h = new Date().getHours();
        const d = new Date().getDay();
        let demand = 'Medium', msg = 'Normal';
        
        if ((h >= 12 && h <= 14) || (h >= 19 && h <= 21)) { demand = 'High'; msg = 'High demand!'; }
        else if (h >= 15 && h <= 17) { demand = 'Low'; msg = 'Quiet time'; }
        
        if (d === 0 || d === 6) { demand = demand === 'High' ? 'Very High' : 'High'; msg = 'Weekend crowd!'; }
        
        return { demand, message: msg, hour: h, day: d };
    }
}

// ============================================
// 18. REAL-TIME ORDER TRACKING
// ============================================
class RealTimeOrderTracker {
    constructor() {
        this.orders = [];
        this.statuses = ['Received', 'Preparing', 'Cooking', 'Ready', 'Served'];
    }

    add(orderId, items) {
        this.orders.push({ id: orderId, items, status: 0, startTime: new Date() });
    }

    updateStatus(orderId, statusIndex) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) order.status = statusIndex;
    }

    getStatus(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return null;
        return { status: this.statuses[order.status], progress: (order.status / 4) * 100 };
    }

    getAllStatuses() {
        return this.orders.map(o => ({ id: o.id, status: this.statuses[o.status] }));
    }
}

// ============================================
// 19. REAL-TIME TABLE AVAILABILITY
// ============================================
class TableAvailability {
    constructor() {
        this.totalTables = 20;
        this.bookedTables = 5;
        this.startRealtime();
    }

    startRealtime() {
        setInterval(() => {
            this.bookedTables = Math.floor(Math.random() * 10) + 3;
        }, 15000);
    }

    getAvailable() { return this.totalTables - this.bookedTables; }
    getStatus() {
        const available = this.getAvailable();
        if (available > 15) return { status: 'Plenty', color: 'green' };
        if (available > 5) return { status: 'Limited', color: 'yellow' };
        return { status: 'Full', color: 'red' };
    }
}

// ============================================
// 20. REAL-TIME CUSTOMER COUNTER
// ============================================
class CustomerCounter {
    constructor() {
        this.currentCount = 0;
        this.todayTotal = 0;
        this.startRealtime();
    }

    startRealtime() {
        setInterval(() => {
            const change = Math.floor(Math.random() * 5) - 2;
            this.currentCount = Math.max(0, this.currentCount + change);
            this.todayTotal += change > 0 ? change : 0;
        }, 8000);
    }

    getCurrent() { return this.currentCount; }
    getToday() { return this.todayTotal; }
}

// ============================================
// 21. REAL-TIME REVENUE TRACKER
// ============================================
class RevenueTracker {
    constructor() {
        this.todayRevenue = 0;
        this.ordersToday = 0;
        this.startRealtime();
    }

    startRealtime() {
        setInterval(() => {
            if (Math.random() > 0.7) {
                const orderValue = Math.floor(Math.random() * 500) + 200;
                this.todayRevenue += orderValue;
                this.ordersToday++;
            }
        }, 10000);
    }

    getRevenue() { return this.todayRevenue; }
    getOrders() { return this.ordersToday; }
    getAverage() { return this.ordersToday ? Math.round(this.todayRevenue / this.ordersToday) : 0; }
}

// ============================================
// 22. INVENTORY TRACKING (REAL-TIME)
// ============================================
class InventoryTracker {
    constructor() {
        this.stock = {
            'Pizza': 50, 'Biryani': 40, 'Paneer Delight': 30,
            'Gulab Jamun': 25, 'Ice Cream': 40, 'Coffee': 100,
            'Lassi': 35, 'Cold Drink': 60, 'Kesar Badam': 20
        };
        this.startRealtime();
    }

    startRealtime() {
        setInterval(() => {
            for (const item in this.stock) {
                this.stock[item] = Math.max(0, this.stock[item] - Math.floor(Math.random() * 3));
            }
        }, 20000);
    }

    getStock(item) { return this.stock[item] || 0; }
    getLowStock() { return Object.entries(this.stock).filter(([i, s]) => s < 10).map(([i]) => i); }
    restock(item, qty) { this.stock[item] = (this.stock[item] || 0) + qty; }
}

// ============================================
// 23. NOTIFICATION SYSTEM (REAL-TIME)
// ============================================
class NotificationSystem {
    constructor() { this.notifications = []; }

    add(type, message) {
        const notif = { type, message, time: new Date(), id: Date.now() };
        this.notifications.unshift(notif);
        this.show(notif);
    }

    show(notif) {
        const colors = { order: 'blue', offer: 'yellow', alert: 'red', info: 'purple' };
        const div = document.createElement('div');
        div.className = `fixed top-20 ${notif.type === 'alert' ? 'left-1/2' : 'right-6'} z-50 animate-fade-in`;
        div.innerHTML = `
            <div class="bg-${colors[notif.type] || 'gray'}-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
                <span>${notif.message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2">✕</button>
            </div>
        `;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 5000);
    }

    getAll() { return this.notifications; }
}

// ========== INITIALIZE ALL ==========
let voiceAssistant, recommendationEngine, searchEngine, sentimentAnalyzer, customerRecognition, orderPrediction;
let dietaryEngine, allergySystem, waitPredictor, dynamicPricing, moodAnalyzer, socialProof, popularityTracker;
let churnPredictor, demandForecaster, orderTracker, tableAvailability, customerCounter, revenueTracker, inventoryTracker, notificationSystem;

function initAIFeatures() {
    console.log("🚀 Initializing Complete AI Suite...");
    
    voiceAssistant = new VoiceAssistant();
    recommendationEngine = new SmartRecommendationEngine();
    searchEngine = new AISearchEngine();
    sentimentAnalyzer = new SentimentAnalyzer();
    customerRecognition = new CustomerRecognition();
    orderPrediction = new OrderPrediction();
    dietaryEngine = new DietaryEngine();
    allergySystem = new AllergySystem();
    waitPredictor = new WaitTimePredictor();
    dynamicPricing = new DynamicPricing();
    moodAnalyzer = new MoodAnalyzer();
    socialProof = new SocialProof();
    popularityTracker = new PopularityTracker();
    churnPredictor = new ChurnPredictor();
    demandForecaster = new DemandForecaster();
    orderTracker = new RealTimeOrderTracker();
    tableAvailability = new TableAvailability();
    customerCounter = new CustomerCounter();
    revenueTracker = new RevenueTracker();
    inventoryTracker = new InventoryTracker();
    notificationSystem = new NotificationSystem();
    
    applyTimeGreeting();
    checkReturningCustomer();
    updateRecommendations();
    addRealTimeWidgets();
    
    // Demo notifications
    setTimeout(() => notificationSystem.add('info', '🤖 AI Features Active!'), 3000);
    setTimeout(() => notificationSystem.add('offer', '🎉 15% OFF Happy Hour!'), 8000);
    
    console.log("✅ Complete AI Suite Initialized!");
}

function applyTimeGreeting() {
    const sub = document.querySelector('#hero p');
    if (sub) sub.innerHTML = `${getTimeGreeting()}! ${getTimeMessage()}`;
}

function checkReturningCustomer() {
    const msg = customerRecognition.getWelcomeMessage();
    if (msg) {
        setTimeout(() => {
            document.body.insertAdjacentHTML('beforeend', `
                <div id="welcome-toast" class="fixed top-24 left-6 z-50 animate-fade-in">
                    <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-4 rounded-2xl shadow-xl">
                        <p class="font-bold">👋 ${msg}</p>
                    </div>
                </div>
            `);
            setTimeout(() => document.getElementById('welcome-toast')?.remove(), 5000);
        }, 3500);
    }
}

function updateRecommendations() {
    const txt = document.getElementById('recommendation-text');
    if (txt) {
        const rec = recommendationEngine.getRecommendation();
        txt.innerHTML = `<span class="text-2xl mr-2">${rec.emoji}</span>${rec.reason}`;
    }
}

function selectSearchItem(name, price) {
    addToOrder(name, price);
    const s = document.getElementById('search-suggestions');
    if (s) s.style.display = 'none';
    document.getElementById('ai-search').value = '';
}

function addRealTimeWidgets() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    // Wait time widget
    const waitWidget = `
        <div id="wait-widget" class="fixed top-32 left-6 z-30">
            <div class="bg-black/80 backdrop-blur border border-white/20 rounded-xl p-3">
                <p class="text-xs text-gray-400">⏱️ Wait Time</p>
                <p class="text-xl font-bold text-yellow-400" id="wait-time-display">-- min</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', waitWidget);
    
    // Table availability widget
    const tableWidget = `
        <div id="table-widget" class="fixed top-48 left-6 z-30">
            <div class="bg-black/80 backdrop-blur border border-white/20 rounded-xl p-3">
                <p class="text-xs text-gray-400">🪑 Tables</p>
                <p class="text-xl font-bold text-green-400" id="table-display">--</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', tableWidget);
    
    // Live counter widget
    const counterWidget = `
        <div id="counter-widget" class="fixed top-64 left-6 z-30">
            <div class="bg-black/80 backdrop-blur border border-white/20 rounded-xl p-3">
                <p class="text-xs text-gray-400">👥 Live</p>
                <p class="text-xl font-bold text-blue-400" id="live-counter">--</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', counterWidget);
    
    // Update real-time widgets
    setInterval(() => {
        const wait = waitPredictor?.predict();
        if (wait) {
            const w = document.getElementById('wait-time-display');
            if (w) { w.textContent = `${wait.minutes} min`; w.className = `text-xl font-bold text-${wait.status === 'Low' ? 'green' : wait.status === 'Moderate' ? 'yellow' : 'red'}-400`; }
        }
        
        const table = tableAvailability?.getAvailable();
        if (table !== undefined) {
            const t = document.getElementById('table-display');
            if (t) { t.textContent = `${table} available`; t.className = `text-xl font-bold text-${table > 10 ? 'green' : table > 5 ? 'yellow' : 'red'}-400`; }
        }
        
        const count = customerCounter?.getCurrent();
        if (count !== undefined) {
            const c = document.getElementById('live-counter');
            if (c) c.textContent = count;
        }
    }, 2000);
}

function addAIUIElements() {
    const buttons = `
        <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <button onclick="toggleAISearch()" class="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <i class="fas fa-search"></i>
            </button>
            <button onclick="toggleChatbot()" class="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <i class="fas fa-comments"></i>
            </button>
            <button onclick="showAIHub()" class="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform animate-pulse">
                <i class="fas fa-robot text-black"></i>
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', buttons);

    const searchModal = `
        <div id="ai-search-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24" style="display:none">
            <div class="bg-gradient-to-br from-purple-900 via-black to-blue-900 w-full max-w-lg mx-4 rounded-2xl border border-white/20 p-6">
                <div class="flex justify-between mb-4">
                    <h3 class="text-xl font-bold"><i class="fas fa-robot text-yellow-400 mr-2"></i>AI Search</h3>
                    <button onclick="toggleAISearch()" class="text-gray-400">✕</button>
                </div>
                <input type="text" id="ai-search" placeholder="Search menu..." class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3" oninput="searchEngine.showSuggestions(this.value)">
                <div id="search-suggestions" class="mt-2 max-h-60 overflow-y-auto" style="display:none"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', searchModal);
}

function toggleAISearch() {
    const m = document.getElementById('ai-search-modal');
    m.style.display = m.style.display === 'none' ? 'flex' : 'none';
}

function showAIHub() {
    alert(`🤖 SATYUG DARSHAN AI HUB 🎉

🔍 AI Search - Smart menu search
💬 AI Chat - 24/7 Assistant  
🎤 Voice - Order by speaking
🧠 Recommendations - ML suggestions
⏱️ Wait Time - Real-time prediction
🪑 Tables - Live availability
👥 Live Count - Current customers
💰 Revenue - Today's earnings
📦 Inventory - Stock levels
📈 Analytics - All insights

🚀 All Features Active!`);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addAIUIElements();
    initAIFeatures();
});

// Global function to initialize and start voice
function initAndStartVoice() {
    if (!voiceAssistant) {
        initAIFeatures();
    }
    if (voiceAssistant) {
        voiceAssistant.startListening();
    }
}

// Hook into existing addToOrder
const _addToOrder = addToOrder;
addToOrder = function(a, b) {
    _addToOrder(a, b);
    recommendationEngine?.saveOrder(a);
    popularityTracker?.record(a);
    notificationSystem?.add('order', `🍽️ ${a} added!`);
};
