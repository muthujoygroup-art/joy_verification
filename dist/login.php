<?php
/**
 * Joy Corporate Solutions - Login Eliminator Forwarder
 * Completely bypasses legacy Operator Login and routes to candidate dossier or callback
 */
error_reporting(0);
ini_set('display_errors', 0);

$code       = isset($_GET['code']) ? trim($_GET['code']) : '';
$state      = isset($_GET['state']) ? trim($_GET['state']) : '';
$error      = isset($_GET['error']) ? trim($_GET['error']) : '';
$error_desc = isset($_GET['error_description']) ? trim($_GET['error_description']) : '';

if (!empty($code)) {
    $params = ['code' => $code];
    if (!empty($state)) $params['state'] = $state;
    if (!empty($error)) $params['error'] = $error;
    if (!empty($error_desc)) $params['error_description'] = $error_desc;
    $target_url = 'https://test2.joycorporatesolutions.com/digilocker-callback?' . http_build_query($params);
} else {
    $target_url = 'https://test2.joycorporatesolutions.com/joy-man-power-service/hr/agilan/candidates';
}

header("Cache-Control: no-cache, no-store, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: Thu, 01 Jan 1970 00:00:00 GMT");
header("Location: " . $target_url, true, 302);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=<?php echo htmlspecialchars($target_url); ?>">
<script>window.location.replace("<?php echo addslashes($target_url); ?>");</script>
<title>Redirecting to JOY Verification...</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 60px 20px; background: #0f172a; color: #f8fafc;">
  <div style="max-width: 500px; margin: 0 auto; background: #1e293b; padding: 40px; border-radius: 16px; border: 1px solid #334155;">
    <h2 style="color: #38bdf8; margin-bottom: 12px;">Redirecting to JOY Verification...</h2>
    <p style="color: #94a3b8; font-size: 15px;">Transferring safely to candidate dossier.</p>
    <div style="margin-top: 24px;">
      <a href="<?php echo htmlspecialchars($target_url); ?>" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px;">
        Click here to continue &rarr;
      </a>
    </div>
  </div>
</body>
</html>
