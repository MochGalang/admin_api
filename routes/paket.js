const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// ----------------------------------------
// GET - Ambil data paket (Semua atau Tunggal via ?id=X)
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

      const { data, error } = await supabase
        .from('paket_travel')
        .select('*')
        .eq('id', paketId)
        .maybeSingle();


      console.log(data)
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' });
      }

      return res.json({ success: true, data });
    } else {
      // Ambil semua paket
      const { data, error } = await supabase
        .from('paket_travel')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return res.json({ success: true, data: data || [] });
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

    const { data, error } = await supabase
      .from('paket_travel')
      .select('*')
      .eq('id', paketId)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' });
    }

    return res.json({ success: true, data });
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

    const payload = {
      nama: input.nama,
      image: input.image || '/images/default.jpg',
      harga: input.harga,
      durasi: input.durasi,
      kapasitas: input.kapasitas,
      rating: parseInt(input.rating !== undefined ? input.rating : 5),
      badge: input.badge || null,
      badgeColor: input.badgeColor || null,
      fasilitas: input.fasilitas || [], // Langsung array, Supabase & Postgres JSONB menanganinya secara native
      highlight: !!input.highlight, // Boolean native
      deskripsi: input.deskripsi,
      itinerary: input.itinerary || [],
      includes: input.includes || [],
      excludes: input.excludes || [],
      keberangkatan: input.keberangkatan,
      maskapai: input.maskapai,
      hotel: input.hotel,
      wa: input.wa
    };

    const { data, error } = await supabase
      .from('paket_travel')
      .insert([payload])
      .select();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Paket berhasil ditambahkan',
      id: data[0].id
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

    // Validasi field wajib
    const required = ['nama', 'harga', 'durasi', 'kapasitas', 'deskripsi', 'keberangkatan', 'maskapai', 'hotel', 'wa'];
    for (const field of required) {
      if (input[field] === undefined || input[field] === null || input[field] === '') {
        return res.status(400).json({ success: false, message: `Field '${field}' wajib diisi` });
      }
    }

    const payload = {
      nama: input.nama,
      image: input.image || '/images/default.jpg',
      harga: input.harga,
      durasi: input.durasi,
      kapasitas: input.kapasitas,
      rating: parseInt(input.rating !== undefined ? input.rating : 5),
      badge: input.badge || null,
      badgeColor: input.badgeColor || null,
      fasilitas: input.fasilitas || [],
      highlight: !!input.highlight,
      deskripsi: input.deskripsi,
      itinerary: input.itinerary || [],
      includes: input.includes || [],
      excludes: input.excludes || [],
      keberangkatan: input.keberangkatan,
      maskapai: input.maskapai,
      hotel: input.hotel,
      wa: input.wa
    };

    const { data, error } = await supabase
      .from('paket_travel')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' });
    }

    return res.json({ success: true, message: 'Paket berhasil diperbarui' });
  } catch (error) {
    console.error('Error PUT /paket:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui paket: ' + error.message });
  }
});

// ----------------------------------------
// DELETE - Hapus paket
// ----------------------------------------
router.delete('/', async (req, res) => {
  try {
    let id = req.query.id ? parseInt(req.query.id) : 0;

    if (!id && req.body && req.body.id) {
      id = parseInt(req.body.id);
    }

    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'ID paket tidak valid' });
    }

    const { data, error } = await supabase
      .from('paket_travel')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' });
    }

    return res.json({ success: true, message: 'Paket berhasil dihapus' });
  } catch (error) {
    console.error('Error DELETE /paket:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus paket: ' + error.message });
  }
});

module.exports = router;
