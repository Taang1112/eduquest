-- ==================================================
-- EDUQUEST - CREATE QUIZ TABLES (PHASE 4)
-- Database Name: eduquest
-- ==================================================

USE `eduquest`;

-- 1. Table: quest_questions (Maps quests to educational questions)
CREATE TABLE IF NOT EXISTS `quest_questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `quest_id` INT NOT NULL,
    `question_id` INT NOT NULL,
    `question_order` INT NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_quest_questions_quest` FOREIGN KEY (`quest_id`) REFERENCES `quests` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_quest_questions_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
    UNIQUE INDEX `unique_quest_question` (`quest_id`, `question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: quiz_attempts (Tracks user quiz attempts)
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `quest_id` INT NOT NULL,
    `total_questions` INT NOT NULL DEFAULT 5,
    `correct_answers` INT NOT NULL DEFAULT 0,
    `score` INT NOT NULL DEFAULT 0,
    `status` ENUM('in_progress', 'passed', 'failed') DEFAULT 'in_progress',
    `started_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `completed_at` TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT `fk_quiz_attempts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_quiz_attempts_quest` FOREIGN KEY (`quest_id`) REFERENCES `quests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: quiz_attempt_answers (Tracks per-question answers submitted)
CREATE TABLE IF NOT EXISTS `quiz_attempt_answers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `attempt_id` INT NOT NULL,
    `question_id` INT NOT NULL,
    `answer_id` INT NOT NULL,
    `is_correct` TINYINT(1) NOT NULL DEFAULT 0,
    `answered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_quiz_attempt_answers_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_quiz_attempt_answers_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_quiz_attempt_answers_answer` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`) ON DELETE CASCADE,
    UNIQUE INDEX `unique_attempt_question` (`attempt_id`, `question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
