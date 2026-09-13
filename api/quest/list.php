<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../config/database.php';

// Authentication Check
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    $pdo = getDBConnection();

    // 1. Get User Profile
    $stmtUser = $pdo->prepare("SELECT id, username, xp, level, score FROM users WHERE id = :id LIMIT 1");
    $stmtUser->execute([':id' => $userId]);
    $user = $stmtUser->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Session user not found']);
        exit;
    }

    // 2. Get All Quests
    $stmtQuests = $pdo->query("SELECT id, title, description, xp_reward, score_reward, requires_quiz FROM quests ORDER BY id ASC");
    $quests = $stmtQuests->fetchAll();

    // 3. Get User Quest Statuses
    $stmtUserQuests = $pdo->prepare("SELECT quest_id, status, updated_at FROM user_quests WHERE user_id = :user_id");
    $stmtUserQuests->execute([':user_id' => $userId]);
    $userQuestsRaw = $stmtUserQuests->fetchAll();

    $userQuestsMap = [];
    foreach ($userQuestsRaw as $uq) {
        $userQuestsMap[$uq['quest_id']] = $uq['status'];
    }

    echo json_encode([
        'success'    => true,
        'user'       => $user,
        'quests'     => $quests,
        'userQuests' => $userQuestsMap
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
