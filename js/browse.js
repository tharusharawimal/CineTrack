// Browse Page Specific JavaScript

let browseCategoryFilter = 'movie';

// Load popular content on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPopularContent();
});

function switchBrowseCategory(category) {
    browseCategoryFilter = category;
    currentCategory = category;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Clear search and reload popular
    document.getElementById('searchInput').value = '';
    loadPopularContent();
}

async function loadPopularContent() {
    const loadingEl = document.getElementById('loading-results');
    const resultsHeader = document.getElementById('results-header');
    const resultsTitle = document.getElementById('results-title');
    const resultsCount = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (resultsHeader) resultsHeader.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    
    const data = await getPopular(browseCategoryFilter);
    
    if (loadingEl) loadingEl.style.display = 'none';
    
    if (data && data.results && data.results.length > 0) {
        if (resultsHeader) resultsHeader.style.display = 'flex';
        if (resultsTitle) resultsTitle.textContent = `Popular ${browseCategoryFilter === 'movie' ? 'Movies' : 'TV Series'}`;
        
        // Add media_type to each item
        const results = data.results.map(item => ({
            ...item,
            media_type: browseCategoryFilter
        }));
        displayMovies(results, 'results-container');
    } else {
        if (noResults) noResults.style.display = 'block';
    }
}

function handleSearch(event) {
    event.preventDefault();
    
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    // Validation
    if (query.length < 2) {
        searchInput.classList.add('is-invalid');
        showAlert('Please enter at least 2 characters', 'warning');
        return false;
    }
    
    searchInput.classList.remove('is-invalid');
    performSearch(query);
    return false;
}

async function performSearch(query) {
    const loadingEl = document.getElementById('loading-results');
    const resultsHeader = document.getElementById('results-header');
    const resultsTitle = document.getElementById('results-title');
    const resultsCount = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    const container = document.getElementById('results-container');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (resultsHeader) resultsHeader.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    if (container) container.innerHTML = '';
    
    const data = await searchMulti(query);
    
    if (loadingEl) loadingEl.style.display = 'none';
    
    if (data && data.results) {
        let filteredResults = data.results.filter(item => 
            item.media_type === 'movie' || item.media_type === 'tv'
        );
        
        if (filteredResults.length > 0) {
            if (resultsHeader) resultsHeader.style.display = 'flex';
            if (resultsTitle) resultsTitle.textContent = `Search Results for "${query}"`;
            
            displayMovies(filteredResults, 'results-container');
        } else {
            if (noResults) noResults.style.display = 'block';
        }
    } else {
        if (noResults) noResults.style.display = 'block';
    }
}

// Real-time search validation
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    if (this.value.length > 0 && this.value.length < 2) {
        this.classList.add('is-invalid');
    } else {
        this.classList.remove('is-invalid');
    }
});
