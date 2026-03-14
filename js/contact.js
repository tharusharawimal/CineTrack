// Contact Page Specific JavaScript

function handleContactForm(event) {
    event.preventDefault();

    if (!validateContactForm()) {
        return false;
    }

    // Build message object
    var message = {
        id: Date.now(),
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim(),
        created_at: new Date().toLocaleString()
    };

    // Save to localStorage
    saveMessage(message);

    // Show success modal
    showSuccessModal();

    // Reset form
    document.getElementById('contactForm').reset();
    document.querySelectorAll('.is-invalid').forEach(function(el) {
        el.classList.remove('is-invalid');
    });

    return false;
}

// Save message to localStorage 
function saveMessage(message) {
    var existing = localStorage.getItem('cinetrack_messages');
    var messages = existing ? JSON.parse(existing) : [];
    messages.push(message);
    localStorage.setItem('cinetrack_messages', JSON.stringify(messages));
    console.log('Message saved! Total messages:', messages.length);
}

// Get all saved messages 
function getAllMessages() {
    var stored = localStorage.getItem('cinetrack_messages');
    return stored ? JSON.parse(stored) : [];
}

// Form Validation
function validateContactForm() {
    var isValid = true;

    var name = document.getElementById('name');
    if (!name.value.trim()) {
        name.classList.add('is-invalid');
        isValid = false;
    } else {
        name.classList.remove('is-invalid');
    }

    var email = document.getElementById('email');
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
        email.classList.add('is-invalid');
        isValid = false;
    } else {
        email.classList.remove('is-invalid');
    }

    var subject = document.getElementById('subject');
    if (!subject.value.trim()) {
        subject.classList.add('is-invalid');
        isValid = false;
    } else {
        subject.classList.remove('is-invalid');
    }

    var message = document.getElementById('message');
    if (!message.value.trim() || message.value.trim().length < 10) {
        message.classList.add('is-invalid');
        isValid = false;
    } else {
        message.classList.remove('is-invalid');
    }

    if (!isValid) {
        showAlert('Please fill in all required fields correctly', 'danger');
    }

    return isValid;
}

function showSuccessModal() {
    var modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

// Real-time validation 
document.addEventListener('DOMContentLoaded', function() {
    // Auto print saved messages when page loads
    var messages = getAllMessages();
    if (messages.length === 0) {
        console.log('%c📭 No contact messages yet.', 'color: gray; font-size: 13px;');
    } else {
        console.log('%c📬 Saved Contact Messages (' + messages.length + ' total):', 'color: #e50914; font-weight: bold; font-size: 14px;');
        messages.forEach(function(msg, i) {
            console.group('%c Message #' + (i + 1), 'color: #00d4ff; font-weight: bold;');
            console.log('👤 Name    :', msg.name);
            console.log('📧 Email   :', msg.email);
            console.log('📌 Subject :', msg.subject);
            console.log('💬 Message :', msg.message);
            console.log('🕒 Sent at :', msg.created_at);
            console.groupEnd();
        });
    }

    document.getElementById('name') && document.getElementById('name').addEventListener('blur', function() {
        this.value.trim() ? this.classList.remove('is-invalid') : this.classList.add('is-invalid');
    });

    document.getElementById('email') && document.getElementById('email').addEventListener('blur', function() {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        (!this.value.trim() || !emailRegex.test(this.value)) ? this.classList.add('is-invalid') : this.classList.remove('is-invalid');
    });

    document.getElementById('subject') && document.getElementById('subject').addEventListener('blur', function() {
        this.value.trim() ? this.classList.remove('is-invalid') : this.classList.add('is-invalid');
    });

    document.getElementById('message') && document.getElementById('message').addEventListener('blur', function() {
        (this.value.trim().length < 10) ? this.classList.add('is-invalid') : this.classList.remove('is-invalid');
    });
});

window.handleContactForm = handleContactForm;
window.getAllMessages = getAllMessages;
