<?php
/**
 * Joy Corporate Solutions - Login Forwarder
 * If OAuth code/state is present, routes to digilocker-callback.
 * Otherwise, routes to /login.
 */
error_reporting(0);
ini_set('display_errors', 0);

$code       = isset($_GET['code']) ? trim($_GET['code']) : '';
$state      = isset($_GET['state']) ? trim($_GET['state']) : '';
$error      = isset($_GET['error']) ? trim($_GET['error']) : '';
$error_desc = isset($_GET['error_description']) ? trim($_GET['error_description']) : '';

if (!empty($code) || !empty($error) || !empty($state)) {
    $params = [];
    if (!empty($code)) $params['code'] = $code;
    if (!empty($state)) $params['state'] = $state;
    if (!empty($error)) $params['error'] = $error;
    if (!empty($error_desc)) $params['error_description'] = $error_desc;
    
    $target_url = '/digilocker-callback?' . http_build_query($params);
} else {
    $target_url = '/login';
}

header("Cache-Control: no-cache, no-store, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: Thu, 01 Jan 1970 00:00:00 GMT");
header("Location: " . $target_url, true, 302);
exit();
