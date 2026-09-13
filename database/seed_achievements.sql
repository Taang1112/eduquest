-- ==================================================
-- EDUQUEST - PHASE 5 SEED DATA (ACHIEVEMENTS, ITEMS & QUEST PREREQUISITES)
-- ==================================================
USE `eduquest`;

-- 1. Set Quest Prerequisites (Quest 1 -> Quest 2 -> Quest 3)
UPDATE `quests` SET `prerequisite_quest_id` = NULL WHERE `id` = 1;
UPDATE `quests` SET `prerequisite_quest_id` = 1 WHERE `id` = 2;
UPDATE `quests` SET `prerequisite_quest_id` = 2 WHERE `id` = 3;

-- 2. Seed Collectible Items into items table
INSERT INTO `items` (`id`, `name`, `description`, `type`, `icon`) VALUES
(1, 'Kartu Pelajar', 'Bukti identitas resmi murid EDUQUEST. Diperoleh setelah mengenali lingkungan sekolah.', 'collectible', '🪪'),
(2, 'Flashdisk EDUQUEST', 'Media penyimpanan modul dan materi lab komputer sekolah. Diperoleh dari Pak Andi.', 'collectible', '💾'),
(3, 'Buku Pengetahuan', 'Buku referensi lengkap dari perpustakaan sekolah. Diperoleh dari Rika.', 'collectible', '📘')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `icon` = VALUES(`icon`);

-- 3. Seed Achievements into achievements table
INSERT INTO `achievements` (`id`, `code`, `title`, `description`, `icon`, `condition_type`, `condition_value`, `xp_reward`, `score_reward`) VALUES
(1, 'FIRST_QUEST', 'Murid Baru', 'Menyelesaikan quest pertama di EDUQUEST.', '🎓', 'quest_complete', 1, 25, 5),
(2, 'COMPUTER_EXPERT', 'Teknisi Dadakan', 'Menuntaskan dan lulus quiz Lab Komputer.', '💻', 'quiz_score', 2, 50, 10),
(3, 'BOOKWORM', 'Kutu Buku', 'Menyelesaikan quest perpustakaan sekolah.', '📚', 'quest_complete', 3, 75, 15),
(4, 'PERFECT_SCORE', 'Otak Kelas', 'Mendapatkan nilai sempurna 100 pada kuis apapun.', '🧠', 'quiz_perfect', 100, 100, 20),
(5, 'SCHOOL_EXPLORER', 'Penjelajah Sekolah', 'Menjelajahi seluruh area utama di lingkungan sekolah.', '📍', 'area_explored', 4, 100, 20),
(6, 'LEVEL_5', 'Ahli EDUQUEST', 'Berhasil mencapai Level 5.', '🌟', 'level_reached', 5, 100, 25)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `description` = VALUES(`description`), `icon` = VALUES(`icon`), `xp_reward` = VALUES(`xp_reward`), `score_reward` = VALUES(`score_reward`);
