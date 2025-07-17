document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and has admin role
    checkAdminAuthentication();
    
    // Initialize sidebar toggle
    initSidebar();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize charts
    initCharts();
    
    // Set up logout functionality
    document.getElementById('logout-btn').addEventListener('click', logout);
  });
  
  // Check if user is authenticated and has admin role
  function checkAdminAuthentication() {
    const token = localStorage.getItem('token');
    const userRole = sessionStorage.getItem('userRole');
    
    if (!token) {
      // Redirect to login page if not logged in
      window.location.href = '../user/login.html';
      return;
    }
    
    if (userRole !== 'admin') {
      // Redirect to home page if not an admin
      alert('You do not have permission to access the admin dashboard.');
      window.location.href = '../user/home.html';
    }
  }
  
  // Initialize sidebar toggle functionality
  function initSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('sidebar-active');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickOnToggle = sidebarToggle.contains(event.target);
      
      if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth < 992 && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        mainContent.classList.remove('sidebar-active');
      }
    });
    
    // Set active menu item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    
    menuItems.forEach(item => {
      if (item.getAttribute('href') === currentPage) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  // Load dashboard data from API
  function loadDashboardData() {
    // In a real application, you would fetch this data from your API
    // For now, we'll use sample data
    
    // Update dashboard stats
    updateDashboardStats({
      totalPets: 42,
      pendingAdoptions: 12,
      totalUsers: 156,
      totalVolunteers: 28
    });
    
    // Load recent pets
    // In a real app, this would come from an API call
  }
  
  // Update dashboard statistics
  function updateDashboardStats(stats) {
    document.getElementById('total-pets').textContent = stats.totalPets;
    document.getElementById('pending-adoptions').textContent = stats.pendingAdoptions;
    document.getElementById('total-users').textContent = stats.totalUsers;
    document.getElementById('total-volunteers').textContent = stats.totalVolunteers;
  }
  
  // Initialize charts
  function initCharts() {
    // Adoption statistics chart
    const adoptionCtx = document.getElementById('adoptionChart').getContext('2d');
    
    // Sample data - in a real app, this would come from your API
    const adoptionData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Adoptions',
          data: [5, 8, 12, 7, 10, 15],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Applications',
          data: [10, 15, 20, 12, 18, 25],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.3
        }
      ]
    };
    
    new Chart(adoptionCtx, {
      type: 'line',
      data: adoptionData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }
  
  // Logout function
  function logout() {
    // Clear authentication data
    localStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    
    // Redirect to login page
    window.location.href = '../user/login.html';
  }
  