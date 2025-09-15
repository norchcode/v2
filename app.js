// Code Planet - Aggressive Anime.js Enhanced JavaScript
// Fixed version with working animations

// Global animation variables
let masterTimeline = null;
let isReducedMotion = false;
let particleSystem = null;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure Anime.js is fully loaded
    setTimeout(() => {
        checkReducedMotion();
        initializeParticleSystem();
        initializeMagneticCursor();
        initializeHeroAnimations();
        initializeScrollAnimations();
        initializeButtonMorphing();
        initializeProjectCardAnimations();
        initializeValueCardAnimations();
        initializeParallaxSystem();
        startMasterAnimation();
    }, 100);
});

// Check for reduced motion preference
function checkReducedMotion() {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
        document.body.classList.add('reduced-motion');
        // Show content immediately for reduced motion
        showContentImmediately();
        return;
    }
}

function showContentImmediately() {
    const elements = document.querySelectorAll('.hero-title .char, .hero-tagline, .hero-subtitle, .hero-actions, .hero-stats, .project-card, .value-card');
    elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

// Advanced particle system with physics
function initializeParticleSystem() {
    if (isReducedMotion) return;
    
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 6;
            this.vy = (Math.random() - 0.5) * 6;
            this.life = 1.0;
            this.decay = Math.random() * 0.02 + 0.01;
            this.size = Math.random() * 4 + 2;
            this.hue = Math.random() * 60 + 160;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.life -= this.decay;
            return this.life > 0;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life * 0.8;
            ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.life})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    function createExplosion(x, y, count = 80) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y));
        }
    }
    
    function animate() {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles = particles.filter(particle => {
            const alive = particle.update();
            if (alive) particle.draw();
            return alive;
        });
        
        if (Math.random() < 0.03) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    particleSystem = {
        createExplosion,
        cleanup: () => {
            if (animationId) cancelAnimationFrame(animationId);
            particles = [];
        }
    };
    
    // Trigger initial explosion after delay
    setTimeout(() => {
        createExplosion(canvas.width / 2, canvas.height / 2, 100);
    }, 1500);
}

// Magnetic cursor
function initializeMagneticCursor() {
    if (isReducedMotion) return;
    
    const cursor = document.querySelector('.magnetic-cursor');
    if (!cursor) return;
    
    const cursorInner = cursor.querySelector('.cursor-inner');
    const cursorOuter = cursor.querySelector('.cursor-outer');
    
    let mouse = { x: 0, y: 0 };
    let cursorPos = { x: 0, y: 0 };
    
    function updateCursor() {
        cursorPos.x += (mouse.x - cursorPos.x) * 0.1;
        cursorPos.y += (mouse.y - cursorPos.y) * 0.1;
        
        cursor.style.left = cursorPos.x + 'px';
        cursor.style.top = cursorPos.y + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    updateCursor();
}

// Dramatic hero entrance animations
function initializeHeroAnimations() {
    if (isReducedMotion) return;
    
    const heroTitle = document.getElementById('hero-title');
    const heroTagline = document.getElementById('hero-tagline');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroActions = document.getElementById('hero-actions');
    const heroStats = document.getElementById('hero-stats');
    
    if (!heroTitle || !anime) return;
    
    // Create master timeline
    masterTimeline = anime.timeline({ autoplay: false });
    
    // Hero explosion first
    masterTimeline
        .add({
            targets: '.hero-explosion',
            scale: [0, 2.5],
            opacity: [0, 1, 0],
            duration: 2500,
            easing: 'easeOutCubic',
            complete: () => {
                if (particleSystem) {
                    particleSystem.createExplosion(window.innerWidth / 2, window.innerHeight / 2, 120);
                }
            }
        })
        // Title characters animation
        .add({
            targets: '.hero-title .char',
            translateY: [100, 0],
            rotateX: [-90, 0],
            opacity: [0, 1],
            duration: 1000,
            delay: anime.stagger(80),
            easing: 'spring(1, 80, 10, 0)'
        }, 800)
        // Tagline
        .add({
            targets: heroTagline,
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutCubic'
        }, 1600)
        // Subtitle
        .add({
            targets: heroSubtitle,
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutCubic'
        }, 1800)
        // Actions
        .add({
            targets: heroActions,
            translateY: [40, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutCubic'
        }, 2000)
        // Stats
        .add({
            targets: '.stat',
            scale: [0.6, 1],
            opacity: [0, 1],
            duration: 600,
            delay: anime.stagger(100),
            easing: 'easeOutElastic(1, .8)'
        }, 2200)
        // Scroll indicator
        .add({
            targets: '.scroll-indicator',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            easing: 'easeOutCubic'
        }, 2800);
    
    // Animate counters after timeline
    setTimeout(() => {
        animateCounters();
    }, 3500);
}

// Animate statistics counters
function animateCounters() {
    if (isReducedMotion || !anime) return;
    
    const stats = document.querySelectorAll('.stat[data-target]');
    
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const numberElement = stat.querySelector('.stat-number');
        
        if (!numberElement || !target) return;
        
        anime({
            targets: { count: 0 },
            count: target,
            duration: 2000,
            easing: 'easeOutCubic',
            update: function(anim) {
                const value = Math.floor(anim.animatables[0].target.count);
                if (target >= 1000) {
                    numberElement.textContent = (value / 1000).toFixed(1) + 'k';
                } else {
                    numberElement.textContent = value;
                }
            }
        });
    });
}

// Advanced scroll animations
function initializeScrollAnimations() {
    if (isReducedMotion) return;
    
    // Section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        const words = title.querySelectorAll('.word');
        if (words.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && anime) {
                    anime({
                        targets: words,
                        translateY: [80, 0],
                        opacity: [0, 1],
                        duration: 800,
                        delay: anime.stagger(150),
                        easing: 'easeOutCubic'
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(title);
    });
    
    // Section subtitles
    const sectionSubtitles = document.querySelectorAll('.section-subtitle');
    sectionSubtitles.forEach(subtitle => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && anime) {
                    anime({
                        targets: entry.target,
                        translateY: [30, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutCubic'
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(subtitle);
    });
    
    // About mission
    const aboutMission = document.getElementById('about-mission');
    if (aboutMission) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && anime) {
                    anime({
                        targets: entry.target,
                        translateY: [30, 0],
                        opacity: [0, 1],
                        duration: 1000,
                        easing: 'easeOutCubic'
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(aboutMission);
    }
    
    // Contact sections
    const contactInfo = document.getElementById('contact-info');
    const contactCta = document.getElementById('contact-cta');
    
    if (contactInfo && contactCta) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && anime) {
                    if (entry.target === contactInfo) {
                        anime({
                            targets: contactInfo,
                            translateX: [-50, 0],
                            opacity: [0, 1],
                            duration: 800,
                            easing: 'easeOutCubic'
                        });
                    } else {
                        anime({
                            targets: contactCta,
                            translateX: [50, 0],
                            opacity: [0, 1],
                            duration: 800,
                            easing: 'easeOutCubic'
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(contactInfo);
        observer.observe(contactCta);
    }
}

// Morphing button effects
function initializeButtonMorphing() {
    const buttons = document.querySelectorAll('.btn-morph');
    
    buttons.forEach(button => {
        const liquid = button.querySelector('.btn-liquid');
        const text = button.querySelector('.btn-text');
        const icon = button.querySelector('.btn-icon');
        
        button.addEventListener('mouseenter', () => {
            if (isReducedMotion || !anime) {
                // Fallback for reduced motion
                button.style.transform = 'translateY(-2px) scale(1.02)';
                if (liquid) liquid.style.left = '0%';
                return;
            }
            
            // Liquid morphing
            if (liquid) {
                anime({
                    targets: liquid,
                    left: ['100%', '0%'],
                    duration: 500,
                    easing: 'easeOutCubic'
                });
            }
            
            // Button transform
            anime({
                targets: button,
                translateY: [0, -8],
                scale: [1, 1.05],
                borderRadius: ['12px', '50px'],
                duration: 500,
                easing: 'easeOutElastic(1, .6)'
            });
            
            // Text scaling
            if (text) {
                anime({
                    targets: text,
                    scale: [1, 1.1],
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
            
            // Icon animation
            if (icon) {
                anime({
                    targets: icon,
                    opacity: [0, 1],
                    translateX: [-20, 0],
                    rotate: [0, 360],
                    duration: 500,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (isReducedMotion || !anime) {
                // Fallback reset
                button.style.transform = '';
                if (liquid) liquid.style.left = '-100%';
                return;
            }
            
            // Reset liquid
            if (liquid) {
                anime({
                    targets: liquid,
                    left: ['0%', '-100%'],
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
            
            // Reset button
            anime({
                targets: button,
                translateY: [-8, 0],
                scale: [1.05, 1],
                borderRadius: ['50px', '12px'],
                duration: 400,
                easing: 'easeOutCubic'
            });
            
            // Reset text
            if (text) {
                anime({
                    targets: text,
                    scale: [1.1, 1],
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
            
            // Reset icon
            if (icon) {
                anime({
                    targets: icon,
                    opacity: [1, 0],
                    translateX: [0, 20],
                    rotate: [360, 0],
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        // Click ripple effect
        button.addEventListener('click', (e) => {
            if (isReducedMotion || !anime) return;
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 0;
                height: 0;
                transform: translate(-50%, -50%);
                z-index: 10;
            `;
            
            button.appendChild(ripple);
            
            anime({
                targets: ripple,
                width: '300px',
                height: '300px',
                opacity: [0.5, 0],
                duration: 600,
                easing: 'easeOutCubic',
                complete: () => ripple.remove()
            });
            
            // Button press
            anime({
                targets: button,
                scale: [1, 0.95, 1],
                duration: 200,
                easing: 'easeOutCubic'
            });
        });
        
        // Smooth scroll functionality
        const scrollTo = button.dataset.scrollTo;
        if (scrollTo) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(scrollTo);
                if (target) {
                    smoothScrollTo(target);
                }
            });
        }
    });
}

// 3D Project card animations
function initializeProjectCardAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (isReducedMotion || !anime) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'none';
                        observer.unobserve(entry.target);
                        return;
                    }
                    
                    // 3D entrance animation
                    anime({
                        targets: entry.target,
                        translateY: [100, 0],
                        rotateX: [15, 0],
                        opacity: [0, 1],
                        duration: 800,
                        delay: index * 200,
                        easing: 'easeOutCubic',
                        complete: () => {
                            animateProjectCardElements(entry.target);
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(card);
        
        // 3D hover effects
        card.addEventListener('mouseenter', () => {
            if (isReducedMotion || !anime) {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                return;
            }
            
            anime({
                targets: card,
                translateY: [0, -20],
                rotateX: [0, 5],
                rotateY: [0, 5],
                scale: [1, 1.02],
                duration: 400,
                easing: 'easeOutCubic'
            });
            
            // Tech tags animation
            const techTags = card.querySelectorAll('.tech-tag');
            anime({
                targets: techTags,
                scale: [1, 1.1],
                rotate: () => Math.random() * 10 - 5,
                duration: 400,
                delay: anime.stagger(50),
                easing: 'easeOutElastic(1, .6)'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            if (isReducedMotion || !anime) {
                card.style.transform = '';
                return;
            }
            
            anime({
                targets: card,
                translateY: [-20, 0],
                rotateX: [5, 0],
                rotateY: [5, 0],
                scale: [1.02, 1],
                duration: 400,
                easing: 'easeOutCubic'
            });
            
            // Reset tech tags
            const techTags = card.querySelectorAll('.tech-tag');
            anime({
                targets: techTags,
                scale: [1.1, 1],
                rotate: 0,
                duration: 400,
                easing: 'easeOutCubic'
            });
        });
    });
}

// Animate project card elements
function animateProjectCardElements(card) {
    if (isReducedMotion || !anime) return;
    
    const elements = [
        card.querySelector('.project-name'),
        card.querySelector('.project-meta'),
        card.querySelector('.project-tagline'),
        card.querySelector('.project-description'),
        card.querySelector('.project-actions'),
        card.querySelector('.project-attribution')
    ];
    
    elements.forEach((element, index) => {
        if (element) {
            anime({
                targets: element,
                translateX: index % 2 === 0 ? [-30, 0] : [30, 0],
                translateY: [20, 0],
                opacity: [0, 1],
                duration: 600,
                delay: index * 100,
                easing: 'easeOutCubic'
            });
        }
    });
    
    // Tech tags with stagger
    const techTags = card.querySelectorAll('.tech-tag');
    if (techTags.length > 0) {
        anime({
            targets: techTags,
            scale: [0, 1],
            rotate: [180, 0],
            duration: 600,
            delay: anime.stagger(80, {start: 800}),
            easing: 'easeOutElastic(1, .6)'
        });
    }
}

// Value card stagger animations
function initializeValueCardAnimations() {
    const valueCards = document.querySelectorAll('.value-card');
    
    if (valueCards.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = Array.from(valueCards);
                const index = cards.indexOf(entry.target);
                
                if (isReducedMotion || !anime) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'none';
                    animateValueCardElements(entry.target, true);
                    return;
                }
                
                // Stagger from center (index 1.5 for 4 cards)
                const delay = Math.abs(index - 1.5) * 200;
                
                anime({
                    targets: entry.target,
                    scale: [0.8, 1],
                    opacity: [0, 1],
                    duration: 800,
                    delay: delay,
                    easing: 'easeOutElastic(1, .8)',
                    complete: () => {
                        animateValueCardElements(entry.target, false);
                    }
                });
                
                // Remove observer after animation
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    valueCards.forEach(card => observer.observe(card));
    
    // Hover effects
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (isReducedMotion || !anime) {
                card.style.transform = 'scale(1.05) translateY(-10px)';
                return;
            }
            
            const icon = card.querySelector('.value-icon');
            
            anime({
                targets: card,
                scale: [1, 1.05],
                translateY: [0, -10],
                duration: 400,
                easing: 'easeOutCubic'
            });
            
            if (icon) {
                anime({
                    targets: icon,
                    rotate: [0, 360],
                    scale: [1, 1.2],
                    duration: 600,
                    easing: 'easeOutElastic(1, .6)'
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (isReducedMotion || !anime) {
                card.style.transform = '';
                return;
            }
            
            const icon = card.querySelector('.value-icon');
            
            anime({
                targets: card,
                scale: [1.05, 1],
                translateY: [-10, 0],
                duration: 400,
                easing: 'easeOutCubic'
            });
            
            if (icon) {
                anime({
                    targets: icon,
                    rotate: [360, 0],
                    scale: [1.2, 1],
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
        });
    });
}

// Animate value card elements
function animateValueCardElements(card, immediate = false) {
    const icon = card.querySelector('.value-icon');
    const title = card.querySelector('h3');
    const description = card.querySelector('p');
    
    if (immediate || isReducedMotion || !anime) {
        // Immediate reveal for reduced motion
        if (icon) {
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
        }
        if (title) {
            title.style.opacity = '1';
            title.style.transform = 'none';
        }
        if (description) {
            description.style.opacity = '1';
            description.style.transform = 'none';
        }
        return;
    }
    
    // Icon animation
    if (icon) {
        anime({
            targets: icon,
            scale: [0, 1],
            rotate: [180, 0],
            duration: 600,
            delay: 200,
            easing: 'easeOutElastic(1, .8)'
        });
    }
    
    // Title animation
    if (title) {
        anime({
            targets: title,
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 600,
            delay: 400,
            easing: 'easeOutCubic'
        });
    }
    
    // Description animation
    if (description) {
        anime({
            targets: description,
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 600,
            delay: 600,
            easing: 'easeOutCubic'
        });
    }
}

// Parallax system
function initializeParallaxSystem() {
    if (isReducedMotion) return;
    
    const parallaxElements = [
        { selector: '.floating-shapes', speed: 0.2 },
        { selector: '.particles-system', speed: 0.1 },
        { selector: '.morphing-bg', speed: 0.05 },
        { selector: '.gradient-mesh', speed: 0.15 }
    ];
    
    let ticking = false;
    
    function updateParallax() {
        if (ticking) return;
        
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(({ selector, speed }) => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    const yPos = scrolled * speed;
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
            });
            
            ticking = false;
        });
        
        ticking = true;
    }
    
    window.addEventListener('scroll', updateParallax, { passive: true });
}

// Start master animation
function startMasterAnimation() {
    if (masterTimeline && !isReducedMotion) {
        masterTimeline.play();
    }
}

// Smooth scroll utility
function smoothScrollTo(target) {
    const targetPosition = target.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (!anime) return;
    
    if (document.hidden) {
        anime.running.forEach(animation => animation.pause());
    } else {
        anime.running.forEach(animation => animation.play());
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Animation error:', e.error);
});

// Export for external use
window.CodePlanet = {
    smoothScrollTo,
    particleSystem,
    cleanup: () => {
        if (particleSystem) particleSystem.cleanup();
        if (anime) anime.remove('*');
    }
};