<?php
// CineTrack - Database Connection

define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // WAMP default username
define('DB_PASS', '');            // WAMP default password (empty)
define('DB_NAME', 'cinetrack');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Set charset
$conn->set_charset('utf8mb4');
?>
