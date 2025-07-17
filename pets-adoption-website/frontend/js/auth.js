// Authentication JavaScript

// Base URL for API calls
const API_URL = 'http://localhost:5000/api';

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember')?.checked || false;
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('#login-form button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        // Make API request
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        
        // If remember me is checked, store email in localStorage
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        // Redirect to profile page
        window.location.href = 'pages/profile.html';
        
    } catch (error) {
        console.error('Login error:', error);
        showAuthError(error.message);
    }
}

// Handle registration form submission
async function handleRegister(e) {
    e.preventDefault();
    
    // Get form data
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const termsAgreed = document.getElementById('terms').checked;
    
    // Validate form data
    if (password !== confirmPassword) {
        showAuthError('Passwords do not match');
        return;
    }
    
    if (!termsAgreed) {
        showAuthError('You must agree to the Terms of Service and Privacy Policy');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('#register-form button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        // Make API request
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        
        // Show success message and redirect
        showAuthSuccess('Account created successfully! Redirecting to your profile...');
        
        // Redirect to profile page after a short delay
        setTimeout(() => {
            window.location.href = 'pages/profile.html';
        }, 2000);
        
    } catch (error) {
        console.error('Registration error:', error);
        showAuthError(error.message);
    }
}

// Handle forgot password
async function handleForgotPassword(e) {
    e.preventDefault();
    
    // Get email
    const email = prompt('Please enter your email address to reset your password:');
    
    if (!email) return;
    
    try {
        // Make API request
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Password reset request failed');
        }
        
        alert('Password reset instructions have been sent to your email address.');
        
    } catch (error) {
        console.error('Forgot password error:', error);
        alert(`Error: ${error.message}`);
    }
}

// Show authentication error message
function showAuthError(message) {
    // Remove any existing messages
    removeAuthMessages();
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Add to form
    const form = document.querySelector('.auth-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    form.insertBefore(errorDiv, submitBtn);
}

// Show authentication success message
function showAuthSuccess(message) {
    // Remove any existing messages
    removeAuthMessages();
    
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Add to form
    const form = document.querySelector('.auth-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    form.insertBefore(successDiv, submitBtn);
}

// Remove authentication messages
function removeAuthMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => msg.remove());
}

// Fill remembered email if available
function fillRememberedEmail() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const emailInput = document.getElementById('email');
    
    if (rememberedEmail && emailInput) {
        emailInput.value = rememberedEmail;
        
        // Check the remember me checkbox
        const rememberCheckbox = document.getElementById('remember');
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }
}

// Initialize authentication page
function initAuth() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Redirect to profile page if already logged in
        if (!window.location.pathname.includes('profile.html')) {
            window.location.href = 'pages/profile.html';
        }
    }
    
    // Add event listeners to forms
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Fill remembered email
        fillRememberedEmail();
        
        // Add event listener to forgot password link
        const forgotPasswordLink = document.querySelector('.forgot-password');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', handleForgotPassword);
        }
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Add event listeners to social auth buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Social login is not implemented in this demo.');
        });
    });
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);
