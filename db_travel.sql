
-- ============================================
-- Tabel: paket_travel
-- ============================================
DROP TABLE IF EXISTS `paket_travel`;
CREATE TABLE `paket_travel` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) NOT NULL DEFAULT '/images/default.jpg',
  `harga` VARCHAR(100) NOT NULL,
  `durasi` VARCHAR(50) NOT NULL,
  `kapasitas` VARCHAR(100) NOT NULL,
  `rating` INT(1) NOT NULL DEFAULT 5,
  `badge` VARCHAR(50) DEFAULT NULL,
  `badgeColor` VARCHAR(50) DEFAULT NULL,
  `fasilitas` TEXT NOT NULL,
  `highlight` TINYINT(1) NOT NULL DEFAULT 0,
  `deskripsi` TEXT NOT NULL,
  `itinerary` TEXT NOT NULL,
  `includes` TEXT NOT NULL,
  `excludes` TEXT NOT NULL,
  `keberangkatan` VARCHAR(100) NOT NULL,
  `maskapai` VARCHAR(100) NOT NULL,
  `hotel` VARCHAR(255) NOT NULL,
  `wa` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Seed Data: 4 Paket Travel
-- ============================================
INSERT INTO `paket_travel` (`nama`, `image`, `harga`, `durasi`, `kapasitas`, `rating`, `badge`, `badgeColor`, `fasilitas`, `highlight`, `deskripsi`, `itinerary`, `includes`, `excludes`, `keberangkatan`, `maskapai`, `hotel`, `wa`) VALUES

-- Paket 1: Haji Khusus Plus
(
  'Haji Khusus Plus 2026',
  '/images/haji-khusus.jpg',
  'Rp 220.000.000',
  '40 Hari',
  'Terbatas 45 Seat',
  5,
  'TERBATAS',
  'bg-red-500',
  '["Hotel Bintang 5 dekat Masjidil Haram","Pembimbing Bersertifikat Kemenag","Visa Haji Resmi","Full Board (Makan 3x Sehari)","Manasik Intensif 6 Bulan"]',
  1,
  'Paket haji khusus premium kami dirancang untuk memberikan pengalaman ibadah terbaik dan penuh ketenangan. Dengan fasilitas bintang 5 dan pembimbing berpengalaman, kami memastikan setiap momen ibadah Anda berjalan dengan sempurna.',
  '["Hari 1-3: Keberangkatan dari Jakarta – tiba Madinah","Hari 4-9: Ibadah Arbain di Madinah & Ziarah","Hari 10-12: Perjalanan ke Makkah","Hari 13-20: Persiapan & Manasik Haji di Makkah","Hari 21-26: Puncak Ibadah Haji (Arafah, Muzdalifah, Mina)","Hari 27-38: Ibadah Pasca Haji & Thawaf Wada","Hari 39-40: Kepulangan ke Jakarta"]',
  '["Tiket PP Garuda Indonesia Kelas Bisnis","Hotel Bintang 5 dekat Masjidil Haram","Hotel Bintang 5 di Madinah","Visa Haji Resmi","Full Board (3x Makan Sehari)","Pembimbing Ibadah Bersertifikat Kemenag","Manasik Intensif 6 Bulan","Perlengkapan Haji Lengkap","Asuransi Perjalanan Premium","Transportasi AC selama ibadah"]',
  '["Biaya personal","Oleh-oleh","Tips guide lokal"]',
  'Juni 2026',
  'Garuda Indonesia',
  'Hilton & Pullman Makkah',
  'https://wa.me/6281234567890?text=Assalamualaikum,%20saya%20tertarik%20dengan%20Paket%20Haji%20Khusus%20Plus%202026'
),

-- Paket 2: Umroh Reguler
(
  'Umroh Reguler',
  '/images/umroh-reguler.jpg',
  'Rp 32.500.000',
  '12 Hari',
  'Setiap Bulan',
  5,
  'TERPOPULER',
  'bg-[#1a5c3a]',
  '["Hotel Bintang 4 Makkah & Madinah","Tiket PP Garuda / Saudi Airlines","Pembimbing Ibadah Berpengalaman","Full Board Makkah & Madinah","Ziarah Makkah & Madinah"]',
  0,
  'Paket umroh reguler kami adalah pilihan terbaik untuk Anda yang ingin menjalankan ibadah umroh dengan nyaman dan terjangkau. Tersedia setiap bulan dengan kuota terbatas untuk pelayanan optimal.',
  '["Hari 1: Berangkat dari Jakarta","Hari 2-5: Madinah – Shalat Arbain & Ziarah","Hari 6: Perjalanan ke Makkah via Bir Ali","Hari 7-10: Makkah – Umroh & Ibadah","Hari 11: Ziarah Makkah & persiapan pulang","Hari 12: Kembali ke Jakarta"]',
  '["Tiket PP Garuda / Saudi Airlines","Hotel Bintang 4 di Makkah & Madinah","Visa Umroh","Full Board selama di Makkah & Madinah","Pembimbing Ibadah Berpengalaman","Ziarah Makkah & Madinah","Perlengkapan Umroh","Asuransi Perjalanan"]',
  '["Biaya personal","Oleh-oleh","Airport tax"]',
  'Setiap Bulan',
  'Garuda / Saudi Airlines',
  'Swiss-Belhotel Makkah',
  'https://wa.me/6281234567890?text=Assalamualaikum,%20saya%20tertarik%20dengan%20Paket%20Umroh%20Reguler'
),

-- Paket 3: Umroh Ramadhan
(
  'Umroh Ramadhan',
  '/images/umroh-ramadhan.jpg',
  'Rp 45.000.000',
  '15 Hari',
  'Ramadhan 2026',
  5,
  'SPESIAL',
  'bg-[#c9a84c]',
  '["Hotel Bintang 5 Makkah","Shalat Tarawih di Masjidil Haram","Itikaf 10 Malam Terakhir","Pembimbing Khusus Ramadhan","Full Board + Sahur & Buka"]',
  0,
  'Rasakan keistimewaan ibadah umroh di bulan suci Ramadhan. Shalat tarawih di Masjidil Haram, berbuka bersama ribuan jamaah, dan mengejar malam Lailatul Qadar – pengalaman spiritual yang tak terlupakan seumur hidup.',
  '["Hari 1: Keberangkatan Jakarta – Madinah","Hari 2-5: Madinah – Shalat Tarawih & Ziarah","Hari 6: Perjalanan ke Makkah","Hari 7-12: Makkah – Umroh & Tarawih di Masjidil Haram","Hari 13-14: Itikaf 10 Malam Terakhir","Hari 15: Kembali ke Jakarta"]',
  '["Tiket PP Emirates / Saudia","Hotel Bintang 5 di Makkah","Hotel Bintang 4 di Madinah","Visa Umroh","Full Board + Sahur & Berbuka","Pembimbing Khusus Ramadhan","Program Itikaf 10 Malam Terakhir","Perlengkapan Umroh Premium","Asuransi Perjalanan"]',
  '["Biaya personal","Oleh-oleh"]',
  'Ramadhan 2026',
  'Emirates / Saudia',
  'Fairmont Makkah',
  'https://wa.me/6281234567890?text=Assalamualaikum,%20saya%20tertarik%20dengan%20Paket%20Umroh%20Ramadhan%202026'
),

-- Paket 4: Umroh Plus Turki
(
  'Umroh Plus Turki',
  '/images/turki.jpg',
  'Rp 58.000.000',
  '18 Hari',
  'Terbatas 30 Seat',
  5,
  'PREMIUM',
  'bg-purple-600',
  '["Makkah + Madinah + Istanbul","Hotel Bintang 5 Semua Kota","City Tour Istanbul & Cappadocia","Full Board Sepanjang Perjalanan","Perlengkapan Umroh Premium"]',
  0,
  'Padukan ibadah umroh yang khusyuk dengan wisata sejarah Islam di Turki. Kunjungi Hagia Sophia, Topkapi Palace, dan keajaiban alam Cappadocia dalam satu perjalanan tak terlupakan.',
  '["Hari 1: Jakarta – Istanbul","Hari 2-4: Istanbul – Hagia Sophia, Topkapi, Grand Bazaar","Hari 5-6: Cappadocia – Balon Udara & Ziarah","Hari 7: Istanbul – Madinah","Hari 8-11: Madinah – Shalat & Ziarah","Hari 12: Madinah – Makkah","Hari 13-17: Makkah – Umroh & Ibadah","Hari 18: Kembali ke Jakarta"]',
  '["Tiket PP Turkish Airlines","Hotel Bintang 5 di Istanbul, Makkah & Madinah","Visa Umroh + Visa Turki","Full Board sepanjang perjalanan","City Tour Istanbul & Cappadocia","Naik Balon Udara Cappadocia","Pembimbing Ibadah & Tour Guide","Perlengkapan Umroh Premium","Asuransi Perjalanan Internasional"]',
  '["Biaya personal","Oleh-oleh","Tips guide"]',
  'Sesuai Jadwal',
  'Turkish Airlines',
  'Swissotel Istanbul & Fairmont Makkah',
  'https://wa.me/6281234567890?text=Assalamualaikum,%20saya%20tertarik%20dengan%20Paket%20Umroh%20Plus%20Turki'
);
