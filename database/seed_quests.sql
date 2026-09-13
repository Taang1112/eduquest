-- ==================================================
-- EDUQUEST - SEED QUESTS & UNIQUE CONSTRAINTS (PHASE 3)
-- ==================================================

USE `eduquest`;

-- 1. Ensure unique constraint on (user_id, quest_id) in user_quests
-- Drops constraint if exists to avoid error on re-run, then adds UNIQUE index
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_name = 'user_quests' AND table_schema = DATABASE() AND index_name = 'unique_user_quest');
SET @sqlstmt := IF(@exist > 0, 'ALTER TABLE user_quests DROP INDEX unique_user_quest', 'SELECT 1');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE `user_quests` ADD UNIQUE INDEX `unique_user_quest` (`user_id`, `quest_id`);

-- 2. Seed Default Quests
INSERT INTO `quests` (`id`, `title`, `description`, `xp_reward`, `score_reward`, `requires_quiz`) VALUES
(1, 'Kenali Sekolahmu', 'Jelajahi beberapa area sekolah (Halaman, Koridor, Ruang Kelas, Lab Komputer, Perpustakaan, Kantin) dan kenali lingkungan EDUQUEST.', 50, 10, 0),
(2, 'Temukan Lab Komputer', 'Pergilah ke Lab Komputer dan temui Pak Andi.', 75, 15, 1),
(3, 'Belajar di Perpustakaan', 'Pergilah ke Perpustakaan dan temui Rika.', 100, 20, 1)
ON DUPLICATE KEY UPDATE 
    `title` = VALUES(`title`),
    `description` = VALUES(`description`),
    `xp_reward` = VALUES(`xp_reward`),
    `score_reward` = VALUES(`score_reward`),
    `requires_quiz` = VALUES(`requires_quiz`);
