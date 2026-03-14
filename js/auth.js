// Auth Helper Functions 

function getCurrentUser() {
    const session = localStorage.getItem('cinetrack_session');
    return session ? JSON.parse(session) : null;
}

function getAllUsers() {
    const users = localStorage.getItem('cinetrack_users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('cinetrack_users', JSON.stringify(users));
}

function setSession(user) {
    localStorage.setItem('cinetrack_session', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email
    }));
}

// Safe wrapper - showAlert is defined in main.js which loads after auth.js
function safeShowAlert(message, type) {
    if (typeof showAlert === 'function') {
        showAlert(message, type);
    } else {
        // Fallback: simple browser alert if main.js not loaded yet
        console.log('[CineTrack]', message);
    }
}

function logout() {
    localStorage.removeItem('cinetrack_session');
    safeShowAlert('Logged out successfully!', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Render Auth Navbar Item 

function renderAuthNav() {
    const user = getCurrentUser();
    const authNavItems = document.querySelectorAll('.auth-nav-item');

    authNavItems.forEach(el => {
        if (user) {
            el.innerHTML = `
                <div class="dropdown">
                    <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" 
                       href="#" 
                       data-bs-toggle="dropdown" 
                       aria-expanded="false"
                       style="color: var(--primary-color); font-weight: 600;">
                        <i class="bi bi-person-circle" style="font-size: 1.3rem;"></i>
                        ${escapeHtml(user.username)}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end auth-dropdown">
                        <li>
                            <a class="dropdown-item auth-dropdown-item" href="watchlist.html">
                                <i class="bi bi-bookmark-heart"></i> My Watchlist
                            </a>
                        </li>
                        <li><hr class="dropdown-divider" style="border-color: var(--border-color);"></li>
                        <li>
                            <a class="dropdown-item auth-dropdown-item text-danger" href="#" onclick="logout(); return false;">
                                <i class="bi bi-box-arrow-right"></i> Logout
                            </a>
                        </li>
                    </ul>
                </div>
            `;
        } else {
            el.innerHTML = `
                <a class="nav-link login-nav-btn" href="login.html">
                    <i class="bi bi-person-fill"></i> Login
                </a>
            `;
        }
    });
}

// User-Specific Watchlist Keys 

function getWatchlistKey() {
    const user = getCurrentUser();
    return user ? `cinetrack_watchlist_${user.id}` : 'cinetrack_watchlist_guest';
}

// Register Function 

function registerUser(username, email, password) {
    const users = getAllUsers();

    // Check if username already exists
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username already taken. Please choose another.' };
    }

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    // Simple password hash simulation 
    const hashedPassword = btoa(password + '_cinetrack_salt');

    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: hashedPassword,
        created_at: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true, user: newUser };
}

// Login Function 

function loginUser(emailOrUsername, password) {
    const users = getAllUsers();
    const hashedPassword = btoa(password + '_cinetrack_salt');

    const user = users.find(u =>
        (u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
         u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
        u.password === hashedPassword
    );

    if (user) {
        return { success: true, user: user };
    } else {
        return { success: false, message: 'Invalid username/email or password.' };
    }
}

// Protect pages that require login 

// Helper
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Init on every page load 
document.addEventListener('DOMContentLoaded', function () {
    renderAuthNav();
});

// Export
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.getWatchlistKey = getWatchlistKey;
window.registerUser = registerUser;
window.loginUser = loginUser;

// Guard watchlist nav link 
function checkWatchlistAccess(event) {
    const user = getCurrentUser();
    if (!user) {
        event.preventDefault();
        safeShowAlert('Please login to view your watchlist! Redirecting...', 'warning');
        setTimeout(() => { window.location.href = 'login.html?redirect=watchlist.html'; }, 1500);
        return false;
    }
    return true;
}

window.checkWatchlistAccess = checkWatchlistAccess;
