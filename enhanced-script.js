class EnhancedTypingTrainer {
    constructor() {
        this.keyStats = this.loadKeyStats();
        this.adaptiveDifficulty = 1;
        this.focusKeys = this.getFocusKeys();
        
        // Advanced Text Generation
        this.letterFrequency = {
            'e': 12.70, 't': 9.06, 'a': 8.17, 'o': 7.51, 'i': 6.97,
            'n': 6.75, 's': 6.33, 'h': 6.09, 'r': 5.99, 'd': 4.25,
            'l': 4.03, 'c': 2.78, 'u': 2.76, 'm': 2.41, 'w': 2.36,
            'f': 2.23, 'g': 2.02, 'y': 1.97, 'p': 1.93, 'b': 1.29,
            'v': 0.98, 'k': 0.77, 'j': 0.15, 'x': 0.15, 'q': 0.10, 'z': 0.07
        };
        
        // Common letter combinations and patterns
        this.commonBigrams = ['th', 'he', 'in', 'er', 're', 'an', 'nd', 'at', 'on', 'nt', 'ha', 'es', 'st', 'en', 'ed', 'to', 'it', 'ou', 'ea', 'hi'];
        this.commonTrigrams = ['the', 'and', 'ing', 'her', 'hat', 'his', 'tha', 'ere', 'for', 'ent', 'ion', 'ter', 'was', 'you', 'ith', 'ver', 'all', 'wit', 'thi', 'tio'];
        
        // Finger-to-key mapping for visual guidance
        this.fingerMap = {
            'q': 'left-pinky', 'w': 'left-ring', 'e': 'left-middle', 'r': 'left-index', 't': 'left-index',
            'y': 'right-index', 'u': 'right-index', 'i': 'right-middle', 'o': 'right-ring', 'p': 'right-pinky',
            'a': 'left-pinky', 's': 'left-ring', 'd': 'left-middle', 'f': 'left-index', 'g': 'left-index',
            'h': 'right-index', 'j': 'right-index', 'k': 'right-middle', 'l': 'right-ring', ';': 'right-pinky',
            'z': 'left-pinky', 'x': 'left-ring', 'c': 'left-middle', 'v': 'left-index', 'b': 'left-index',
            'n': 'right-index', 'm': 'right-index', ',': 'right-middle', '.': 'right-ring', '/': 'right-pinky',
            ' ': 'thumb'
        };
        
        // Current session data
        this.currentText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.sessionErrors = new Map(); // Track errors per character
        this.sessionKeystrokes = [];
        this.isActive = false;
        
        // Real-time metrics
        this.wpm = 0;
        this.accuracy = 100;
        this.keystrokeBuffer = [];
        this.metricsUpdateInterval = null;
        
        // Visual feedback
        this.currentChar = null;
        this.nextChars = [];
        this.soundEnabled = true;
        
        this.initialize();
    }
    
    initialize() {
        this.createKeyboard();
        this.createEnhancedUI();
        this.bindEvents();
        this.generateAdaptiveText();
        this.startMetricsUpdater();
    }
    
    createKeyboard() {
        const keyboardContainer = document.createElement('div');
        keyboardContainer.className = 'virtual-keyboard';
        keyboardContainer.innerHTML = `
            <div class="keyboard-instructions">
                <p>Virtual Keyboard - Watch finger positioning</p>
            </div>
            <div class="keyboard-row">
                <div class="key" data-key="q">Q</div>
                <div class="key" data-key="w">W</div>
                <div class="key" data-key="e">E</div>
                <div class="key" data-key="r">R</div>
                <div class="key" data-key="t">T</div>
                <div class="key" data-key="y">Y</div>
                <div class="key" data-key="u">U</div>
                <div class="key" data-key="i">I</div>
                <div class="key" data-key="o">O</div>
                <div class="key" data-key="p">P</div>
            </div>
            <div class="keyboard-row">
                <div class="key" data-key="a">A</div>
                <div class="key" data-key="s">S</div>
                <div class="key" data-key="d">D</div>
                <div class="key" data-key="f">F</div>
                <div class="key" data-key="g">G</div>
                <div class="key" data-key="h">H</div>
                <div class="key" data-key="j">J</div>
                <div class="key" data-key="k">K</div>
                <div class="key" data-key="l">L</div>
                <div class="key" data-key=";">;</div>
            </div>
            <div class="keyboard-row">
                <div class="key" data-key="z">Z</div>
                <div class="key" data-key="x">X</div>
                <div class="key" data-key="c">C</div>
                <div class="key" data-key="v">V</div>
                <div class="key" data-key="b">B</div>
                <div class="key" data-key="n">N</div>
                <div class="key" data-key="m">M</div>
                <div class="key" data-key=",">,</div>
                <div class="key" data-key=".">.</div>
                <div class="key" data-key="/">/</div>
            </div>
            <div class="keyboard-row">
                <div class="key space-key" data-key=" ">SPACE</div>
            </div>
            <div class="finger-guide">
                <div class="hand left-hand">
                    <div class="finger left-pinky">Pinky</div>
                    <div class="finger left-ring">Ring</div>
                    <div class="finger left-middle">Middle</div>
                    <div class="finger left-index">Index</div>
                    <div class="finger thumb">Thumb</div>
                </div>
                <div class="hand right-hand">
                    <div class="finger thumb">Thumb</div>
                    <div class="finger right-index">Index</div>
                    <div class="finger right-middle">Middle</div>
                    <div class="finger right-ring">Ring</div>
                    <div class="finger right-pinky">Pinky</div>
                </div>
            </div>
        `;
        
        // Insert after existing content
        const container = document.querySelector('.container');
        const textDisplay = document.getElementById('text-display');
        container.insertBefore(keyboardContainer, textDisplay);
    }
    
    createEnhancedUI() {
        // Add enhanced controls
        const controlsContainer = document.querySelector('.controls');
        const enhancedControls = document.createElement('div');
        enhancedControls.className = 'enhanced-controls';
        enhancedControls.innerHTML = `
            <div class="training-mode">
                <label>Training Mode:</label>
                <select id="training-mode">
                    <option value="adaptive">Adaptive Learning</option>
                    <option value="letters">Letters Only</option>
                    <option value="words">Common Words</option>
                    <option value="sentences">Full Sentences</option>
                </select>
            </div>
            <div class="settings">
                <label><input type="checkbox" id="sound-toggle" checked> Sound Effects</label>
                <label><input type="checkbox" id="show-keyboard" checked> Show Keyboard</label>
                <label><input type="checkbox" id="show-next" checked> Show Next Characters</label>
            </div>
            <div class="progress-indicators">
                <div class="progress-item">
                    <span class="label">Session Progress</span>
                    <div class="progress-bar">
                        <div class="progress-fill" id="session-progress"></div>
                    </div>
                </div>
                <div class="progress-item">
                    <span class="label">Key Mastery</span>
                    <div class="progress-bar">
                        <div class="progress-fill" id="mastery-progress"></div>
                    </div>
                </div>
            </div>
        `;
        
        controlsContainer.appendChild(enhancedControls);
        
        // Add detailed statistics panel
        const statsPanel = document.createElement('div');
        statsPanel.className = 'detailed-stats';
        statsPanel.innerHTML = `
            <h3>Detailed Performance Analysis</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>Keystroke Analysis</h4>
                    <div id="keystroke-chart" class="mini-chart"></div>
                </div>
                <div class="stat-card">
                    <h4>Problem Keys</h4>
                    <div id="problem-keys" class="key-list"></div>
                </div>
                <div class="stat-card">
                    <h4>Speed Trend</h4>
                    <div id="speed-trend" class="mini-chart"></div>
                </div>
                <div class="stat-card">
                    <h4>Accuracy by Finger</h4>
                    <div id="finger-accuracy" class="finger-stats"></div>
                </div>
            </div>
        `;
        
        const resultsElement = document.getElementById('results');
        resultsElement.appendChild(statsPanel);
    }
    
    generateAdaptiveText() {
        const mode = document.getElementById('training-mode')?.value || 'adaptive';
        const length = 50; // Number of characters to generate
        
        switch(mode) {
            case 'letters':
                this.currentText = this.generateLetterPractice(length);
                break;
            case 'words':
                this.currentText = this.generateWordPractice(length);
                break;
            case 'sentences':
                this.currentText = this.generateSentencePractice();
                break;
            default: // adaptive
                this.currentText = this.generateAdaptivePractice(length);
        }
        
        this.displayText();
        this.highlightNextChars();
    }
    
    generateAdaptivePractice(length) {
        // Focus on problematic keys with weighted probability
        let text = '';
        let focusKeys = this.getFocusKeys().slice(0, 5); // Top 5 problem keys
        
        for (let i = 0; i < length; i++) {
            if (Math.random() < 0.7 && focusKeys.length > 0) {
                // 70% chance to use focus keys
                text += focusKeys[Math.floor(Math.random() * focusKeys.length)];
            } else {
                // Use common letters
                const letters = 'etaoinshrdlcumwfgypbvkjxqz';
                text += letters[Math.floor(Math.random() * letters.length)];
            }
            
            // Add spaces occasionally
            if (i > 0 && Math.random() < 0.15) {
                text += ' ';
                i++; // Count space as character
            }
        }
        
        return text.trim();
    }
    
    generateLetterPractice(length) {
        const letters = this.getFocusKeys().slice(0, 8).join('');
        return Array.from({length}, () => 
            letters[Math.floor(Math.random() * letters.length)]
        ).join(' ');
    }
    
    generateWordPractice(length) {
        const words = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'its', 'did', 'yes'];
        let text = '';
        
        while (text.length < length) {
            const word = words[Math.floor(Math.random() * words.length)];
            text += (text ? ' ' : '') + word;
        }
        
        return text.substring(0, length);
    }
    
    generateSentencePractice() {
        const sentences = [
            "The quick brown fox jumps over the lazy dog.",
            "Pack my box with five dozen liquor jugs.",
            "How vexingly quick daft zebras jump!",
            "Bright vixens jump; dozy fowl quack.",
            "Quick zephyrs blow, vexing daft Jim."
        ];
        
        return sentences[Math.floor(Math.random() * sentences.length)];
    }
    
    displayText() {
        const textDisplay = document.getElementById('text-display');
        const chars = this.currentText.split('');
        
        textDisplay.innerHTML = chars.map((char, index) => {
            let className = 'char';
            
            if (index < this.currentIndex) {
                className += this.isCharCorrect(index) ? ' correct' : ' incorrect';
            } else if (index === this.currentIndex) {
                className += ' current';
                this.currentChar = char;
            } else if (index < this.currentIndex + 5) {
                className += ' next';
            }
            
            return `<span class="${className}" data-index="${index}">${char === ' ' ? '&nbsp;' : char}</span>`;
        }).join('');
        
        this.updateKeyboardHighlight();
    }
    
    updateKeyboardHighlight() {
        // Clear previous highlights
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('current', 'next', 'correct', 'incorrect');
        });
        
        document.querySelectorAll('.finger').forEach(finger => {
            finger.classList.remove('active', 'next');
        });
        
        // Highlight current key
        if (this.currentChar) {
            const currentKey = document.querySelector(`[data-key="${this.currentChar.toLowerCase()}"]`);
            if (currentKey) {
                currentKey.classList.add('current');
                
                // Highlight corresponding finger
                const finger = this.fingerMap[this.currentChar.toLowerCase()];
                if (finger) {
                    const fingerElement = document.querySelector(`.finger.${finger}`);
                    if (fingerElement) {
                        fingerElement.classList.add('active');
                    }
                }
            }
        }
        
        // Highlight next few keys
        const nextChars = this.currentText.slice(this.currentIndex + 1, this.currentIndex + 4);
        nextChars.split('').forEach((char, offset) => {
            const nextKey = document.querySelector(`[data-key="${char.toLowerCase()}"]`);
            if (nextKey) {
                nextKey.classList.add('next');
                nextKey.style.animationDelay = `${offset * 0.1}s`;
            }
        });
    }
    
    highlightNextChars() {
        const nextChars = this.currentText.slice(this.currentIndex + 1, this.currentIndex + 6);
        const nextDisplay = document.querySelector('.next-chars-display');
        
        if (nextDisplay) {
            nextDisplay.innerHTML = `Next: ${nextChars.split('').map(c => 
                `<span class="next-char">${c === ' ' ? '␣' : c}</span>`
            ).join('')}`;
        }
    }
    
    bindEvents() {
        // Enhanced input handling
        const typingInput = document.getElementById('typing-input');
        if (typingInput) {
            typingInput.addEventListener('input', (e) => this.handleInput(e));
            typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }
        
        // Start/Reset buttons
        document.getElementById('start-btn')?.addEventListener('click', () => this.startSession());
        document.getElementById('reset-btn')?.addEventListener('click', () => this.resetSession());
        
        // Mode changes
        document.getElementById('training-mode')?.addEventListener('change', () => {
            this.generateAdaptiveText();
        });
        
        // Settings toggles
        document.getElementById('sound-toggle')?.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });
        
        document.getElementById('show-keyboard')?.addEventListener('change', (e) => {
            const keyboard = document.querySelector('.virtual-keyboard');
            keyboard.style.display = e.target.checked ? 'block' : 'none';
        });
    }
    
    handleInput(e) {
        if (!this.isActive) return;
        
        const inputValue = e.target.value;
        const newIndex = inputValue.length;
        
        // Record keystroke timing
        const keystroke = {
            char: this.currentText[this.currentIndex],
            correct: this.isCharCorrect(this.currentIndex),
            timestamp: Date.now(),
            timeSinceStart: Date.now() - this.startTime
        };
        
        this.sessionKeystrokes.push(keystroke);
        
        // Update error tracking
        if (!keystroke.correct) {
            const errorKey = keystroke.char.toLowerCase();
            this.sessionErrors.set(errorKey, (this.sessionErrors.get(errorKey) || 0) + 1);
            this.playErrorSound();
            this.showErrorFeedback();
        } else {
            this.playSuccessSound();
        }
        
        this.currentIndex = newIndex;
        this.displayText();
        this.updateProgress();
        
        // Check for completion
        if (this.currentIndex >= this.currentText.length) {
            this.completeSession();
        }
    }
    
    handleKeyDown(e) {
        // Handle special keys
        if (e.key === 'Tab') {
            e.preventDefault();
            this.generateAdaptiveText();
        } else if (e.key === 'Escape') {
            this.resetSession();
        }
    }
    
    startSession() {
        this.isActive = true;
        this.startTime = Date.now();
        this.currentIndex = 0;
        this.sessionErrors.clear();
        this.sessionKeystrokes = [];
        
        const typingInput = document.getElementById('typing-input');
        typingInput.disabled = false;
        typingInput.value = '';
        typingInput.focus();
        
        document.getElementById('start-btn').disabled = true;
        this.generateAdaptiveText();
        this.startMetricsUpdater();
    }
    
    resetSession() {
        this.isActive = false;
        this.currentIndex = 0;
        
        const typingInput = document.getElementById('typing-input');
        typingInput.disabled = true;
        typingInput.value = '';
        
        document.getElementById('start-btn').disabled = false;
        this.stopMetricsUpdater();
        this.generateAdaptiveText();
        this.updateProgress();
    }
    
    completeSession() {
        this.isActive = false;
        const endTime = Date.now();
        const duration = (endTime - this.startTime) / 1000; // seconds
        
        this.calculateResults(duration);
        this.updateKeyStats();
        this.saveProgress();
        this.showDetailedResults();
        
        document.getElementById('start-btn').disabled = false;
        this.stopMetricsUpdater();
    }
    
    calculateResults(duration) {
        const totalChars = this.currentIndex;
        const errors = Array.from(this.sessionErrors.values()).reduce((a, b) => a + b, 0);
        
        // Calculate WPM (standard: 5 chars = 1 word)
        this.wpm = Math.round((totalChars / 5) / (duration / 60));
        
        // Calculate accuracy
        this.accuracy = Math.round(((totalChars - errors) / totalChars) * 100) || 0;
        
        // Update display
        document.getElementById('wpm').textContent = this.wpm;
        document.getElementById('accuracy').textContent = this.accuracy + '%';
    }
    
    startMetricsUpdater() {
        this.metricsUpdateInterval = setInterval(() => {
            if (this.isActive && this.startTime) {
                const duration = (Date.now() - this.startTime) / 1000;
                const totalChars = this.currentIndex;
                const errors = Array.from(this.sessionErrors.values()).reduce((a, b) => a + b, 0);
                
                this.wpm = Math.round((totalChars / 5) / (duration / 60)) || 0;
                this.accuracy = Math.round(((totalChars - errors) / totalChars) * 100) || 100;
                
                document.getElementById('wpm').textContent = this.wpm;
                document.getElementById('accuracy').textContent = this.accuracy + '%';
            }
        }, 500);
    }
    
    stopMetricsUpdater() {
        if (this.metricsUpdateInterval) {
            clearInterval(this.metricsUpdateInterval);
            this.metricsUpdateInterval = null;
        }
    }
    
    updateProgress() {
        const progress = (this.currentIndex / this.currentText.length) * 100;
        const progressBar = document.getElementById('session-progress');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        // Update mastery progress based on key performance
        const masteryProgress = this.calculateMasteryProgress();
        const masteryBar = document.getElementById('mastery-progress');
        if (masteryBar) {
            masteryBar.style.width = masteryProgress + '%';
        }
    }
    
    calculateMasteryProgress() {
        const totalKeys = Object.keys(this.fingerMap).length;
        const masteredKeys = Object.keys(this.keyStats).filter(key => 
            (this.keyStats[key].accuracy || 0) > 95 && 
            (this.keyStats[key].speed || 0) > 200
        ).length;
        
        return (masteredKeys / totalKeys) * 100;
    }
    
    getFocusKeys() {
        // Return keys that need the most practice
        const keyAccuracy = {};
        
        Object.entries(this.keyStats).forEach(([key, stats]) => {
            keyAccuracy[key] = stats.accuracy || 0;
        });
        
        // Sort by lowest accuracy, return problematic keys
        return Object.keys(keyAccuracy)
            .sort((a, b) => keyAccuracy[a] - keyAccuracy[b])
            .slice(0, 10);
    }
    
    updateKeyStats() {
        this.sessionKeystrokes.forEach(keystroke => {
            const key = keystroke.char.toLowerCase();
            
            if (!this.keyStats[key]) {
                this.keyStats[key] = {
                    total: 0,
                    correct: 0,
                    totalTime: 0,
                    accuracy: 0,
                    speed: 0
                };
            }
            
            const stats = this.keyStats[key];
            stats.total++;
            if (keystroke.correct) stats.correct++;
            stats.totalTime += keystroke.timeSinceStart;
            
            stats.accuracy = (stats.correct / stats.total) * 100;
            stats.speed = stats.total > 0 ? 60000 / (stats.totalTime / stats.total) : 0; // chars per minute
        });
        
        this.saveKeyStats();
    }
    
    playSuccessSound() {
        if (!this.soundEnabled) return;
        
        // Create subtle success sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    playErrorSound() {
        if (!this.soundEnabled) return;
        
        // Create error sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 300;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    showErrorFeedback() {
        const currentCharElement = document.querySelector('.char.current');
        if (currentCharElement) {
            currentCharElement.classList.add('shake');
            setTimeout(() => {
                currentCharElement.classList.remove('shake');
            }, 300);
        }
    }
    
    isCharCorrect(index) {
        const typingInput = document.getElementById('typing-input');
        return typingInput.value[index] === this.currentText[index];
    }
    
    showDetailedResults() {
        const resultsElement = document.getElementById('results');
        resultsElement.style.display = 'block';
        
        // Update basic results
        document.getElementById('final-wpm').textContent = this.wpm;
        document.getElementById('final-accuracy').textContent = this.accuracy + '%';
        document.getElementById('final-chars').textContent = this.currentIndex;
        document.getElementById('final-errors').textContent = Array.from(this.sessionErrors.values()).reduce((a, b) => a + b, 0);
        
        // Show detailed analysis
        this.updateDetailedStats();
        resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    updateDetailedStats() {
        // Update problem keys
        const problemKeysElement = document.getElementById('problem-keys');
        if (problemKeysElement) {
            const problemKeys = Array.from(this.sessionErrors.entries())
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5);
            
            problemKeysElement.innerHTML = problemKeys.map(([key, errors]) => 
                `<div class="problem-key">
                    <span class="key-name">${key.toUpperCase()}</span>
                    <span class="error-count">${errors} errors</span>
                </div>`
            ).join('');
        }
        
        // Update finger accuracy
        const fingerAccuracyElement = document.getElementById('finger-accuracy');
        if (fingerAccuracyElement) {
            const fingerStats = this.calculateFingerAccuracy();
            fingerAccuracyElement.innerHTML = Object.entries(fingerStats).map(([finger, accuracy]) =>
                `<div class="finger-stat">
                    <span class="finger-name">${finger}</span>
                    <div class="accuracy-bar">
                        <div class="accuracy-fill" style="width: ${accuracy}%"></div>
                    </div>
                    <span class="accuracy-value">${Math.round(accuracy)}%</span>
                </div>`
            ).join('');
        }
    }
    
    calculateFingerAccuracy() {
        const fingerStats = {};
        
        // Initialize finger stats
        Object.values(this.fingerMap).forEach(finger => {
            if (!fingerStats[finger]) {
                fingerStats[finger] = { total: 0, correct: 0 };
            }
        });
        
        // Calculate accuracy per finger
        this.sessionKeystrokes.forEach(keystroke => {
            const finger = this.fingerMap[keystroke.char.toLowerCase()];
            if (finger && fingerStats[finger]) {
                fingerStats[finger].total++;
                if (keystroke.correct) {
                    fingerStats[finger].correct++;
                }
            }
        });
        
        // Convert to percentages
        const accuracyPercentages = {};
        Object.entries(fingerStats).forEach(([finger, stats]) => {
            accuracyPercentages[finger] = stats.total > 0 ? (stats.correct / stats.total) * 100 : 100;
        });
        
        return accuracyPercentages;
    }
    
    loadKeyStats() {
        const saved = localStorage.getItem('enhancedTypingStats');
        return saved ? JSON.parse(saved) : {};
    }
    
    saveKeyStats() {
        localStorage.setItem('enhancedTypingStats', JSON.stringify(this.keyStats));
    }
    
    saveProgress() {
        const progress = {
            totalSessions: (this.getProgress().totalSessions || 0) + 1,
            bestWPM: Math.max(this.wpm, this.getProgress().bestWPM || 0),
            averageAccuracy: this.calculateAverageAccuracy(),
            lastSession: Date.now(),
            keyStats: this.keyStats
        };
        
        localStorage.setItem('enhancedTypingProgress', JSON.stringify(progress));
    }
    
    getProgress() {
        const saved = localStorage.getItem('enhancedTypingProgress');
        return saved ? JSON.parse(saved) : {};
    }
    
    calculateAverageAccuracy() {
        const allAccuracies = Object.values(this.keyStats).map(stat => stat.accuracy || 0);
        return allAccuracies.length > 0 ? 
            allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length : 0;
    }
}

// Mode switching logic
let currentTrainer = null;

function initializeTrainer(enhanced = true) {
    // Clean up previous trainer
    if (currentTrainer) {
        currentTrainer.cleanup?.();
    }
    
    // Hide/show keyboard based on mode
    const keyboard = document.querySelector('.virtual-keyboard');
    const enhancedControls = document.querySelector('.enhanced-controls');
    
    if (enhanced) {
        currentTrainer = new EnhancedTypingTrainer();
        if (keyboard) keyboard.style.display = 'block';
        if (enhancedControls) enhancedControls.style.display = 'block';
    } else {
        currentTrainer = new TypingTest();
        if (keyboard) keyboard.style.display = 'none';
        if (enhancedControls) enhancedControls.style.display = 'none';
    }
    
    // Save preference
    localStorage.setItem('useEnhancedMode', enhanced.toString());
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if enhanced mode should be enabled
    const useEnhanced = localStorage.getItem('useEnhancedMode') !== 'false';
    
    // Set toggle state
    const enhancedToggle = document.getElementById('enhanced-mode');
    if (enhancedToggle) {
        enhancedToggle.checked = useEnhanced;
        enhancedToggle.addEventListener('change', (e) => {
            initializeTrainer(e.target.checked);
        });
    }
    
    // Initialize with saved preference
    initializeTrainer(useEnhanced);
    
    // Add cleanup method to TypingTest class
    if (typeof TypingTest !== 'undefined' && !TypingTest.prototype.cleanup) {
        TypingTest.prototype.cleanup = function() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            if (this.metricsUpdateInterval) {
                clearInterval(this.metricsUpdateInterval);
                this.metricsUpdateInterval = null;
            }
        };
    }
});

// Add cleanup method to EnhancedTypingTrainer
EnhancedTypingTrainer.prototype.cleanup = function() {
    if (this.metricsUpdateInterval) {
        clearInterval(this.metricsUpdateInterval);
        this.metricsUpdateInterval = null;
    }
    
    // Clean up event listeners
    const typingInput = document.getElementById('typing-input');
    if (typingInput) {
        typingInput.replaceWith(typingInput.cloneNode(true));
    }
    
    // Hide enhanced elements
    const keyboard = document.querySelector('.virtual-keyboard');
    const enhancedControls = document.querySelector('.enhanced-controls');
    if (keyboard) keyboard.remove();
    if (enhancedControls) enhancedControls.remove();
};