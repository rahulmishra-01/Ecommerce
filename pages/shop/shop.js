import products from "../../scripts/products.js";

console.log(products)

// Pagination settings
let currentPage = 1;
const productsPerPage = 12; // Show 12 products per page
let filteredProducts = [...products]; // Copy of all products for filtering
// const cartCount = document.querySelector('.cart-count');
const cartBtn = document.getElementById('header-cart-btn');

// let cart = JSON.parse(localStorage.getItem('cart')) || [];


// Initialize
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  setupFilters();
  updateResultsCount()
});

// Filter setup
function setupFilters() {
  // Color filter
  document.querySelectorAll('.color-chip').forEach(chip => {
    chip.addEventListener('click', function() {
      this.classList.toggle('active');
      applyFilters();
    });
  });

  // Size filter
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
      applyFilters();
    });
  });

  // Category filter
  document.querySelectorAll('input[name="category"]').forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });

  // Price filter
  document.querySelector('.price-slider').addEventListener('input', function() {
    document.getElementById('price-value').textContent = `$${this.value}`;
    applyFilters();
  });

  // Clear filters
  document.querySelector('.clear-filters').addEventListener('click', clearFilters);

  // Sort dropdown
  document.querySelector('.sort-options').addEventListener('change', applyFilters);
}

// Main filter function
function applyFilters() {
  // Get active filters
  const activeColors = [...document.querySelectorAll('.color-chip.active')]
    .map(chip => chip.dataset.color);
  
  const activeSizes = [...document.querySelectorAll('.size-btn.active')]
    .map(btn => btn.textContent.trim());
  
  const activeCategories = [...document.querySelectorAll('input[name="category"]:checked')]
    .map(checkbox => checkbox.value);
  
  const maxPrice = parseInt(document.querySelector('.price-slider').value);
  const sortBy = document.querySelector('.sort-options').value;

  // Reset to all products
  filteredProducts = [...products];

  // Apply filters
  if (activeColors.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      product.colors.some(color => activeColors.includes(color))
    );
  }

  if (activeSizes.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      product.sizes.some(size => activeSizes.includes(size))
    );
  }

  if (activeCategories.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      activeCategories.includes(product.category)
    );
  }

  // Price filter
  filteredProducts = filteredProducts.filter(product => 
  product.price <= maxPrice
  );

  // Apply sorting
  sortProducts(sortBy);

  // Reset to page 1 when filters change
  currentPage = 1;
  
  // Update UI
  updateResultsCount();
  renderProducts();
}

// Sorting function
function sortProducts(sortBy) {
  switch(sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      // Assuming newer products have higher IDs
      filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    default: // 'featured'
      // Default sorting (original order)
      break;
  }
}

// Clear all filters
function clearFilters() {
  // Clear color filters
  document.querySelectorAll('.color-chip.active').forEach(chip => {
    chip.classList.remove('active');
  });

  // Clear size filters
  document.querySelectorAll('.size-btn.active').forEach(btn => {
    btn.classList.remove('active');
  });

  // Clear category filters
  document.querySelectorAll('input[name="category"]:checked').forEach(checkbox => {
    checkbox.checked = false;
  });

  // Reset price slider
  const priceSlider = document.querySelector('.price-slider');
  priceSlider.value = priceSlider.max;
  document.getElementById('price-value').textContent = `$${priceSlider.max}`;

  // Reset sort dropdown
  document.querySelector('.sort-options').value = 'featured';

  // Reapply filters (which will reset everything)
  applyFilters();
}

// Update product count display
function updateResultsCount() {
  const countElement = document.querySelector('.results-count');
  countElement.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'Product' : 'Products'}`;
}

// Updated renderProducts function
function renderProducts() {
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  const grid = document.querySelector('.products-grid');
  grid.innerHTML = paginatedProducts.map(product => `
    <div class="product-card" data-id="${product.id}">
      ${product.inStock ? '' : '<div class="out-of-stock">Sold Out</div>'}
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="price">₹${product.price.toFixed(2)}</div>
        <div class="rating">${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))} (${product.reviews})</div>
        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}" ${!product.inStock ? 'disabled' : ''}>
          ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  `).join('');
  
  renderPagination();
}

  function renderPagination() {
    const totalPages = Math.ceil(products.length / productsPerPage);
    const pagination = document.querySelector('.pagination');
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
      <button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i> Prev
      </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage, endPage;
    
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBefore = Math.floor(maxVisiblePages / 2);
      const maxPagesAfter = Math.ceil(maxVisiblePages / 2) - 1;
      
      if (currentPage <= maxPagesBefore) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfter >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBefore;
        endPage = currentPage + maxPagesAfter;
      }
    }
    
    // First page + ellipsis if needed
    if (startPage > 1) {
      paginationHTML += `
        <button class="page-btn" data-page="1">1</button>
        ${startPage > 2 ? '<span class="ellipsis">...</span>' : ''}
      `;
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    }
    
    // Last page + ellipsis if needed
    if (endPage < totalPages) {
      paginationHTML += `
        ${endPage < totalPages - 1 ? '<span class="ellipsis">...</span>' : ''}
        <button class="page-btn" data-page="${totalPages}">${totalPages}</button>
      `;
    }
    
    // Next button
    paginationHTML += `
      <button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''}>
        Next <i class="fas fa-chevron-right"></i>
      </button>
    `;
    
    pagination.innerHTML = paginationHTML;
    
    // Add event listeners
    document.querySelectorAll('.page-btn:not(.prev):not(.next):not(.ellipsis)').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page);
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
    
    document.querySelector('.page-btn.prev')?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    
    document.querySelector('.page-btn.next')?.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  renderProducts(products)

  document.getElementById("header-cart-btn").addEventListener("click",() => {
    window.location.href = "../cart/cart.html"
  })

  // Cart array and DOM elements
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCount = document.querySelector('.cart-count');

// Add to cart event listeners
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('add-to-cart')) {
    const button = e.target;
    const product = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: parseFloat(button.dataset.price),
      image: button.dataset.image,
      quantity: 1
    };
    addToCart(product);
  }
});

// Add item to cart
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push(product);
  }
  
  updateCart();
  showCartFeedback(product.name);
}

// Update cart in storage and UI
function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Update cart counter
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Visual feedback when adding to cart
function showCartFeedback(productName) {
  const feedback = document.createElement('div');
  feedback.className = 'cart-feedback';
  feedback.innerHTML = `
    <i class="fas fa-check-circle"></i> 
    ${productName} added to cart!
  `;
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.style.opacity = '0';
    setTimeout(() => feedback.remove(), 300);
  }, 2000);
}

// Initialize cart count on page load
updateCartCount();