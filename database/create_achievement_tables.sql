-- ==================================================
-- EDUQUEST - PHASE 5 MIGRATIONS (ACHIEVEMENTS & QUEST PREREQUISITES)
-- ==================================================
USE `eduquest`;

-- 1. Add prerequisite_quest_id to quests table if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = "quests";
SET @columnname = "prerequisite_quest_id";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1;",
  "ALTER TABLE `quests` ADD COLUMN `prerequisite_quest_id` INT DEFAULT NULL AFTER `score_reward`, ADD CONSTRAINT `fk_quests_prerequisite` FOREIGN KEY (`prerequisite_quest_id`) REFERENCES `quests` (`id`) ON DELETE SET NULL;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 2. Create Table: achievements
CREATE TABLE IF NOT EXISTS `achievements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `icon` VARCHAR(50) DEFAULT '🏆',
    `condition_type` VARCHAR(50) NOT NULL,
    `condition_value` INT NOT NULL DEFAULT 1,
    `xp_reward` INT NOT NULL DEFAULT 0,
    `score_reward` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create Table: user_achievements
CREATE TABLE IF NOT EXISTS `user_achievements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `achievement_id` INT NOT NULL,
    `unlocked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `unique_user_achievement` UNIQUE (`user_id`, `achievement_id`),
    CONSTRAINT `fk_user_achievements_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_achievements_achievement` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
