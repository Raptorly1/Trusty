/**
 * Password Builder Tool
 * Interactive element for Module 5: Passwords & Privacy
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find the password builder elements
    const passwordBuilder = document.querySelector('.password-builder');
    
    // Only initialize if the password builder exists on this page
    if (!passwordBuilder) return;
    
    const phraseInput = document.getElementById('password-phrase');
    const generateButton = document.getElementById('generate-password');
    const resultDiv = document.getElementById('password-result');
    const strongPasswordEl = document.getElementById('strong-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    // Add event listener to the generate button
    generateButton.addEventListener('click', function() {
        const phrase = phraseInput.value.trim();
        
        if (!phrase) {
            alert('Please enter a phrase first!');
            return;
        }
        
        // Generate a strong password from the phrase
        const strongPassword = generateStrongPassword(phrase);
        
        // Display the result
        strongPasswordEl.textContent = strongPassword;
        resultDiv.style.display = 'block';
        
        // Calculate and show password strength
        const strength = calculatePasswordStrength(strongPassword);
        updateStrengthMeter(strength);
    });
    
    /**
     * Generates a strong password from a user phrase
     */
    function generateStrongPassword(phrase) {
        // Get first letter of each word in the phrase
        let password = phrase.split(' ')
            .map(word => word.charAt(0))
            .join('');
        
        // Add some complexity - capitalize some letters
        password = password.split('')
            .map((char, index) => index % 2 === 0 ? char.toUpperCase() : char)
            .join('');
        
        // Add numbers - use the length of the phrase and current year
        const year = new Date().getFullYear();
        password += phrase.length + String(year).slice(-2);
        
        // Add special characters
        const specialChars = ['!', '@', '#', '$', '%', '&', '*'];
        password += specialChars[Math.floor(Math.random() * specialChars.length)];
        
        return password;
    }
    
    /**
     * Calculates password strength on a scale of 0-100
     */
    function calculatePasswordStrength(password) {
        let score = 0;
        
        // Length
        score += Math.min(password.length * 4, 40);
        
        // Complexity - check for different character types
        if (/[A-Z]/.test(password)) score += 15; // Uppercase
        if (/[a-z]/.test(password)) score += 15; // Lowercase
        if (/[0-9]/.test(password)) score += 15; // Numbers
        if (/[^A-Za-z0-9]/.test(password)) score += 15; // Special chars
        
        return Math.min(score, 100);
    }
    
    /**
     * Updates the strength meter based on password score
     */
    function updateStrengthMeter(score) {
        // Set the width of the strength bar
        strengthBar.style.width = score + '%';
        
        // Set color of the strength bar
        if (score >= 80) {
            strengthBar.style.backgroundColor = '#4CAF50'; // Green
            strengthText.textContent = 'Excellent!';
        } else if (score >= 60) {
            strengthBar.style.backgroundColor = '#FFC107'; // Yellow
            strengthText.textContent = 'Good';
        } else {
            strengthBar.style.backgroundColor = '#F44336'; // Red
            strengthText.textContent = 'Weak - try a longer phrase';
        }
    }
});
