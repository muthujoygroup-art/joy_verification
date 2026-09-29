<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

// Check if operator is authenticated
if (empty($_SESSION['admin_logged_in'])) {
    header("Location: login.php");
    exit;
}

echo "<!DOCTYPE html>
<html>
<head>
    <title>DigiLocker Integration Diagnostics</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px; line-height: 1.6; }
        .card { background: #1e293b; padding: 25px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 25px; }
        h1 { color: #f97316; margin-top: 0; }
        h3 { color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 8px; }
        code { background: #0f172a; color: #a78bfa; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.95em; }
        .url-box { background: #0f172a; color: #34d399; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all; margin-bottom: 15px; font-size: 0.9em; border: 1px solid #1e293b; }
        .btn { display: inline-block; background: #f97316; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 15px; margin-bottom: 10px; border: none; cursor: pointer; transition: opacity 0.2s; }
        .btn-alt { background: #6366f1; }
        .btn-green { background: #10b981; }
        .btn:hover { opacity: 0.9; }
        ul { padding-left: 20px; }
        li { margin-bottom: 10px; }
    </style>
</head>
<body>

<div class='card'>
    <h1>DigiLocker Integration Diagnostics</h1>
    <p>Test native API Setu scopes for Client ID QEC8BCDA95.</p>
</div>

<div class='card'>
    <h3>1. Loaded Configuration Profile</h3>
    <ul>
        <li><strong>CITIZEN_CLIENT_ID:</strong> <code>" . CITIZEN_CLIENT_ID . "</code></li>
        <li><strong>DIGILOCKER_REDIRECT_URI:</strong> <code>" . DIGILOCKER_REDIRECT_URI . "</code></li>
    </ul>
</div>";

// Setup base PKCE values for testing
$state = 'diagnostic_state_test_12345';
$challenge = 'diagnostic_challenge_test_12345';

// Helper function to build testing URL
function build_test_url($scope) {
    $state = 'diagnostic_state_test_12345';
    $challenge = 'diagnostic_challenge_test_12345';
    $params = [
        'response_type' => 'code',
        'client_id' => CITIZEN_CLIENT_ID,
        'redirect_uri' => DIGILOCKER_REDIRECT_URI,
        'redirect_url' => DIGILOCKER_REDIRECT_URI,
        'state' => $state,
        'code_challenge' => $challenge,
        'code_challenge_method' => 'S256',
        'scope' => $scope
    ];
    return 'https://api.digitallocker.gov.in/public/oauth2/1/authorize?' . http_build_query($params);
}

$url_userdetails = build_test_url('Userdetails');
$url_issueddocs = build_test_url('files.issueddocs');
$url_both = build_test_url('Userdetails files.issueddocs');

echo "
<div class='card'>
    <h3>2. Test Endpoint D1: scope=Userdetails (Native Profile scope)</h3>
    <p>This is the standard API Setu scope name for 'Profile information'.</p>
    <div class='url-box'>" . htmlspecialchars($url_userdetails) . "</div>
    <a href='" . htmlspecialchars($url_userdetails) . "' target='_blank' class='btn btn-green'>Test with scope=Userdetails</a>
</div>

<div class='card'>
    <h3>3. Test Endpoint D2: scope=files.issueddocs (Native Issued Docs scope)</h3>
    <p>This is the standard API Setu scope name for 'Issued Documents'.</p>
    <div class='url-box'>" . htmlspecialchars($url_issueddocs) . "</div>
    <a href='" . htmlspecialchars($url_issueddocs) . "' target='_blank' class='btn'>Test with scope=files.issueddocs</a>
</div>

<div class='card'>
    <h3>4. Test Endpoint D3: scope=Userdetails files.issueddocs (Both Combined)</h3>
    <p>This requests access to both the Profile information and Issued Documents.</p>
    <div class='url-box'>" . htmlspecialchars($url_both) . "</div>
    <a href='" . htmlspecialchars($url_both) . "' target='_blank' class='btn btn-alt'>Test with scope=Userdetails files.issueddocs</a>
</div>

<div class='card'>
    <h3>5. Diagnostics Action Plan</h3>
    <ol>
        <li>Click <strong>Test with scope=Userdetails</strong> (D1 - Green Button) and see if the login screen loads.</li>
        <li>Click <strong>Test with scope=files.issueddocs</strong> (D2) and see if it loads.</li>
        <li>Click <strong>Test with scope=Userdetails files.issueddocs</strong> (D3) and see if it loads.</li>
    </ol>
</div>

</body>
</html>";
?>
