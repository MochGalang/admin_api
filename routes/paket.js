const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to safe parse JSON fields
function safeParseJSON(value, defaultValue = []) {
  if (!value) return defaultValue;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (e) {
    return defaultValue;
  }
}

// Helper to format a single package row to match PHP output format
function formatPaket(row) {
  return {
    ...row,
    id: parseInt(row.id),
    rating: parseInt(row.rating),
    highlight: !!row.highlight,
    fasilitas: safeParseJSON(row.fasilitas, []),
    itinerary: safeParseJSON(row.itinerary, []),
    includes: safeParseJSON(row.includes, []),
    excludes: safeParseJSON(row.excludes, [])
  };
}

// ----------------------------------------
// GET - Ambil data paket (Semua atau Tunggal via ?id=X atau /:id)
// ----------------------------------------
router.get('/', async (req, res) => {
  try {
    const id = req.query.id;

    if (id !== undefined) {
      // Ambil satu paket berdasarkan query param ?id=X
      const paketId = parseInt(id);
      if (isNaN(paketId)) {
        return res.status(400).json({ success: false, message: 'ID tidak valid' });
      }

      const [rows] = await db.query('SELECT * FROM paket_travel WHERE id = ?', [paketId]);
      
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' });
      }

      return res.json({ success: true, data: formatPaket(rows[0]) });
    } else {
      // Ambil semua paket
      const [rows] = await db.query('SELECT * FROM paket_travel ORDER BY id ASC');
      const formattedRows = rows.map(row => formatPaket(row));
      
      return res.json({ success: true, data: formattedRows });
    }
  } catch (error) {
    console.error('Error GET /paket:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data paket: ' + error.message });
  }
});

// GET /:id route parameter for additional flexibility
router.get('/:id', async (req, res) => {
  try {
    const paketId = parseInt(req.params.id);
    if (isNaN(paketId)) {
      return res.status(400).json({ success: false, message: 'ID tidak valid' });
    }

    const [rows] = await db.query('SELECT * FROM paket_travel WHERE id = ?', [paketId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' });
    }

    return res.json({ success: true, data: formatPaket(rows[0]) });
  } catch (error) {
    console.error('Error GET /paket/:id:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data paket: ' + error.message });
  }
});

// ----------------------------------------
// POST - Tambah paket baru
// ----------------------------------------
router.post('/', async (req, res) => {
  try {
    const input = req.body;

    if (!input || Object.keys(input).length === 0) {
      return res.status(400).json({ success: false, message: 'Data tidak valid' });
    }

    // Validasi field wajib
    const required = ['nama', 'harga', 'durasi', 'kapasitas', 'deskripsi', 'keberangkatan', 'maskapai', 'hotel', 'wa'];
    for (const field of required) {
      if (input[field] === undefined || input[field] === null || input[field] === '') {
        return res.status(400).json({ success: false, message: `Field '${field}' wajib diisi` });
      }
    }

    const nama = input.nama;
    const image = input.image || '/images/default.jpg';
    const harga = input.harga;
    const durasi = input.durasi;
    const kapasitas = input.kapasitas;
    const rating = parseInt(input.rating !== undefined ? input.rating : 5);
    const badge = input.badge || null;
    const badgeColor = input.badgeColor || null;
    const fasilitas = JSON.stringify(input.fasilitas || []);
    const highlight = parseInt(input.highlight !== undefined ? input.highlight : 0);
    const deskripsi = input.deskripsi;
    const itinerary = JSON.stringify(input.itinerary || []);
    const includes = JSON.stringify(input.includes || []);
    const excludes = JSON.stringify(input.excludes || []);
    const keberangkatan = input.keberangkatan;
    const maskapai = input.maskapai;
    const hotel = input.hotel;
    const wa = input.wa;

    const query = `
      INSERT INTO paket_travel 
      (nama, image, harga, durasi, kapasitas, rating, badge, badgeColor, fasilitas, highlight, deskripsi, itinerary, \`includes\`, excludes, keberangkatan, maskapai, hotel, wa) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      nama, image, harga, durasi, kapasitas,
      rating, badge, badgeColor, fasilitas,
      highlight, deskripsi, itinerary, includes,
      excludes, keberangkatan, maskapai, hotel, wa
    ]);

    return res.status(201).json({
      success: true,
      message: 'Paket berhasil ditambahkan',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error POST /paket:', error);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan paket: ' + error.message });
  }
});

// ----------------------------------------
// PUT - Update paket
// ----------------------------------------
router.put('/', async (req, res) => {
  try {
    const input = req.body;

    if (!input || input.id === undefined || input.id === null) {
      return res.status(400).json({ success: false, message: 'Data tidak valid atau ID tidak ada' });
    }

    const id = parseInt(input.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID tidak valid' });
    }

    // Cek apakah paket ada
    const [checkRows] = await db.query('SELECT id FROM paket_travel WHERE id = ?', [id]);
    if (checkRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' });
    }

    // Validasi field wajib untuk update (opsional, tapi disamakan seperti PHP)
    const required = ['nama', 'harga', 'durasi', 'kapasitas', 'deskripsi', 'keberangkatan', 'maskapai', 'hotel', 'wa'];
    for (const field of required) {
      if (input[field] === undefined || input[field] === null || input[field] === '') {
        return res.status(400).json({ success: false, message: `Field '${field}' wajib diisi` });
      }
    }

    const nama = input.nama;
    const image = input.image || '/images/default.jpg';
    const harga = input.harga;
    const durasi = input.durasi;
    const kapasitas = input.kapasitas;
    const rating = parseInt(input.rating !== undefined ? input.rating : 5);
    const badge = input.badge || null;
    const badgeColor = input.badgeColor || null;
    const fasilitas = JSON.stringify(input.fasilitas || []);
    const highlight = parseInt(input.highlight !== undefined ? input.highlight : 0);
    const deskripsi = input.deskripsi;
    const itinerary = JSON.stringify(input.itinerary || []);
    const includes = JSON.stringify(input.includes || []);
    const excludes = JSON.stringify(input.excludes || []);
    const keberangkatan = input.keberangkatan;
    const maskapai = input.maskapai;
    const hotel = input.hotel;
    const wa = input.wa;

    const query = `
      UPDATE paket_travel SET 
        nama=?, image=?, harga=?, durasi=?, kapasitas=?, rating=?, badge=?, badgeColor=?, 
        fasilitas=?, highlight=?, deskripsi=?, itinerary=?, \`includes\`=?, excludes=?, 
        keberangkatan=?, maskapai=?, hotel=?, wa=? 
      WHERE id=?
    `;

    await db.query(query, [
      nama, image, harga, durasi, kapasitas, rating, badge, badgeColor,
      fasilitas, highlight, deskripsi, itinerary, includes, excludes,
      keberangkatan, maskapai, hotel, wa, id
    ]);

    return res.json({ success: true, message: 'Paket berhasil diperbarui' });
  } catch (error) {
    console.error('Error PUT /paket:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui paket: ' + error.message });
  }
});

// ----------------------------------------
// DELETE - Hapus paket (via ?id=X atau body)
// ----------------------------------------
router.delete('/', async (req, res) => {
  try {
    let id = req.query.id ? parseInt(req.query.id) : 0;

    // Jika tidak ada di query, coba ambil dari body
    if (!id && req.body && req.body.id) {
      id = parseInt(req.body.id);
    }

    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'ID paket tidak valid' });
    }

    const [result] = await db.query('DELETE FROM paket_travel WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      return res.json({ success: true, message: 'Paket berhasil dihapus' });
    } else {
      return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error DELETE /paket:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus paket: ' + error.message });
  }
});

module.exports = router;
