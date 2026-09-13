<?php
session_start();
$isLoggedIn = isset($_SESSION['user_id']);
$username = $_SESSION['username'] ?? '';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EDUQUEST - Game Edukasi Berbasis Web</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <!-- Header Navigation -->
    <header class="navbar">
        <a href="index.php" class="brand-logo">
            🎓 EDUQUEST <span class="brand-badge">Game Edukasi</span>
        </a>
        <div class="nav-links">
            <?php if ($isLoggedIn): ?>
                <span style="font-size: 0.9rem; color: var(--text-muted);">Halo, <strong style="color: var(--text-main);"><?= htmlspecialchars($username) ?></strong></span>
                <a href="game/index.php" class="btn btn-primary">Masuk Game 🎮</a>
                <a href="logout.php" class="btn btn-secondary">Logout</a>
            <?php else: ?>
                <a href="login.php" class="btn btn-secondary">Login</a>
                <a href="register.php" class="btn btn-primary">Daftar Akun</a>
            <?php endif; ?>
        </div>
    </header>

    <!-- Main Container -->
    <main class="container">
        <!-- Hero Section -->
        <section class="hero">
            <h1 class="hero-title">
                Jelajahi Dunia Sekolah & Tingkatkan <span class="gradient-text">Pengetahuanmu</span>
            </h1>
            <p class="hero-desc">
                EDUQUEST adalah platform game edukasi interaktif. Selesaikan Quest tantangan, pecahkan Quiz seru, dapatkan XP, tingkatkan Level, dan raih posisi teratas di Leaderboard!
            </p>
            <div class="hero-actions">
                <?php if ($isLoggedIn): ?>
                    <a href="game/index.php" class="btn btn-primary" style="font-size: 1.1rem; padding: 0.9rem 2.2rem;">
                        🎮 Masuk ke Dunia Game
                    </a>
                <?php else: ?>
                    <a href="register.php" class="btn btn-primary" style="font-size: 1.1rem; padding: 0.9rem 2.2rem;">
                        ✨ Mulai Petualangan Gratis
                    </a>
                    <a href="login.php" class="btn btn-secondary" style="font-size: 1.1rem; padding: 0.9rem 2.2rem;">
                        🔑 Sudah Punya Akun? Login
                    </a>
                <?php endif; ?>
            </div>
        </section>

        <!-- Features Showcase -->
        <section style="margin-top: 4rem;">
            <h2 style="text-align: center; font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem;">
                Fitur Utama EDUQUEST
            </h2>
            <p style="text-align: center; color: var(--text-muted); margin-bottom: 2rem;">
                Didesain khusus untuk pembelajaran yang seru, interaktif, dan terstruktur.
            </p>

            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🏫</div>
                    <h3 class="feature-title">Dunia Sekolah Interaktif</h3>
                    <p class="feature-desc">Eksplorasi lingkungan sekolah, temui NPC, dan temukan berbagai tantangan menarik di setiap sudut area.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">📜</div>
                    <h3 class="feature-title">Quest & Quiz Interaktif</h3>
                    <p class="feature-desc">Kerjakan tugas misi edukatif dan kuis interaktif untuk menguji pemahaman materi pelajaranmu.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">⭐</div>
                    <h3 class="feature-title">XP, Level & Inventory</h3>
                    <p class="feature-desc">Dapatkan XP setiap menyelesaikan quest, naikkan Level karaktermu, dan kumpulkan item unik di inventory.</p>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
        &copy; <?= date('Y') ?> EDUQUEST. All rights reserved. Game Edukasi Berbasis Web.
    </footer>

    <script src="assets/js/app.js"></script>
</body>
</html>
