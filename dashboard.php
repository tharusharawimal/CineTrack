<?php
// CineTrack - User Dashboard

session_start();
require_once 'includes/db.php';
require_once 'includes/functions.php';

// Must be logged in to view dashboard
requireLogin();

$userId   = $_SESSION['user_id'];
$username = $_SESSION['username'];
$email    = $_SESSION['email'];

// Get user's watchlist count
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM watchlist WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$watchlistCount = $stmt->get_result()->fetch_assoc()['total'];
$stmt->close();

// Get user's watchlist items (latest 6)
$stmt = $conn->prepare("SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC LIMIT 6");
$stmt->bind_param("i", $userId);
$stmt->execute();
$watchlistItems = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// Get account created date
$stmt = $conn->prepare("SELECT created_at FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$userCreatedAt = $stmt->get_result()->fetch_assoc()['created_at'];
$stmt->close();

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - CineTrack</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark-custom sticky-top">
        <div class="container">
            <a class="navbar-brand" href="index.php">
                <i class="bi bi-camera-reels-fill"></i> CineTrack
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="index.php">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="browse.html">Browse</a></li>
                    <li class="nav-item"><a class="nav-link" href="watchlist.html">Watchlist</a></li>
                    <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
                    <li class="nav-item">
                        <div class="dropdown">
                            <a class="nav-link dropdown-toggle d-flex align-items-center gap-2"
                               href="#" data-bs-toggle="dropdown"
                               style="color: var(--primary-color); font-weight: 600;">
                                <i class="bi bi-person-circle" style="font-size: 1.3rem;"></i>
                                <?php echo htmlspecialchars($username); ?>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end auth-dropdown">
                                <li>
                                    <a class="dropdown-item auth-dropdown-item" href="dashboard.php">
                                        <i class="bi bi-speedometer2"></i> Dashboard
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item auth-dropdown-item" href="watchlist.html">
                                        <i class="bi bi-bookmark-heart"></i> My Watchlist
                                    </a>
                                </li>
                                <li><hr class="dropdown-divider" style="border-color: var(--border-color);"></li>
                                <li>
                                    <a class="dropdown-item auth-dropdown-item text-danger" href="auth/logout.php">
                                        <i class="bi bi-box-arrow-right"></i> Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mt-5 mb-5">

        <!-- Welcome Banner -->
        <div class="p-4 mb-4 rounded" style="background: linear-gradient(135deg, #1a1a1a, #2d0a0a); border: 1px solid var(--primary-color);">
            <h2 style="color: var(--primary-color);"><i class="bi bi-person-circle"></i> Welcome back, <?php echo htmlspecialchars($username); ?>!</h2>
            <p style="color: var(--text-secondary); margin: 0;">
                <i class="bi bi-envelope"></i> <?php echo htmlspecialchars($email); ?> &nbsp;|&nbsp;
                <i class="bi bi-calendar3"></i> Member since <?php echo date('F Y', strtotime($userCreatedAt)); ?>
            </p>
        </div>

        <!-- Stats -->
        <div class="row mb-4">
            <div class="col-md-4 mb-3">
                <div class="feature-card text-center">
                    <i class="bi bi-bookmark-heart feature-icon"></i>
                    <h2 style="color: var(--primary-color);"><?php echo $watchlistCount; ?></h2>
                    <p style="color: var(--text-secondary);">Items in Watchlist</p>
                    <a href="watchlist.html" class="btn btn-watch btn-sm">View Watchlist</a>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="feature-card text-center">
                    <i class="bi bi-person-check feature-icon"></i>
                    <h2 style="color: var(--primary-color);">Active</h2>
                    <p style="color: var(--text-secondary);">Account Status</p>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="feature-card text-center">
                    <i class="bi bi-calendar-check feature-icon"></i>
                    <h2 style="color: var(--primary-color);"><?php echo date('d M Y', strtotime($userCreatedAt)); ?></h2>
                    <p style="color: var(--text-secondary);">Joined Date</p>
                </div>
            </div>
        </div>

        <!-- Recent Watchlist -->
        <?php if (!empty($watchlistItems)): ?>
        <h3 class="section-title">🎬 Recently Added</h3>
        <div class="row mt-3">
            <?php foreach ($watchlistItems as $item): ?>
            <div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-3">
                <div class="movie-card" onclick="window.location.href='watchlist.html'">
                    <img src="<?php echo htmlspecialchars($item['poster']); ?>"
                         alt="<?php echo htmlspecialchars($item['title']); ?>"
                         class="movie-poster" style="height:200px;">
                    <div class="movie-info">
                        <div class="movie-title" title="<?php echo htmlspecialchars($item['title']); ?>">
                            <?php echo htmlspecialchars($item['title']); ?>
                        </div>
                        <div class="movie-meta">
                            <span class="rating">⭐ <?php echo number_format($item['rating'], 1); ?></span>
                            <span><?php echo strtoupper($item['media_type']); ?></span>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php else: ?>
        <div class="text-center mt-4 p-4" style="background: var(--light-bg); border-radius: 10px;">
            <i class="bi bi-bookmark-plus" style="font-size: 3rem; color: var(--text-secondary);"></i>
            <p class="mt-2" style="color: var(--text-secondary);">Your watchlist is empty. Start adding movies!</p>
            <a href="browse.html" class="btn btn-watch">Browse Movies</a>
        </div>
        <?php endif; ?>

    </div>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>About CineTrack</h4>
                    <p>Your ultimate destination for discovering movies and TV series.</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="index.php">Home</a></li>
                        <li><a href="browse.html">Browse</a></li>
                        <li><a href="watchlist.html">Watchlist</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Follow Us</h4>
                    <div class="social-links">
                        <a href="#" class="social-link"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="social-link"><i class="bi bi-twitter"></i></a>
                        <a href="#" class="social-link"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="social-link"><i class="bi bi-youtube"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 CineTrack | Powered by TMDB API | Student Project - ICT 2204 / COM 2303</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
