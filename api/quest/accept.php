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

// Get Input Data (supports JSON body or form-data)
$rawInput = json_decode(file_get_contents('php://input'), true);
$questId = intval($rawInput['quest_id'] ?? $_POST['quest_id'] ?? 0);

if ($questId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID Quest tidak valid!']);
    exit;
}

try {
    $pdo = getDBConnection();

    // 1. Verify Quest Exists & Check Prerequisite
    $stmtQuest = $pdo->prepare("SELECT id, title, prerequisite_quest_id FROM quests WHERE id = :id LIMIT 1");
    $stmtQuest->execute([':id' => $questId]);
    $quest = $stmtQuest->fetch();

    if (!$quest) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Quest tidak ditemukan!']);
        exit;
    }

    if (!empty($quest['prerequisite_quest_id'])) {
        $prereqId = intval($quest['prerequisite_quest_id']);
        $stmtPrereq = $pdo->prepare("SELECT status FROM user_quests WHERE user_id = :user_id AND quest_id = :prereq_id LIMIT 1");
        $stmtPrereq->execute([':user_id' => $userId, ':prereq_id' => $prereqId]);
        $prereq = $stmtPrereq->fetch();

        if (!$prereq || $prereq['status'] !== 'completed') {
            $stmtPTitle = $pdo->prepare("SELECT title FROM quests WHERE id = :id LIMIT 1");
            $stmtPTitle->execute([':id' => $prereqId]);
            $pTitle = $stmtPTitle->fetchColumn() ?: "Quest #{$prereqId}";

            echo json_encode([
                'success' => false,
                'message' => "Quest ini terkunci (🔒)! Selesaikan quest '{$pTitle}' terlebih dahulu."
            ]);
            exit;
        }
    }

    // 2. Check Existing User Quest Status
    $stmtCheck = $pdo->prepare("SELECT id, status FROM user_quests WHERE user_id = :user_id AND quest_id = :quest_id LIMIT 1");
    $stmtCheck->execute([':user_id' => $userId, ':quest_id' => $questId]);
    $existing = $stmtCheck->fetch();

    if ($existing) {
        if ($existing['status'] === 'completed') {
            echo json_encode(['success' => false, 'message' => 'Quest ini sudah Anda selesaikan!']);
            exit;
        } elseif ($existing['status'] === 'in_progress') {
            echo json_encode(['success' => false, 'message' => 'Quest ini sedang aktif dalam daftar quest Anda!']);
            exit;
        }
    }

    // 3. Insert or Update Status to 'in_progress'
    $stmtInsert = $pdo->prepare("
        INSERT INTO user_quests (user_id, quest_id, status)
        VALUES (:user_id, :quest_id, 'in_progress')
        ON DUPLICATE KEY UPDATE status = 'in_progress', updated_at = NOW()
    ");
    $stmtInsert->execute([':user_id' => $userId, ':quest_id' => $questId]);

    echo json_encode([
        'success'  => true,
        'message'  => "Quest '{$quest['title']}' berhasil diterima!",
        'quest_id' => $questId,
        'status'   => 'in_progress'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
