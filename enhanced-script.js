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
        
        // Keybr-style letter progression
        this.homeRowLetters = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
        this.letterProgression = ['f', 'j', 'd', 'k', 's', 'l', 'a', ';', 'g', 'h', 'e', 'i', 'r', 'u', 'o', 't', 'n', 'v', 'c', 'm', 'w', 'b', 'p', 'y', 'x', 'q', 'z'];
        this.unlockedLetters = this.getUnlockedLetters();
        this.letterMastery = this.loadLetterMastery();
        
        // Practice phases
        this.currentPhase = this.getCurrentPhase(); // 'foundation' or 'application'
        this.targetWPM = 15; // Minimum WPM to progress
        this.targetAccuracy = 95; // Minimum accuracy to progress
        
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
                    <option value="adaptive">Smart Adaptive</option>
                    <option value="foundation">Foundation Phase (Keybr-style)</option>
                    <option value="application">Application Phase (Monkeytype-style)</option>
                    <option value="letters">Letters Only</option>
                    <option value="words">Common Words</option>
                    <option value="sentences">Full Sentences</option>
                    <option value="custom">Custom Text</option>
                </select>
            </div>
            <div class="settings">
                <label><input type="checkbox" id="sound-toggle" checked> Sound Effects</label>
                <label><input type="checkbox" id="show-keyboard" checked> Show Keyboard</label>
                <label><input type="checkbox" id="show-next" checked> Show Next Characters</label>
                <label><input type="checkbox" id="auto-progression" checked> Auto Phase Progression</label>
                <button id="custom-text-btn" class="btn secondary">Set Custom Text</button>
            </div>
            <div class="progress-indicators">
                <div class="progress-item">
                    <span class="label">Session Progress</span>
                    <div class="progress-bar">
                        <div class="progress-fill" id="session-progress"></div>
                    </div>
                </div>
                <div class="progress-item">
                    <span class="label">Letter Progression (<span id="unlocked-count">0</span>/27)</span>
                    <div class="progress-bar">
                        <div class="progress-fill" id="letter-progress"></div>
                    </div>
                </div>
                <div class="progress-item">
                    <span class="label">Current Phase: <span id="phase-indicator">Foundation</span></span>
                    <div class="phase-requirements" id="phase-requirements">
                        Target: 15+ WPM, 95%+ Accuracy
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
                    <h4>Letter Progression</h4>
                    <div id="letter-progression-chart" class="progression-chart"></div>
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
        const length = 50;
        
        switch(mode) {
            case 'foundation':
                this.currentText = this.generateFoundationPractice(length);
                break;
            case 'application':
                this.currentText = this.generateApplicationPractice(length);
                break;
            case 'letters':
                this.currentText = this.generateLetterPractice(length);
                break;
            case 'words':
                this.currentText = this.generateWordPractice(length);
                break;
            case 'sentences':
                this.currentText = this.generateSentencePractice();
                break;
            case 'custom':
                this.currentText = this.generateCustomPractice();
                break;
            default: // adaptive - automatically choose phase
                this.currentText = this.currentPhase === 'foundation' ? 
                    this.generateFoundationPractice(length) : 
                    this.generateApplicationPractice(length);
        }
        
        this.displayText();
        this.highlightNextChars();
        this.updatePhaseIndicator();
    }
    
    generateFoundationPractice(length) {
        // Keybr-style systematic progression
        let text = '';
        const availableLetters = this.unlockedLetters.slice();
        
        // Focus heavily on the most recently unlocked letter
        const latestLetter = availableLetters[availableLetters.length - 1];
        const problemLetters = this.getProblemLetters();
        
        for (let i = 0; i < length; i++) {
            let selectedLetter;
            
            if (Math.random() < 0.4 && latestLetter) {
                // 40% chance to use latest unlocked letter
                selectedLetter = latestLetter;
            } else if (Math.random() < 0.3 && problemLetters.length > 0) {
                // 30% chance to use problem letters
                selectedLetter = problemLetters[Math.floor(Math.random() * problemLetters.length)];
            } else {
                // Use any available letter
                selectedLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
            }
            
            text += selectedLetter;
            
            // Add spaces less frequently in foundation phase
            if (i > 0 && Math.random() < 0.1) {
                text += ' ';
                i++;
            }
        }
        
        return text.trim();
    }
    
    generateApplicationPractice(length) {
        // Monkeytype-style real-world content
        const practiceTypes = ['common-words', 'sentences', 'quotes', 'programming'];
        const type = practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
        
        switch(type) {
            case 'common-words':
                return this.generateSmartWordPractice(length);
            case 'sentences':
                return this.generateSmartSentencePractice();
            case 'quotes':
                return this.getRandomQuote();
            case 'programming':
                return this.generateProgrammingPractice();
            default:
                return this.generateSmartWordPractice(length);
        }
    }
    
    generateSmartWordPractice(length) {
        // Use real words but emphasize weak letters
        const commonWords = [
            'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
            'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
            'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'its',
            'said', 'each', 'make', 'most', 'over', 'such', 'very', 'what', 'with',
            'have', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some',
            'time', 'will', 'year', 'your', 'when', 'come', 'could', 'there'
        ];
        
        const problemLetters = this.getProblemLetters();
        let text = '';
        
        while (text.length < length) {
            let selectedWord;
            
            if (problemLetters.length > 0 && Math.random() < 0.6) {
                // 60% chance to select words containing problem letters
                const wordsWithProblems = commonWords.filter(word => 
                    problemLetters.some(letter => word.includes(letter))
                );
                selectedWord = wordsWithProblems.length > 0 ? 
                    wordsWithProblems[Math.floor(Math.random() * wordsWithProblems.length)] :
                    commonWords[Math.floor(Math.random() * commonWords.length)];
            } else {
                selectedWord = commonWords[Math.floor(Math.random() * commonWords.length)];
            }
            
            text += (text ? ' ' : '') + selectedWord;
        }
        
        return text.substring(0, length);
    }
    
    generateSmartSentencePractice() {
        const sentences = [
            "The quick brown fox jumps over the lazy dog.",
            "She sells seashells by the seashore.",
            "A journey of a thousand miles begins with a single step.",
            "Practice makes perfect when you focus on your weak areas.",
            "Every expert was once a beginner who never gave up.",
            "The best time to plant a tree was twenty years ago.",
            "Technology is best when it brings people together.",
            "Innovation distinguishes between a leader and a follower.",
            "Quality is not an act but a habit we develop over time.",
            "Success is the result of preparation meeting opportunity."
        ];
        
        return sentences[Math.floor(Math.random() * sentences.length)];
    }
    
    getRandomQuote() {
        const quotes = [
            "Be yourself; everyone else is already taken. - Oscar Wilde",
            "Two things are infinite: the universe and human stupidity. - Einstein",
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Life is what happens to you while you're busy making other plans. - Lennon",
            "The future belongs to those who believe in their dreams. - Roosevelt"
        ];
        
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
    
    generateProgrammingPractice() {
        const codeSnippets = [
            "function calculateSum(a, b) { return a + b; }",
            "const array = [1, 2, 3]; array.map(x => x * 2);",
            "if (condition === true) { console.log('Hello World'); }",
            "for (let i = 0; i < length; i++) { process(data[i]); }",
            "const obj = { name: 'John', age: 30, city: 'New York' };"
        ];
        
        return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    }
    
    generateCustomPractice() {
        const customText = localStorage.getItem('customPracticeText');
        return customText || 'Click settings to add your custom practice text.';
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
        document.getElementById('training-mode')?.addEventListener('change', (e) => {
            if (e.target.value === 'foundation' || e.target.value === 'application') {
                this.currentPhase = e.target.value;
                this.saveCurrentPhase();
            }
            this.generateAdaptiveText();
        });
        
        // Custom text button
        document.getElementById('custom-text-btn')?.addEventListener('click', () => {
            this.showCustomTextDialog();
        });
        
        // Auto progression toggle
        document.getElementById('auto-progression')?.addEventListener('change', (e) => {
            localStorage.setItem('autoProgression', e.target.checked.toString());
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
        const duration = (endTime - this.startTime) / 1000;
        
        this.calculateResults(duration);
        this.updateKeyStats();
        this.updateLetterMastery();
        this.checkPhaseProgression();
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
        return this.getProblemLetters();
    }
    
    getProblemLetters() {
        // Return letters that need the most practice from unlocked set
        const letterAccuracy = {};
        
        this.unlockedLetters.forEach(letter => {
            const stats = this.keyStats[letter];
            letterAccuracy[letter] = stats ? stats.accuracy || 0 : 0;
        });
        
        return Object.keys(letterAccuracy)
            .sort((a, b) => letterAccuracy[a] - letterAccuracy[b])
            .slice(0, 5);
    }
    
    getUnlockedLetters() {
        const saved = localStorage.getItem('unlockedLetters');
        if (saved) {
            return JSON.parse(saved);
        }
        // Start with first 4 letters of progression
        return this.letterProgression.slice(0, 4);
    }
    
    saveUnlockedLetters() {
        localStorage.setItem('unlockedLetters', JSON.stringify(this.unlockedLetters));
    }
    
    getCurrentPhase() {
        const saved = localStorage.getItem('currentPhase');
        const autoProgression = localStorage.getItem('autoProgression') !== 'false';
        
        if (!autoProgression) {
            return saved || 'foundation';
        }
        
        // Auto-determine phase based on progress
        const masteredCount = this.unlockedLetters.filter(letter => {
            const stats = this.keyStats[letter];
            return stats && stats.accuracy >= this.targetAccuracy && 
                   stats.speed >= this.targetWPM * 5; // Convert WPM to CPM
        }).length;
        
        const totalUnlocked = this.unlockedLetters.length;
        const masteryRatio = masteredCount / totalUnlocked;
        
        // Switch to application phase when 70% of letters are mastered
        return (masteryRatio >= 0.7 && totalUnlocked >= 15) ? 'application' : 'foundation';
    }
    
    saveCurrentPhase() {
        localStorage.setItem('currentPhase', this.currentPhase);
    }
    
    updateLetterMastery() {
        this.unlockedLetters.forEach(letter => {
            if (!this.letterMastery[letter]) {
                this.letterMastery[letter] = { accuracy: 0, speed: 0, attempts: 0 };
            }
            
            const stats = this.keyStats[letter];
            if (stats) {
                this.letterMastery[letter] = {
                    accuracy: stats.accuracy || 0,
                    speed: stats.speed || 0,
                    attempts: stats.total || 0
                };
            }
        });
        
        this.saveLetterMastery();
    }
    
    checkPhaseProgression() {
        const autoProgression = localStorage.getItem('autoProgression') !== 'false';
        if (!autoProgression) return;
        
        // Check if we should unlock new letters (Foundation phase)
        if (this.currentPhase === 'foundation') {
            this.checkLetterUnlock();
        }
        
        // Check if we should progress to Application phase
        const newPhase = this.getCurrentPhase();
        if (newPhase !== this.currentPhase) {
            this.currentPhase = newPhase;
            this.saveCurrentPhase();
            this.showPhaseProgressionMessage();
        }
    }
    
    checkLetterUnlock() {
        const latestLetter = this.unlockedLetters[this.unlockedLetters.length - 1];
        const stats = this.keyStats[latestLetter];
        
        if (stats && stats.accuracy >= this.targetAccuracy && 
            stats.speed >= this.targetWPM * 5 && stats.total >= 20) {
            
            // Check if there are more letters to unlock
            const nextLetterIndex = this.letterProgression.indexOf(latestLetter) + 1;
            if (nextLetterIndex < this.letterProgression.length) {
                const nextLetter = this.letterProgression[nextLetterIndex];
                this.unlockedLetters.push(nextLetter);
                this.saveUnlockedLetters();
                this.showLetterUnlockMessage(nextLetter);
            }
        }
    }
    
    showPhaseProgressionMessage() {
        const message = this.currentPhase === 'application' ? 
            'Congratulations! You\'ve progressed to Application Phase - now practicing with real-world content!' :
            'Welcome to Foundation Phase - focus on mastering individual letters and combinations!';
            
        this.showNotification(message, 'success');
    }
    
    showLetterUnlockMessage(letter) {
        this.showNotification(`New letter unlocked: ${letter.toUpperCase()}! Keep practicing to master it.`, 'info');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else if (type === 'info') {
            notification.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    updatePhaseIndicator() {
        const phaseElement = document.getElementById('phase-indicator');
        const requirementsElement = document.getElementById('phase-requirements');
        
        if (phaseElement) {
            phaseElement.textContent = this.currentPhase === 'foundation' ? 'Foundation' : 'Application';
        }
        
        if (requirementsElement) {
            if (this.currentPhase === 'foundation') {
                const nextLetter = this.getNextLetterToUnlock();
                requirementsElement.innerHTML = nextLetter ? 
                    `Master <strong>${nextLetter.toUpperCase()}</strong>: ${this.targetWPM}+ WPM, ${this.targetAccuracy}%+ Accuracy` :
                    'All letters unlocked! Ready for Application Phase';
            } else {
                requirementsElement.innerHTML = 'Focus on real-world typing practice and flow';
            }
        }
        
        const unlockedCount = document.getElementById('unlocked-count');
        if (unlockedCount) {
            unlockedCount.textContent = this.unlockedLetters.length;
        }
        
        const letterProgress = document.getElementById('letter-progress');
        if (letterProgress) {
            const progress = (this.unlockedLetters.length / this.letterProgression.length) * 100;
            letterProgress.style.width = progress + '%';
        }
    }
    
    getNextLetterToUnlock() {
        const currentIndex = this.letterProgression.indexOf(this.unlockedLetters[this.unlockedLetters.length - 1]);
        return currentIndex >= 0 && currentIndex < this.letterProgression.length - 1 ? 
            this.letterProgression[currentIndex + 1] : null;
    }
    
    showCustomTextDialog() {
        const currentText = localStorage.getItem('customPracticeText') || '';
        const newText = prompt('Enter your custom practice text:', currentText);
        
        if (newText !== null) {
            localStorage.setItem('customPracticeText', newText);
            if (document.getElementById('training-mode').value === 'custom') {
                this.generateAdaptiveText();
            }
        }
    }
    
    loadLetterMastery() {
        const saved = localStorage.getItem('letterMastery');
        return saved ? JSON.parse(saved) : {};
    }
    
    saveLetterMastery() {
        localStorage.setItem('letterMastery', JSON.stringify(this.letterMastery));
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
        
        // Update letter progression chart
        const progressionElement = document.getElementById('letter-progression-chart');
        if (progressionElement) {
            this.updateLetterProgressionChart(progressionElement);
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
    
    updateLetterProgressionChart(element) {
        const chartHtml = this.letterProgression.map((letter, index) => {
            const isUnlocked = this.unlockedLetters.includes(letter);
            const stats = this.keyStats[letter];
            const isMastered = stats && stats.accuracy >= this.targetAccuracy && stats.speed >= this.targetWPM * 5;
            
            let className = 'progression-letter ';
            if (!isUnlocked) className += 'locked';
            else if (isMastered) className += 'mastered';
            else className += 'unlocked';
            
            const accuracy = stats ? Math.round(stats.accuracy || 0) : 0;
            const speed = stats ? Math.round((stats.speed || 0) / 5) : 0; // Convert CPM to WPM
            
            return `<div class="${className}" title="${letter.toUpperCase()}: ${accuracy}% accuracy, ${speed} WPM">
                <span class="letter">${letter.toUpperCase()}</span>
                <div class="letter-stats">
                    <small>${accuracy}%</small>
                    <small>${speed}wpm</small>
                </div>
            </div>`;
        }).join('');
        
        element.innerHTML = `
            <div class="progression-letters">${chartHtml}</div>
            <div class="progression-legend">
                <span class="legend-item"><div class="legend-color locked"></div>Locked</span>
                <span class="legend-item"><div class="legend-color unlocked"></div>Practicing</span>
                <span class="legend-item"><div class="legend-color mastered"></div>Mastered</span>
            </div>
        `;
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
    
    // Set auto-progression checkbox state
    const autoProgressionToggle = document.getElementById('auto-progression');
    if (autoProgressionToggle) {
        const autoProgression = localStorage.getItem('autoProgression') !== 'false';
        autoProgressionToggle.checked = autoProgression;
    }
    
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