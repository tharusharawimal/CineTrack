<?php
// CineTrack - User Registration

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
$username = sanitize($_POST['username'] ?? '');
$email    = sanitize($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirm  = $_POST['confirm_password'] ?? '';

// Validate inputs
if (empty($username) || empty($email) || empty($password) || empty($confirm)) {
    jsonResponse(false, 'All fields are required.');
}

if (strlen($username) < 3 || strlen($username) > 30) {
    jsonResponse(false, 'Username must be between 3 and 30 characters.');
}

if (!isValidEmail($email)) {
    jsonResponse(false, 'Please enter a valid email address.');
}

if (strlen($password) < 6) {
    jsonResponse(false, 'Password must be at least 6 characters.');
}

if ($password !== $confirm) {
    jsonResponse(false, 'Passwords do not match.');
}

// Check if username already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    jsonResponse(false, 'Username already taken. Please choose another.');
}
$stmt->close();

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    jsonResponse(false, 'An account with this email already exists.');
}
$stmt->close();

// Hash the password securely
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert new user into database
$stmt = $conn->prepare("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
$stmt->bind_param("sss", $username, $email, $hashedPassword);

if ($stmt->execute()) {
    $userId = $conn->insert_id;

    // Start session for new user
    $_SESSION['user_id']  = $userId;
    $_SESSION['username'] = $username;
    $_SESSION['email']    = $email;

    jsonResponse(true, 'Registration successful! Welcome to CineTrack.', [
        'user' => [
            'id'       => $userId,
            'username' => $username,
            'email'    => $email
        ]
    ]);
} else {
    jsonResponse(false, 'Registration failed. Please try again.');
}

$stmt->close();
$conn->close();
?>
