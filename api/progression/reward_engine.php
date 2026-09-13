<?php
/**
 * EDUQUEST - Progression, Achievement & Item Reward Engine (Phase 5)
 * Server-Authoritative Progression Calculation Module
 */

function calculateLevelAndRange(int $xp): array {
    if ($xp < 100) {
        $level = 1;
        $minXp = 0;
        $maxXp = 100;
        $title = 'Murid Baru';
    } elseif ($xp < 250) {
        $level = 2;
        $minXp = 100;
        $maxXp = 250;
        $title = 'Pelajar Aktif';
    } elseif ($xp < 500) {
        $level = 3;
        $minXp = 250;
        $maxXp = 500;
        $title = 'Penjelajah Sekolah';
    } elseif ($xp < 1000) {
        $level = 4;
        $minXp = 500;
        $maxXp = 1000;
        $title = 'Pelajar Berprestasi';
    } else {
        $extraLevels = floor(($xp - 1000) / 500);
        $level = 5 + intval($extraLevels);
        $minXp = 1000 + ($extraLevels * 500);
        $maxXp = $minXp + 500;
        $title = ($level == 5) ? 'Ahli EDUQUEST' : 'Master EDUQUEST';
    }

    $currentInLevel = $xp - $minXp;
    $requiredInLevel = $maxXp - $minXp;
    $percent = min(100, max(0, round(($currentInLevel / $requiredInLevel) * 100)));

    return [
        'level'             => $level,
        'title'             => $title,
        'min_xp'            => $minXp,
        'max_xp'            => $maxXp,
        'current_in_level'  => $currentInLevel,
        'required_in_level' => $requiredInLevel,
        'percent'           => $percent
    ];
}

/**
 * Process and update user progression, check achievements, and grant collectible items atomically.
 * MUST be called inside a PDO transaction.
 */
function processUserProgression(PDO $pdo, int $userId): array {
    // 1. Lock and fetch current user stats
    $stmtUser = $pdo->prepare("SELECT id, username, xp, score, level FROM users WHERE id = :id FOR UPDATE");
    $stmtUser->execute([':id' => $userId]);
    $user = $stmtUser->fetch();

    if (!$user) {
        throw new Exception("User ID {$userId} not found.");
    }

    $currentXp = intval($user['xp']);
    $currentScore = intval($user['score']);
    $oldLevel = intval($user['level']);

    // 2. Fetch all registered achievements
    $stmtAch = $pdo->query("SELECT id, code, title, description, icon, condition_type, condition_value, xp_reward, score_reward FROM achievements");
    $allAchievements = $stmtAch->fetchAll(PDO::FETCH_ASSOC);

    // 3. Fetch already unlocked achievements for user
    $stmtUserAch = $pdo->prepare("SELECT achievement_id FROM user_achievements WHERE user_id = :u");
    $stmtUserAch->execute([':u' => $userId]);
    $unlockedMap = array_flip($stmtUserAch->fetchAll(PDO::FETCH_COLUMN));

    // 4. Fetch Completed User Quests
    $stmtCompQuests = $pdo->prepare("SELECT quest_id FROM user_quests WHERE user_id = :u AND status = 'completed'");
    $stmtCompQuests->execute([':u' => $userId]);
    $completedQuestIds = array_flip($stmtCompQuests->fetchAll(PDO::FETCH_COLUMN));

    // 5. Fetch Quiz Stats
    $stmtQuizPass = $pdo->prepare("SELECT quest_id, MAX(score) as max_score FROM quiz_attempts WHERE user_id = :u AND status = 'passed' GROUP BY quest_id");
    $stmtQuizPass->execute([':u' => $userId]);
    $passedQuizzes = $stmtQuizPass->fetchAll(PDO::FETCH_KEY_PAIR); // [quest_id => max_score]

    $stmtPerfectQuiz = $pdo->prepare("SELECT COUNT(*) FROM quiz_attempts WHERE user_id = :u AND score = 100");
    $stmtPerfectQuiz->execute([':u' => $userId]);
    $hasPerfectQuiz = (intval($stmtPerfectQuiz->fetchColumn()) > 0);

    // Initial Level calculation
    $levelData = calculateLevelAndRange($currentXp);
    $calculatedLevel = $levelData['level'];

    $newUnlocked = [];
    $xpGained = 0;
    $scoreGained = 0;

    // 6. Evaluate Achievements
    foreach ($allAchievements as $ach) {
        $achId = intval($ach['id']);
        if (isset($unlockedMap[$achId])) {
            continue; // Already unlocked
        }

        $isMet = false;
        $condType = $ach['condition_type'];
        $condVal = intval($ach['condition_value']);

        if ($condType === 'quest_complete') {
            if (isset($completedQuestIds[$condVal])) {
                $isMet = true;
            }
        } elseif ($condType === 'quiz_score') {
            if (isset($passedQuizzes[$condVal])) {
                $isMet = true;
            }
        } elseif ($condType === 'quiz_perfect') {
            if ($hasPerfectQuiz) {
                $isMet = true;
            }
        } elseif ($condType === 'area_explored') {
            // First quest completed represents school exploration
            if (isset($completedQuestIds[1])) {
                $isMet = true;
            }
        } elseif ($condType === 'level_reached') {
            if ($calculatedLevel >= $condVal) {
                $isMet = true;
            }
        }

        if ($isMet) {
            // Insert achievement lock securely
            $stmtInsAch = $pdo->prepare("INSERT IGNORE INTO user_achievements (user_id, achievement_id) VALUES (:u, :a)");
            $stmtInsAch->execute([':u' => $userId, ':a' => $achId]);

            if ($stmtInsAch->rowCount() > 0) {
                $xpGained += intval($ach['xp_reward']);
                $scoreGained += intval($ach['score_reward']);
                $newUnlocked[] = $ach;
            }
        }
    }

    // Update user totals with achievement rewards
    $finalXp = $currentXp + $xpGained;
    $finalScore = $currentScore + $scoreGained;
    $finalLevelData = calculateLevelAndRange($finalXp);
    $finalLevel = $finalLevelData['level'];

    // 7. Check Item Rewards for Completed Quests
    $newItems = [];
    $itemMap = [
        1 => 1, // Quest 1 -> Item 1 (Kartu Pelajar)
        2 => 2, // Quest 2 -> Item 2 (Flashdisk EDUQUEST)
        3 => 3  // Quest 3 -> Item 3 (Buku Pengetahuan)
    ];

    foreach ($itemMap as $qId => $itemId) {
        if (isset($completedQuestIds[$qId])) {
            $stmtCheckItem = $pdo->prepare("SELECT id FROM user_items WHERE user_id = :u AND item_id = :i LIMIT 1");
            $stmtCheckItem->execute([':u' => $userId, ':i' => $itemId]);
            if (!$stmtCheckItem->fetch()) {
                $stmtGrantItem = $pdo->prepare("INSERT INTO user_items (user_id, item_id, quantity) VALUES (:u, :i, 1)");
                $stmtGrantItem->execute([':u' => $userId, ':i' => $itemId]);

                $stmtItemInfo = $pdo->prepare("SELECT id, name, description, icon FROM items WHERE id = :i LIMIT 1");
                $stmtItemInfo->execute([':i' => $itemId]);
                $newItems[] = $stmtItemInfo->fetch(PDO::FETCH_ASSOC);
            }
        }
    }

    // 8. Update User Record in Database
    $stmtUpdateUser = $pdo->prepare("UPDATE users SET xp = :xp, score = :score, level = :level WHERE id = :id");
    $stmtUpdateUser->execute([
        ':xp'    => $finalXp,
        ':score' => $finalScore,
        ':level' => $finalLevel,
        ':id'    => $userId
    ]);

    return [
        'username'             => $user['username'],
        'xp'                   => $finalXp,
        'score'                => $finalScore,
        'level'                => $finalLevel,
        'title'                => $finalLevelData['title'],
        'min_xp'               => $finalLevelData['min_xp'],
        'max_xp'               => $finalLevelData['max_xp'],
        'current_in_level'     => $finalLevelData['current_in_level'],
        'required_in_level'    => $finalLevelData['required_in_level'],
        'percent'              => $finalLevelData['percent'],
        'leveled_up'           => ($finalLevel > $oldLevel),
        'old_level'            => $oldLevel,
        'unlocked_achievements'=> $newUnlocked,
        'new_items'            => $newItems
    ];
}
