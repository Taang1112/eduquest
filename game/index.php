<?php
session_start();
require_once __DIR__ . '/../config/database.php';

// Protection: Redirect if user is not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.php");
    exit;
}

$userId = $_SESSION['user_id'];
$user = null;

try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT id, username, email, xp, level, score, created_at FROM users WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch();

    if (!$user) {
        // User session invalid or deleted
        session_destroy();
        header("Location: ../login.php");
        exit;
    }
} catch (PDOException $e) {
    die("Error loading player session data: " . htmlspecialchars($e->getMessage()));
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EDUQUEST - World Map 2D & Character Progression</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="assets/css/game.css">
    <link rel="stylesheet" href="assets/css/quest.css">
    <link rel="stylesheet" href="assets/css/quiz.css">
    <link rel="stylesheet" href="assets/css/achievement.css">
</head>
<body class="game-page-wrapper">

    <!-- Game HUD Header Bar -->
    <header class="game-hud-navbar">
        <div class="hud-left">
            <a href="../index.php" class="brand-logo" style="font-size: 1.25rem;">
                🎓 EDUQUEST
            </a>
            <div style="display: flex; flex-direction: column; gap: 2px;">
                <span class="hud-user-tag">
                    Player: <strong id="hud-username" style="color: var(--text-main);"><?= htmlspecialchars($user['username']) ?></strong>
                </span>
                <span id="hud-title" class="hud-title-badge">Pelajar EDUQUEST</span>
            </div>
        </div>

        <div class="hud-stats-group">
            <div class="hud-stat-pill level">
                <span>⭐ Level</span>
                <span id="hud-level">Lvl <?= htmlspecialchars($user['level']) ?></span>
            </div>

            <div class="hud-progress-container" style="min-width: 180px;">
                <div class="hud-xp-bar-bg">
                    <div id="hud-xp-fill" class="hud-xp-bar-fill" style="width: 0%;"></div>
                </div>
                <div id="hud-xp-text" class="hud-xp-subtext">0 / 100 XP</div>
            </div>

            <div class="hud-stat-pill score">
                <span>🏆 Score</span>
                <span id="hud-score"><?= htmlspecialchars($user['score']) ?></span>
            </div>

            <div class="hud-buttons-row">
                <button onclick="AchievementSystem.toggleModal()" class="hud-btn" title="Achievement (Tombol A)">
                    🏆 Prestasi [A]
                </button>
                <button onclick="InventorySystem.toggleModal()" class="hud-btn" title="Inventaris (Tombol I)">
                    🎒 Item [I]
                </button>
                <button onclick="ProgressionSystem.toggleProfileModal()" class="hud-btn" title="Profil Player (Tombol P)">
                    👤 Profil [P]
                </button>
                <button onclick="QuestSystem.togglePanel()" class="hud-btn" style="border-color: rgba(99,102,241,0.5); color: #818cf8;" title="Quest Log (Tombol Q)">
                    📜 Quest [Q]
                </button>
            </div>

            <a href="../logout.php" class="btn btn-danger btn-sm" style="padding: 0.35rem 0.9rem; font-size: 0.85rem; margin-left: 8px;">
                Logout
            </a>
        </div>
    </header>

    <!-- Main Game Canvas Container -->
    <main class="game-container">
        <!-- Compact Active Quest HUD Overlay Widget -->
        <div id="hudActiveQuestWidget" class="hud-active-quest-box" style="display: none;"></div>

        <!-- HTML5 Canvas Viewport -->
        <canvas id="gameCanvas"></canvas>

        <!-- Controls Guide Footer & Map Legend -->
        <div class="game-controls-bar">
            <span>Gerak: <span class="key-badge">W</span><span class="key-badge">A</span><span class="key-badge">S</span><span class="key-badge">D</span></span>
            <span>Interaksi: <span class="key-badge">E</span></span>
            <span>Quest: <span class="key-badge">Q</span></span>
            <span>Prestasi: <span class="key-badge">A</span></span>
            <span>Item: <span class="key-badge">I</span></span>
            <span>Profil: <span class="key-badge">P</span></span>
            <div class="hud-map-legend">
                <span class="legend-item">🏫 Kelas</span>
                <span class="legend-item">💻 Lab Komputer</span>
                <span class="legend-item">📚 Perpustakaan</span>
                <span class="legend-item">🌳 Lapangan</span>
            </div>
        </div>
    </main>

    <!-- Modal 1: Achievement Modal -->
    <div id="achievement-modal" class="edu-modal-overlay">
        <div class="edu-modal-box">
            <div class="edu-modal-header">
                <div class="edu-modal-title">🏆 DAFTAR PRESTASI & ACHIEVEMENT</div>
                <div id="ach-header-count" style="font-size: 0.8rem; color: #34d399; font-weight: 700;">0 / 6 Terbuka</div>
                <button class="edu-modal-close-btn" onclick="AchievementSystem.toggleModal()">✕</button>
            </div>
            <div id="achievement-modal-list" class="edu-modal-body">
                <!-- Loaded via JS -->
            </div>
        </div>
    </div>

    <!-- Modal 2: Player Profile Modal -->
    <div id="profile-modal" class="edu-modal-overlay">
        <div class="edu-modal-box">
            <div class="edu-modal-header">
                <div class="edu-modal-title">👤 PROFIL DIRI PLAYER</div>
                <button class="edu-modal-close-btn" onclick="ProgressionSystem.toggleProfileModal()">✕</button>
            </div>
            <div id="profile-modal-body" class="edu-modal-body">
                <!-- Loaded via JS -->
            </div>
        </div>
    </div>

    <!-- Modal 3: Inventory Modal -->
    <div id="inventory-modal" class="edu-modal-overlay">
        <div class="edu-modal-box">
            <div class="edu-modal-header">
                <div class="edu-modal-title">🎒 INVENTARIS ITEM SPESIAL</div>
                <button class="edu-modal-close-btn" onclick="InventorySystem.toggleModal()">✕</button>
            </div>
            <div id="inventory-modal-grid" class="edu-modal-body inventory-grid">
                <!-- Loaded via JS -->
            </div>
        </div>
    </div>

    <!-- Modular Game Engine, Quiz & Progression Scripts -->
    <script src="assets/js/collision.js"></script>
    <script src="assets/js/map.js"></script>
    <script src="assets/js/player.js"></script>
    <script src="assets/js/camera.js"></script>
    <script src="assets/js/quest.js"></script>
    <script src="assets/js/quiz.js"></script>
    <script src="assets/js/worldObjects.js"></script>
    <script src="assets/js/npc.js"></script>
    <script src="assets/js/dialog.js"></script>
    <script src="assets/js/progression.js"></script>
    <script src="assets/js/achievement.js"></script>
    <script src="assets/js/inventory.js"></script>
    <script src="assets/js/game.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.ProgressionSystem) ProgressionSystem.init();
            if (window.AchievementSystem) AchievementSystem.init();
            if (window.InventorySystem) InventorySystem.init();
        });
    </script>
</body>
</html>
