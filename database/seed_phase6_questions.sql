-- ==================================================
-- EDUQUEST - SEED 25+ QUESTIONS ACROSS 5 SUBJECTS
-- Database: eduquest
-- ==================================================

USE `eduquest`;

-- --------------------------------------------------
-- 1. PPLG (Pengembangan Perangkat Lunak & Gim) - Subject ID 1
-- --------------------------------------------------

-- Q6 (Hardware/Network)
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(6, 1, 'Elemen HTML5 yang digunakan secara khusus untuk membuat paragraf teks adalah...', 'PPLG', 'easy', 'Tag <p> merupakan singkatan dari Paragraph dalam standar HTML5.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(21, 6, '<p>', 1),
(22, 6, '<div>', 0),
(23, 6, '<span>', 0),
(24, 6, '<h1>', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q7
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(7, 1, 'Properti CSS yang digunakan untuk mengubah warna latar belakang sebuah elemen adalah...', 'PPLG', 'easy', 'Properti background-color menentukan warna background dari elemen HTML.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(25, 7, 'color', 0),
(26, 7, 'background-color', 1),
(27, 7, 'font-style', 0),
(28, 7, 'border-color', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q8
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(8, 1, 'Keyword JavaScript yang digunakan untuk mendeklarasikan variabel yang nilainya tidak dapat diubah (konstan) adalah...', 'PPLG', 'easy', 'const digunakan untuk variabel konstan yang tidak boleh di-reassign.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(29, 8, 'var', 0),
(30, 8, 'let', 0),
(31, 8, 'const', 1),
(32, 8, 'function', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q9
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(9, 1, 'Perintah SQL yang digunakan untuk mengambil dan menampilkan data dari tabel database adalah...', 'PPLG', 'easy', 'Query SELECT digunakan untuk membaca/mengambil record data dari database.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(33, 9, 'INSERT', 0),
(34, 9, 'SELECT', 1),
(35, 9, 'UPDATE', 0),
(36, 9, 'DELETE', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q10
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(10, 1, 'Method HTTP yang umum digunakan untuk mengunduh atau membaca data tanpa mengubah state di server adalah...', 'PPLG', 'easy', 'HTTP GET digunakan untuk meminta/membaca data dari server.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(37, 10, 'POST', 0),
(38, 10, 'GET', 1),
(39, 10, 'DELETE', 0),
(40, 10, 'PUT', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);


-- --------------------------------------------------
-- 2. BAHASA INDONESIA (BINDO) - Subject ID 2
-- --------------------------------------------------

-- Q11
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(11, 2, 'Gagasan utama atau pokok pikiran yang menjadi inti dari pembahasan sebuah paragraf disebut...', 'Bahasa Indonesia', 'easy', 'Ide pokok atau gagasan utama merupakan acuan inti pengembangan paragraf.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(41, 11, 'Kalimat Penjelas', 0),
(42, 11, 'Ide Pokok', 1),
(43, 11, 'Kesimpulan', 0),
(44, 11, 'Judul', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q12
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(12, 2, 'Penulisan kata baku yang sesuai dengan KBBI di bawah ini adalah...', 'Bahasa Indonesia', 'easy', 'Kata baku yang tepat sesuai pedoman KBBI adalah "Kualitas".')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(45, 12, 'Kwalitas', 0),
(46, 12, 'Kualitas', 1),
(47, 12, 'Kwaliteid', 0),
(48, 12, 'Kwalitet', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q13
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(13, 2, 'Teks yang berisi langkah-langkah atau tahapan sistematis untuk menyelesaikan suatu kegiatan dinamakan...', 'Bahasa Indonesia', 'easy', 'Teks prosedur memuat langkah-langkah secara berurutan.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(49, 13, 'Teks Narasi', 0),
(50, 13, 'Teks Prosedur', 1),
(51, 13, 'Teks Puisi', 0),
(52, 13, 'Teks Deskripsi', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q14
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(14, 2, 'Ciri khas kalimat efektif yang baik adalah...', 'Bahasa Indonesia', 'easy', 'Kalimat efektif harus hemat kata, logis, dan mudah dipahami.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(53, 14, 'Menggunakan banyak kata kiasan ambigu', 0),
(54, 14, 'Hemat kata, jelas, dan lugas', 1),
(55, 14, 'Panjang tanpa titik koma', 0),
(56, 14, 'Menggunakan bahasa daerah secara acak', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q15
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(15, 2, 'Majas yang membandingkan benda mati seolah-olah memiliki sifat seperti manusia dinamakan...', 'Bahasa Indonesia', 'easy', 'Majas Personifikasi memberikan sifat manusia pada benda mati.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(57, 15, 'Hiperbola', 0),
(58, 15, 'Personifikasi', 1),
(59, 15, 'Metafora', 0),
(60, 15, 'Ironi', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);


-- --------------------------------------------------
-- 3. MATEMATIKA (MATH) - Subject ID 3
-- --------------------------------------------------

-- Q16
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(16, 3, 'Sebuah toko buku memberikan diskon 20% untuk buku seharga Rp50.000. Berapakah harga buku setelah diskon?', 'Matematika', 'easy', 'Diskon = 20% × 50.000 = 10.000. Harga bayar = 50.000 - 10.000 = Rp40.000.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(61, 16, 'Rp35.000', 0),
(62, 16, 'Rp40.000', 1),
(63, 16, 'Rp45.000', 0),
(64, 16, 'Rp30.000', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q17
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(17, 3, 'Jika 3x + 5 = 20, berapakah nilai dari x?', 'Matematika', 'easy', '3x = 20 - 5 = 15. Maka x = 15 / 3 = 5.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(65, 17, 'x = 4', 0),
(66, 17, 'x = 5', 1),
(67, 17, 'x = 6', 0),
(68, 17, 'x = 7', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q18
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(18, 3, 'Luas persegi panjang dengan panjang 12 cm dan lebar 8 cm adalah...', 'Matematika', 'easy', 'Luas = Panjang × Lebar = 12 × 8 = 96 cm².')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(69, 18, '80 cm²', 0),
(70, 18, '96 cm²', 1),
(71, 18, '100 cm²', 0),
(72, 18, '40 cm²', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q19
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(19, 3, 'Rata-rata (mean) dari nilai ujian: 70, 80, 90, 100 adalah...', 'Matematika', 'easy', 'Total = 340. Jumlah data = 4. Rata-rata = 340 / 4 = 85.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(73, 19, '80', 0),
(74, 19, '85', 1),
(75, 19, '90', 0),
(76, 19, '82.5', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q20
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(20, 3, 'Skala peta 1 : 1.000. Jarak pada peta 5 cm. Jarak sebenarnya di lapangan adalah...', 'Matematika', 'easy', 'Jarak sebenarnya = 5 cm × 1.000 = 5.000 cm = 50 meter.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(77, 20, '500 meter', 0),
(78, 20, '50 meter', 1),
(79, 20, '5 meter', 0),
(80, 20, '5.000 meter', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);


-- --------------------------------------------------
-- 4. BAHASA INGGRIS (BING) - Subject ID 4
-- --------------------------------------------------

-- Q21
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(21, 4, 'Choose the correct form: "She _______ to the school library every morning."', 'Bahasa Inggris', 'easy', 'Simple Present Tense for 3rd person singular (She/He/It) uses verb+s (goes).')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(81, 21, 'go', 0),
(82, 21, 'goes', 1),
(83, 21, 'went', 0),
(84, 21, 'going', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q22
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(22, 4, 'What is the synonym of the word "Intelligent"?', 'Bahasa Inggris', 'easy', 'Smart has the same meaning as intelligent.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(85, 22, 'Lazy', 0),
(86, 22, 'Smart', 1),
(87, 22, 'Slow', 0),
(88, 22, 'Noisy', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q23
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(23, 4, 'Complete the past simple sentence: "We _______ a software project yesterday."', 'Bahasa Inggris', 'easy', 'Past tense of finish is finished.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(89, 23, 'finish', 0),
(90, 23, 'finished', 1),
(91, 23, 'finishing', 0),
(92, 23, 'will finish', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q24
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(24, 4, 'Which expression is best used when greeting your teacher politely in the afternoon?', 'Bahasa Inggris', 'easy', 'Good afternoon is the polite formal greeting after midday.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(93, 24, 'What\'s up bro', 0),
(94, 24, 'Good afternoon, Teacher', 1),
(95, 24, 'See ya later', 0),
(96, 24, 'Good night, Teacher', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q25
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(25, 4, 'Identify the correct passive voice: "The code was written _______ Budi."', 'Bahasa Inggris', 'easy', 'Preposition "by" indicates the agent performing the action in passive voice.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(97, 25, 'with', 0),
(98, 25, 'by', 1),
(99, 25, 'for', 0),
(100, 25, 'from', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);


-- --------------------------------------------------
-- 5. PROJEK KREATIF & KEWIRAUSAHAAN (PKK) - Subject ID 5
-- --------------------------------------------------

-- Q26
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(26, 5, 'Kondisi di mana total pendapatan usaha sama persis dengan total biaya yang dikeluarkan dinamakan...', 'PKK', 'easy', 'BEP (Break Even Point) adalah titik impas di mana modal usaha kembali tanpa untung maupun rugi.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(101, 26, 'Laba Bersih', 0),
(102, 26, 'Break Even Point (BEP)', 1),
(103, 26, 'Kerugian Total', 0),
(104, 26, 'Omset Bruto', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q27
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(27, 5, 'Langkah pertama yang paling krusial sebelum meluncurkan produk aplikasi baru adalah...', 'PKK', 'easy', 'Analisis kebutuhan & riset target pasar dilakukan terlebih dahulu untuk memastikan produk relevan.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(105, 27, 'Meminjam uang bank sebanyak mungkin', 0),
(106, 27, 'Riset pasar & identifikasi kebutuhan pengguna', 1),
(107, 27, 'Langsung mencetak brosur fisik 1000 lembar', 0),
(108, 27, 'Menutup kantor usaha', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q28
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(28, 5, 'Desain visual unik seperti nama, simbol, atau logo yang membedakan produk kita dari pesaing disebut...', 'PKK', 'easy', 'Branding / Merk merupakan identitas visual produk.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(109, 28, 'Kwitansi', 0),
(110, 28, 'Branding / Logo Merk', 1),
(111, 28, 'Faktur Penjualan', 0),
(112, 28, 'Buku Kas', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q29
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(29, 5, 'Media promosi paling efektif untuk menjangkau generasi muda di era digital saat ini adalah...', 'PKK', 'easy', 'Media sosial dan digital marketing adalah sarana paling efektif menjangkau anak muda.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(113, 29, 'Surat kabar koran cetak', 0),
(114, 29, 'Media Sosial & Pemasaran Digital', 1),
(115, 29, 'Iklan radio AM', 0),
(116, 29, 'Selebaran di tiang listrik', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);

-- Q30
INSERT INTO `questions` (`id`, `subject_id`, `question_text`, `category`, `difficulty`, `explanation`) VALUES
(30, 5, 'Analisis SWOT merupakan metode perencanaan strategis. Huruf S dalam SWOT melambangkan...', 'PKK', 'easy', 'Strengths (Kekuatan) internal yang dimiliki oleh usaha/produk.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`), `explanation` = VALUES(`explanation`);

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(117, 30, 'System', 0),
(118, 30, 'Strengths (Kekuatan)', 1),
(119, 30, 'Strategy', 0),
(120, 30, 'Sales', 0)
ON DUPLICATE KEY UPDATE `answer_text` = VALUES(`answer_text`), `is_correct` = VALUES(`is_correct`);


-- --------------------------------------------------
-- MAP QUESTS TO QUESTIONS (quest_questions)
-- --------------------------------------------------

-- Quest 2 (Lab Komputer - PPLG Dasar): Questions 6-10
INSERT INTO `quest_questions` (`quest_id`, `question_id`, `question_order`) VALUES
(2, 6, 1), (2, 7, 2), (2, 8, 3), (2, 9, 4), (2, 10, 5),
-- Quest 3 (Perpustakaan - Literasi/BINDO): Questions 11-15
(3, 11, 1), (3, 12, 2), (3, 13, 3), (3, 14, 4), (3, 15, 5),
-- Quest 5 (Aula - Matematika): Questions 16-20
(5, 16, 1), (5, 17, 2), (5, 18, 3), (5, 19, 4), (5, 20, 5),
-- Quest 6 (Ruang Guru - Bahasa Indonesia Lanjutan): Questions 11-15
(6, 11, 1), (6, 12, 2), (6, 13, 3), (6, 14, 4), (6, 15, 5),
-- Quest 7 (English Corner): Questions 21-25
(7, 21, 1), (7, 22, 2), (7, 23, 3), (7, 24, 4), (7, 25, 5),
-- Quest 10 (Kewirausahaan Kantin - PKK): Questions 26-30
(10, 26, 1), (10, 27, 2), (10, 28, 3), (10, 29, 4), (10, 30, 5)
ON DUPLICATE KEY UPDATE `question_order` = VALUES(`question_order`);
