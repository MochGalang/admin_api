const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// ----------------------------------------
// GET - Ambil semua galeri
// ----------------------------------------
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error GET /galeri:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data galeri: ' + error.message });
  }
});

// ----------------------------------------
// POST - Tambah foto galeri baru
// ----------------------------------------
router.post('/', async (req, res) => {
  try {
    const input = req.body;

    if (!input || !input.image) {
      return res.status(400).json({ success: false, message: "Field 'image' wajib diisi" });
    }

    const payload = {
      image: input.image,
      title: input.title || '',
      category: input.category || '',
      tall: !!input.tall
    };

    const { data, error } = await supabase
      .from('galeri')
      .insert([payload])
      .select();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Foto galeri berhasil ditambahkan',
      id: data[0].id
    });
  } catch (error) {
    console.error('Error POST /galeri:', error);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan foto: ' + error.message });
  }
});

// ----------------------------------------
// PUT - Update foto galeri
// ----------------------------------------
router.put('/', async (req, res) => {
  try {
    const input = req.body;

    if (!input || !input.id) {
      return res.status(400).json({ success: false, message: 'ID tidak ditemukan' });
    }

    const id = parseInt(input.id);
    const payload = {
      image: input.image,
      title: input.title || '',
      category: input.category || '',
      tall: !!input.tall
    };

    const { data, error } = await supabase
      .from('galeri')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Foto tidak ditemukan' });
    }

    return res.json({ success: true, message: 'Foto galeri berhasil diperbarui' });
  } catch (error) {
    console.error('Error PUT /galeri:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui foto: ' + error.message });
  }
});

// ----------------------------------------
// DELETE - Hapus foto galeri
// ----------------------------------------
router.delete('/', async (req, res) => {
  try {
    let id = req.query.id ? parseInt(req.query.id) : 0;
    if (!id && req.body && req.body.id) id = parseInt(req.body.id);

    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'ID foto tidak valid' });
    }

    const { data, error } = await supabase
      .from('galeri')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Foto tidak ditemukan' });
    }

    return res.json({ success: true, message: 'Foto galeri berhasil dihapus' });
  } catch (error) {
    console.error('Error DELETE /galeri:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus foto: ' + error.message });
  }
});

module.exports = router;
