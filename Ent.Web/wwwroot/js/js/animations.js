// ==========================================
// ENGINUVITY NEXUS TECHNOLOGIES
// Animation JavaScript - Visual Effects
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // Stagger Animation for Cards
    // ==========================================
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // ==========================================
    // Parallax Effect for Hero Background
    // ==========================================
    const heroBackground = document.querySelector('.hero-background');

    if (heroBackground) {
        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            if (scrolled < window.innerHeight) {
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    // ==========================================
    // Typing Effect for Hero Title (Optional)
    // ==========================================
    const heroTitle = document.querySelector('.hero-title[data-typing]');

    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let charIndex = 0;

        function typeCharacter() {
            if (charIndex < text.length) {
                heroTitle.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeCharacter, 50);
            }
        }

        // Start typing after a short delay
        setTimeout(typeCharacter, 500);
    }

    // ==========================================
    // Counter Animation for Statistics (if added)
    // ==========================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.ceil(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        updateCounter();
    }

    // Observe counters
    const counters = document.querySelectorAll('[data-counter]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-counter'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ==========================================
    // Hover Effect Enhancement for Cards
    // ==========================================
    const cardElements = document.querySelectorAll('.card');

    cardElements.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });

    // ==========================================
    // Button Ripple Effect
    // ==========================================
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ==========================================
    // Split Menu Interaction (Dynamic Preview)
    // ==========================================
    document.addEventListener('DOMContentLoaded', function () {
        const dropdownLinks = document.querySelectorAll('.dropdown-list a');

        dropdownLinks.forEach(link => {
            link.addEventListener('mouseenter', function () {
                const title = this.getAttribute('data-title');
                const desc = this.getAttribute('data-desc');

                // Find parent menu to scope the update
                const parentMenu = this.closest('.split-menu');
                if (parentMenu) {
                    const previewContent = parentMenu.querySelector('.preview-content');
                    if (previewContent) {
                        previewContent.innerHTML = `
                            <h3>${title}</h3>
                            <p>${desc}</p>
                        `;
                    }
                }
            });
        });
    });

});

// ==========================================
// Add CSS for Ripple Effect Dynamically
// ==========================================
const style = document.createElement('style');
style.textContent = `
  .btn {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ==========================================
// Particle Network Animation (Mouse Tracing)
// ==========================================
window.addEventListener('load', function () {
    console.log('ENT Animation: Window loaded, initializing Particle Network...');

    try {
        const canvas = document.getElementById('hero-canvas');
        if (canvas) {
            console.log('ENT Animation: Canvas found, starting animation loop.');
            const ctx = canvas.getContext('2d');
            let width, height;
            let particles = [];

            // Configuration
            const particleCount = 60; // Number of particles
            const connectionDistance = 150; // Distance to connect particles
            const mouseDistance = 200; // Distance to connect to mouse
            const particleSpeed = 0.5; // Speed of movement

            // Mouse state
            let mouse = {
                x: null,
                y: null
            };

            window.addEventListener('mousemove', function (e) {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });

            window.addEventListener('mouseleave', function () {
                mouse.x = null;
                mouse.y = null;
            });

            // Resize handler
            function resize() {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
            }

            window.addEventListener('resize', resize);
            resize();

            // Particle class
            class Particle {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.vx = (Math.random() - 0.5) * particleSpeed;
                    this.vy = (Math.random() - 0.5) * particleSpeed;
                    this.size = Math.random() * 2 + 1;
                    const colors = ['#00d9ff', '#7b2cbf', '#ffffff', '#00f0ff'];
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    // Bounce off edges
                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                }
            }

            // Initialize particles
            function initProperties() {
                particles = [];
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }
            }
            initProperties();

            // Animation loop
            function animate() {
                ctx.clearRect(0, 0, width, height);

                particles.forEach((p, index) => {
                    p.update();
                    p.draw();

                    // Connect to other particles
                    for (let i = index; i < particles.length; i++) {
                        const p2 = particles[i];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < connectionDistance) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(123, 44, 191, ${1 - distance / connectionDistance})`;
                            ctx.lineWidth = 1;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }

                    // Connect to mouse
                    if (mouse.x != null) {
                        const dx = p.x - mouse.x;
                        const dy = p.y - mouse.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < mouseDistance) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(0, 217, 255, ${1 - distance / mouseDistance})`;
                            ctx.lineWidth = 1.5;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(mouse.x, mouse.y);
                            ctx.stroke();
                        }
                    }
                });

                requestAnimationFrame(animate);
            }

            animate();
        } else {
            console.error('ENT Animation: Canvas element #hero-canvas not found!');
        }
    } catch (e) {
        console.error('ENT Animation: Error in particle network:', e);
    }
});
