// Global Components Loader
class ComponentLoader {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().toLowerCase();
        
        // Map filenames to page identifiers
        const pageMap = {
            '1 homepage.html': 'home',
            '2 issues.html': 'issues',
            '3 about.html': 'about',
            '4 programs.html': 'programs',
            '5 action center.html': 'action',
            '6 partners.html': 'partners',
            '7 news.html': 'news',
            '8 contact.html': 'contact',
            '9 donate.html': 'donate'
        };

        return pageMap[filename] || 'home';
    }

    async loadComponent(elementId, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
            
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                return true;
            }
        } catch (error) {
            console.warn(`Could not load component ${componentPath}:`, error);
            return false;
        }
    }

    setActiveNavItem() {
        // Set active navigation item based on current page
        const navLinks = document.querySelectorAll('.header-nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(this.currentPage)) {
                link.classList.add('active');
            }
        });
    }

    initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const headerNav = document.querySelector('.header-nav');

        if (mobileMenuToggle && headerNav) {
            mobileMenuToggle.addEventListener('click', () => {
                const isActive = headerNav.classList.contains('active');
                headerNav.classList.toggle('active');
                mobileMenuToggle.setAttribute('aria-expanded', !isActive);
                
                // Add mobile menu styles dynamically
                if (!isActive) {
                    headerNav.style.display = 'flex';
                    headerNav.style.position = 'absolute';
                    headerNav.style.top = '100%';
                    headerNav.style.left = '0';
                    headerNav.style.right = '0';
                    headerNav.style.background = 'var(--white)';
                    headerNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                    headerNav.style.padding = '20px';
                    headerNav.style.flexDirection = 'column';
                    headerNav.style.gap = '10px';
                    headerNav.style.zIndex = '1002';
                } else {
                    headerNav.style.display = '';
                    headerNav.style.position = '';
                    headerNav.style.top = '';
                    headerNav.style.left = '';
                    headerNav.style.right = '';
                    headerNav.style.background = '';
                    headerNav.style.boxShadow = '';
                    headerNav.style.padding = '';
                    headerNav.style.flexDirection = '';
                    headerNav.style.gap = '';
                    headerNav.style.zIndex = '';
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.header-nav') && !e.target.closest('.mobile-menu-toggle')) {
                    if (headerNav.classList.contains('active')) {
                        headerNav.classList.remove('active');
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        // Reset styles
                        headerNav.style.display = '';
                        headerNav.style.position = '';
                        headerNav.style.top = '';
                        headerNav.style.left = '';
                        headerNav.style.right = '';
                        headerNav.style.background = '';
                        headerNav.style.boxShadow = '';
                        headerNav.style.padding = '';
                        headerNav.style.flexDirection = '';
                        headerNav.style.gap = '';
                        headerNav.style.zIndex = '';
                    }
                }
            });
        }
    }

    initHeaderScrollEffect() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (header) {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.backdropFilter = 'blur(10px)';
                    header.style.webkitBackdropFilter = 'blur(10px)';
                } else {
                    header.style.background = 'var(--white)';
                    header.style.backdropFilter = 'none';
                    header.style.webkitBackdropFilter = 'none';
                }
            }
        });
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    async init() {
        // Load header and footer components if they exist
        const headerLoaded = await this.loadComponent('global-header', 'includes/header.html');
        const footerLoaded = await this.loadComponent('global-footer', 'includes/footer.html');

        // Wait a bit for DOM to update, then initialize components
        setTimeout(() => {
            if (headerLoaded) {
                this.setActiveNavItem();
                this.initMobileMenu();
                this.initHeaderScrollEffect();
            }
            this.initSmoothScrolling();
            this.initOtherComponents();
        }, 100);
    }

    initOtherComponents() {
        // Initialize dropdown menus
        this.initDropdowns();
        
        // Initialize any form handlers
        this.initForms();
        
        // Initialize scroll animations
        this.initScrollAnimations();
        
        // Initialize FAQ accordions
        this.initFAQ();
        
        // Initialize contact form
        this.initContactForm();
    }

    initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (toggle && menu) {
                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        menu.style.opacity = '0';
                        menu.style.visibility = 'hidden';
                    }
                });
            }
        });
    }

    initForms() {
        // Newsletter form handling
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                if (email) {
                    // Newsletter signup processed
                    // Here you would typically send to your backend
                }
            });
        }
    }

    initScrollAnimations() {
        // Simple fade-in animation for elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate in
        const animateElements = document.querySelectorAll('.change-card, .team-member, .impact-item, .challenge-item');
        animateElements.forEach(el => observer.observe(el));
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    // Toggle current item
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    initContactForm() {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const name = contactForm.querySelector('input[type="text"]').value;
                const email = contactForm.querySelector('input[type="email"]').value;
                const message = contactForm.querySelector('textarea').value;
                
                if (name && email && message) {
                    // Show loading state
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                    
                    // Simulate form submission (replace with actual form handler)
                    setTimeout(() => {
                        alert('Thank you for your message! We\'ll get back to you soon.');
                        contactForm.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                    
                    // Contact form submitted successfully
                }
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});

// Global utility functions
window.PraxisUtils = {
    // Show loading state for buttons
    showButtonLoading: (button, originalText = null) => {
        if (!originalText) originalText = button.textContent;
        button.dataset.originalText = originalText;
        button.textContent = 'Loading...';
        button.style.opacity = '0.7';
        button.disabled = true;
    },

    // Hide loading state for buttons
    hideButtonLoading: (button) => {
        const originalText = button.dataset.originalText || 'Click Here';
        button.textContent = originalText;
        button.style.opacity = '1';
        button.disabled = false;
    },

    // Smooth scroll to element
    scrollToElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Format numbers with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // Debounce function for search/input handlers
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Add some additional event listeners for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Handle external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // Handle phone number links
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Analytics tracking could go here
            // Phone number clicked
        });
    });

    // Handle email links
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Analytics tracking could go here
            // Email link clicked
        });
    });
});

// =================================================================
// ANIMATED STATISTICS COUNTERS
// =================================================================

class AnimatedCounters {
    constructor() {
        this.counters = document.querySelectorAll('.crisis-number');
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;

        // Create intersection observer to trigger animation when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const text = element.textContent;
        const hasPercent = text.includes('%');
        const hasPlus = text.includes('+');
        const hasComma = text.includes(',');
        
        // Extract the numeric value
        let targetValue = parseFloat(text.replace(/[^\d.]/g, ''));
        
        // Handle special cases
        if (text.includes('215,000')) {
            targetValue = 215000;
        } else if (text.includes('446')) {
            targetValue = 446;
        } else if (text.includes('13')) {
            targetValue = 13;
        } else if (text.includes('4.2')) {
            targetValue = 4.2;
        }

        let currentValue = 0;
        const increment = targetValue / 60; // 60 frames for smooth animation
        const duration = 2000; // 2 seconds
        const frameRate = duration / 60;

        element.textContent = '0';
        element.classList.add('animate');

        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }

            // Format the display value
            let displayValue;
            if (text.includes('4.2')) {
                displayValue = currentValue.toFixed(1);
            } else if (text.includes('215,000')) {
                displayValue = Math.floor(currentValue).toLocaleString();
            } else {
                displayValue = Math.floor(currentValue).toString();
            }

            // Add back the symbols
            if (hasPercent) displayValue += '%';
            if (hasPlus) displayValue += '+';

            element.textContent = displayValue;
        }, frameRate);
    }
}

// =================================================================
// SCROLL-TRIGGERED ANIMATIONS
// =================================================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.program-feature, .program-text, .crisis-stat');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        // Add fade-in-up class to elements
        this.elements.forEach((element, index) => {
            element.classList.add('fade-in-up');
            element.style.transitionDelay = `${index * 0.1}s`;
        });

        // Create intersection observer
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

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// =================================================================
// INTERACTIVE PROGRAM CARDS
// =================================================================

class InteractiveProgramCards {
    constructor() {
        this.programFeatures = document.querySelectorAll('.program-feature');
        this.init();
    }

    init() {
        if (this.programFeatures.length === 0) return;

        this.programFeatures.forEach(feature => {
            // Add hover sound effect (optional)
            feature.addEventListener('mouseenter', () => {
                feature.style.transform = 'translateY(-5px) scale(1.02)';
                feature.style.transition = 'all 0.3s ease';
            });

            feature.addEventListener('mouseleave', () => {
                feature.style.transform = 'translateY(0) scale(1)';
            });

            // Add click interaction
            feature.addEventListener('click', () => {
                // Add a subtle pulse effect
                feature.style.animation = 'pulse 0.6s ease-in-out';
                setTimeout(() => {
                    feature.style.animation = '';
                }, 600);
            });
        });
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animated counters
    new AnimatedCounters();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize interactive program cards
    new InteractiveProgramCards();
});

// Add pulse animation to CSS if not already present
if (!document.querySelector('#pulse-animation-style')) {
    const style = document.createElement('style');
    style.id = 'pulse-animation-style';
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}


// =================================================================
// EXPANDABLE PROGRAM CARDS
// =================================================================

class ExpandableCards {
    constructor() {
        this.expandButtons = document.querySelectorAll('.expand-btn');
        this.init();
    }

    init() {
        if (this.expandButtons.length === 0) return;

        this.expandButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCard(button);
            });
        });
    }

    toggleCard(button) {
        const card = button.closest('.expandable-card');
        const content = card.querySelector('.expandable-content');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Toggle expanded state
        button.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            // Expand
            content.style.display = 'block';
            content.classList.add('expanded');
            card.classList.add('expanding');
            
            // Update button text
            button.querySelector('.btn-text').textContent = 'Learn';
            
            // Smooth scroll to keep card in view
            setTimeout(() => {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 200);
            
        } else {
            // Collapse
            content.classList.remove('expanded');
            card.classList.remove('expanding');
            
            // Update button text
            button.querySelector('.btn-text').textContent = 'Learn';
            
            // Hide content after animation
            setTimeout(() => {
                content.style.display = 'none';
            }, 400);
        }

        // Add pulse effect to the card
        card.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 600);
    }
}

// =================================================================
// PROGRAM TIMELINE WIDGET
// =================================================================

class ProgramTimeline {
    constructor() {
        this.timelineContainer = document.querySelector('.program-timeline');
        this.init();
    }

    init() {
        if (!this.timelineContainer) {
            this.createTimeline();
        }
    }

    createTimeline() {
        // Create timeline section if it doesn't exist
        const timelineHTML = `
            <section class="program-timeline section">
                <div class="container">
                    <h2>Our Journey: Key Milestones</h2>
                    <div class="timeline">
                        <div class="timeline-item" data-year="2020">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>Organization Founded</h3>
                                <p>Praxis Initiative established with a mission to transform Arizona's criminal justice system</p>
                            </div>
                        </div>
                        <div class="timeline-item" data-year="2022">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>First Legislative Victory</h3>
                                <p>Successfully advocated for criminal justice reform legislation</p>
                            </div>
                        </div>
                        <div class="timeline-item" data-year="2024">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>Independent Oversight Office</h3>
                                <p>Created Arizona's first Independent Correctional Oversight Office</p>
                            </div>
                        </div>
                        <div class="timeline-item" data-year="2025">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>Expanding Impact</h3>
                                <p>Launching comprehensive programs across all five focus areas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Insert timeline before the last section
        const lastSection = document.querySelector('main section:last-of-type');
        if (lastSection) {
            lastSection.insertAdjacentHTML('beforebegin', timelineHTML);
            this.animateTimeline();
        }
    }

    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.3
        });

        timelineItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(item);
        });
    }
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animated counters
    new AnimatedCounters();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize interactive program cards
    new InteractiveProgramCards();
    
    // Initialize expandable cards
    new ExpandableCards();
    
    // Initialize program timeline
    new ProgramTimeline();
});


// =================================================================
// PARTNERS PAGE INTERACTIVE FUNCTIONALITY
// =================================================================

class PartnersManager {
    constructor() {
        this.searchInput = document.getElementById('partner-search');
        this.categoryFilter = document.getElementById('category-filter');
        this.gridViewBtn = document.getElementById('grid-view');
        this.listViewBtn = document.getElementById('list-view');
        this.partnersContainer = document.getElementById('partners-container');
        this.resultsCount = document.getElementById('results-count');
        this.partnerCards = document.querySelectorAll('.partner-card');
        
        this.init();
    }

    init() {
        if (!this.partnersContainer) return;

        // Initialize search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.debounce(() => {
                this.filterPartners();
            }, 300));
        }

        // Initialize category filtering
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => {
                this.filterPartners();
            });
        }

        // Initialize view toggle
        if (this.gridViewBtn && this.listViewBtn) {
            this.gridViewBtn.addEventListener('click', () => {
                this.setView('grid');
            });

            this.listViewBtn.addEventListener('click', () => {
                this.setView('list');
            });
        }

        // Initialize animated counters for partnership stats
        this.initPartnershipStats();

        // Initial filter
        this.filterPartners();
    }

    filterPartners() {
        const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';
        const selectedCategory = this.categoryFilter ? this.categoryFilter.value : 'all';
        let visibleCount = 0;

        this.partnerCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category') || '';
            const cardText = card.textContent.toLowerCase();
            
            const matchesSearch = !searchTerm || cardText.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || cardCategory === selectedCategory;
            
            if (matchesSearch && matchesCategory) {
                this.showCard(card);
                visibleCount++;
            } else {
                this.hideCard(card);
            }
        });

        // Update results count
        if (this.resultsCount) {
            const partnerText = visibleCount === 1 ? 'partner' : 'partners';
            this.resultsCount.textContent = `${visibleCount} ${partnerText} found`;
        }

        // Add staggered animation to visible cards
        this.animateVisibleCards();
    }

    showCard(card) {
        card.classList.remove('hidden', 'fade-out');
        card.classList.add('fade-in');
        setTimeout(() => {
            card.style.display = '';
        }, 50);
    }

    hideCard(card) {
        card.classList.remove('fade-in');
        card.classList.add('fade-out');
        setTimeout(() => {
            card.classList.add('hidden');
            card.style.display = 'none';
        }, 300);
    }

    setView(viewType) {
        if (viewType === 'grid') {
            this.partnersContainer.classList.remove('list-view');
            this.gridViewBtn.classList.add('active');
            this.listViewBtn.classList.remove('active');
        } else {
            this.partnersContainer.classList.add('list-view');
            this.listViewBtn.classList.add('active');
            this.gridViewBtn.classList.remove('active');
        }
    }

    animateVisibleCards() {
        const visibleCards = Array.from(this.partnerCards).filter(card => 
            !card.classList.contains('hidden')
        );

        visibleCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
    }

    initPartnershipStats() {
        const statNumbers = document.querySelectorAll('.partnership-stat .stat-number');
        
        if (statNumbers.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateStatNumber(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    animateStatNumber(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const targetValue = parseInt(text.replace(/[^\d]/g, ''));
        
        let currentValue = 0;
        const increment = targetValue / 30;
        const duration = 1500;
        const frameRate = duration / 30;

        element.textContent = '0';

        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }

            let displayValue = Math.floor(currentValue).toString();
            if (hasPlus) displayValue += '+';

            element.textContent = displayValue;
        }, frameRate);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// =================================================================
// PARTNERSHIP VISUALIZATION
// =================================================================

class PartnershipVisualization {
    constructor() {
        this.createVisualization();
    }

    createVisualization() {
        // Create partnership network visualization section
        const visualizationHTML = `
            <section class="partnership-network section">
                <div class="container">
                    <h2>Partnership Network</h2>
                    <p>Explore how our partners connect across different focus areas</p>
                    <div class="network-container">
                        <div class="network-node" data-category="criminal-justice">
                            <div class="node-circle">
                                <span class="node-count">6</span>
                            </div>
                            <div class="node-label">Criminal Justice Reform</div>
                        </div>
                        <div class="network-node" data-category="harm-reduction">
                            <div class="node-circle">
                                <span class="node-count">3</span>
                            </div>
                            <div class="node-label">Harm Reduction</div>
                        </div>
                        <div class="network-node" data-category="research">
                            <div class="node-circle">
                                <span class="node-count">4</span>
                            </div>
                            <div class="node-label">Research & Policy</div>
                        </div>
                        <div class="network-node" data-category="advocacy">
                            <div class="node-circle">
                                <span class="node-count">4</span>
                            </div>
                            <div class="node-label">Advocacy & Rights</div>
                        </div>
                        <div class="network-node" data-category="health">
                            <div class="node-circle">
                                <span class="node-count">5</span>
                            </div>
                            <div class="node-label">Health & Wellness</div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Insert before the CTA section
        const ctaSection = document.querySelector('.cta');
        if (ctaSection) {
            ctaSection.insertAdjacentHTML('beforebegin', visualizationHTML);
            this.initNetworkInteractions();
        }
    }

    initNetworkInteractions() {
        const networkNodes = document.querySelectorAll('.network-node');
        const categoryFilter = document.getElementById('category-filter');

        networkNodes.forEach(node => {
            node.addEventListener('click', () => {
                const category = node.getAttribute('data-category');
                if (categoryFilter) {
                    categoryFilter.value = category;
                    categoryFilter.dispatchEvent(new Event('change'));
                    
                    // Scroll to partners section
                    document.getElementById('partners-container').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });

            node.addEventListener('mouseenter', () => {
                node.style.transform = 'scale(1.1)';
            });

            node.addEventListener('mouseleave', () => {
                node.style.transform = 'scale(1)';
            });
        });
    }
}

// Update the main DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animated counters
    new AnimatedCounters();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize interactive program cards
    new InteractiveProgramCards();
    
    // Initialize expandable cards
    new ExpandableCards();
    
    // Initialize program timeline
    new ProgramTimeline();
    
    // Initialize partners manager (only on partners page)
    if (document.getElementById('partners-container')) {
        new PartnersManager();
        new PartnershipVisualization();
    }
});



// ===== NEWS PAGE FUNCTIONALITY =====

// News page filtering and search
function initializeNewsPage() {
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const sortSelect = document.getElementById('sortBy');
    const dateFilter = document.getElementById('dateFilter');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const contentItems = document.querySelector('.content-items');
    const resultsCount = document.getElementById('resultsCount');
    
    let allArticles = [];
    let filteredArticles = [];
    let currentFilter = 'all';
    let currentSort = 'date-desc';
    let currentDateFilter = 'all';
    let searchTerm = '';
    
    // Initialize articles data
    function initializeArticles() {
        const articles = document.querySelectorAll('.content-card, .featured-article');
        allArticles = Array.from(articles).map(article => ({
            element: article,
            type: article.dataset.type || 'article',
            date: new Date(article.dataset.date || '2025-01-01'),
            popularity: parseInt(article.dataset.popularity || '50'),
            title: article.querySelector('.card-title, h2')?.textContent || '',
            excerpt: article.querySelector('.card-excerpt, .featured-description')?.textContent || '',
            tags: Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent),
            author: article.querySelector('.card-meta span:nth-child(2)')?.textContent || ''
        }));
        filteredArticles = [...allArticles];
        updateResultsCount();
    }
    
    // Search functionality with suggestions
    if (searchInput) {
        let searchTimeout;
        const searchSuggestionsList = [
            'bail reform', 'restorative justice', 'mandatory minimums', 'prison reform',
            'criminal justice', 'sentencing disparities', 'community programs', 'recidivism',
            'drug policy', 'mental health courts', 'prosecutorial discretion', 'decarceration'
        ];
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTerm = e.target.value.toLowerCase();
            
            // Show suggestions
            if (searchTerm.length > 1) {
                const suggestions = searchSuggestionsList.filter(suggestion => 
                    suggestion.includes(searchTerm)
                ).slice(0, 5);
                
                if (suggestions.length > 0) {
                    searchSuggestions.innerHTML = suggestions.map(suggestion => 
                        `<div class="suggestion-item" data-suggestion="${suggestion}">${suggestion}</div>`
                    ).join('');
                    searchSuggestions.style.display = 'block';
                } else {
                    searchSuggestions.style.display = 'none';
                }
            } else {
                searchSuggestions.style.display = 'none';
            }
            
            // Debounced search
            searchTimeout = setTimeout(() => {
                filterAndSortArticles();
            }, 300);
        });
        
        // Handle suggestion clicks
        searchSuggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-item')) {
                searchInput.value = e.target.dataset.suggestion;
                searchTerm = e.target.dataset.suggestion.toLowerCase();
                searchSuggestions.style.display = 'none';
                filterAndSortArticles();
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });
    }
    
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            filterAndSortArticles();
        });
    });
    
    // Sort and date filters
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterAndSortArticles();
        });
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', (e) => {
            currentDateFilter = e.target.value;
            filterAndSortArticles();
        });
    }
    
    // View toggle
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            contentItems.classList.remove('list-view');
        });
        
        listViewBtn.addEventListener('click', () => {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            contentItems.classList.add('list-view');
        });
    }
    
    // Filter and sort function
    function filterAndSortArticles() {
        filteredArticles = allArticles.filter(article => {
            // Type filter
            if (currentFilter !== 'all' && article.type !== currentFilter) {
                return false;
            }
            
            // Date filter
            if (currentDateFilter !== 'all') {
                const now = new Date();
                const articleDate = article.date;
                let cutoffDate;
                
                switch (currentDateFilter) {
                    case 'week':
                        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case 'month':
                        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        break;
                    case 'quarter':
                        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                        break;
                    case 'year':
                        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                        break;
                    default:
                        cutoffDate = new Date(0);
                }
                
                if (articleDate < cutoffDate) {
                    return false;
                }
            }
            
            // Search filter
            if (searchTerm) {
                const searchableText = (
                    article.title + ' ' + 
                    article.excerpt + ' ' + 
                    article.tags.join(' ') + ' ' + 
                    article.author
                ).toLowerCase();
                
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Sort articles
        filteredArticles.sort((a, b) => {
            switch (currentSort) {
                case 'date-desc':
                    return b.date - a.date;
                case 'date-asc':
                    return a.date - b.date;
                case 'popular':
                    return b.popularity - a.popularity;
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
        
        // Update display
        updateArticleDisplay();
        updateResultsCount();
    }
    
    function updateArticleDisplay() {
        // Hide all articles first
        allArticles.forEach(article => {
            article.element.style.display = 'none';
        });
        
        // Show filtered articles
        filteredArticles.forEach((article, index) => {
            article.element.style.display = 'block';
            article.element.style.order = index;
        });
    }
    
    function updateResultsCount() {
        if (resultsCount) {
            const count = filteredArticles.length;
            const articleText = count === 1 ? 'article' : 'articles';
            resultsCount.textContent = `${count} ${articleText} found`;
        }
    }
    
    // Initialize
    initializeArticles();
}

// Bookmarking functionality
function initializeBookmarking() {
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    let bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    
    // Update bookmark button states
    function updateBookmarkStates() {
        bookmarkButtons.forEach(btn => {
            const articleId = btn.dataset.articleId;
            if (bookmarkedArticles.includes(articleId)) {
                btn.classList.add('bookmarked');
                btn.querySelector('i').className = 'fas fa-bookmark';
            } else {
                btn.classList.remove('bookmarked');
                btn.querySelector('i').className = 'far fa-bookmark';
            }
        });
    }
    
    // Handle bookmark clicks
    bookmarkButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = btn.dataset.articleId;
            
            if (bookmarkedArticles.includes(articleId)) {
                bookmarkedArticles = bookmarkedArticles.filter(id => id !== articleId);
                showNotification('Article removed from bookmarks', 'info');
            } else {
                bookmarkedArticles.push(articleId);
                showNotification('Article bookmarked!', 'success');
            }
            
            localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
            updateBookmarkStates();
        });
    });
    
    updateBookmarkStates();
}

// Social sharing functionality
function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('.social-btn, .social-btn-mini, .share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.dataset.platform;
            const articleElement = btn.closest('.content-card, .featured-article');
            const title = articleElement.querySelector('.card-title, h2')?.textContent || 'Praxis Initiative Article';
            const url = window.location.href;
            
            let shareUrl = '';
            
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article: ' + url)}`;
                    break;
            }
            
            if (shareUrl) {
                if (platform === 'email') {
                    window.location.href = shareUrl;
                } else {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
                showNotification('Sharing article...', 'info');
            }
        });
    });
}

// Tag click functionality
function initializeTagFiltering() {
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = tag.textContent;
                searchInput.dispatchEvent(new Event('input'));
                showNotification(`Filtering by "${tag.textContent}"`, 'info');
            }
        });
    });
}

// Newsletter preferences
function initializeNewsletterPreferences() {
    const preferenceOptions = document.querySelectorAll('.preference-option');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    // Handle preference selection
    preferenceOptions.forEach(option => {
        const checkbox = option.querySelector('input[type="checkbox"]');
        option.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
        });
    });
    
    // Handle form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            const frequency = newsletterForm.querySelector('select[name="frequency"]').value;
            const interests = Array.from(document.querySelectorAll('.preference-option input:checked'))
                .map(input => input.value);
            
            // Simulate newsletter subscription
            showNotification('Successfully subscribed to newsletter!', 'success');
            // Newsletter subscription processed
        });
    }
}

// Animated statistics counters for News page
function initializeNewsStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with appropriate suffix
            let displayValue = Math.floor(current);
            if (target >= 1000) {
                if (target >= 1000000) {
                    displayValue = (current / 1000000).toFixed(1) + 'M';
                } else {
                    displayValue = (current / 1000).toFixed(1) + 'K';
                }
            }
            
            element.textContent = displayValue;
        }, 16);
    };
    
    // Intersection Observer for triggering animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                let target = parseInt(text.replace(/[^\d]/g, ''));
                
                if (text.includes('K')) {
                    target *= 1000;
                } else if (text.includes('M')) {
                    target *= 1000000;
                }
                
                animateCounter(element, target);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'info':
        default:
            notification.style.background = '#007bff';
            break;
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize all News page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the News page
    if (window.location.pathname.includes('News') || document.querySelector('.news-stats')) {
        initializeNewsPage();
        initializeBookmarking();
        initializeSocialSharing();
        initializeTagFiltering();
        initializeNewsletterPreferences();
        initializeNewsStats();
    }
});


// ===== CONTACT PAGE FUNCTIONALITY =====

// Contact page initialization
function initializeContactPage() {
    initializeContactStats();
    initializeMethodSelector();
    initializeMultiStepForm();
    initializeLiveChat();
    initializeAppointmentScheduler();
    initializeFileUpload();
    initializeFormValidation();
}

// Animated statistics for Contact page
function initializeContactStats() {
    const statNumbers = document.querySelectorAll('.contact-stat .stat-number');
    
    const animateCounter = (element, target) => {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with appropriate suffix
            let displayValue = Math.floor(current);
            if (target >= 1000) {
                displayValue = (current / 1000).toFixed(1) + 'K';
            }
            
            element.textContent = displayValue;
        }, 16);
    };
    
    // Intersection Observer for triggering animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.target);
                animateCounter(element, target);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Contact method selector
function initializeMethodSelector() {
    const methodCards = document.querySelectorAll('.method-card');
    const sections = {
        form: document.getElementById('form-section'),
        chat: document.getElementById('chat-section'),
        appointment: document.getElementById('appointment-section'),
        phone: null // Phone doesn't have a section, just shows contact info
    };
    
    methodCards.forEach(card => {
        card.addEventListener('click', () => {
            const method = card.dataset.method;
            
            // Update active card
            methodCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Show/hide sections
            Object.keys(sections).forEach(key => {
                if (sections[key]) {
                    sections[key].style.display = key === method ? 'block' : 'none';
                }
            });
            
            // Special handling for phone
            if (method === 'phone') {
                // Scroll to contact info
                document.querySelector('.contact-info-section').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Multi-step form functionality
function initializeMultiStepForm() {
    const form = document.getElementById('contact-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');
    const submitBtn = document.getElementById('submit-form');
    
    let currentStep = 1;
    const totalSteps = steps.length;
    
    function updateStep(step) {
        // Hide all steps
        steps.forEach(s => s.classList.remove('active'));
        progressSteps.forEach(s => {
            s.classList.remove('active', 'completed');
        });
        
        // Show current step
        document.querySelector(`[data-step="${step}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
        
        // Mark completed steps
        for (let i = 1; i < step; i++) {
            document.querySelector(`.progress-step[data-step="${i}"]`).classList.add('completed');
        }
        
        // Update navigation buttons
        prevBtn.style.display = step > 1 ? 'block' : 'none';
        nextBtn.style.display = step < totalSteps ? 'block' : 'none';
        submitBtn.style.display = step === totalSteps ? 'block' : 'none';
        
        // Update review section if on last step
        if (step === totalSteps) {
            updateReviewSection();
        }
    }
    
    function validateStep(step) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
                
                // Additional validation
                if (field.type === 'email' && !isValidEmail(field.value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    function updateReviewSection() {
        const formData = new FormData(form);
        
        // Contact Information
        const contactReview = document.getElementById('review-contact');
        contactReview.innerHTML = `
            <div class="review-item"><span class="review-label">Name:</span> ${formData.get('firstName')} ${formData.get('lastName')}</div>
            <div class="review-item"><span class="review-label">Email:</span> ${formData.get('email')}</div>
            <div class="review-item"><span class="review-label">Phone:</span> ${formData.get('phone') || 'Not provided'}</div>
            <div class="review-item"><span class="review-label">Organization:</span> ${formData.get('organization') || 'Not provided'}</div>
        `;
        
        // Inquiry Details
        const inquiryReview = document.getElementById('review-inquiry');
        const topicSelect = document.getElementById('contact-topic');
        const urgencySelect = document.getElementById('contact-urgency');
        inquiryReview.innerHTML = `
            <div class="review-item"><span class="review-label">Topic:</span> ${topicSelect.options[topicSelect.selectedIndex].text}</div>
            <div class="review-item"><span class="review-label">Urgency:</span> ${urgencySelect.options[urgencySelect.selectedIndex].text}</div>
            <div class="review-item"><span class="review-label">Subject:</span> ${formData.get('subject')}</div>
            <div class="review-item"><span class="review-label">Message:</span> ${formData.get('message').substring(0, 100)}${formData.get('message').length > 100 ? '...' : ''}</div>
        `;
        
        // Additional Information
        const additionalReview = document.getElementById('review-additional');
        const locationSelect = document.getElementById('contact-location');
        const referralSelect = document.getElementById('contact-referral');
        additionalReview.innerHTML = `
            <div class="review-item"><span class="review-label">Location:</span> ${locationSelect.value ? locationSelect.options[locationSelect.selectedIndex].text : 'Not specified'}</div>
            <div class="review-item"><span class="review-label">How you heard about us:</span> ${referralSelect.value ? referralSelect.options[referralSelect.selectedIndex].text : 'Not specified'}</div>
            <div class="review-item"><span class="review-label">Newsletter:</span> ${formData.get('newsletter') ? 'Yes' : 'No'}</div>
            <div class="review-item"><span class="review-label">Files attached:</span> ${document.querySelectorAll('.uploaded-file').length} files</div>
        `;
    }
    
    // Navigation event listeners
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateStep(currentStep);
        }
    });
    
    prevBtn.addEventListener('click', () => {
        currentStep--;
        updateStep(currentStep);
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            // Simulate form submission
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you within 48 hours.', 'success');
                form.reset();
                currentStep = 1;
                updateStep(currentStep);
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                submitBtn.disabled = false;
                
                // Clear uploaded files
                document.getElementById('uploaded-files').innerHTML = '';
            }, 2000);
        }
    });
    
    // Initialize first step
    updateStep(currentStep);
}

// Live chat functionality
function initializeLiveChat() {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${isUser ? 'fa-user' : 'fa-user-tie'}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Auto-respond for demo
        if (isUser) {
            setTimeout(() => {
                const responses = [
                    "Thank you for your message. Let me connect you with the right team member.",
                    "I understand your inquiry. Someone from our team will be with you shortly.",
                    "That's a great question! Let me get you the information you need.",
                    "I'll make sure your request gets to the appropriate department right away."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse);
            }, 1000 + Math.random() * 2000);
        }
    }
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
        }
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.dataset.message;
            addMessage(message, true);
        });
    });
}

// Appointment scheduling functionality
function initializeAppointmentScheduler() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const timeSlots = document.querySelectorAll('.time-slot');
    const bookBtn = document.getElementById('book-appointment');
    
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    function generateCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.textAlign = 'center';
            dayHeader.style.padding = '0.5rem';
            dayHeader.style.color = 'var(--primary-color)';
            calendarGrid.appendChild(dayHeader);
        });
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.className = 'calendar-day';
            
            const dayDate = new Date(year, month, day);
            const today = new Date();
            
            // Mark as available if it's a future weekday
            if (dayDate > today && dayDate.getDay() !== 0 && dayDate.getDay() !== 6) {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', () => selectDate(dayDate, dayElement));
            } else {
                dayElement.classList.add('unavailable');
            }
            
            calendarGrid.appendChild(dayElement);
        }
        
        currentMonthElement.textContent = `${months[month]} ${year}`;
    }
    
    function selectDate(date, element) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Select new date
        element.classList.add('selected');
        selectedDate = date;
        
        // Update time slots availability (simulate some being unavailable)
        timeSlots.forEach((slot, index) => {
            slot.classList.remove('selected', 'unavailable');
            if (Math.random() > 0.7) { // 30% chance of being unavailable
                slot.classList.add('unavailable');
            }
        });
        
        updateBookButton();
    }
    
    function selectTime(timeElement) {
        if (timeElement.classList.contains('unavailable')) return;
        
        // Remove previous selection
        timeSlots.forEach(slot => slot.classList.remove('selected'));
        
        // Select new time
        timeElement.classList.add('selected');
        selectedTime = timeElement.dataset.time;
        
        updateBookButton();
    }
    
    function updateBookButton() {
        bookBtn.disabled = !(selectedDate && selectedTime);
    }
    
    // Event listeners
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => selectTime(slot));
    });
    
    bookBtn.addEventListener('click', () => {
        if (selectedDate && selectedTime) {
            const appointmentType = document.getElementById('appointment-type').value;
            const notes = document.getElementById('appointment-notes').value;
            
            // Simulate booking
            bookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            bookBtn.disabled = true;
            
            setTimeout(() => {
                const dateString = selectedDate.toLocaleDateString();
                const timeString = selectedTime;
                showNotification(`Appointment booked for ${dateString} at ${timeString}. You'll receive a confirmation email shortly.`, 'success');
                
                // Reset form
                selectedDate = null;
                selectedTime = null;
                document.querySelectorAll('.calendar-day.selected, .time-slot.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                document.getElementById('appointment-notes').value = '';
                
                bookBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Book Appointment';
                updateBookButton();
            }, 2000);
        }
    });
    
    // Initialize calendar
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

// File upload functionality
function initializeFileUpload() {
    const fileInput = document.getElementById('contact-files');
    const uploadArea = document.getElementById('file-upload-area');
    const uploadedFiles = document.getElementById('uploaded-files');
    const uploadLink = uploadArea.querySelector('.upload-link');
    
    let files = [];
    
    function handleFiles(fileList) {
        Array.from(fileList).forEach(file => {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                showNotification(`File "${file.name}" is too large. Maximum size is 10MB.`, 'error');
                return;
            }
            
            if (files.find(f => f.name === file.name)) {
                showNotification(`File "${file.name}" is already uploaded.`, 'error');
                return;
            }
            
            files.push(file);
            addFileToList(file);
        });
    }
    
    function addFileToList(file) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'uploaded-file';
        
        const fileSize = (file.size / 1024).toFixed(1) + ' KB';
        if (file.size > 1024 * 1024) {
            fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        }
        
        fileDiv.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file file-icon"></i>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
            <button type="button" class="remove-file" data-filename="${file.name}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        uploadedFiles.appendChild(fileDiv);
        
        // Add remove functionality
        fileDiv.querySelector('.remove-file').addEventListener('click', () => {
            files = files.filter(f => f.name !== file.name);
            fileDiv.remove();
        });
    }
    
    // Event listeners
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        e.target.value = ''; // Reset input
    });
    
    uploadLink.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

// Form validation functionality
function initializeFormValidation() {
    const messageTextarea = document.getElementById('contact-message');
    const characterCount = document.querySelector('.character-count');
    
    // Character count for message
    if (messageTextarea && characterCount) {
        const maxLength = 2000;
        const currentSpan = characterCount.querySelector('.current');
        
        messageTextarea.addEventListener('input', () => {
            const length = messageTextarea.value.length;
            currentSpan.textContent = length;
            
            characterCount.classList.remove('warning', 'error');
            if (length > maxLength * 0.8) {
                characterCount.classList.add('warning');
            }
            if (length > maxLength) {
                characterCount.classList.add('error');
                messageTextarea.value = messageTextarea.value.substring(0, maxLength);
                currentSpan.textContent = maxLength;
            }
        });
    }
    
    // Real-time validation for all inputs
    const inputs = document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

// Utility functions
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    } else if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        message = 'Please enter a valid phone number';
    }
    
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, message);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const validation = field.parentNode.querySelector('.field-validation');
    if (validation) {
        validation.textContent = message;
        validation.className = 'field-validation error';
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const validation = field.parentNode.querySelector('.field-validation');
    if (validation) {
        validation.textContent = '';
        validation.className = 'field-validation';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Initialize Contact page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the Contact page
    if (window.location.pathname.includes('Contact') || document.querySelector('.contact-stats')) {
        initializeContactPage();
    }
});



// ===== 4A PRISON OVERSIGHT PAGE FUNCTIONALITY =====

// Expandable Card Functionality
function toggleCardExpansion(button) {
    const card = button.closest('.expandable-card');
    const isExpanded = card.classList.contains('expanded');
    
    if (isExpanded) {
        card.classList.remove('expanded');
        button.textContent = 'Learn More';
    } else {
        card.classList.add('expanded');
        button.textContent = 'Show Less';
    }
}

// Social Sharing Functionality
function shareAdvocacy() {
    const url = window.location.href;
    const title = 'Support Independent Prison Oversight in Arizona';
    const text = 'Arizona needs independent oversight of its prison system. 34,500+ people deserve transparency and accountability. #PrisonOversight #CriminalJusticeReform';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(console.error);
    } else {
        // Fallback to Twitter sharing
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }
}

// Newsletter Signup Functionality
function handleNewsletterSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.email.value;
    const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call (replace with actual integration)
    setTimeout(() => {
        alert(`Thank you for subscribing! You'll receive updates about: ${interests.join(', ')}`);
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Enhanced Animated Counters for Prison Oversight Page
function initializePrisonOversightCounters() {
    const counters = document.querySelectorAll('.animated-counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format the number
        let displayValue;
        if (target >= 1000 && target < 1000000) {
            displayValue = (current / 1000).toFixed(1) + 'K';
        } else if (target >= 1000000) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (target < 1) {
            displayValue = current.toFixed(1);
        } else {
            displayValue = Math.floor(current).toLocaleString();
        }
        
        element.textContent = prefix + displayValue + suffix;
        
        // Add special formatting for specific values
        if (target === 34500) {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        } else if (target === 1.5) {
            element.textContent = '$' + current.toFixed(1) + 'B';
        } else if (target === 0) {
            element.textContent = '0';
        }
    }, 16);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize prison oversight specific functionality
    if (window.location.pathname.includes('4A') || window.location.pathname.includes('prison_oversight')) {
        initializePrisonOversightCounters();
        
        // Add smooth scrolling for newsletter signup link
        const newsletterLink = document.querySelector('a[href="#newsletter-signup"]');
        if (newsletterLink) {
            newsletterLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector('#newsletter-signup');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }
});


// ===== 4B CRIMINAL LEGAL REFORM PAGE FUNCTIONALITY =====

// Six Ps Framework Data
const sixPsData = {
    police: {
        title: "Police Reform",
        icon: "👮",
        description: "Comprehensive police accountability and community-centered approaches",
        details: [
            "Community policing initiatives that build trust between law enforcement and communities",
            "Bias training and cultural competency programs for all officers",
            "Body camera requirements and transparency in police misconduct investigations",
            "De-escalation training and mental health crisis intervention protocols",
            "Civilian oversight boards with meaningful authority to investigate complaints"
        ],
        impact: "Studies show community policing reduces crime by 15-20% while improving police-community relations",
        reforms: [
            "Mandatory bias training for all officers",
            "Community oversight of police departments",
            "Investment in mental health crisis response teams",
            "Transparency in use of force incidents"
        ]
    },
    prosecution: {
        title: "Prosecutorial Reform",
        icon: "⚖️",
        description: "Promoting fairness, transparency, and accountability in prosecutorial decisions",
        details: [
            "Prosecutorial discretion guidelines to ensure consistent and fair charging decisions",
            "Transparency in plea bargaining processes and charging guidelines",
            "Conviction integrity units to review potential wrongful convictions",
            "Data collection on prosecutorial decisions to identify disparities",
            "Training on implicit bias and cultural competency for prosecutors"
        ],
        impact: "Prosecutorial reforms can reduce wrongful convictions by 40% and improve case outcomes",
        reforms: [
            "Open file discovery policies",
            "Conviction integrity units in all jurisdictions",
            "Regular training on bias and ethics",
            "Public reporting on prosecutorial metrics"
        ]
    },
    pretrial: {
        title: "Pretrial Justice",
        icon: "🏛️",
        description: "Ensuring fair and effective pretrial processes that don't penalize poverty",
        details: [
            "Risk assessment tools to guide pretrial detention decisions",
            "Alternatives to cash bail that don't discriminate based on wealth",
            "Pretrial services including supervision and support programs",
            "Speedy trial protections to minimize time in pretrial detention",
            "Court reminder systems to reduce failure to appear rates"
        ],
        impact: "Pretrial reform reduces jail populations by 25-30% while maintaining public safety",
        reforms: [
            "Eliminate cash bail for non-violent offenses",
            "Expand pretrial services and supervision",
            "Implement risk assessment tools",
            "Strengthen speedy trial protections"
        ]
    },
    probation: {
        title: "Probation Reform",
        icon: "📋",
        description: "Evidence-based supervision focused on support and successful outcomes",
        details: [
            "Evidence-based supervision practices that reduce recidivism",
            "Graduated sanctions that provide alternatives to revocation",
            "Support services including job training, education, and mental health treatment",
            "Reduced caseloads to allow for meaningful supervision and support",
            "Performance metrics focused on successful completion rather than violations"
        ],
        impact: "Evidence-based probation reduces recidivism by 30% and improves completion rates",
        reforms: [
            "Implement evidence-based supervision practices",
            "Expand support services for probationers",
            "Reduce probation officer caseloads",
            "Focus on successful completion rather than violations"
        ]
    },
    prison: {
        title: "Prison Reform",
        icon: "🏢",
        description: "Humane conditions and effective rehabilitation programming",
        details: [
            "Evidence-based rehabilitation programs including education and job training",
            "Mental health and substance abuse treatment programs",
            "Humane living conditions that meet constitutional standards",
            "Family visitation and communication programs to maintain community ties",
            "Preparation for reentry beginning on day one of incarceration"
        ],
        impact: "Comprehensive prison programming reduces recidivism by 35% and improves reentry outcomes",
        reforms: [
            "Expand education and job training programs",
            "Improve mental health and substance abuse treatment",
            "Ensure humane living conditions",
            "Strengthen family connection programs"
        ]
    },
    parole: {
        title: "Parole & Reentry",
        icon: "🚪",
        description: "Comprehensive reentry support for successful community integration",
        details: [
            "Comprehensive reentry planning beginning before release",
            "Housing assistance and transitional housing programs",
            "Job placement services and employer engagement programs",
            "Mental health and substance abuse treatment continuation",
            "Family reunification and community support programs"
        ],
        impact: "Comprehensive reentry support reduces recidivism by 40% and improves employment outcomes",
        reforms: [
            "Expand transitional housing programs",
            "Strengthen job placement services",
            "Improve access to healthcare and treatment",
            "Remove barriers to employment and housing"
        ]
    }
};

// Timeline Era Data
const timelineData = {
    copper: {
        title: "Copper Time Era (Pre-1978)",
        years: "Pre-1978",
        description: "Arizona's original approach to criminal justice emphasized rehabilitation and individualized treatment",
        characteristics: [
            "Indeterminate sentencing allowed for individualized justice",
            "Early release based on rehabilitation progress and good behavior",
            "Lower incarceration rates with focus on treatment and reintegration",
            "Judicial discretion in sentencing decisions",
            "Emphasis on rehabilitation over punishment"
        ],
        outcomes: [
            "Lower prison populations and costs",
            "Higher successful reintegration rates",
            "More individualized approach to justice",
            "Greater judicial flexibility in sentencing"
        ],
        transition: "Growing concerns about sentencing disparities and public safety led to calls for more structured approaches"
    },
    oldcode: {
        title: "Old Code Era (1978-1993)",
        years: "1978-1993",
        description: "Transitional period with structured sentencing guidelines balancing accountability and rehabilitation",
        characteristics: [
            "Structured sentencing guidelines with some judicial discretion",
            "Balanced approach between accountability and rehabilitation",
            "Moderate growth in incarceration rates",
            "Introduction of more systematic sentencing practices",
            "Continued focus on rehabilitation programming"
        ],
        outcomes: [
            "More consistent sentencing practices",
            "Moderate increase in prison populations",
            "Maintained rehabilitation focus",
            "Balanced approach to public safety and individual needs"
        ],
        transition: "Public pressure for tougher sentences and 'truth in sentencing' led to major policy changes in 1994"
    },
    truth: {
        title: "Truth-in-Sentencing Era (1994-Present)",
        years: "1994-Present",
        description: "Mandatory minimum sentences and reduced discretion created current mass incarceration crisis",
        characteristics: [
            "Mandatory minimum sentences with limited judicial discretion",
            "Truth-in-sentencing requiring 85% of sentence to be served",
            "Dramatic increase in prison population and costs",
            "Reduced focus on rehabilitation programming",
            "Limited opportunities for early release"
        ],
        outcomes: [
            "Prison population increased by 300%+",
            "Annual corrections costs rose to $1.5 billion",
            "Higher recidivism rates due to limited programming",
            "Disproportionate impact on communities of color",
            "Overcrowding and constitutional violations"
        ],
        reform_needs: [
            "Restore judicial discretion in sentencing",
            "Expand rehabilitation and education programs",
            "Implement evidence-based sentencing practices",
            "Address racial and economic disparities",
            "Focus on successful reentry and community safety"
        ]
    }
};

// Show Six Ps Details
function showPsDetails(psType) {
    const data = sixPsData[psType];
    if (!data) return;
    
    const modal = document.getElementById('ps-modal');
    const content = document.getElementById('ps-details-content');
    
    content.innerHTML = `
        <div class="ps-detail-header">
            <div class="ps-detail-icon">${data.icon}</div>
            <h2>${data.title}</h2>
            <p class="ps-detail-description">${data.description}</p>
        </div>
        
        <div class="ps-detail-section">
            <h3>Key Reform Areas</h3>
            <ul class="ps-detail-list">
                ${data.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        </div>
        
        <div class="ps-detail-section">
            <h3>Evidence-Based Impact</h3>
            <p class="ps-impact">${data.impact}</p>
        </div>
        
        <div class="ps-detail-section">
            <h3>Specific Reforms Needed</h3>
            <ul class="ps-reform-list">
                ${data.reforms.map(reform => `<li>${reform}</li>`).join('')}
            </ul>
        </div>
        
        <div class="ps-detail-actions">
            <button class="btn btn-primary" onclick="shareReform('${psType}')">Share This Reform</button>
            <button class="btn btn-outline" onclick="closePsModal()">Close</button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Six Ps Modal
function closePsModal() {
    const modal = document.getElementById('ps-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show Era Details
function showEraDetails(eraType) {
    const data = timelineData[eraType];
    if (!data) return;
    
    const modal = document.getElementById('era-modal');
    const content = document.getElementById('era-details-content');
    
    let reformSection = '';
    if (data.reform_needs) {
        reformSection = `
            <div class="era-detail-section">
                <h3>Reform Priorities</h3>
                <ul class="era-reform-list">
                    ${data.reform_needs.map(reform => `<li>${reform}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    content.innerHTML = `
        <div class="era-detail-header">
            <h2>${data.title}</h2>
            <p class="era-detail-years">${data.years}</p>
            <p class="era-detail-description">${data.description}</p>
        </div>
        
        <div class="era-detail-section">
            <h3>Key Characteristics</h3>
            <ul class="era-detail-list">
                ${data.characteristics.map(char => `<li>${char}</li>`).join('')}
            </ul>
        </div>
        
        <div class="era-detail-section">
            <h3>Outcomes & Impact</h3>
            <ul class="era-outcome-list">
                ${data.outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
            </ul>
        </div>
        
        ${reformSection}
        
        ${data.transition ? `
            <div class="era-detail-section">
                <h3>Historical Transition</h3>
                <p class="era-transition">${data.transition}</p>
            </div>
        ` : ''}
        
        <div class="era-detail-actions">
            <button class="btn btn-primary" onclick="shareTimeline('${eraType}')">Share This History</button>
            <button class="btn btn-outline" onclick="closeEraModal()">Close</button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Era Modal
function closeEraModal() {
    const modal = document.getElementById('era-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Share Reform Function
function shareReform(psType) {
    const data = sixPsData[psType];
    const url = window.location.href;
    const text = `Learn about ${data.title} - ${data.description} #CriminalJusticeReform #${psType.charAt(0).toUpperCase() + psType.slice(1)}Reform`;
    
    if (navigator.share) {
        navigator.share({
            title: data.title,
            text: text,
            url: url
        }).catch(console.error);
    } else {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }
}

// Share Timeline Function
function shareTimeline(eraType) {
    const data = timelineData[eraType];
    const url = window.location.href;
    const text = `Understanding Arizona's sentencing history: ${data.title} - ${data.description} #CriminalJusticeReform #SentencingReform`;
    
    if (navigator.share) {
        navigator.share({
            title: data.title,
            text: text,
            url: url
        }).catch(console.error);
    } else {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }
}

// Initialize Criminal Legal Reform Page
function initializeCriminalLegalReformPage() {
    // Initialize animated counters
    const counters = document.querySelectorAll('.animated-counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateReformCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        const psModal = document.getElementById('ps-modal');
        const eraModal = document.getElementById('era-modal');
        
        if (event.target === psModal) {
            closePsModal();
        }
        if (event.target === eraModal) {
            closeEraModal();
        }
    };
}

function animateReformCounter(element) {
    const target = parseFloat(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    const duration = 2000;
    const increment = target / (duration / 16);
    
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (target === 96) {
            displayValue = Math.floor(current) + '%';
        } else if (target === 1.5) {
            displayValue = '$' + current.toFixed(1) + 'B';
        } else if (target === 30) {
            displayValue = Math.floor(current) + '+ Years';
        }
        
        element.textContent = prefix + displayValue + suffix;
    }, 16);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('4B') || window.location.pathname.includes('criminal_legal_reform')) {
        initializeCriminalLegalReformPage();
    }
});


// ===== 4C DRUG POLICY PAGE FUNCTIONALITY =====

// Naloxone Distribution Sites Data
const naloxoneLocations = [
    {
        name: "Phoenix Community Health Center",
        address: "1234 Central Ave, Phoenix, AZ 85007",
        phone: "(602) 555-0123",
        hours: "Mon-Fri 8AM-6PM, Sat 9AM-3PM",
        services: ["Free naloxone kits", "Training sessions", "Overdose prevention education"],
        type: "health-center"
    },
    {
        name: "Tucson Harm Reduction Coalition",
        address: "567 Stone Ave, Tucson, AZ 85701",
        phone: "(520) 555-0456",
        hours: "Mon-Fri 10AM-7PM, Sat-Sun 12PM-5PM",
        services: ["Naloxone distribution", "Syringe exchange", "Peer support"],
        type: "harm-reduction"
    },
    {
        name: "Mesa Fire Department",
        address: "Multiple locations throughout Mesa",
        phone: "(480) 555-0789",
        hours: "24/7 Emergency Services",
        services: ["Emergency naloxone", "First responder training", "Community education"],
        type: "emergency"
    },
    {
        name: "Flagstaff Community Pharmacy",
        address: "890 Route 66, Flagstaff, AZ 86001",
        phone: "(928) 555-0321",
        hours: "Mon-Sat 9AM-8PM, Sun 10AM-6PM",
        services: ["Naloxone prescription", "Insurance coverage assistance", "Usage training"],
        type: "pharmacy"
    }
];

// Treatment Centers Data
const treatmentCenters = [
    {
        name: "Arizona Addiction Recovery Center",
        address: "1111 Recovery Way, Phoenix, AZ 85008",
        phone: "(602) 555-1111",
        services: ["Methadone", "Buprenorphine", "Naltrexone", "Counseling"],
        insurance: ["Medicaid", "Private Insurance", "Self-Pay"],
        availability: "Accepting new patients",
        type: "comprehensive"
    },
    {
        name: "Desert Hope Treatment Center",
        address: "2222 Hope Blvd, Tucson, AZ 85702",
        phone: "(520) 555-2222",
        services: ["Outpatient MAT", "Group therapy", "Individual counseling"],
        insurance: ["Most insurance accepted"],
        availability: "Waitlist available",
        type: "outpatient"
    },
    {
        name: "Mountain View Recovery",
        address: "3333 Summit Dr, Flagstaff, AZ 86002",
        phone: "(928) 555-3333",
        services: ["Residential treatment", "Detox", "MAT", "Aftercare"],
        insurance: ["Private insurance", "Self-pay"],
        availability: "Call for availability",
        type: "residential"
    }
];

// Arizona Overdose Data (simulated)
const overdoseData = {
    statewide: {
        total2023: 2347,
        increase: "12% from 2022",
        fentanylRelated: "78%",
        demographics: {
            "18-25": "15%",
            "26-35": "32%",
            "36-45": "28%",
            "46-55": "18%",
            "56+": "7%"
        }
    },
    counties: [
        { name: "Maricopa", deaths: 1456, rate: "32.1 per 100k", trend: "↑ 15%" },
        { name: "Pima", deaths: 287, rate: "27.8 per 100k", trend: "↑ 8%" },
        { name: "Pinal", deaths: 156, rate: "35.2 per 100k", trend: "↑ 22%" },
        { name: "Yavapai", deaths: 89, rate: "38.1 per 100k", trend: "↑ 18%" },
        { name: "Mohave", deaths: 78, rate: "36.4 per 100k", trend: "↑ 12%" }
    ]
};

// Crisis Resources Data
const crisisResources = [
    {
        name: "National Suicide Prevention Lifeline",
        number: "988",
        description: "24/7 crisis support and suicide prevention",
        type: "national"
    },
    {
        name: "Arizona Crisis Line",
        number: "1-844-746-8181",
        description: "Statewide mental health and substance use crisis support",
        type: "state"
    },
    {
        name: "Crisis Response Network",
        number: "(602) 222-9444",
        description: "Mobile crisis teams and emergency mental health services",
        type: "local"
    },
    {
        name: "SAMHSA National Helpline",
        number: "1-800-662-4357",
        description: "Treatment referral and information service",
        type: "national"
    }
];

// Open Naloxone Locator
function openNaloxoneLocator() {
    const modal = document.getElementById('naloxone-modal');
    const content = document.getElementById('naloxone-content');
    
    content.innerHTML = `
        <div class="resource-header">
            <h2>🏥 Naloxone Distribution Sites</h2>
            <p>Find free naloxone (Narcan) near you. All locations provide training on proper usage.</p>
        </div>
        
        <div class="location-search">
            <input type="text" id="location-search" placeholder="Enter your city or ZIP code" class="search-input">
            <button onclick="searchNaloxoneLocations()" class="search-btn">Search</button>
        </div>
        
        <div class="locations-grid">
            ${naloxoneLocations.map(location => `
                <div class="location-card ${location.type}">
                    <h4>${location.name}</h4>
                    <p class="address">📍 ${location.address}</p>
                    <p class="phone">📞 ${location.phone}</p>
                    <p class="hours">🕒 ${location.hours}</p>
                    <div class="services">
                        <h5>Services:</h5>
                        <ul>
                            ${location.services.map(service => `<li>${service}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="contact-btn" onclick="contactLocation('${location.phone}')">Contact Now</button>
                </div>
            `).join('')}
        </div>
        
        <div class="emergency-notice">
            <h4>🚨 Emergency Overdose Response</h4>
            <p><strong>Call 911 immediately</strong> if someone is experiencing an overdose. Naloxone is a temporary reversal - professional medical attention is always required.</p>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Treatment Finder
function openTreatmentFinder() {
    const modal = document.getElementById('treatment-modal');
    const content = document.getElementById('treatment-content');
    
    content.innerHTML = `
        <div class="resource-header">
            <h2>🏥 Treatment Center Finder</h2>
            <p>Find medication-assisted treatment (MAT) and recovery services in Arizona.</p>
        </div>
        
        <div class="treatment-filters">
            <select id="treatment-type" class="filter-select">
                <option value="all">All Treatment Types</option>
                <option value="comprehensive">Comprehensive Care</option>
                <option value="outpatient">Outpatient Only</option>
                <option value="residential">Residential Treatment</option>
            </select>
            <select id="insurance-type" class="filter-select">
                <option value="all">All Insurance Types</option>
                <option value="medicaid">Medicaid</option>
                <option value="private">Private Insurance</option>
                <option value="self-pay">Self-Pay</option>
            </select>
        </div>
        
        <div class="treatment-centers">
            ${treatmentCenters.map(center => `
                <div class="treatment-card ${center.type}">
                    <h4>${center.name}</h4>
                    <p class="address">📍 ${center.address}</p>
                    <p class="phone">📞 ${center.phone}</p>
                    <div class="services">
                        <h5>Services Available:</h5>
                        <div class="service-tags">
                            ${center.services.map(service => `<span class="service-tag">${service}</span>`).join('')}
                        </div>
                    </div>
                    <div class="insurance">
                        <h5>Insurance Accepted:</h5>
                        <p>${center.insurance.join(', ')}</p>
                    </div>
                    <div class="availability">
                        <span class="availability-status">${center.availability}</span>
                    </div>
                    <button class="contact-btn" onclick="contactTreatmentCenter('${center.phone}')">Call Now</button>
                </div>
            `).join('')}
        </div>
        
        <div class="treatment-notice">
            <h4>💡 Getting Started with Treatment</h4>
            <p>Most treatment centers offer free consultations. Don't let insurance concerns prevent you from calling - many centers have financial assistance programs.</p>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Overdose Data Map
function openOverdoseDataMap() {
    const modal = document.getElementById('overdose-data-modal');
    const content = document.getElementById('overdose-data-content');
    
    content.innerHTML = `
        <div class="resource-header">
            <h2>📊 Arizona Overdose Data Dashboard</h2>
            <p>Understanding the scope and trends of the overdose crisis in Arizona.</p>
        </div>
        
        <div class="data-summary">
            <div class="data-card">
                <h3>${overdoseData.statewide.total2023.toLocaleString()}</h3>
                <p>Total overdose deaths in 2023</p>
            </div>
            <div class="data-card">
                <h3>${overdoseData.statewide.increase}</h3>
                <p>Increase from previous year</p>
            </div>
            <div class="data-card">
                <h3>${overdoseData.statewide.fentanylRelated}</h3>
                <p>Involved fentanyl</p>
            </div>
        </div>
        
        <div class="county-data">
            <h4>Deaths by County (2023)</h4>
            <div class="county-grid">
                ${overdoseData.counties.map(county => `
                    <div class="county-card">
                        <h5>${county.name} County</h5>
                        <p class="deaths">${county.deaths} deaths</p>
                        <p class="rate">${county.rate}</p>
                        <p class="trend ${county.trend.includes('↑') ? 'increasing' : 'decreasing'}">${county.trend}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="demographics">
            <h4>Age Demographics</h4>
            <div class="demo-chart">
                ${Object.entries(overdoseData.statewide.demographics).map(([age, percent]) => `
                    <div class="demo-bar">
                        <span class="age-group">${age}</span>
                        <div class="bar-container">
                            <div class="bar" style="width: ${percent}"></div>
                        </div>
                        <span class="percentage">${percent}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="data-source">
            <p><em>Data source: Arizona Department of Health Services, 2023 Overdose Surveillance Report</em></p>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Crisis Resources
function openCrisisResources() {
    const modal = document.getElementById('crisis-modal');
    const content = document.getElementById('crisis-content');
    
    content.innerHTML = `
        <div class="resource-header">
            <h2>🚨 Crisis Intervention Resources</h2>
            <p>Immediate help for overdose emergencies, mental health crises, and substance use support.</p>
        </div>
        
        <div class="emergency-alert">
            <h3>🚨 EMERGENCY: Call 911</h3>
            <p>If someone is unconscious, not breathing, or in immediate danger, call 911 immediately.</p>
        </div>
        
        <div class="crisis-hotlines">
            <h4>24/7 Crisis Hotlines</h4>
            ${crisisResources.map(resource => `
                <div class="hotline-card ${resource.type}">
                    <h5>${resource.name}</h5>
                    <p class="hotline-number">${resource.number}</p>
                    <p class="description">${resource.description}</p>
                    <button class="call-btn" onclick="callHotline('${resource.number}')">Call Now</button>
                </div>
            `).join('')}
        </div>
        
        <div class="overdose-response">
            <h4>Overdose Response Steps</h4>
            <ol class="response-steps">
                <li><strong>Call 911</strong> - Always call emergency services first</li>
                <li><strong>Administer naloxone</strong> - If available, give naloxone (Narcan)</li>
                <li><strong>Rescue breathing</strong> - Provide rescue breaths if trained</li>
                <li><strong>Stay with person</strong> - Monitor until help arrives</li>
                <li><strong>Be prepared to repeat</strong> - Naloxone effects are temporary</li>
            </ol>
        </div>
        
        <div class="good-samaritan">
            <h4>🛡️ Good Samaritan Law Protection</h4>
            <p>Arizona's Good Samaritan Law protects people who call for help during an overdose from prosecution for drug possession.</p>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Harm Reduction Kit
function openHarmReductionKit() {
    // Simulate download
    const downloads = [
        "Overdose Prevention Guide.pdf",
        "Naloxone Administration Instructions.pdf",
        "Safe Use Guidelines.pdf",
        "Treatment Resource Directory.pdf",
        "Family Support Guide.pdf"
    ];
    
    alert(`Downloading Harm Reduction Toolkit:\n\n${downloads.join('\n')}\n\nFiles will be saved to your Downloads folder.`);
}

// Open Policy Tracker
function openPolicyTracker() {
    alert("Policy Tracker: This feature would connect to a live database of current Arizona drug policy legislation, reform bills, and advocacy opportunities. Contact Praxis Initiative for the latest policy updates.");
}

// Close Resource Modal
function closeResourceModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Contact Functions
function contactLocation(phone) {
    window.open(`tel:${phone}`, '_self');
}

function contactTreatmentCenter(phone) {
    window.open(`tel:${phone}`, '_self');
}

function callHotline(number) {
    window.open(`tel:${number}`, '_self');
}

// Search Functions
function searchNaloxoneLocations() {
    const searchTerm = document.getElementById('location-search').value.toLowerCase();
    // In a real implementation, this would filter results
    alert(`Searching for naloxone locations near: ${searchTerm}\n\nIn a live version, this would show filtered results based on your location.`);
}

// Drug Policy Sharing
function shareDrugPolicy() {
    const url = window.location.href;
    const title = 'Support Evidence-Based Drug Policy Reform in Arizona';
    const text = 'Arizona needs evidence-based drug policy that treats addiction as a health issue, not a crime. Join the movement for harm reduction and overdose prevention. #DrugPolicyReform #HarmReduction';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(console.error);
    } else {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }
}

// Newsletter Signup
function handleDrugPolicyNewsletter(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.email.value;
    const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert(`Thank you for subscribing to drug policy updates!\n\nYou'll receive information about: ${interests.join(', ')}`);
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Initialize Drug Policy Page
function initializeDrugPolicyPage() {
    // Initialize animated counters
    const counters = document.querySelectorAll('.animated-counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateDrugPolicyCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = ['naloxone-modal', 'treatment-modal', 'overdose-data-modal', 'crisis-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (event.target === modal) {
                closeResourceModal(modalId);
            }
        });
    };
    
    // Add smooth scrolling for newsletter link
    const newsletterLink = document.querySelector('a[href="#drug-policy-newsletter"]');
    if (newsletterLink) {
        newsletterLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#drug-policy-newsletter');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

function animateDrugPolicyCounter(element) {
    const target = parseFloat(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    const duration = 2000;
    const increment = target / (duration / 16);
    
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue;
        if (target === 107000) {
            displayValue = Math.floor(current).toLocaleString();
        } else if (target === 80) {
            displayValue = Math.floor(current) + '%';
        } else if (target === 2300) {
            displayValue = Math.floor(current).toLocaleString() + '+';
        } else {
            displayValue = Math.floor(current);
        }
        
        element.textContent = prefix + displayValue + suffix;
    }, 16);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('4C') || window.location.pathname.includes('drug_policy')) {
        initializeDrugPolicyPage();
    }
});


// ===== 4D CIVIC ENGAGEMENT PAGE FUNCTIONALITY =====

// Arizona Representatives Data
const arizonaRepresentatives = [
    {
        name: "Mark Kelly",
        title: "U.S. Senator",
        party: "Democrat",
        phone: "(202) 224-2235",
        email: "https://www.kelly.senate.gov/contact",
        office: "516 Hart Senate Office Building",
        photo: "👨‍💼"
    },
    {
        name: "Kyrsten Sinema",
        title: "U.S. Senator", 
        party: "Independent",
        phone: "(202) 224-4521",
        email: "https://www.sinema.senate.gov/contact",
        office: "317 Hart Senate Office Building",
        photo: "👩‍💼"
    },
    {
        name: "Katie Hobbs",
        title: "Governor",
        party: "Democrat",
        phone: "(602) 542-4331",
        email: "https://azgovernor.gov/contact",
        office: "1700 W Washington St, Phoenix, AZ",
        photo: "👩‍⚖️"
    }
];

// Current Arizona Criminal Justice Bills (simulated data)
const currentBills = [
    {
        number: "HB 2234",
        title: "Criminal Justice Reform and Sentencing Guidelines",
        description: "Reforms mandatory minimum sentencing laws and expands judicial discretion in non-violent offenses.",
        status: "committee",
        committee: "House Judiciary Committee",
        sponsor: "Rep. Jennifer Longdon",
        lastAction: "Referred to committee on March 15, 2024",
        category: "sentencing"
    },
    {
        number: "SB 1456",
        title: "Prison Oversight and Transparency Act",
        description: "Establishes independent oversight board for Arizona Department of Corrections.",
        status: "introduced",
        committee: "Senate Government Committee",
        sponsor: "Sen. Martin Quezada",
        lastAction: "Introduced February 28, 2024",
        category: "oversight"
    },
    {
        number: "HB 2567",
        title: "Reentry Services Expansion",
        description: "Expands funding for job training, housing assistance, and mental health services for formerly incarcerated individuals.",
        status: "passed",
        committee: "House Appropriations",
        sponsor: "Rep. Cesar Chavez",
        lastAction: "Passed House 35-25 on April 2, 2024",
        category: "reentry"
    },
    {
        number: "SB 1789",
        title: "Drug Policy Reform Initiative",
        description: "Decriminalizes personal use quantities of controlled substances and expands treatment options.",
        status: "committee",
        committee: "Senate Health Committee",
        sponsor: "Sen. Rebecca Rios",
        lastAction: "Committee hearing scheduled April 18, 2024",
        category: "drug-policy"
    },
    {
        number: "HB 2890",
        title: "Voting Rights Restoration",
        description: "Automatically restores voting rights upon release from incarceration for non-violent felonies.",
        status: "introduced",
        committee: "House Elections Committee",
        sponsor: "Rep. Athena Salman",
        lastAction: "Introduced March 22, 2024",
        category: "voting-rights"
    }
];

// Volunteer Opportunities Data
const volunteerOpportunities = [
    {
        title: "Policy Research Assistant",
        organization: "Praxis Initiative",
        description: "Help research criminal justice policies and prepare briefing materials for advocacy campaigns.",
        timeCommitment: "5-10 hours/week",
        location: "Remote/Phoenix",
        skills: ["Research", "Writing", "Data Analysis"],
        category: "research",
        contact: "volunteer@praxisinitiative.org"
    },
    {
        title: "Community Outreach Coordinator",
        organization: "Arizona Justice Project",
        description: "Organize community events and educational workshops about criminal justice reform.",
        timeCommitment: "10-15 hours/week",
        location: "Phoenix Metro",
        skills: ["Event Planning", "Public Speaking", "Community Organizing"],
        category: "outreach",
        contact: "outreach@azjustice.org"
    },
    {
        title: "Legislative Testimony Trainer",
        organization: "Voices for Justice Coalition",
        description: "Train formerly incarcerated individuals to provide effective testimony at legislative hearings.",
        timeCommitment: "Weekend workshops",
        location: "Phoenix/Tucson",
        skills: ["Public Speaking", "Training", "Lived Experience"],
        category: "training",
        contact: "training@voicesforjustice.org"
    },
    {
        title: "Digital Advocacy Specialist",
        organization: "Reform Arizona Now",
        description: "Manage social media campaigns and online advocacy efforts for criminal justice reform.",
        timeCommitment: "8-12 hours/week",
        location: "Remote",
        skills: ["Social Media", "Digital Marketing", "Content Creation"],
        category: "digital",
        contact: "digital@reformaznow.org"
    },
    {
        title: "Reentry Mentor",
        organization: "Second Chance Arizona",
        description: "Provide one-on-one mentoring and support for individuals transitioning from incarceration.",
        timeCommitment: "4-6 hours/week",
        location: "Statewide",
        skills: ["Mentoring", "Lived Experience", "Empathy"],
        category: "mentoring",
        contact: "mentors@secondchanceaz.org"
    }
];

// Training Events Data
const upcomingEvents = [
    {
        title: "Advocacy 101: Making Your Voice Heard",
        date: "2024-05-15",
        time: "6:00 PM - 8:00 PM",
        location: "Phoenix Community Center",
        description: "Learn the basics of effective advocacy and how to contact your representatives.",
        type: "training"
    },
    {
        title: "Legislative Session Preview",
        date: "2024-05-22",
        time: "7:00 PM - 9:00 PM",
        location: "Virtual Event",
        description: "Preview of upcoming criminal justice bills and how to get involved.",
        type: "information"
    },
    {
        title: "Public Speaking Workshop",
        date: "2024-06-05",
        time: "10:00 AM - 4:00 PM",
        location: "Tucson Public Library",
        description: "Intensive workshop on public speaking and testimony skills.",
        type: "workshop"
    },
    {
        title: "Community Organizing Bootcamp",
        date: "2024-06-12",
        time: "9:00 AM - 5:00 PM",
        location: "ASU Downtown Campus",
        description: "Full-day training on grassroots organizing and campaign strategy.",
        type: "bootcamp"
    }
];

// Open Voter Registration Tool
function openVoterRegistration() {
    const modal = document.getElementById('voter-registration-modal');
    const content = document.getElementById('voter-registration-content');
    
    content.innerHTML = `
        <div class="voter-registration-header">
            <h2>🗳️ Voter Registration & Information</h2>
            <p>Check your registration status and get information about voting in Arizona.</p>
        </div>
        
        <div class="voter-info-form">
            <div class="form-field">
                <label for="voter-first-name">First Name</label>
                <input type="text" id="voter-first-name" placeholder="Enter your first name">
            </div>
            <div class="form-field">
                <label for="voter-last-name">Last Name</label>
                <input type="text" id="voter-last-name" placeholder="Enter your last name">
            </div>
            <div class="form-field">
                <label for="voter-dob">Date of Birth</label>
                <input type="date" id="voter-dob">
            </div>
            <div class="form-field">
                <label for="voter-county">County</label>
                <select id="voter-county">
                    <option value="">Select County</option>
                    <option value="maricopa">Maricopa</option>
                    <option value="pima">Pima</option>
                    <option value="pinal">Pinal</option>
                    <option value="yavapai">Yavapai</option>
                    <option value="mohave">Mohave</option>
                    <option value="coconino">Coconino</option>
                    <option value="other">Other</option>
                </select>
            </div>
        </div>
        
        <button class="btn btn-primary" onclick="checkVoterRegistration()" style="margin: 20px 0;">Check Registration Status</button>
        
        <div id="registration-result"></div>
        
        <div class="voter-resources">
            <h4>Voting Resources</h4>
            <div class="resource-links">
                <a href="https://servicearizona.com/voterRegistration" target="_blank" class="btn btn-outline">Register to Vote</a>
                <a href="https://my.arizona.vote/PortalList.aspx" target="_blank" class="btn btn-outline">Find Polling Location</a>
                <a href="https://azsos.gov/elections" target="_blank" class="btn btn-outline">Election Information</a>
            </div>
        </div>
        
        <div class="voting-rights-info">
            <h4>🔓 Voting Rights Restoration in Arizona</h4>
            <p>In Arizona, voting rights are automatically restored upon completion of sentence (including parole and probation) for most felonies. Some exceptions apply for certain violent crimes.</p>
            <ul>
                <li>✅ Rights restored automatically for most non-violent felonies</li>
                <li>✅ No additional paperwork required in most cases</li>
                <li>⚠️ Some violent crimes require additional steps</li>
                <li>📞 Contact us for personalized assistance: (602) 555-0123</li>
            </ul>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Legislative Tracker
function openLegislativeTracker() {
    const modal = document.getElementById('legislative-tracker-modal');
    const content = document.getElementById('legislative-tracker-content');
    
    content.innerHTML = `
        <div class="legislative-header">
            <h2>📋 Arizona Criminal Justice Bills Tracker</h2>
            <p>Track current legislation affecting criminal justice reform in Arizona.</p>
        </div>
        
        <div class="bill-filters">
            <button class="filter-btn active" onclick="filterBills('all')">All Bills</button>
            <button class="filter-btn" onclick="filterBills('sentencing')">Sentencing Reform</button>
            <button class="filter-btn" onclick="filterBills('oversight')">Prison Oversight</button>
            <button class="filter-btn" onclick="filterBills('reentry')">Reentry Services</button>
            <button class="filter-btn" onclick="filterBills('drug-policy')">Drug Policy</button>
            <button class="filter-btn" onclick="filterBills('voting-rights')">Voting Rights</button>
        </div>
        
        <div class="bills-list" id="bills-container">
            ${currentBills.map(bill => `
                <div class="bill-card" data-category="${bill.category}">
                    <div class="bill-number">${bill.number}</div>
                    <div class="bill-title">${bill.title}</div>
                    <div class="bill-description">${bill.description}</div>
                    <div class="bill-status ${bill.status}">${bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}</div>
                    <div class="bill-details">
                        <p><strong>Sponsor:</strong> ${bill.sponsor}</p>
                        <p><strong>Committee:</strong> ${bill.committee}</p>
                        <p><strong>Last Action:</strong> ${bill.lastAction}</p>
                    </div>
                    <button class="btn btn-outline" onclick="trackBill('${bill.number}')">Track This Bill</button>
                </div>
            `).join('')}
        </div>
        
        <div class="legislative-actions">
            <h4>Take Action</h4>
            <p>Stay informed and make your voice heard on these important issues.</p>
            <button class="btn btn-primary" onclick="signUpForAlerts()">Sign Up for Bill Alerts</button>
            <button class="btn btn-secondary" onclick="contactRepresentatives()">Contact Your Representatives</button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Advocacy Center
function openAdvocacyCenter() {
    const modal = document.getElementById('advocacy-center-modal');
    const content = document.getElementById('advocacy-center-content');
    
    content.innerHTML = `
        <div class="advocacy-header">
            <h2>📢 Advocacy Action Center</h2>
            <p>Connect with your representatives and take action on criminal justice issues.</p>
        </div>
        
        <div class="representatives-section">
            <h3>Your Arizona Representatives</h3>
            <div class="representatives-grid">
                ${arizonaRepresentatives.map(rep => `
                    <div class="representative-card">
                        <div class="rep-photo">${rep.photo}</div>
                        <div class="rep-name">${rep.name}</div>
                        <div class="rep-title">${rep.title} (${rep.party})</div>
                        <div class="contact-methods">
                            <button class="contact-btn phone" onclick="contactRep('phone', '${rep.phone}')">📞 Call</button>
                            <button class="contact-btn email" onclick="contactRep('email', '${rep.email}')">✉️ Email</button>
                            <button class="contact-btn office" onclick="contactRep('office', '${rep.office}')">🏢 Office</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="advocacy-campaigns">
            <h3>Current Advocacy Campaigns</h3>
            <div class="campaigns-list">
                <div class="campaign-card">
                    <h4>Support Prison Oversight Reform</h4>
                    <p>Urge your representatives to support independent oversight of Arizona's prison system.</p>
                    <button class="btn btn-primary" onclick="joinCampaign('prison-oversight')">Join Campaign</button>
                </div>
                <div class="campaign-card">
                    <h4>Expand Reentry Services</h4>
                    <p>Advocate for increased funding for job training and housing assistance programs.</p>
                    <button class="btn btn-primary" onclick="joinCampaign('reentry-services')">Join Campaign</button>
                </div>
                <div class="campaign-card">
                    <h4>Restore Voting Rights</h4>
                    <p>Support automatic restoration of voting rights for formerly incarcerated individuals.</p>
                    <button class="btn btn-primary" onclick="joinCampaign('voting-rights')">Join Campaign</button>
                </div>
            </div>
        </div>
        
        <div class="advocacy-tools">
            <h3>Advocacy Tools</h3>
            <div class="tools-list">
                <button class="btn btn-outline" onclick="generateLetter()">Generate Advocacy Letter</button>
                <button class="btn btn-outline" onclick="scheduleCall()">Schedule Call with Rep</button>
                <button class="btn btn-outline" onclick="findTownHalls()">Find Town Halls</button>
                <button class="btn btn-outline" onclick="shareOnSocial()">Share on Social Media</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Volunteer Matcher
function openVolunteerMatcher() {
    const modal = document.getElementById('volunteer-matcher-modal');
    const content = document.getElementById('volunteer-matcher-content');
    
    content.innerHTML = `
        <div class="volunteer-header">
            <h2>🤝 Volunteer Opportunity Matcher</h2>
            <p>Find volunteer opportunities that match your skills and interests in criminal justice reform.</p>
        </div>
        
        <div class="volunteer-filters">
            <div class="form-field">
                <label for="volunteer-category">Category</label>
                <select id="volunteer-category" onchange="filterVolunteerOpportunities()">
                    <option value="all">All Categories</option>
                    <option value="research">Research & Policy</option>
                    <option value="outreach">Community Outreach</option>
                    <option value="training">Training & Education</option>
                    <option value="digital">Digital Advocacy</option>
                    <option value="mentoring">Mentoring & Support</option>
                </select>
            </div>
            <div class="form-field">
                <label for="volunteer-time">Time Commitment</label>
                <select id="volunteer-time" onchange="filterVolunteerOpportunities()">
                    <option value="all">Any Time Commitment</option>
                    <option value="low">1-5 hours/week</option>
                    <option value="medium">6-10 hours/week</option>
                    <option value="high">10+ hours/week</option>
                    <option value="events">Events/Workshops Only</option>
                </select>
            </div>
            <div class="form-field">
                <label for="volunteer-location">Location</label>
                <select id="volunteer-location" onchange="filterVolunteerOpportunities()">
                    <option value="all">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="phoenix">Phoenix Metro</option>
                    <option value="tucson">Tucson</option>
                    <option value="statewide">Statewide</option>
                </select>
            </div>
        </div>
        
        <div class="volunteer-opportunities" id="opportunities-container">
            ${volunteerOpportunities.map(opp => `
                <div class="opportunity-card" data-category="${opp.category}">
                    <div class="opportunity-title">${opp.title}</div>
                    <div class="opportunity-org">${opp.organization}</div>
                    <div class="opportunity-description">${opp.description}</div>
                    <div class="opportunity-details">
                        <div class="detail-item">
                            <span>⏰</span>
                            <span>${opp.timeCommitment}</span>
                        </div>
                        <div class="detail-item">
                            <span>📍</span>
                            <span>${opp.location}</span>
                        </div>
                        <div class="detail-item">
                            <span>🛠️</span>
                            <span>${opp.skills.join(', ')}</span>
                        </div>
                    </div>
                    <button class="apply-volunteer-btn" onclick="applyForVolunteer('${opp.title}', '${opp.contact}')">Apply Now</button>
                </div>
            `).join('')}
        </div>
        
        <div class="volunteer-signup">
            <h3>Can't Find What You're Looking For?</h3>
            <p>Let us know your interests and we'll match you with opportunities.</p>
            <button class="btn btn-primary" onclick="customVolunteerRequest()">Request Custom Match</button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Event Calendar
function openEventCalendar() {
    alert(`Training & Events Calendar:\n\n${upcomingEvents.map(event => 
        `${event.title}\n📅 ${event.date} at ${event.time}\n📍 ${event.location}\n${event.description}\n`
    ).join('\n')}\n\nFor registration and more events, visit our website or call (602) 555-0123.`);
}

// Open Impact Tracker
function openImpactTracker() {
    alert(`Impact Tracker Dashboard:\n\n🎯 Your Advocacy Impact:\n• 3 representatives contacted this month\n• 2 bills tracked and supported\n• 1 community event attended\n\n🌟 Community Impact:\n• 1,247 advocacy actions taken\n• 23 bills actively tracked\n• 156 volunteers engaged\n• 89% increase in civic participation\n\nTogether, we're making a difference in criminal justice reform!`);
}

// Utility Functions
function checkVoterRegistration() {
    const firstName = document.getElementById('voter-first-name').value;
    const lastName = document.getElementById('voter-last-name').value;
    const dob = document.getElementById('voter-dob').value;
    const county = document.getElementById('voter-county').value;
    
    const resultDiv = document.getElementById('registration-result');
    
    if (!firstName || !lastName || !dob || !county) {
        resultDiv.innerHTML = '<div class="error-state">Please fill in all fields to check registration status.</div>';
        return;
    }
    
    // Simulate registration check
    setTimeout(() => {
        const isRegistered = Math.random() > 0.3; // 70% chance of being registered
        
        if (isRegistered) {
            resultDiv.innerHTML = `
                <div class="registration-status">
                    <h4>✅ You are registered to vote!</h4>
                    <p>Registration found for ${firstName} ${lastName} in ${county} County.</p>
                    <p>Your polling location and ballot information will be mailed to your registered address.</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="registration-status not-registered">
                    <h4>⚠️ Registration not found</h4>
                    <p>We couldn't find a registration for ${firstName} ${lastName} in ${county} County.</p>
                    <p>You may need to register or update your registration.</p>
                    <a href="https://servicearizona.com/voterRegistration" target="_blank" class="btn btn-primary">Register Now</a>
                </div>
            `;
        }
    }, 1500);
    
    resultDiv.innerHTML = '<div class="loading-spinner"></div><p>Checking registration status...</p>';
}

function filterBills(category) {
    const bills = document.querySelectorAll('.bill-card');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter bills
    bills.forEach(bill => {
        if (category === 'all' || bill.dataset.category === category) {
            bill.style.display = 'block';
        } else {
            bill.style.display = 'none';
        }
    });
}

function contactRep(method, contact) {
    if (method === 'phone') {
        window.open(`tel:${contact}`, '_self');
    } else if (method === 'email') {
        window.open(contact, '_blank');
    } else if (method === 'office') {
        alert(`Office Address: ${contact}\n\nYou can visit during regular business hours or call to schedule an appointment.`);
    }
}

function applyForVolunteer(title, contact) {
    alert(`Thank you for your interest in: ${title}\n\nTo apply, please email: ${contact}\n\nInclude your resume, a brief cover letter explaining your interest, and your availability.`);
}

// Close Civic Modal
function closeCivicModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Civic Engagement Sharing
function shareCivicEngagement() {
    const url = window.location.href;
    const title = 'Join Civic Engagement & Advocacy Training';
    const text = 'Empower yourself with advocacy skills and help shape criminal justice reform in Arizona. Join our comprehensive civic engagement training program. #CivicEngagement #CriminalJusticeReform';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(console.error);
    } else {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }
}

// Newsletter Signup
function handleCivicNewsletter(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.email.value;
    const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert(`Thank you for subscribing to civic engagement updates!\n\nYou'll receive information about: ${interests.join(', ')}`);
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Initialize Civic Engagement Page
function initializeCivicEngagementPage() {
    // Initialize animated counters
    const counters = document.querySelectorAll('.animated-counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCivicCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = ['voter-registration-modal', 'legislative-tracker-modal', 'advocacy-center-modal', 'volunteer-matcher-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (event.target === modal) {
                closeCivicModal(modalId);
            }
        });
    };
    
    // Add smooth scrolling for newsletter link
    const newsletterLink = document.querySelector('a[href="#civic-newsletter"]');
    if (newsletterLink) {
        newsletterLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#civic-newsletter');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

function animateCivicCounter(element) {
    const target = parseFloat(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const increment = target / (duration / 16);
    
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue;
        if (target === 5) {
            displayValue = Math.floor(current) + ' Million';
        } else if (target === 96) {
            displayValue = Math.floor(current) + '%';
        } else if (target === 0) {
            displayValue = 'Zero';
        } else {
            displayValue = Math.floor(current);
        }
        
        element.textContent = displayValue;
    }, 16);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('4D') || window.location.pathname.includes('civic_engagement')) {
        initializeCivicEngagementPage();
    }
});


// ===== 4E ARTS IN PRISON PAGE FUNCTIONALITY =====

// Featured Artists Data
const featuredArtists = [
    {
        name: "Maria S.",
        medium: "Visual Arts & Painting",
        story: "Through the arts program, I discovered my passion for painting landscapes. Art became my therapy and helped me process trauma while developing new skills for my future.",
        achievements: "Completed 15 paintings, participated in 3 exhibitions, now teaching art to other participants",
        image: "🎨",
        program: "Visual Arts Workshop",
        timeInProgram: "2 years"
    },
    {
        name: "James T.",
        medium: "Music & Songwriting",
        story: "Music saved my life. Writing songs helped me express emotions I couldn't put into words and connected me with others who understood my journey.",
        achievements: "Wrote 12 original songs, formed prison band, performed at facility events",
        image: "🎵",
        program: "Music Therapy Program",
        timeInProgram: "18 months"
    },
    {
        name: "Angela R.",
        medium: "Dance & Movement",
        story: "Dr. Bendix's Think Motion program taught me that my body could express healing, not just pain. Dance became my path to emotional freedom.",
        achievements: "Completed advanced movement therapy, became peer mentor, reduced anxiety by 80%",
        image: "💃",
        program: "Think Motion Dance Therapy",
        timeInProgram: "3 years"
    },
    {
        name: "David L.",
        medium: "Creative Writing & Poetry",
        story: "Poetry gave me a voice when I felt voiceless. Through writing workshops, I learned to tell my story with honesty and hope.",
        achievements: "Published in prison literary magazine, won writing contest, mentoring new writers",
        image: "✍️",
        program: "Creative Writing Workshop",
        timeInProgram: "1 year"
    },
    {
        name: "Carmen V.",
        medium: "Theater & Performance",
        story: "Acting allowed me to explore different parts of myself and practice being the person I want to become when I'm released.",
        achievements: "Lead role in 3 productions, drama therapy certification, conflict resolution skills",
        image: "🎭",
        program: "Theater Arts Program",
        timeInProgram: "2.5 years"
    },
    {
        name: "Robert K.",
        medium: "Sculpture & Ceramics",
        story: "Working with clay taught me patience and precision. Each piece I create represents growth and the possibility of transformation.",
        achievements: "Created 25+ sculptures, taught ceramics basics, developed mindfulness practice",
        image: "🏺",
        program: "Sculpture Workshop",
        timeInProgram: "16 months"
    }
];

// Workshop Schedule Data
const workshopSchedule = [
    {
        title: "Introduction to Visual Arts",
        date: "2024-05-20",
        time: "2:00 PM - 4:00 PM",
        location: "Perryville Women's Prison",
        instructor: "Sarah Martinez, Art Therapist",
        description: "Basic drawing and painting techniques for beginners. All materials provided.",
        category: "visual-arts",
        capacity: 15,
        enrolled: 12
    },
    {
        title: "Music Therapy Session",
        date: "2024-05-22",
        time: "10:00 AM - 12:00 PM",
        location: "Phoenix Correctional Facility",
        instructor: "Michael Johnson, Music Therapist",
        description: "Group music therapy focusing on emotional expression and healing.",
        category: "music",
        capacity: 20,
        enrolled: 18
    },
    {
        title: "Think Motion Dance Workshop",
        date: "2024-05-25",
        time: "1:00 PM - 3:00 PM",
        location: "Perryville Women's Prison",
        instructor: "Dr. Susan Bendix",
        description: "Therapeutic dance and movement workshop focusing on emotional regulation.",
        category: "dance",
        capacity: 12,
        enrolled: 10
    },
    {
        title: "Creative Writing Circle",
        date: "2024-05-27",
        time: "6:00 PM - 8:00 PM",
        location: "Tucson Prison Complex",
        instructor: "Jennifer Adams, Published Author",
        description: "Poetry and storytelling workshop for all skill levels.",
        category: "writing",
        capacity: 16,
        enrolled: 14
    },
    {
        title: "Theater Arts Workshop",
        date: "2024-05-30",
        time: "3:00 PM - 5:00 PM",
        location: "Phoenix Correctional Facility",
        instructor: "Carlos Rivera, Drama Therapist",
        description: "Acting exercises and scene work focusing on personal growth.",
        category: "theater",
        capacity: 10,
        enrolled: 8
    },
    {
        title: "Ceramics & Sculpture",
        date: "2024-06-02",
        time: "9:00 AM - 12:00 PM",
        location: "Florence Prison Complex",
        instructor: "Lisa Chen, Professional Sculptor",
        description: "Hands-on ceramics workshop exploring form and expression.",
        category: "sculpture",
        capacity: 8,
        enrolled: 6
    }
];

// Art Therapy Resources Data
const artTherapyResources = [
    {
        category: "Emotional Regulation",
        icon: "🧘",
        techniques: [
            "Color breathing exercises",
            "Mandala creation for centering",
            "Emotion mapping through abstract art",
            "Progressive muscle relaxation with drawing",
            "Mindful sketching practices"
        ]
    },
    {
        category: "Trauma Processing",
        icon: "💚",
        techniques: [
            "Safe place visualization art",
            "Trauma timeline through collage",
            "Body mapping for healing",
            "Symbolic representation exercises",
            "Narrative art therapy techniques"
        ]
    },
    {
        category: "Self-Expression",
        icon: "🎨",
        techniques: [
            "Identity collage creation",
            "Mask-making for different selves",
            "Journaling with visual elements",
            "Dream imagery exploration",
            "Future self visualization art"
        ]
    },
    {
        category: "Social Connection",
        icon: "🤝",
        techniques: [
            "Collaborative mural projects",
            "Group storytelling through art",
            "Community quilt making",
            "Shared poetry and illustration",
            "Ensemble music creation"
        ]
    },
    {
        category: "Stress Relief",
        icon: "🌿",
        techniques: [
            "Zentangle and pattern drawing",
            "Clay work for tension release",
            "Watercolor flow meditation",
            "Music improvisation sessions",
            "Movement and dance therapy"
        ]
    },
    {
        category: "Goal Setting",
        icon: "🎯",
        techniques: [
            "Vision board creation",
            "Goal visualization art",
            "Progress tracking through art",
            "Achievement celebration projects",
            "Future planning collages"
        ]
    }
];

// Volunteer Artist Opportunities Data (Arts Program)
const artsVolunteerOpportunities = [
    {
        title: "Visual Arts Instructor",
        location: "Perryville Women's Prison",
        description: "Teach basic drawing, painting, and mixed media techniques to incarcerated women. Help participants develop artistic skills and emotional expression.",
        timeCommitment: "4 hours/week, 6-month commitment",
        requirements: [
            "Background in visual arts or art education",
            "Ability to pass background check",
            "Patience and empathy for working with vulnerable populations",
            "Willingness to undergo volunteer training"
        ],
        contact: "arts@praxisinitiative.org"
    },
    {
        title: "Music Therapy Assistant",
        location: "Phoenix Correctional Facility",
        description: "Support music therapy sessions and help participants learn instruments, songwriting, and music production basics.",
        timeCommitment: "3 hours/week, ongoing",
        requirements: [
            "Musical background or training",
            "Experience with therapeutic approaches preferred",
            "Strong communication skills",
            "Commitment to participant confidentiality"
        ],
        contact: "music@praxisinitiative.org"
    },
    {
        title: "Creative Writing Mentor",
        location: "Multiple facilities",
        description: "Guide participants in poetry, storytelling, and journaling exercises. Help develop writing skills and personal narrative.",
        timeCommitment: "2-3 hours/week, flexible schedule",
        requirements: [
            "Writing experience or education",
            "Ability to provide constructive feedback",
            "Understanding of trauma-informed practices",
            "Reliable transportation to facilities"
        ],
        contact: "writing@praxisinitiative.org"
    },
    {
        title: "Dance/Movement Facilitator",
        location: "Perryville Women's Prison",
        description: "Assist with Think Motion program and other movement-based therapeutic activities.",
        timeCommitment: "2 hours/week, 3-month minimum",
        requirements: [
            "Dance or movement therapy background",
            "Understanding of trauma-informed movement",
            "Physical ability to demonstrate movements",
            "Sensitivity to diverse backgrounds"
        ],
        contact: "movement@praxisinitiative.org"
    },
    {
        title: "Art Supply Coordinator",
        location: "Administrative/Remote",
        description: "Organize art supply donations, inventory management, and distribution to various prison programs.",
        timeCommitment: "5-8 hours/week, flexible",
        requirements: [
            "Organizational and logistics skills",
            "Ability to coordinate with multiple facilities",
            "Transportation for supply delivery",
            "Detail-oriented and reliable"
        ],
        contact: "supplies@praxisinitiative.org"
    }
];

// Open Artist Gallery
function openArtistGallery() {
    const modal = document.getElementById('artist-gallery-modal');
    const content = document.getElementById('artist-gallery-content');
    
    content.innerHTML = `
        <div class="gallery-header">
            <h2>🎨 Artist Spotlight Gallery</h2>
            <p>Meet the talented individuals whose lives have been transformed through arts programming.</p>
        </div>
        
        <div class="artist-grid">
            ${featuredArtists.map(artist => `
                <div class="artist-card">
                    <div class="artist-image">${artist.image}</div>
                    <div class="artist-info">
                        <div class="artist-name">${artist.name}</div>
                        <div class="artist-medium">${artist.medium}</div>
                        <div class="artist-story">"${artist.story}"</div>
                        <div class="artist-achievements">
                            <strong>Achievements:</strong> ${artist.achievements}
                        </div>
                        <div style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                            <div><strong>Program:</strong> ${artist.program}</div>
                            <div><strong>Time in Program:</strong> ${artist.timeInProgram}</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="gallery-footer" style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h4>Share Your Story</h4>
            <p>Are you a program participant with artwork or experiences to share? We'd love to feature your journey.</p>
            <button class="btn btn-primary" onclick="submitArtistStory()">Submit Your Story</button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Workshop Calendar
function openWorkshopCalendar() {
    const modal = document.getElementById('workshop-calendar-modal');
    const content = document.getElementById('workshop-calendar-content');
    
    content.innerHTML = `
        <div class="calendar-header">
            <h2>📅 Creative Workshop Calendar</h2>
            <p>Upcoming arts workshops and creative sessions in Arizona correctional facilities.</p>
        </div>
        
        <div class="calendar-filters">
            <button class="calendar-filter-btn active" onclick="filterWorkshops('all')">All Workshops</button>
            <button class="calendar-filter-btn" onclick="filterWorkshops('visual-arts')">Visual Arts</button>
            <button class="calendar-filter-btn" onclick="filterWorkshops('music')">Music</button>
            <button class="calendar-filter-btn" onclick="filterWorkshops('dance')">Dance</button>
            <button class="calendar-filter-btn" onclick="filterWorkshops('writing')">Writing</button>
            <button class="calendar-filter-btn" onclick="filterWorkshops('theater')">Theater</button>
        </div>
        
        <div class="workshops-grid" id="workshops-container">
            ${workshopSchedule.map(workshop => `
                <div class="workshop-card" data-category="${workshop.category}">
                    <div class="workshop-title">${workshop.title}</div>
                    <div class="workshop-details">
                        <div class="workshop-detail">
                            <span>📅</span>
                            <span>${workshop.date}</span>
                        </div>
                        <div class="workshop-detail">
                            <span>🕒</span>
                            <span>${workshop.time}</span>
                        </div>
                        <div class="workshop-detail">
                            <span>📍</span>
                            <span>${workshop.location}</span>
                        </div>
                        <div class="workshop-detail">
                            <span>👨‍🏫</span>
                            <span>${workshop.instructor}</span>
                        </div>
                        <div class="workshop-detail">
                            <span>👥</span>
                            <span>${workshop.enrolled}/${workshop.capacity} enrolled</span>
                        </div>
                    </div>
                    <div class="workshop-description">${workshop.description}</div>
                    <button class="register-btn" onclick="registerForWorkshop('${workshop.title}')">
                        ${workshop.enrolled < workshop.capacity ? 'Register Interest' : 'Join Waitlist'}
                    </button>
                </div>
            `).join('')}
        </div>
        
        <div class="calendar-footer" style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h4>Request a Workshop</h4>
            <p>Don't see what you're looking for? Request a specific type of arts workshop for your facility.</p>
            <button class="btn btn-secondary" onclick="requestWorkshop()">Request Workshop</button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Art Therapy Resources
function openArtTherapyResources() {
    const modal = document.getElementById('art-therapy-modal');
    const content = document.getElementById('art-therapy-content');
    
    content.innerHTML = `
        <div class="therapy-header">
            <h2>🧠 Art Therapy Resource Center</h2>
            <p>Therapeutic art techniques and exercises for healing, growth, and emotional wellness.</p>
        </div>
        
        <div class="therapy-categories">
            ${artTherapyResources.map(category => `
                <div class="therapy-category">
                    <h4>${category.icon} ${category.category}</h4>
                    <ul class="therapy-techniques">
                        ${category.techniques.map(technique => `
                            <li>${technique}</li>
                        `).join('')}
                    </ul>
                    <button class="download-resource-btn" onclick="downloadTherapyGuide('${category.category}')">
                        Download Guide
                    </button>
                </div>
            `).join('')}
        </div>
        
        <div class="therapy-resources-footer">
            <h4>Professional Support</h4>
            <p>These resources are designed to complement, not replace, professional mental health care. If you're experiencing a mental health crisis, please seek immediate professional help.</p>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h5>Crisis Resources:</h5>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                    <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                    <li><strong>SAMHSA National Helpline:</strong> 1-800-662-4357</li>
                </ul>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open Volunteer Artists Network
function openVolunteerArtists() {
    const modal = document.getElementById('volunteer-artists-modal');
    const content = document.getElementById('volunteer-artists-content');
    
    content.innerHTML = `
        <div class="volunteer-header">
            <h2>🤝 Volunteer Artist Network</h2>
            <p>Join our community of volunteer artists making a difference in Arizona's correctional facilities.</p>
        </div>
        
        <div class="volunteer-opportunities-grid">
            ${artsVolunteerOpportunities.map(opportunity => `
                <div class="volunteer-opportunity">
                    <div class="volunteer-title">${opportunity.title}</div>
                    <div class="volunteer-location">📍 ${opportunity.location}</div>
                    <div class="volunteer-description">${opportunity.description}</div>
                    <div class="volunteer-time">⏰ <strong>Time Commitment:</strong> ${opportunity.timeCommitment}</div>
                    <div class="volunteer-requirements">
                        <h5>Requirements:</h5>
                        <ul class="requirements-list">
                            ${opportunity.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="apply-volunteer-arts-btn" onclick="applyForArtsVolunteer('${opportunity.title}', '${opportunity.contact}')">
                        Apply Now
                    </button>
                </div>
            `).join('')}
        </div>
        
        <div class="volunteer-info">
            <h4>Why Volunteer with Arts in Prison?</h4>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 5px 0;">🎨 <strong>Make a Direct Impact:</strong> See firsthand how arts transform lives</li>
                    <li style="padding: 5px 0;">🌱 <strong>Personal Growth:</strong> Develop new skills and perspectives</li>
                    <li style="padding: 5px 0;">🤝 <strong>Community Building:</strong> Connect with like-minded advocates</li>
                    <li style="padding: 5px 0;">📚 <strong>Training Provided:</strong> Comprehensive orientation and ongoing support</li>
                    <li style="padding: 5px 0;">🏆 <strong>Recognition:</strong> Volunteer appreciation events and certificates</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" onclick="generalVolunteerInquiry()">General Volunteer Inquiry</button>
                <button class="btn btn-secondary" onclick="volunteerOrientation()">Attend Orientation</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Utility Functions
function filterWorkshops(category) {
    const workshops = document.querySelectorAll('.workshop-card');
    const buttons = document.querySelectorAll('.calendar-filter-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter workshops
    workshops.forEach(workshop => {
        if (category === 'all' || workshop.dataset.category === category) {
            workshop.style.display = 'block';
        } else {
            workshop.style.display = 'none';
        }
    });
}

function registerForWorkshop(workshopTitle) {
    alert(`Thank you for your interest in: ${workshopTitle}\n\nTo register, please contact your facility's program coordinator or email arts@praxisinitiative.org with:\n• Your name and facility\n• Workshop you're interested in\n• Any relevant experience\n\nWe'll follow up with registration details.`);
}

function submitArtistStory() {
    alert(`Share Your Artistic Journey!\n\nWe'd love to feature your story in our Artist Spotlight Gallery. Please email arts@praxisinitiative.org with:\n\n• Your artistic medium and experience\n• A brief story about your journey\n• Photos of your artwork (if available)\n• How arts programming has impacted you\n\nAll submissions are reviewed for inclusion in our gallery.`);
}

function downloadTherapyGuide(category) {
    alert(`Downloading ${category} Therapy Guide...\n\nThis comprehensive guide includes:\n• Step-by-step techniques\n• Safety considerations\n• Adaptation suggestions\n• Additional resources\n\nFile will be saved to your Downloads folder.`);
}

function applyForArtsVolunteer(title, contact) {
    alert(`Thank you for your interest in: ${title}\n\nTo apply, please email: ${contact}\n\nInclude:\n• Your resume and relevant experience\n• Cover letter explaining your interest\n• Availability and schedule preferences\n• Any questions about the position\n\nWe'll respond within 5 business days with next steps.`);
}

function requestWorkshop() {
    alert(`Request a Custom Workshop\n\nTo request a specific arts workshop for your facility, please email arts@praxisinitiative.org with:\n\n• Type of workshop desired\n• Facility name and contact\n• Preferred dates and times\n• Number of participants\n• Any special requirements\n\nWe'll work with you to develop a program that meets your needs.`);
}

function generalVolunteerInquiry() {
    alert(`General Volunteer Inquiry\n\nInterested in volunteering but not sure which role fits? Email volunteer@praxisinitiative.org with:\n\n• Your background and interests\n• Available time commitment\n• Preferred location/facility\n• Any questions about volunteering\n\nWe'll help match you with the perfect opportunity!`);
}

function volunteerOrientation() {
    alert(`Volunteer Orientation Sessions\n\nNext orientations:\n• May 25, 2024 - 10:00 AM (Phoenix)\n• June 8, 2024 - 2:00 PM (Tucson)\n• June 15, 2024 - 6:00 PM (Virtual)\n\nTo register: volunteer@praxisinitiative.org\nInclude your preferred session and contact information.`);
}

// Close Arts Modal
function closeArtsModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Arts Program Sharing
function shareArtsProgram() {
    const url = window.location.href;
    const title = 'Support Arts in Prison Programming';
    const text = 'Discover the transformative power of arts in rehabilitation. Support creative programming that heals, empowers, and transforms lives in Arizona prisons. #ArtsInPrison #CriminalJusticeReform #ArtHeals';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(console.error);
    } else {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }
}

// Newsletter Signup
function handleArtsNewsletter(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.email.value;
    const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert(`Thank you for subscribing to arts program updates!\n\nYou'll receive information about: ${interests.join(', ')}`);
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Initialize Arts in Prison Page
function initializeArtsInPrisonPage() {
    // Initialize animated counters
    const counters = document.querySelectorAll('.animated-counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateArtsCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = ['artist-gallery-modal', 'workshop-calendar-modal', 'art-therapy-modal', 'volunteer-artists-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (event.target === modal) {
                closeArtsModal(modalId);
            }
        });
    };
    
    // Add smooth scrolling for newsletter link
    const newsletterLink = document.querySelector('a[href="#arts-newsletter"]');
    if (newsletterLink) {
        newsletterLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#arts-newsletter');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

function animateArtsCounter(element) {
    const target = parseFloat(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const increment = target / (duration / 16);
    
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue;
        if (target === 34500) {
            displayValue = Math.floor(current).toLocaleString() + '+';
        } else if (target === 75 || target === 50) {
            displayValue = Math.floor(current) + '%';
        } else {
            displayValue = Math.floor(current);
        }
        
        element.textContent = displayValue;
    }, 16);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('4E') || window.location.pathname.includes('arts_in_prison')) {
        initializeArtsInPrisonPage();
    }
});



// ===== PROGRAMS PAGE FUNCTIONALITY =====

// Animated Counter for Programs Page
function animateProgramsCounter(element) {
    const target = parseFloat(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const increment = target / (duration / 16);
    
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue;
        if (suffix === '%') {
            displayValue = current.toFixed(1) + '%';
        } else if (suffix === '+') {
            displayValue = Math.floor(current).toLocaleString() + '+';
        } else if (suffix === 'k+') {
            displayValue = Math.floor(current / 1000) + 'k+';
        } else {
            displayValue = Math.floor(current).toLocaleString();
        }
        
        element.textContent = displayValue;
    }, 16);
}

// Expandable Cards Functionality
function initExpandableCards() {
    const expandableCards = document.querySelectorAll('.expandable-card');
    
    expandableCards.forEach(card => {
        const button = card.querySelector('.learn-more-btn');
        const expandedContent = card.querySelector('.expanded-content');
        
        if (button && expandedContent) {
            // Initially hide expanded content
            expandedContent.style.maxHeight = '0';
            expandedContent.style.overflow = 'hidden';
            expandedContent.style.transition = 'max-height 0.3s ease-out';
            
            button.addEventListener('click', function() {
                const isExpanded = expandedContent.style.maxHeight !== '0px';
                
                if (isExpanded) {
                    // Collapse
                    expandedContent.style.maxHeight = '0';
                    button.textContent = 'Learn More';
                    button.setAttribute('aria-expanded', 'false');
                } else {
                    // Expand
                    expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
                    button.textContent = 'Show Less';
                    button.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });
}

// Interactive Timeline Widget
function initProgramsTimeline() {
    const timelineContainer = document.querySelector('.programs-timeline');
    if (!timelineContainer) return;
    
    const timelineData = [
        {
            year: '2024',
            title: 'Independent Oversight Office Created',
            description: 'Arizona\'s first Independent Correctional Oversight Office established through legislative advocacy.',
            impact: 'Groundbreaking transparency and accountability measure'
        },
        {
            year: '2023',
            title: 'Coalition Building Success',
            description: 'Built bipartisan coalition of 25+ organizations supporting criminal justice reform.',
            impact: 'Unified advocacy across ideological lines'
        },
        {
            year: '2022',
            title: 'Evidence-Based Research Initiative',
            description: 'Launched comprehensive data collection and analysis program for policy development.',
            impact: 'Data-driven approach to systemic change'
        },
        {
            year: '2021',
            title: 'Community Engagement Program',
            description: 'Established direct support services and advocacy training for returning citizens.',
            impact: 'Empowered formerly incarcerated individuals as advocates'
        }
    ];
    
    const timelineHTML = `
        <div class="timeline-header">
            <h3>Our Impact Timeline</h3>
            <p>Key milestones in transforming Arizona's criminal justice system</p>
        </div>
        <div class="timeline-track">
            ${timelineData.map((item, index) => `
                <div class="timeline-item" data-year="${item.year}">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-year">${item.year}</div>
                        <h4 class="timeline-title">${item.title}</h4>
                        <p class="timeline-description">${item.description}</p>
                        <div class="timeline-impact">${item.impact}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    timelineContainer.innerHTML = timelineHTML;
    
    // Add click interactions
    const timelineItems = timelineContainer.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            timelineItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
}

// Programs Page Statistics Enhancement
function enhanceProgramsStats() {
    const statsContainer = document.querySelector('.crisis-stats');
    if (!statsContainer) return;
    
    // Add data attributes for animation
    const stats = [
        { selector: '.crisis-stat:nth-child(1) .crisis-number', target: 13, suffix: '%' },
        { selector: '.crisis-stat:nth-child(2) .crisis-number', target: 446, suffix: '+' },
        { selector: '.crisis-stat:nth-child(3) .crisis-number', target: 4.2, suffix: '%' },
        { selector: '.crisis-stat:nth-child(4) .crisis-number', target: 215000, suffix: 'k+' }
    ];
    
    stats.forEach(stat => {
        const element = document.querySelector(stat.selector);
        if (element) {
            element.dataset.target = stat.target;
            element.dataset.suffix = stat.suffix;
            element.classList.add('animated-counter');
            element.textContent = '0'; // Start from 0
        }
    });
}

// Initialize Programs Page
function initializeProgramsPage() {
    console.log('Initializing Programs page...');
    
    // Enhance statistics with animation data
    enhanceProgramsStats();
    
    // Initialize animated counters
    const counters = document.querySelectorAll('.animated-counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateProgramsCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
    
    // Initialize expandable cards
    initExpandableCards();
    
    // Initialize timeline widget
    initProgramsTimeline();
    
    // Add smooth scrolling for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    console.log('Programs page initialization complete');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname.toLowerCase();
    const currentHref = window.location.href.toLowerCase();
    
    console.log('Current path:', currentPath);
    console.log('Current href:', currentHref);
    
    // Check for Programs page with multiple conditions
    if (currentPath.includes('4 programs') || 
        currentPath.includes('programs.html') || 
        currentHref.includes('4%20programs') ||
        currentHref.includes('programs')) {
        console.log('Programs page detected, initializing...');
        initializeProgramsPage();
    }
    
    if (window.location.pathname.includes('4E') || window.location.pathname.includes('arts_in_prison')) {
        initializeArtsInPrisonPage();
    }
});



// ===== DONATION PAGE FUNCTIONALITY =====

// Initialize Donation Page Features
function initializeDonationPage() {
    console.log('Initializing Donation Page...');
    
    // Animate donation statistics
    animateDonationStats();
    
    // Initialize impact story interactions
    initializeImpactStories();
    
    // Setup Givebutter widget monitoring
    monitorGivebutterWidgets();
    
    // Add donation tracking analytics
    initializeDonationAnalytics();
}

// Animate Donation Statistics
function animateDonationStats() {
    const stats = [
        { element: '.stat-number', targets: ['92%', '$1,250', '100%'] }
    ];
    
    const statElements = document.querySelectorAll('.stat-number');
    
    statElements.forEach((element, index) => {
        const target = stats[0].targets[index];
        if (target) {
            // Start with 0 and animate to target
            element.textContent = '0';
            
            // Use Intersection Observer for scroll-triggered animation
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateStatNumber(element, target);
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        }
    });
}

// Animate Individual Stat Number
function animateStatNumber(element, target) {
    const isPercentage = target.includes('%');
    const isDollar = target.includes('$');
    const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
    
    let current = 0;
    const increment = numericValue / 60; // 60 frames for 1 second at 60fps
    const duration = 2000; // 2 seconds
    const frameRate = 1000 / 60;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        
        if (isDollar) {
            displayValue = '$' + displayValue.toLocaleString();
            if (target.includes(',')) {
                displayValue = '$' + Math.floor(current).toLocaleString();
            }
        } else if (isPercentage) {
            displayValue = displayValue + '%';
        }
        
        element.textContent = displayValue;
        
        // Add pulsing effect during animation
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);
        
    }, frameRate);
}

// Initialize Impact Stories Interactions
function initializeImpactStories() {
    const storyCards = document.querySelectorAll('.story-card');
    
    storyCards.forEach((card, index) => {
        // Add hover analytics
        card.addEventListener('mouseenter', () => {
            trackDonationInteraction('story_hover', card.querySelector('.story-amount').textContent);
        });
        
        // Add click functionality for donation amount selection
        card.addEventListener('click', () => {
            const amount = card.querySelector('.story-amount').textContent.replace('$', '');
            selectDonationAmount(amount);
            trackDonationInteraction('story_click', amount);
        });
        
        // Add keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Donate ${card.querySelector('.story-amount').textContent} - ${card.querySelector('.story-impact').textContent}`);
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

// Select Donation Amount (integrate with Givebutter if possible)
function selectDonationAmount(amount) {
    console.log(`Selected donation amount: $${amount}`);
    
    // Scroll to donation form
    const donationForm = document.querySelector('.givebutter-embed');
    if (donationForm) {
        donationForm.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Highlight the donation form briefly
        donationForm.style.border = '3px solid #000080';
        donationForm.style.boxShadow = '0 0 20px rgba(0, 0, 128, 0.3)';
        
        setTimeout(() => {
            donationForm.style.border = '2px solid #f0f0f0';
            donationForm.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }, 2000);
    }
    
    // Try to communicate with Givebutter widget (if API available)
    try {
        if (window.Givebutter && window.Givebutter.setAmount) {
            window.Givebutter.setAmount(amount);
        }
    } catch (error) {
        console.log('Givebutter API not available for amount pre-selection');
    }
}

// Monitor Givebutter Widget Loading
function monitorGivebutterWidgets() {
    const widgets = document.querySelectorAll('givebutter-widget');
    
    widgets.forEach((widget, index) => {
        // Add loading state
        widget.setAttribute('data-loading', 'true');
        
        // Monitor for successful load
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && widget.children.length > 0) {
                    widget.setAttribute('data-loading', 'false');
                    widget.setAttribute('loaded', 'true');
                    console.log(`Givebutter widget ${index + 1} loaded successfully`);
                    trackDonationInteraction('widget_loaded', widget.id);
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(widget, { childList: true, subtree: true });
        
        // Fallback timeout
        setTimeout(() => {
            if (!widget.hasAttribute('loaded')) {
                console.warn(`Givebutter widget ${index + 1} may have failed to load`);
                trackDonationInteraction('widget_load_timeout', widget.id);
            }
        }, 10000);
    });
}

// Donation Analytics Tracking
function initializeDonationAnalytics() {
    // Track page view
    trackDonationInteraction('page_view', 'donate');
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackDonationInteraction('scroll_depth', `${maxScroll}%`);
            }
        }
    });
    
    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackDonationInteraction('time_on_page', `${timeSpent}s`);
    });
}

// Track Donation Interactions
function trackDonationInteraction(action, value) {
    console.log(`Donation Analytics: ${action} - ${value}`);
    
    // Integration with Google Analytics (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: 'donation',
            event_label: value,
            value: value.includes('$') ? parseInt(value.replace(/[^0-9]/g, '')) : 1
        });
    }
    
    // Integration with Facebook Pixel (if available)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
            content_type: 'donation',
            content_category: action,
            value: value
        });
    }
}

// Enhanced Monthly Giving Interactions
function initializeMonthlyGiving() {
    const monthlySection = document.querySelector('.monthly-givebutter');
    
    if (monthlySection) {
        // Add interaction tracking
        monthlySection.addEventListener('click', () => {
            trackDonationInteraction('monthly_giving_click', 'button');
        });
        
        // Add hover analytics
        monthlySection.addEventListener('mouseenter', () => {
            trackDonationInteraction('monthly_giving_hover', 'section');
        });
    }
}

// Newsletter Integration Enhancement
function initializeNewsletterSignup() {
    const newsletterSection = document.querySelector('.newsletter-embed');
    
    if (newsletterSection) {
        // Track newsletter interest
        newsletterSection.addEventListener('click', () => {
            trackDonationInteraction('newsletter_signup_click', 'donate_page');
        });
    }
}

// Impact Calculator (Future Enhancement)
function calculateImpactPreview(amount) {
    const impacts = {
        25: { people: 1, action: "person's court fees covered" },
        50: { people: 1, action: "week of addiction treatment provided" },
        100: { people: 1, action: "day of legal advocacy funded" },
        250: { people: 20, action: "people trained in community event" },
        500: { people: 1, action: "family supported during crisis" },
        1000: { people: 100, action: "people protected through oversight investigation" }
    };
    
    return impacts[amount] || { 
        people: Math.floor(amount / 25), 
        action: "people helped through various programs" 
    };
}

// Add to main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the donation page
    if (window.location.pathname.includes('Donate') || 
        window.location.pathname.includes('9%20Donate') ||
        document.title.includes('Support Justice Reform')) {
        
        initializeDonationPage();
        initializeMonthlyGiving();
        initializeNewsletterSignup();
    }
});

