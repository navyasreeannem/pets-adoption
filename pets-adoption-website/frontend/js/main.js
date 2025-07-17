document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const loginForm = document.getElementById('login-form-element');
    const signupForm = document.getElementById('signup-form-element');
    const toggleLogin = document.getElementById('toggle-login');
    const toggleSignup = document.getElementById('toggle-signup');
    const splitContainer = document.querySelector('.split-container');
    const loginImage = document.getElementById('login-image');
    const signupImage = document.getElementById('signup-image');
    
    // Toggle password visibility
    const togglePassword = (inputId, toggleId) => {
      const input = document.getElementById(inputId);
      const toggleIcon = document.getElementById(toggleId);
      toggleIcon.addEventListener('click', () => {
        input.type = input.type === 'password' ? 'text' : 'password';
        toggleIcon.classList.toggle('fa-eye');
        toggleIcon.classList.toggle('fa-eye-slash');
      });
    };
    
    togglePassword('login-password', 'toggle-login-password');
    togglePassword('signup-password', 'toggle-signup-password');
    
    // Toggle between login and signup forms
    toggleSignup.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-form').classList.add('hidden');
      document.getElementById('signup-form').classList.remove('hidden');
      splitContainer.classList.add('signup-active');
      loginImage.classList.add('hidden');
      signupImage.classList.remove('hidden');
    });
    
    toggleLogin.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('signup-form').classList.add('hidden');
      document.getElementById('login-form').classList.remove('hidden');
      splitContainer.classList.remove('signup-active');
      signupImage.classList.add('hidden');
      loginImage.classList.remove('hidden');
    });
    
    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      
      // Show loading state
      const loginButton = loginForm.querySelector('button');
      const originalButtonText = loginButton.textContent;
      loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      loginButton.disabled = true;
      
      try {
        // For demo purposes - in a real app, this would be an API call
        if (email === 'admin@example.com' && password === 'admin123') {
          // Admin login
          localStorage.setItem('token', 'admin-demo-token');
          sessionStorage.setItem('userRole', 'admin');
          
          // Show success message
          showMessage('login-form', 'success', 'Login successful! Redirecting...');
          
          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = 'home.html';
          }, 1500);
        } else if (email && password) {
          // Regular user login
          localStorage.setItem('token', 'user-demo-token');
          sessionStorage.setItem('userRole', 'user');
          
          // Show success message
          showMessage('login-form', 'success', 'Login successful! Redirecting...');
          
          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = 'home.html';
          }, 1500);
        } else {
          // Invalid credentials
          throw new Error('Invalid email or password');
        }
      } catch (error) {
        // Show error message
        showMessage('login-form', 'error', error.message || 'Login failed. Please try again.');
        
        // Reset button
        loginButton.textContent = originalButtonText;
        loginButton.disabled = false;
      }
    });
    
    // Handle signup form submission
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();
      
      // Validate form
      if (!name || !email || !password) {
        showMessage('signup-form', 'error', 'Please fill in all fields');
        return;
      }
      
      // Email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        showMessage('signup-form', 'error', 'Please enter a valid email address');
        return;
      }
      
      // Password validation (at least 6 characters)
      if (password.length < 6) {
        showMessage('signup-form', 'error', 'Password must be at least 6 characters long');
        return;
      }
      
      // Show loading state
      const signupButton = signupForm.querySelector('button');
      const originalButtonText = signupButton.textContent;
      signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
      signupButton.disabled = true;
      
      try {
        // For demo purposes - in a real app, this would be an API call
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store user data (in a real app, this would be handled by the server)
        localStorage.setItem('token', 'new-user-demo-token');
        sessionStorage.setItem('userRole', 'user');
        
        // Show success message
        showMessage('signup-form', 'success', 'Account created successfully! Redirecting...');
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = 'home.html';
        }, 1500);
      } catch (error) {
        // Show error message
        showMessage('signup-form', 'error', error.message || 'Registration failed. Please try again.');
        
        // Reset button
        signupButton.textContent = originalButtonText;
        signupButton.disabled = false;
      }
    });
    
    // Function to show messages (success/error)
    function showMessage(formId, type, message) {
      const form = document.getElementById(formId);
      
      // Remove any existing message
      const existingMessage = form.querySelector('.message');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      // Create message element
      const messageElement = document.createElement('p');
      messageElement.className = `message ${type}`;
      messageElement.textContent = message;
      
      // Style based on type
      if (type === 'error') {
        messageElement.style.color = '#e74c3c';
      } else if (type === 'success') {
        messageElement.style.color = '#2ecc71';
      }
      
      // Add to form
      form.appendChild(messageElement);
      
      // Auto-remove after 5 seconds for errors
      if (type === 'error') {
        setTimeout(() => {
          messageElement.remove();
        }, 5000);
      }
    }
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect to home page
      window.location.href = 'home.html';
    }
  });
  