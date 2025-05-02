// Toggle Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');
// Dark/Light Mode Toggle
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');


hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});


themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

links.forEach(link => {
    link.addEventListener('click', (e) => {
        // Remove 'active' class from all links
        links.forEach(item => item.classList.remove('active'));
        // Add 'active' class to clicked link
        e.target.classList.add('active');
    });
});

searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        alert(`Searching for: ${searchTerm}`); // Replace with actual search logic
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

document.getElementById('header-cart-btn').addEventListener('click', () => {
    window.location.href = 'pages/cart/cart.html';
  });