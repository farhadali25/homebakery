

let cart = [];

// Load data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    updateCartBadge();
    initContactForm();
});

function initContactForm() {
    const form = document.querySelector('form');
    form.addEventListener('submit', handleContactSubmit);
}

function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!name || !email || !subject || !message) {
        showToast('❌ Please fill all required fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showToast('❌ Please enter a valid email address', 'error');
        return;
    }

    // Create contact message object
    const contactMessage = {
        id: 'MSG' + Date.now(),
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
        submittedAt: new Date().toLocaleString(),
        status: 'pending',
        read: false
    };

    // Save to localStorage
    saveContactMessage(contactMessage);

    // Show success message
    document.getElementById('successMessage').classList.add('show');
    showToast('✅ Message sent successfully! We\'ll get back to you soon.', 'success');

    // Reset form
    event.target.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
        document.getElementById('successMessage').classList.remove('show');
    }, 5000);
}

function saveContactMessage(message) {
    // Get existing messages
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];

    // Add new message
    messages.push(message);

    // Save to localStorage
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    // Also save to user's message history if logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            if (!users[userIndex].messages) {
                users[userIndex].messages = [];
            }
            users[userIndex].messages.push(message);
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Position toast
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = '6px';
    toast.style.color = 'white';
    toast.style.zIndex = '9999';
    toast.style.animation = 'slideIn 0.3s ease';
    toast.style.fontWeight = '600';

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

    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

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

// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Get all contact messages (for admin)
function getAllContactMessages() {
    return JSON.parse(localStorage.getItem('contactMessages')) || [];
}

// Get unread messages count (for admin)
function getUnreadMessagesCount() {
    const messages = getAllContactMessages();
    return messages.filter(m => !m.read).length;
}

// Mark message as read (for admin)
function markMessageAsRead(messageId) {
    const messages = getAllContactMessages();
    const message = messages.find(m => m.id === messageId);
    
    if (message) {
        message.read = true;
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    }
}

// Delete contact message (for admin)
function deleteContactMessage(messageId) {
    const messages = getAllContactMessages();
    const filtered = messages.filter(m => m.id !== messageId);
    localStorage.setItem('contactMessages', JSON.stringify(filtered));
}
