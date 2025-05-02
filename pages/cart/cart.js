const cartCount = document.querySelector('.cart-count');
const cartBtn = document.getElementById('header-cart-btn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Quantity Adjustment
document.querySelectorAll('.qty-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const input = e.target.parentElement.querySelector('.qty-input');
        let value = parseInt(input.value);

        if (e.target.classList.contains('minus') && value > 1) {
            input.value = value - 1;
        } else if (e.target.classList.contains('plus')) {
            input.value = value + 1;
        }

        // Update cart total here (would connect to your backend)
    });
});

// Remove Item
document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
        if (confirm('Remove this item from your cart?')) {
            e.target.closest('.cart-item').remove();
            // Update cart total here
        }
    });
});

// 1. Add to Cart Function
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const product = {
        id: e.target.dataset.id,
        name: e.target.dataset.name,
        price: parseFloat(e.target.dataset.price),
        image: e.target.dataset.image,
        quantity: 1
      };
  
      addToCart(product);
      showAddedToCart(product.name);
    });
  });

  function addToCart(product) {
    // Check if item already exists
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push(product);
    }
  
    updateCart();
  }

  // 2. Update Cart UI & Storage
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // If on cart page, refresh items
    if (window.location.pathname.includes('cart.html')) {
      renderCartItems();
    }
  }

  // 3. Cart Page Rendering (for cart.html)
function renderCartItems() {
    const container = document.querySelector('.cart-items');
    if (!container) return;
  
    container.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-details">
          <h3>${item.name}</h3>
          <div class="item-price">$${item.price.toFixed(2)}</div>
          <div class="item-actions">
            <div class="quantity-selector">
              <button class="qty-btn minus">-</button>
              <input type="number" value="${item.quantity}" min="1" class="qty-input">
              <button class="qty-btn plus">+</button>
            </div>
            <button class="remove-item">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `).join('');
  
    // Add event listeners
    addCartItemListeners();
  }
  
  // 4. Cart Item Event Listeners
  function addCartItemListeners() {
    // Quantity changes
    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.closest('.cart-item').dataset.id;
        const input = e.target.parentElement.querySelector('.qty-input');
        let quantity = parseInt(input.value);
  
        if (e.target.classList.contains('minus') && quantity > 1) {
          quantity--;
        } else if (e.target.classList.contains('plus')) {
          quantity++;
        }
  
        input.value = quantity;
        updateCartItem(itemId, quantity);
      });
    });
  
    // Remove items
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.closest('.cart-item').dataset.id;
        removeFromCart(itemId);
      });
    });
  }
  
  // 5. Cart Modifiers
  function updateCartItem(itemId, quantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) item.quantity = quantity;
    updateCart();
  }
  
  function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
  }
  
  // 6. Visual Feedback
  function showAddedToCart(productName) {
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.innerHTML = `
      <i class="fas fa-check-circle"></i> 
      ${productName} added to cart!
    `;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 3000);
  }
  
  // Initialize
  updateCart();
  if (window.location.pathname.includes('cart.html')) renderCartItems();