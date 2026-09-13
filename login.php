<?php
session_start();
require_once __DIR__ . '/config/database.php';

// If user is already logged in, redirect to game page
if (isset($_SESSION['user_id'])) {
    header("Location: game/index.php");
    exit;
}

$error = '';
$success = '';

// Flash message check from register
if (isset($_SESSION['flash_success'])) {
    $success = $_SESSION['flash_success'];
    unset($_SESSION['flash_success']);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $error = 'Silakan isi email dan password!';
    } else {
        try {
            $pdo = getDBConnection();
            $stmt = $pdo->prepare("SELECT id, username, email, password FROM users WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                // Regenerate session id for security against session fixation
                session_regenerate_id(true);

                // Set session variables
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];

                header("Location: game/index.php");
                exit;
            } else {
                $error = 'Email atau password salah!';
            }
        } catch (PDOException $e) {
            $error = 'Terjadi kesalahan sistem. Gagal login: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - EDUQUEST</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <!-- Header Navigation -->
    <header class="navbar">
        <a href="index.php" class="brand-logo">
            🎓 EDUQUEST <span class="brand-badge">Game Edukasi</span>
        </a>
        <div class="nav-links">
            <a href="register.php" class="btn btn-secondary">Daftar Akun</a>
        </div>
    </header>

    <!-- Main Container -->
    <main class="container">
        <div class="auth-container">
            <div class="card">
                <h1 class="card-title">Masuk ke EDUQUEST</h1>
                <p class="card-subtitle">Lanjutkan petualangan dan tingkatkan Level Anda!</p>

                <?php if (!empty($success)): ?>
                    <div class="alert alert-success alert-auto-dismiss">
                        <span>✅</span> <?= htmlspecialchars($success) ?>
                    </div>
                <?php endif; ?>

                <?php if (!empty($error)): ?>
                    <div class="alert alert-danger">
                        <span>⚠️</span> <?= htmlspecialchars($error) ?>
                    </div>
                <?php endif; ?>

                <form action="login.php" method="POST">
                    <div class="form-group">
                        <label for="email" class="form-label">Alamat Email</label>
                        <input type="email" name="email" id="email" class="form-control" placeholder="nama@email.com" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required autocomplete="email">
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" name="password" id="password" class="form-control" placeholder="••••••••" required autocomplete="current-password">
                    </div>

                    <button type="submit" class="btn btn-primary btn-full" style="margin-top: 1.5rem;">
                        🚀 Masuk Game
                    </button>
                </form>

                <p style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
                    Belum punya akun? <a href="register.php">Daftar sekarang</a>
                </p>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        &copy; <?= date('Y') ?> EDUQUEST. All rights reserved. Game Edukasi Berbasis Web.
    </footer>

    <script src="assets/js/app.js"></script>
</body>
</html>
