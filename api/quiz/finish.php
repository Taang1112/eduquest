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
$attemptId = intval($rawInput['attempt_id'] ?? $_POST['attempt_id'] ?? 0);

if ($attemptId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Parameter attempt_id wajib diisi!']);
    exit;
}

$pdo = getDBConnection();

try {
    // 1. Verify Attempt Ownership & Active Status
    $stmtAtt = $pdo->prepare("SELECT id, quest_id, total_questions, status FROM quiz_attempts WHERE id = :id AND user_id = :user_id LIMIT 1");
    $stmtAtt->execute([':id' => $attemptId, ':user_id' => $userId]);
    $attempt = $stmtAtt->fetch();

    if (!$attempt) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Sesi quiz tidak ditemukan.']);
        exit;
    }

    // 2. Count correct answers submitted
    $stmtCount = $pdo->prepare("SELECT COUNT(*) AS total_correct FROM quiz_attempt_answers WHERE attempt_id = :attempt_id AND is_correct = 1");
    $stmtCount->execute([':attempt_id' => $attemptId]);
    $correctCount = intval($stmtCount->fetchColumn());

    $totalQuestions = max(1, intval($attempt['total_questions']));
    $score = intval(floor(($correctCount / $totalQuestions) * 100));

    // Passing threshold >= 60%
    $status = ($score >= 60) ? 'passed' : 'failed';

    require_once __DIR__ . '/../progression/reward_engine.php';

    $pdo->beginTransaction();

    // 3. Update Quiz Attempt status & score
    $stmtUpd = $pdo->prepare("
        UPDATE quiz_attempts
        SET correct_answers = :correct,
            score = :score,
            status = :status,
            completed_at = NOW()
        WHERE id = :id AND user_id = :user_id
    ");
    $stmtUpd->execute([
        ':correct' => $correctCount,
        ':score'   => $score,
        ':status'  => $status,
        ':id'      => $attemptId,
        ':user_id' => $userId
    ]);

    // 4. Process Atomic Progression Engine for Quiz achievements (e.g. COMPUTER_EXPERT, PERFECT_SCORE)
    $progression = processUserProgression($pdo, $userId);

    $pdo->commit();

    echo json_encode([
        'success'               => true,
        'attempt_id'            => $attemptId,
        'quest_id'              => intval($attempt['quest_id']),
        'total_questions'       => $totalQuestions,
        'correct_answers'       => $correctCount,
        'score'                 => $score,
        'status'                => $status,
        'passed'                => ($status === 'passed'),
        'user'                  => $progression,
        'unlocked_achievements' => $progression['unlocked_achievements'],
        'new_items'             => $progression['new_items'],
        'message'               => ($status === 'passed')
                                   ? 'Selamat! Anda LULUS Quiz (Nilai: ' . $score . '/100). Quest dapat dilanjutkan!'
                                   : 'Quiz belum berhasil (Nilai: ' . $score . '/100). Kamu perlu nilai minimal 60 untuk lulus.'
    ]);
} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
