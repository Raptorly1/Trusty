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
    
    // Print functionality for cheatsheet
    const printCheatsheetBtn = document.getElementById('print-cheatsheet');
    if(printCheatsheetBtn) {
        printCheatsheetBtn.addEventListener('click', function() {
            const cheatsheet = document.querySelector('.cheatsheet');
            const printWindow = window.open('', '', 'width=800,height=600');
            
            printWindow.document.write(`
                <html>
                <head>
                    <title>My Digital Safety Checklist - Trusty</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h2 { color: #4285F4; }
                        .checklist-item { margin-bottom: 15px; }
                        .checklist-item input { margin-right: 10px; }
                    </style>
                </head>
                <body>
                    <h2>My Digital Safety Checklist</h2>
                    <div class="checklist">
                        <div class="checklist-item">
                            <input type="checkbox"> Is my software updated?
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox"> Did this message come from a trusted source?
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox"> Am I being rushed into a decision?
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox"> Is this request unusual or suspicious?
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox"> Should I verify this with a direct phone call?
                        </div>
                    </div>
                    <p style="margin-top: 30px;">Provided by Trusty Digital Safety Course</p>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            setTimeout(() => { printWindow.close(); }, 1000);
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
    
    // Password strength meter
    const passwordPhraseInput = document.getElementById('password-phrase');
    const generatePasswordBtn = document.getElementById('generate-password');
    const passwordResult = document.getElementById('password-result');
    const strongPassword = document.getElementById('strong-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if(generatePasswordBtn) {
        generatePasswordBtn.addEventListener('click', function() {
            const phrase = passwordPhraseInput.value;
            if(!phrase) return;
            
            // Simple password generation algorithm
            let password = '';
            const words = phrase.split(' ');
            
            // Get first letter of each word
            words.forEach(word => {
                if(word.length > 0) {
                    // Randomly capitalize some letters
                    const firstChar = Math.random() > 0.5 ? 
                        word.charAt(0).toUpperCase() : 
                        word.charAt(0).toLowerCase();
                    password += firstChar;
                }
            });
            
            // Add a random number and symbol
            const randomNum = Math.floor(Math.random() * 1000) + 1;
            const symbols = ['!', '@', '#', '$', '%', '&', '*'];
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            
            password += randomNum + randomSymbol;
            
            // Display the result
            strongPassword.textContent = password;
            passwordResult.style.display = 'block';
            
            // Simple strength calculation
            const strength = calculatePasswordStrength(password);
            strengthBar.style.width = `${strength}%`;
            
            if(strength < 30) {
                strengthBar.style.backgroundColor = '#EA4335';
                strengthText.textContent = 'Weak password';
            } else if(strength < 70) {
                strengthBar.style.backgroundColor = '#FBBC05';
                strengthText.textContent = 'Moderate password';
            } else {
                strengthBar.style.backgroundColor = '#34A853';
                strengthText.textContent = 'Strong password';
            }
        });
    }
    
    // Calculate password strength
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length contribution (up to 40%)
        const lengthContribution = Math.min(password.length * 5, 40);
        strength += lengthContribution;
        
        // Character variety contribution (up to 60%)
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[^a-zA-Z0-9]/.test(password);
        
        const varietyScore = (hasLowercase ? 15 : 0) + 
                            (hasUppercase ? 15 : 0) + 
                            (hasNumbers ? 15 : 0) + 
                            (hasSymbols ? 15 : 0);
        
        strength += varietyScore;
        return strength;
    }
    
    // Step-by-step guide functionality
    const nextStepButtons = document.querySelectorAll('.next-step');
    const restartButton = document.querySelector('.restart');
    
    if(nextStepButtons.length > 0) {
        nextStepButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentStep = this.closest('.step');
                const nextStep = currentStep.nextElementSibling;
                
                currentStep.style.display = 'none';
                if(nextStep) {
                    nextStep.style.display = 'block';
                }
            });
        });
    }
    
    if(restartButton) {
        restartButton.addEventListener('click', function() {
            const steps = document.querySelectorAll('.step');
            steps.forEach((step, index) => {
                if(index === 0) {
                    step.style.display = 'block';
                } else {
                    step.style.display = 'none';
                }
            });
        });
    }
});
