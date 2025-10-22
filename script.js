// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.textContent = '☰';
        });
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // Dynamic Greeting Based on Time of Day
    function updateGreeting() {
        const greetingElement = document.getElementById('greeting');
        const hour = new Date().getHours();
        let greeting = 'Hello';

        if (hour < 12) greeting = 'Good Morning';
        else if (hour < 18) greeting = 'Good Afternoon';
        else greeting = 'Good Evening';

        greetingElement.textContent = `${greeting}, I'm Maryam Al Mobarak`;
    }
    updateGreeting();

    // Active section highlighting in navigation
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const headerHeight = document.querySelector('header').offsetHeight;

            if (window.scrollY >= (sectionTop - headerHeight - 50)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Add active class to navigation links
    const navLinksAll = document.querySelectorAll('.nav-links a');
    navLinksAll.forEach(link => {
        if (link.getAttribute('href') !== '#') {
            link.classList.remove('active');
        }
    });

    // Highlight active section on scroll
    window.addEventListener('scroll', highlightActiveSection);

    // Initial highlight
    highlightActiveSection();

    // Project card animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
            }
        });
    }, observerOptions);

    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Set card index for staggered animation
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.setProperty('--card-index', index.toString());
    });

    // Project Filtering System
    function initializeProjectFilter() {
        const projectsGrid = document.querySelector('.projects-grid');
        const projectCards = Array.from(document.querySelectorAll('.project-card'));

        // Create filter buttons
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';

        // Get all unique technologies
        const allTechs = new Set();
        projectCards.forEach(card => {
            const techElements = card.querySelectorAll('.project-tech span');
            techElements.forEach(tech => allTechs.add(tech.textContent.toLowerCase()));
        });

        // Create "All" filter button
        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.textContent = 'All';
        allButton.setAttribute('data-filter', 'all');
        filterContainer.appendChild(allButton);

        // Create filter buttons for each technology
        allTechs.forEach(tech => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = tech.charAt(0).toUpperCase() + tech.slice(1);
            button.setAttribute('data-filter', tech);
            filterContainer.appendChild(button);
        });

        // Insert filter buttons before projects grid
        projectsGrid.parentNode.insertBefore(filterContainer, projectsGrid);

        // Filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                // Filter projects
                projectCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        const cardTechs = Array.from(card.querySelectorAll('.project-tech span'))
                            .map(tech => tech.textContent.toLowerCase());

                        if (cardTechs.includes(filter)) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    }
                });
            });
        });
    }
    initializeProjectFilter();

    // Enhanced Form Validation with Feedback
    function initializeFormValidation() {
        const contactForm = document.getElementById('contactForm');
        const formGroups = document.querySelectorAll('.form-group');

        // Add real-time validation
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            group.appendChild(errorSpan);

            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                // Clear error when user starts typing
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    errorSpan.textContent = '';
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const inputs = contactForm.querySelectorAll('input, textarea');

            // Validate all fields
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Show success message
                showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();

                // In a real application, you would send the form data to a server here
                console.log('Form submitted successfully');
            } else {
                showFormMessage('Please fix the errors above.', 'error');
            }
        });

        function validateField(field) {
            const value = field.value.trim();
            const errorSpan = field.parentNode.querySelector('.error-message');
            let isValid = true;
            let errorMessage = '';

            // Required field validation
            if (field.hasAttribute('required') && value === '') {
                isValid = false;
                errorMessage = 'This field is required';
            }

            // Email validation
            if (field.type === 'email' && value !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }

            // Update field state
            if (!isValid) {
                field.classList.add('error');
                errorSpan.textContent = errorMessage;
            } else {
                field.classList.remove('error');
                errorSpan.textContent = '';
            }

            return isValid;
        }

        function showFormMessage(message, type) {
            // Remove existing messages
            const existingMessage = contactForm.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Create new message
            const messageDiv = document.createElement('div');
            messageDiv.className = `form-message ${type}`;
            messageDiv.textContent = message;

            // Add animation
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-10px)';

            contactForm.appendChild(messageDiv);

            // Animate in
            setTimeout(() => {
                messageDiv.style.opacity = '1';
                messageDiv.style.transform = 'translateY(0)';
            }, 10);

            // Auto remove after 5 seconds
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.style.opacity = '0';
                    messageDiv.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        if (messageDiv.parentNode) {
                            messageDiv.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }
    }
    initializeFormValidation();

    // Scroll Animations
    function initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.skill-tag, .project-card, .about-text p, .profile-img').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
    initializeScrollAnimations();

});

document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...

    // Fix for skills animation - trigger animation immediately
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        // Remove the fade-in class and add animate-in immediately
        skillsGrid.classList.remove('fade-in');
        skillsGrid.classList.add('animate-in');

        // Or use a small timeout to ensure the DOM is ready
        setTimeout(() => {
            skillsGrid.classList.add('animate-in');
        }, 100);
    }
});
