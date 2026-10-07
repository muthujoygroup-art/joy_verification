<?php
/**
 * Joy Corporate Solutions - DigiLocker OAuth Callback Gateway Forwarder
 * Automatically forwards code & state to trueprofile.joycorporatesolutions.com/digilocker-callback
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

$target_url = 'https://trueprofile.joycorporatesolutions.com/digilocker-callback';
if (!empty($params)) {
    $target_url .= '?' . http_build_query($params);
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
  <div style="max-width: 500px; margin: 0 auto; background: #1e293b; padding: 40px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <h2 style="color: #38bdf8; margin-bottom: 12px;">Redirecting to JOY Verification...</h2>
    <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">Transferring your verified DigiLocker credentials safely to candidate dossier.</p>
    <div style="margin-top: 24px;">
      <a href="<?php echo htmlspecialchars($target_url); ?>" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Click here if not redirected automatically &rarr;
      </a>
    </div>
  </div>
</body>
</html>
