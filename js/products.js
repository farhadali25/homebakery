// Product data
const allProducts = [
    {
        id: 1,
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with creamy frosting',
        price: 299,
        image: 'b1.jpeg',
        rating: 4.8,
        reviews: 245
    },
    {
        id: 2,
        name: 'Vanilla Cake',
        description: 'Classic vanilla cake, soft and delicious',
        price: 249,
        image: 'b2.jpeg',
        rating: 4.7,
        reviews: 189
    },
    {
        id: 3,
        name: 'Red Velvet Cake',
        description: 'Elegant red velvet with cream cheese frosting',
        price: 349,
        image: 'b3.jpeg',
        rating: 4.9,
        reviews: 312
    },
    {
        id: 4,
        name: 'Black Forest Cake',
        description: 'Cherry and chocolate layers, a classic favorite',
        price: 399,
        image: 'b4.jpeg',
        rating: 4.8,
        reviews: 267
    },
    {
        id: 5,
        name: 'Strawberry Cake',
        description: 'Fresh strawberry cake with whipped cream',
        price: 319,
        image: 'b5.jpeg',
        rating: 4.7,
        reviews: 198
    },
    {
        id: 6,
        name: 'Cheesecake',
        description: 'Creamy New York style cheesecake',
        price: 379,
        image: 'b6.jpeg',
        rating: 4.9,
        reviews: 423
    },
    {
        id: 7,
        name: 'Carrot Cake',
        description: 'Moist carrot cake with cream cheese icing',
        price: 289,
        image: 'b7.jpeg',
        rating: 4.6,
        reviews: 156
    },
    {
        id: 8,
        name: 'Lemon Cake',
        description: 'Zesty lemon cake with lemon glaze',
        price: 269,
        image: 'b8.jpeg',
        rating: 4.5,
        reviews: 134
    },
    {
        id: 9,
        name: 'Marble Cake',
        description: 'Beautiful swirl of chocolate and vanilla',
        price: 299,
        image: 'b9.jpeg',
        rating: 4.7,
        reviews: 201
    },
    {
        id: 10,
        name: 'Funfetti Cake',
        description: 'Colorful sprinkle cake with vanilla frosting',
        price: 279,
        image: 'b10.jpeg',
        rating: 4.6,
        reviews: 178
    }
];

let cart = [];
let filteredProducts = [...allProducts];

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    displayProducts(filteredProducts);
    updateCartBadge();
});

function displayProducts(products) {
    const productGrid = document.getElementById('productGrid');
    const noResults = document.getElementById('noResults');

    if (products.length === 0) {
        productGrid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const starRating = '⭐'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '✨' : '');
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-desc">${product.description}</div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 0.9rem;">
                    <span style="color: #F59E0B;">${starRating}</span>
                    <span style="color: #6B7280;">${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="product-price">₹${product.price}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sortOption = document.getElementById('sortSelect').value;

    // Filter by search term
    filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    // Sort
    if (sortOption === 'low-high') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-low') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('sortSelect').value = 'default';
    filteredProducts = [...allProducts];
    displayProducts(filteredProducts);
}

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    saveCartToLocalStorage();
    updateCartBadge();
    showToast(`✓ ${name} added to cart!`);
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartBadge();
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function handleLogin() {
    alert('Login page will be created next! 🔐');
}