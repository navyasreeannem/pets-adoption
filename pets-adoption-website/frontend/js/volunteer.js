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
    
    // Load volunteer opportunities
    loadVolunteerPets();
    
    // Setup filter functionality
    document.getElementById('apply-filter').addEventListener('click', function() {
      loadVolunteerPets(
        document.getElementById('pet-type-filter').value,
        document.getElementById('duration-filter').value
      );
    });
  });
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  
  function loadVolunteerPets(type = 'all', duration = 'all') {
    const petsGrid = document.getElementById('volunteer-pets-grid');
    petsGrid.innerHTML = '<div class="loading">Loading volunteer opportunities...</div>';
    
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    
    fetch(`/api/volunteer-pets?type=${type}&duration=${duration}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load volunteer opportunities');
        }
        return response.json();
      })
      .then(pets => {
        if (pets.length === 0) {
          petsGrid.innerHTML = '<div class="no-pets">No volunteer opportunities available matching your criteria</div>';
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
              <p><strong>Duration:</strong> ${pet.volunteerDuration}</p>
              <p><strong>Location:</strong> ${pet.location}</p>
              <button class="btn volunteer-btn" data-id="${pet._id}">Volunteer</button>
            </div>
          `;
          petsGrid.appendChild(petCard);
          
          // Add click event to volunteer button
          petCard.querySelector('.volunteer-btn').addEventListener('click', function() {
            showVolunteerDetails(pet._id);
          });
        });
      })
      .catch(error => {
        console.error('Error:', error);
        petsGrid.innerHTML = `<div class="error">Error loading volunteer opportunities: ${error.message}</div>`;
      });
  }
  
  function showVolunteerDetails(petId) {
    const modal = document.getElementById('volunteer-modal');
    const detailsContainer = document.getElementById('volunteer-details-container');
    detailsContainer.innerHTML = '<div class="loading">Loading details...</div>';
    modal.style.display = 'block';
    
    const token = localStorage.getItem('token');
    
    fetch(`/api/volunteer-pets/${petId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(pet => {
        detailsContainer.innerHTML = `
          <div class="pet-details">
            <img src="${pet.imageUrl}" alt="${pet.name}">
            <div class="pet-info-detailed">
              <h2>${pet.name}</h2>
              <p><strong>Breed:</strong> ${pet.breed}</p>
              <p><strong>Age:</strong> ${pet.age}</p>
              <p><strong>Gender:</strong> ${pet.gender}</p>
              <p><strong>Volunteer Duration:</strong> ${pet.volunteerDuration}</p>
              <p><strong>Tasks Required:</strong> ${pet.volunteerTasks}</p>
              <p><strong>Description:</strong> ${pet.description}</p>
              
              <div class="owner-info">
                <h3>Contact Information</h3>
                <p><strong>Owner:</strong> ${pet.owner.name}</p>
                <p><strong>Phone:</strong> ${pet.owner.phone}</p>
                <p><strong>Email:</strong> ${pet.owner.email}</p>
                <p><strong>Address:</strong> ${pet.owner.address}</p>
              </div>
              
              <a href="request-volunteer.html?petId=${pet._id}" class="btn primary-btn">Request to Volunteer</a>
            </div>
          </div>
        `;
      })
      .catch(error => {
        console.error('Error:', error);
        detailsContainer.innerHTML = `<div class="error">Error loading details: ${error.message}</div>`;
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
  