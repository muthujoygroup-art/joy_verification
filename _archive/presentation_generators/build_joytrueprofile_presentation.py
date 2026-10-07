import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml import parse_xml

def create_joytrueprofile_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions: 13.333" x 7.5"
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Global Font Standard
    FONT = "Times New Roman"

    # =========================================================================
    # PREMIUM 100% LIGHT THEME COLOR PALETTE
    # =========================================================================
    BG_LIGHT = RGBColor(248, 250, 252)       # #F8FAFC (Soft clean canvas)
    CARD_WHITE = RGBColor(255, 255, 255)     # #FFFFFF (Crisp white card)
    CARD_BORDER = RGBColor(226, 232, 240)    # #E2E8F0 (Subtle card border)
    
    TEXT_TITLE = RGBColor(15, 23, 42)        # #0F172A (Deep Charcoal Navy)
    TEXT_BODY = RGBColor(30, 41, 59)         # #1E293B (Clean readable slate)
    TEXT_MUTED = RGBColor(100, 116, 139)     # #64748B (Soft secondary)

    # Accent Colors
    EMERALD = RGBColor(5, 150, 105)          # #059669 (Primary Action Accent)
    EMERALD_BG = RGBColor(236, 253, 245)     # #ECFDF5 (Soft Mint Pill)
    EMERALD_BORDER = RGBColor(167, 243, 208) # #A7F3D0

    ROYAL_BLUE = RGBColor(37, 99, 235)       # #2563EB (Tech / Admin Accent)
    BLUE_BG = RGBColor(239, 246, 255)        # #EFF6FF
    BLUE_BORDER = RGBColor(191, 219, 254)    # #BFDBFE

    PURPLE = RGBColor(124, 58, 237)          # #7C3AED (Governance Accent)
    PURPLE_BG = RGBColor(245, 243, 255)      # #F5F3FF
    PURPLE_BORDER = RGBColor(221, 214, 254)  # #DDD6FE

    AMBER = RGBColor(217, 119, 6)            # #D97706 (Candidate / Pricing Accent)
    AMBER_BG = RGBColor(254, 243, 199)       # #FEF3C7
    AMBER_BORDER = RGBColor(253, 230, 138)   # #FDE68A

    RED_ALERT = RGBColor(220, 38, 38)        # #DC2626
    RED_BG = RGBColor(254, 242, 242)         # #FEF2F2
    RED_BORDER = RGBColor(254, 202, 202)     # #FECACA

    # Real Authentic Project Screenshots & Emblems
    logo_path = os.path.abspath("public/assets/logos/joy_true_profile_shield_emblem.png")
    mock_super_admin = os.path.abspath("public/assets/project_screenshots/real_super_admin_portal.png")
    mock_company_admin = os.path.abspath("public/assets/project_screenshots/real_company_admin_portal.png")
    mock_hr_workstation = os.path.abspath("public/assets/project_screenshots/real_hr_workstation_portal.png")
    mock_candidate_mobile = os.path.abspath("public/assets/project_screenshots/real_candidate_portal.png")
    mock_vendor_portal = os.path.abspath("public/assets/project_screenshots/real_vendor_portal.png")
    mock_dossier_pdf = os.path.abspath("public/assets/project_screenshots/real_project_certificate.png")

    def apply_transition(slide):
        """Adds a native smooth fade slide transition in PowerPoint"""
        try:
            trans_xml = parse_xml('<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:fade/></p:transition>')
            slide.element.append(trans_xml)
        except Exception:
            pass

    def create_slide_base(prs):
        """Creates a clean light slide with background canvas and smooth transition"""
        slide = prs.slides.add_slide(blank_layout)
        apply_transition(slide)
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_LIGHT
        bg.line.fill.background()
        return slide

    def add_header(slide, title, category):
        # Top Accent Line
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.08))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = EMERALD
        top_bar.line.fill.background()

        # Category Pill (5.0" width ensures single line fit without text wrapping)
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.30), Inches(5.0), Inches(0.34))
        pill.fill.solid()
        pill.fill.fore_color.rgb = EMERALD_BG
        pill.line.color.rgb = EMERALD_BORDER
        pill.line.width = Pt(1)
        tf_pill = pill.text_frame
        p_p = tf_pill.paragraphs[0]
        p_p.alignment = PP_ALIGN.CENTER
        r_p = p_p.add_run()
        r_p.text = category.upper()
        r_p.font.name = FONT
        r_p.font.size = Pt(10)
        r_p.font.bold = True
        r_p.font.color.rgb = EMERALD

        # Main Slide Title
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.70), Inches(11.733), Inches(0.55))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.LEFT
        r = p.add_run()
        r.text = title
        r.font.name = FONT
        r.font.size = Pt(21)
        r.font.bold = True
        r.font.color.rgb = TEXT_TITLE

    def add_footer(slide, current, total=17):
        # Footer Divider Line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.92), Inches(11.733), Inches(0.015))
        line.fill.solid()
        line.fill.fore_color.rgb = CARD_BORDER
        line.line.fill.background()

        # Footer Left: Brand & Division
        tb_l = slide.shapes.add_textbox(Inches(0.8), Inches(6.98), Inches(8.5), Inches(0.35))
        tf_l = tb_l.text_frame
        p_l = tf_l.paragraphs[0]
        r_l = p_l.add_run()
        r_l.text = "JOY TRUE PROFILE  •  Next-Gen Workforce & Vendor Verification  •  Confidential Enterprise Presentation"
        r_l.font.name = FONT
        r_l.font.size = Pt(9.5)
        r_l.font.color.rgb = TEXT_MUTED

        # Footer Right: Slide Counter
        tb_r = slide.shapes.add_textbox(Inches(10.5), Inches(6.98), Inches(2.033), Inches(0.35))
        tf_r = tb_r.text_frame
        p_r = tf_r.paragraphs[0]
        p_r.alignment = PP_ALIGN.RIGHT
        r_r = p_r.add_run()
        r_r.text = f"{current} / {total}"
        r_r.font.name = FONT
        r_r.font.size = Pt(10)
        r_r.font.bold = True
        r_r.font.color.rgb = EMERALD

    def add_card(slide, left, top, width, height, bg_color=CARD_WHITE, border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)
        return card

    # =========================================================================
    # SLIDE 1: COVER SLIDE (Hero Deck Title)
    # =========================================================================
    s1 = create_slide_base(prs)

    # Top Brand Ribbon
    top_bar1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_bar1.fill.solid()
    top_bar1.fill.fore_color.rgb = EMERALD
    top_bar1.line.fill.background()

    # Main Center White Card
    add_card(s1, 0.8, 0.75, 11.733, 6.0, bg_color=CARD_WHITE, border_color=CARD_BORDER)

    # Logo Emblem
    if os.path.exists(logo_path):
        s1.shapes.add_picture(logo_path, Inches(5.916), Inches(1.1), width=Inches(1.5))

    # Title & Subtitle Box
    tb1_t = s1.shapes.add_textbox(Inches(1.0), Inches(2.7), Inches(11.333), Inches(1.8))
    tf1_t = tb1_t.text_frame
    tf1_t.word_wrap = True

    p1 = tf1_t.paragraphs[0]
    p1.alignment = PP_ALIGN.CENTER
    r1 = p1.add_run()
    r1.text = "JOY TRUE PROFILE"
    r1.font.name = FONT
    r1.font.size = Pt(38)
    r1.font.bold = True
    r1.font.color.rgb = TEXT_TITLE

    p2 = tf1_t.add_paragraph()
    p2.space_before = Pt(8)
    p2.alignment = PP_ALIGN.CENTER
    r2 = p2.add_run()
    r2.text = "Next-Generation Automated Workforce & Vendor Verification Platform"
    r2.font.name = FONT
    r2.font.size = Pt(17)
    r2.font.bold = True
    r2.font.color.rgb = ROYAL_BLUE

    p3 = tf1_t.add_paragraph()
    p3.space_before = Pt(6)
    p3.alignment = PP_ALIGN.CENTER
    r3 = p3.add_run()
    r3.text = "Sub-45-Second Direct Government Verification • 100% Tamper-Proof • Frictionless Digital Trust"
    r3.font.name = FONT
    r3.font.size = Pt(12)
    r3.font.color.rgb = TEXT_MUTED

    # 4 Feature Pills
    pills = [
        ("⚡ Sub-45-Sec Speed", EMERALD_BG, EMERALD_BORDER, EMERALD),
        ("🔒 100% DPDP 2023 & ISO", BLUE_BG, BLUE_BORDER, ROYAL_BLUE),
        ("🏛️ Direct Govt APIs", PURPLE_BG, PURPLE_BORDER, PURPLE),
        ("📜 Tamper-Proof Cert ID", AMBER_BG, AMBER_BORDER, AMBER)
    ]
    for idx, (label, bg, border, txt_clr) in enumerate(pills):
        px = 1.3 + idx * 2.75
        pill_shape = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(px), Inches(4.75), Inches(2.55), Inches(0.55))
        pill_shape.fill.solid()
        pill_shape.fill.fore_color.rgb = bg
        pill_shape.line.color.rgb = border
        pill_shape.line.width = Pt(1)
        tf_ps = pill_shape.text_frame
        p_ps = tf_ps.paragraphs[0]
        p_ps.alignment = PP_ALIGN.CENTER
        r_ps = p_ps.add_run()
        r_ps.text = label
        r_ps.font.name = FONT
        r_ps.font.size = Pt(10.5)
        r_ps.font.bold = True
        r_ps.font.color.rgb = txt_clr

    # Enterprise Footer Tag
    tb1_b = s1.shapes.add_textbox(Inches(1.0), Inches(5.8), Inches(11.333), Inches(0.6))
    tf1_b = tb1_b.text_frame
    p_b = tf1_b.paragraphs[0]
    p_b.alignment = PP_ALIGN.CENTER
    r_b = p_b.add_run()
    r_b.text = "JOY CORPORATE SOLUTIONS PRIVATE LIMITED  •  ENTERPRISE ARCHITECTURE DECK 2026"
    r_b.font.name = FONT
    r_b.font.size = Pt(10.5)
    r_b.font.bold = True
    r_b.font.color.rgb = TEXT_MUTED

    add_footer(s1, 1, 17)

    # =========================================================================
    # SLIDE 2: THE PROBLEM STATEMENT
    # =========================================================================
    s2 = create_slide_base(prs)
    add_header(s2, "The Problem: The Hidden Crisis in Manual Verification", "The Problem Statement")

    problems = [
        ("⏳ Painful Delays (2-3 Weeks)", [
            ("Slow Turnaround:", "Traditional manual checks take 14 to 21 business days."),
            ("Lost Candidates:", "Over 35% of top candidates drop off while waiting for clearance."),
            ("Recruiter Burden:", "HR spends endless hours manually chasing documents.")
        ], RED_ALERT, RED_BG, RED_BORDER),
        ("⚠️ Fake & Altered Documents", [
            ("Counterfeit Papers:", "High rate of forged experience letters and marksheets."),
            ("Undetected Moonlighting:", "Dual employment goes completely unnoticed in manual review."),
            ("Visual Check Failure:", "Human eyes cannot detect digitally edited PDF documents.")
        ], AMBER, AMBER_BG, AMBER_BORDER),
        ("💸 High Cost & Paperwork", [
            ("Expensive Agencies:", "High per-candidate fees paid to manual agency vendors."),
            ("Heavy Physical Load:", "Printing, scanning, physical filing, and courier expenses."),
            ("Zero Real-Time Tracking:", "Recruiters cannot see live progress of ongoing verifications.")
        ], ROYAL_BLUE, BLUE_BG, BLUE_BORDER),
        ("⚖️ Severe Compliance Risks", [
            ("Contractor Violations:", "Unverified third-party vendor labor risks heavy CLRA fines."),
            ("Data Privacy Breach:", "Handling unencrypted physical documents violates DPDP Act 2023."),
            ("Legal Liability:", "Lack of cryptographic audit trail leaves enterprise exposed.")
        ], PURPLE, PURPLE_BG, PURPLE_BORDER)
    ]

    for idx, (p_title, p_items, clr, bg, border) in enumerate(problems):
        cx = 0.8 + idx * 2.95
        add_card(s2, cx, 1.45, 2.85, 4.2, bg_color=CARD_WHITE, border_color=border)
        
        # Header Box
        hb = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.1), Inches(1.55), Inches(2.65), Inches(0.6))
        hb.fill.solid()
        hb.fill.fore_color.rgb = bg
        hb.line.color.rgb = border
        hb.line.width = Pt(1)
        tf_hb = hb.text_frame
        tf_hb.word_wrap = True
        p_h = tf_hb.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        r_h = p_h.add_run()
        r_h.text = p_title
        r_h.font.name = FONT
        r_h.font.size = Pt(10.5)
        r_h.font.bold = True
        r_h.font.color.rgb = clr

        # Items
        tb_b = s2.shapes.add_textbox(Inches(cx + 0.1), Inches(2.25), Inches(2.65), Inches(3.3))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for b_idx, (head, desc) in enumerate(p_items):
            p = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p.space_before = Pt(6)
            r1 = p.add_run()
            r1.text = f"• {head} "
            r1.font.name = FONT
            r1.font.size = Pt(9.5)
            r1.font.bold = True
            r1.font.color.rgb = TEXT_TITLE
            r2 = p.add_run()
            r2.text = desc
            r2.font.name = FONT
            r2.font.size = Pt(9)
            r2.font.color.rgb = TEXT_BODY

    # Bottom Impact Callout Card
    add_card(s2, 0.8, 5.8, 11.733, 0.95, bg_color=RED_BG, border_color=RED_BORDER)
    tb2_bot = s2.shapes.add_textbox(Inches(1.0), Inches(5.85), Inches(11.333), Inches(0.85))
    tf2_bot = tb2_bot.text_frame
    tf2_bot.word_wrap = True
    p_bot1 = tf2_bot.paragraphs[0]
    r_bot1 = p_bot1.add_run()
    r_bot1.text = "🚨 Critical Industry Bottleneck: "
    r_bot1.font.name = FONT
    r_bot1.font.size = Pt(11)
    r_bot1.font.bold = True
    r_bot1.font.color.rgb = RED_ALERT
    r_bot2 = p_bot1.add_run()
    r_bot2.text = "Manual verification wastes up to 70% of HR recruiter time on manual document follow-ups, physical phone calls, and error-prone checks — directly causing hiring drop-offs and compliance risks."
    r_bot2.font.name = FONT
    r_bot2.font.size = Pt(10.5)
    r_bot2.font.color.rgb = TEXT_BODY

    add_footer(s2, 2, 17)

    # =========================================================================
    # SLIDE 3: THE MODERN SOLUTION
    # =========================================================================
    s3 = create_slide_base(prs)
    add_header(s3, "JOY TRUE PROFILE: The Modern Automated Solution", "The Solution Architecture")

    # Left Card: Core Capabilities
    add_card(s3, 0.8, 1.4, 5.7, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb3_l = s3.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.3), Inches(5.0))
    tf3_l = tb3_l.text_frame
    tf3_l.word_wrap = True

    p = tf3_l.paragraphs[0]
    r = p.add_run()
    r.text = "💡 NEXT-GEN AUTOMATED VERIFICATION ENGINE"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    sol_points = [
        ("Direct Government API Link:", "Directly linked to UIDAI, NSDL, EPFO, DigiLocker, and Court registries for sub-45-second live checks."),
        ("Frictionless WhatsApp Magic Links:", "Candidates receive automated WhatsApp invitation links with 4-digit security PINs for easy smartphone onboarding."),
        ("AI Face Liveness & Anti-Spoofing:", "3D cranial depth scanning compares candidate's live camera selfie with their official government ID photo in real time."),
        ("1-Click Master Dossier PDF:", "Automatically generates court-admissible PDF verification dossiers stamped with QR codes and immutable Certificate IDs.")
    ]
    for h, b in sol_points:
        p = tf3_l.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = f"✔ {h} "
        r1.font.name = FONT
        r1.font.size = Pt(10.5)
        r1.font.bold = True
        r1.font.color.rgb = EMERALD
        r2 = p.add_run()
        r2.text = b
        r2.font.name = FONT
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_BODY

    # Right Card: The 5-Portal Integrated Ecosystem
    add_card(s3, 6.8, 1.4, 5.733, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb3_r = s3.shapes.add_textbox(Inches(7.0), Inches(1.55), Inches(5.333), Inches(5.0))
    tf3_r = tb3_r.text_frame
    tf3_r.word_wrap = True

    p = tf3_r.paragraphs[0]
    r = p.add_run()
    r.text = "🌐 5 DEDICATED ROLE-BASED PORTALS"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = ROYAL_BLUE

    portals = [
        ("1. Super Admin Console:", "Platform governance, client contract management, live API latency telemetry, and metered billing."),
        ("2. Company Admin Portal:", "Corporate HQ hub for managing HR team quotas, postpaid 18% GST invoices, and vendor compliance."),
        ("3. HR Executive Workstation:", "Recruiter pipeline with single & 500+ Excel bulk import, live status board, and 1-click dossier download."),
        ("4. Candidate Mobile Portal:", "Frictionless mobile web app with PIN security, Aadhaar OTP e-KYC, and live selfie capture."),
        ("5. Vendor & Contractor Portal:", "B2B vendor onboarding, CLRA labor license tracking, and statutory compliance due diligence.")
    ]
    for h, b in portals:
        p = tf3_r.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = f"• {h} "
        r1.font.name = FONT
        r1.font.size = Pt(10.5)
        r1.font.bold = True
        r1.font.color.rgb = TEXT_TITLE
        r2 = p.add_run()
        r2.text = b
        r2.font.name = FONT
        r2.font.size = Pt(9.8)
        r2.font.color.rgb = TEXT_BODY

    add_footer(s3, 3, 17)

    # =========================================================================
    # SLIDE 4: WHAT WE VERIFY - EMPLOYEE VERIFICATION
    # =========================================================================
    s4 = create_slide_base(prs)
    add_header(s4, "What We Verify: 100% Comprehensive Employee Checks", "Verification Scope (Employees)")

    emp_checks = [
        ("🆔 1. Aadhaar e-KYC (UIDAI)", [
            ("Direct UIDAI Gateway:", "Instant OTP & Biometric demographic validation."),
            ("Zero Physical Photocopy:", "Secure masked 256-bit SHA token authentication."),
            ("Speed:", "Verified instantly in under 10 seconds.")
        ], EMERALD, EMERALD_BG, EMERALD_BORDER),
        ("💳 2. PAN Tax & Identity (NSDL)", [
            ("NSDL & ITD Verification:", "Matches registered name, father's name, and DOB."),
            ("Tax Status Check:", "Confirms active PAN and authenticates tax credentials."),
            ("Speed:", "Verified instantly in under 5 seconds.")
        ], ROYAL_BLUE, BLUE_BG, BLUE_BORDER),
        ("🏦 3. Bank Account Penny Drop", [
            ("NPCI / IMPS Bank Check:", "Transfers ₹1 to verify active candidate account."),
            ("Exact Name Match:", "Confirms official account holder name at bank branch."),
            ("Zero Salary Reversals:", "Prevents payroll bounce errors before joining.")
        ], PURPLE, PURPLE_BG, PURPLE_BORDER),
        ("🏢 4. Dual Employment & EPFO", [
            ("EPFO Service History:", "Pulls authentic UAN employment service timeline."),
            ("Moonlighting Detection:", "Catches overlapping concurrent employment automatically."),
            ("Speed:", "Eliminates months of manual experience letter calls.")
        ], RED_ALERT, RED_BG, RED_BORDER),
        ("🎓 5. Education & Degree Check", [
            ("DigiLocker & NAD Hub:", "Direct digital validation of university certificates."),
            ("Accredited Degrees:", "Validates marksheets, roll numbers, and pass years."),
            ("Fraud Prevention:", "Detects fake certificates from unaccredited mills.")
        ], AMBER, AMBER_BG, AMBER_BORDER),
        ("📸 6. AI 3D Facial Liveness", [
            ("Biometric Anti-Spoofing:", "Live webcam scan prevents photo and video playback spoofing."),
            ("Aadhaar Photo Match:", "AI craniofacial engine compares selfie with official ID photo."),
            ("Match Score:", "Delivers 99.4% precision match score in real time.")
        ], EMERALD, EMERALD_BG, EMERALD_BORDER)
    ]

    for idx, (title_c, items_c, clr, bg, border) in enumerate(emp_checks):
        row = idx // 3
        col = idx % 3
        cx = 0.8 + col * 3.95
        cy = 1.45 + row * 2.65

        add_card(s4, cx, cy, 3.8, 2.5, bg_color=CARD_WHITE, border_color=border)

        hb = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.1), Inches(cy + 0.1), Inches(3.6), Inches(0.48))
        hb.fill.solid()
        hb.fill.fore_color.rgb = bg
        hb.line.color.rgb = border
        hb.line.width = Pt(1)
        tf_hb = hb.text_frame
        tf_hb.word_wrap = True
        p_h = tf_hb.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        r_h = p_h.add_run()
        r_h.text = title_c
        r_h.font.name = FONT
        r_h.font.size = Pt(10.5)
        r_h.font.bold = True
        r_h.font.color.rgb = clr

        tb_b = s4.shapes.add_textbox(Inches(cx + 0.1), Inches(cy + 0.62), Inches(3.6), Inches(1.8))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for b_idx, (head, desc) in enumerate(items_c):
            p = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p.space_before = Pt(3)
            r1 = p.add_run()
            r1.text = f"• {head} "
            r1.font.name = FONT
            r1.font.size = Pt(9.5)
            r1.font.bold = True
            r1.font.color.rgb = TEXT_TITLE
            r2 = p.add_run()
            r2.text = desc
            r2.font.name = FONT
            r2.font.size = Pt(9)
            r2.font.color.rgb = TEXT_BODY

    add_footer(s4, 4, 17)

    # =========================================================================
    # SLIDE 5: WHAT WE VERIFY - VENDOR & CONTRACTOR VERIFICATION
    # =========================================================================
    s5 = create_slide_base(prs)
    add_header(s5, "B2B Vendor & Contractor Due Diligence: 11 Statutory Checks", "Verification Scope (Vendors & CLRA)")

    vendor_checks = [
        ("🏢 1. Corporate MCA Verification", [
            ("MCA21 Registry:", "Validates CIN, LLPIN, and incorporation certificates."),
            ("Active Status:", "Confirms company is active, compliant, and not struck off."),
            ("Director DIN:", "Authenticates board directors and signatory credentials.")
        ], ROYAL_BLUE, BLUE_BG, BLUE_BORDER),
        ("🧾 2. GSTIN & Tax Compliance", [
            ("GST Portal Direct Link:", "Validates active GST number and state registration."),
            ("Filing Track Record:", "Monitors regular GSTR-1 and GSTR-3B tax return filings."),
            ("Fraud Shield:", "Prevents dealing with shell or circular-trading vendors.")
        ], EMERALD, EMERALD_BG, EMERALD_BORDER),
        ("⚖️ 3. CLRA Labor License & Safety", [
            ("Labor Ministry Registry:", "Confirms valid Contract Labour (Regulation & Abolition) license."),
            ("Workforce Quota:", "Verifies authorized worker count and site coverage."),
            ("Legal Protection:", "Shields principal employer from statutory contractor fines.")
        ], RED_ALERT, RED_BG, RED_BORDER),
        ("💼 4. Vendor PAN & Financials", [
            ("Income Tax Validation:", "Verifies vendor entity PAN and corporate filing."),
            ("MSME / Udyam Check:", "Confirms small business registration and classification."),
            ("Tax Clearance:", "Ensures vendor is in good financial standing.")
        ], PURPLE, PURPLE_BG, PURPLE_BORDER),
        ("🏦 5. Vendor Bank Account Check", [
            ("Penny Drop Verification:", "Instant IMPS ping to verify company bank details."),
            ("Registered Corporate Name:", "Matches bank branch records with MCA entity name."),
            ("Zero Payment Fraud:", "Eliminates wrongful vendor payments and diverted invoices.")
        ], AMBER, AMBER_BG, AMBER_BORDER),
        ("📜 6. Master Vendor Compliance Dossier", [
            ("Consolidated B2B Report:", "Combines all 11 statutory audits into one master report."),
            ("Scannable QR & Digital Seal:", "Instant mobile QR validation for client audit inspections."),
            ("Real-Time Status:", "Live dashboard flags expired vendor licenses immediately.")
        ], EMERALD, EMERALD_BG, EMERALD_BORDER)
    ]

    for idx, (title_c, items_c, clr, bg, border) in enumerate(vendor_checks):
        row = idx // 3
        col = idx % 3
        cx = 0.8 + col * 3.95
        cy = 1.45 + row * 2.65

        add_card(s5, cx, cy, 3.8, 2.5, bg_color=CARD_WHITE, border_color=border)

        hb = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.1), Inches(cy + 0.1), Inches(3.6), Inches(0.48))
        hb.fill.solid()
        hb.fill.fore_color.rgb = bg
        hb.line.color.rgb = border
        hb.line.width = Pt(1)
        tf_hb = hb.text_frame
        tf_hb.word_wrap = True
        p_h = tf_hb.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        r_h = p_h.add_run()
        r_h.text = title_c
        r_h.font.name = FONT
        r_h.font.size = Pt(10.5)
        r_h.font.bold = True
        r_h.font.color.rgb = clr

        tb_b = s5.shapes.add_textbox(Inches(cx + 0.1), Inches(cy + 0.62), Inches(3.6), Inches(1.8))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for b_idx, (head, desc) in enumerate(items_c):
            p = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p.space_before = Pt(3)
            r1 = p.add_run()
            r1.text = f"• {head} "
            r1.font.name = FONT
            r1.font.size = Pt(9.5)
            r1.font.bold = True
            r1.font.color.rgb = TEXT_TITLE
            r2 = p.add_run()
            r2.text = desc
            r2.font.name = FONT
            r2.font.size = Pt(9)
            r2.font.color.rgb = TEXT_BODY

    add_footer(s5, 5, 17)

    # =========================================================================
    # SLIDE 6: EASY VERIFICATION PROCESS & REDUCED WORKLOAD
    # =========================================================================
    s6 = create_slide_base(prs)
    add_header(s6, "How It Dramatically Reduces Your Process & Workload", "Workflow Simplification")

    steps = [
        ("Step 1: HR 1-Click Dispatch", "HR Recruiter enters candidate name and mobile, or uploads a 500+ Excel list. The system automatically dispatches WhatsApp magic invitation links.", EMERALD, EMERALD_BG, EMERALD_BORDER),
        ("Step 2: Candidate Mobile Input", "Candidate opens link on smartphone, enters 4-digit security PIN, approves consent, enters Aadhaar OTP, and snaps a 3D live camera selfie.", ROYAL_BLUE, BLUE_BG, BLUE_BORDER),
        ("Step 3: Real-Time Statutory Audit", "Joy True Profile connects to government databases (UIDAI, NSDL, EPFO, Courts) and verifies all credentials in under 45 seconds.", PURPLE, PURPLE_BG, PURPLE_BORDER),
        ("Step 4: Tamper-Proof Dossier", "An official verified PDF report is generated with Certificate ID, QR validation code, and SHA-256 digital stamp ready for 1-click download.", AMBER, AMBER_BG, AMBER_BORDER)
    ]

    for idx, (s_title, s_desc, clr, bg, border) in enumerate(steps):
        cx = 0.8 + idx * 2.95
        add_card(s6, cx, 1.45, 2.85, 4.15, bg_color=CARD_WHITE, border_color=border)

        # Step Number Badge
        badge = s6.shapes.add_shape(MSO_SHAPE.OVAL, Inches(cx + 1.125), Inches(1.6), Inches(0.6), Inches(0.6))
        badge.fill.solid()
        badge.fill.fore_color.rgb = clr
        badge.line.fill.background()
        tf_bd = badge.text_frame
        p_bd = tf_bd.paragraphs[0]
        p_bd.alignment = PP_ALIGN.CENTER
        r_bd = p_bd.add_run()
        r_bd.text = str(idx + 1)
        r_bd.font.name = FONT
        r_bd.font.size = Pt(14)
        r_bd.font.bold = True
        r_bd.font.color.rgb = CARD_WHITE

        # Title
        tb_t = s6.shapes.add_textbox(Inches(cx + 0.1), Inches(2.3), Inches(2.65), Inches(0.6))
        tf_t = tb_t.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.alignment = PP_ALIGN.CENTER
        r_t = p_t.add_run()
        r_t.text = s_title
        r_t.font.name = FONT
        r_t.font.size = Pt(11)
        r_t.font.bold = True
        r_t.font.color.rgb = clr

        # Description
        tb_d = s6.shapes.add_textbox(Inches(cx + 0.1), Inches(2.95), Inches(2.65), Inches(2.5))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = s_desc
        r_d.font.name = FONT
        r_d.font.size = Pt(9.8)
        r_d.font.color.rgb = TEXT_BODY

    # Work Reduction Summary Box
    add_card(s6, 0.8, 5.75, 11.733, 1.0, bg_color=EMERALD_BG, border_color=EMERALD_BORDER)
    tb6_bot = s6.shapes.add_textbox(Inches(1.0), Inches(5.82), Inches(11.333), Inches(0.85))
    tf6_bot = tb6_bot.text_frame
    tf6_bot.word_wrap = True
    p_b1 = tf6_bot.paragraphs[0]
    r_b1 = p_b1.add_run()
    r_b1.text = "🎯 Major Work Reduction Impact: "
    r_b1.font.name = FONT
    r_b1.font.size = Pt(11.5)
    r_b1.font.bold = True
    r_b1.font.color.rgb = EMERALD
    r_b2 = p_b1.add_run()
    r_b2.text = "Eliminates 85% of manual HR operational tasks. Zero physical paperwork, no manual data entry, no phone calls to past employers, and instant downloadable PDF dossiers for every hire."
    r_b2.font.name = FONT
    r_b2.font.size = Pt(10.5)
    r_b2.font.color.rgb = TEXT_BODY

    add_footer(s6, 6, 17)

    # =========================================================================
    # SLIDE 7: PORTAL 1 — SUPER ADMIN CONSOLE
    # =========================================================================
    s7 = create_slide_base(prs)
    add_header(s7, "Portal 1: Super Admin Console — Master Platform Governance", "Portal Architecture (1/5)")

    # Left: Features & Workflow
    add_card(s7, 0.8, 1.4, 5.8, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb7_l = s7.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.4), Inches(5.0))
    tf7_l = tb7_l.text_frame
    tf7_l.word_wrap = True

    p = tf7_l.paragraphs[0]
    r = p.add_run()
    r.text = "👑 SUPER ADMIN CONSOLE — FEATURES & WORKFLOW"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = PURPLE

    sa_details = [
        ("Multi-Company Governance:", "Onboard client enterprises, configure service packages, and manage tier access."),
        ("Dynamic API Pricing Engine:", "Set custom per-check billing rates, volume discounts, and postpaid credits."),
        ("Live API Telemetry & Health:", "Real-time monitoring of UIDAI, NSDL, EPFO, and Court gateway latencies and uptime."),
        ("Postpaid Ledger & Invoicing:", "Automated monthly 18% GST tax invoice generation and settlement tracking.")
    ]
    for h, b in sa_details:
        p = tf7_l.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = f"• {h} "
        r1.font.name = FONT
        r1.font.size = Pt(10.5)
        r1.font.bold = True
        r1.font.color.rgb = TEXT_TITLE
        r2 = p.add_run()
        r2.text = b
        r2.font.name = FONT
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_BODY

    p_w = tf7_l.add_paragraph()
    p_w.space_before = Pt(10)
    r_w = p_w.add_run()
    r_w.text = "⚙️ Super Admin Operational Workflow:"
    r_w.font.name = FONT
    r_w.font.size = Pt(11)
    r_w.font.bold = True
    r_w.font.color.rgb = PURPLE

    p_w2 = tf7_l.add_paragraph()
    p_w2.space_before = Pt(4)
    r_w2 = p_w2.add_run()
    r_w2.text = "1. Add Company ➔ 2. Set Custom Price ➔ 3. Monitor Live API Speed ➔ 4. Oversee Monthly Invoices"
    r_w2.font.name = FONT
    r_w2.font.size = Pt(9.5)
    r_w2.font.bold = True
    r_w2.font.color.rgb = TEXT_BODY

    # Right: Real Super Admin Browser Mockup
    add_card(s7, 6.8, 1.4, 5.733, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_super_admin):
        s7.shapes.add_picture(mock_super_admin, Inches(7.0), Inches(1.55), width=Inches(5.333))

    tb7_r = s7.shapes.add_textbox(Inches(7.0), Inches(5.05), Inches(5.333), Inches(1.5))
    tf7_r = tb7_r.text_frame
    tf7_r.word_wrap = True
    pr1 = tf7_r.paragraphs[0]
    rr1 = pr1.add_run()
    rr1.text = "🖥️ Live Super Admin Workstation View"
    rr1.font.name = FONT
    rr1.font.size = Pt(11.5)
    rr1.font.bold = True
    rr1.font.color.rgb = PURPLE

    pr2 = tf7_r.add_paragraph()
    pr2.space_before = Pt(4)
    rr2 = pr2.add_run()
    rr2.text = "Direct registry control center monitoring tenant enterprise client activations, gateway latency, and platform security."
    rr2.font.name = FONT
    rr2.font.size = Pt(10)
    rr2.font.color.rgb = TEXT_BODY

    add_footer(s7, 7, 17)

    # =========================================================================
    # SLIDE 8: PORTAL 2 — COMPANY ADMIN CORPORATE CONSOLE
    # =========================================================================
    s8 = create_slide_base(prs)
    add_header(s8, "Portal 2: Company Admin Portal — Corporate Headquarters", "Portal Architecture (2/5)")

    # Left: Features & Workflow
    add_card(s8, 0.8, 1.4, 5.8, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb8_l = s8.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.4), Inches(5.0))
    tf8_l = tb8_l.text_frame
    tf8_l.word_wrap = True

    p = tf8_l.paragraphs[0]
    r = p.add_run()
    r.text = "🏢 COMPANY ADMIN PORTAL — FEATURES & WORKFLOW"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = ROYAL_BLUE

    ca_details = [
        ("Company Profile & Logo:", "Upload corporate logo, manage office addresses, CIN, GSTIN, and company PAN."),
        ("HR Recruiter Provisioning:", "Add and manage HR recruiters, allocate verification quotas, and configure recruiter access."),
        ("Postpaid Monthly Billing:", "Dashboard showing verified candidates, pending balance, and monthly 18% GST tax invoices."),
        ("Contractor Compliance Oversight:", "Monitor third-party contractor workforce registers and ensure full statutory labor compliance.")
    ]
    for h, b in ca_details:
        p = tf8_l.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = f"• {h} "
        r1.font.name = FONT
        r1.font.size = Pt(10.5)
        r1.font.bold = True
        r1.font.color.rgb = TEXT_TITLE
        r2 = p.add_run()
        r2.text = b
        r2.font.name = FONT
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_BODY

    p_w = tf8_l.add_paragraph()
    p_w.space_before = Pt(10)
    r_w = p_w.add_run()
    r_w.text = "⚙️ Company Admin Operational Workflow:"
    r_w.font.name = FONT
    r_w.font.size = Pt(11)
    r_w.font.bold = True
    r_w.font.color.rgb = ROYAL_BLUE

    p_w2 = tf8_l.add_paragraph()
    p_w2.space_before = Pt(4)
    r_w2 = p_w2.add_run()
    r_w2.text = "1. Set Company Logo ➔ 2. Add HR Recruiters ➔ 3. Monitor All Candidate Checks ➔ 4. Pay Monthly 18% GST Bill"
    r_w2.font.name = FONT
    r_w2.font.size = Pt(9.5)
    r_w2.font.bold = True
    r_w2.font.color.rgb = TEXT_BODY

    # Right: Real Company Admin Browser Mockup
    add_card(s8, 6.8, 1.4, 5.733, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_company_admin):
        s8.shapes.add_picture(mock_company_admin, Inches(7.0), Inches(1.55), width=Inches(5.333))

    tb8_r = s8.shapes.add_textbox(Inches(7.0), Inches(5.05), Inches(5.333), Inches(1.5))
    tf8_r = tb8_r.text_frame
    tf8_r.word_wrap = True
    pr1 = tf8_r.paragraphs[0]
    rr1 = pr1.add_run()
    rr1.text = "🖥️ Live Company Admin Console View"
    rr1.font.name = FONT
    rr1.font.size = Pt(11.5)
    rr1.font.bold = True
    rr1.font.color.rgb = ROYAL_BLUE

    pr2 = tf8_r.add_paragraph()
    pr2.space_before = Pt(4)
    rr2 = pr2.add_run()
    rr2.text = "Executive management hub for HR team oversight, branch control, postpaid wallet monitoring, and 1-click tax invoice settlement."
    rr2.font.name = FONT
    rr2.font.size = Pt(10)
    rr2.font.color.rgb = TEXT_BODY

    add_footer(s8, 8, 17)

    # =========================================================================
    # SLIDE 9: PORTAL 3 — HR EXECUTIVE WORKSTATION
    # =========================================================================
    s9 = create_slide_base(prs)
    add_header(s9, "Portal 3: HR Executive Workstation — Recruiter Dashboard", "Portal Architecture (3/5)")

    # Left: Features & Workflow
    add_card(s9, 0.8, 1.4, 5.8, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb9_l = s9.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.4), Inches(5.0))
    tf9_l = tb9_l.text_frame
    tf9_l.word_wrap = True

    p = tf9_l.paragraphs[0]
    r = p.add_run()
    r.text = "👔 HR EXECUTIVE WORKSTATION — FEATURES & WORKFLOW"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    hr_details = [
        ("Single & 500+ Excel Bulk Import:", "Enter candidate info individually or upload a batch of 500+ candidates using an Excel sheet."),
        ("1-Click WhatsApp Magic Links:", "Send invitation links via WhatsApp and SMS with automatically generated 4-digit security PINs."),
        ("Live Candidate Progress Board:", "Track who has opened the link, who is filling the form, and whose checks are completed in real time."),
        ("AI Photo & Face Matching:", "Compares candidate's live camera selfie with their official Aadhaar photo and shows match percentage."),
        ("1-Click Master PDF Dossier:", "Download the complete verified report stamped with company logo, QR code, and Certificate ID.")
    ]
    for h, b in hr_details:
        p = tf9_l.add_paragraph()
        p.space_before = Pt(5)
        r1 = p.add_run()
        r1.text = f"• {h} "
        r1.font.name = FONT
        r1.font.size = Pt(10.5)
        r1.font.bold = True
        r1.font.color.rgb = TEXT_TITLE
        r2 = p.add_run()
        r2.text = b
        r2.font.name = FONT
        r2.font.size = Pt(9.8)
        r2.font.color.rgb = TEXT_BODY

    p_w = tf9_l.add_paragraph()
    p_w.space_before = Pt(9)
    r_w = p_w.add_run()
    r_w.text = "⚙️ HR Recruiter Daily Workflow:"
    r_w.font.name = FONT
    r_w.font.size = Pt(11)
    r_w.font.bold = True
    r_w.font.color.rgb = EMERALD

    p_w2 = tf9_l.add_paragraph()
    p_w2.space_before = Pt(3)
    r_w2 = p_w2.add_run()
    r_w2.text = "1. Enter Candidate / Excel ➔ 2. Send WhatsApp Link ➔ 3. Watch Live Status ➔ 4. Download PDF Dossier"
    r_w2.font.name = FONT
    r_w2.font.size = Pt(9.5)
    r_w2.font.bold = True
    r_w2.font.color.rgb = TEXT_BODY

    # Right: Real HR Workstation Browser Mockup
    add_card(s9, 6.8, 1.4, 5.733, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_hr_workstation):
        s9.shapes.add_picture(mock_hr_workstation, Inches(7.0), Inches(1.55), width=Inches(5.333))

    tb9_r = s9.shapes.add_textbox(Inches(7.0), Inches(5.05), Inches(5.333), Inches(1.5))
    tf9_r = tb9_r.text_frame
    tf9_r.word_wrap = True
    pr1 = tf9_r.paragraphs[0]
    rr1 = pr1.add_run()
    rr1.text = "🖥️ Live HR Executive Workstation View"
    rr1.font.name = FONT
    rr1.font.size = Pt(11.5)
    rr1.font.bold = True
    rr1.font.color.rgb = EMERALD

    pr2 = tf9_r.add_paragraph()
    pr2.space_before = Pt(4)
    rr2 = pr2.add_run()
    rr2.text = "Centralized candidate pipeline tracker with real-time status telemetry, instant WhatsApp re-dispatch, and bulk PDF export."
    rr2.font.name = FONT
    rr2.font.size = Pt(10)
    rr2.font.color.rgb = TEXT_BODY

    add_footer(s9, 9, 17)

    # =========================================================================
    # SLIDE 10: PORTAL 4 — CANDIDATE MOBILE WEB APP
    # =========================================================================
    s10 = create_slide_base(prs)
    add_header(s10, "Portal 4: Candidate Portal — Frictionless Mobile Web App", "Portal Architecture (4/5)")

    # Left: Features & Workflow
    add_card(s10, 0.8, 1.4, 6.4, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb10_l = s10.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(6.0), Inches(5.0))
    tf10_l = tb10_l.text_frame
    tf10_l.word_wrap = True

    p = tf10_l.paragraphs[0]
    r = p.add_run()
    r.text = "📱 CANDIDATE MOBILE PORTAL — FEATURES & WORKFLOW"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = AMBER

    cand_details = [
        ("Zero App Install Required:", "Runs purely in any mobile browser (Chrome, Safari, Edge) via responsive web interface."),
        ("4-Digit Secure PIN Access:", "Candidates unlock their verification using a personal 4-digit PIN sent via WhatsApp."),
        ("Sub-2-Minute Completion:", "Fast 4-step wizard: Basic Details ➔ Aadhaar OTP e-KYC ➔ AI Selfie ➔ Instant Submit."),
        ("Camera & Liveness Capture:", "Guided camera captures live selfie with anti-spoofing depth checks."),
        ("Consent & Privacy Shield:", "DPDP Act 2023 compliant consent screen explaining exact data usage.")
    ]
    for h, b in cand_details:
        p = tf10_l.add_paragraph()
        p.space_before = Pt(5)
        r1 = p.add_run()
        r1.text = f"• {h} "
        r1.font.name = FONT
        r1.font.size = Pt(10.5)
        r1.font.bold = True
        r1.font.color.rgb = TEXT_TITLE
        r2 = p.add_run()
        r2.text = b
        r2.font.name = FONT
        r2.font.size = Pt(9.8)
        r2.font.color.rgb = TEXT_BODY

    p_w = tf10_l.add_paragraph()
    p_w.space_before = Pt(9)
    r_w = p_w.add_run()
    r_w.text = "⚙️ Candidate Mobile Onboarding Flow:"
    r_w.font.name = FONT
    r_w.font.size = Pt(11)
    r_w.font.bold = True
    r_w.font.color.rgb = AMBER

    p_w2 = tf10_l.add_paragraph()
    p_w2.space_before = Pt(4)
    r_w2 = p_w2.add_run()
    r_w2.text = "1. Open WhatsApp Link ➔ 2. Enter 4-Digit PIN ➔ 3. Enter Aadhaar OTP ➔ 4. Take Selfie & Submit"
    r_w2.font.name = FONT
    r_w2.font.size = Pt(9.5)
    r_w2.font.bold = True
    r_w2.font.color.rgb = TEXT_BODY

    # Right: Real Mobile Smartphone Mockup
    add_card(s10, 7.4, 1.4, 5.133, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_candidate_mobile):
        s10.shapes.add_picture(mock_candidate_mobile, Inches(8.9), Inches(1.55), height=Inches(4.4))

    tb10_r = s10.shapes.add_textbox(Inches(7.6), Inches(6.05), Inches(4.733), Inches(0.6))
    tf10_r = tb10_r.text_frame
    tf10_r.word_wrap = True
    pr1 = tf10_r.paragraphs[0]
    pr1.alignment = PP_ALIGN.CENTER
    rr1 = pr1.add_run()
    rr1.text = "📱 Frictionless Mobile Web App: 4-Digit PIN, Aadhaar e-KYC & 3D Selfie"
    rr1.font.name = FONT
    rr1.font.size = Pt(9.5)
    rr1.font.bold = True
    rr1.font.color.rgb = AMBER

    add_footer(s10, 10, 17)

    # =========================================================================
    # SLIDE 11: PORTAL 5 — VENDOR DUE DILIGENCE STUDIO
    # =========================================================================
    s11 = create_slide_base(prs)
    add_header(s11, "Portal 5: Vendor & Contractor Portal — CLRA Compliance", "Portal Architecture (5/5)")

    # Left: Features & Workflow
    add_card(s11, 0.8, 1.4, 5.8, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb11_l = s11.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.4), Inches(5.0))
    tf11_l = tb11_l.text_frame
    tf11_l.word_wrap = True

    p = tf11_l.paragraphs[0]
    r = p.add_run()
    r.text = "🤝 VENDOR DUE DILIGENCE — FEATURES & WORKFLOW"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = ROYAL_BLUE

    vnd_details = [
        ("B2B Self-Onboarding Studio:", "Vendors receive secure registration links to submit company registration numbers and certificates."),
        ("11-Point Statutory Verification:", "Automated API verification of MCA CIN, LLPIN, GSTIN, Vendor PAN, MSME, and Bank account."),
        ("CLRA Labor License Tracking:", "Validates contractor labor license numbers, validity periods, and maximum deployed worker count."),
        ("Contractor Risk Scoring:", "System generates a risk rating for each vendor based on tax filing consistency and legal compliance.")
    ]
    for h, b in vnd_details:
        p = tf11_l.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = f"• {h} "
        r1.font.name = FONT
        r1.font.size = Pt(10.5)
        r1.font.bold = True
        r1.font.color.rgb = TEXT_TITLE
        r2 = p.add_run()
        r2.text = b
        r2.font.name = FONT
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_BODY

    p_w = tf11_l.add_paragraph()
    p_w.space_before = Pt(10)
    r_w = p_w.add_run()
    r_w.text = "⚙️ Vendor Due Diligence Workflow:"
    r_w.font.name = FONT
    r_w.font.size = Pt(11)
    r_w.font.bold = True
    r_w.font.color.rgb = ROYAL_BLUE

    p_w2 = tf11_l.add_paragraph()
    p_w2.space_before = Pt(4)
    r_w2 = p_w2.add_run()
    r_w2.text = "1. Dispatch Vendor Link ➔ 2. Vendor Submits GST/CIN ➔ 3. 11 APIs Verify Instantly ➔ 4. Approve Vendor"
    r_w2.font.name = FONT
    r_w2.font.size = Pt(9.5)
    r_w2.font.bold = True
    r_w2.font.color.rgb = TEXT_BODY

    # Right: Real Vendor Portal Browser Mockup
    add_card(s11, 6.8, 1.4, 5.733, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_vendor_portal):
        s11.shapes.add_picture(mock_vendor_portal, Inches(7.0), Inches(1.55), width=Inches(5.333))

    tb11_r = s11.shapes.add_textbox(Inches(7.0), Inches(5.05), Inches(5.333), Inches(1.5))
    tf11_r = tb11_r.text_frame
    tf11_r.word_wrap = True
    pr1 = tf11_r.paragraphs[0]
    rr1 = pr1.add_run()
    rr1.text = "🖥️ Live Vendor Due Diligence Portal View"
    rr1.font.name = FONT
    rr1.font.size = Pt(11.5)
    rr1.font.bold = True
    rr1.font.color.rgb = ROYAL_BLUE

    pr2 = tf11_r.add_paragraph()
    pr2.space_before = Pt(4)
    rr2 = pr2.add_run()
    rr2.text = "Contractor and third-party vendor onboarding console with automated statutory consent, MCA CIN, and GST filing audits."
    rr2.font.name = FONT
    rr2.font.size = Pt(10)
    rr2.font.color.rgb = TEXT_BODY

    add_footer(s11, 11, 17)

    # =========================================================================
    # SLIDE 12: CERTIFIED DOSSIER & UNIQUE CERTIFICATE ID FEATURE
    # =========================================================================
    s12 = create_slide_base(prs)
    add_header(s12, "Certified Verification Report & Unique Certificate ID", "Certificate Features")

    # Left: Certificate Features
    add_card(s12, 0.8, 1.4, 5.8, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb12_l = s12.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.4), Inches(5.0))
    tf12_l = tb12_l.text_frame
    tf12_l.word_wrap = True

    p = tf12_l.paragraphs[0]
    r = p.add_run()
    r.text = "📜 OFFICIAL VERIFICATION CERTIFICATE & ID SYSTEM"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    cert_points = [
        ("Unique Certificate ID:", "Every verified candidate receives an immutable, permanent ID (e.g. #JCS-VERIF-2026-101-889) registered in the national registry."),
        ("Live Scannable QR Code:", "Any recruiter, client auditor, or banking authority can scan the QR code with their mobile phone to instantly view live authenticity records."),
        ("SHA-256 Cryptographic Stamp:", "Generates a unique cryptographic hash to ensure the PDF report cannot be edited, altered, or forged."),
        ("Instant Online Validation:", "Eliminates slow back-and-forth emails between companies. Instant paperless verification lookup online.")
    ]
    for h, b in cert_points:
        p = tf12_l.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = f"✔ {h} "
        r1.font.name = FONT
        r1.font.size = Pt(10.5)
        r1.font.bold = True
        r1.font.color.rgb = EMERALD
        r2 = p.add_run()
        r2.text = b
        r2.font.name = FONT
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_BODY

    p_c = tf12_l.add_paragraph()
    p_c.space_before = Pt(10)
    r_c = p_c.add_run()
    r_c.text = "🎯 Key Benefit for Employers & Clients:"
    r_c.font.name = FONT
    r_c.font.size = Pt(11)
    r_c.font.bold = True
    r_c.font.color.rgb = ROYAL_BLUE

    p_c2 = tf12_l.add_paragraph()
    p_c2.space_before = Pt(4)
    r_c2 = p_c2.add_run()
    r_c2.text = "100% genuine proof accepted by corporate clients, enterprise auditors, and government regulatory inspectors."
    r_c2.font.name = FONT
    r_c2.font.size = Pt(9.8)
    r_c2.font.color.rgb = TEXT_BODY

    # Right: Real Master Dossier PDF Mockup with QR Code and Highlight Badges
    add_card(s12, 6.8, 1.4, 5.733, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_dossier_pdf):
        s12.shapes.add_picture(mock_dossier_pdf, Inches(7.0), Inches(1.55), height=Inches(5.0))

    # Right Badges Column beside certificate image
    cert_highlights = [
        ("🆔 Unique Cert ID", "Permanent Reference", EMERALD_BG, EMERALD_BORDER, EMERALD),
        ("🛡️ SHA-256 Hash", "Tamper-Proof Math", BLUE_BG, BLUE_BORDER, ROYAL_BLUE),
        ("📲 Live QR Seal", "Instant Phone Scan", PURPLE_BG, PURPLE_BORDER, PURPLE),
        ("🏛️ IT Act, 2000", "Court-Admissible", AMBER_BG, AMBER_BORDER, AMBER)
    ]
    for idx, (title_h, sub_h, bg_c, brd_c, txt_c) in enumerate(cert_highlights):
        hy = 1.65 + idx * 1.2
        c_badge = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.35), Inches(hy), Inches(2.0), Inches(0.95))
        c_badge.fill.solid()
        c_badge.fill.fore_color.rgb = bg_c
        c_badge.line.color.rgb = brd_c
        c_badge.line.width = Pt(1)
        tf_cb = c_badge.text_frame
        tf_cb.word_wrap = True
        
        p1_cb = tf_cb.paragraphs[0]
        p1_cb.alignment = PP_ALIGN.CENTER
        r1_cb = p1_cb.add_run()
        r1_cb.text = title_h
        r1_cb.font.name = FONT
        r1_cb.font.size = Pt(10)
        r1_cb.font.bold = True
        r1_cb.font.color.rgb = txt_c

        p2_cb = tf_cb.add_paragraph()
        p2_cb.space_before = Pt(2)
        p2_cb.alignment = PP_ALIGN.CENTER
        r2_cb = p2_cb.add_run()
        r2_cb.text = sub_h
        r2_cb.font.name = FONT
        r2_cb.font.size = Pt(8.5)
        r2_cb.font.color.rgb = TEXT_BODY

    add_footer(s12, 12, 17)

    # =========================================================================
    # SLIDE 13: PROJECT SAFETY & FRAUD PREVENTION ARCHITECTURE
    # =========================================================================
    s13 = create_slide_base(prs)
    add_header(s13, "Project Safety & Fraud Prevention Architecture", "Platform Safety")

    safety_pillars = [
        ("🛡️ 1. Anti-Spoofing & Liveness", [
            ("3D Cranial Depth Scan:", "Active biometric liveness detection blocks 2D printed photos and video screen replay attacks."),
            ("Micro-Movement Checks:", "Validates natural human blink, gaze direction, and facial micro-movements in real time."),
            ("Immediate Bot Detection:", "Automated bots and AI deepfakes are immediately rejected by the capture engine.")
        ], EMERALD, EMERALD_BG, EMERALD_BORDER),
        ("🔑 2. Multi-Factor PIN Security", [
            ("4-Digit Security PIN:", "Candidate portal is locked with a unique 4-digit PIN delivered only to candidate's mobile number."),
            ("Single-Use Session Links:", "Magic links expire automatically after 72 hours or once submitted, preventing unauthorized reuse."),
            ("Device Fingerprinting:", "Tracks browser user-agent and IP to prevent third-party link hijacking.")
        ], ROYAL_BLUE, BLUE_BG, BLUE_BORDER),
        ("📑 3. Immutable Audit Trails", [
            ("SHA-256 Checksum Stamp:", "Every verified document is stamped with a unique cryptographic checksum that changes if edited."),
            ("Tamper Detection:", "Any alteration to employee particulars or verification status renders the digital certificate invalid."),
            ("Time-Stamped Audit Logs:", "All verification actions are permanently logged with ISO timestamps.")
        ], PURPLE, PURPLE_BG, PURPLE_BORDER),
        ("🚦 4. Rate Limiting & Shield", [
            ("Brute-Force Protection:", "Strict API rate limiting stops automated brute-force attacks and credential stuffing."),
            ("Bot Challenge Defense:", "Protects candidate verification portals against automated spam submissions."),
            ("Automated Threat Alerts:", "Security engine flags abnormal request spikes and suspicious geographic IP activity.")
        ], AMBER, AMBER_BG, AMBER_BORDER)
    ]

    for idx, (s_title, s_items, clr, bg, border) in enumerate(safety_pillars):
        cx = 0.8 + idx * 2.95
        add_card(s13, cx, 1.45, 2.85, 5.25, bg_color=CARD_WHITE, border_color=border)
        
        hb = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.1), Inches(1.55), Inches(2.65), Inches(0.65))
        hb.fill.solid()
        hb.fill.fore_color.rgb = bg
        hb.line.color.rgb = border
        hb.line.width = Pt(1)
        tf_hb = hb.text_frame
        tf_hb.word_wrap = True
        p_h = tf_hb.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        r_h = p_h.add_run()
        r_h.text = s_title
        r_h.font.name = FONT
        r_h.font.size = Pt(10)
        r_h.font.bold = True
        r_h.font.color.rgb = clr

        tb_b = s13.shapes.add_textbox(Inches(cx + 0.1), Inches(2.3), Inches(2.65), Inches(4.3))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for b_idx, (head, desc) in enumerate(s_items):
            p = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p.space_before = Pt(8)
            r1 = p.add_run()
            r1.text = f"• {head} "
            r1.font.name = FONT
            r1.font.size = Pt(10)
            r1.font.bold = True
            r1.font.color.rgb = TEXT_TITLE
            r2 = p.add_run()
            r2.text = desc
            r2.font.name = FONT
            r2.font.size = Pt(9.5)
            r2.font.color.rgb = TEXT_BODY

    add_footer(s13, 13, 17)

    # =========================================================================
    # SLIDE 14: DATA SECURITY & HOW WE HANDLE DATA
    # =========================================================================
    s14 = create_slide_base(prs)
    add_header(s14, "Data Security & Privacy: How We Protect & Handle Data", "Data Security & DPDP")

    sec_pillars = [
        ("🔐 1. Zero-Knowledge Architecture", [
            ("No Permanent Storage:", "JOY TRUE PROFILE acts as a verification pass-through gateway."),
            ("Masked PII Identifiers:", "Sensitive Aadhaar numbers are masked to XXXX-XXXX-1234 before report generation."),
            ("Ephemeral Cache:", "Candidate OTP payloads are scrubbed from RAM immediately after verification.")
        ], EMERALD, EMERALD_BG, EMERALD_BORDER),
        ("🛡️ 2. Bank-Grade Encryption", [
            ("AES-256 at Rest:", "All database records, credentials, and tokens are encrypted using AES-256."),
            ("TLS 1.3 in Transit:", "All communication between portals, candidates, and government APIs uses TLS 1.3."),
            ("Hardware Security Module:", "Cryptographic keys are managed through isolated secure key vaults.")
        ], ROYAL_BLUE, BLUE_BG, BLUE_BORDER),
        ("⚖️ 3. DPDP Act 2023 Compliance", [
            ("Explicit Digital Consent:", "Every candidate explicitly consents to background verification before submission."),
            ("Purpose Limitation:", "Data is strictly used for employer verification and never shared with third parties."),
            ("Right to Erasure:", "Fully compliant with Indian statutory Digital Personal Data Protection laws.")
        ], PURPLE, PURPLE_BG, PURPLE_BORDER),
        ("🏢 4. Multi-Tenant Data Isolation", [
            ("Row-Level Security (RLS):", "Each company's candidate data is strictly isolated with independent encryption scopes."),
            ("Role-Based Access Control:", "Super Admin, Company Admin, and HR Recruiters see only authorized data."),
            ("Zero Data Leakage:", "Guarantees no cross-tenant visibility between competing enterprise clients.")
        ], AMBER, AMBER_BG, AMBER_BORDER)
    ]

    for idx, (s_title, s_items, clr, bg, border) in enumerate(sec_pillars):
        cx = 0.8 + idx * 2.95
        add_card(s14, cx, 1.45, 2.85, 5.25, bg_color=CARD_WHITE, border_color=border)
        
        hb = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.1), Inches(1.55), Inches(2.65), Inches(0.65))
        hb.fill.solid()
        hb.fill.fore_color.rgb = bg
        hb.line.color.rgb = border
        hb.line.width = Pt(1)
        tf_hb = hb.text_frame
        tf_hb.word_wrap = True
        p_h = tf_hb.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        r_h = p_h.add_run()
        r_h.text = s_title
        r_h.font.name = FONT
        r_h.font.size = Pt(10)
        r_h.font.bold = True
        r_h.font.color.rgb = clr

        tb_b = s14.shapes.add_textbox(Inches(cx + 0.1), Inches(2.3), Inches(2.65), Inches(4.3))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for b_idx, (head, desc) in enumerate(s_items):
            p = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p.space_before = Pt(8)
            r1 = p.add_run()
            r1.text = f"• {head} "
            r1.font.name = FONT
            r1.font.size = Pt(10)
            r1.font.bold = True
            r1.font.color.rgb = TEXT_TITLE
            r2 = p.add_run()
            r2.text = desc
            r2.font.name = FONT
            r2.font.size = Pt(9.5)
            r2.font.color.rgb = TEXT_BODY

    add_footer(s14, 14, 17)

    # =========================================================================
    # SLIDE 15: COMPARISON MATRIX (How It Differs & Reduces Work)
    # =========================================================================
    s15 = create_slide_base(prs)
    add_header(s15, "How JOY TRUE PROFILE is Different & Better", "Comparison Matrix")

    # Table Card
    add_card(s15, 0.8, 1.45, 11.733, 5.25, bg_color=CARD_WHITE, border_color=CARD_BORDER)

    # Create 6-row x 3-col Table
    rows = 6
    cols = 3
    left = Inches(1.0)
    top = Inches(1.65)
    width = Inches(11.333)
    height = Inches(4.85)

    table_shape = s15.shapes.add_table(rows, cols, left, top, width, height)
    tbl = table_shape.table
    tbl.columns[0].width = Inches(3.133)
    tbl.columns[1].width = Inches(4.1)
    tbl.columns[2].width = Inches(4.1)

    headers = ["Verification Feature", "Traditional Manual / Agency Method", "JOY TRUE PROFILE (Automated Engine)"]
    for col_idx, text in enumerate(headers):
        cell = tbl.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = EMERALD if col_idx == 2 else (RED_ALERT if col_idx == 1 else TEXT_TITLE)
        p = cell.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = text
        r.font.name = FONT
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = CARD_WHITE

    comparison_data = [
        ("Verification Speed", "14 to 21 business days (manual emails & calls)", "Sub-45 seconds via direct government APIs"),
        ("Source of Truth", "Physical photocopies easily altered with software", "Direct government cryptographic registries (UIDAI, NSDL, EPFO)"),
        ("Dual Job / Moonlighting", "Undetected — relies on self-reported candidate CV", "Instant automated EPFO history analysis catches overlap"),
        ("Candidate Experience", "Heavy printing, manual forms, and paper scanning", "Zero-install mobile web link via WhatsApp in < 2 mins"),
        ("HR Recruiter Burden", "70% of HR time spent chasing documents & agencies", "1-click dispatch, live tracking board, instant PDF dossier")
    ]

    for row_idx, (col0, col1, col2) in enumerate(comparison_data):
        r_num = row_idx + 1
        
        # Col 0: Feature Name
        cell0 = tbl.cell(r_num, 0)
        cell0.fill.solid()
        cell0.fill.fore_color.rgb = BG_LIGHT
        p0 = cell0.text_frame.paragraphs[0]
        r0 = p0.add_run()
        r0.text = col0
        r0.font.name = FONT
        r0.font.size = Pt(10.5)
        r0.font.bold = True
        r0.font.color.rgb = TEXT_TITLE

        # Col 1: Old Method (Red tint)
        cell1 = tbl.cell(r_num, 1)
        cell1.fill.solid()
        cell1.fill.fore_color.rgb = RED_BG
        p1 = cell1.text_frame.paragraphs[0]
        r1 = p1.add_run()
        r1.text = "❌ " + col1
        r1.font.name = FONT
        r1.font.size = Pt(10)
        r1.font.color.rgb = RED_ALERT

        # Col 2: JOY TRUE PROFILE (Green tint)
        cell2 = tbl.cell(r_num, 2)
        cell2.fill.solid()
        cell2.fill.fore_color.rgb = EMERALD_BG
        p2 = cell2.text_frame.paragraphs[0]
        r2 = p2.add_run()
        r2.text = "✔ " + col2
        r2.font.name = FONT
        r2.font.size = Pt(10)
        r2.font.bold = True
        r2.font.color.rgb = EMERALD

    add_footer(s15, 15, 17)

    # =========================================================================
    # SLIDE 16: BUSINESS VALUE & PROCESS REDUCTION
    # =========================================================================
    s16 = create_slide_base(prs)
    add_header(s16, "Business Value: How It Reduces Hiring Overhead", "Business Value")

    metrics = [
        ("⚡ 90% Faster Turnaround", [
            ("Instant Clearance:", "Reduces candidate verification waiting time from 14 days down to under 45 seconds."),
            ("Zero Candidate Drop-off:", "Candidates are onboarded immediately before they explore competing offers."),
            ("Rapid Scaling:", "Enables high-volume hiring without adding extra HR administrative staff.")
        ], EMERALD, EMERALD_BG, EMERALD_BORDER),
        ("💰 85% Process Cost Savings", [
            ("Direct Model:", "Replaces expensive manual agencies with direct automated API verification."),
            ("No Physical Paperwork:", "Eliminates physical scanning, printing, couriers, and storage overhead."),
            ("Transparent Postpaid Billing:", "Pay only for verified checks with transparent monthly GST invoicing.")
        ], ROYAL_BLUE, BLUE_BG, BLUE_BORDER),
        ("🛡️ 100% Audit Readiness", [
            ("CLRA & DPDP Compliance:", "Shields company from severe regulatory fines and contractor compliance penalties."),
            ("Court-Admissible Dossiers:", "Master PDF reports equipped with QR code and cryptographic Certificate IDs."),
            ("Instant Auditor Access:", "Client auditors can verify authenticity directly from their smartphones.")
        ], PURPLE, PURPLE_BG, PURPLE_BORDER),
        ("📱 Frictionless Candidate Delight", [
            ("WhatsApp Convenience:", "Candidates complete self-verification on mobile in under 2 minutes."),
            ("No App Downloads:", "Browser-based onboarding with guided camera selfie capture."),
            ("Respects Privacy:", "Candidate data is protected under India's DPDP Act 2023 guidelines.")
        ], AMBER, AMBER_BG, AMBER_BORDER)
    ]

    for idx, (m_title, m_items, clr, bg, border) in enumerate(metrics):
        cx = 0.8 + idx * 2.95
        add_card(s16, cx, 1.45, 2.85, 5.25, bg_color=CARD_WHITE, border_color=border)
        
        hb = s16.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.1), Inches(1.55), Inches(2.65), Inches(0.65))
        hb.fill.solid()
        hb.fill.fore_color.rgb = bg
        hb.line.color.rgb = border
        hb.line.width = Pt(1)
        tf_hb = hb.text_frame
        tf_hb.word_wrap = True
        p_h = tf_hb.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        r_h = p_h.add_run()
        r_h.text = m_title
        r_h.font.name = FONT
        r_h.font.size = Pt(10)
        r_h.font.bold = True
        r_h.font.color.rgb = clr

        tb_b = s16.shapes.add_textbox(Inches(cx + 0.1), Inches(2.3), Inches(2.65), Inches(4.3))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for b_idx, (head, desc) in enumerate(m_items):
            p = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p.space_before = Pt(8)
            r1 = p.add_run()
            r1.text = f"• {head} "
            r1.font.name = FONT
            r1.font.size = Pt(10)
            r1.font.bold = True
            r1.font.color.rgb = TEXT_TITLE
            r2 = p.add_run()
            r2.text = desc
            r2.font.name = FONT
            r2.font.size = Pt(9.5)
            r2.font.color.rgb = TEXT_BODY

    add_footer(s16, 16, 17)

    # =========================================================================
    # SLIDE 17: THANK YOU SLIDE (Clean, Elegant & Neat - No Contact Details)
    # =========================================================================
    s17 = create_slide_base(prs)
    
    top_bar17 = s17.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_bar17.fill.solid()
    top_bar17.fill.fore_color.rgb = EMERALD
    top_bar17.line.fill.background()

    add_card(s17, 0.8, 0.9, 11.733, 5.8, bg_color=CARD_WHITE, border_color=CARD_BORDER)

    # Center Shield Emblem
    if os.path.exists(logo_path):
        s17.shapes.add_picture(logo_path, Inches(5.666), Inches(1.3), width=Inches(2.0))

    # Main Thank You Title
    tb17_t = s17.shapes.add_textbox(Inches(1.5), Inches(3.4), Inches(10.333), Inches(1.0))
    tf17_t = tb17_t.text_frame
    p17_t1 = tf17_t.paragraphs[0]
    p17_t1.alignment = PP_ALIGN.CENTER
    r17_t1 = p17_t1.add_run()
    r17_t1.text = "Thank You!"
    r17_t1.font.name = FONT
    r17_t1.font.size = Pt(38)
    r17_t1.font.bold = True
    r17_t1.font.color.rgb = TEXT_TITLE

    p17_t2 = tf17_t.add_paragraph()
    p17_t2.space_before = Pt(6)
    p17_t2.alignment = PP_ALIGN.CENTER
    r17_t2 = p17_t2.add_run()
    r17_t2.text = "JOY TRUE PROFILE — Building Trust Through Direct Digital Verification"
    r17_t2.font.name = FONT
    r17_t2.font.size = Pt(16)
    r17_t2.font.bold = True
    r17_t2.font.color.rgb = ROYAL_BLUE

    # Elegant Vision Card
    box17 = s17.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.2), Inches(4.8), Inches(8.933), Inches(1.4))
    box17.fill.solid()
    box17.fill.fore_color.rgb = EMERALD_BG
    box17.line.color.rgb = EMERALD_BORDER
    box17.line.width = Pt(1)
    tf_b17 = box17.text_frame
    tf_b17.word_wrap = True
    pb1 = tf_b17.paragraphs[0]
    pb1.alignment = PP_ALIGN.CENTER
    rb1 = pb1.add_run()
    rb1.text = "“Transforming background verification with sub-45-second speed, zero paperwork, and complete data safety.”"
    rb1.font.name = FONT
    rb1.font.size = Pt(12.5)
    rb1.font.bold = True
    rb1.font.color.rgb = EMERALD

    pb2 = tf_b17.add_paragraph()
    pb2.space_before = Pt(6)
    pb2.alignment = PP_ALIGN.CENTER
    rb2 = pb2.add_run()
    rb2.text = "Empowering HR teams, enterprises, and candidates across India."
    rb2.font.name = FONT
    rb2.font.size = Pt(11)
    rb2.font.color.rgb = TEXT_BODY

    add_footer(s17, 17, 17)

    # Save to all requested target names
    target_files = [
        "JOYTRUEPROFILE.pptx",
        "JOY_TRUE_PROFILE_Master_Presentation.pptx",
        "JOY_TRUE_PROFILE_Presentation_With_Portals.pptx",
        "JOY_TRUE_PROFILE_Enterprise_Presentation.pptx"
    ]
    for out_name in target_files:
        try:
            prs.save(out_name)
            print(f"Successfully created presentation: '{out_name}'")
        except Exception as e:
            print(f"Note: '{out_name}' could not be overwritten: {e}")

if __name__ == "__main__":
    create_joytrueprofile_presentation()
