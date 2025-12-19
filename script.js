
const products = [
    {
        id: 1,
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with creamy frosting',
        price: 299,
        image: 'b1.jpeg'
    },
    {
        id: 2,
        name: 'Vanilla Cake',
        description: 'Classic vanilla cake, soft and delicious',
        price: 249,
        image: 'b2.jpeg'
    },
    {
        id: 3,
        name: 'Red Velvet Cake',
        description: 'Elegant red velvet with cream cheese frosting',
        price: 349,
        image: 'b3.jpeg'
    },
    {
        id: 4,
        name: 'Black Forest Cake',
        description: 'Cherry and chocolate layers, a classic favorite',
        price: 399,
        image: 'b4.jpeg'
    },
    {
        id: 5,
        name: 'Strawberry Cake',
        description: 'Fresh strawberry cake with whipped cream',
        price: 319,
        image: 'b5.jpeg'
    },
    {
        id: 6,
        name: 'Cheesecake',
        description: 'Creamy New York style cheesecake',
        price: 379,
        image: 'b6.jpeg'
    },
    {
        id: 7,
        name: 'Carrot Cake',
        description: 'Moist carrot cake with cream cheese icing',
        price: 289,
        image: 'b7.jpeg'
    },
    {
        id: 8,
        name: 'Lemon Cake',
        description: 'Zesty lemon cake with lemon glaze',
        price: 269,
        image: 'b8.jpeg'
    },
    {
        id: 9,
        name: 'Marble Cake',
        description: 'Beautiful swirl of chocolate and vanilla',
        price: 299,
        image: 'b9.jpeg'
    },
    {
        id: 10,
        name: 'Funfetti Cake',
        description: 'Colorful sprinkle cake with vanilla frosting',
        price: 279,
        image: 'b10.jpeg'
    }
];

let cart = [];

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartBadge();
    loadCartFromLocalStorage();
});

function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-desc">${product.description}</div>
                <div class="product-price">₹${product.price}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
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

function handleContactSubmit(event) {
    event.preventDefault();
    showToast('✓ Message sent! We will contact you soon.');
    event.target.reset();
}

function setActiveNav(event) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}
