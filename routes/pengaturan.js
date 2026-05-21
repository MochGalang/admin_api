const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// ----------------------------------------
// GET - Ambil semua pengaturan
// ----------------------------------------
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pengaturan')
      .select('*');

    if (error) throw error;

    // Transform array of {kunci, nilai} into a flat object for easy frontend consumption
    const settings = {};
    (data || []).forEach(row => {
      settings[row.kunci] = row.nilai;
    });

    return res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error GET /pengaturan:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil pengaturan: ' + error.message });
  }
});

// ----------------------------------------
// PUT - Update pengaturan (bulk upsert)
// ----------------------------------------
router.put('/', async (req, res) => {
  try {
    const input = req.body;

    if (!input || Object.keys(input).length === 0) {
      return res.status(400).json({ success: false, message: 'Data pengaturan tidak valid' });
    }

    // Convert {alamat: "xxx", telepon: "xxx"} into [{kunci, nilai}, ...]
    const rows = Object.entries(input).map(([kunci, nilai]) => ({
      kunci,
      nilai: String(nilai)
    }));

    // Upsert each setting
    const { error } = await supabase
      .from('pengaturan')
      .upsert(rows, { onConflict: 'kunci' });

    if (error) throw error;

    return res.json({ success: true, message: 'Pengaturan berhasil disimpan' });
  } catch (error) {
    console.error('Error PUT /pengaturan:', error);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan pengaturan: ' + error.message });
  }
});

module.exports = router;
