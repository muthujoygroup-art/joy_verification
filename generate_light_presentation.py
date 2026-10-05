import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml import parse_xml

def create_master_presentation():
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

    # Asset Paths
    logo_path = os.path.abspath("public/assets/logos/joy_true_profile_shield_emblem.png")
    corp_logo_path = os.path.abspath("public/assets/logos/companies/joy_corporate_solutions_logo.png")

    # Real Portal Mockups (High DPI Vector Mockups)
    mock_super_admin = os.path.abspath("public/assets/mockups/super_admin_mockup.png")
    mock_company_admin = os.path.abspath("public/assets/mockups/company_admin_mockup.png")
    mock_hr_workstation = os.path.abspath("public/assets/mockups/hr_workstation_mockup.png")
    mock_candidate_mobile = os.path.abspath("public/assets/mockups/candidate_mobile_mockup.png")
    mock_vendor_portal = os.path.abspath("public/assets/mockups/vendor_portal_mockup.png")
    mock_dossier_pdf = os.path.abspath("public/assets/mockups/dossier_pdf_mockup.png")

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

        # Category Pill (5.0" width ensures comfortable single-line fit)
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.32), Inches(5.0), Inches(0.34))
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

        # Slide Main Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.70), Inches(10.2), Inches(0.6))
        tf_title = tb_title.text_frame
        tf_title.word_wrap = True
        p_t = tf_title.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.name = FONT
        r_t.font.size = Pt(21)
        r_t.font.bold = True
        r_t.font.color.rgb = TEXT_TITLE

        # Top Right Logo
        if os.path.exists(logo_path):
            slide.shapes.add_picture(logo_path, Inches(11.8), Inches(0.28), width=Inches(0.75))

    def add_footer(slide, current_page, total_pages=14):
        # Line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.9), Inches(11.733), Inches(0.015))
        line.fill.solid()
        line.fill.fore_color.rgb = CARD_BORDER
        line.line.fill.background()

        # Left Text
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(6.95), Inches(9.5), Inches(0.35))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = "JOY TRUE PROFILE  •  JOY CORPORATE SOLUTIONS PRIVATE LIMITED  •  CONFIDENTIAL"
        r.font.name = FONT
        r.font.size = Pt(8.5)
        r.font.color.rgb = TEXT_MUTED

        # Page Number
        tb_n = slide.shapes.add_textbox(Inches(10.5), Inches(6.95), Inches(2.0), Inches(0.35))
        tf_n = tb_n.text_frame
        p_n = tf_n.paragraphs[0]
        p_n.alignment = PP_ALIGN.RIGHT
        r_n = p_n.add_run()
        r_n.text = f"{current_page} / {total_pages}"
        r_n.font.name = FONT
        r_n.font.size = Pt(8.5)
        r_n.font.bold = True
        r_n.font.color.rgb = TEXT_MUTED

    def add_card(slide, left, top, width, height, bg_color=CARD_WHITE, border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1.2)
        else:
            card.line.fill.background()
        return card

    # =========================================================================
    # SLIDE 1: TITLE SLIDE (Premium Clean Light Theme)
    # =========================================================================
    s1 = create_slide_base(prs)
    
    top_bar1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_bar1.fill.solid()
    top_bar1.fill.fore_color.rgb = EMERALD
    top_bar1.line.fill.background()

    # Left Container Card
    add_card(s1, 0.8, 0.9, 7.6, 5.8, bg_color=CARD_WHITE, border_color=CARD_BORDER)

    # Category Badge
    pill1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.1), Inches(1.2), Inches(5.2), Inches(0.38))
    pill1.fill.solid()
    pill1.fill.fore_color.rgb = EMERALD_BG
    pill1.line.color.rgb = EMERALD_BORDER
    tf_p1 = pill1.text_frame
    p_p1 = tf_p1.paragraphs[0]
    p_p1.alignment = PP_ALIGN.CENTER
    r_p1 = p_p1.add_run()
    r_p1.text = "NEXT-GENERATION VERIFICATION PLATFORM"
    r_p1.font.name = FONT
    r_p1.font.size = Pt(10.5)
    r_p1.font.bold = True
    r_p1.font.color.rgb = EMERALD

    # Project Title
    tb_t1 = s1.shapes.add_textbox(Inches(1.1), Inches(1.68), Inches(7.0), Inches(1.4))
    tf_t1 = tb_t1.text_frame
    tf_t1.word_wrap = True
    p1 = tf_t1.paragraphs[0]
    r1 = p1.add_run()
    r1.text = "JOY TRUE PROFILE"
    r1.font.name = FONT
    r1.font.size = Pt(36)
    r1.font.bold = True
    r1.font.color.rgb = TEXT_TITLE

    p2 = tf_t1.add_paragraph()
    p2.space_before = Pt(4)
    r2 = p2.add_run()
    r2.text = "Fast, Accurate & Direct Workforce Background Verification"
    r2.font.name = FONT
    r2.font.size = Pt(16)
    r2.font.bold = True
    r2.font.color.rgb = ROYAL_BLUE

    # Simple Subtitle
    tb_sub1 = s1.shapes.add_textbox(Inches(1.1), Inches(3.2), Inches(7.0), Inches(1.3))
    tf_sub1 = tb_sub1.text_frame
    tf_sub1.word_wrap = True
    p_sub1 = tf_sub1.paragraphs[0]
    r_sub1 = p_sub1.add_run()
    r_sub1.text = "A complete cloud platform that checks employee and vendor records directly from government and banking databases in under 45 seconds.\n\nDeveloped & Operated by JOY Corporate Solutions Private Limited, Coimbatore."
    r_sub1.font.name = FONT
    r_sub1.font.size = Pt(11.5)
    r_sub1.font.color.rgb = TEXT_BODY

    # 3 Bottom Value Highlight Badges
    v_badges = [
        ("⚡ Under 45 Seconds", "Instant Government API Checks", EMERALD_BG, EMERALD),
        ("🛡️ 100% Legal & Safe", "Full DPDP Act 2023 Compliance", BLUE_BG, ROYAL_BLUE),
        ("💰 Pay-Per-Use", "Zero Advance Fees & Simple Pricing", AMBER_BG, AMBER)
    ]
    for idx, (b_title, b_sub, b_bg, b_clr) in enumerate(v_badges):
        b_x = 1.1 + idx * 2.3
        box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(b_x), Inches(4.85), Inches(2.15), Inches(1.35))
        box.fill.solid()
        box.fill.fore_color.rgb = b_bg
        box.line.color.rgb = b_clr
        box.line.width = Pt(1)
        tf_bx = box.text_frame
        tf_bx.word_wrap = True
        p_b1 = tf_bx.paragraphs[0]
        r_b1 = p_b1.add_run()
        r_b1.text = b_title
        r_b1.font.name = FONT
        r_b1.font.size = Pt(10.5)
        r_b1.font.bold = True
        r_b1.font.color.rgb = b_clr
        p_b2 = tf_bx.add_paragraph()
        p_b2.space_before = Pt(4)
        r_b2 = p_b2.add_run()
        r_b2.text = b_sub
        r_b2.font.name = FONT
        r_b2.font.size = Pt(9)
        r_b2.font.color.rgb = TEXT_BODY

    # Right Side Graphic & Project Logo Card
    add_card(s1, 8.6, 0.9, 3.933, 5.8, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(logo_path):
        s1.shapes.add_picture(logo_path, Inches(9.4), Inches(1.3), width=Inches(2.3))

    tb_r1 = s1.shapes.add_textbox(Inches(8.8), Inches(4.0), Inches(3.5), Inches(2.3))
    tf_r1 = tb_r1.text_frame
    tf_r1.word_wrap = True
    pr1 = tf_r1.paragraphs[0]
    pr1.alignment = PP_ALIGN.CENTER
    rr1 = pr1.add_run()
    rr1.text = "JOY TRUE PROFILE"
    rr1.font.name = FONT
    rr1.font.size = Pt(15)
    rr1.font.bold = True
    rr1.font.color.rgb = TEXT_TITLE

    pr2 = tf_r1.add_paragraph()
    pr2.space_before = Pt(4)
    pr2.alignment = PP_ALIGN.CENTER
    rr2 = pr2.add_run()
    rr2.text = "Direct Digital Verification Rail\nConnecting HRs, Candidates & Vendors"
    rr2.font.name = FONT
    rr2.font.size = Pt(10.5)
    rr2.font.color.rgb = TEXT_MUTED

    add_footer(s1, 1, 14)

    # =========================================================================
    # SLIDE 2: PURPOSE OF THIS PROJECT (Problem & Purpose)
    # =========================================================================
    s2 = create_slide_base(prs)
    add_header(s2, "Purpose of This Project: Why We Built Joy True Profile", "Problem & Purpose")

    # Left: Old Traditional Way (Red Card)
    add_card(s2, 0.8, 1.4, 5.7, 5.3, bg_color=RED_BG, border_color=RED_BORDER)
    tb2_l = s2.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.3), Inches(4.9))
    tf2_l = tb2_l.text_frame
    tf2_l.word_wrap = True
    p = tf2_l.paragraphs[0]
    r = p.add_run()
    r.text = "❌ THE OLD WAY OF CHECKING (SLOW & RISKY)"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RED_ALERT

    old_pains = [
        ("Takes 15 to 20 Days:", "Long waiting times cause selected candidates to join competitors."),
        ("Fake Certificates & Papers:", "Easy to fake relieving letters, salary slips, and photocopied IDs."),
        ("Double Job (Moonlighting) Risk:", "No quick way to check if an employee is working two jobs simultaneously."),
        ("Ghost Contractor Billing:", "Contractor agencies billing for fake workers who never worked on site."),
        ("Heavy Monthly Advance Fees:", "Traditional agencies charge high fixed monthly retainer fees.")
    ]
    for h, b in old_pains:
        p = tf2_l.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = f"• {h} "
        r1.font.name = FONT
        r1.font.size = Pt(11)
        r1.font.bold = True
        r1.font.color.rgb = TEXT_TITLE
        r2 = p.add_run()
        r2.text = b
        r2.font.name = FONT
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_BODY

    # Right: The Joy True Profile Solution (Emerald Card)
    add_card(s2, 6.8, 1.4, 5.7, 5.3, bg_color=EMERALD_BG, border_color=EMERALD_BORDER)
    tb2_r = s2.shapes.add_textbox(Inches(7.0), Inches(1.55), Inches(5.3), Inches(4.9))
    tf2_r = tb2_r.text_frame
    tf2_r.word_wrap = True
    p = tf2_r.paragraphs[0]
    r = p.add_run()
    r.text = "✔ THE JOY TRUE PROFILE SOLUTION (FAST & RELIABLE)"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    joy_sol = [
        ("Instant Sub-45 Second Checks:", "Connects directly to government and bank servers for real-time results."),
        ("100% Genuine Digital Proof:", "Tamper-proof PDF report with a scannable QR code to confirm authenticity."),
        ("Automatic Double Job Alert:", "Checks PF records to instantly find overlapping employment histories."),
        ("Labor Law Compliance (Form XVI):", "Matches gate entries with PF deposits to eliminate ghost contractor billing."),
        ("Simple Pay-Per-Candidate Model:", "No setup fees, no monthly retainers. Pay only for verified profiles.")
    ]
    for h, b in joy_sol:
        p = tf2_r.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = f"✔ {h} "
        r1.font.name = FONT
        r1.font.size = Pt(11)
        r1.font.bold = True
        r1.font.color.rgb = EMERALD
        r2 = p.add_run()
        r2.text = b
        r2.font.name = FONT
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_BODY

    add_footer(s2, 2, 14)

    # =========================================================================
    # SLIDE 3: FEATURES OF THIS PROJECT (Core Capabilities)
    # =========================================================================
    s3 = create_slide_base(prs)
    add_header(s3, "Features of JOY TRUE PROFILE: What the System Does", "Core Features")

    feat_boxes = [
        ("🆔 1. Identity Verification", [
            "Aadhaar OTP & instant demographic match",
            "PAN card verification with name match score",
            "Driving License and Vehicle RC check",
            "Passport verification for global roles"
        ], EMERALD, EMERALD_BG),
        ("🏦 2. Bank Account Test", [
            "₹1 Penny Drop test via IMPS banking network",
            "Confirms exact registered account holder name",
            "Validates bank branch and active account status",
            "Eliminates salary transfer mistakes & fraud"
        ], ROYAL_BLUE, BLUE_BG),
        ("🏢 3. PF & Job History Check", [
            "Direct EPFO Universal Account Number lookup",
            "Full employment timeline and company history",
            "Flags double employment & moonlighting",
            "Nationwide court and litigation record check"
        ], PURPLE, PURPLE_BG),
        ("📱 4. Mobile Portal & DigiLocker", [
            "1-Click WhatsApp invite link with secure PIN",
            "Pulls original college degrees via DigiLocker",
            "3D live camera selfie to match Aadhaar photo",
            "Certified PDF report ready to download"
        ], AMBER, AMBER_BG)
    ]

    for idx, (f_title, f_items, clr, bg_clr) in enumerate(feat_boxes):
        cx = 0.8 + idx * 2.95
        add_card(s3, cx, 1.45, 2.85, 5.25, bg_color=CARD_WHITE, border_color=CARD_BORDER)
        
        hb = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.1), Inches(1.55), Inches(2.65), Inches(0.65))
        hb.fill.solid()
        hb.fill.fore_color.rgb = clr
        hb.line.fill.background()
        tf_hb = hb.text_frame
        tf_hb.word_wrap = True
        p_h = tf_hb.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        r_h = p_h.add_run()
        r_h.text = f_title
        r_h.font.name = FONT
        r_h.font.size = Pt(10.5)
        r_h.font.bold = True
        r_h.font.color.rgb = CARD_WHITE

        tb_b = s3.shapes.add_textbox(Inches(cx + 0.1), Inches(2.3), Inches(2.65), Inches(4.2))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for b_idx, item in enumerate(f_items):
            p = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p.space_before = Pt(8)
            r = p.add_run()
            r.text = f"• {item}"
            r.font.name = FONT
            r.font.size = Pt(10)
            r.font.color.rgb = TEXT_BODY

    add_footer(s3, 3, 14)

    # =========================================================================
    # SLIDE 4: SHORT WORKFLOW OF THIS PROJECT (5 Easy Steps)
    # =========================================================================
    s4 = create_slide_base(prs)
    add_header(s4, "Short Workflow of the Project: 5 Simple Steps", "End-to-End Process")

    wf_steps = [
        ("Step 1: HR Enters Candidate", "HR enters candidate basic details or uploads an Excel sheet with 500+ candidates in one click.", EMERALD),
        ("Step 2: WhatsApp Link Sent", "Candidate automatically receives a personal WhatsApp and SMS link with a secure 4-digit PIN.", ROYAL_BLUE),
        ("Step 3: Candidate Verifies on Phone", "Candidate opens the link, enters PIN, completes Aadhaar OTP, pulls DigiLocker degree, and takes a selfie.", PURPLE),
        ("Step 4: Sub-45s Instant Database Check", "System instantly checks Aadhaar, PAN, Bank account, and PF job history directly from official servers.", AMBER),
        ("Step 5: Download Certified PDF Report", "HR downloads the official background verification dossier complete with corporate logo and scannable QR code.", EMERALD)
    ]

    for idx, (st_title, st_desc, st_clr) in enumerate(wf_steps):
        cy = 1.45 + idx * 1.03
        add_card(s4, 0.8, cy, 11.733, 0.9, bg_color=CARD_WHITE, border_color=CARD_BORDER)
        
        badge = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.95), Inches(cy + 0.15), Inches(2.8), Inches(0.6))
        badge.fill.solid()
        badge.fill.fore_color.rgb = st_clr
        badge.line.fill.background()
        tf_bg = badge.text_frame
        tf_bg.word_wrap = True
        p_bg = tf_bg.paragraphs[0]
        p_bg.alignment = PP_ALIGN.CENTER
        r_bg = p_bg.add_run()
        r_bg.text = st_title
        r_bg.font.name = FONT
        r_bg.font.size = Pt(10.5)
        r_bg.font.bold = True
        r_bg.font.color.rgb = CARD_WHITE

        tb_d = s4.shapes.add_textbox(Inches(3.9), Inches(cy + 0.12), Inches(8.4), Inches(0.68))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = st_desc
        r_d.font.name = FONT
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = TEXT_BODY

    add_footer(s4, 4, 14)

    # =========================================================================
    # SLIDE 5: SUPER ADMIN PORTAL (With Real Portal Browser Mockup Image)
    # =========================================================================
    s5 = create_slide_base(prs)
    add_header(s5, "Portal 1: Super Admin Portal — Master Control Console", "Portal Architecture (1/5)")

    # Left: Features & Workflow
    add_card(s5, 0.8, 1.4, 5.8, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb5_l = s5.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.4), Inches(5.0))
    tf5_l = tb5_l.text_frame
    tf5_l.word_wrap = True

    p = tf5_l.paragraphs[0]
    r = p.add_run()
    r.text = "👑 SUPER ADMIN PORTAL — FEATURES & WORKFLOW"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = PURPLE

    sa_details = [
        ("Manage All Client Companies:", "Onboard client companies, verify CIN/GSTIN, and activate accounts."),
        ("Live API Speed & Uptime Tracker:", "Real-time tracker for Aadhaar, PAN, Bank, and EPFO servers."),
        ("Custom Pricing & Credit Setup:", "Set custom per-check tariffs and postpaid credit limits per company."),
        ("Complete System Security Audit:", "Oversee platform activity, export logs, and DPDP compliance records.")
    ]
    for h, b in sa_details:
        p = tf5_l.add_paragraph()
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

    p_w = tf5_l.add_paragraph()
    p_w.space_before = Pt(10)
    r_w = p_w.add_run()
    r_w.text = "⚙️ Super Admin Operational Workflow:"
    r_w.font.name = FONT
    r_w.font.size = Pt(11)
    r_w.font.bold = True
    r_w.font.color.rgb = PURPLE

    p_w2 = tf5_l.add_paragraph()
    p_w2.space_before = Pt(4)
    r_w2 = p_w2.add_run()
    r_w2.text = "1. Add Company ➔ 2. Set Custom Price ➔ 3. Monitor Live API Speed ➔ 4. Oversee Monthly Invoices"
    r_w2.font.name = FONT
    r_w2.font.size = Pt(9.5)
    r_w2.font.bold = True
    r_w2.font.color.rgb = TEXT_BODY

    # Right: Real Super Admin Browser Mockup
    add_card(s5, 6.8, 1.4, 5.733, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_super_admin):
        s5.shapes.add_picture(mock_super_admin, Inches(7.0), Inches(1.55), width=Inches(5.333))

    tb5_r = s5.shapes.add_textbox(Inches(7.0), Inches(4.85), Inches(5.333), Inches(1.7))
    tf5_r = tb5_r.text_frame
    tf5_r.word_wrap = True
    pr1 = tf5_r.paragraphs[0]
    rr1 = pr1.add_run()
    rr1.text = "🖥️ Live Super Admin Workstation View"
    rr1.font.name = FONT
    rr1.font.size = Pt(11.5)
    rr1.font.bold = True
    rr1.font.color.rgb = PURPLE

    pr2 = tf5_r.add_paragraph()
    pr2.space_before = Pt(4)
    rr2 = pr2.add_run()
    rr2.text = "Direct registry control center monitoring tenant enterprise client activations, gateway latency, and platform security."
    rr2.font.name = FONT
    rr2.font.size = Pt(10)
    rr2.font.color.rgb = TEXT_BODY

    add_footer(s5, 5, 14)

    # =========================================================================
    # SLIDE 6: COMPANY ADMIN PORTAL (With Real Portal Browser Mockup Image)
    # =========================================================================
    s6 = create_slide_base(prs)
    add_header(s6, "Portal 2: Company Admin Portal — Corporate Headquarters", "Portal Architecture (2/5)")

    # Left: Features & Workflow
    add_card(s6, 0.8, 1.4, 5.8, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb6_l = s6.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.4), Inches(5.0))
    tf6_l = tb6_l.text_frame
    tf6_l.word_wrap = True

    p = tf6_l.paragraphs[0]
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
        p = tf6_l.add_paragraph()
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

    p_w = tf6_l.add_paragraph()
    p_w.space_before = Pt(10)
    r_w = p_w.add_run()
    r_w.text = "⚙️ Company Admin Operational Workflow:"
    r_w.font.name = FONT
    r_w.font.size = Pt(11)
    r_w.font.bold = True
    r_w.font.color.rgb = ROYAL_BLUE

    p_w2 = tf6_l.add_paragraph()
    p_w2.space_before = Pt(4)
    r_w2 = p_w2.add_run()
    r_w2.text = "1. Set Company Logo ➔ 2. Add HR Recruiters ➔ 3. Monitor All Candidate Checks ➔ 4. Pay Monthly 18% GST Bill"
    r_w2.font.name = FONT
    r_w2.font.size = Pt(9.5)
    r_w2.font.bold = True
    r_w2.font.color.rgb = TEXT_BODY

    # Right: Real Company Admin Browser Mockup
    add_card(s6, 6.8, 1.4, 5.733, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_company_admin):
        s6.shapes.add_picture(mock_company_admin, Inches(7.0), Inches(1.55), width=Inches(5.333))

    tb6_r = s6.shapes.add_textbox(Inches(7.0), Inches(4.85), Inches(5.333), Inches(1.7))
    tf6_r = tb6_r.text_frame
    tf6_r.word_wrap = True
    pr1 = tf6_r.paragraphs[0]
    rr1 = pr1.add_run()
    rr1.text = "🖥️ Live Company Admin Console View"
    rr1.font.name = FONT
    rr1.font.size = Pt(11.5)
    rr1.font.bold = True
    rr1.font.color.rgb = ROYAL_BLUE

    pr2 = tf6_r.add_paragraph()
    pr2.space_before = Pt(4)
    rr2 = pr2.add_run()
    rr2.text = "Executive management hub for HR team oversight, branch control, postpaid wallet monitoring, and 1-click tax invoice settlement."
    rr2.font.name = FONT
    rr2.font.size = Pt(10)
    rr2.font.color.rgb = TEXT_BODY

    add_footer(s6, 6, 14)

    # =========================================================================
    # SLIDE 7: HR EXECUTIVE WORKSTATION (With Real HR Workstation Mockup Image)
    # =========================================================================
    s7 = create_slide_base(prs)
    add_header(s7, "Portal 3: HR Executive Workstation — Recruiter Dashboard", "Portal Architecture (3/5)")

    # Left: Features & Workflow
    add_card(s7, 0.8, 1.4, 5.8, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb7_l = s7.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.4), Inches(5.0))
    tf7_l = tb7_l.text_frame
    tf7_l.word_wrap = True

    p = tf7_l.paragraphs[0]
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
        ("1-Click Master PDF Dossier:", "Download the complete verified report stamped with company logo, QR code, and digital seal.")
    ]
    for h, b in hr_details:
        p = tf7_l.add_paragraph()
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

    p_w = tf7_l.add_paragraph()
    p_w.space_before = Pt(9)
    r_w = p_w.add_run()
    r_w.text = "⚙️ HR Recruiter Daily Workflow:"
    r_w.font.name = FONT
    r_w.font.size = Pt(11)
    r_w.font.bold = True
    r_w.font.color.rgb = EMERALD

    p_w2 = tf7_l.add_paragraph()
    p_w2.space_before = Pt(3)
    r_w2 = p_w2.add_run()
    r_w2.text = "1. Enter Candidate / Excel ➔ 2. Send WhatsApp Link ➔ 3. Watch Live Status ➔ 4. Download PDF Dossier"
    r_w2.font.name = FONT
    r_w2.font.size = Pt(9.5)
    r_w2.font.bold = True
    r_w2.font.color.rgb = TEXT_BODY

    # Right: Real HR Workstation Browser Mockup
    add_card(s7, 6.8, 1.4, 5.733, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_hr_workstation):
        s7.shapes.add_picture(mock_hr_workstation, Inches(7.0), Inches(1.55), width=Inches(5.333))

    tb7_r = s7.shapes.add_textbox(Inches(7.0), Inches(4.85), Inches(5.333), Inches(1.7))
    tf7_r = tb7_r.text_frame
    tf7_r.word_wrap = True
    pr1 = tf7_r.paragraphs[0]
    rr1 = pr1.add_run()
    rr1.text = "🖥️ Live HR Executive Workstation View"
    rr1.font.name = FONT
    rr1.font.size = Pt(11.5)
    rr1.font.bold = True
    rr1.font.color.rgb = EMERALD

    pr2 = tf7_r.add_paragraph()
    pr2.space_before = Pt(4)
    rr2 = pr2.add_run()
    rr2.text = "Recruiter pipeline with employer company branding, bulk actions, candidate status filters, and instant one-click dossier export."
    rr2.font.name = FONT
    rr2.font.size = Pt(10)
    rr2.font.color.rgb = TEXT_BODY

    add_footer(s7, 7, 14)

    # =========================================================================
    # SLIDE 8: CANDIDATE SELF-VERIFICATION PORTAL (With Real Smartphone Mockup)
    # =========================================================================
    s8 = create_slide_base(prs)
    add_header(s8, "Portal 4: Candidate Portal — Frictionless Mobile Web App", "Portal Architecture (4/5)")

    # Left: Features & Workflow (Clean balanced card)
    add_card(s8, 0.8, 1.4, 6.4, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb8_l = s8.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(6.0), Inches(5.0))
    tf8_l = tb8_l.text_frame
    tf8_l.word_wrap = True

    p = tf8_l.paragraphs[0]
    r = p.add_run()
    r.text = "📱 CANDIDATE PORTAL — FEATURES & WORKFLOW"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = AMBER

    cand_details = [
        ("Zero Mobile App Install:", "Candidates open the link directly in their mobile browser without installing any app."),
        ("4-Digit PIN Security:", "Each candidate receives a personal PIN on WhatsApp to ensure only they can access their link."),
        ("Aadhaar OTP e-KYC:", "Instant paperless identity verification with automatic number masking (XXXX-XXXX-1234)."),
        ("DigiLocker Degree Fetch:", "1-Click connect to DigiLocker to pull verified 10th/12th marksheets, degrees, and licenses."),
        ("3D Camera Selfie Scan:", "Takes front, left, and right camera photos to confirm the person is real and prevent fake photos.")
    ]
    for h, b in cand_details:
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
    r_w.text = "⚙️ Candidate 2-Minute Onboarding Flow:"
    r_w.font.name = FONT
    r_w.font.size = Pt(11)
    r_w.font.bold = True
    r_w.font.color.rgb = AMBER

    p_w2 = tf8_l.add_paragraph()
    p_w2.space_before = Pt(4)
    r_w2 = p_w2.add_run()
    r_w2.text = "1. Open WhatsApp Link ➔ 2. Enter 4-Digit PIN ➔ 3. Enter Aadhaar OTP ➔ 4. Take Selfie & Submit"
    r_w2.font.name = FONT
    r_w2.font.size = Pt(9.5)
    r_w2.font.bold = True
    r_w2.font.color.rgb = TEXT_BODY

    # Right: Real Mobile Smartphone Mockup
    add_card(s8, 7.4, 1.4, 5.133, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_candidate_mobile):
        s8.shapes.add_picture(mock_candidate_mobile, Inches(8.7), Inches(1.5), height=Inches(4.4))

    tb8_r = s8.shapes.add_textbox(Inches(7.6), Inches(6.0), Inches(4.733), Inches(0.65))
    tf8_r = tb8_r.text_frame
    tf8_r.word_wrap = True
    pr1 = tf8_r.paragraphs[0]
    pr1.alignment = PP_ALIGN.CENTER
    rr1 = pr1.add_run()
    rr1.text = "📱 Frictionless Mobile Web App: 4-Digit PIN, Aadhaar e-KYC & 3D Selfie"
    rr1.font.name = FONT
    rr1.font.size = Pt(9.5)
    rr1.font.bold = True
    rr1.font.color.rgb = AMBER

    add_footer(s8, 8, 14)

    # =========================================================================
    # SLIDE 9: VENDOR & CONTRACTOR VERIFICATION (With Real Vendor Portal Mockup)
    # =========================================================================
    s9 = create_slide_base(prs)
    add_header(s9, "Portal 5: Vendor & Contractor Portal — CLRA Compliance", "Portal Architecture (5/5)")

    # Left: Features & Workflow
    add_card(s9, 0.8, 1.4, 5.8, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb9_l = s9.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.4), Inches(5.0))
    tf9_l = tb9_l.text_frame
    tf9_l.word_wrap = True

    p = tf9_l.paragraphs[0]
    r = p.add_run()
    r.text = "🤝 VENDOR & CONTRACTOR DUE DILIGENCE — FEATURES"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    vnd_details = [
        ("Vendor Legal Checks:", "Checks vendor Ministry of Corporate Affairs CIN, GSTIN status, Corporate PAN, and MSME registration."),
        ("₹1 Bank Account Test:", "Penny drop check confirms the vendor's bank account name exactly matches their trade legal name."),
        ("CLRA Form XVI Labor Register:", "Generates government-approved Contract Labor (Regulation & Abolition) muster automatically."),
        ("Anti-Ghost Worker Sync:", "Matches deployed factory workers against active PF/ESIC records to stop fraudulent billing.")
    ]
    for h, b in vnd_details:
        p = tf9_l.add_paragraph()
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

    p_w = tf9_l.add_paragraph()
    p_w.space_before = Pt(10)
    r_w = p_w.add_run()
    r_w.text = "⚙️ Vendor Due Diligence Workflow:"
    r_w.font.name = FONT
    r_w.font.size = Pt(11)
    r_w.font.bold = True
    r_w.font.color.rgb = EMERALD

    p_w2 = tf9_l.add_paragraph()
    p_w2.space_before = Pt(4)
    r_w2 = p_w2.add_run()
    r_w2.text = "1. Enter Vendor GSTIN ➔ 2. Direct Legal & Bank Check ➔ 3. Audit Contractor Workers ➔ 4. Export Due Diligence PDF"
    r_w2.font.name = FONT
    r_w2.font.size = Pt(9.5)
    r_w2.font.bold = True
    r_w2.font.color.rgb = TEXT_BODY

    # Right: Real Vendor Portal Browser Mockup
    add_card(s9, 6.8, 1.4, 5.733, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_vendor_portal):
        s9.shapes.add_picture(mock_vendor_portal, Inches(7.0), Inches(1.55), width=Inches(5.333))

    tb9_r = s9.shapes.add_textbox(Inches(7.0), Inches(4.85), Inches(5.333), Inches(1.7))
    tf9_r = tb9_r.text_frame
    tf9_r.word_wrap = True
    pr1 = tf9_r.paragraphs[0]
    rr1 = pr1.add_run()
    rr1.text = "🖥️ Live Vendor Verification Studio View"
    rr1.font.name = FONT
    rr1.font.size = Pt(11.5)
    rr1.font.bold = True
    rr1.font.color.rgb = EMERALD

    pr2 = tf9_r.add_paragraph()
    pr2.space_before = Pt(4)
    rr2 = pr2.add_run()
    rr2.text = "Automated statutory audit studio checking contractor legal authenticity, bank solvency, and contract labor compliance."
    rr2.font.name = FONT
    rr2.font.size = Pt(10)
    rr2.font.color.rgb = TEXT_BODY

    add_footer(s9, 9, 14)

    # =========================================================================
    # SLIDE 10: HOW IT DIFFERS FROM OTHER BGV PROJECTS (Comparison Table)
    # =========================================================================
    s10 = create_slide_base(prs)
    add_header(s10, "How JOY TRUE PROFILE is Different & Better", "Comparison Matrix")

    table_shape = s10.shapes.add_table(7, 3, Inches(0.8), Inches(1.4), Inches(11.733), Inches(5.3))
    table = table_shape.table
    table.columns[0].width = Inches(2.8)
    table.columns[1].width = Inches(4.4)
    table.columns[2].width = Inches(4.533)

    col_headers = ["Key Area", "Old Traditional BGV Agencies", "JOY TRUE PROFILE (Direct Rail)"]
    for i, head in enumerate(col_headers):
        cell = table.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = ROYAL_BLUE if i != 2 else EMERALD
        tf = cell.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = head
        r.font.name = FONT
        r.font.size = Pt(11.5)
        r.font.bold = True
        r.font.color.rgb = CARD_WHITE

    comp_rows = [
        ("Verification Speed", "15 to 20 Days (Manual phone calls)", "Under 45 Seconds (Direct database query)"),
        ("Data Accuracy", "High error rate from manual paper checks", "100% Genuine (Direct Government & Bank APIs)"),
        ("Double Job (Moonlighting)", "No check available (Zero PF visibility)", "Smart Live PF Check (Flags active double jobs)"),
        ("Report Security", "Static PDF (Easy to manipulate)", "Tamper-Proof PDF + Scannable QR Code"),
        ("Contractor Labor Check", "Manual paper records with ghost workers", "Automated Form XVI Register & Gate Sync"),
        ("Commercial Pricing", "Expensive advance retainers & lock-ins", "100% Pay-Per-Use with 18% GST Invoice")
    ]

    for row_idx, (k, old, joy) in enumerate(comp_rows, start=1):
        c0 = table.cell(row_idx, 0)
        c0.fill.solid()
        c0.fill.fore_color.rgb = RGBColor(241, 245, 249)
        tf0 = c0.text_frame
        p0 = tf0.paragraphs[0]
        r0 = p0.add_run()
        r0.text = k
        r0.font.name = FONT
        r0.font.size = Pt(10.5)
        r0.font.bold = True
        r0.font.color.rgb = TEXT_TITLE

        c1 = table.cell(row_idx, 1)
        c1.fill.solid()
        c1.fill.fore_color.rgb = RED_BG
        tf1 = c1.text_frame
        p1 = tf1.paragraphs[0]
        r1 = p1.add_run()
        r1.text = f"❌ {old}"
        r1.font.name = FONT
        r1.font.size = Pt(10.2)
        r1.font.color.rgb = RED_ALERT

        c2 = table.cell(row_idx, 2)
        c2.fill.solid()
        c2.fill.fore_color.rgb = EMERALD_BG
        tf2 = c2.text_frame
        p2 = tf2.paragraphs[0]
        r2 = p2.add_run()
        r2.text = f"✔ {joy}"
        r2.font.name = FONT
        r2.font.size = Pt(10.2)
        r2.font.bold = True
        r2.font.color.rgb = EMERALD

    add_footer(s10, 10, 14)

    # =========================================================================
    # SLIDE 11: UNIQUE IDEAS & SMART INNOVATIONS (With Real PDF Dossier Mockup)
    # =========================================================================
    s11 = create_slide_base(prs)
    add_header(s11, "Unique Ideas & Smart Innovations in This Project", "Innovation Highlights")

    # Left: Innovations
    add_card(s11, 0.8, 1.4, 5.8, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    tb11_l = s11.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.4), Inches(5.0))
    tf11_l = tb11_l.text_frame
    tf11_l.word_wrap = True

    p = tf11_l.paragraphs[0]
    r = p.add_run()
    r.text = "💡 5 PIONEERING INNOVATIONS"
    r.font.name = FONT
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    innovations_list = [
        ("⚡ Sub-45s Direct Government Rail:", "No middleman screening agencies. Direct parallel API lookups to UIDAI, NSDL, NPCI, and EPFO."),
        ("🛡️ Smart Moonlighting Radar:", "Analyzes active PF contribution records to immediately catch candidates secretly working two jobs."),
        ("📸 3D Live Selfie & Face Match:", "Interactive camera selfie scan matches face features with official Aadhaar photo to defeat deepfakes."),
        ("🏗️ CLRA Form XVI Gate Sync:", "Connects turnstile biometric entries directly to contractor PF/ESIC rolls, stopping fake worker billing."),
        ("🔐 Scannable QR Code on PDFs:", "Every dossier carries a live QR code. Anyone can scan with their phone to confirm authentic records.")
    ]
    for h, b in innovations_list:
        p = tf11_l.add_paragraph()
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

    # Right: Real Master Dossier PDF Mockup with QR Code
    add_card(s11, 6.8, 1.4, 5.733, 5.3, bg_color=CARD_WHITE, border_color=CARD_BORDER)
    if os.path.exists(mock_dossier_pdf):
        s11.shapes.add_picture(mock_dossier_pdf, Inches(7.0), Inches(1.55), width=Inches(5.333))

    tb11_r = s11.shapes.add_textbox(Inches(7.0), Inches(4.85), Inches(5.333), Inches(1.7))
    tf11_r = tb11_r.text_frame
    tf11_r.word_wrap = True
    pr1 = tf11_r.paragraphs[0]
    rr1 = pr1.add_run()
    rr1.text = "📄 Certified Dossier with Scannable QR Code"
    rr1.font.name = FONT
    rr1.font.size = Pt(11.5)
    rr1.font.bold = True
    rr1.font.color.rgb = EMERALD

    pr2 = tf11_r.add_paragraph()
    pr2.space_before = Pt(4)
    rr2 = pr2.add_run()
    rr2.text = "Master PDF report generated dynamically with official company logo, scannable QR verification badge, and SHA-256 digital seal."
    rr2.font.name = FONT
    rr2.font.size = Pt(10)
    rr2.font.color.rgb = TEXT_BODY

    add_footer(s11, 11, 14)

    # =========================================================================
    # SLIDE 12: DATA SECURITY & PRIVACY (Safe, Legal & Trustworthy)
    # =========================================================================
    s12 = create_slide_base(prs)
    add_header(s12, "Data Security & Privacy: 100% Safe, Legal & Compliant", "Security & DPDP Act 2023")

    sec_pillars = [
        ("🔒 1. 100% DPDP Act 2023 Compliant", [
            "Candidate gives clear digital consent before any check",
            "Timestamped consent log saved with IP and location",
            "Candidate has full right to view & manage their data",
            "100% compliant with Indian Data Protection laws"
        ], EMERALD),
        ("🛡️ 2. Bank-Grade 256-Bit Encryption", [
            "All stored files protected with 256-bit AES encryption",
            "TLS 1.3 secure network connection during verification",
            "Candidate passwords stored with salted cryptographic hash",
            "Zero unauthorized data leaks or external access"
        ], ROYAL_BLUE),
        ("👁️ 3. Automatic Number Masking", [
            "Aadhaar numbers masked automatically to XXXX-XXXX-1234",
            "PAN and Bank account details masked on preview screens",
            "Zero raw biometric fingerprint storage on servers",
            "Follows strict UIDAI government security rules"
        ], PURPLE),
        ("🏢 4. Multi-Company Data Privacy", [
            "Each company's candidate data is completely separate",
            "No company or recruiter can view another company's data",
            "Auto session logouts to protect unattended screens",
            "Instant security alerts for any suspicious activity"
        ], AMBER)
    ]

    for idx, (s_title, s_bullets, s_clr) in enumerate(sec_pillars):
        cx = 0.8 + idx * 2.95
        add_card(s12, cx, 1.45, 2.85, 5.25, bg_color=CARD_WHITE, border_color=CARD_BORDER)
        
        hb = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.1), Inches(1.55), Inches(2.65), Inches(0.65))
        hb.fill.solid()
        hb.fill.fore_color.rgb = s_clr
        hb.line.fill.background()
        tf_h = hb.text_frame
        tf_h.word_wrap = True
        p_h = tf_h.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        r_h = p_h.add_run()
        r_h.text = s_title
        r_h.font.name = FONT
        r_h.font.size = Pt(10)
        r_h.font.bold = True
        r_h.font.color.rgb = CARD_WHITE

        tb_b = s12.shapes.add_textbox(Inches(cx + 0.1), Inches(2.3), Inches(2.65), Inches(4.2))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for b_idx, bullet in enumerate(s_bullets):
            p = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p.space_before = Pt(8)
            r = p.add_run()
            r.text = f"• {bullet}"
            r.font.name = FONT
            r.font.size = Pt(10)
            r.font.color.rgb = TEXT_BODY

    add_footer(s12, 12, 14)

    # =========================================================================
    # SLIDE 13: COMMERCIAL MODEL & BUSINESS VALUE
    # =========================================================================
    s13 = create_slide_base(prs)
    add_header(s13, "Simple Postpaid Pricing & High Business Value", "Monetization & ROI")

    roi_cards = [
        ("⏱️ 95% Faster Hiring Speed", "Reduces verification turnaround from 20 days to under 45 seconds, stopping selected candidates from joining competitors.", EMERALD, EMERALD_BG),
        ("📉 60% Cost Reduction", "100% postpaid pay-per-candidate pricing eliminates expensive monthly agency retainers and overhead fees.", ROYAL_BLUE, BLUE_BG),
        ("🎯 99.98% Verification Accuracy", "Direct queries to UIDAI, NSDL, NPCI and EPFO eliminate human screening errors and fake certificates.", PURPLE, PURPLE_BG),
        ("🧾 Automated 18% GST Invoicing", "System generates monthly B2B 18% GST tax invoices with 1-click Razorpay, UPI, or NetBanking payment.", AMBER, AMBER_BG)
    ]

    for idx, (rt, rd, rc, rbg) in enumerate(roi_cards):
        row = idx // 2
        col = idx % 2
        cx = 0.8 + col * 5.95
        cy = 1.45 + row * 2.6
        
        add_card(s13, cx, cy, 5.75, 2.45, bg_color=CARD_WHITE, border_color=CARD_BORDER)
        
        rhb = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.15), Inches(cy + 0.15), Inches(5.45), Inches(0.48))
        rhb.fill.solid()
        rhb.fill.fore_color.rgb = rc
        rhb.line.fill.background()
        tf_rh = rhb.text_frame
        p_rh = tf_rh.paragraphs[0]
        r_rh = p_rh.add_run()
        r_rh.text = rt
        r_rh.font.name = FONT
        r_rh.font.size = Pt(11.5)
        r_rh.font.bold = True
        r_rh.font.color.rgb = CARD_WHITE

        tb_rd = s13.shapes.add_textbox(Inches(cx + 0.2), Inches(cy + 0.72), Inches(5.35), Inches(1.55))
        tf_rd = tb_rd.text_frame
        tf_rd.word_wrap = True
        p_rd = tf_rd.paragraphs[0]
        r_rd = p_rd.add_run()
        r_rd.text = rd
        r_rd.font.name = FONT
        r_rd.font.size = Pt(11)
        r_rd.font.color.rgb = TEXT_BODY

    add_footer(s13, 13, 14)

    # =========================================================================
    # SLIDE 14: THANK YOU SLIDE (Clean Welcoming Light Theme)
    # =========================================================================
    s14 = create_slide_base(prs)
    
    top_bar14 = s14.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_bar14.fill.solid()
    top_bar14.fill.fore_color.rgb = EMERALD
    top_bar14.line.fill.background()

    add_card(s14, 0.8, 0.9, 11.733, 5.8, bg_color=CARD_WHITE, border_color=CARD_BORDER)

    pill14 = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.2), Inches(5.0), Inches(0.38))
    pill14.fill.solid()
    pill14.fill.fore_color.rgb = EMERALD_BG
    pill14.line.color.rgb = EMERALD_BORDER
    tf_p14 = pill14.text_frame
    p_p14 = tf_p14.paragraphs[0]
    p_p14.alignment = PP_ALIGN.CENTER
    r_p14 = p_p14.add_run()
    r_p14.text = "THANK YOU FOR YOUR TIME & ATTENTION"
    r_p14.font.name = FONT
    r_p14.font.size = Pt(10.5)
    r_p14.font.bold = True
    r_p14.font.color.rgb = EMERALD

    tb14_t = s14.shapes.add_textbox(Inches(1.2), Inches(1.68), Inches(9.5), Inches(1.2))
    tf14_t = tb14_t.text_frame
    p14_t1 = tf14_t.paragraphs[0]
    r14_t1 = p14_t1.add_run()
    r14_t1.text = "Thank You! Let's Build Trust Together."
    r14_t1.font.name = FONT
    r14_t1.font.size = Pt(30)
    r14_t1.font.bold = True
    r14_t1.font.color.rgb = TEXT_TITLE

    p14_t2 = tf14_t.add_paragraph()
    p14_t2.space_before = Pt(4)
    r14_t2 = p14_t2.add_run()
    r14_t2.text = "Transform your workforce and vendor verification with sub-45-second direct government rails."
    r14_t2.font.name = FONT
    r14_t2.font.size = Pt(13.5)
    r14_t2.font.bold = True
    r14_t2.font.color.rgb = ROYAL_BLUE

    contact_info = [
        ("🏢 Corporate Office", "JOY CORPORATE SOLUTIONS PRIVATE LIMITED\nCoimbatore, Tamil Nadu, India\nPIN: 641001", EMERALD, EMERALD_BG),
        ("📧 Enterprise Email & Web", "Email: info@joycorporatesolutions.com\nWeb: verification.joycorporatesolutions.com\nHR Suite: joypeoplehr.com", ROYAL_BLUE, BLUE_BG),
        ("📞 Direct Phone & Demos", "Phone / WhatsApp: +91 99946 99044\nOperational Hours: Monday - Saturday\n9:00 AM - 7:00 PM IST", AMBER, AMBER_BG)
    ]

    for idx, (ctit, ctxt, cclr, cbg) in enumerate(contact_info):
        cx = 1.2 + idx * 3.7
        add_card(s14, cx, 3.1, 3.5, 3.2, bg_color=cbg, border_color=cclr)
        
        tb_c = s14.shapes.add_textbox(Inches(cx + 0.15), Inches(3.25), Inches(3.2), Inches(2.9))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        pc1 = tf_c.paragraphs[0]
        rpc1 = pc1.add_run()
        rpc1.text = ctit
        rpc1.font.name = FONT
        rpc1.font.size = Pt(12)
        rpc1.font.bold = True
        rpc1.font.color.rgb = cclr
        
        pc2 = tf_c.add_paragraph()
        pc2.space_before = Pt(10)
        rpc2 = pc2.add_run()
        rpc2.text = ctxt
        rpc2.font.name = FONT
        rpc2.font.size = Pt(11)
        rpc2.font.color.rgb = TEXT_BODY

    add_footer(s14, 14, 14)

    # Save to presentation files
    target_files = [
        "JOY_TRUE_PROFILE_Master_Presentation.pptx",
        "JOY_TRUE_PROFILE_Presentation_With_Portals.pptx",
        "JOY_TRUE_PROFILE_Professional_Presentation.pptx",
        "JOY_TRUE_PROFILE_Enterprise_Presentation.pptx"
    ]
    for out_name in target_files:
        try:
            prs.save(out_name)
            print(f"Successfully created presentation: '{out_name}'")
        except Exception as e:
            print(f"Note: '{out_name}' could not be overwritten: {e}")

if __name__ == "__main__":
    create_master_presentation()
