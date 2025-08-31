class TypingTest {
    constructor() {
        this.texts = {
            easy: [
                "the quick brown fox jumps over the lazy dog and runs through the forest",
                "she sells sea shells by the sea shore every morning at dawn",
                "practice makes perfect when you work hard and stay focused on your goals",
                "coffee tastes better in the morning when you have time to relax",
                "music helps people express their feelings and connect with others around them"
            ],
            medium: [
                "JavaScript is a versatile programming language that powers both web browsers and server applications. It enables developers to create interactive websites and dynamic user experiences.",
                "Machine learning algorithms can analyze vast amounts of data to discover patterns and make predictions. This technology is transforming industries from healthcare to finance.",
                "Cloud computing has revolutionized how businesses store and process data. Companies can now scale their operations efficiently without massive infrastructure investments."
            ],
            hard: [
                "The implementation of quantum computing algorithms requires understanding complex mathematical concepts including linear algebra, probability theory, and quantum mechanics. These systems leverage quantum superposition and entanglement phenomena.",
                "Cryptographic protocols ensure data security through sophisticated mathematical functions including elliptic curve cryptography, hash functions, and digital signatures. Modern encryption standards protect billions of transactions daily.",
                "Distributed systems architecture involves coordinating multiple computers to work together as a unified system. Challenges include consensus algorithms, fault tolerance, network partitions, and maintaining data consistency."
            ],
            quotes: [
                "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
                "Innovation distinguishes between a leader and a follower. Think different and create something amazing.",
                "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
                "The future belongs to those who believe in the beauty of their dreams and work hard to achieve them.",
                "Success is not final, failure is not fatal: it is the courage to continue that counts in life."
            ],
            numbers: [
                "In 2024, there were 1,234,567 users online. The server processed 890 requests per second on average.",
                "The temperature reached 98.6 degrees at 3:45 PM. We recorded 123 measurements throughout the day.",
                "Password: Aa1!Bb2@Cc3#Dd4$ - Remember these 16 characters exactly as shown with symbols.",
                "Invoice #INV-2024-0789: $1,250.50 due by 01/15/2024. Account: 555-123-4567-8901.",
                "IP Address: 192.168.1.1 Port: 8080 Connection established at 14:30:45 GMT+5."
            ],
            // Fun Language Modes
            fancyEnglish: [
                "exquisite magnificent extraordinary sophisticated remarkable phenomenal stupendous marvelous exceptional splendid sublime transcendent",
                "quintessential impeccable resplendent effervescent serendipitous euphonious mellifluous scintillating vivacious ebullient perspicacious",
                "sagacious magnanimous benevolent eloquent articulate erudite intellectual contemplative philosophical transcendental magnificent"
            ],
            tikTokSlang: [
                "slay queen periodt no cap fr fr its giving main character energy understood the assignment that hits different",
                "lowkey highkey vibe check say less bet facts bussin sheesh fire slaps mid sending me touch grass ratio based",
                "cringe stan simp hits different the way for me not me bestie sis bro valid unmatched iconic legend queen king"
            ],
            aussieSlang: [
                "fair dinkum mate no worries she'll be right good on ya bloody hell strewth crikey bonkers ripper beaut ace grouse",
                "chockers arvo servo bottle-o maccas brekkie bikkie mozzie tradie postie garbo ambo firie coppers dunny esky",
                "ute thongs singlet sunnies boardies togs rashie stubbie tinnie longneck grog she's apples too right mate"
            ],
            ukCoolPhrases: [
                "absolutely mental proper mad well good dead nice bare jokes peng ting safe bruv innit though peak times long ting",
                "calm down allow it wasteman roadman endz mandem gyaldem bare minimum maximum effort standard procedure top drawer",
                "first class spot on bang on ace move smashed it nailed it sorted cushty sound as a pound mint condition proper lush"
            ],
            britishExpressions: [
                "bloody brilliant absolutely bonkers utterly mad quite extraordinary rather splendid frightfully good terribly sorry awfully nice",
                "jolly good show old bean what a palaver bit of a pickle over the moon chuffed to bits taking the mickey having a laugh",
                "pull the other one stone the crows blimey charlie gordon bennett bob's your uncle fanny's your aunt tickety boo hunky dory"
            ]
        };
        
        this.currentText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.errors = 0;
        this.isTestActive = false;
        this.timer = null;
        this.timeLimit = 30;
        this.timeRemaining = 30;
        this.tabPressed = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadStats();
    }
    
    initializeElements() {
        this.textDisplay = document.getElementById('text-display');
        this.typingInput = document.getElementById('typing-input');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.difficultySelect = document.getElementById('difficulty-select');
        this.timerSelect = document.getElementById('timer-select');
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.timerElement = document.getElementById('timer');
        this.bestWpmElement = document.getElementById('best-wpm');
        this.resultsElement = document.getElementById('results');
        this.finalWpmElement = document.getElementById('final-wpm');
        this.finalAccuracyElement = document.getElementById('final-accuracy');
        this.finalCharsElement = document.getElementById('final-chars');
        this.finalErrorsElement = document.getElementById('final-errors');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startTest());
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.typingInput.addEventListener('input', () => this.handleInput());
        this.difficultySelect.addEventListener('change', () => this.resetTest());
        this.timerSelect.addEventListener('change', () => this.updateTimer());
        
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }
    
    handleKeyboardShortcuts(e) {
        if (e.key === 'Tab' && e.shiftKey === false) {
            e.preventDefault();
            this.tabPressed = true;
            setTimeout(() => {
                this.tabPressed = false;
            }, 1000);
            return;
        }
        
        if (e.key === 'Enter' && this.tabPressed) {
            e.preventDefault();
            this.resetTest();
            return;
        }
        
        if (e.key === 'Escape') {
            e.preventDefault();
            if (document.activeElement === this.typingInput) {
                this.typingInput.blur();
            } else {
                this.typingInput.focus();
            }
            return;
        }
        
        if (e.key === 'Enter' && !this.tabPressed && !this.isTestActive) {
            e.preventDefault();
            this.startTest();
            return;
        }
        
        if (e.key === ' ' && !this.isTestActive && document.activeElement !== this.typingInput) {
            e.preventDefault();
            this.startTest();
            return;
        }
        
        if (this.isTestActive && !this.isModifierKey(e.key) && document.activeElement !== this.typingInput) {
            this.typingInput.focus();
        }
    }
    
    isModifierKey(key) {
        const modifierKeys = [
            'Control', 'Alt', 'Shift', 'Meta', 'CapsLock', 'Tab', 
            'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'
        ];
        return modifierKeys.includes(key);
    }
    
    updateTimer() {
        this.timeLimit = parseInt(this.timerSelect.value);
        this.timeRemaining = this.timeLimit;
        this.timerElement.textContent = this.timeLimit + 's';
    }
    
    startTest() {
        this.isTestActive = true;
        this.startTime = new Date();
        this.currentIndex = 0;
        this.errors = 0;
        this.timeRemaining = this.timeLimit;
        
        const difficulty = this.difficultySelect.value;
        const textArray = this.texts[difficulty];
        this.currentText = textArray[Math.floor(Math.random() * textArray.length)];
        
        
        this.displayText();
        this.typingInput.disabled = false;
        this.typingInput.focus();
        this.typingInput.value = '';
        this.startBtn.disabled = true;
        this.resultsElement.style.display = 'none';
        
        this.startTimer();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.timerElement.textContent = this.timeRemaining + 's';
            
            if (this.timeRemaining <= 0) {
                this.endTest();
            }
        }, 1000);
    }
    
    resetTest() {
        this.isTestActive = false;
        this.currentIndex = 0;
        this.errors = 0;
        this.timeRemaining = this.timeLimit;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.typingInput.disabled = true;
        this.typingInput.value = '';
        this.startBtn.disabled = false;
        this.textDisplay.innerHTML = 'Click "Start Test" to begin typing practice';
        this.wpmElement.textContent = '0';
        this.accuracyElement.textContent = '100%';
        this.timerElement.textContent = this.timeLimit + 's';
        this.resultsElement.style.display = 'none';
    }
    
    displayText() {
        const chars = this.currentText.split('');
        const textContent = chars.map((char, index) => {
            let className = '';
            if (index < this.currentIndex) {
                className = this.isCharCorrect(index) ? 'correct' : 'incorrect';
            } else if (index === this.currentIndex) {
                className = 'current';
            }
            return `<span class="char ${className}">${char === ' ' ? '&nbsp;' : char}</span>`;
        }).join('');
        
        this.textDisplay.innerHTML = `<div class="text-content">${textContent}</div>`;
        
        // Add sliding animation when words are completed
        const words = this.currentText.substring(0, this.currentIndex).split(' ');
        if (words.length > 3 && this.currentIndex > 0) {
            this.textDisplay.classList.add('sliding');
        } else {
            this.textDisplay.classList.remove('sliding');
        }
    }
    
    isCharCorrect(index) {
        return this.typingInput.value[index] === this.currentText[index];
    }
    
    handleInput() {
        if (!this.isTestActive) return;
        
        const inputValue = this.typingInput.value;
        this.currentIndex = inputValue.length;
        
        this.updateStats();
        this.displayText();
        
        if (this.currentIndex >= this.currentText.length) {
            this.endTest();
        }
    }
    
    updateStats() {
        const inputValue = this.typingInput.value;
        const currentTime = new Date();
        const timeElapsed = (currentTime - this.startTime) / 1000 / 60; // in minutes
        
        const wordsTyped = inputValue.length / 5;
        const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
        this.wpmElement.textContent = wpm;
        
        let correctChars = 0;
        this.errors = 0;
        
        for (let i = 0; i < inputValue.length; i++) {
            if (i < this.currentText.length && inputValue[i] === this.currentText[i]) {
                correctChars++;
            } else {
                this.errors++;
            }
        }
        
        const accuracy = inputValue.length > 0 ? Math.round((correctChars / inputValue.length) * 100) : 100;
        this.accuracyElement.textContent = accuracy + '%';
    }
    
    endTest() {
        this.isTestActive = false;
        this.endTime = new Date();
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.typingInput.disabled = true;
        this.startBtn.disabled = false;
        
        this.calculateFinalStats();
        this.saveStats();
        this.showResults();
        
    }
    
    calculateFinalStats() {
        const inputValue = this.typingInput.value;
        const timeElapsed = (this.endTime - this.startTime) / 1000 / 60; // in minutes
        
        const wordsTyped = inputValue.length / 5;
        this.finalWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
        let correctChars = 0;
        for (let i = 0; i < inputValue.length; i++) {
            if (i < this.currentText.length && inputValue[i] === this.currentText[i]) {
                correctChars++;
            }
        }
        
        this.finalAccuracy = inputValue.length > 0 ? Math.round((correctChars / inputValue.length) * 100) : 100;
        this.finalCharsTyped = inputValue.length;
    }
    
    showResults() {
        this.finalWpmElement.textContent = this.finalWpm;
        this.finalAccuracyElement.textContent = this.finalAccuracy + '%';
        this.finalCharsElement.textContent = this.finalCharsTyped;
        this.finalErrorsElement.textContent = this.errors;
        this.resultsElement.style.display = 'block';
        this.resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    saveStats() {
        const stats = this.getStats();
        
        // Update best WPM
        if (this.finalWpm > stats.bestWpm) {
            stats.bestWpm = this.finalWpm;
            this.bestWpmElement.textContent = stats.bestWpm;
        }
        
        // Update total tests
        stats.totalTests++;
        
        // Update average WPM
        stats.totalWpm += this.finalWpm;
        stats.averageWpm = Math.round(stats.totalWpm / stats.totalTests);
        
        // Update average accuracy
        stats.totalAccuracy += this.finalAccuracy;
        stats.averageAccuracy = Math.round(stats.totalAccuracy / stats.totalTests);
        
        // Save recent scores (keep last 10)
        if (!stats.recentScores) stats.recentScores = [];
        stats.recentScores.push({
            wpm: this.finalWpm,
            accuracy: this.finalAccuracy,
            date: new Date().toLocaleDateString()
        });
        
        if (stats.recentScores.length > 10) {
            stats.recentScores = stats.recentScores.slice(-10);
        }
        
        localStorage.setItem('typingStats', JSON.stringify(stats));
    }
    
    loadStats() {
        const stats = this.getStats();
        this.bestWpmElement.textContent = stats.bestWpm;
    }
    
    getStats() {
        const defaultStats = {
            bestWpm: 0,
            averageWpm: 0,
            totalTests: 0,
            totalWpm: 0,
            totalAccuracy: 0,
            averageAccuracy: 0,
            recentScores: []
        };
        
        const saved = localStorage.getItem('typingStats');
        return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
    }
}

// Initialize the typing test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
    
});

