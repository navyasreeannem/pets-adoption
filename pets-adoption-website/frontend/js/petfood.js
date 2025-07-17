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
    
    // Load pet food
    loadPetFood();
    
    // Setup filter functionality
    document.getElementById('apply-filter').addEventListener('click', function() {
      loadPetFood(
        document.getElementById('pet-type-filter').value,
        document.getElementById('food-type-filter').value,
        document.getElementById('age-filter').value
      );
    });
  });
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  
  function loadPetFood(petType = 'all', foodType = 'all', age = 'all') {
    const foodGrid = document.getElementById('food-grid');
    foodGrid.innerHTML = '<div class="loading">Loading pet food recommendations...</div>';
    
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    
    fetch(`/api/petfood?petType=${petType}&foodType=${foodType}&age=${age}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load pet food');
        }
        return response.json();
      })
      .then(foods => {
        if (foods.length === 0) {
          foodGrid.innerHTML = '<div class="no-food">No pet food available matching your criteria</div>';
          return;
        }
        
        foodGrid.innerHTML = '';
        foods.forEach(food => {
          const foodCard = document.createElement('div');
          foodCard.className = 'food-card';
          foodCard.innerHTML = `
            <img src="${food.imageUrl}" alt="${food.name}">
            <div class="food-info">
              <h3>${food.name}</h3>
              <p><strong>For:</strong> ${food.petType}</p>
              <p><strong>Type:</strong> ${food.foodType}</p>
              <p><strong>Age:</strong> ${food.ageGroup}</p>
              <button class="btn view-details-btn" data-id="${food._id}">View Details</button>
            </div>
          `;
          foodGrid.appendChild(foodCard);
          
          foodCard.querySelector('.view-details-btn').addEventListener('click', function() {
            showFoodDetails(food._id);
          });
        });
      })
      .catch(error => {
        console.error('Error:', error);
        foodGrid.innerHTML = `<div class="error">Error loading pet food: ${error.message}</div>`;
      });
  }
  
  function showFoodDetails(foodId) {
    const modal = document.getElementById('food-modal');
    const detailsContainer = document.getElementById('food-details-container');
    detailsContainer.innerHTML = '<div class="loading">Loading food details...</div>';
    modal.style.display = 'block';
    
    const token = localStorage.getItem('token');
    
    fetch(`/api/petfood/${foodId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(food => {
        detailsContainer.innerHTML = `
          <div class="food-details">
            <img src="${food.imageUrl}" alt="${food.name}">
            <div class="food-info-detailed">
              <h2>${food.name}</h2>
              <p><strong>Brand:</strong> ${food.brand}</p>
              <p><strong>For:</strong> ${food.petType}</p>
              <p><strong>Type:</strong> ${food.foodType}</p>
              <p><strong>Age Group:</strong> ${food.ageGroup}</p>
              <p><strong>Price Range:</strong> ${food.priceRange}</p>
              <p><strong>Description:</strong> ${food.description}</p>
              
              <div class="food-ingredients">
                <h3>Key Ingredients</h3>
                <ul>
                  ${food.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
              </div>
              
              <div class="food-benefits">
                <h3>Benefits</h3>
                <ul>
                  ${food.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
              </div>
              
              <div class="food-feeding-guide">
                <h3>Feeding Guide</h3>
                <p>${food.feedingGuide}</p>
              </div>
              
              ${food.purchaseLink ? `<a href="${food.purchaseLink}" target="_blank" class="btn primary-btn">Buy Now</a>` : ''}
            </div>
          </div>
        `;
      })
      .catch(error => {
        console.error('Error:', error);
        detailsContainer.innerHTML = `<div class="error">Error loading food details: ${error.message}</div>`;
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
  