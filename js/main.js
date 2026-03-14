// CineTrack - Main JavaScript

// TMDB API Configuration
const API_KEY = '360f0b0d0922f128b88cbeeda3c410b6'; // Users need to replace this with their own key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Global variables
let currentCategory = 'movie'; // 'movie' or 'tv'
let watchlist = [];

// Initialize App 
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load watchlist from localStorage
    loadWatchlist();
    
    // Initialize scroll to top button
    initScrollToTop();
    
    // Set active nav link
    setActiveNavLink();
    
    // Check if API key is set
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('⚠️ Please set your TMDB API key in js/main.js');
        showAlert('Please configure your TMDB API key to load content', 'warning');
    }
}

// Local Storage Functions 
function getStorageKey() {
    // Use user-specific key if logged in, otherwise guest key
    try {
        if (typeof getWatchlistKey === 'function') {
            return getWatchlistKey();
        }
    } catch(e) {}
    return 'cinetrack_watchlist_guest';
}

function loadWatchlist() {
    const stored = localStorage.getItem(getStorageKey());
    if (stored) {
        watchlist = JSON.parse(stored);
    } else {
        watchlist = [];
    }
}

function saveWatchlist() {
    localStorage.setItem(getStorageKey(), JSON.stringify(watchlist));
}

function addToWatchlist(item) {
    // Require login before adding
    if (typeof getCurrentUser === 'function' && !getCurrentUser()) {
        showAlert('Please login to add items to your watchlist! Redirecting...', 'warning');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
    }

    // Check if already in watchlist
    const exists = watchlist.find(w => w.id === item.id && w.media_type === item.media_type);
    if (exists) {
        showAlert('Already in your watchlist!', 'info');
        return;
    }
    
    watchlist.push(item);
    saveWatchlist();
    showAlert('Added to watchlist!', 'success');
    updateWatchlistButtons();
}

function removeFromWatchlist(id, mediaType) {
    watchlist = watchlist.filter(item => !(item.id === id && item.media_type === mediaType));
    saveWatchlist();
    showAlert('Removed from watchlist', 'info');
    updateWatchlistButtons();
}

function isInWatchlist(id, mediaType) {
    return watchlist.some(item => item.id === id && item.media_type === mediaType);
}

// API Functions 
async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('API request failed');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showAlert('Failed to load content. Please check your API key.', 'danger');
        return null;
    }
}

async function getTrending(mediaType = 'movie') {
    return await fetchFromAPI(`/trending/${mediaType}/week?api_key=${API_KEY}`);
}

async function getTopRated(mediaType = 'movie') {
    return await fetchFromAPI(`/${mediaType}/top_rated?api_key=${API_KEY}`);
}

async function searchMulti(query) {
    return await fetchFromAPI(`/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
}

async function getDetails(mediaType, id) {
    return await fetchFromAPI(`/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=credits`);
}

async function getPopular(mediaType = 'movie') {
    return await fetchFromAPI(`/${mediaType}/popular?api_key=${API_KEY}`);
}

// Display Functions 
function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!movies || movies.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">No results found</p></div>';
        return;
    }
    
    movies.forEach(movie => {
        const mediaType = movie.media_type || currentCategory;
        const title = movie.title || movie.name;
        const releaseDate = movie.release_date || movie.first_air_date || 'N/A';
        const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
        const posterPath = movie.poster_path 
            ? `${IMAGE_BASE_URL}${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Image';
        
        const isAdded = isInWatchlist(movie.id, mediaType);
        
        
        let typeLabel = '';
        let badgeClass = '';

        if (mediaType === 'movie') {
            
            if (movie.runtime && movie.runtime < 45) {
                typeLabel = '⏱️ Short Film';
                badgeClass = 'bg-warning text-dark';
            } else {
                typeLabel = '🎬 Movie';
                badgeClass = 'bg-danger';
            }
        } else {
            typeLabel = '📺 TV Series';
            badgeClass = 'bg-primary';
        }

        const movieCard = `
            <div class="col-lg-3 col-md-4 col-sm-6 fade-in">
                <div class="movie-card" onclick="showDetails(${movie.id}, '${mediaType}')">
                    <span class="badge ${badgeClass} position-absolute m-2 shadow-sm" style="z-index: 5; right: 0; top: 0;">
                        ${typeLabel}
                    </span>
                    

                    <img src="${posterPath}" alt="${title}" class="movie-poster">
                    <button class="watchlist-btn ${isAdded ? 'added' : ''}" 
                            onclick="event.stopPropagation(); addOnlyToWatchlist(${movie.id}, '${mediaType}', '${title.replace(/'/g, "\\'")}', '${posterPath}', ${movie.vote_average})"
                            title="${isAdded ? 'In Watchlist' : 'Add to watchlist'}">
                        <i class="bi ${isAdded ? 'bi-check-circle-fill' : 'bi-plus-circle'}"></i>
                    </button>
                    <div class="movie-info">
                        <div class="movie-title" title="${title}">${title}</div>
                        <div class="movie-meta">
                            <span class="rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                            <span>${year}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += movieCard;
    });
}

async function showDetails(id, mediaType) {
    const details = await getDetails(mediaType, id);
    if (!details) return;

    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    const title = details.title || details.name;
    const releaseDate = details.release_date || details.first_air_date || 'N/A';
    const runtime = details.runtime || details.episode_run_time?.[0] || 0;
    let runtimeDisplay = '';

    if (mediaType === 'movie') {
        runtimeDisplay = runtime < 45 ? runtime + ' minutes (Short Film)' : runtime + ' minutes';
    } else {
        runtimeDisplay = runtime ? runtime + ' minutes per episode' : 'N/A';
    }

    const posterPath = details.poster_path
        ? IMAGE_BASE_URL + details.poster_path
        : 'https://via.placeholder.com/500x750?text=No+Image';

    const cast = details.credits && details.credits.cast
        ? details.credits.cast.slice(0, 5).map(function(c) { return c.name; }).join(', ')
        : 'N/A';

    const genres = details.genres
        ? details.genres.map(function(g) { return g.name; }).join(', ')
        : 'N/A';

    const rating = details.vote_average ? details.vote_average.toFixed(1) : 'N/A';
    const safeTitle = title.replace(/'/g, "\\'");

    // Build watchlist button based on current state
    var watchlistBtn = '';
    if (isInWatchlist(id, mediaType)) {
        watchlistBtn = '<button class="btn btn-watch" disabled style="opacity:0.65;cursor:default;">'
                     + '<i class="bi bi-check-circle-fill"></i> In Watchlist</button>'
                     + ' <a href="watchlist.html" class="btn btn-outline-light ms-2" style="border-radius:20px;font-size:0.9rem;">'
                     + '<i class="bi bi-bookmark-heart"></i> View Watchlist</a>';
    } else {
        watchlistBtn = '<button class="btn btn-watch" onclick="addToWatchlistFromModal('
                     + id + ', \'' + mediaType + '\', \'' + safeTitle + '\', \'' + posterPath + '\', ' + details.vote_average + ')">'
                     + '<i class="bi bi-plus-circle"></i> Add to Watchlist</button>';
    }

    const modalContent = '<div class="row">'
        + '<div class="col-md-4">'
        + '<img src="' + posterPath + '" alt="' + title + '" class="modal-poster">'
        + '</div>'
        + '<div class="col-md-8">'
        + '<h2 class="modal-title-custom">' + title + '</h2>'
        + '<div class="modal-detail"><strong>⭐ Rating:</strong> ' + rating + '/10 (' + details.vote_count + ' votes)</div>'
        + '<div class="modal-detail"><strong>🎭 Genres:</strong> ' + genres + '</div>'
        + '<div class="modal-detail"><strong>📅 Release Date:</strong> ' + releaseDate + '</div>'
        + '<div class="modal-detail"><strong>⏱️ Runtime:</strong> ' + runtimeDisplay + '</div>'
        + '<div class="modal-detail"><strong>🎬 Cast:</strong> ' + cast + '</div>'
        + '<div class="modal-detail"><strong>📝 Overview:</strong>'
        + '<p class="modal-overview">' + (details.overview || 'No overview available.') + '</p></div>'
        + watchlistBtn
        + '</div></div>';

    document.getElementById('movieModalBody').innerHTML = modalContent;
    modal.show();
}

// Add-only from card button (no accidental removal)
function addToWatchlistFromModal(id, mediaType, title, poster, rating) {
    addToWatchlist({
        id: id,
        media_type: mediaType,
        title: title,
        poster_path: poster,
        vote_average: rating
    });
    // Refresh modal to show updated state
    const modalEl = document.getElementById('movieModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    setTimeout(() => showDetails(id, mediaType), 300);
}

function addOnlyToWatchlist(id, mediaType, title, poster, rating) {
    if (isInWatchlist(id, mediaType)) {
        showAlert('Already in your watchlist!', 'info');
        return;
    }
    addToWatchlist({
        id: id,
        media_type: mediaType,
        title: title,
        poster_path: poster,
        vote_average: rating
    });
}


function updateWatchlistButtons() {
    document.querySelectorAll('.watchlist-btn').forEach(btn => {
        const card = btn.closest('.movie-card');
        if (!card) return;
    });
}

// Category Toggle 
function switchCategory(category) {
    currentCategory = category;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Reload content
    loadHomeContent();
}

// Scroll to Top 
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Alert System 
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-custom`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Active Navigation 
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Smooth Scrolling for Navigation 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Export functions for HTML inline use 
window.switchCategory = switchCategory;
window.showDetails = showDetails;
window.addOnlyToWatchlist = addOnlyToWatchlist;
window.addToWatchlistFromModal = addToWatchlistFromModal;
