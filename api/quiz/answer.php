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
$questionId = intval($rawInput['question_id'] ?? $_POST['question_id'] ?? 0);
$answerId = intval($rawInput['answer_id'] ?? $_POST['answer_id'] ?? 0);

if ($attemptId <= 0 || $questionId <= 0 || $answerId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Parameter attempt_id, question_id, dan answer_id wajib diisi!']);
    exit;
}

$pdo = getDBConnection();

try {
    // 1. Verify Attempt Ownership & Active Status
    $stmtAtt = $pdo->prepare("SELECT id, quest_id, status FROM quiz_attempts WHERE id = :id AND user_id = :user_id LIMIT 1");
    $stmtAtt->execute([':id' => $attemptId, ':user_id' => $userId]);
    $attempt = $stmtAtt->fetch();

    if (!$attempt || $attempt['status'] !== 'in_progress') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Sesi quiz tidak aktif atau telah selesai.']);
        exit;
    }

    // 2. Prevent duplicate submission for same question in attempt
    $stmtDup = $pdo->prepare("SELECT id FROM quiz_attempt_answers WHERE attempt_id = :attempt_id AND question_id = :question_id LIMIT 1");
    $stmtDup->execute([':attempt_id' => $attemptId, ':question_id' => $questionId]);
    if ($stmtDup->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Pertanyaan ini sudah dijawab sebelumnya dalam percobaan ini!']);
        exit;
    }

    // 3. Server-side correctness evaluation against database
    $stmtCheck = $pdo->prepare("SELECT is_correct FROM answers WHERE id = :answer_id AND question_id = :question_id LIMIT 1");
    $stmtCheck->execute([':answer_id' => $answerId, ':question_id' => $questionId]);
    $answerRecord = $stmtCheck->fetch();

    if (!$answerRecord) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Pilihan jawaban tidak valid untuk pertanyaan ini!']);
        exit;
    }

    $isCorrect = (intval($answerRecord['is_correct']) === 1) ? 1 : 0;

    // 4. Record answer in quiz_attempt_answers
    $stmtIns = $pdo->prepare("
        INSERT INTO quiz_attempt_answers (attempt_id, question_id, answer_id, is_correct)
        VALUES (:attempt_id, :question_id, :answer_id, :is_correct)
    ");
    $stmtIns->execute([
        ':attempt_id'  => $attemptId,
        ':question_id' => $questionId,
        ':answer_id'   => $answerId,
        ':is_correct'  => $isCorrect
    ]);

    echo json_encode([
        'success'    => true,
        'is_correct' => ($isCorrect === 1),
        'message'    => ($isCorrect === 1) ? '✓ Jawaban Anda benar!' : '✕ Jawaban kurang tepat.'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
