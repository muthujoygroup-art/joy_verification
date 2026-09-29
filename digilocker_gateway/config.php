<?php
/**
 * Configuration File for DigiLocker Integration
 * Joy Corporate Solutions - Government Verification Gateway
 */

// Enable full error handling without crashing output
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

// Fallback for random_bytes if running on older PHP versions (< 7.0)
if (!function_exists('random_bytes')) {
    function random_bytes($length) {
        if (function_exists('openssl_random_pseudo_bytes')) {
            $bytes = openssl_random_pseudo_bytes($length, $strong);
            if ($strong === true && $bytes !== false) {
                return $bytes;
            }
        }
        $bytes = '';
        for ($i = 0; $i < $length; $i++) {
            $bytes .= chr(mt_rand(0, 255));
        }
        return $bytes;
    }
}

// Base64Url encoding helper (required for PKCE)
if (!function_exists('base64url_encode')) {
    function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}

// Configure cross-site cookies before session starts (SameSite=None; Secure for OAuth redirects)
if (session_status() === PHP_SESSION_NONE) {
    if (PHP_VERSION_ID >= 70300) {
        session_set_cookie_params([
            'lifetime' => 86400,
            'path'     => '/',
            'domain'   => $_SERVER['HTTP_HOST'] ?? '',
            'secure'   => true,
            'httponly' => true,
            'samesite' => 'None'
        ]);
    } else {
        @ini_set('session.cookie_samesite', 'None');
        @ini_set('session.cookie_secure', '1');
        @ini_set('session.cookie_httponly', '1');
        session_set_cookie_params(86400, '/; samesite=None', $_SERVER['HTTP_HOST'] ?? '', true, true);
    }
    @session_start();
}

// Toggle between Mock Mode (local simulation) and Live Mode (real API Setu endpoints)
define('MOCK_MODE', false); 

// Choose Environment for Live Mode: 'SANDBOX' or 'PRODUCTION'
define('DIGILOCKER_ENVIRONMENT', 'PRODUCTION'); 

// Bypasses strict in-memory state comparison by utilizing persistent server-side state cache
define('BYPASS_STATE_CHECK', true);

// Citizen / Individual Credentials (obtained from MeriPehchaan Auth)
define('CITIZEN_CLIENT_ID', 'QEC8BCDA95'); 
define('CITIZEN_CLIENT_SECRET', '8e975b5f3d401c251fc3');

// Company / Entity Credentials (obtained from Entity Auth)
define('ENTITY_CLIENT_ID', 'NU68486825');
define('ENTITY_CLIENT_SECRET', '0a1ede509b');

// Redirect / Callback URI
if (defined('MOCK_MODE') && MOCK_MODE) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
    $dir = dirname($_SERVER['SCRIPT_NAME'] ?? '');
    $dir = str_replace('\\', '/', $dir);
    $dir = ($dir === '/' || $dir === '\\') ? '/' : rtrim($dir, '/') . '/';
    define('DIGILOCKER_REDIRECT_URI', $protocol . $host . $dir . 'callback.php');
} else {
    define('DIGILOCKER_REDIRECT_URI', 'https://verify.joycorporatesolutions.com/callback.php');
}

/**
 * Get DigiLocker configuration (credentials & endpoints) for the active flow
 */
function get_digilocker_config($user_type = 'individual') {
    $env = DIGILOCKER_ENVIRONMENT;
    
    // Default Individual (Citizen) settings
    $config = [
        'client_id' => CITIZEN_CLIENT_ID,
        'client_secret' => CITIZEN_CLIENT_SECRET,
        'auth_url' => ($env === 'PRODUCTION') ? 'https://api.digitallocker.gov.in/public/oauth2/1/authorize' : 'https://sandbox.digitallocker.gov.in/public/oauth2/1/authorize',
        'token_url' => ($env === 'PRODUCTION') ? 'https://api.digitallocker.gov.in/public/oauth2/1/token' : 'https://sandbox.digitallocker.gov.in/public/oauth2/1/token',
        'files_url' => ($env === 'PRODUCTION') ? 'https://api.digitallocker.gov.in/public/oauth2/1/files/issued' : 'https://sandbox.digitallocker.gov.in/public/oauth2/1/files/issued'
    ];

    // Company (Entity Locker) settings
    if ($user_type === 'company') {
        $config['client_id'] = ENTITY_CLIENT_ID;
        $config['client_secret'] = ENTITY_CLIENT_SECRET;
        
        $config['auth_url'] = 'https://partners.apisetu.gov.in/oauth2/1/authorize';
        $config['token_url'] = 'https://partners.apisetu.gov.in/oauth2/1/token';
        $config['files_url'] = 'https://partners.apisetu.gov.in/oauth2/1/files/issued';
    }

    return $config;
}

// Profile Endpoint
define('API_PROFILE_URL', 'https://users.digitallocker.gov.in/public/oauth2/1/xml/eaadhaar');

// MySQL Database Configuration Settings
define('ADMIN_USER', 'muthukumar@joyglobalcorp.com');
define('ADMIN_PASS', 'muthukumar@joyglobalcorp.com');

define('DB_HOST', 'localhost');
define('DB_USER', 'Verify_JCS');
define('DB_PASS', 'Verify_JCS');
define('DB_NAME', 'Verify_JCS');

/**
 * Establish a PDO MySQL database connection helper
 */
function get_db_connection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

/**
 * State and PKCE Verifier Persistent Cache Helper
 * Stores state data across cross-site OAuth redirects even if browser cookies are dropped.
 */
function get_state_cache_dir() {
    $dir = __DIR__ . '/.cache';
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
    if (!is_dir($dir) || !is_writable($dir)) {
        $dir = sys_get_temp_dir() . '/jcs_digilocker';
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
    }
    return $dir;
}

function save_pkce_state($state, $data) {
    if (empty($state)) return false;
    $cacheDir = get_state_cache_dir();
    $filePath = $cacheDir . '/state_' . md5($state) . '.json';
    $data['saved_at'] = time();
    @file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
    return true;
}

function get_pkce_state($state) {
    if (empty($state)) return null;
    $cacheDir = get_state_cache_dir();
    $filePath = $cacheDir . '/state_' . md5($state) . '.json';
    if (file_exists($filePath)) {
        $raw = @file_get_contents($filePath);
        if ($raw) {
            $data = json_decode($raw, true);
            if (is_array($data)) {
                return $data;
            }
        }
    }
    return null;
}
