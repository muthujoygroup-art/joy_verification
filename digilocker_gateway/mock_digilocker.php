<?php
require_once 'config.php';

// Get params from query string
$state = isset($_GET['state']) ? $_GET['state'] : '';
$redirect_uri = isset($_GET['redirect_uri']) ? $_GET['redirect_uri'] : DIGILOCKER_REDIRECT_URI;

// Retrieve from session for visualization
$auth_type = isset($_SESSION['auth_type']) ? $_SESSION['auth_type'] : 'mobile';
$identifier_value = isset($_SESSION['identifier_value']) ? $_SESSION['identifier_value'] : '';

// Handle form submission (OTP and PIN entry)
$step = isset($_POST['step']) ? $_POST['step'] : 'login';

if ($step === 'submit_auth') {
    // Show consent page next
    $step = 'consent';
} elseif ($step === 'grant_consent') {
    // Generate a temporary mock auth code
    $mock_code = 'mock_auth_code_' . bin2hex(random_bytes(8));
    
    // Redirect back to the callback URL
    $callback_url = $redirect_uri . '?' . http_build_query([
        'code' => $mock_code,
        'state' => $state
    ]);
    header('Location: ' . $callback_url);
    exit;
} elseif ($step === 'deny') {
    header('Location: index.php?error=consent_denied');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mock DigiLocker Authentication Portal</title>
    <!-- FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #f0f2f5;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #333;
        }

        .portal-container {
            width: 100%;
            max-width: 440px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e1e4e8;
        }

        .portal-header {
            background: #0d47a1;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: white;
        }

        .portal-header h2 {
            font-size: 1.15rem;
            margin: 0;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .portal-body {
            padding: 30px 24px;
        }

        .badge-sandbox {
            background: #e65100;
            color: white;
            font-size: 0.65rem;
            font-weight: bold;
            padding: 3px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }

        .sub-logo {
            text-align: center;
            margin-bottom: 24px;
        }

        .sub-logo i {
            font-size: 2.5rem;
            color: #0d47a1;
        }

        .title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 8px;
            text-align: center;
        }

        .subtitle {
            font-size: 0.88rem;
            color: #666;
            text-align: center;
            margin-bottom: 24px;
            line-height: 1.4;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 6px;
        }

        .input-display {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            padding: 12px;
            border-radius: 6px;
            font-size: 0.95rem;
            font-weight: 500;
            color: #2d3748;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .input-field {
            width: 100%;
            border: 1px solid #cbd5e0;
            padding: 12px;
            border-radius: 6px;
            font-size: 0.95rem;
            transition: border-color 0.2s;
        }

        .input-field:focus {
            outline: none;
            border-color: #0d47a1;
        }

        .btn-primary {
            width: 100%;
            background: #e65100;
            color: white;
            border: none;
            padding: 14px;
            font-size: 0.95rem;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .btn-primary:hover {
            background: #bf360c;
        }

        .btn-secondary {
            width: 100%;
            background: #f7fafc;
            color: #4a5568;
            border: 1px solid #cbd5e0;
            padding: 14px;
            font-size: 0.95rem;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.2s;
        }

        .btn-secondary:hover {
            background: #edf2f7;
        }

        /* Consent Screen Styles */
        .consent-box {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
            border-left: 4px solid #0d47a1;
        }

        .consent-box p {
            margin: 0 0 12px 0;
            font-size: 0.9rem;
            line-height: 1.45;
        }

        .consent-scopes {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .consent-scopes li {
            font-size: 0.85rem;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #2d3748;
        }

        .consent-scopes li i {
            color: #38a169;
        }

        .footer-note {
            text-align: center;
            font-size: 0.75rem;
            color: #a0aec0;
            margin-top: 24px;
        }
    </style>
</head>
<body>

    <div class="portal-container">
        <div class="portal-header">
            <h2><i class="fa-solid fa-cloud"></i> DigiLocker</h2>
            <span class="badge-sandbox">Sandbox Mock</span>
        </div>

        <div class="portal-body">
            <div class="sub-logo">
                <i class="fa-solid fa-shield-halved"></i>
            </div>

            <?php if ($step === 'login'): ?>
                <!-- LOGIN STEP -->
                <h3 class="title">Citizen Sign In</h3>
                <p class="subtitle">Sign in to authenticate and link your credentials with your requester application.</p>

                <form action="" method="POST">
                    <input type="hidden" name="step" value="submit_auth">
                    
                    <!-- Prefilled Identifier -->
                    <div class="form-group">
                        <?php if ($auth_type === 'mobile'): ?>
                            <label>Mobile Number (From Application)</label>
                            <div class="input-display">
                                <span>+91 <?php echo htmlspecialchars($identifier_value); ?></span>
                                <i class="fa-solid fa-circle-check" style="color: #38a169;"></i>
                            </div>
                        <?php elseif ($auth_type === 'aadhaar'): ?>
                            <label>Aadhaar Number (From Application)</label>
                            <div class="input-display">
                                <span><?php echo htmlspecialchars(substr($identifier_value, 0, 4) . ' ' . substr($identifier_value, 4, 4) . ' ' . substr($identifier_value, 8)); ?></span>
                                <i class="fa-solid fa-circle-check" style="color: #38a169;"></i>
                            </div>
                        <?php else: ?>
                            <label>PAN Card Number (From Application)</label>
                            <div class="input-display">
                                <span><?php echo htmlspecialchars($identifier_value); ?></span>
                                <i class="fa-solid fa-circle-check" style="color: #38a169;"></i>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Mock PIN code -->
                    <div class="form-group">
                        <label for="security_pin">6-digit Security PIN</label>
                        <input type="password" 
                               id="security_pin" 
                               name="security_pin" 
                               class="input-field" 
                               placeholder="Enter 6-digit PIN (Try 123456)" 
                               maxlength="6" 
                               value="123456"
                               required>
                    </div>

                    <!-- Mock OTP code -->
                    <div class="form-group">
                        <label for="otp">One Time Password (OTP)</label>
                        <input type="text" 
                               id="otp" 
                               name="otp" 
                               class="input-field" 
                               placeholder="Enter 6-digit OTP sent to phone" 
                               maxlength="6" 
                               value="654321"
                               required>
                    </div>

                    <button type="submit" class="btn-primary">Sign In & Authenticate</button>
                    <a href="index.php?error=cancelled" class="btn-secondary" style="display: block; text-align: center; text-decoration: none; box-sizing: border-box;">Cancel</a>
                </form>

            <?php elseif ($step === 'consent'): ?>
                <!-- CONSENT STEP -->
                <h3 class="title">Consent Approval</h3>
                <p class="subtitle">An application wants to connect to your DigiLocker. Please review the permissions requested below.</p>

                <form action="" method="POST">
                    <div class="consent-box">
                        <p><strong>Secure Document Verifier</strong> is requesting access to perform the following operations:</p>
                        <ul class="consent-scopes">
                            <li><i class="fa-solid fa-circle-check"></i> Read profile (Name, DOB, Gender, Profile photo)</li>
                            <li><i class="fa-solid fa-circle-check"></i> View and download issued documents list</li>
                            <li><i class="fa-solid fa-circle-check"></i> Download XML / PDF copies of Aadhaar/PAN</li>
                        </ul>
                    </div>

                    <div style="font-size: 0.8rem; color: #4a5568; margin-bottom: 20px; line-height: 1.4;">
                        By clicking <strong>Allow</strong>, you grant permission to share this data. You can revoke this permission anytime inside your DigiLocker dashboard.
                    </div>

                    <input type="hidden" name="step" value="grant_consent">
                    <button type="submit" class="btn-primary" style="background: #38a169;">Allow (Grant Consent)</button>
                    
                    <button type="submit" name="step" value="deny" class="btn-secondary">Deny Access</button>
                </form>
            <?php endif; ?>

            <div class="footer-note">
                <i class="fa-solid fa-lock"></i> Secured by DigiLocker Sandbox System
            </div>
        </div>
    </div>

</body>
</html>
