<?php
// CineTrack - User Login

session_start();
require_once '../includes/db.php';
require_once '../includes/functions.php';

// If already logged in, redirect to home
if (isLoggedIn()) {
    redirect('../index.php');
}

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.');
}

// Get and sanitize inputs
$emailOrUsername = sanitize($_POST['email_or_username'] ?? '');
$password        = $_POST['password'] ?? '';

// Validate inputs
if (empty($emailOrUsername) || empty($password)) {
    jsonResponse(false, 'All fields are required.');
}

// Find user by email or username
$stmt = $conn->prepare("SELECT id, username, email, password FROM users WHERE email = ? OR username = ?");
$stmt->bind_param("ss", $emailOrUsername, $emailOrUsername);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    jsonResponse(false, 'Invalid username/email or password.');
}

$user = $result->fetch_assoc();
$stmt->close();

// Verify password
if (!password_verify($password, $user['password'])) {
    jsonResponse(false, 'Invalid username/email or password.');
}

// Start session
$_SESSION['user_id']  = $user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['email']    = $user['email'];

jsonResponse(true, 'Login successful! Welcome back, ' . $user['username'], [
    'user' => [
        'id'       => $user['id'],
        'username' => $user['username'],
        'email'    => $user['email']
    ]
]);

$conn->close();
?>
