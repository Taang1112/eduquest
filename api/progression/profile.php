<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/reward_engine.php';

// Authentication Check
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    $pdo = getDBConnection();
    $pdo->beginTransaction();

    // Process progression & sync achievements/items
    $profileData = processUserProgression($pdo, $userId);

    // Fetch Completed Quests Count
    $stmtCompQuests = $pdo->prepare("SELECT COUNT(*) FROM user_quests WHERE user_id = :u AND status = 'completed'");
    $stmtCompQuests->execute([':u' => $userId]);
    $completedQuestsCount = intval($stmtCompQuests->fetchColumn());

    // Fetch Total Quests Count
    $stmtTotalQuests = $pdo->query("SELECT COUNT(*) FROM quests");
    $totalQuestsCount = intval($stmtTotalQuests->fetchColumn());

    // Fetch Unlocked Achievements Count
    $stmtUnlockedAch = $pdo->prepare("SELECT COUNT(*) FROM user_achievements WHERE user_id = :u");
    $stmtUnlockedAch->execute([':u' => $userId]);
    $unlockedAchCount = intval($stmtUnlockedAch->fetchColumn());

    // Fetch Total Achievements Count
    $stmtTotalAch = $pdo->query("SELECT COUNT(*) FROM achievements");
    $totalAchCount = intval($stmtTotalAch->fetchColumn());

    // Fetch Inventory Items
    $stmtItems = $pdo->prepare("
        SELECT i.id, i.name, i.description, i.icon, ui.quantity, ui.created_at
        FROM user_items ui
        JOIN items i ON ui.item_id = i.id
        WHERE ui.user_id = :u
        ORDER BY ui.created_at ASC
    ");
    $stmtItems->execute([':u' => $userId]);
    $itemsList = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

    // Fetch Quests Chain Status
    $stmtQuests = $pdo->query("
        SELECT id, title, description, xp_reward, score_reward, prerequisite_quest_id
        FROM quests
        ORDER BY id ASC
    ");
    $allQuests = $stmtQuests->fetchAll(PDO::FETCH_ASSOC);

    // User Quest Records
    $stmtUQ = $pdo->prepare("SELECT quest_id, status FROM user_quests WHERE user_id = :u");
    $stmtUQ->execute([':u' => $userId]);
    $userQuests = $stmtUQ->fetchAll(PDO::FETCH_KEY_PAIR); // [quest_id => status]

    $questChain = [];
    foreach ($allQuests as $q) {
        $qId = intval($q['id']);
        $prereqId = $q['prerequisite_quest_id'] ? intval($q['prerequisite_quest_id']) : null;

        $userStatus = $userQuests[$qId] ?? 'not_started';
        $isLocked = false;
        $prereqTitle = '';

        if ($prereqId !== null) {
            $prereqStatus = $userQuests[$prereqId] ?? 'not_started';
            if ($prereqStatus !== 'completed') {
                $isLocked = true;
                // Fetch Prerequisite Title
                foreach ($allQuests as $pq) {
                    if (intval($pq['id']) === $prereqId) {
                        $prereqTitle = $pq['title'];
                        break;
                    }
                }
            }
        }

        $questChain[] = [
            'id'                     => $qId,
            'title'                  => $q['title'],
            'description'            => $q['description'],
            'xp_reward'              => intval($q['xp_reward']),
            'score_reward'           => intval($q['score_reward']),
            'prerequisite_quest_id'  => $prereqId,
            'prerequisite_title'     => $prereqTitle,
            'status'                 => $userStatus,
            'is_locked'              => $isLocked
        ];
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'profile' => [
            'username'               => $profileData['username'],
            'title'                  => $profileData['title'],
            'level'                  => $profileData['level'],
            'xp'                     => $profileData['xp'],
            'score'                  => $profileData['score'],
            'min_xp'                 => $profileData['min_xp'],
            'max_xp'                 => $profileData['max_xp'],
            'current_in_level'       => $profileData['current_in_level'],
            'required_in_level'      => $profileData['required_in_level'],
            'percent'                => $profileData['percent'],
            'completed_quests_count' => $completedQuestsCount,
            'total_quests_count'     => $totalQuestsCount,
            'unlocked_achievements_count' => $unlockedAchCount,
            'total_achievements_count'     => $totalAchCount,
            'items'                  => $itemsList,
            'quests'                 => $questChain
        ]
    ]);
} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Profile error: ' . $e->getMessage()]);
}
