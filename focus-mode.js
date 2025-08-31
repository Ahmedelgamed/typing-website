// Focus Mode - Ultra-distraction-free typing experience
class FocusMode {
    constructor() {
        this.isActive = false;
        this.originalStyles = {};
        this.focusElements = [];
        this.keyboardShortcuts = true;
        
        this.initialize();
    }
    
    initialize() {
        this.createFocusModeToggle();
        this.bindEvents();
    }
    
    createFocusModeToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'focus-mode-toggle';
        toggle.innerHTML = `
            <button id="focus-mode-btn" class="focus-btn" title="Toggle Focus Mode (F)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                <span class="focus-label">Focus</span>
            </button>
        `;
        
        // Add to header controls
        const headerControls = document.querySelector('.header-controls');
        if (headerControls) {
            headerControls.appendChild(toggle);
        }
    }
    
    bindEvents() {
        const focusBtn = document.getElementById('focus-mode-btn');
        if (focusBtn) {
            focusBtn.addEventListener('click', () => this.toggle());
        }
        
        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' || e.key === 'F') {
                // Only activate if not in a text input and not during typing
                const activeElement = document.activeElement;
                const isTyping = activeElement && activeElement.id === 'typing-input';
                
                if (!isTyping && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    this.toggle();
                }
            }
            
            // Escape to exit focus mode
            if (e.key === 'Escape' && this.isActive) {
                this.disable();
            }
        });
    }
    
    toggle() {
        if (this.isActive) {
            this.disable();
        } else {
            this.enable();
        }
    }
    
    enable() {
        if (this.isActive) return;
        
        this.isActive = true;
        document.body.classList.add('focus-mode-active');
        
        // Hide distracting elements
        this.hideElements([
            'header .header-controls',
            '.keyboard-hints',
            'footer',
            '.stats-display',
            '.controls .difficulty-selector',
            '.enhanced-controls',
            '.virtual-keyboard'
        ]);
        
        // Enhance focus elements
        this.enhanceFocusElements([
            '.text-display',
            '.results'
        ]);
        
        // Add focus mode indicator
        this.addFocusIndicator();
        
        // Auto-hide cursor after inactivity
        this.startCursorAutoHide();
        
        // Update button
        const focusBtn = document.getElementById('focus-mode-btn');
        if (focusBtn) {
            focusBtn.classList.add('active');
            focusBtn.title = 'Exit Focus Mode (F or Esc)';
        }
        
        this.showFocusModeMessage('Focus Mode Activated • Press F or Esc to exit');
    }
    
    disable() {
        if (!this.isActive) return;
        
        this.isActive = false;
        document.body.classList.remove('focus-mode-active');
        
        // Restore hidden elements
        this.restoreElements();
        
        // Remove enhancements
        this.removeFocusEnhancements();
        
        // Remove focus indicator
        this.removeFocusIndicator();
        
        // Stop cursor auto-hide
        this.stopCursorAutoHide();
        
        // Update button
        const focusBtn = document.getElementById('focus-mode-btn');
        if (focusBtn) {
            focusBtn.classList.remove('active');
            focusBtn.title = 'Toggle Focus Mode (F)';
        }
        
        this.showFocusModeMessage('Focus Mode Deactivated');
    }
    
    hideElements(selectors) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && !element.hasAttribute('data-focus-hidden')) {
                    this.originalStyles[selector] = this.originalStyles[selector] || [];
                    this.originalStyles[selector].push({
                        element: element,
                        display: element.style.display,
                        opacity: element.style.opacity,
                        transform: element.style.transform
                    });
                    
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(-10px)';
                    element.style.pointerEvents = 'none';
                    element.setAttribute('data-focus-hidden', 'true');
                    
                    setTimeout(() => {
                        if (this.isActive) {
                            element.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    }
    
    enhanceFocusElements(selectors) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.classList.add('focus-enhanced');
                    this.focusElements.push(element);
                }
            });
        });
    }
    
    restoreElements() {
        Object.entries(this.originalStyles).forEach(([selector, stylesArray]) => {
            stylesArray.forEach(styleData => {
                const { element, display, opacity, transform } = styleData;
                
                if (element) {
                    element.style.display = display;
                    element.style.opacity = opacity;
                    element.style.transform = transform;
                    element.style.pointerEvents = '';
                    element.removeAttribute('data-focus-hidden');
                }
            });
        });
        
        this.originalStyles = {};
    }
    
    removeFocusEnhancements() {
        this.focusElements.forEach(element => {
            element.classList.remove('focus-enhanced');
        });
        this.focusElements = [];
    }
    
    addFocusIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'focus-mode-indicator';
        indicator.innerHTML = `
            <div class="focus-indicator-dot"></div>
            <span>Focus Mode</span>
        `;
        
        document.body.appendChild(indicator);
    }
    
    removeFocusIndicator() {
        const indicator = document.querySelector('.focus-mode-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    startCursorAutoHide() {
        let inactivityTimer;
        
        const hideCursor = () => {
            document.body.classList.add('cursor-hidden');
        };
        
        const showCursor = () => {
            document.body.classList.remove('cursor-hidden');
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(hideCursor, 3000);
        };
        
        this.cursorEvents = {
            mousemove: showCursor,
            mousedown: showCursor,
            keydown: showCursor
        };
        
        Object.entries(this.cursorEvents).forEach(([event, handler]) => {
            document.addEventListener(event, handler);
        });
        
        // Start timer
        inactivityTimer = setTimeout(hideCursor, 3000);
        this.cursorTimer = inactivityTimer;
    }
    
    stopCursorAutoHide() {
        if (this.cursorEvents) {
            Object.entries(this.cursorEvents).forEach(([event, handler]) => {
                document.removeEventListener(event, handler);
            });
            this.cursorEvents = null;
        }
        
        if (this.cursorTimer) {
            clearTimeout(this.cursorTimer);
            this.cursorTimer = null;
        }
        
        document.body.classList.remove('cursor-hidden');
    }
    
    showFocusModeMessage(message) {
        // Remove existing message
        const existing = document.querySelector('.focus-mode-message');
        if (existing) {
            existing.remove();
        }
        
        const messageEl = document.createElement('div');
        messageEl.className = 'focus-mode-message';
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.classList.add('visible');
        }, 50);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            messageEl.classList.remove('visible');
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Focus Mode Styles - Added dynamically to avoid conflicts
const focusModeStyles = `
/* Focus Mode Toggle Button */
.focus-mode-toggle {
    position: relative;
}

.focus-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--bg-secondary);
    color: var(--text-secondary);
    border: 1px solid var(--border-medium);
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: var(--transition-medium);
}

.focus-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border-color: var(--accent-primary);
}

.focus-btn.active {
    background: var(--accent-primary);
    color: var(--text-accent);
    border-color: var(--accent-primary);
}

.focus-btn svg {
    transition: var(--transition-medium);
}

.focus-btn.active svg {
    transform: scale(1.1);
}

/* Focus Mode Active State */
body.focus-mode-active {
    background: #060608;
}

body.focus-mode-active::before {
    opacity: 0.3;
}

body.focus-mode-active .container {
    max-width: 800px;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
}

/* Enhanced Focus Elements */
.focus-enhanced {
    position: relative;
    z-index: 100;
    transition: var(--transition-slow);
    transform: scale(1.02);
    box-shadow: var(--glow-medium);
}

.focus-enhanced.text-display {
    font-size: clamp(1.4rem, 3vw, 2rem);
    padding: 4rem;
    margin: 2rem 0;
    background: rgba(20, 20, 32, 0.95);
    backdrop-filter: blur(40px);
    border: 2px solid rgba(99, 102, 241, 0.3);
}

/* Focus Mode Indicator */
.focus-mode-indicator {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.8);
    color: var(--accent-primary);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    z-index: 1000;
    animation: focusIndicatorPulse 3s ease-in-out infinite;
}

.focus-indicator-dot {
    width: 8px;
    height: 8px;
    background: var(--accent-primary);
    border-radius: 50%;
    animation: focusDotPulse 2s ease-in-out infinite;
}

@keyframes focusIndicatorPulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
}

@keyframes focusDotPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); box-shadow: 0 0 10px var(--accent-primary); }
}

/* Focus Mode Message */
.focus-mode-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: var(--text-accent);
    padding: 1rem 2rem;
    border-radius: 12px;
    border: 1px solid var(--accent-primary);
    z-index: 2000;
    font-weight: 500;
    opacity: 0;
    transition: var(--transition-medium);
}

.focus-mode-message.visible {
    opacity: 1;
}

/* Cursor Auto-hide */
body.cursor-hidden,
body.cursor-hidden * {
    cursor: none !important;
}

/* Mobile Adaptations */
@media (max-width: 768px) {
    .focus-btn .focus-label {
        display: none;
    }
    
    .focus-mode-indicator {
        top: 10px;
        right: 10px;
        font-size: 0.7rem;
        padding: 0.4rem 0.8rem;
    }
    
    body.focus-mode-active .container {
        padding: 1rem;
    }
    
    .focus-enhanced.text-display {
        font-size: 1.3rem;
        padding: 2rem 1.5rem;
    }
}
`;

// Inject styles
const style = document.createElement('style');
style.textContent = focusModeStyles;
document.head.appendChild(style);

// Initialize Focus Mode when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FocusMode();
});