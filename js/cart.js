// Product data (same as main script.js)
const products = [
    { id: 1, name: 'Chocolate Cake', price: 299, image: 'b1.jpeg' },
    { id: 2, name: 'Vanilla Cake', price: 249, image: 'b2.jpeg' },
    { id: 3, name: 'Red Velvet Cake', price: 349, image: 'b3.jpeg' },
    { id: 4, name: 'Black Forest Cake', price: 399, image: 'b4.jpeg' },
    { id: 5, name: 'Strawberry Cake', price: 319, image: 'b5.jpeg' },
    { id: 6, name: 'Cheesecake', price: 379, image: 'b6.jpeg' },
    { id: 7, name: 'Carrot Cake', price: 289, image: 'b7.jpeg' },
    { id: 8, name: 'Lemon Cake', price: 269, image: 'b8.jpeg' },
    { id: 9, name: 'Marble Cake', price: 299, image: 'b9.jpeg' },
    { id: 10, name: 'Funfetti Cake', price: 279, image: 'b10.jpeg' }
];

// Coupon codes with discounts (percentage)
const coupons = {
    'SAVE10': 10,
    'SAVE20': 20,
    'WELCOME': 5,
    'BIRTHDAY': 15,
    'CAKE2': 10
};

let cart = [];
let appliedDiscount = 0;

// Load cart on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    displayCartItems();
    updateCartBadge();
});

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function displayCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const emptyMessage = document.getElementById('emptyCartMessage');
    const summary = document.getElementById('cartSummary');

    if (cart.length === 0) {
        container.innerHTML = '';
        emptyMessage.style.display = 'block';
        summary.style.display = 'none';
        return;
    }

    // Group items by product ID to count quantities
    const groupedCart = {};
    cart.forEach(item => {
        if (groupedCart[item.id]) {
            groupedCart[item.id].quantity += 1;
        } else {
            groupedCart[item.id] = { ...item, quantity: 1 };
        }
    });

    emptyMessage.style.display = 'none';
    summary.style.display = 'block';

    let html = '<div style="display: grid; gap: 20px; margin-bottom: 40px;">';

    Object.values(groupedCart).forEach(item => {
        const product = products.find(p => p.id === item.id);
        const itemTotal = item.price * item.quantity;
        
        html += `
            <div class="cart-item-card" style="background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; display: grid; grid-template-columns: 120px 1fr 150px; gap: 20px; align-items: center;">
                <div style="width: 100%; height: 100px; border-radius: 8px; overflow: hidden; background: #F3F4F6;">
                    <img src="${product.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                
                <div>
                    <h3 style="font-size: 1.1rem; font-weight: 600; color: var(--secondary-color); margin-bottom: 8px;">${item.name}</h3>
                    <p style="color: #6B7280; font-size: 0.95rem; margin-bottom: 10px;">Price: <strong>₹${item.price}</strong></p>
                    
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                        <button onclick="decreaseQuantity(${item.id})" style="background: #F3F4F6; border: none; width: 30px; height: 30px; border-radius: 4px; cursor: pointer; font-weight: 600; color: var(--secondary-color);">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span id="qty-${item.id}" style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
                        <button onclick="increaseQuantity(${item.id})" style="background: #F3F4F6; border: none; width: 30px; height: 30px; border-radius: 4px; cursor: pointer; font-weight: 600; color: var(--secondary-color);">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div style="text-align: right;">
                    <p style="color: #6B7280; font-size: 0.9rem; margin-bottom: 10px;">Item Total</p>
                    <h3 style="font-size: 1.5rem; color: var(--primary-color); font-weight: 700; margin-bottom: 15px;">₹${itemTotal}</h3>
                    <button onclick="removeFromCart(${item.id})" style="background: #FEE2E2; color: #DC2626; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; width: 100%; font-weight: 600;">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
    updateOrderSummary();
}

function increaseQuantity(productId) {
    cart.push({ id: productId, name: products.find(p => p.id === productId).name, price: products.find(p => p.id === productId).price });
    saveCartToLocalStorage();
    displayCartItems();
    updateCartBadge();
    showToast('Item quantity updated');
}

function decreaseQuantity(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
        saveCartToLocalStorage();
        displayCartItems();
        updateCartBadge();
        showToast('Item quantity updated');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
    displayCartItems();
    updateCartBadge();
    showToast('Item removed from cart');
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateOrderSummary() {
    // Calculate subtotal
    let subtotal = 0;
    const groupedCart = {};
    
    cart.forEach(item => {
        if (groupedCart[item.id]) {
            groupedCart[item.id].quantity += 1;
        } else {
            groupedCart[item.id] = { ...item, quantity: 1 };
        }
    });

    Object.values(groupedCart).forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const deliveryCharge = subtotal > 0 ? 50 : 0;
    const discount = Math.round((subtotal * appliedDiscount) / 100);
    const totalAmount = subtotal + deliveryCharge - discount;

    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('deliveryCharge').textContent = `₹${deliveryCharge}`;
    document.getElementById('discount').textContent = `-₹${discount}`;
    document.getElementById('totalAmount').textContent = `₹${totalAmount}`;
}

function applyCoupon() {
    const couponCode = document.getElementById('couponInput').value.toUpperCase().trim();
    const message = document.getElementById('couponMessage');

    if (!couponCode) {
        message.style.color = '#DC2626';
        message.textContent = '❌ Please enter a coupon code';
        message.style.display = 'block';
        return;
    }

    if (coupons[couponCode]) {
        appliedDiscount = coupons[couponCode];
        message.style.color = '#10B981';
        message.textContent = `✅ Coupon applied! You got ${appliedDiscount}% discount`;
        message.style.display = 'block';
        updateOrderSummary();
    } else {
        appliedDiscount = 0;
        message.style.color = '#DC2626';
        message.textContent = '❌ Invalid coupon code';
        message.style.display = 'block';
    }
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

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Calculate final total
    let subtotal = 0;
    const groupedCart = {};
    
    cart.forEach(item => {
        if (groupedCart[item.id]) {
            groupedCart[item.id].quantity += 1;
        } else {
            groupedCart[item.id] = { ...item, quantity: 1 };
        }
    });

    Object.values(groupedCart).forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const deliveryCharge = 50;
    const discount = Math.round((subtotal * appliedDiscount) / 100);
    const totalAmount = subtotal + deliveryCharge - discount;

    // Store order data
    const orderData = {
        items: groupedCart,
        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        discount: discount,
        totalAmount: totalAmount,
        couponApplied: appliedDiscount > 0 ? appliedDiscount : 'None',
        orderDate: new Date().toLocaleString()
    };

    localStorage.setItem('orderData', JSON.stringify(orderData));
    showToast('✅ Proceeding to checkout...');
    
    // Redirect to checkout page (will be created next)
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 1500);
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

// Available Coupon Codes for user reference (optional)
console.log('Available Coupon Codes:', Object.keys(coupons).join(', '));