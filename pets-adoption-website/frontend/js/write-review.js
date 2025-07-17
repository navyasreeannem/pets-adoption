document.addEventListener('DOMContentLoaded', function() {
    // Load navbar
    fetch('components/navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
        document.getElementById('logout-btn').addEventListener('click', logout);
      });
    
    // Pre-fill user name if available
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(user => {
          document.getElementById('userName').value = user.name || '';
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
        });
    }
    
    // Setup form submission
    document.getElementById('review-form').addEventListener('submit', submitReview);
  });
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  
  function submitReview(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Show loading status
    showStatus('Submitting your review...', 'loading');
    
    fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to submit review');
        }
        return response.json();
      })
      .then(data => {
        showStatus('Your review has been submitted successfully!', 'success');
        form.reset();
        
        // Redirect to resources page after 2 seconds
        setTimeout(() => {
          window.location.href = 'resources.html';
        }, 2000);
      })
      .catch(error => {
        console.error('Error:', error);
        showStatus(`Error: ${error.message}`, 'error');
      });
  }
  
  function showStatus(message, type) {
    const statusElement = document.getElementById('review-status');
    statusElement.textContent = message;
    statusElement.className = 'request-status';
    statusElement.classList.add(type);
    
    // If success, scroll to status message
    if (type === 'success') {
      statusElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  