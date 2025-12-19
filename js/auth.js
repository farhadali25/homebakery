// Authentication Script

let cart = [];
let currentUser = null;

// Load data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    loadCurrentUser();
    updateCartBadge();
});

function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = event.target.closest('button');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validation
    if (!validateEmail(email)) {
        showError('loginEmail', 'Invalid email format');
        return;
    }

    if (password.length < 6) {
        showError('loginPassword', 'Password must be at least 6 characters');
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showToast('❌ Invalid email or password', 'error');
        return;
    }

    // Login successful
    const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
    };

    localStorage.setItem('currentUser', JSON.stringify(userSession));
    currentUser = userSession;

    // Show success message
    document.getElementById('loginSuccess').classList.add('show');
    showToast('✅ Login successful!', 'success');

    // Redirect after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Validation
    if (!name) {
        showError('registerName', 'Name is required');
        return;
    }

    if (!validateEmail(email)) {
        showError('registerEmail', 'Invalid email format');
        return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
        showError('registerPhone', 'Phone must be 10 digits');
        return;
    }

    if (password.length < 6) {
        showError('registerPassword', 'Password must be at least 6 characters');
        return;
    }

    if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        showError('registerEmail', 'Email already registered');
        return;
    }

    // Create new user
    const newUser = {
        id: 'USER' + Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password, // In production, use hashed password
        createdAt: new Date().toISOString(),
        addresses: [],
        orderHistory: []
    };

    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login
    const userSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(userSession));
    currentUser = userSession;

    // Show success message
    document.getElementById('registerSuccess').classList.add('show');
    showToast('✅ Account created successfully!', 'success');

    // Redirect after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function resetPassword(event) {
    event.preventDefault();
    showToast('📧 Password reset link sent to your email', 'info');
}

function socialLogin(provider) {
    showToast(`🔗 ${provider.toUpperCase()} login coming soon!`, 'info');
}

function socialRegister(provider) {
    showToast(`🔗 ${provider.toUpperCase()} registration coming soon!`, 'info');
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    errorMessage.textContent = message;

    // Remove error on input focus
    input.addEventListener('focus', function() {
        formGroup.classList.remove('error');
    }, { once: true });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Color based on type
    if (type === 'error') {
        toast.style.background = '#EF4444';
    } else if (type === 'info') {
        toast.style.background = '#3B82F6';
    } else {
        toast.style.background = '#10B981';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        if (cart.length > 0) {
            badge.textContent = cart.length;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function loadCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        currentUser = JSON.parse(userStr);
    }
}

// Logout function (call from anywhere)
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showToast('✅ Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Get current user function
function getCurrentUser() {
    return currentUser || JSON.parse(localStorage.getItem('currentUser'));
}

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('currentUser');
}