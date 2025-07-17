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
    
    // Load reviews
    loadReviews();
  });
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  
  function loadReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = '<div class="loading">Loading reviews...</div>';
    
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    
    fetch('/api/reviews', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load reviews');
        }
        return response.json();
      })
      .then(reviews => {
        if (reviews.length === 0) {
          reviewsContainer.innerHTML = '<div class="no-reviews">No reviews available yet. Be the first to share your experience!</div>';
          return;
        }
        
        reviewsContainer.innerHTML = '';
        reviews.forEach(review => {
          const reviewCard = document.createElement('div');
          reviewCard.className = 'review-card';
          
          // Format date
          const reviewDate = new Date(review.createdAt);
          const formattedDate = reviewDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          reviewCard.innerHTML = `
            <div class="review-header">
              <h3>${review.userName}</h3>
              <span class="review-date">${formattedDate}</span>
            </div>
            <div class="review-pet-info">
              <p><strong>Pet:</strong> ${review.petType} - ${review.petName}</p>
            </div>
            <div class="review-content">
              <p>${review.content}</p>
            </div>
            ${review.tips ? `
              <div class="review-tips">
                <h4>Tips from ${review.userName}:</h4>
                <p>${review.tips}</p>
              </div>
            ` : ''}
          `;
          
          reviewsContainer.appendChild(reviewCard);
        });
      })
      .catch(error => {
        console.error('Error:', error);
        reviewsContainer.innerHTML = `<div class="error">Error loading reviews: ${error.message}</div>`;
      });
  }
  