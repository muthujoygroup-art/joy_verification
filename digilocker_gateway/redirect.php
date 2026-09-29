<?php
// Enable error reporting for debuggability
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

require_once 'config.php';

// Accept both POST and GET to allow direct link initiation
$request_data = ($_SERVER['REQUEST_METHOD'] === 'POST') ? $_POST : $_GET;

// 1. Determine verification type and identifier value
$auth_type = isset($request_data['auth_type']) ? trim($request_data['auth_type']) : 'mobile';
$identifier_value = '';

if ($auth_type === 'mobile') {
    $identifier_value = isset($request_data['mobile_number']) ? trim($request_data['mobile_number']) : '';
} elseif ($auth_type === 'aadhaar') {
    $identifier_value = isset($request_data['aadhaar_number']) ? str_replace(' ', '', $request_data['aadhaar_number']) : '';
} elseif ($auth_type === 'pan') {
    $identifier_value = isset($request_data['pan_number']) ? strtoupper(trim($request_data['pan_number'])) : '';
}

// Fallback to general parameter if provided
if (empty($identifier_value) && isset($request_data['identifier'])) {
    $identifier_value = trim($request_data['identifier']);
}

// Default fallback if directly clicked without typing (e.g. prompt on DigiLocker login page)
if (empty($identifier_value)) {
    $identifier_value = '9876543210';
}

$user_type = isset($request_data['user_type']) ? trim($request_data['user_type']) : 'individual';

// 2. Setup PKCE (Proof Key for Code Exchange) and CSRF State
$state = bin2hex(random_bytes(16));
$verifier = base64url_encode(random_bytes(32));
$challenge = base64url_encode(hash('sha256', $verifier, true));

// Save in active session
$_SESSION['oauth_state'] = $state;
$_SESSION['oauth_verifier'] = $verifier;
$_SESSION['user_type'] = $user_type;
$_SESSION['auth_type'] = $auth_type;
$_SESSION['identifier_value'] = $identifier_value;

// Save in persistent server-side file cache (solves cross-site cookie loss)
$stateData = [
    'state' => $state,
    'verifier' => $verifier,
    'challenge' => $challenge,
    'user_type' => $user_type,
    'auth_type' => $auth_type,
    'identifier_value' => $identifier_value,
    'created_at' => date('Y-m-d H:i:s')
];
save_pkce_state($state, $stateData);

// 3. Save initial pending verification record in MySQL database
$db = get_db_connection();
$verification_id = null;
if ($db) {
    try {
        $stmt = $db->prepare("INSERT INTO verifications (session_id, user_type, auth_type, identifier_value, status) VALUES (?, ?, ?, ?, 'pending')");
        $stmt->execute([
            session_id() . '_' . $state,
            $user_type,
            $auth_type,
            $identifier_value
        ]);
        $verification_id = $db->lastInsertId();
        $_SESSION['verification_db_id'] = $verification_id;
        $stateData['verification_db_id'] = $verification_id;
        save_pkce_state($state, $stateData);
    } catch (Exception $dbEx) {
        error_log("Failed to insert verification log: " . $dbEx->getMessage());
    }
}

// 4. Redirect based on MOCK_MODE toggle
$dlConfig = get_digilocker_config($user_type);

if (MOCK_MODE) {
    $mock_url = 'mock_digilocker.php?' . http_build_query([
        'response_type' => 'code',
        'client_id' => 'mock_client_id_123',
        'redirect_uri' => DIGILOCKER_REDIRECT_URI,
        'state' => $state,
        'code_challenge' => $challenge,
        'code_challenge_method' => 'S256'
    ]);
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_write_close();
    }
    header('Location: ' . $mock_url);
    exit;
} else {
    // Live DigiLocker Authorization URL
    $params = [
        'response_type' => 'code',
        'client_id' => $dlConfig['client_id'],
        'redirect_uri' => DIGILOCKER_REDIRECT_URI,
        'redirect_url' => DIGILOCKER_REDIRECT_URI, // Supports both OAuth param standards
        'state' => $state,
        'code_challenge' => $challenge,
        'code_challenge_method' => 'S256',
        'scope' => 'files.issueddocs'
    ];

    $live_url = $dlConfig['auth_url'] . '?' . http_build_query($params);
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_write_close();
    }
    header('Location: ' . $live_url);
    exit;
}
