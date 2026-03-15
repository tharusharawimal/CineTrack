<?php
// CineTrack - Watchlist API
// Handles add / remove / get watchlist

session_start();
require_once 'includes/db.php';
require_once 'includes/functions.php';

// Must be logged in
if (!isLoggedIn()) {
    jsonResponse(false, 'Please login to manage your watchlist.');
}

$userId = $_SESSION['user_id'];
$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {

    // Add to watchlist 
    case 'add':
        $movieId   = intval($_POST['movie_id'] ?? 0);
        $mediaType = sanitize($_POST['media_type'] ?? '');
        $title     = sanitize($_POST['title'] ?? '');
        $poster    = sanitize($_POST['poster'] ?? '');
        $rating    = floatval($_POST['rating'] ?? 0);

        if (!$movieId || empty($mediaType) || empty($title)) {
            jsonResponse(false, 'Missing required fields.');
        }

        $stmt = $conn->prepare("INSERT IGNORE INTO watchlist (user_id, movie_id, media_type, title, poster, rating) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iisssd", $userId, $movieId, $mediaType, $title, $poster, $rating);

        if ($stmt->execute()) {
            jsonResponse(true, 'Added to watchlist!');
        } else {
            jsonResponse(false, 'Failed to add to watchlist.');
        }
        break;

    // Remove from watchlist 
    case 'remove':
        $movieId   = intval($_POST['movie_id'] ?? 0);
        $mediaType = sanitize($_POST['media_type'] ?? '');

        $stmt = $conn->prepare("DELETE FROM watchlist WHERE user_id = ? AND movie_id = ? AND media_type = ?");
        $stmt->bind_param("iis", $userId, $movieId, $mediaType);

        if ($stmt->execute()) {
            jsonResponse(true, 'Removed from watchlist.');
        } else {
            jsonResponse(false, 'Failed to remove from watchlist.');
        }
        break;

    // Get all watchlist items 
    case 'get':
        $stmt = $conn->prepare("SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $items = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

        jsonResponse(true, 'Success', ['items' => $items]);
        break;

    // Clear entire watchlist 
    case 'clear':
        $stmt = $conn->prepare("DELETE FROM watchlist WHERE user_id = ?");
        $stmt->bind_param("i", $userId);

        if ($stmt->execute()) {
            jsonResponse(true, 'Watchlist cleared.');
        } else {
            jsonResponse(false, 'Failed to clear watchlist.');
        }
        break;

    default:
        jsonResponse(false, 'Invalid action.');
}

$conn->close();
?>
