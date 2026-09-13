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
$username = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Validations
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        $error = 'Semua field wajib diisi!';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Format email tidak valid!';
    } elseif (strlen($password) < 8) {
        $error = 'Password minimal harus 8 karakter!';
    } elseif ($password !== $confirm_password) {
        $error = 'Password dan konfirmasi password tidak cocok!';
    } else {
        try {
            $pdo = getDBConnection();

            // Check if username already exists
            $stmtCheckUser = $pdo->prepare("SELECT id FROM users WHERE username = :username LIMIT 1");
            $stmtCheckUser->execute([':username' => $username]);
            if ($stmtCheckUser->fetch()) {
                $error = 'Username sudah digunakan, silakan pilih username lain!';
            } else {
                // Check if email already exists
                $stmtCheckEmail = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
                $stmtCheckEmail->execute([':email' => $email]);
                if ($stmtCheckEmail->fetch()) {
                    $error = 'Email sudah terdaftar, silakan gunakan email lain atau login!';
                } else {
                    // Hash password using password_hash()
                    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

                    // Insert new user into MySQL
                    $stmtInsert = $pdo->prepare("
                        INSERT INTO users (username, email, password, xp, level, score)
                        VALUES (:username, :email, :password, 0, 1, 0)
                    ");
                    $stmtInsert->execute([
                        ':username' => $username,
                        ':email'    => $email,
                        ':password' => $hashedPassword
                    ]);

                    $_SESSION['flash_success'] = 'Registrasi berhasil! Silakan login dengan akun Anda.';
                    header("Location: login.php");
                    exit;
                }
            }
        } catch (PDOException $e) {
            $error = 'Terjadi kesalahan sistem. Gagal mendaftar: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - EDUQUEST</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <!-- Header Navigation -->
    <header class="navbar">
        <a href="index.php" class="brand-logo">
            🎓 EDUQUEST <span class="brand-badge">Game Edukasi</span>
        </a>
        <div class="nav-links">
            <a href="login.php" class="btn btn-secondary">Login</a>
        </div>
    </header>

    <!-- Main Container -->
    <main class="container">
        <div class="auth-container">
            <div class="card">
                <h1 class="card-title">Buat Akun Baru</h1>
                <p class="card-subtitle">Mulai petualangan edukatif Anda di EDUQUEST!</p>

                <?php if (!empty($error)): ?>
                    <div class="alert alert-danger">
                        <span>⚠️</span> <?= htmlspecialchars($error) ?>
                    </div>
                <?php endif; ?>

                <form action="register.php" method="POST" id="register-form">
                    <div class="form-group">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" name="username" id="username" class="form-control" placeholder="Pilih username" value="<?= htmlspecialchars($username) ?>" required autocomplete="username">
                    </div>

                    <div class="form-group">
                        <label for="email" class="form-label">Alamat Email</label>
                        <input type="email" name="email" id="email" class="form-control" placeholder="nama@email.com" value="<?= htmlspecialchars($email) ?>" required autocomplete="email">
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label">Password (Min. 8 Karakter)</label>
                        <input type="password" name="password" id="password" class="form-control" placeholder="••••••••" required minlength="8">
                    </div>

                    <div class="form-group">
                        <label for="confirm_password" class="form-label">Konfirmasi Password</label>
                        <input type="password" name="confirm_password" id="confirm_password" class="form-control" placeholder="••••••••" required>
                        <small id="password-match-error" style="color: var(--danger); display: none; margin-top: 0.3rem;">Password tidak cocok!</small>
                    </div>

                    <button type="submit" class="btn btn-primary btn-full" style="margin-top: 1.5rem;">
                        ✨ Daftar Akun
                    </button>
                </form>

                <p style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
                    Sudah memiliki akun? <a href="login.php">Login di sini</a>
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
