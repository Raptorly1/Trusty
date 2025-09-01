// Main JavaScript file for Trusty website

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    for (let anchor of anchorLinks) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Handle quiz interactions if on a module page with quizzes
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    if(quizOptions.length > 0) {
        quizOptions.forEach(option => {
            option.addEventListener('click', function() {
                const questionContainer = this.closest('.quiz-container');
                const options = questionContainer.querySelectorAll('.quiz-option');
                const feedback = questionContainer.querySelector('.feedback');
                
                // Clear previous selections
                options.forEach(opt => {
                    opt.classList.remove('selected', 'correct', 'incorrect');
                });
                
                // Mark this option as selected
                this.classList.add('selected');
                
                // Check if answer is correct (based on data attribute)
                if(this.getAttribute('data-correct') === 'true') {
                    this.classList.add('correct');
                    if(feedback) {
                        feedback.textContent = 'Correct! Good job!';
                        feedback.classList.remove('error');
                        feedback.classList.add('success');
                        feedback.style.display = 'block';
                    }
                } else {
                    this.classList.add('incorrect');
                    if(feedback) {
                        feedback.textContent = 'Not quite. Try again!';
                        feedback.classList.remove('success');
                        feedback.classList.add('error');
                        feedback.style.display = 'block';
                    }
                    
                    // Show the correct answer
                    options.forEach(opt => {
                        if(opt.getAttribute('data-correct') === 'true') {
                            opt.classList.add('correct');
                        }
                    });
                }
            });
        });
    }

    // Mobile menu toggle (for smaller screens)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if(mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
});
