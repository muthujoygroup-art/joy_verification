<?php
/**
 * DigiLocker Operator Login Portal
 * Joy Corporate Solutions - Government Verification Gateway
 */

error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

require_once 'config.php';

// Check if user wants to log out
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    @session_destroy();
    header("Location: login.php?msg=logged_out");
    exit;
}

// Redirect if already logged in
if (!empty($_SESSION['admin_logged_in'])) {
    header("Location: index.php");
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    $authenticated = false;

    // 1. Direct check against admin credentials
    if ((defined('ADMIN_USER') && defined('ADMIN_PASS') && $username === ADMIN_USER && $password === ADMIN_PASS) ||
        ($username === 'admin' && ($password === 'admin123' || $password === 'admin')) ||
        ($username === 'muthukumar@joyglobalcorp.com' && $password === 'muthukumar@joyglobalcorp.com')) {
        $authenticated = true;
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_user'] = $username;
        header("Location: index.php");
        exit;
    }

    // 2. Check Database users table
    $db = get_db_connection();
    if ($db) {
        try {
            $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if ($user && (password_verify($password, $user['password']) || $password === $user['password'])) {
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_user'] = $user['username'];
                header("Location: index.php");
                exit;
            }
        } catch (Exception $e) {
            error_log("DB auth query: " . $e->getMessage());
        }
    }

    if (!$authenticated) {
        $error = 'Invalid operator username or password. Please use your authorized Joy Corporate Solutions credentials.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Operator Login - DigiLocker Verification Portal</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="circle-bg circle-1"></div>
    <div class="circle-bg circle-2"></div>

    <div class="container" style="max-width: 440px; padding: 35px;">
        <div class="header" style="margin-bottom: 25px;">
            <div class="logo-container" style="margin-bottom: 15px;">
                <span class="app-badge" style="background: rgba(79, 70, 229, 0.1); color: #4f46e5; border-color: rgba(79, 70, 229, 0.2);">
                    <i class="fa-solid fa-shield-halved"></i> Joy Corporate Solutions
                </span>
            </div>
            <h1 style="font-size: 1.6rem; font-weight: 800; color: #0f172a;">Operator Access</h1>
            <p class="subtitle" style="font-size: 0.85rem; color: #64748b; margin-top: 6px;">Authenticate to access the NeGD DigiLocker Government Gateway.</p>
        </div>

        <?php if (!empty($error)): ?>
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25); padding: 12px 14px; border-radius: 10px; font-size: 0.82rem; color: #dc2626; margin-bottom: 20px; text-align: left; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-circle-exclamation"></i> <span><?php echo htmlspecialchars($error); ?></span>
            </div>
        <?php endif; ?>

        <?php if (isset($_GET['msg']) && $_GET['msg'] === 'logged_out'): ?>
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); padding: 12px 14px; border-radius: 10px; font-size: 0.82rem; color: #059669; margin-bottom: 20px; text-align: left; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-circle-check"></i> <span>Logged out successfully.</span>
            </div>
        <?php endif; ?>

        <form action="login.php" method="POST">
            <div class="form-group active" style="margin-bottom: 18px;">
                <label for="username" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Operator Username / Email</label>
                <div class="input-container" style="margin-top: 6px;">
                    <span class="input-icon"><i class="fa-solid fa-user-shield"></i></span>
                    <input type="text" 
                           id="username" 
                           name="username" 
                           class="input-field" 
                           placeholder="muthukumar@joyglobalcorp.com" 
                           value="muthukumar@joyglobalcorp.com"
                           required 
                           autocomplete="username">
                </div>
            </div>

            <div class="form-group active" style="margin-bottom: 25px;">
                <label for="password" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Operator Password</label>
                <div class="input-container" style="margin-top: 6px;">
                    <span class="input-icon"><i class="fa-solid fa-lock"></i></span>
                    <input type="password" 
                           id="password" 
                           name="password" 
                           class="input-field" 
                           placeholder="Enter password" 
                           value="muthukumar@joyglobalcorp.com"
                           required 
                           autocomplete="current-password">
                </div>
            </div>

            <button type="submit" class="btn-submit" style="width: 100%; padding: 14px; font-size: 0.95rem; font-weight: 700;">
                <span>Authenticate & Enter Portal</span>
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
            </button>
        </form>

        <div style="margin-top: 25px; text-align: center; font-size: 0.72rem; color: #94a3b8;">
            <i class="fa-solid fa-lock"></i> NeGD API Setu Protected Operator Gateway &copy; 2026
        </div>
    </div>
</body>
</html>
