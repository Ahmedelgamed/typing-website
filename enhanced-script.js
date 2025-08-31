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
        
        // Fun Language Mode Libraries
        this.languageModes = {
            fancyEnglish: [
                'exquisite', 'magnificent', 'extraordinary', 'sophisticated', 'remarkable', 'phenomenal',
                'stupendous', 'marvelous', 'exceptional', 'splendid', 'sublime', 'transcendent',
                'quintessential', 'impeccable', 'resplendent', 'effervescent', 'serendipitous',
                'euphonious', 'mellifluous', 'scintillating', 'vivacious', 'ebullient',
                'perspicacious', 'sagacious', 'magnanimous', 'benevolent', 'eloquent',
                'articulate', 'erudite', 'intellectual', 'contemplative', 'philosophical'
            ],
            tikTokSlang: [
                'slay queen', 'periodt', 'no cap', 'fr fr', 'its giving', 'main character energy',
                'understood the assignment', 'that hits different', 'lowkey highkey', 'vibe check',
                'say less', 'bet', 'facts', 'bussin', 'sheesh', 'fire', 'slaps', 'mid',
                'sending me', 'touch grass', 'ratio', 'based', 'cringe', 'Stan', 'simp',
                'hits different', 'the way for me', 'not me', 'bestie', 'sis', 'bro',
                'valid', 'unmatched', 'iconic', 'legend', 'queen', 'king'
            ],
            aussieSlang: [
                'fair dinkum mate', 'no worries', 'she\'ll be right', 'good on ya', 'bloody hell',
                'strewth', 'crikey', 'bonkers', 'ripper', 'beaut', 'ace', 'grouse',
                'chockers', 'arvo', 'servo', 'bottle-o', 'maccas', 'brekkie', 'bikkie',
                'mozzie', 'tradie', 'postie', 'garbo', 'ambo', 'firie', 'coppers',
                'dunny', 'esky', 'ute', 'thongs', 'singlet', 'sunnies', 'boardies',
                'togs', 'rashie', 'stubbie', 'tinnie', 'longneck', 'grog', 'piss'
            ],
            ukCoolPhrases: [
                'absolutely mental', 'proper mad', 'well good', 'dead nice', 'bare jokes',
                'peng ting', 'safe bruv', 'innit though', 'peak times', 'long ting',
                'calm down', 'allow it', 'wasteman', 'roadman', 'endz', 'mandem',
                'gyaldem', 'bare minimum', 'maximum effort', 'standard procedure',
                'top drawer', 'first class', 'spot on', 'bang on', 'ace move',
                'smashed it', 'nailed it', 'sorted', 'cushty', 'sound as a pound',
                'mint condition', 'proper lush', 'well posh', 'dead posh'
            ],
            britishExpressions: [
                'bloody brilliant', 'absolutely bonkers', 'utterly mad', 'quite extraordinary',
                'rather splendid', 'frightfully good', 'terribly sorry', 'awfully nice',
                'jolly good show', 'old bean', 'what a palaver', 'bit of a pickle',
                'over the moon', 'chuffed to bits', 'taking the mickey', 'having a laugh',
                'pull the other one', 'stone the crows', 'blimey charlie', 'gordon bennett',
                'bob\'s your uncle', 'fanny\'s your aunt', 'tickety boo', 'hunky dory',
                'right as rain', 'fit as a fiddle', 'happy as larry', 'pleased as punch',
                'keen as mustard', 'mad as a hatter', 'daft as a brush'
            ]
        };
        
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
        
        // Advanced Keybr-style letter progression with frequency-based ordering
        this.homeRowLetters = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
        this.letterProgression = ['f', 'j', 'd', 'k', 's', 'l', 'a', ';', 'g', 'h', 'e', 'i', 'r', 'u', 'o', 't', 'n', 'v', 'c', 'm', 'w', 'b', 'p', 'y', 'x', 'q', 'z'];
        this.unlockedLetters = this.getUnlockedLetters();
        this.letterMastery = this.loadLetterMastery();
        
        // Advanced learning parameters
        this.targetWPM = 15; // Base WPM target
        this.targetAccuracy = 95; // Base accuracy target
        this.adaptiveTargetWPM = this.calculateAdaptiveTarget('wpm');
        this.adaptiveTargetAccuracy = this.calculateAdaptiveTarget('accuracy');
        
        // Learning algorithm parameters
        this.learningRate = 0.1; // How quickly difficulty adjusts
        this.difficultyScore = 1.0; // Current difficulty multiplier
        this.confidenceThreshold = 0.8; // Confidence needed to progress
        this.minimumPracticeRounds = 10; // Min rounds before letter unlock
        
        // Practice phases with sub-phases
        this.currentPhase = this.getCurrentPhase(); // 'foundation', 'transition', 'application'
        this.subPhase = this.getCurrentSubPhase(); // 'introduction', 'practice', 'mastery'
        
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
        // Advanced Keybr-style systematic progression with confidence scoring
        let text = '';
        const availableLetters = this.unlockedLetters.slice();
        
        // Get learning priorities
        const latestLetter = availableLetters[availableLetters.length - 1];
        const problemLetters = this.getProblemLetters();
        const confidenceLevels = this.calculateLetterConfidence();
        
        // Determine focus distribution based on learning phase
        const focusWeights = this.calculateFocusWeights(latestLetter, problemLetters, confidenceLevels);
        
        for (let i = 0; i < length; i++) {
            let selectedLetter;
            const random = Math.random();
            
            if (random < focusWeights.latest && latestLetter) {
                // Focus on latest unlocked letter
                selectedLetter = latestLetter;
            } else if (random < focusWeights.latest + focusWeights.problem && problemLetters.length > 0) {
                // Practice problem letters with weighted selection
                selectedLetter = this.selectWeightedProblemLetter(problemLetters);
            } else if (random < focusWeights.latest + focusWeights.problem + focusWeights.review) {
                // Review letters that need reinforcement
                selectedLetter = this.selectReviewLetter(availableLetters, confidenceLevels);
            } else {
                // Random practice from available letters
                selectedLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
            }
            
            text += selectedLetter;
            
            // Adaptive spacing based on difficulty and progress
            const spacingProbability = this.calculateSpacingProbability(i, selectedLetter);
            if (i > 0 && Math.random() < spacingProbability) {
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
        
        // Performance optimization: use DocumentFragment for batch DOM updates
        const chars = this.currentText.split('');
        
        // Use requestAnimationFrame for smooth rendering
        requestAnimationFrame(() => {
            // Create optimized HTML string with proper text content wrapper
            const htmlChunks = [];
            
            for (let index = 0; index < chars.length; index++) {
                const char = chars[index];
                let className = 'char';
                
                if (index < this.currentIndex) {
                    className += this.isCharCorrect(index) ? ' correct' : ' incorrect';
                } else if (index === this.currentIndex) {
                    className += ' current';
                    this.currentChar = char;
                } else if (index < this.currentIndex + 5) {
                    className += ' next';
                }
                
                // Handle special characters properly
                let displayChar = char;
                if (char === ' ') {
                    displayChar = '&nbsp;';
                } else if (char === '\n') {
                    displayChar = '<br>';
                } else {
                    displayChar = char.replace(/[<>&"']/g, (match) => {
                        const escapeMap = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
                        return escapeMap[match];
                    });
                }
                
                htmlChunks.push(`<span class="${className}" data-index="${index}">${displayChar}</span>`);
            }
            
            // Wrap in text-content div for better styling control
            textDisplay.innerHTML = `<div class="text-content">${htmlChunks.join('')}</div>`;
            this.updateKeyboardHighlight();
            this.ensureCurrentCharVisible();
        });
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
        
        // Performance optimization: only process if index actually changed
        if (newIndex === this.currentIndex) return;
        
        // Batch multiple character inputs (paste or very fast typing)
        const charDiff = newIndex - this.currentIndex;
        const now = Date.now();
        
        // Process each character that was added
        for (let i = 0; i < charDiff; i++) {
            const charIndex = this.currentIndex + i;
            if (charIndex >= this.currentText.length) break;
            
            const keystroke = {
                char: this.currentText[charIndex],
                correct: this.isCharCorrect(charIndex, inputValue),
                timestamp: now,
                timeSinceStart: now - this.startTime
            };
            
            this.sessionKeystrokes.push(keystroke);
            
            // Update error tracking (optimized)
            if (!keystroke.correct) {
                const errorKey = keystroke.char.toLowerCase();
                this.sessionErrors.set(errorKey, (this.sessionErrors.get(errorKey) || 0) + 1);
                
                // Only play sounds for single character inputs to avoid spam
                if (charDiff === 1) {
                    this.playErrorSound();
                    this.showErrorFeedback();
                }
            } else if (charDiff === 1) {
                this.playSuccessSound();
            }
        }
        
        this.currentIndex = newIndex;
        
        // Optimize display updates - only update if visible changes needed
        this.displayText();
        this.updateProgress();
        
        // Check for completion and add more text dynamically
        if (this.currentIndex >= this.currentText.length) {
            this.addMoreText();
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
        this.savePersonalHistory();
        this.saveProgress();
        this.showDetailedResults();
        this.updateAdvancedAnalytics();
        
        document.getElementById('start-btn').disabled = false;
        this.stopMetricsUpdater();
    }
    
    calculateResults(duration) {
        const totalChars = this.currentIndex;
        const errors = Array.from(this.sessionErrors.values()).reduce((a, b) => a + b, 0);
        
        // Calculate advanced metrics
        this.wpm = Math.round((totalChars / 5) / (duration / 60));
        this.accuracy = Math.round(((totalChars - errors) / totalChars) * 100) || 0;
        this.consistencyScore = this.calculateConsistencyScore();
        this.flowScore = this.calculateFlowScore();
        this.difficultyAdjustment = this.calculateDifficultyAdjustment();
        
        // Advanced learning metrics
        this.learningVelocity = this.calculateLearningVelocity();
        this.retentionScore = this.calculateRetentionScore();
        this.masteryProgress = this.calculateMasteryProgress();
        
        // Update display with advanced metrics
        document.getElementById('wpm').textContent = this.wpm;
        document.getElementById('accuracy').textContent = this.accuracy + '%';
        
        // Update advanced displays if available
        this.updateAdvancedMetrics({
            consistency: this.consistencyScore,
            flow: this.flowScore,
            learning: this.learningVelocity,
            retention: this.retentionScore,
            mastery: this.masteryProgress
        });
    }
    
    startMetricsUpdater() {
        // Optimized metrics update with throttling
        let lastUpdate = 0;
        const updateThreshold = 250; // Update every 250ms instead of 500ms for better responsiveness
        
        this.metricsUpdateInterval = setInterval(() => {
            const now = Date.now();
            if (this.isActive && this.startTime && (now - lastUpdate) >= updateThreshold) {
                lastUpdate = now;
                
                const duration = (now - this.startTime) / 1000;
                const totalChars = this.currentIndex;
                const errors = Array.from(this.sessionErrors.values()).reduce((a, b) => a + b, 0);
                
                this.wpm = Math.round((totalChars / 5) / (duration / 60)) || 0;
                this.accuracy = Math.round(((totalChars - errors) / totalChars) * 100) || 100;
                
                // Batch DOM updates
                const wpmElement = document.getElementById('wpm');
                const accuracyElement = document.getElementById('accuracy');
                
                if (wpmElement && accuracyElement) {
                    requestAnimationFrame(() => {
                        wpmElement.textContent = this.wpm;
                        accuracyElement.textContent = this.accuracy + '%';
                    });
                }
            }
        }, 100); // Check every 100ms but only update every 250ms
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
    
    isCharCorrect(index, inputValue = null) {
        const value = inputValue || document.getElementById('typing-input').value;
        return value[index] === this.currentText[index];
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
    
    // Advanced Learning Algorithm Methods
    calculateAdaptiveTarget(metric) {
        const history = this.getPersonalHistory();
        if (!history || history.length < 5) {
            return metric === 'wpm' ? this.targetWPM : this.targetAccuracy;
        }
        
        const recentPerformance = history.slice(-10);
        const average = recentPerformance.reduce((sum, session) => 
            sum + (metric === 'wpm' ? session.wpm : session.accuracy), 0) / recentPerformance.length;
        
        // Set adaptive target slightly above recent performance
        return metric === 'wpm' ? 
            Math.max(this.targetWPM, Math.round(average * 1.1)) :
            Math.max(this.targetAccuracy, Math.round(average * 1.02));
    }
    
    calculateLetterConfidence() {
        const confidence = {};
        this.unlockedLetters.forEach(letter => {
            const stats = this.keyStats[letter];
            if (!stats || stats.total < 10) {
                confidence[letter] = 0;
                return;
            }
            
            // Calculate confidence based on accuracy, speed, and consistency
            const accuracyScore = Math.min(stats.accuracy / this.adaptiveTargetAccuracy, 1);
            const speedScore = Math.min((stats.speed / 5) / this.adaptiveTargetWPM, 1);
            const consistencyScore = Math.max(0, 1 - (stats.variance || 0.5));
            
            confidence[letter] = (accuracyScore * 0.5 + speedScore * 0.3 + consistencyScore * 0.2);
        });
        
        return confidence;
    }
    
    calculateFocusWeights(latestLetter, problemLetters, confidenceLevels) {
        const latestConfidence = confidenceLevels[latestLetter] || 0;
        const averageConfidence = Object.values(confidenceLevels).reduce((a, b) => a + b, 0) / 
                                 Object.keys(confidenceLevels).length || 0;
        
        // Adjust focus based on confidence and learning phase
        let weights = {
            latest: 0.4,    // Focus on newest letter
            problem: 0.3,   // Address problem letters
            review: 0.2,    // Review for retention
            random: 0.1     // Maintain variety
        };
        
        // If latest letter has low confidence, increase focus
        if (latestConfidence < this.confidenceThreshold) {
            weights.latest = Math.min(0.6, weights.latest + 0.2);
            weights.problem = Math.max(0.2, weights.problem - 0.1);
        }
        
        // If average confidence is high, reduce review and increase exploration
        if (averageConfidence > 0.8) {
            weights.review = Math.max(0.1, weights.review - 0.1);
            weights.random += 0.1;
        }
        
        return weights;
    }
    
    selectWeightedProblemLetter(problemLetters) {
        // Select problem letters based on error frequency and recency
        const weights = problemLetters.map(letter => {
            const errors = this.sessionErrors.get(letter) || 0;
            const recentErrors = this.getRecentErrors(letter);
            return errors + (recentErrors * 2); // Weight recent errors more heavily
        });
        
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        if (totalWeight === 0) return problemLetters[0];
        
        let random = Math.random() * totalWeight;
        for (let i = 0; i < problemLetters.length; i++) {
            random -= weights[i];
            if (random <= 0) return problemLetters[i];
        }
        
        return problemLetters[problemLetters.length - 1];
    }
    
    selectReviewLetter(availableLetters, confidenceLevels) {
        // Select letters that need reinforcement (medium confidence)
        const reviewCandidates = availableLetters.filter(letter => {
            const confidence = confidenceLevels[letter] || 0;
            return confidence > 0.3 && confidence < 0.8;
        });
        
        if (reviewCandidates.length === 0) {
            return availableLetters[Math.floor(Math.random() * availableLetters.length)];
        }
        
        // Prefer letters with lower confidence among review candidates
        const sortedCandidates = reviewCandidates.sort((a, b) => 
            confidenceLevels[a] - confidenceLevels[b]);
        
        // Select from the lower half of confidence scores
        const selectionPool = sortedCandidates.slice(0, Math.ceil(sortedCandidates.length / 2));
        return selectionPool[Math.floor(Math.random() * selectionPool.length)];
    }
    
    calculateSpacingProbability(position, currentLetter) {
        // Adaptive spacing based on letter difficulty and position
        const letterStats = this.keyStats[currentLetter];
        const letterDifficulty = letterStats ? 
            Math.max(0, 1 - (letterStats.accuracy / 100)) : 0.5;
        
        const baseSpacing = 0.15; // Base 15% chance for spaces
        const difficultyAdjustment = letterDifficulty * 0.1; // Reduce spaces for difficult letters
        const positionAdjustment = Math.min(0.05, position * 0.001); // Slight increase over time
        
        return Math.max(0.05, baseSpacing - difficultyAdjustment + positionAdjustment);
    }
    
    calculateConsistencyScore() {
        if (this.sessionKeystrokes.length < 10) return 100;
        
        const timings = this.sessionKeystrokes.map(k => k.timeSinceStart);
        const intervals = [];
        
        for (let i = 1; i < timings.length; i++) {
            intervals.push(timings[i] - timings[i-1]);
        }
        
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, interval) => 
            sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
        
        const standardDeviation = Math.sqrt(variance);
        const coefficientOfVariation = standardDeviation / avgInterval;
        
        // Convert to score (lower variation = higher score)
        return Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 200)));
    }
    
    calculateFlowScore() {
        // Measure typing flow based on rhythm and smoothness
        if (this.sessionKeystrokes.length < 20) return 50;
        
        let flowMetrics = {
            rhythmScore: 0,
            smoothnessScore: 0,
            accelerationScore: 0
        };
        
        const intervals = this.sessionKeystrokes.slice(1).map((stroke, i) => 
            stroke.timeSinceStart - this.sessionKeystrokes[i].timeSinceStart);
        
        // Calculate rhythm consistency
        const medianInterval = [...intervals].sort((a, b) => a - b)[Math.floor(intervals.length / 2)];
        const rhythmDeviations = intervals.map(interval => 
            Math.abs(interval - medianInterval) / medianInterval);
        flowMetrics.rhythmScore = Math.max(0, 100 - (rhythmDeviations.reduce((a, b) => a + b, 0) / 
                                         rhythmDeviations.length * 100));
        
        // Calculate smoothness (fewer sudden changes)
        const accelerations = [];
        for (let i = 2; i < intervals.length; i++) {
            const acceleration = Math.abs(intervals[i] - intervals[i-1]);
            accelerations.push(acceleration);
        }
        
        const avgAcceleration = accelerations.reduce((a, b) => a + b, 0) / accelerations.length;
        flowMetrics.smoothnessScore = Math.max(0, 100 - (avgAcceleration / medianInterval * 50));
        
        // Overall flow score
        return Math.round((flowMetrics.rhythmScore + flowMetrics.smoothnessScore) / 2);
    }
    
    calculateDifficultyAdjustment() {
        // Calculate how much to adjust difficulty based on performance
        const targetPerformance = {
            wpm: this.adaptiveTargetWPM,
            accuracy: this.adaptiveTargetAccuracy
        };
        
        const currentPerformance = {
            wpm: this.wpm,
            accuracy: this.accuracy
        };
        
        const wpmRatio = currentPerformance.wpm / targetPerformance.wpm;
        const accuracyRatio = currentPerformance.accuracy / targetPerformance.accuracy;
        
        // If performing above target, increase difficulty
        // If performing below target, decrease difficulty
        const performanceRatio = (wpmRatio * 0.4 + accuracyRatio * 0.6);
        
        if (performanceRatio > 1.1) {
            return Math.min(0.2, (performanceRatio - 1) * this.learningRate);
        } else if (performanceRatio < 0.9) {
            return Math.max(-0.2, (performanceRatio - 1) * this.learningRate);
        }
        
        return 0;
    }
    
    calculateLearningVelocity() {
        // Measure rate of improvement over recent sessions
        const history = this.getPersonalHistory();
        if (!history || history.length < 3) return 0;
        
        const recentSessions = history.slice(-5);
        if (recentSessions.length < 2) return 0;
        
        const firstSession = recentSessions[0];
        const lastSession = recentSessions[recentSessions.length - 1];
        const sessionSpan = recentSessions.length;
        
        const wpmImprovement = (lastSession.wpm - firstSession.wpm) / sessionSpan;
        const accuracyImprovement = (lastSession.accuracy - firstSession.accuracy) / sessionSpan;
        
        // Normalize and combine improvements
        const normalizedWpmImprovement = wpmImprovement / Math.max(1, firstSession.wpm) * 100;
        const normalizedAccuracyImprovement = accuracyImprovement / Math.max(1, firstSession.accuracy) * 100;
        
        return Math.round((normalizedWpmImprovement * 0.6 + normalizedAccuracyImprovement * 0.4) * 10) / 10;
    }
    
    calculateRetentionScore() {
        // Measure how well previously learned letters are retained
        const retentionData = {};
        let totalRetention = 0;
        let letterCount = 0;
        
        this.unlockedLetters.forEach(letter => {
            const currentStats = this.keyStats[letter];
            const historicalStats = this.getHistoricalStats(letter);
            
            if (currentStats && historicalStats && historicalStats.length > 0) {
                const recentAccuracy = currentStats.accuracy || 0;
                const historicalAccuracy = historicalStats[historicalStats.length - 1].accuracy || 0;
                
                // Retention = how well current performance maintains historical performance
                const retention = Math.min(100, (recentAccuracy / Math.max(1, historicalAccuracy)) * 100);
                retentionData[letter] = retention;
                totalRetention += retention;
                letterCount++;
            }
        });
        
        return letterCount > 0 ? Math.round(totalRetention / letterCount) : 100;
    }
    
    getCurrentSubPhase() {
        const saved = localStorage.getItem('currentSubPhase');
        if (saved) return saved;
        
        // Auto-determine sub-phase based on letter confidence
        const confidenceLevels = this.calculateLetterConfidence();
        const latestLetter = this.unlockedLetters[this.unlockedLetters.length - 1];
        const latestConfidence = confidenceLevels[latestLetter] || 0;
        const attempts = this.keyStats[latestLetter]?.total || 0;
        
        if (attempts < 5) return 'introduction';
        if (latestConfidence < this.confidenceThreshold) return 'practice';
        return 'mastery';
    }
    
    updateAdvancedMetrics(metrics) {
        // Update advanced metric displays if elements exist
        const elements = {
            'consistency-score': metrics.consistency,
            'flow-score': metrics.flow,
            'learning-velocity': metrics.learning,
            'retention-score': metrics.retention,
            'mastery-progress': metrics.mastery
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = typeof value === 'number' ? 
                    (value > 10 ? Math.round(value) : Math.round(value * 10) / 10) : value;
            }
        });
    }
    
    getRecentErrors(letter) {
        // Get errors for this letter in recent keystrokes (last 50 strokes)
        const recentStrokes = this.sessionKeystrokes.slice(-50);
        return recentStrokes.filter(stroke => 
            stroke.char.toLowerCase() === letter.toLowerCase() && !stroke.correct).length;
    }
    
    getPersonalHistory() {
        const saved = localStorage.getItem('enhancedTypingHistory');
        return saved ? JSON.parse(saved) : [];
    }
    
    savePersonalHistory() {
        const history = this.getPersonalHistory();
        const session = {
            date: Date.now(),
            wpm: this.wpm,
            accuracy: this.accuracy,
            consistency: this.consistencyScore,
            flow: this.flowScore,
            phase: this.currentPhase,
            subPhase: this.subPhase,
            unlockedLetters: this.unlockedLetters.length,
            duration: Date.now() - this.startTime
        };
        
        history.push(session);
        
        // Keep last 100 sessions
        if (history.length > 100) {
            history.splice(0, history.length - 100);
        }
        
        localStorage.setItem('enhancedTypingHistory', JSON.stringify(history));
    }
    
    getHistoricalStats(letter) {
        const saved = localStorage.getItem(`letterHistory_${letter}`);
        return saved ? JSON.parse(saved) : [];
    }
    
    ensureCurrentCharVisible() {
        const textDisplay = document.getElementById('text-display');
        const currentCharElement = document.querySelector('.char.current');
        
        if (currentCharElement && textDisplay) {
            const displayRect = textDisplay.getBoundingClientRect();
            const charRect = currentCharElement.getBoundingClientRect();
            
            // Check if current character is near the bottom of the display
            const threshold = displayRect.height * 0.8; // 80% of display height
            
            if (charRect.top - displayRect.top > threshold) {
                // Smooth scroll to keep current character in view
                const scrollTop = textDisplay.scrollTop + (charRect.top - displayRect.top) - (displayRect.height * 0.3);
                textDisplay.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    addMoreText() {
        // Add more text dynamically when current text is completed
        const difficulty = document.getElementById('difficulty-select')?.value || 'medium';
        let additionalText = '';
        
        // Generate new text based on current mode
        if (this.languageModes[difficulty]) {
            // Use fun language mode
            const words = this.languageModes[difficulty];
            const numWords = Math.floor(Math.random() * 3) + 2; // 2-4 words
            const selectedWords = [];
            
            for (let i = 0; i < numWords; i++) {
                const randomWord = words[Math.floor(Math.random() * words.length)];
                selectedWords.push(randomWord);
            }
            
            additionalText = ' ' + selectedWords.join(' ');
        } else {
            // Use traditional difficulty modes
            const mode = document.getElementById('training-mode')?.value || 'adaptive';
            if (mode === 'foundation') {
                additionalText = ' ' + this.generateFoundationPractice(20).replace(/\s+/g, ' ');
            } else {
                additionalText = ' ' + this.generateApplicationPractice(30).split(' ').slice(0, 5).join(' ');
            }
        }
        
        // Extend current text
        this.currentText += additionalText;
        
        // Update display with smooth animation
        this.displayText();
        
        // Show notification about added text
        this.showAddTextNotification(additionalText.trim());
    }
    
    showAddTextNotification(addedText) {
        const notification = document.createElement('div');
        notification.className = 'added-text-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">➕</span>
                <span class="notification-text">Added: "${addedText.substring(0, 30)}${addedText.length > 30 ? '...' : ''}"</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('visible');
        }, 50);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 2500);
    }
    
    updateAdvancedAnalytics() {
        // Update the advanced analytics panel with real-time data
        this.updateSpeedChart();
        this.updateProblemKeysDisplay();
        this.updateRecommendations();
        this.updateLearningMetricsDisplay();
    }
    
    updateSpeedChart() {
        const chartBars = document.querySelectorAll('#speed-chart .chart-bar');
        if (chartBars.length === 0) return;
        
        // Calculate speed distribution throughout the session
        const segments = 5;
        const segmentSize = Math.floor(this.sessionKeystrokes.length / segments);
        const speedSegments = [];
        
        for (let i = 0; i < segments; i++) {
            const start = i * segmentSize;
            const end = Math.min((i + 1) * segmentSize, this.sessionKeystrokes.length);
            const segmentStrokes = this.sessionKeystrokes.slice(start, end);
            
            if (segmentStrokes.length > 0) {
                const timeSpan = (segmentStrokes[segmentStrokes.length - 1].timeSinceStart - 
                                segmentStrokes[0].timeSinceStart) / 1000 / 60; // minutes
                const charsInSegment = segmentStrokes.length;
                const segmentWPM = timeSpan > 0 ? Math.round((charsInSegment / 5) / timeSpan) : 0;
                speedSegments.push(segmentWPM);
            }
        }
        
        // Update chart bars
        const maxWPM = Math.max(...speedSegments, 1);
        chartBars.forEach((bar, index) => {
            if (index < speedSegments.length) {
                const height = (speedSegments[index] / maxWPM) * 100;
                bar.style.height = `${Math.max(height, 10)}%`;
                bar.title = `${speedSegments[index]} WPM`;
            }
        });
    }
    
    updateProblemKeysDisplay() {
        const problemKeysContainer = document.getElementById('problem-keys-mini');
        if (!problemKeysContainer) return;
        
        const problemKeys = Array.from(this.sessionErrors.entries())
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3); // Top 3 problem keys
        
        if (problemKeys.length === 0) {
            problemKeysContainer.innerHTML = '<div class="no-problems">No errors this session! 🎉</div>';
            return;
        }
        
        problemKeysContainer.innerHTML = problemKeys.map(([key, errors]) => `
            <div class="problem-key-item">
                <span class="key">${key.toUpperCase()}</span>
                <span class="errors">${errors} error${errors !== 1 ? 's' : ''}</span>
            </div>
        `).join('');
    }
    
    updateRecommendations() {
        const recommendationsContainer = document.getElementById('recommendations');
        if (!recommendationsContainer) return;
        
        const recommendations = this.generatePersonalizedRecommendations();
        
        recommendationsContainer.innerHTML = recommendations.map(rec => `
            <div class="recommendation">
                <span class="rec-icon">${rec.icon}</span>
                <span class="rec-text">${rec.text}</span>
            </div>
        `).join('');
    }
    
    updateLearningMetricsDisplay() {
        const improvements = document.getElementById('improvement-suggestion');
        if (!improvements) return;
        
        const suggestions = this.generateImprovementSuggestions();
        improvements.textContent = suggestions;
    }
    
    generatePersonalizedRecommendations() {
        const recommendations = [];
        
        // Analyze problem keys
        const problemKeys = Array.from(this.sessionErrors.entries())
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2);
        
        if (problemKeys.length > 0) {
            const keyList = problemKeys.map(([key]) => key.toUpperCase()).join(' and ');
            recommendations.push({
                icon: '🎯',
                text: `Focus on practicing the ${keyList} key${problemKeys.length > 1 ? 's' : ''}`
            });
        }
        
        // Analyze consistency
        if (this.consistencyScore < 70) {
            recommendations.push({
                icon: '⚡',
                text: 'Work on maintaining steady rhythm - avoid rushing'
            });
        } else if (this.consistencyScore > 85) {
            recommendations.push({
                icon: '🚀',
                text: 'Excellent consistency! Try increasing your speed'
            });
        }
        
        // Analyze accuracy vs speed balance
        if (this.accuracy > 95 && this.wpm < this.adaptiveTargetWPM) {
            recommendations.push({
                icon: '📈',
                text: 'High accuracy achieved - ready to increase speed'
            });
        } else if (this.accuracy < 90) {
            recommendations.push({
                icon: '🎪',
                text: 'Focus on accuracy before increasing speed'
            });
        }
        
        // Phase progression recommendations
        if (this.currentPhase === 'foundation') {
            const confidenceLevels = this.calculateLetterConfidence();
            const latestLetter = this.unlockedLetters[this.unlockedLetters.length - 1];
            const latestConfidence = confidenceLevels[latestLetter] || 0;
            
            if (latestConfidence > 0.8) {
                recommendations.push({
                    icon: '🔓',
                    text: `Ready to unlock the next letter!`
                });
            }
        }
        
        // Default encouragement if no specific recommendations
        if (recommendations.length === 0) {
            recommendations.push({
                icon: '✨',
                text: 'Great session! Keep up the consistent practice'
            });
        }
        
        return recommendations.slice(0, 3); // Limit to 3 recommendations
    }
    
    generateImprovementSuggestions() {
        const problemKeys = Array.from(this.sessionErrors.entries())
            .sort(([,a], [,b]) => b - a)
            .slice(0, 1);
        
        if (problemKeys.length === 0) {
            return "Excellent accuracy! Focus on building speed while maintaining precision.";
        }
        
        const [problemKey] = problemKeys[0];
        const fingerMap = {
            'q': 'left pinky', 'w': 'left ring', 'e': 'left middle', 'r': 'left index', 't': 'left index',
            'y': 'right index', 'u': 'right index', 'i': 'right middle', 'o': 'right ring', 'p': 'right pinky',
            'a': 'left pinky', 's': 'left ring', 'd': 'left middle', 'f': 'left index', 'g': 'left index',
            'h': 'right index', 'j': 'right index', 'k': 'right middle', 'l': 'right ring', ';': 'right pinky',
            'z': 'left pinky', 'x': 'left ring', 'c': 'left middle', 'v': 'left index', 'b': 'left index',
            'n': 'right index', 'm': 'right index', ',': 'right middle', '.': 'right ring', '/': 'right pinky'
        };
        
        const finger = fingerMap[problemKey.toLowerCase()] || 'specific finger';
        const keyUpper = problemKey.toUpperCase();
        
        // Generate contextual practice suggestions
        const practiceSuggestions = {
            'q': 'Practice "qu" combinations like "quick", "queen", "quiet"',
            'x': 'Practice words like "example", "extra", "exact"',
            'z': 'Practice words like "zero", "zone", "size"',
            'j': 'Practice words like "jump", "just", "major"',
            ';': 'Practice semicolon usage in programming contexts',
            '/': 'Practice slash combinations and file paths'
        };
        
        return practiceSuggestions[problemKey.toLowerCase()] || 
               `Focus on the ${keyUpper} key with your ${finger} - practice slowly with proper finger placement.`;
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