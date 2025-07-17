// Login and Registration JavaScript

// Base URL for API calls
const API_URL = 'http://localhost:5000/api';

// Switch between login and register tabs
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab contents
            contents.forEach(content => content.classList.add('hidden'));
            // Show the selected tab content
            const contentId = `${tab.dataset.tab}-content`;
            document.getElementById(contentId).classList.remove('hidden');
        });
    });
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        // Save user data and token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            id: data._id,
            username: data.username,
            email: data.email,
            isAdmin: data.isAdmin
        }));
        
        // Redirect based on user role
        if (data.isAdmin) {
            window.location.href = 'admin/dashboard.html';
        } else {
            window.location.href = 'user/profile.html';
        }
        
    } catch (error) {
        showError('login-form', error.message);
    }
}

// Handle registration form submission
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        // Save user data and token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            id: data._id,
            username: data.username,
            email: data.email,
            isAdmin: data.isAdmin
        }));
        
        // Show success message
        showSuccess('register-form', 'Registration successful! Redirecting...');
        
        // Redirect to profile page after a short delay
        setTimeout(() => {
            window.location.href = 'user/profile.html';
        }, 1500);
        
    } catch (error) {
        showError('register-form', error.message);
    }
}

// Show error message
function showError(formId, message) {
    const form = document.getElementById(formId);
    
    // Remove any existing error message
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and append error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    form.appendChild(errorDiv);
}

// Show success message
function showSuccess(formId, message) {
    const form = document.getElementById(formId);
    
    // Remove any existing messages
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const existingSuccess = form.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create and append success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    form.appendChild(successDiv);
}

// Initialize the page
function init() {
    setupTabs();
    
    // Add event listeners to forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Run initialization when the page loads
document.addEventListener('DOMContentLoaded', init);
