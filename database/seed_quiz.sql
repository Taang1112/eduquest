-- ==================================================
-- EDUQUEST - SEED QUIZ QUESTIONS & ANSWERS (PHASE 4)
-- Database Name: eduquest
-- ==================================================

USE `eduquest`;

-- --------------------------------------------------
-- 1. QUEST 1 QUESTIONS (Kenali Sekolahmu - Quest ID 1)
-- --------------------------------------------------

-- Q1
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(1, 'Di manakah tempat utama bagi siswa untuk membaca dan meminjam buku di sekolah?', 'Lingkungan Sekolah', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(1, 1, 'Kantin Sekolah', 0),
(2, 1, 'Perpustakaan Sekolah', 1),
(3, 1, 'Lab Komputer', 0),
(4, 1, 'Lapangan Olahraga', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q2
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(2, 'Ruangan yang khusus digunakan untuk kegiatan belajar mengajar sehari-hari adalah...', 'Lingkungan Sekolah', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(5, 2, 'Ruang Kelas', 1),
(6, 2, 'Kantin Sekolah', 0),
(7, 2, 'Gudang Sekolah', 0),
(8, 2, 'Parkiran', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q3
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(3, 'Perilaku utama yang harus dijaga saat berada di lingkungan sekolah adalah...', 'Tata Tertib', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(9, 3, 'Membuang sampah di sembarang tempat', 0),
(10, 3, 'Mengganggu teman yang sedang belajar', 0),
(11, 3, 'Mematuhi tata tertib & menjaga kebersihan', 1),
(12, 3, 'Datang terlambat setiap hari', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q4
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(4, 'Fungsi utama dari Kantin sekolah adalah...', 'Fasilitas Sekolah', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(13, 4, 'Tempat pertandingan sepak bola', 0),
(14, 4, 'Tempat membeli makanan & minuman sehat', 1),
(15, 4, 'Tempat ujian nasional', 0),
(16, 4, 'Tempat perbaikan komputer', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q5
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(5, 'Fasilitas outdoor sekolah yang digunakan untuk upacara bendera dan kegiatan olahraga adalah...', 'Fasilitas Sekolah', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(17, 5, 'Halaman/Lapangan Sekolah', 1),
(18, 5, 'Perpustakaan', 0),
(19, 5, 'Lab Komputer', 0),
(20, 5, 'Ruang Kepala Sekolah', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);


-- --------------------------------------------------
-- 2. QUEST 2 QUESTIONS (Temukan Lab Komputer - Quest ID 2)
-- --------------------------------------------------

-- Q6
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(6, 'Perangkat keras (hardware) yang digunakan untuk memasukkan teks ke komputer adalah...', 'Dasar Komputer', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(21, 6, 'Monitor', 0),
(22, 6, 'Keyboard', 1),
(23, 6, 'Speaker', 0),
(24, 6, 'Printer', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q7
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(7, 'Komponen komputer yang berfungsi menampilkan output visual layar ke pengguna adalah...', 'Dasar Komputer', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(25, 7, 'Monitor', 1),
(26, 7, 'Mouse', 0),
(27, 7, 'Power Supply', 0),
(28, 7, 'Harddisk Drive', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q8
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(8, 'Otak atau unit pemroses utama dari sebuah sistem komputer dinamakan...', 'Hardware Komputer', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(29, 8, 'RAM', 0),
(30, 8, 'CPU (Central Processing Unit)', 1),
(31, 8, 'VGA Card', 0),
(32, 8, 'Keyboard', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q9
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(9, 'Untuk menjaga keamanan akun digital saat menggunakan komputer umum di lab, kita harus...', 'Keamanan Digital', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(33, 9, 'Menyimpan password di browser umum', 0),
(34, 9, 'Selalu Logout setelah selesai menggunakan', 1),
(35, 9, 'Membiarkan akun tetap terbuka', 0),
(36, 9, 'Memberikan password kepada orang lain', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q10
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(10, 'Program/perangkat lunak yang digunakan untuk menjelajahi web dan internet disebut...', 'Software', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(37, 10, 'Operating System', 0),
(38, 10, 'Web Browser', 1),
(39, 10, 'Antivirus', 0),
(40, 10, 'Calculator', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);


-- --------------------------------------------------
-- 3. QUEST 3 QUESTIONS (Belajar di Perpustakaan - Quest ID 3)
-- --------------------------------------------------

-- Q11
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(11, 'Sikap sopan dan tertib yang wajib diterapkan saat berada di dalam Perpustakaan adalah...', 'Literasi', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(41, 11, 'Berbicara sangat keras', 0),
(42, 11, 'Menjaga ketenangan & tidak gaduh', 1),
(43, 11, 'Berlarian antar rak buku', 0),
(44, 11, 'Makan di meja baca', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q12
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(12, 'Bagian dari buku yang berisi daftar judul bab dan halaman pembahasan disebut...', 'Struktur Buku', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(45, 12, 'Sampul Belakang', 0),
(46, 12, 'Daftar Isi', 1),
(47, 12, 'Glosarium', 0),
(48, 12, 'Biografi Penulis', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q13
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(13, 'Kemampuan untuk menemukan, memahami, dan mengevaluasi informasi secara bijak dinamakan...', 'Literasi Informasi', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(49, 13, 'Literasi Informasi', 1),
(50, 13, 'Plagiarisme', 0),
(51, 13, 'Hoaks', 0),
(52, 13, 'Grafika', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q14
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(14, 'Sistem klasifikasi rapi yang digunakan untuk mengelompokkan buku di perpustakaan bertujuan untuk...', 'Sistem Perpustakaan', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(53, 14, 'Menyulitkan pembaca', 0),
(54, 14, 'Memudahkan pencarian buku sesuai subjek', 1),
(55, 14, 'Menyembunyikan buku mahal', 0),
(56, 14, 'Membuat rak penuh', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q15
INSERT INTO `questions` (`id`, `question_text`, `category`, `difficulty`) VALUES
(15, 'Tindakan meniru atau menyalin karya orang lain tanpa mencantumkan sumber asli disebut...', 'Etika Karya', 'easy')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(57, 15, 'Referensi', 0),
(58, 15, 'Plagiarisme', 1),
(59, 15, 'Apresiasi', 0),
(60, 15, 'Pengutipan', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);


-- --------------------------------------------------
-- 4. MAP QUEST TO QUESTIONS (quest_questions)
-- (Quest 1 is Exploration only — NO QUIZ)
-- --------------------------------------------------

-- Quest 2 Maps Questions 6-10
INSERT INTO `quest_questions` (`quest_id`, `question_id`, `question_order`) VALUES
(2, 6, 1), (2, 7, 2), (2, 8, 3), (2, 9, 4), (2, 10, 5),
-- Quest 3 Maps Questions 11-15
(3, 11, 1), (3, 12, 2), (3, 13, 3), (3, 14, 4), (3, 15, 5)
ON DUPLICATE KEY UPDATE `question_order` = VALUES(`question_order`);
