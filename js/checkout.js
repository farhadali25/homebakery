// Product data
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

let orderData = {};

// Load order data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadOrderData();
    displayOrderSummary();
    updateCartBadge();
});

function loadOrderData() {
    const saved = localStorage.getItem('orderData');
    if (saved) {
        orderData = JSON.parse(saved);
    } else {
        alert('No order found. Redirecting to cart...');
        window.location.href = 'cart.html';
    }
}

function displayOrderSummary() {
    const itemsContainer = document.getElementById('orderItems');
    let html = '';

    for (const [productId, itemData] of Object.entries(orderData.items || {})) {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #F9FAFB; border-radius: 6px;">
                    <div>
                        <div style="font-weight: 600; color: var(--secondary-color);">${product.name}</div>
                        <div style="font-size: 0.85rem; color: #6B7280;">Qty: ${itemData.quantity}</div>
                    </div>
                    <div style="text-align: right; font-weight: 600; color: var(--primary-color);">
                        ₹${itemData.price * itemData.quantity}
                    </div>
                </div>
            `;
        }
    }

    itemsContainer.innerHTML = html;

    // Update summary
    document.getElementById('summarySubtotal').textContent = `₹${orderData.subtotal}`;
    document.getElementById('summaryDelivery').textContent = `₹${orderData.deliveryCharge}`;
    document.getElementById('summaryDiscount').textContent = `-₹${orderData.discount}`;
    document.getElementById('summaryTotal').textContent = `₹${orderData.totalAmount}`;
}

function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const street = document.getElementById('street').value.trim();
    const city = document.getElementById('city').value.trim();
    const pincode = document.getElementById('pincode').value.trim();

    if (!fullName || !phone || !email || !street || !city || !pincode) {
        showToast('❌ Please fill all required fields');
        return false;
    }

    if (phone.length !== 10 || isNaN(phone)) {
        showToast('❌ Invalid phone number (must be 10 digits)');
        return false;
    }

    if (!email.includes('@')) {
        showToast('❌ Invalid email address');
        return false;
    }

    return true;
}

function placeOrder() {
    if (!validateForm()) {
        return;
    }

    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const street = document.getElementById('street').value.trim();
    const city = document.getElementById('city').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    const instructions = document.getElementById('instructions').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // Create complete order object
    const completeOrder = {
        orderId: 'ORD' + Date.now(),
        customerName: fullName,
        phone: phone,
        email: email,
        deliveryAddress: {
            street: street,
            city: city,
            pincode: pincode,
            instructions: instructions
        },
        paymentMethod: paymentMethod,
        items: orderData.items,
        subtotal: orderData.subtotal,
        deliveryCharge: orderData.deliveryCharge,
        discount: orderData.discount,
        totalAmount: orderData.totalAmount,
        couponApplied: orderData.couponApplied,
        orderDate: new Date().toLocaleString(),
        status: 'Confirmed',
        expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };

    // Save order to localStorage
    const allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
    allOrders.push(completeOrder);
    localStorage.setItem('allOrders', JSON.stringify(allOrders));

    // Save current order
    localStorage.setItem('lastOrder', JSON.stringify(completeOrder));

    // Clear cart
    localStorage.removeItem('cart');
    localStorage.removeItem('orderData');

    showToast('✅ Order placed successfully!');
    
    // Redirect to order confirmation
    setTimeout(() => {
        window.location.href = 'order-confirmation.html?orderId=' + completeOrder.orderId;
    }, 1500);
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.getElementById('cartBadge');
    if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
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