// Animation components for counters and scroll effects

class AnimatedCounters {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
            this.counters.forEach(counter => this.observer.observe(counter));
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                this.animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }

    animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const start = performance.now();

        const animation = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easedProgress = this.easeOutExpo(progress);
            const currentValue = Math.round(target * easedProgress);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
}

class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Add fade-in-up class to elements
        const elementsToAnimate = document.querySelectorAll('.change-card, .team-member, .impact-item, .challenge-item');
        elementsToAnimate.forEach(el => {
            el.classList.add('fade-in-up');
            this.elements.push(el);
        });

        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for older browsers
            this.elements.forEach(el => el.classList.add('visible'));
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => observer.observe(el));
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AnimatedCounters();
    new ScrollAnimations();
});