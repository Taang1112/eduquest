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
$attemptId = intval($_GET['attempt_id'] ?? $_POST['attempt_id'] ?? 0);
$questionId = intval($_GET['question_id'] ?? $_POST['question_id'] ?? 0);

if ($attemptId <= 0 || $questionId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Parameter attempt_id dan question_id wajib diisi!']);
    exit;
}

try {
    $pdo = getDBConnection();

    // 1. Verify Attempt Ownership & Active Status
    $stmtAtt = $pdo->prepare("SELECT id, quest_id, total_questions, status FROM quiz_attempts WHERE id = :id AND user_id = :user_id LIMIT 1");
    $stmtAtt->execute([':id' => $attemptId, ':user_id' => $userId]);
    $attempt = $stmtAtt->fetch();

    if (!$attempt || $attempt['status'] !== 'in_progress') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Sesi quiz tidak aktif atau telah selesai.']);
        exit;
    }

    // 2. Fetch Question Details
    $stmtQ = $pdo->prepare("SELECT id, question_text, category, difficulty FROM questions WHERE id = :id LIMIT 1");
    $stmtQ->execute([':id' => $questionId]);
    $question = $stmtQ->fetch();

    if (!$question) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Pertanyaan tidak ditemukan!']);
        exit;
    }

    // 3. Fetch Choices (Security: DO NOT include is_correct field!)
    $stmtAns = $pdo->prepare("SELECT id, answer_text FROM answers WHERE question_id = :question_id ORDER BY id ASC");
    $stmtAns->execute([':question_id' => $questionId]);
    $choices = $stmtAns->fetchAll();

    // 4. Check if question has already been answered in this attempt
    $stmtCheck = $pdo->prepare("SELECT answer_id, is_correct FROM quiz_attempt_answers WHERE attempt_id = :attempt_id AND question_id = :question_id LIMIT 1");
    $stmtCheck->execute([':attempt_id' => $attemptId, ':question_id' => $questionId]);
    $answeredRecord = $stmtCheck->fetch();

    echo json_encode([
        'success'      => true,
        'question'     => [
            'id'            => intval($question['id']),
            'question_text' => $question['question_text'],
            'category'      => $question['category'],
            'choices'       => $choices
        ],
        'is_answered'  => !empty($answeredRecord),
        'user_answer'  => $answeredRecord ? intval($answeredRecord['answer_id']) : null
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
