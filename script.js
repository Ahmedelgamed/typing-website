class TypingTest {
    constructor() {
        this.texts = {
            easy: [
                "The quick brown fox jumps over the lazy dog. This is a simple sentence to practice typing skills.",
                "Coding is fun and creative. It helps solve problems and build amazing things for everyone to use.",
                "Practice makes perfect. The more you type, the faster and more accurate you will become over time."
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
            ]
        };
        
        this.currentText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.errors = 0;
        this.isTestActive = false;
        this.timer = null;
        this.timeLimit = 60;
        this.timeRemaining = 60;
        
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
        this.textDisplay.innerHTML = chars.map((char, index) => {
            let className = '';
            if (index < this.currentIndex) {
                className = this.isCharCorrect(index) ? 'correct' : 'incorrect';
            } else if (index === this.currentIndex) {
                className = 'current';
            }
            return `<span class="char ${className}">${char === ' ' ? '&nbsp;' : char}</span>`;
        }).join('');
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
        
        // Calculate WPM
        const wordsTyped = inputValue.length / 5; // Standard: 5 characters = 1 word
        const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
        this.wpmElement.textContent = wpm;
        
        // Calculate accuracy
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
        
        // Final WPM calculation
        const wordsTyped = inputValue.length / 5;
        this.finalWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
        
        // Final accuracy calculation
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

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const typingTest = new TypingTest();
        typingTest.resetTest();
    }
});