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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$userId = $_SESSION['user_id'];
$rawInput = json_decode(file_get_contents('php://input'), true);
$questId = intval($rawInput['quest_id'] ?? $_POST['quest_id'] ?? 0);

if ($questId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID Quest tidak valid!']);
    exit;
}

try {
    $pdo = getDBConnection();

    // 1. Check if user has accepted the quest
    $stmtUQ = $pdo->prepare("SELECT status FROM user_quests WHERE user_id = :user_id AND quest_id = :quest_id LIMIT 1");
    $stmtUQ->execute([':user_id' => $userId, ':quest_id' => $questId]);
    $userQuest = $stmtUQ->fetch();

    if (!$userQuest) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Anda harus menerima quest terlebih dahulu sebelum memulai quiz!']);
        exit;
    }

    // 2. Fetch Question IDs belonging to this quest
    $stmtQ = $pdo->prepare("
        SELECT q.id, q.question_text
        FROM quest_questions qq
        JOIN questions q ON qq.question_id = q.id
        WHERE qq.quest_id = :quest_id
        ORDER BY qq.question_order ASC
    ");
    $stmtQ->execute([':quest_id' => $questId]);
    $questions = $stmtQ->fetchAll();

    if (empty($questions)) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Tidak ada kuis yang tersedia untuk quest ini.']);
        exit;
    }

    $totalQuestions = count($questions);
    $questionIds = array_column($questions, 'id');

    // 3. Check for existing active attempt (status = 'in_progress')
    $stmtAttempt = $pdo->prepare("
        SELECT id, total_questions, correct_answers, score, status
        FROM quiz_attempts
        WHERE user_id = :user_id AND quest_id = :quest_id AND status = 'in_progress'
        ORDER BY id DESC LIMIT 1
    ");
    $stmtAttempt->execute([':user_id' => $userId, ':quest_id' => $questId]);
    $activeAttempt = $stmtAttempt->fetch();

    if ($activeAttempt) {
        $attemptId = intval($activeAttempt['id']);
    } else {
        // Create new attempt
        $stmtNew = $pdo->prepare("
            INSERT INTO quiz_attempts (user_id, quest_id, total_questions, status)
            VALUES (:user_id, :quest_id, :total_questions, 'in_progress')
        ");
        $stmtNew->execute([
            ':user_id'         => $userId,
            ':quest_id'        => $questId,
            ':total_questions' => $totalQuestions
        ]);
        $attemptId = intval($pdo->lastInsertId());
    }

    echo json_encode([
        'success'         => true,
        'attempt_id'      => $attemptId,
        'quest_id'        => $questId,
        'total_questions' => $totalQuestions,
        'question_ids'    => $questionIds,
        'status'          => 'in_progress'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
