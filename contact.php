<?php
// CineTrack - Contact Form Handler

session_start();
require_once 'includes/db.php';
require_once 'includes/functions.php';

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.');
}

// Get and sanitize inputs
$name    = sanitize($_POST['name'] ?? '');
$email   = sanitize($_POST['email'] ?? '');
$subject = sanitize($_POST['subject'] ?? '');
$message = sanitize($_POST['message'] ?? '');

// Validate inputs
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    jsonResponse(false, 'All fields are required.');
}

if (!isValidEmail($email)) {
    jsonResponse(false, 'Please enter a valid email address.');
}

if (strlen($message) < 10) {
    jsonResponse(false, 'Message must be at least 10 characters.');
}

// Save to database
$stmt = $conn->prepare("INSERT INTO messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, NOW())");
$stmt->bind_param("ssss", $name, $email, $subject, $message);

if ($stmt->execute()) {
    jsonResponse(true, 'Your message has been sent successfully!');
} else {
    jsonResponse(false, 'Failed to send message. Please try again.');
}

$stmt->close();
$conn->close();
?>
