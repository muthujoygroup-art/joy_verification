<?php
require_once 'config.php';

// Check if operator is authenticated
if (empty($_SESSION['admin_logged_in'])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure DigiLocker Document Verification</title>
    <link rel="stylesheet" href="style.css">
    <!-- FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Background Glows -->
    <div class="circle-bg circle-1"></div>
    <div class="circle-bg circle-2"></div>

    <div class="container">
        <!-- Environment Indicator Badge -->
        <?php if (MOCK_MODE): ?>
            <span class="mode-badge mode-mock"><i class="fa-solid fa-flask"></i> Mock Mode</span>
        <?php elseif (defined('DIGILOCKER_ENVIRONMENT') && DIGILOCKER_ENVIRONMENT === 'PRODUCTION'): ?>
            <span class="mode-badge mode-live" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981;"><i class="fa-solid fa-circle-check"></i> Production</span>
        <?php else: ?>
            <span class="mode-badge mode-live" style="background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.4); color: #818cf8;"><i class="fa-solid fa-flask-vial"></i> Sandbox</span>
        <?php endif; ?>

        <div class="header">
            <div class="logo-container">
                <!-- Fallback text and logo icons if images are blocked -->
                <span class="app-badge">DigiLocker Integration</span>
                <a href="login.php?action=logout" class="logout-btn"><i class="fa-solid fa-power-off"></i> Logout</a>
            </div>
            <h1>Document Verification</h1>
            <p class="subtitle">Access and verify your official government documents securely via DigiLocker.</p>
        </div>

        <!-- User Type Toggle Selector -->
        <div class="user-type-selector">
            <span class="selector-label">Verification Target</span>
            <div class="selector-group">
                <button type="button" id="btn-user-individual" class="selector-btn active" onclick="switchUserType('individual')">
                    <i class="fa-solid fa-user"></i> Individual (Citizen)
                </button>
                <button type="button" id="btn-user-company" class="selector-btn" onclick="switchUserType('company')">
                    <i class="fa-solid fa-building"></i> Company (Entity)
                </button>
            </div>
        </div>

        <!-- tab selectors -->
        <div class="tabs">
            <button class="tab-btn active" onclick="switchTab('mobile')">
                <i class="fa-solid fa-mobile-screen-button"></i> Mobile
            </button>
            <button class="tab-btn" onclick="switchTab('aadhaar')">
                <i class="fa-solid fa-id-card"></i> Aadhaar
            </button>
            <button class="tab-btn" onclick="switchTab('pan')">
                <i class="fa-solid fa-credit-card"></i> PAN Card
            </button>
        </div>

        <!-- Action Form -->
        <form action="redirect.php" method="POST" onsubmit="return validateForm()">
            <!-- Hidden fields to track selection type -->
            <input type="hidden" name="auth_type" id="auth_type" value="mobile">
            <input type="hidden" name="user_type" id="user_type" value="individual">

            <!-- Mobile Verification Form -->
            <div id="form-mobile" class="form-group active">
                <label for="mobile_number">Mobile Number</label>
                <div class="input-container">
                    <span class="input-icon"><i class="fa-solid fa-phone"></i></span>
                    <input type="tel" 
                           id="mobile_number" 
                           name="mobile_number" 
                           class="input-field" 
                           placeholder="Enter 10-digit mobile number" 
                           maxlength="10"
                           pattern="[6-9][0-9]{9}">
                </div>
                <p class="subtitle" style="font-size: 0.75rem; margin-top: 6px;">Must be the mobile number registered with Aadhaar/DigiLocker.</p>
            </div>

            <!-- Aadhaar Verification Form -->
            <div id="form-aadhaar" class="form-group">
                <label for="aadhaar_number">Aadhaar Number</label>
                <div class="input-container">
                    <span class="input-icon"><i class="fa-solid fa-fingerprint"></i></span>
                    <input type="text" 
                           id="aadhaar_number" 
                           name="aadhaar_number" 
                           class="input-field" 
                           placeholder="Enter 12-digit Aadhaar number" 
                           maxlength="14"
                           onkeyup="formatAadhaar(this)">
                </div>
                <p class="subtitle" style="font-size: 0.75rem; margin-top: 6px;">Your Aadhaar data will remain secure and encrypted.</p>
            </div>

            <!-- PAN Verification Form -->
            <div id="form-pan" class="form-group">
                <label for="pan_number">PAN Number</label>
                <div class="input-container">
                    <span class="input-icon"><i class="fa-solid fa-address-card"></i></span>
                    <input type="text" 
                           id="pan_number" 
                           name="pan_number" 
                           class="input-field" 
                           placeholder="Enter 10-character PAN (e.g. ABCDE1234F)" 
                           maxlength="10"
                           style="text-transform: uppercase;">
                </div>
                <p class="subtitle" style="font-size: 0.75rem; margin-top: 6px;">Your Permanent Account Number (PAN) will be verified directly.</p>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn-submit">
                <span>Continue with DigiLocker</span>
                <i class="fa-solid fa-arrow-right"></i>
            </button>
        </form>
    </div>

    <script>
        function switchUserType(type) {
            document.getElementById('user_type').value = type;
            
            const btnIndividual = document.getElementById('btn-user-individual');
            const btnCompany = document.getElementById('btn-user-company');
            
            const tabMobile = document.querySelector('.tab-btn:nth-child(1)');
            const tabAadhaar = document.querySelector('.tab-btn:nth-child(2)');
            const tabPan = document.querySelector('.tab-btn:nth-child(3)');
            
            const labelPan = document.querySelector('label[for="pan_number"]');
            const placeholderPan = document.getElementById('pan_number');
            
            if (type === 'company') {
                btnCompany.classList.add('active');
                btnIndividual.classList.remove('active');
                
                // Hide Mobile and Aadhaar tabs for company, auto-select PAN
                tabMobile.style.display = 'none';
                tabAadhaar.style.display = 'none';
                switchTab('pan');
                
                // Update PAN fields for organization context
                labelPan.innerText = "Organization PAN Number";
                placeholderPan.placeholder = "Enter 10-character Company/Firm PAN (e.g. AAACP1234Z)";
            } else {
                btnIndividual.classList.add('active');
                btnCompany.classList.remove('active');
                
                // Show Mobile and Aadhaar tabs for individuals, auto-select Mobile
                tabMobile.style.display = 'flex';
                tabAadhaar.style.display = 'flex';
                switchTab('mobile');
                
                // Reset PAN fields
                labelPan.innerText = "PAN Number";
                placeholderPan.placeholder = "Enter 10-character PAN (e.g. ABCDE1234F)";
            }
        }

        function switchTab(type) {
            // Update hidden input value
            document.getElementById('auth_type').value = type;

            // Update tab button classes
            const buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Find clicked button
            const activeIndex = (type === 'mobile') ? 0 : (type === 'aadhaar') ? 1 : 2;
            buttons[activeIndex].classList.add('active');

            // Toggle form fields
            const forms = document.querySelectorAll('.form-group');
            forms.forEach(form => form.classList.remove('active'));
            document.getElementById(`form-${type}`).classList.add('active');
        }

        // Format Aadhaar input with spaces: XXXX XXXX XXXX
        function formatAadhaar(input) {
            let val = input.value.replace(/\D/g, ''); // strip non-digits
            let formatted = '';
            for (let i = 0; i < val.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += val[i];
            }
            input.value = formatted.substring(0, 14); // Limit to 12 digits + 2 spaces
        }

        // Simple form validation before submission
        function validateForm() {
            const type = document.getElementById('auth_type').value;
            
            if (type === 'mobile') {
                const mobile = document.getElementById('mobile_number').value.trim();
                if (!/^[6-9]\d{9}$/.test(mobile)) {
                    alert('Please enter a valid 10-digit mobile number starting with 6-9.');
                    return false;
                }
            } else if (type === 'aadhaar') {
                const aadhaar = document.getElementById('aadhaar_number').value.replace(/\s/g, '');
                if (aadhaar.length !== 12 || !/^\d{12}$/.test(aadhaar)) {
                    alert('Please enter a valid 12-digit Aadhaar number.');
                    return false;
                }
            } else if (type === 'pan') {
                const pan = document.getElementById('pan_number').value.trim().toUpperCase();
                if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
                    alert('Please enter a valid 10-character PAN number.');
                    return false;
                }
            }
            return true;
        }
    </script>
</body>
</html>
