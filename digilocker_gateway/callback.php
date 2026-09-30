<?php
/**
 * DigiLocker OAuth Callback Gateway
 * Joy Corporate Solutions - Fast Forwarder to HR Portal
 * 
 * Registered URL on DigiLocker / API Setu: https://verify.joycorporatesolutions.com/callback.php
 * Target HR Portal Destination: https://test2.joycorporatesolutions.com/digilocker-callback
 */

// Enable error handling
error_reporting(0);
ini_set('display_errors', 0);

// Extract OAuth parameters returned from DigiLocker
$code       = isset($_GET['code']) ? trim($_GET['code']) : '';
$state      = isset($_GET['state']) ? trim($_GET['state']) : '';
$error      = isset($_GET['error']) ? trim($_GET['error']) : '';
$error_desc = isset($_GET['error_description']) ? trim($_GET['error_description']) : '';

// Build destination query parameters
$params = [];
if (!empty($code)) $params['code'] = $code;
if (!empty($state)) $params['state'] = $state;
if (!empty($error)) $params['error'] = $error;
if (!empty($error_desc)) $params['error_description'] = $error_desc;

// Immediately forward browser to main HR Portal
$target_url = 'https://test2.joycorporatesolutions.com/digilocker-callback';
if (!empty($params)) {
    $target_url .= '?' . http_build_query($params);
}

header("Location: " . $target_url);
exit;
?>
