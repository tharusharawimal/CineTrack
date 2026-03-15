<?php
// CineTrack - Helper Functions

// Sanitize input to prevent XSS
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Validate email format
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

// Redirect to a page
function redirect($url) {
    header("Location: " . $url);
    exit();
}

// Require login - redirect to login if not logged in
function requireLogin() {
    if (!isLoggedIn()) {
        redirect('../login.php?error=Please+login+to+access+this+page');
    }
}

// Return JSON response
function jsonResponse($success, $message, $data = []) {
    header('Content-Type: application/json');
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message
    ], $data));
    exit();
}
?>
