document.addEventListener("DOMContentLoaded", function() {
    // Check if user is logged in
    checkUserAuthentication();
    
    // Initialize Bootstrap components
    initBootstrapComponents();
    
    // Set up navigation links
    setupNavigationLinks();
    
    // Check user role and show/hide admin links
    checkUserRole();
    
    // Set up carousel auto-play with longer interval
    setupCarousel();
    
    // Load featured pets
    loadFeaturedPets();
    
    // Set up logout functionality
    document.getElementById('logout-btn').addEventListener('click', logout);
});

function checkUserAuthentication() {
    const token = localStorage.getItem("token");
    if (!token) {
        // If no token found, redirect to login page
        // Uncomment the line below when login page is ready
        // window.location.href = "login.html";
    } else {
        // Fetch user data if needed
        fetchUserData(token);
    }
}

function fetchUserData(token) {
    // Fetch user profile data from API
    fetch('/api/users/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return response.json();
    })
    .then(userData => {
        // Store user role in session storage
        sessionStorage.setItem("userRole", userData.role);
        // Update UI based on user role
        checkUserRole();
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
}

function checkUserRole() {
    const userRole = sessionStorage.getItem("userRole");
    
    // Show admin links if user is admin
    if (userRole === "admin") {
        document.getElementById("adminApprovalsLink").classList.remove("d-none");
        document.getElementById("vetManagementLink").classList.remove("d-none");
    }
}

function initBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Initialize dropdowns
    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.map(function(dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });
}

function setupNavigationLinks() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Add click event listeners to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If link doesn't have href or is # prevent default
            if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // Remove active class from all links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

function setupCarousel() {
    // Get the carousel element
    const carousel = document.getElementById('petCarousel');
    
    // Create a Bootstrap carousel instance with custom options
    const carouselInstance = new bootstrap.Carousel(carousel, {
        interval: 5000, // 5 seconds per slide
        wrap: true,     // Continuous loop
        pause: 'hover'  // Pause on hover
    });
    
    // Add event listeners for carousel
    carousel.addEventListener('slide.bs.carousel', function() {
        // You can add animations or tracking here
    });
}

// Load featured pets from API
function loadFeaturedPets() {
    const featuredPetsContainer = document.getElementById('featured-pets-container');
    if (!featuredPetsContainer) return;
    
    // Get token for authenticated requests
    const token = localStorage.getItem('token');
    
    // Fetch featured pets from API
    fetch('/api/pets/featured', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch featured pets');
        }
        return response.json();
    })
    .then(pets => {
        // Clear loading spinner
        featuredPetsContainer.innerHTML = '';
        
        // If no pets found
        if (pets.length === 0) {
            featuredPetsContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p>No featured pets available at the moment. Check back soon!</p>
                </div>
            `;
            return;
        }
        
        // Display each pet in a card
        pets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'col-md-4 mb-4';
            petCard.innerHTML = `
                <div class="card h-100">
                    <img src="${pet.imageUrl || 'https://via.placeholder.com/300x200?text=Pet+Image'}" class="card-img-top" alt="${pet.name}">
                    <div class="card-body">
                        <h5 class="card-title">${pet.name}</h5>
                        <p class="card-text">
                            <span class="badge bg-primary">${pet.species}</span>
                            <span class="badge bg-secondary">${pet.breed}</span>
                            <span class="badge bg-info">${pet.age} years</span>
                        </p>
                        <p class="card-text">${pet.description.substring(0, 100)}...</p>
                    </div>
                    <div class="card-footer bg-white border-top-0">
                        <a href="pet-details.html?id=${pet._id}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            `;
            featuredPetsContainer.appendChild(petCard);
        });
    })
    .catch(error => {
        console.error('Error loading featured pets:', error);
        featuredPetsContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger" role="alert">
                    Failed to load featured pets. Please try again later.
                </div>
            </div>
        `;
    });
}

// For demonstration purposes - if API is not yet available
// This function can be used to show sample data
function loadSampleFeaturedPets() {
    const featuredPetsContainer = document.getElementById('featured-pets-container');
    if (!featuredPetsContainer) return;
    
    // Clear loading spinner
    featuredPetsContainer.innerHTML = '';
    
    // Sample pet data
    const samplePets = [
        {
            _id: '1',
            name: 'Max',
            species: 'Dog',
            breed: 'Golden Retriever',
            age: 2,
            description: 'Max is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks.',
            imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=612&q=80'
        },
        {
            _id: '2',
            name: 'Luna',
            species: 'Cat',
            breed: 'Siamese',
            age: 1.5,
            description: 'Luna is a curious and affectionate Siamese cat who enjoys lounging in sunny spots and playing with string toys.',
            imageUrl: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
        },
        {
            _id: '3',
            name: 'Charlie',
            species: 'Dog',
            breed: 'Beagle',
            age: 3,
            description: 'Charlie is a sweet and gentle Beagle who loves to sniff around and make new friends. He\'s great with children and other pets.',
            imageUrl: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
        }
    ];
    
    // Display each pet in a card
    samplePets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'col-md-4 mb-4';
        petCard.innerHTML = `
            <div class="card h-100">
                <img src="${pet.imageUrl}" class="card-img-top" alt="${pet.name}">
                <div class="card-body">
                    <h5 class="card-title">${pet.name}</h5>
                    <p class="card-text">
                        <span class="badge bg-primary">${pet.species}</span>
                        <span class="badge bg-secondary">${pet.breed}</span>
                        <span class="badge bg-info">${pet.age} years</span>
                    </p>
                    <p class="card-text">${pet.description.substring(0, 100)}...</p>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <a href="pet-details.html?id=${pet._id}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        `;
        featuredPetsContainer.appendChild(petCard);
    });
}

// Logout function
function logout() {
    // Clear authentication token
    localStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    
    // Show logout notification
    showNotification('You have been logged out successfully', 'success');
    
    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Show notification
function showNotification(message, type = 'info', duration = 3000) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.role = 'alert';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Initialize Bootstrap alert
    const bsAlert = new bootstrap.Alert(notification);
    
    // Auto-dismiss after duration
    setTimeout(() => {
        bsAlert.close();
    }, duration);
    
    // Remove from DOM after animation
    notification.addEventListener('closed.bs.alert', function() {
        notification.remove();
    });
}

// If API is not yet available, use sample data
// Comment this out when real API is ready
document.addEventListener("DOMContentLoaded", function() {
    // Use this instead of loadFeaturedPets() if API is not ready
    loadSampleFeaturedPets();
});
 