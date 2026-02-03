/**
 * Valentine's Day Website - Interactive JavaScript
 * Features: No button avoidance, floating hearts, sound effects
 */

class ValentineApp {
    constructor() {
        this.noBtn = document.getElementById('noBtn');
        this.yesBtn = document.getElementById('yesBtn');
        this.questionSection = document.getElementById('questionSection');
        this.thankYouSection = document.getElementById('thankYouSection');
        this.hoverText = document.getElementById('hoverText');
        this.heartsContainer = document.getElementById('heartsContainer');
        this.hoverSound = document.getElementById('hoverSound');
        this.yesSound = document.getElementById('yesSound');
        
        this.isAvoiding = false;
        this.avoidanceRadius = 80; // Distance to trigger avoidance
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        this.init();
    }

    init() {
        this.createFloatingHearts();
        this.setupEventListeners();
        this.setupNoButtonAvoidance();
        this.setupSoundEffects();
    }

    /**
     * Create floating hearts animation
     */
    createFloatingHearts() {
        const heartSymbols = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️'];
        
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every interval
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
                heart.style.animationDelay = Math.random() * 2 + 's';
                heart.style.fontSize = (Math.random() * 1 + 1) + 'rem';
                
                this.heartsContainer.appendChild(heart);
                
                // Remove heart after animation completes
                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                }, 10000);
            }
        }, 2000);
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Yes button click handler
        this.yesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleYesClick();
        });

        // Prevent context menu on buttons for better mobile experience
        [this.yesBtn, this.noBtn].forEach(btn => {
            btn.addEventListener('contextmenu', (e) => e.preventDefault());
        });

        // Touch support for mobile devices
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.handleMouseMove(touch.clientX, touch.clientY);
            }
        });

        // Mouse move for desktop
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e.clientX, e.clientY);
        });
    }

    /**
     * Setup sound effects
     */
    setupSoundEffects() {
        // Preload sounds
        this.hoverSound.volume = 0.3;
        this.yesSound.volume = 0.4;
        
        // Enable sound on first user interaction
        document.addEventListener('click', () => {
            this.hoverSound.load();
            this.yesSound.load();
        }, { once: true });
    }

    /**
     * Handle mouse/touch movement for No button avoidance
     */
    handleMouseMove(x, y) {
        this.lastMouseX = x;
        this.lastMouseY = y;
        
        // Check if cursor is near No button
        const noBtnRect = this.noBtn.getBoundingClientRect();
        const centerX = noBtnRect.left + noBtnRect.width / 2;
        const centerY = noBtnRect.top + noBtnRect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        
        // Show hover text when near No button
        if (distance < this.avoidanceRadius + 50) {
            this.hoverText.classList.add('show');
            this.playHoverSound();
        } else {
            this.hoverText.classList.remove('show');
        }
        
        // Trigger avoidance if within radius
        if (distance < this.avoidanceRadius && !this.isAvoiding) {
            this.avoidNoButton();
        }
    }

    /**
     * Setup No button avoidance behavior
     */
    setupNoButtonAvoidance() {
        // Make No button unfocusable to prevent tab navigation
        this.noBtn.setAttribute('tabindex', '-1');
        this.noBtn.setAttribute('aria-hidden', 'true');
    }

    /**
     * Move No button to a new position with smart boundary checking
     */
    avoidNoButton() {
        if (this.isAvoiding) return;
        
        this.isAvoiding = true;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get button dimensions
        const btnRect = this.noBtn.getBoundingClientRect();
        const btnWidth = btnRect.width;
        const btnHeight = btnRect.height;
        
        // Calculate safe boundaries - ensure we stay well within screen
        const margin = 25; // Reasonable margin from edges
        const maxX = viewportWidth - btnWidth - margin;
        const maxY = viewportHeight - btnHeight - margin;
        
        // If viewport is too small, don't move
        if (maxX <= margin || maxY <= margin) {
            this.isAvoiding = false;
            return;
        }
        
        // Get current mouse position
        const mouseX = this.lastMouseX;
        const mouseY = this.lastMouseY;
        
        // Calculate safe movement based on mouse position
        let newX, newY;
        
        // Strategy: Move to the opposite side of the screen from the mouse
        if (mouseX < viewportWidth / 2) {
            // Mouse is on the left, move to the right side
            newX = Math.max(viewportWidth / 2 + 50, maxX - Math.random() * 100);
        } else {
            // Mouse is on the right, move to the left side
            newX = Math.min(viewportWidth / 2 - btnWidth - 50, margin + Math.random() * 100);
        }
        
        if (mouseY < viewportHeight / 2) {
            // Mouse is on the top, move to the bottom
            newY = Math.max(viewportHeight / 2 + 30, maxY - Math.random() * 80);
        } else {
            // Mouse is on the bottom, move to the top
            newY = Math.min(viewportHeight / 2 - btnHeight - 30, margin + Math.random() * 80);
        }
        
        // Ensure position is within bounds
        newX = Math.max(margin, Math.min(maxX, newX));
        newY = Math.max(margin, Math.min(maxY, newY));
        
        // Additional check: ensure it's far enough from mouse
        const finalDistance = this.calculateDistanceFromMouse(newX, newY, btnWidth, btnHeight);
        if (finalDistance < this.avoidanceRadius) {
            // If still too close, move further in the same direction
            const currentRect = this.noBtn.getBoundingClientRect();
            const moveFurtherX = mouseX < viewportWidth / 2 ? 50 : -50;
            const moveFurtherY = mouseY < viewportHeight / 2 ? 30 : -30;
            
            newX = Math.max(margin, Math.min(maxX, newX + moveFurtherX));
            newY = Math.max(margin, Math.min(maxY, newY + moveFurtherY));
        }
        
        // Final boundary check
        newX = Math.max(margin, Math.min(viewportWidth - btnWidth - margin, newX));
        newY = Math.max(margin, Math.min(viewportHeight - btnHeight - margin, newY));
        
        // Apply new position with smooth transition
        this.noBtn.style.position = 'fixed';
        this.noBtn.classList.add('avoiding');
        this.noBtn.style.left = newX + 'px';
        this.noBtn.style.top = newY + 'px';
        this.noBtn.style.transform = 'scale(1.05)';
        this.noBtn.style.zIndex = '1000';
        
        // Reset scale after animation
        setTimeout(() => {
            this.noBtn.style.transform = 'scale(1)';
        }, 300);
        
        // Reset avoidance flag after a short delay
        setTimeout(() => {
            this.isAvoiding = false;
        }, 500);
        setTimeout(() => {
            this.isAvoiding = false;
        }, 800); // Increased delay to prevent rapid movements
    }

    /**
     * Check if new position is too close to mouse
     */
    isTooCloseToMouse(x, y, width, height) {
        return this.calculateDistanceFromMouse(x, y, width, height) < this.avoidanceRadius + 50;
    }

    /**
     * Calculate distance from a position to the current mouse position
     */
    calculateDistanceFromMouse(x, y, width, height) {
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        return Math.sqrt(
            Math.pow(this.lastMouseX - centerX, 2) + Math.pow(this.lastMouseY - centerY, 2)
        );
    }

    /**
     * Calculate distance from a position to another element
     */
    calculateDistanceFromElement(x, y, width, height, elementRect) {
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const elementCenterX = elementRect.left + elementRect.width / 2;
        const elementCenterY = elementRect.top + elementRect.height / 2;
        
        return Math.sqrt(
            Math.pow(elementCenterX - centerX, 2) + Math.pow(elementCenterY - centerY, 2)
        );
    }

    /**
     * Start continuous tracking of mouse position
     */
    startTracking() {
        const trackMouse = () => {
            if (!this.isTracking) return;
            
            this.updateNoButtonPosition();
            requestAnimationFrame(trackMouse);
        };
        trackMouse();
    }

    /**
     * Update No button position to maintain 1cm distance from cursor
     */
    updateNoButtonPosition() {
        const noBtnRect = this.noBtn.getBoundingClientRect();
        const btnCenterX = noBtnRect.left + noBtnRect.width / 2;
        const btnCenterY = noBtnRect.top + noBtnRect.height / 2;
        
        // Calculate vector from button to mouse
        const deltaX = this.lastMouseX - btnCenterX;
        const deltaY = this.lastMouseY - btnCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // If distance is less than 1cm, move button away
        if (distance < this.minDistanceFromMouse && distance > 0) {
            // Calculate target position to maintain 1cm distance
            const targetDistance = this.minDistanceFromMouse;
            
            // Calculate movement direction (away from mouse)
            const moveX = (deltaX / distance) * (targetDistance - distance) * 0.2; // Slow movement
            const moveY = (deltaY / distance) * (targetDistance - distance) * 0.2;
            
            // Get current button position
            const currentLeft = parseFloat(this.noBtn.style.left) || noBtnRect.left;
            const currentTop = parseFloat(this.noBtn.style.top) || noBtnRect.top;
            
            // Calculate new position with smooth movement
            let newLeft = currentLeft + moveX;
            let newTop = currentTop + moveY;
            
            // Ensure button stays within screen bounds
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const margin = 15; // Slightly smaller margin for more natural movement
            
            newLeft = Math.max(margin, Math.min(viewportWidth - noBtnRect.width - margin, newLeft));
            newTop = Math.max(margin, Math.min(viewportHeight - noBtnRect.height - margin, newTop));
            
            // Apply position immediately for fast reaction
            this.noBtn.style.position = 'fixed';
            this.noBtn.classList.add('avoiding');
            this.noBtn.style.left = newLeft + 'px';
            this.noBtn.style.top = newTop + 'px';
            this.noBtn.style.transform = 'scale(1.01)';
            this.noBtn.style.zIndex = '1000';
            
            // Reset scale after a very short delay
            setTimeout(() => {
                if (this.noBtn.style.transform === 'scale(1.01)') {
                    this.noBtn.style.transform = 'scale(1)';
                }
            }, 100);
        }
    }

    /**
     * Handle Yes button click
     */
    handleYesClick() {
        // Play sound effect
        this.playYesSound();
        
        // Create heart explosion effect
        this.createHeartExplosion();
        
        // Hide question section and show thank you section
        this.questionSection.style.animation = 'fadeOutScale 0.6s ease-in forwards';
        
        setTimeout(() => {
            this.questionSection.style.display = 'none';
            this.thankYouSection.style.display = 'block';
            this.thankYouSection.classList.add('visible');
            
            // Create celebration hearts
            this.createCelebrationHearts();
        }, 600);
    }

    /**
     * Create heart explosion effect at button position
     */
    createHeartExplosion() {
        const btnRect = this.yesBtn.getBoundingClientRect();
        const centerX = btnRect.left + btnRect.width / 2;
        const centerY = btnRect.top + btnRect.height / 2;
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart explosion-heart';
                heart.textContent = '💖';
                heart.style.position = 'fixed';
                heart.style.left = centerX + 'px';
                heart.style.top = centerY + 'px';
                heart.style.fontSize = '2rem';
                heart.style.opacity = '1';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '9999';
                heart.style.animation = `explodeHeart 1s ease-out forwards`;
                
                // Random direction
                const angle = (i / 15) * Math.PI * 2;
                const distance = 100 + Math.random() * 100;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;
                
                document.body.appendChild(heart);
                
                // Animate to final position
                heart.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                }).onfinish = () => {
                    if (heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                };
            }, i * 50);
        }
    }

    /**
     * Create celebration hearts after clicking Yes
     */
    createCelebrationHearts() {
        const celebrationSymbols = ['🎉', '🎊', '💕', '💖', '💗', '💓', '💝', '💘', '❤️'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart celebration-heart';
                heart.textContent = celebrationSymbols[Math.floor(Math.random() * celebrationSymbols.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.top = '-50px';
                heart.style.fontSize = (Math.random() * 1.5 + 1.5) + 'rem';
                heart.style.animation = 'celebrationFall 3s ease-in forwards';
                heart.style.zIndex = '9999';
                heart.style.opacity = '0.8';
                
                this.heartsContainer.appendChild(heart);
                
                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                }, 3000);
            }, i * 100);
        }
    }

    /**
     * Play hover sound effect
     */
    playHoverSound() {
        try {
            const sound = this.hoverSound.cloneNode();
            sound.volume = 0.2;
            sound.play().catch(() => {
                // Ignore audio play errors (common on mobile)
            });
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    /**
     * Play yes sound effect
     */
    playYesSound() {
        try {
            const sound = this.yesSound.cloneNode();
            sound.volume = 0.3;
            sound.play().catch(() => {
                // Ignore audio play errors
            });
        } catch (error) {
            console.log('Audio not supported');
        }
    }
}

// ===== CSS Animations (added via JavaScript) =====
const additionalStyles = `
    @keyframes fadeOutScale {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
    
    @keyframes explodeHeart {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x, 0), var(--end-y, 0)) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes celebrationFall {
        0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0.8;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .btn-no {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .celebration-heart {
        position: fixed !important;
        pointer-events: none;
        z-index: 9999;
    }
`;

// Add additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ValentineApp();
});

// Handle page visibility changes to pause/resume animations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});