<?php
/**
 * Database Connection - Marco Travel
 * Menggunakan MySQLi untuk koneksi ke database MySQL
 */

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'db_travel';
$port = 3308;

// Buat koneksi
$conn = new mysqli($host, $username, $password, $database, $port);

// Cek koneksi
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Koneksi database gagal: ' . $conn->connect_error
    ]);
    exit;
}

// Set charset ke utf8mb4
$conn->set_charset('utf8mb4');
