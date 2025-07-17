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
    
    // Load locations for filter
    loadLocations();
    
    // Load veterinary doctors
    loadDoctors();
    
    // Setup filter functionality
    document.getElementById('apply-filter').addEventListener('click', function() {
      loadDoctors(
        document.getElementById('location-filter').value,
        document.getElementById('specialization-filter').value
      );
    });
  });
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  
  function loadLocations() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    
    fetch('/api/doctors/locations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(locations => {
        const locationFilter = document.getElementById('location-filter');
        
        // Clear existing options except the first one
        while (locationFilter.options.length > 1) {
          locationFilter.remove(1);
        }
        
        // Add new location options
        locations.forEach(location => {
          const option = document.createElement('option');
          option.value = location;
          option.textContent = location;
          locationFilter.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error loading locations:', error);
      });
  }
  
  function loadDoctors(location = 'all', specialization = 'all') {
    const doctorsGrid = document.getElementById('doctors-grid');
    doctorsGrid.innerHTML = '<div class="loading">Loading veterinary doctors...</div>';
    
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    
    fetch(`/api/doctors?location=${location}&specialization=${specialization}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load doctors');
        }
        return response.json();
      })
      .then(doctors => {
        if (doctors.length === 0) {
          doctorsGrid.innerHTML = '<div class="no-doctors">No doctors available matching your criteria</div>';
          return;
        }
        
        doctorsGrid.innerHTML = '';
        doctors.forEach(doctor => {
          const doctorCard = document.createElement('div');
          doctorCard.className = 'doctor-card';
          doctorCard.innerHTML = `
            <img src="${doctor.imageUrl}" alt="Dr. ${doctor.name}">
            <div class="doctor-info">
              <h3>Dr. ${doctor.name}</h3>
              <p><strong>Specialization:</strong> ${doctor.specialization}</p>
              <p><strong>Hospital:</strong> ${doctor.hospital}</p>
              <p><strong>Location:</strong> ${doctor.location}</p>
              <button class="btn view-details-btn" data-id="${doctor._id}">View Details</button>
            </div>
          `;
          doctorsGrid.appendChild(doctorCard);
          
          // Add click event to view details button
          doctorCard.querySelector('.view-details-btn').addEventListener('click', function() {
            showDoctorDetails(doctor._id);
          });
        });
      })
      .catch(error => {
        console.error('Error:', error);
        doctorsGrid.innerHTML = `<div class="error">Error loading doctors: ${error.message}</div>`;
      });
  }
  
  function showDoctorDetails(doctorId) {
    const modal = document.getElementById('doctor-modal');
    const detailsContainer = document.getElementById('doctor-details-container');
    detailsContainer.innerHTML = '<div class="loading">Loading doctor details...</div>';
    modal.style.display = 'block';
    
    const token = localStorage.getItem('token');
    
    fetch(`/api/doctors/${doctorId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(doctor => {
        detailsContainer.innerHTML = `
          <div class="doctor-details">
            <img src="${doctor.imageUrl}" alt="Dr. ${doctor.name}">
            <div class="doctor-info-detailed">
              <h2>Dr. ${doctor.name}</h2>
              <p><strong>Age:</strong> ${doctor.age}</p>
              <p><strong>Specialization:</strong> ${doctor.specialization}</p>
              <p><strong>Experience:</strong> ${doctor.experience} years</p>
              <p><strong>Hospital:</strong> ${doctor.hospital}</p>
              <p><strong>Address:</strong> ${doctor.address}</p>
              <p><strong>Location:</strong> ${doctor.location}</p>
              <p><strong>Phone:</strong> ${doctor.phone}</p>
              <p><strong>Email:</strong> ${doctor.email}</p>
              <p><strong>Working Hours:</strong> ${doctor.workingHours}</p>
              <p><strong>About:</strong> ${doctor.about}</p>
              
              <div class="doctor-services">
                <h3>Services Offered</h3>
                <ul>
                  ${doctor.services.map(service => `<li>${service}</li>`).join('')}
                </ul>
              </div>
              
              <a href="tel:${doctor.phone}" class="btn primary-btn">Call Now</a>
              <a href="mailto:${doctor.email}" class="btn secondary-btn">Email</a>
            </div>
          </div>
        `;
      })
      .catch(error => {
        console.error('Error:', error);
        detailsContainer.innerHTML = `<div class="error">Error loading doctor details: ${error.message}</div>`;
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
  