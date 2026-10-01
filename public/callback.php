<?php
/**
 * Joy Corporate Solutions - DigiLocker OAuth Callback Gateway Forwarder
 * Automatically forwards code & state to /digilocker-callback
 */
error_reporting(0);
ini_set('display_errors', 0);

$code       = isset($_GET['code']) ? trim($_GET['code']) : '';
$state      = isset($_GET['state']) ? trim($_GET['state']) : '';
$error      = isset($_GET['error']) ? trim($_GET['error']) : '';
$error_desc = isset($_GET['error_description']) ? trim($_GET['error_description']) : '';

$params = [];
if (!empty($code)) $params['code'] = $code;
if (!empty($state)) $params['state'] = $state;
if (!empty($error)) $params['error'] = $error;
if (!empty($error_desc)) $params['error_description'] = $error_desc;

$target_url = '/digilocker-callback';
if (!empty($params)) {
    $target_url .= '?' . http_build_query($params);
}

header("Cache-Control: no-cache, no-store, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: Thu, 01 Jan 1970 00:00:00 GMT");
header("Location: " . $target_url, true, 302);
exit();
