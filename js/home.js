// Home Page Specific JavaScript

const carouselSlides = [
    {
        title: 'Welcome to CineTrack 🎬',
        subtitle: 'Discover trending movies and TV series with detailed information',
        btnText: 'Explore Now',
        btnLink: 'browse.html',
        isExternal: true
    },
    {
        title: 'Track Your Favorites 📋',
        subtitle: 'Create your personal watchlist and never miss a great show',
        btnText: 'My Watchlist',
        btnLink: 'watchlist.html',
        isExternal: true
    },
    {
        title: 'Find What to Watch 🔍',
        subtitle: 'Search through thousands of movies and TV shows',
        btnText: 'Start Searching',
        btnLink: 'browse.html',
        isExternal: true
    },
    {
        title: 'Top Rated Picks ⭐',
        subtitle: 'Explore the highest rated movies and series of all time',
        btnText: 'See Top Rated',
        btnLink: '#top-rated-section',
        isExternal: false
    },
    {
        title: 'New & Trending 🔥',
        subtitle: 'Stay up to date with what everyone is watching right now',
        btnText: 'See Trending',
        btnLink: '#trending-section',
        isExternal: false
    }
];

document.addEventListener('DOMContentLoaded', function () {
    loadHomeContent();
});

async function loadHomeContent() {
    await Promise.all([
        loadCarousel(),
        loadTrending(),
        loadTopRated()
    ]);
}

// Dynamic TMDB Carousel 
async function loadCarousel() {
    try {
        const data = await fetchFromAPI('/trending/movie/week?api_key=' + API_KEY);

        if (!data || !data.results || data.results.length === 0) {
            loadFallbackCarousel();
            return;
        }

        const moviesWithBackdrops = data.results.filter(function(m) { return m.backdrop_path; });
        const slideCount = Math.min(5, moviesWithBackdrops.length);
        const selectedMovies = moviesWithBackdrops.slice(0, slideCount);

        const indicatorsEl = document.getElementById('carouselIndicators');
        const innerEl = document.getElementById('carouselInner');

        indicatorsEl.innerHTML = selectedMovies.map(function(_, i) {
            return '<button type="button" data-bs-target="#featuredCarousel" data-bs-slide-to="' + i + '"'
                + (i === 0 ? ' class="active" aria-current="true"' : '')
                + ' aria-label="Slide ' + (i + 1) + '"></button>';
        }).join('');

        innerEl.innerHTML = selectedMovies.map(function(movie, i) {
            const backdropUrl = 'https://image.tmdb.org/t/p/original' + movie.backdrop_path;
            const slide = carouselSlides[i] || carouselSlides[0];

            // Use onclick scroll for internal anchors, normal href for external pages
            var btnHtml = '';
            if (slide.isExternal) {
                btnHtml = '<a href="' + slide.btnLink + '" class="btn btn-watch carousel-btn">' + slide.btnText + '</a>';
            } else {
                btnHtml = '<button class="btn btn-watch carousel-btn" onclick="scrollToSection(\'' + slide.btnLink + '\')">' + slide.btnText + '</button>';
            }

            return '<div class="carousel-item ' + (i === 0 ? 'active' : '') + '" '
                + 'style="background-image: linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.85)), url(\'' + backdropUrl + '\'); background-size: cover; background-position: center;">'
                + '<div class="carousel-caption">'
                + '<h2 class="carousel-heading">' + slide.title + '</h2>'
                + '<p class="carousel-subtitle">' + slide.subtitle + '</p>'
                + btnHtml
                + '</div></div>';
        }).join('');

    } catch (error) {
        console.error('Carousel load error:', error);
        loadFallbackCarousel();
    }
}

function scrollToSection(anchor) {
    const target = document.querySelector(anchor);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

function loadFallbackCarousel() {
    const indicatorsEl = document.getElementById('carouselIndicators');
    const innerEl = document.getElementById('carouselInner');

    const fallbackColors = [
        'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        'linear-gradient(135deg, #0d0d0d 0%, #1a0000 50%, #3d0000 100%)',
        'linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 50%, #1b263b 100%)'
    ];

    indicatorsEl.innerHTML = carouselSlides.slice(0, 3).map(function(_, i) {
        return '<button type="button" data-bs-target="#featuredCarousel" data-bs-slide-to="' + i + '"'
            + (i === 0 ? ' class="active"' : '') + '></button>';
    }).join('');

    innerEl.innerHTML = carouselSlides.slice(0, 3).map(function(slide, i) {
        var btnHtml = slide.isExternal
            ? '<a href="' + slide.btnLink + '" class="btn btn-watch carousel-btn">' + slide.btnText + '</a>'
            : '<button class="btn btn-watch carousel-btn" onclick="scrollToSection(\'' + slide.btnLink + '\')">' + slide.btnText + '</button>';

        return '<div class="carousel-item ' + (i === 0 ? 'active' : '') + '" style="background: ' + fallbackColors[i] + ';">'
            + '<div class="carousel-caption">'
            + '<h2 class="carousel-heading">' + slide.title + '</h2>'
            + '<p class="carousel-subtitle">' + slide.subtitle + '</p>'
            + btnHtml
            + '</div></div>';
    }).join('');
}

async function loadTrending() {
    const loadingEl = document.getElementById('loading-trending');
    if (loadingEl) loadingEl.style.display = 'block';
    const data = await getTrending(currentCategory);
    if (loadingEl) loadingEl.style.display = 'none';
    if (data && data.results) {
        const results = data.results.slice(0, 8).map(function(item) {
            return Object.assign({}, item, { media_type: currentCategory });
        });
        displayMovies(results, 'trending-container');
    }
}

async function loadTopRated() {
    const loadingEl = document.getElementById('loading-top-rated');
    if (loadingEl) loadingEl.style.display = 'block';
    const data = await getTopRated(currentCategory);
    if (loadingEl) loadingEl.style.display = 'none';
    if (data && data.results) {
        const results = data.results.slice(0, 8).map(function(item) {
            return Object.assign({}, item, { media_type: currentCategory });
        });
        displayMovies(results, 'top-rated-container');
    }
}

window.scrollToSection = scrollToSection;
