document.addEventListener('DOMContentLoaded', function() {
    // Load navbar
    fetch('components/navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
        document.getElementById('logout-btn').addEventListener('click', logout);
      });
    
    // Check if petId is in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('petId');
    
    if (petId) {
      // Pre-fill form with pet details
      prefillFormWithPetDetails(petId);
    }
    
    // Setup form submission
    document.getElementById('adoption-request-form').addEventListener('submit', submitAdoptionRequest);
  });
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  
  function prefillFormWithPetDetails(petId) {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    
    fetch(`/api/pets/${petId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(pet => {
        document.getElementById('petName').value = pet.name;
        document.getElementById('petBreed').value = pet.breed;
        document.getElementById('petAge').value = pet.age;
        document.getElementById('petGender').value = pet.gender.toLowerCase();
      })
      .catch(error => {
        console.error('Error:', error);
        showStatus('Error loading pet details. Please try again.', 'error');
      });
  }
  
  function submitAdoptionRequest(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Show loading status
    showStatus('Submitting your adoption request...', 'loading');
    
    fetch('/api/adoption-requests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to submit adoption request');
        }
        return response.json();
      })
      .then(data => {
        showStatus('Your adoption request has been sent to the admin!', 'success');
        form.reset();
      })
      .catch(error => {
        console.error('Error:', error);
        showStatus(`Error: ${error.message}`, 'error');
      });
  }
  
  function showStatus(message, type) {
    const statusElement = document.getElementById('request-status');
    statusElement.textContent = message;
    statusElement.className = 'request-status';
    statusElement.classList.add(type);
    
    // If success, scroll to status message
    if (type === 'success') {
      statusElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Clear status after 5 seconds if it's a success message
    if (type === 'success') {
      setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = 'request-status';
      }, 5000);
    }
  }
  