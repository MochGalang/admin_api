<?php
/**
 * REST API - Paket Travel
 * Marco Travel - CRUD Endpoint
 * 
 * GET    /api/paket.php          → Ambil semua paket
 * GET    /api/paket.php?id=1     → Ambil paket berdasarkan ID
 * POST   /api/paket.php          → Tambah paket baru
 * PUT    /api/paket.php          → Update paket
 * DELETE /api/paket.php?id=1     → Hapus paket
 */

// CORS Headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Koneksi database
require_once 'connection.php';

// Ambil method
$method = $_SERVER['REQUEST_METHOD'];

// Response helper
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// ============================================
// ROUTING
// ============================================
switch ($method) {

    // ----------------------------------------
    // GET - Ambil data paket
    // ----------------------------------------
    case 'GET':
        if (isset($_GET['id'])) {
            // Ambil satu paket
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT * FROM paket_travel WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                respond(['success' => false, 'message' => 'Paket tidak ditemukan'], 404);
            }

            $paket = $result->fetch_assoc();
            // Decode JSON fields
            $paket['fasilitas'] = json_decode($paket['fasilitas']);
            $paket['itinerary'] = json_decode($paket['itinerary']);
            $paket['includes'] = json_decode($paket['includes']);
            $paket['excludes'] = json_decode($paket['excludes']);
            $paket['highlight'] = (bool) $paket['highlight'];
            $paket['rating'] = (int) $paket['rating'];
            $paket['id'] = (int) $paket['id'];

            respond(['success' => true, 'data' => $paket]);
        } else {
            // Ambil semua paket
            $result = $conn->query("SELECT * FROM paket_travel ORDER BY id ASC");
            $pakets = [];

            while ($row = $result->fetch_assoc()) {
                $row['fasilitas'] = json_decode($row['fasilitas']);
                $row['itinerary'] = json_decode($row['itinerary']);
                $row['includes'] = json_decode($row['includes']);
                $row['excludes'] = json_decode($row['excludes']);
                $row['highlight'] = (bool) $row['highlight'];
                $row['rating'] = (int) $row['rating'];
                $row['id'] = (int) $row['id'];
                $pakets[] = $row;
            }

            respond(['success' => true, 'data' => $pakets]);
        }
        break;

    // ----------------------------------------
    // POST - Tambah paket baru
    // ----------------------------------------
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            respond(['success' => false, 'message' => 'Data tidak valid'], 400);
        }

        // Validasi field wajib
        $required = ['nama', 'harga', 'durasi', 'kapasitas', 'deskripsi', 'keberangkatan', 'maskapai', 'hotel', 'wa'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                respond(['success' => false, 'message' => "Field '$field' wajib diisi"], 400);
            }
        }

        $stmt = $conn->prepare("INSERT INTO paket_travel (nama, image, harga, durasi, kapasitas, rating, badge, badgeColor, fasilitas, highlight, deskripsi, itinerary, `includes`, excludes, keberangkatan, maskapai, hotel, wa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $nama = $input['nama'];
        $image = $input['image'] ?? '/images/default.jpg';
        $harga = $input['harga'];
        $durasi = $input['durasi'];
        $kapasitas = $input['kapasitas'];
        $rating = intval($input['rating'] ?? 5);
        $badge = $input['badge'] ?? null;
        $badgeColor = $input['badgeColor'] ?? null;
        $fasilitas = json_encode($input['fasilitas'] ?? [], JSON_UNESCAPED_UNICODE);
        $highlight = intval($input['highlight'] ?? 0);
        $deskripsi = $input['deskripsi'];
        $itinerary = json_encode($input['itinerary'] ?? [], JSON_UNESCAPED_UNICODE);
        $includes = json_encode($input['includes'] ?? [], JSON_UNESCAPED_UNICODE);
        $excludes = json_encode($input['excludes'] ?? [], JSON_UNESCAPED_UNICODE);
        $keberangkatan = $input['keberangkatan'];
        $maskapai = $input['maskapai'];
        $hotel = $input['hotel'];
        $wa = $input['wa'];

        $stmt->bind_param(
            "sssssisssississsss",
            $nama, $image, $harga, $durasi, $kapasitas,
            $rating, $badge, $badgeColor, $fasilitas,
            $highlight, $deskripsi, $itinerary, $includes,
            $excludes, $keberangkatan, $maskapai, $hotel, $wa
        );

        if ($stmt->execute()) {
            respond([
                'success' => true,
                'message' => 'Paket berhasil ditambahkan',
                'id' => $conn->insert_id
            ], 201);
        } else {
            respond(['success' => false, 'message' => 'Gagal menambahkan paket: ' . $stmt->error], 500);
        }
        break;

    // ----------------------------------------
    // PUT - Update paket
    // ----------------------------------------
    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || !isset($input['id'])) {
            respond(['success' => false, 'message' => 'Data tidak valid atau ID tidak ada'], 400);
        }

        $id = intval($input['id']);

        // Cek apakah paket ada
        $check = $conn->prepare("SELECT id FROM paket_travel WHERE id = ?");
        $check->bind_param("i", $id);
        $check->execute();
        if ($check->get_result()->num_rows === 0) {
            respond(['success' => false, 'message' => 'Paket tidak ditemukan'], 404);
        }

        $stmt = $conn->prepare("UPDATE paket_travel SET nama=?, image=?, harga=?, durasi=?, kapasitas=?, rating=?, badge=?, badgeColor=?, fasilitas=?, highlight=?, deskripsi=?, itinerary=?, `includes`=?, excludes=?, keberangkatan=?, maskapai=?, hotel=?, wa=? WHERE id=?");

        $nama = $input['nama'];
        $image = $input['image'] ?? '/images/default.jpg';
        $harga = $input['harga'];
        $durasi = $input['durasi'];
        $kapasitas = $input['kapasitas'];
        $rating = intval($input['rating'] ?? 5);
        $badge = $input['badge'] ?? null;
        $badgeColor = $input['badgeColor'] ?? null;
        $fasilitas = json_encode($input['fasilitas'] ?? [], JSON_UNESCAPED_UNICODE);
        $highlight = intval($input['highlight'] ?? 0);
        $deskripsi = $input['deskripsi'];
        $itinerary = json_encode($input['itinerary'] ?? [], JSON_UNESCAPED_UNICODE);
        $includes = json_encode($input['includes'] ?? [], JSON_UNESCAPED_UNICODE);
        $excludes = json_encode($input['excludes'] ?? [], JSON_UNESCAPED_UNICODE);
        $keberangkatan = $input['keberangkatan'];
        $maskapai = $input['maskapai'];
        $hotel = $input['hotel'];
        $wa = $input['wa'];

        $stmt->bind_param(
            "sssssisssississsssi",
            $nama, $image, $harga, $durasi, $kapasitas,
            $rating, $badge, $badgeColor, $fasilitas,
            $highlight, $deskripsi, $itinerary, $includes,
            $excludes, $keberangkatan, $maskapai, $hotel, $wa,
            $id
        );

        if ($stmt->execute()) {
            respond(['success' => true, 'message' => 'Paket berhasil diperbarui']);
        } else {
            respond(['success' => false, 'message' => 'Gagal memperbarui paket: ' . $stmt->error], 500);
        }
        break;

    // ----------------------------------------
    // DELETE - Hapus paket
    // ----------------------------------------
    case 'DELETE':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if ($id <= 0) {
            // Coba ambil dari body
            $input = json_decode(file_get_contents('php://input'), true);
            $id = intval($input['id'] ?? 0);
        }

        if ($id <= 0) {
            respond(['success' => false, 'message' => 'ID paket tidak valid'], 400);
        }

        $stmt = $conn->prepare("DELETE FROM paket_travel WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                respond(['success' => true, 'message' => 'Paket berhasil dihapus']);
            } else {
                respond(['success' => false, 'message' => 'Paket tidak ditemukan'], 404);
            }
        } else {
            respond(['success' => false, 'message' => 'Gagal menghapus paket: ' . $stmt->error], 500);
        }
        break;

    // ----------------------------------------
    // Method tidak didukung
    // ----------------------------------------
    default:
        respond(['success' => false, 'message' => 'Method tidak didukung'], 405);
        break;
}

$conn->close();
