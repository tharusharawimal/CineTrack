// Watchlist Page Specific JavaScript

let currentFilter = 'all';

// Load watchlist on page load
document.addEventListener('DOMContentLoaded', function() {
    // Reload watchlist from storage (user-specific key via auth.js)
    loadWatchlist();
    displayWatchlist();
    
    // Show welcome message if logged in
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (user) {
        const heading = document.querySelector('h1.section-title');
        if (heading) {
            heading.textContent = `📋 ${user.username}'s Watchlist`;
        }
    }
});

function displayWatchlist() {
    const container = document.getElementById('watchlist-container');
    const emptyState = document.getElementById('empty-watchlist');
    const countBadge = document.getElementById('watchlist-count');
    
    if (!container) return;
    
    // Filter watchlist based on current filter
    let filteredList = watchlist;
    if (currentFilter !== 'all') {
        filteredList = watchlist.filter(item => item.media_type === currentFilter);
    }
    
    // Update count
    if (countBadge) {
        countBadge.textContent = `${filteredList.length} item${filteredList.length !== 1 ? 's' : ''}`;
    }
    
    // Show empty state if no items
    if (filteredList.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    // Display watchlist items
    container.innerHTML = '';
    filteredList.forEach(item => {
        const watchlistItem = createWatchlistItem(item);
        container.innerHTML += watchlistItem;
    });
}

function createWatchlistItem(item) {
    const posterUrl = item.poster_path.includes('placeholder') 
        ? item.poster_path 
        : item.poster_path;
    
    const mediaTypeLabel = item.media_type === 'movie' ? 'Movie' : 'TV Series';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    
    return `
        <div class="watchlist-item fade-in">
            <img src="${posterUrl}" alt="${item.title}" class="watchlist-poster" onclick="showDetails(${item.id}, '${item.media_type}')">
            <div class="watchlist-info">
                <h3 class="watchlist-title">${item.title}</h3>
                <div class="movie-meta mb-2">
                    <span class="badge bg-secondary">${mediaTypeLabel}</span>
                    <span class="rating ms-2">⭐ ${rating}/10</span>
                </div>
                <p style="color: pink;">Click on the poster to view full details</p>
            </div>
            <button class="remove-btn" onclick="removeFromWatchlistPage(${item.id}, '${item.media_type}')">
                <i class="bi bi-trash"></i> Remove
            </button>
        </div>
    `;
}

function removeFromWatchlistPage(id, mediaType) {
    // Show confirmation
    if (confirm('Remove this item from your watchlist?')) {
        removeFromWatchlist(id, mediaType);
        displayWatchlist();
    }
}

function filterWatchlist(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Refresh display
    displayWatchlist();
}

function clearAllWatchlist() {
    if (watchlist.length === 0) {
        showAlert('Your watchlist is already empty!', 'info');
        return;
    }
    if (confirm('Are you sure you want to remove everything from your watchlist?')) {
        watchlist = [];
        saveWatchlist();
        displayWatchlist();
        showAlert('Watchlist cleared!', 'success');
    }
}

// Export function
window.filterWatchlist = filterWatchlist;
window.removeFromWatchlistPage = removeFromWatchlistPage;
window.clearAllWatchlist = clearAllWatchlist;
