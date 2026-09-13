<?php
require_once __DIR__ . '/config/database.php';

try {
    $pdo = getDBConnection();
    echo "1. Running database/phase6_expansion.sql...\n";
    $sql1 = file_get_contents(__DIR__ . '/database/phase6_expansion.sql');
    $pdo->exec($sql1);
    echo "   -> phase6_expansion.sql applied successfully.\n";

    echo "2. Running database/seed_phase6_questions.sql...\n";
    $sql2 = file_get_contents(__DIR__ . '/database/seed_phase6_questions.sql');
    $pdo->exec($sql2);
    echo "   -> seed_phase6_questions.sql applied successfully.\n";

    echo "\n=== PHASE 6 MIGRATION VERIFICATION ===\n";
    $subjects = $pdo->query("SELECT id, code, name FROM subjects")->fetchAll(PDO::FETCH_ASSOC);
    echo "Subjects Count: " . count($subjects) . "\n";
    print_r($subjects);

    $quests = $pdo->query("SELECT id, title, type, requires_quiz FROM quests")->fetchAll(PDO::FETCH_ASSOC);
    echo "Quests Count: " . count($quests) . "\n";
    print_r($quests);

    $qCount = $pdo->query("SELECT COUNT(*) FROM questions")->fetchColumn();
    echo "Total Questions Count: {$qCount}\n";

    $qqCount = $pdo->query("SELECT quest_id, COUNT(*) as q_count FROM quest_questions GROUP BY quest_id")->fetchAll(PDO::FETCH_ASSOC);
    echo "Quest Questions Distribution:\n";
    print_r($qqCount);

} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
