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
$questId = intval($_GET['quest_id'] ?? $_POST['quest_id'] ?? 0);

if ($questId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID Quest tidak valid!']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Check if user has passed a quiz attempt for this quest
    $stmtPassed = $pdo->prepare("
        SELECT id, score, status, completed_at
        FROM quiz_attempts
        WHERE user_id = :user_id AND quest_id = :quest_id AND status = 'passed'
        ORDER BY id DESC LIMIT 1
    ");
    $stmtPassed->execute([':user_id' => $userId, ':quest_id' => $questId]);
    $passedAttempt = $stmtPassed->fetch();

    // Check for latest active attempt
    $stmtLatest = $pdo->prepare("
        SELECT id, score, status, started_at
        FROM quiz_attempts
        WHERE user_id = :user_id AND quest_id = :quest_id
        ORDER BY id DESC LIMIT 1
    ");
    $stmtLatest->execute([':user_id' => $userId, ':quest_id' => $questId]);
    $latestAttempt = $stmtLatest->fetch();

    echo json_encode([
        'success'        => true,
        'has_passed'     => !empty($passedAttempt),
        'passed_attempt' => $passedAttempt,
        'latest_attempt' => $latestAttempt
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
