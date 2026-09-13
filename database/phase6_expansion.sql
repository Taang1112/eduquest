-- ==================================================
-- EDUQUEST - PHASE 6 EXPANSION SQL MIGRATION
-- Database: eduquest
-- ==================================================

USE `eduquest`;

-- 1. Table: subjects (Educational Subject Categories)
CREATE TABLE IF NOT EXISTS `subjects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(20) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Ensure columns in questions
SET @exist_subj := (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'questions' AND table_schema = DATABASE() AND column_name = 'subject_id');
SET @sqlstmt := IF(@exist_subj = 0, 'ALTER TABLE `questions` ADD COLUMN `subject_id` INT DEFAULT NULL AFTER `id`', 'SELECT 1');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist_exp := (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'questions' AND table_schema = DATABASE() AND column_name = 'explanation');
SET @sqlstmt := IF(@exist_exp = 0, 'ALTER TABLE `questions` ADD COLUMN `explanation` TEXT AFTER `difficulty`', 'SELECT 1');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 3. Ensure columns in quests
SET @exist_req := (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'quests' AND table_schema = DATABASE() AND column_name = 'requires_quiz');
SET @sqlstmt := IF(@exist_req = 0, 'ALTER TABLE `quests` ADD COLUMN `requires_quiz` TINYINT(1) NOT NULL DEFAULT 0 AFTER `score_reward`', 'SELECT 1');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist_type := (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'quests' AND table_schema = DATABASE() AND column_name = 'type');
SET @sqlstmt := IF(@exist_type = 0, 'ALTER TABLE `quests` ADD COLUMN `type` ENUM("main", "side") DEFAULT "main" AFTER `prerequisite_quest_id`', 'SELECT 1');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Seed Subjects
INSERT INTO `subjects` (`id`, `code`, `name`, `description`) VALUES
(1, 'PPLG', 'Pengembangan Perangkat Lunak & Gim', 'Materi dasar pemrograman, web, database, dan logika perangkat lunak.'),
(2, 'BINDO', 'Bahasa Indonesia', 'Materi literasi, ide pokok, ejaan EYD, kata baku, dan analisis teks.'),
(3, 'MATH', 'Matematika', 'Materi aljabar dasar, persentase, geometri, statistik, dan aritmatika.'),
(4, 'BING', 'Bahasa Inggris', 'Materi grammar, vocabulary sekolah, conversation, dan reading comprehension.'),
(5, 'PKK', 'Projek Kreatif & Kewirausahaan', 'Materi dasar bisnis, target pasar, modal usaha, promosi, dan branding.')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`);

-- Seed Quests (10 Quests: 8 Main, 2 Side)
INSERT INTO `quests` (`id`, `title`, `description`, `xp_reward`, `score_reward`, `prerequisite_quest_id`, `type`, `requires_quiz`) VALUES
(1, 'Kenali Sekolahmu', 'Jelajahi beberapa area sekolah (Halaman, Koridor, Ruang Kelas, Lab Komputer, Perpustakaan, Kantin) dan temui Bu Sari.', 50, 10, NULL, 'main', 0),
(2, 'Temukan Lab Komputer', 'Pergilah ke Lab Komputer, temui Pak Andi, dan selesaikan kuis dasar komputer.', 75, 15, 1, 'main', 1),
(3, 'Belajar di Perpustakaan', 'Pergilah ke Perpustakaan, temui Rika, dan selesaikan kuis literasi sekolah.', 100, 20, 2, 'main', 1),
(4, 'Kenali Ruang Guru', 'Pergilah ke Ruang Guru dan temui Pak Eko untuk orientasi tugas sekolah.', 125, 25, 3, 'main', 0),
(5, 'Tantangan Matematika Aula', 'Kunjungi Aula Sekolah, temui Bimo, dan selesaikan kuis Matematika.', 150, 30, 4, 'main', 1),
(6, 'Bahasa & Sastra Sekolah', 'Bicara dengan Bu Sari di Ruang Guru dan selesaikan kuis Bahasa Indonesia.', 175, 35, 5, 'main', 1),
(7, 'English Corner', 'Pergilah ke Perpustakaan/UKS dan selesaikan kuis Bahasa Inggris.', 200, 40, 6, 'main', 1),
(8, 'Rahasia EDUQUEST', 'Temukan Taman Rahasia Alumni di sudut sekolah dan temui Senior Alumni.', 250, 50, 7, 'main', 0),
(9, 'Buku Catatan Hilang', 'Temukan Buku Catatan RPL yang tercecer di Ruang Kelas 1.', 60, 15, NULL, 'side', 0),
(10, 'Kewirausahaan Kantin', 'Bicara dengan Mbak Yanti di Kantin dan jawab tantangan kuis PKK.', 90, 20, NULL, 'side', 1)
ON DUPLICATE KEY UPDATE 
    `title` = VALUES(`title`),
    `description` = VALUES(`description`),
    `xp_reward` = VALUES(`xp_reward`),
    `score_reward` = VALUES(`score_reward`),
    `prerequisite_quest_id` = VALUES(`prerequisite_quest_id`),
    `type` = VALUES(`type`),
    `requires_quiz` = VALUES(`requires_quiz`);

-- Seed Items (Collectibles)
INSERT INTO `items` (`id`, `name`, `description`, `type`, `icon`) VALUES
(1, 'Badge Sekolah EDUQUEST', 'Lencana resmi siswa SMK RPL EDUQUEST.', 'badge', 'badge.png'),
(2, 'Flashdisk Pak Andi', 'Flashdisk berisi modul dasar pemrograman PPLG.', 'quest', 'flashdrive.png'),
(3, 'Buku Catatan RPL', 'Buku catatan koding dan algoritma milik siswa.', 'collectible', 'notebook.png'),
(4, 'Modul PPLG Lengkap', 'Buku panduan HTML, CSS, JavaScript, dan PHP.', 'collectible', 'book.png'),
(5, 'Kalkulator Sains', 'Kalkulator canggih untuk membantu kuis matematika.', 'tool', 'calculator.png'),
(6, 'Stiker Legend EDUQUEST', 'Stiker langka dari alumni rahasia EDUQUEST.', 'collectible', 'sticker.png'),
(7, 'Diari Alumni Rahasia', 'Buku catatan berharga yang menceritakan sejarah sekolah.', 'secret', 'diary.png')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `type` = VALUES(`type`);

-- Seed Achievements
INSERT INTO `achievements` (`id`, `code`, `title`, `description`, `icon`, `condition_type`, `condition_value`, `xp_reward`, `score_reward`) VALUES
(1, 'FIRST_STEP', 'Langkah Pertama', 'Selesaikan Quest #1 Kenali Sekolahmu.', '⭐', 'quest_completed', 1, 20, 10),
(2, 'QUIZ_CHAMP', 'Juara Kuis', 'Lulus kuis pembelajaran sekolah pertama kali.', '✏️', 'quiz_passed', 1, 30, 15),
(3, 'SCHOOL_MASTER', 'Keliling Sekolah', 'Jelajahi seluruh area utama di lingkungan EDUQUEST.', '🗺️', 'area_explored', 9, 50, 25),
(4, 'QUIZ_MASTER', 'Pelajar Serba Bisa', 'Lulus kuis dari 3 mata pelajaran berbeda.', '🎓', 'subjects_passed', 3, 75, 35),
(5, 'SECRET_FINDER', 'Detektif Sekolah', 'Berhasil menemukan Taman Rahasia Alumni di sudut sekolah.', '🕵️', 'secret_found', 1, 100, 50),
(6, 'COLLECTOR', 'Kolektor Sejati', 'Kumpulkan minimal 5 item collectible di dalam inventaris.', '🎒', 'items_collected', 5, 80, 40)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `description` = VALUES(`description`), `xp_reward` = VALUES(`xp_reward`), `score_reward` = VALUES(`score_reward`);
