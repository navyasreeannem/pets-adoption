document.addEventListener('DOMContentLoaded', function() {
    // Load navbar
    fetch('components/navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
        
        // Add active class to current page in navbar
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-links a').forEach(link => {
          if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
          }
        });
        
        // Setup logout functionality
        document.getElementById('logout-btn').addEventListener('click', logout);
      });
    
    // Load available pets
    loadPets();
    
    // Setup filter functionality
    document.getElementById('apply-filter').addEventListener('click', function() {
      loadPets(
        document.getElementById('pet-type-filter').value,
        document.getElementById('age-filter').value
      );
    });
  });
  
  function logout() {
    // Clear JWT token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = 'login.html';
  }
  
  function loadPets(type = 'all', age = 'all') {
    const petsGrid = document.getElementById('pets-grid');
    petsGrid.innerHTML = '<div class="loading">Loading available pets...</div>';
    
    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    
    // Fetch pets from backend
    fetch(`/api/pets?type=${type}&age=${age}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load pets');
        }
        return response.json();
      })
      .then(pets => {
        if (pets.length === 0) {
          petsGrid.innerHTML = '<div class="no-pets">No pets available matching your criteria</div>';
          return;
        }
        
        petsGrid.innerHTML = '';
        pets.forEach(pet => {
          const petCard = document.createElement('div');
          petCard.className = 'pet-card';
          petCard.innerHTML = `
            <img src="${pet.imageUrl}" alt="${pet.name}">
            <div class="pet-info">
              <h3>${pet.name}</h3>
              <p><strong>Breed:</strong> ${pet.breed}</p>
              <p><strong>Age:</strong> ${pet.age}</p>
              <p><strong>Gender:</strong> ${pet.gender}</p>
              <button class="btn adopt-btn" data-id="${pet._id}">Adopt</button>
            </div>
          `;
          petsGrid.appendChild(petCard);
          
          // Add click event to adopt button
          petCard.querySelector('.adopt-btn').addEventListener('click', function() {
            showPetDetails(pet._id);
          });
        });
      })
      .catch(error => {
        console.error('Error:', error);
        petsGrid.innerHTML = `<div class="error">Error loading pets: ${error.message}</div>`;
      });
  }
  
  function showPetDetails(petId) {
    const modal = document.getElementById('pet-modal');
    const petDetailsContainer = document.getElementById('pet-details-container');
    petDetailsContainer.innerHTML = '<div class="loading">Loading pet details...</div>';
    modal.style.display = 'block';
    
    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    
    // Fetch pet details from backend
    fetch(`/api/pets/${petId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(pet => {
        petDetailsContainer.innerHTML = `
          <div class="pet-details">
            <img src="${pet.imageUrl}" alt="${pet.name}">
            <div class="pet-info-detailed">
              <h2>${pet.name}</h2>
              <p><strong>Breed:</strong> ${pet.breed}</p>
              <p><strong>Age:</strong> ${pet.age}</p>
              <p><strong>Gender:</strong> ${pet.gender}</p>
              <p><strong>Description:</strong> ${pet.description}</p>
              
              <div class="owner-info">
                <h3>Contact Information</h3>
                <p><strong>Owner:</strong> ${pet.owner.name}</p>
                <p><strong>Phone:</strong> ${pet.owner.phone}</p>
                <p><strong>Email:</strong> ${pet.owner.email}</p>
                <p><strong>Address:</strong> ${pet.owner.address}</p>
              </div>
              
              <a href="request-adoption.html?petId=${pet._id}" class="btn primary-btn">Request Adoption</a>
            </div>
          </div>
        `;
      })
      .catch(error => {
        console.error('Error:', error);
        petDetailsContainer.innerHTML = `<div class="error">Error loading pet details: ${error.message}</div>`;
      });
    
    // Close modal when clicking on the X
    document.querySelector('.close-modal').addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  