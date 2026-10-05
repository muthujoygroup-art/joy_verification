import os
from PIL import Image, ImageDraw, ImageFont

def build_all_presentation_mockups():
    out_dir = "public/assets/mockups"
    os.makedirs(out_dir, exist_ok=True)

    # 1. Super Admin Mockup (From generated image)
    super_admin_gen = r"C:\Users\HP\.gemini\antigravity\brain\91b3f6e2-ad19-4962-8ca6-f271e02fe37b\super_admin_ui_1790956656672.jpg"
    if os.path.exists(super_admin_gen):
        create_browser_frame(super_admin_gen, f"{out_dir}/super_admin_mockup.png", "https://verification.joycorporatesolutions.com/superadmin/console")

    # 2. Company Admin Mockup (From generated image)
    company_admin_gen = r"C:\Users\HP\.gemini\antigravity\brain\91b3f6e2-ad19-4962-8ca6-f271e02fe37b\company_admin_ui_1790956748264.jpg"
    if os.path.exists(company_admin_gen):
        create_browser_frame(company_admin_gen, f"{out_dir}/company_admin_mockup.png", "https://verification.joycorporatesolutions.com/joy-corporate-solutions/company/admin")

    # 3. HR Workstation Mockup (From generated image with Joy Man Power Service logo)
    hr_workstation_gen = r"C:\Users\HP\.gemini\antigravity\brain\91b3f6e2-ad19-4962-8ca6-f271e02fe37b\hr_workstation_ui_1790956785688.jpg"
    if os.path.exists(hr_workstation_gen):
        create_browser_frame(hr_workstation_gen, f"{out_dir}/hr_workstation_mockup.png", "https://verification.joycorporatesolutions.com/joy-man-power-service/hr/agilan/candidates")

    # 4. Generate High-Res Candidate Mobile Mockup
    generate_candidate_mobile_ui(f"{out_dir}/candidate_mobile_mockup.png")

    # 5. Generate High-Res Vendor Studio Mockup
    generate_vendor_studio_ui(f"{out_dir}/vendor_portal_mockup.png")

    # 6. Generate High-Res Master Dossier PDF Mockup with QR
    generate_dossier_pdf_ui(f"{out_dir}/dossier_pdf_mockup.png")

def get_fonts():
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 22)
        font_sub = ImageFont.truetype("arialbd.ttf", 16)
        font_bold = ImageFont.truetype("arialbd.ttf", 14)
        font_regular = ImageFont.truetype("arial.ttf", 13)
        font_small = ImageFont.truetype("arial.ttf", 11)
        font_micro = ImageFont.truetype("arial.ttf", 9)
    except Exception:
        font_title = font_sub = font_bold = font_regular = font_small = font_micro = ImageFont.load_default()
    return font_title, font_sub, font_bold, font_regular, font_small, font_micro

def create_browser_frame(image_path, output_path, url_text):
    img = Image.open(image_path).convert("RGBA")
    w, h = 1200, 750
    header_h = 44
    canvas = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Header bar
    draw.rectangle([(0, 0), (w, header_h)], fill=(241, 245, 249, 255))
    draw.line([(0, header_h), (w, header_h)], fill=(226, 232, 240, 255), width=2)
    
    # 3 dots
    draw.ellipse([(18, 16), (28, 26)], fill=(239, 68, 68, 255))
    draw.ellipse([(36, 16), (46, 26)], fill=(245, 158, 11, 255))
    draw.ellipse([(54, 16), (64, 26)], fill=(16, 185, 129, 255))
    
    # Address bar
    draw.rounded_rectangle([(80, 7), (w - 30, header_h - 7)], radius=6, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    try:
        f_url = ImageFont.truetype("arial.ttf", 13)
    except Exception:
        f_url = ImageFont.load_default()
    draw.text((96, 13), f"🔒  {url_text}", fill=(100, 116, 139, 255), font=f_url)
    
    # Paste resized image
    body_h = h - header_h
    img_res = img.resize((w, body_h), Image.Resampling.LANCZOS)
    canvas.paste(img_res, (0, header_h), img_res)
    
    # Outer subtle border
    draw.rectangle([(0, 0), (w - 1, h - 1)], outline=(203, 213, 225, 255), width=2)
    canvas.save(output_path, "PNG")
    print(f"Generated framed mockup: {output_path}")

def generate_candidate_mobile_ui(output_path):
    w, h = 420, 840
    canvas = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    f_title, f_sub, f_bold, f_regular, f_small, f_micro = get_fonts()

    # Phone Frame
    draw.rounded_rectangle([(4, 4), (w - 4, h - 4)], radius=40, fill=(15, 23, 42, 255), outline=(51, 65, 85, 255), width=4)
    
    # Screen Background
    screen_x, screen_y, screen_w, screen_h = 16, 40, w - 32, h - 80
    draw.rounded_rectangle([(screen_x, screen_y), (screen_x + screen_w, screen_y + screen_h)], radius=24, fill=(248, 250, 252, 255))
    
    # Speaker Notch
    draw.rounded_rectangle([(w//2 - 50, 16), (w//2 + 50, 30)], radius=7, fill=(30, 41, 59, 255))

    # App Header
    draw.rectangle([(screen_x, screen_y), (screen_x + screen_w, screen_y + 60)], fill=(255, 255, 255, 255))
    draw.text((screen_x + 16, screen_y + 12), "JOY TRUE PROFILE", fill=(15, 23, 42, 255), font=f_bold)
    draw.text((screen_x + 16, screen_y + 32), "Candidate Self-Verification Portal", fill=(100, 116, 139, 255), font=f_small)

    # Progress Indicator
    draw.rounded_rectangle([(screen_x + 16, screen_y + 75), (screen_x + screen_w - 16, screen_y + 105)], radius=8, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255))
    draw.text((screen_x + 26, screen_y + 82), "✔ Step 2 of 4: Identity & e-KYC Verification", fill=(5, 150, 105, 255), font=f_bold)

    # PIN Card
    draw.rounded_rectangle([(screen_x + 16, screen_y + 118), (screen_x + screen_w - 16, screen_y + 175)], radius=12, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255))
    draw.text((screen_x + 28, screen_y + 128), "🔒 Security PIN Authentication", fill=(15, 23, 42, 255), font=f_bold)
    draw.text((screen_x + 28, screen_y + 148), "PIN Verified Successfully: • • • • (PIN: 9402)", fill=(5, 150, 105, 255), font=f_small)

    # Aadhaar Card
    draw.rounded_rectangle([(screen_x + 16, screen_y + 188), (screen_x + screen_w - 16, screen_y + 300)], radius=12, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255))
    draw.text((screen_x + 28, screen_y + 200), "🆔 UIDAI Aadhaar OTP e-KYC", fill=(15, 23, 42, 255), font=f_bold)
    draw.text((screen_x + 28, screen_y + 224), "Aadhaar Number: XXXX-XXXX-5829", fill=(71, 85, 105, 255), font=f_regular)
    draw.rounded_rectangle([(screen_x + 28, screen_y + 250), (screen_x + screen_w - 28, screen_y + 285)], radius=6, fill=(240, 253, 244, 255), outline=(187, 247, 208, 255))
    draw.text((screen_x + 40, screen_y + 258), "✔ Aadhaar Verified & Demographics Matched", fill=(5, 150, 105, 255), font=f_small)

    # DigiLocker Card
    draw.rounded_rectangle([(screen_x + 16, screen_y + 312), (screen_x + screen_w - 16, screen_y + 420)], radius=12, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255))
    draw.text((screen_x + 28, screen_y + 324), "🎓 DigiLocker Degree & Marksheet", fill=(15, 23, 42, 255), font=f_bold)
    draw.text((screen_x + 28, screen_y + 348), "B.Tech Computer Science (Anna Univ)", fill=(71, 85, 105, 255), font=f_regular)
    draw.rounded_rectangle([(screen_x + 28, screen_y + 372), (screen_x + screen_w - 28, screen_y + 406)], radius=6, fill=(239, 246, 255, 255), outline=(191, 219, 254, 255))
    draw.text((screen_x + 40, screen_y + 380), "✔ Original DigiLocker Degree Certificate Fetched", fill=(37, 99, 235, 255), font=f_small)

    # 3D Selfie Liveness Card
    draw.rounded_rectangle([(screen_x + 16, screen_y + 432), (screen_x + screen_w - 16, screen_y + 575)], radius=12, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255))
    draw.text((screen_x + 28, screen_y + 444), "📸 3D Live Camera Selfie Matching", fill=(15, 23, 42, 255), font=f_bold)
    draw.ellipse([(w//2 - 40, screen_y + 475), (w//2 + 40, screen_y + 545)], fill=(241, 245, 249, 255), outline=(5, 150, 105, 255), width=2)
    draw.text((w//2 - 24, screen_y + 500), "👤 LIVE", fill=(5, 150, 105, 255), font=f_bold)
    draw.text((screen_x + 28, screen_y + 552), "Liveness: Straight ✔  Left ✔  Right ✔", fill=(5, 150, 105, 255), font=f_small)

    # Submit Button
    draw.rounded_rectangle([(screen_x + 16, screen_y + 595), (screen_x + screen_w - 16, screen_y + 645)], radius=12, fill=(5, 150, 105, 255))
    draw.text((w//2 - 75, screen_y + 610), "Submit & Verify Dossier ➔", fill=(255, 255, 255, 255), font=f_bold)

    # Home indicator
    draw.rounded_rectangle([(w//2 - 60, h - 22), (w//2 + 60, h - 17)], radius=2, fill=(148, 163, 184, 255))
    canvas.save(output_path, "PNG")
    print(f"Generated candidate mobile mockup: {output_path}")

def generate_vendor_studio_ui(output_path):
    w, h = 1200, 750
    header_h = 44
    canvas = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    f_title, f_sub, f_bold, f_regular, f_small, f_micro = get_fonts()

    # Browser Header
    draw.rectangle([(0, 0), (w, header_h)], fill=(241, 245, 249, 255))
    draw.line([(0, header_h), (w, header_h)], fill=(226, 232, 240, 255), width=2)
    draw.ellipse([(18, 16), (28, 26)], fill=(239, 68, 68, 255))
    draw.ellipse([(36, 16), (46, 26)], fill=(245, 158, 11, 255))
    draw.ellipse([(54, 16), (64, 26)], fill=(16, 185, 129, 255))
    draw.rounded_rectangle([(80, 7), (w - 30, header_h - 7)], radius=6, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    draw.text((96, 13), "🔒  https://verification.joycorporatesolutions.com/vendor-verification/studio", fill=(100, 116, 139, 255), font=f_regular)

    # Content Area
    draw.rectangle([(0, header_h), (w, h)], fill=(248, 250, 252, 255))

    # Top Banner
    draw.rounded_rectangle([(30, header_h + 20), (w - 30, header_h + 90)], radius=12, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255))
    draw.text((50, header_h + 35), "🏢 Vendor & Contractor Due Diligence Studio", fill=(15, 23, 42, 255), font=f_title)
    draw.text((50, header_h + 65), "11 Statutory Verification Rails • CLRA Form XVI Labor Compliance • Anti-Ghost Worker Sync", fill=(100, 116, 139, 255), font=f_regular)

    # 6 Grid Cards
    cards = [
        ("🏛️ MCA Corporate CIN", "CIN: U74999KA2026PTC192841", "Status: Active & Compliant • Ministry of Corporate Affairs", (5, 150, 105, 255), (236, 253, 245, 255)),
        ("🧾 GSTIN Tax Filing History", "GSTIN: 33AABCT1332L1Z2", "Status: Active • GSTR-3B & GSTR-1 Filed on Time (3 Yrs)", (37, 99, 235, 255), (239, 246, 255, 255)),
        ("💳 Corporate PAN Validation", "PAN: AABCT1332L", "Status: Valid • Legal Entity Trade Name 100% Matched", (124, 58, 237, 255), (245, 243, 255, 255)),
        ("🏭 MSME Udyam Registration", "Udyam: UDYAM-TN-03-0019284", "Status: Verified • Enterprise Category: Small Manufacturing", (217, 119, 6, 255), (254, 243, 199, 255)),
        ("🏦 NPCI IMPS Bank Penny Drop", "A/C: 987654321098 • IFSC: SBIN0001234", "Status: ₹1 Penny Drop Success • Registered Name Matched", (5, 150, 105, 255), (236, 253, 245, 255)),
        ("👷 CLRA Form XVI Labor Muster", "Contractor Deployed Workforce: 48 Workers", "Status: 100% PF & ESIC Verified • Zero Ghost Workers", (37, 99, 235, 255), (239, 246, 255, 255))
    ]

    for idx, (title, num, sub, c_clr, c_bg) in enumerate(cards):
        row = idx // 3
        col = idx % 3
        cx = 30 + col * 386
        cy = header_h + 110 + row * 180
        
        draw.rounded_rectangle([(cx, cy), (cx + 366, cy + 160)], radius=12, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
        
        # Pill inside card
        draw.rounded_rectangle([(cx + 16, cy + 16), (cx + 350, cy + 50)], radius=8, fill=c_bg)
        draw.text((cx + 26, cy + 24), title, fill=c_clr, font=f_bold)
        
        draw.text((cx + 20, cy + 68), num, fill=(15, 23, 42, 255), font=f_bold)
        draw.text((cx + 20, cy + 96), sub, fill=(71, 85, 105, 255), font=f_small)
        
        # Verified green tag
        draw.rounded_rectangle([(cx + 20, cy + 124), (cx + 120, cy + 148)], radius=6, fill=(240, 253, 244, 255), outline=(187, 247, 208, 255))
        draw.text((cx + 28, cy + 130), "✔ VERIFIED", fill=(5, 150, 105, 255), font=f_micro)

    # Outer border
    draw.rectangle([(0, 0), (w - 1, h - 1)], outline=(203, 213, 225, 255), width=2)
    canvas.save(output_path, "PNG")
    print(f"Generated vendor studio mockup: {output_path}")

def generate_dossier_pdf_ui(output_path):
    w, h = 1200, 750
    header_h = 44
    canvas = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    f_title, f_sub, f_bold, f_regular, f_small, f_micro = get_fonts()

    # Browser Header
    draw.rectangle([(0, 0), (w, header_h)], fill=(241, 245, 249, 255))
    draw.line([(0, header_h), (w, header_h)], fill=(226, 232, 240, 255), width=2)
    draw.ellipse([(18, 16), (28, 26)], fill=(239, 68, 68, 255))
    draw.ellipse([(36, 16), (46, 26)], fill=(245, 158, 11, 255))
    draw.ellipse([(54, 16), (64, 26)], fill=(16, 185, 129, 255))
    draw.rounded_rectangle([(80, 7), (w - 30, header_h - 7)], radius=6, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    draw.text((96, 13), "🔒  https://verification.joycorporatesolutions.com/dossier/preview/TOK_JOY_EMP_2026", fill=(100, 116, 139, 255), font=f_regular)

    # PDF Canvas Sheet (Centered White Sheet with Shadow)
    draw.rectangle([(0, header_h), (w, h)], fill=(241, 245, 249, 255))
    sheet_x, sheet_y, sheet_w, sheet_h = 160, header_h + 20, 880, h - header_h - 40
    draw.rounded_rectangle([(sheet_x, sheet_y), (sheet_x + sheet_w, sheet_y + sheet_h)], radius=12, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)

    # Top Corporate Logo Header
    draw.rectangle([(sheet_x, sheet_y), (sheet_x + sheet_w, sheet_y + 80)], fill=(248, 250, 252, 255))
    draw.text((sheet_x + 30, sheet_y + 18), "JOY CORPORATE SOLUTIONS PRIVATE LIMITED", fill=(15, 23, 42, 255), font=f_title)
    draw.text((sheet_x + 30, sheet_y + 48), "OFFICIAL EMPLOYEE BACKGROUND VERIFICATION DOSSIER", fill=(5, 150, 105, 255), font=f_bold)
    draw.text((sheet_x + sheet_w - 200, sheet_y + 25), "CERTIFIED RECORD", fill=(37, 99, 235, 255), font=f_bold)
    draw.text((sheet_x + sheet_w - 200, sheet_y + 45), "Dossier ID: #JOY-2026-8921", fill=(100, 116, 139, 255), font=f_small)

    # Candidate Profile Section
    draw.ellipse([(sheet_x + 30, sheet_y + 100), (sheet_x + 110, sheet_y + 180)], fill=(241, 245, 249, 255), outline=(5, 150, 105, 255), width=2)
    draw.text((sheet_x + 48, sheet_y + 130), "PHOTO", fill=(100, 116, 139, 255), font=f_small)

    draw.text((sheet_x + 130, sheet_y + 105), "Candidate: Aarav Sharma", fill=(15, 23, 42, 255), font=f_sub)
    draw.text((sheet_x + 130, sheet_y + 130), "Designation: Senior Software Engineer • Dept: Engineering", fill=(71, 85, 105, 255), font=f_regular)
    draw.text((sheet_x + 130, sheet_y + 155), "Verification Status: 100% VERIFIED & COMPLIANT", fill=(5, 150, 105, 255), font=f_bold)

    # 4 Check Summary Badges
    badges = [
        ("✔ UIDAI Aadhaar", "Masked: XXXX-XXXX-5829 • OTP Verified"),
        ("✔ NSDL PAN Card", "PAN: ABCPS1234F • Name 100% Match"),
        ("✔ Bank Penny Drop", "IMPS Penny Drop • SBI A/C Verified"),
        ("✔ EPFO Moonlighting Radar", "UAN History Clear • No Dual Employment")
    ]
    for b_idx, (b_t, b_s) in enumerate(badges):
        bx = sheet_x + 30 + (b_idx % 2) * 420
        by = sheet_y + 200 + (b_idx // 2) * 75
        draw.rounded_rectangle([(bx, by), (bx + 400, by + 65)], radius=8, fill=(248, 250, 252, 255), outline=(226, 232, 240, 255))
        draw.text((bx + 16, by + 12), b_t, fill=(5, 150, 105, 255), font=f_bold)
        draw.text((bx + 16, by + 36), b_s, fill=(71, 85, 105, 255), font=f_small)

    # Scannable QR Code Box (Right Bottom)
    qr_x, qr_y, qr_size = sheet_x + sheet_w - 220, sheet_y + sheet_h - 180, 140
    draw.rectangle([(qr_x, qr_y), (qr_x + qr_size, qr_y + qr_size)], fill=(248, 250, 252, 255), outline=(15, 23, 42, 255), width=2)
    # Draw simple QR pattern mock
    draw.rectangle([(qr_x + 15, qr_y + 15), (qr_x + 45, qr_y + 45)], fill=(15, 23, 42, 255))
    draw.rectangle([(qr_x + qr_size - 45, qr_y + 15), (qr_x + qr_size - 15, qr_y + 45)], fill=(15, 23, 42, 255))
    draw.rectangle([(qr_x + 15, qr_y + qr_size - 45), (qr_x + 45, qr_y + qr_size - 15)], fill=(15, 23, 42, 255))
    draw.rectangle([(qr_x + 55, qr_y + 55), (qr_x + 85, qr_y + 85)], fill=(5, 150, 105, 255))
    draw.text((qr_x + 15, qr_y + qr_size + 8), "📲 Scan to Verify Dossier", fill=(15, 23, 42, 255), font=f_small)

    # Cryptographic Seal Stamp (Left Bottom)
    draw.text((sheet_x + 30, sheet_y + sheet_h - 120), "🔐 Cryptographic SHA-256 Authenticity Stamp:", fill=(15, 23, 42, 255), font=f_bold)
    draw.text((sheet_x + 30, sheet_y + sheet_h - 95), "SHA256: 8f4e2b9c7a1d5e6f3b0c8a2e4d6f8a1c9e3b7a5d1f2e4c6a8b0d2e4f6a8b0c2", fill=(100, 116, 139, 255), font=f_micro)
    draw.text((sheet_x + 30, sheet_y + sheet_h - 65), "DPDP Act 2023 Digital Consent Logged • Certified by Joy True Profile Engine", fill=(5, 150, 105, 255), font=f_small)

    # Outer border
    draw.rectangle([(0, 0), (w - 1, h - 1)], outline=(203, 213, 225, 255), width=2)
    canvas.save(output_path, "PNG")
    print(f"Generated dossier PDF mockup: {output_path}")

if __name__ == "__main__":
    build_all_presentation_mockups()
