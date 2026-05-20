const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ [WARNING] SUPABASE_URL atau SUPABASE_KEY belum didefinisikan pada berkas .env!');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseKey || 'placeholder-anon-key'
);

// Helper function to test connection
async function testConnection() {
  if (!supabaseUrl || !supabaseKey) return;
  try {
    const { data, error } = await supabase.from('paket_travel').select('id').limit(1);
    if (error) {
      console.error('⚠️ [ERROR] Gagal terhubung ke Supabase:', error.message);
    } else {
      console.log('✅ Berhasil terhubung ke Supabase!');
    }
  } catch (err) {
    console.error('⚠️ [ERROR] Koneksi Supabase gagal:', err.message);
  }
}

testConnection();

module.exports = supabase;
