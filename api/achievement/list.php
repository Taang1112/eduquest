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

    // Fetch all achievements with user unlock state
    $stmt = $pdo->prepare("
        SELECT 
            a.id,
            a.code,
            a.title,
            a.description,
            a.icon,
            a.condition_type,
            a.condition_value,
            a.xp_reward,
            a.score_reward,
            ua.unlocked_at,
            IF(ua.id IS NOT NULL, 1, 0) AS is_unlocked
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = :user_id
        ORDER BY a.id ASC
    ");
    $stmt->execute([':user_id' => $userId]);
    $achievements = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'      => true,
        'achievements' => array_map(function($ach) {
            return [
                'id'              => intval($ach['id']),
                'code'            => $ach['code'],
                'title'           => $ach['title'],
                'description'     => $ach['description'],
                'icon'            => $ach['icon'],
                'condition_type'  => $ach['condition_type'],
                'condition_value' => intval($ach['condition_value']),
                'xp_reward'       => intval($ach['xp_reward']),
                'score_reward'    => intval($ach['score_reward']),
                'is_unlocked'     => (bool)$ach['is_unlocked'],
                'unlocked_at'     => $ach['unlocked_at']
            ];
        }, $achievements)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
