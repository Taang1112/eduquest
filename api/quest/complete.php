<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../config/database.php';

// Calculate Level Thresholds
function calculatePlayerLevel(int $xp): int {
    if ($xp >= 1000) return 5;
    if ($xp >= 500)  return 4;
    if ($xp >= 250)  return 3;
    if ($xp >= 100)  return 2;
    return 1;
}

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

// Get Input Data
$rawInput = json_decode(file_get_contents('php://input'), true);
$questId = intval($rawInput['quest_id'] ?? $_POST['quest_id'] ?? 0);

if ($questId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID Quest tidak valid!']);
    exit;
}

$pdo = getDBConnection();

try {
    // BEGIN DATABASE TRANSACTION to prevent race conditions & double rewards
    $pdo->beginTransaction();

    // 1. Lock and Check User Quest Status
    $stmtCheck = $pdo->prepare("SELECT id, status FROM user_quests WHERE user_id = :user_id AND quest_id = :quest_id FOR UPDATE");
    $stmtCheck->execute([':user_id' => $userId, ':quest_id' => $questId]);
    $userQuest = $stmtCheck->fetch();

    if (!$userQuest || $userQuest['status'] !== 'in_progress') {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Quest tidak sedang aktif atau sudah diselesaikan sebelumnya!']);
        exit;
    }

    // 2. Lock and Fetch Quest Data
    $stmtQuest = $pdo->prepare("SELECT id, title, xp_reward, score_reward, requires_quiz FROM quests WHERE id = :id LIMIT 1");
    $stmtQuest->execute([':id' => $questId]);
    $quest = $stmtQuest->fetch();

    if (!$quest) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Data quest tidak ditemukan!']);
        exit;
    }

    // 2b. Verify Quiz Pass Status ONLY IF quest explicitly requires a Quiz
    $requiresQuiz = isset($quest['requires_quiz']) ? (intval($quest['requires_quiz']) === 1) : false;

    if ($requiresQuiz) {
        $stmtQuizCheck = $pdo->prepare("
            SELECT id FROM quiz_attempts
            WHERE user_id = :user_id AND quest_id = :quest_id AND status = 'passed'
            LIMIT 1
        ");
        $stmtQuizCheck->execute([':user_id' => $userId, ':quest_id' => $questId]);
        if (!$stmtQuizCheck->fetch()) {
            $pdo->rollBack();
            echo json_encode([
                'success' => false,
                'message' => 'Anda harus menuntaskan dan LULUS Quiz terlebih dahulu (nilai minimal 60) sebelum menyelesaikan quest ini!'
            ]);
            exit;
        }
    } else {
        // 2c. Server-Side Validation for Non-Quiz Quest Objectives
        $rawVisited = $rawInput['visited_areas'] ?? $_POST['visited_areas'] ?? [];
        if (is_string($rawVisited)) {
            $rawVisited = json_decode($rawVisited, true) ?? [];
        }
        if (!is_array($rawVisited)) {
            $rawVisited = [];
        }

        if ($questId === 1) {
            $validAreas = ['courtyard', 'classroom', 'ruang_guru', 'computer_lab', 'library', 'cafeteria', 'uks', 'aula', 'lapangan'];
            $q1Visited = array_values(array_unique(array_intersect($rawVisited, $validAreas)));
            $count = count($q1Visited);

            if ($count < 4) {
                $pdo->rollBack();
                echo json_encode([
                    'success' => false,
                    'message' => "Objective belum selesai! Anda baru menjelajahi {$count}/4 area sekolah."
                ]);
                exit;
            }
        } elseif ($questId === 8) {
            if (!in_array('secret_area', $rawVisited)) {
                $pdo->rollBack();
                echo json_encode([
                    'success' => false,
                    'message' => 'Objective belum selesai! Anda belum menemukan Taman Rahasia Alumni.'
                ]);
                exit;
            }
        }
    }

    // 3. Lock and Fetch User Stats
    $stmtUser = $pdo->prepare("SELECT id, username, xp, score, level FROM users WHERE id = :id FOR UPDATE");
    $stmtUser->execute([':id' => $userId]);
    $user = $stmtUser->fetch();

    require_once __DIR__ . '/../progression/reward_engine.php';

    // 4. Update user_quests status to 'completed'
    $stmtUpdateUQ = $pdo->prepare("UPDATE user_quests SET status = 'completed', updated_at = NOW() WHERE user_id = :user_id AND quest_id = :quest_id");
    $stmtUpdateUQ->execute([':user_id' => $userId, ':quest_id' => $questId]);

    // 5. Award Quest Base XP & Score to User
    $stmtUpdateUserBase = $pdo->prepare("UPDATE users SET xp = xp + :xp, score = score + :score WHERE id = :id");
    $stmtUpdateUserBase->execute([
        ':xp'    => intval($quest['xp_reward']),
        ':score' => intval($quest['score_reward']),
        ':id'    => $userId
    ]);

    // 6. Atomic Progression Engine: Level Calculation, Achievement Check, and Item Rewards
    $progression = processUserProgression($pdo, $userId);

    // COMMIT TRANSACTION
    $pdo->commit();

    echo json_encode([
        'success'               => true,
        'message'               => "Quest '{$quest['title']}' Berhasil Diselesaikan!",
        'quest_id'              => $questId,
        'rewards'               => [
            'xp_gained'    => intval($quest['xp_reward']),
            'score_gained' => intval($quest['score_reward'])
        ],
        'user'                  => $progression,
        'leveled_up'            => $progression['leveled_up'],
        'unlocked_achievements' => $progression['unlocked_achievements'],
        'new_items'             => $progression['new_items']
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal menyelesaikan quest: ' . $e->getMessage()]);
}
