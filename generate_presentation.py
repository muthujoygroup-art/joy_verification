import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_joy_true_profile_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions (13.333" x 7.5")
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Global Font Constant
    FONT_FAMILY = "Times New Roman"

    # Professional Executive Color Palette
    NAVY_DEEP = RGBColor(10, 25, 47)        # #0A192F (Dark Executive Background)
    NAVY_CARD = RGBColor(18, 38, 71)        # #122647 (Dark Card Background)
    NAVY_BORDER = RGBColor(30, 58, 102)     # #1E3A66
    EMERALD = RGBColor(16, 185, 129)        # #10B981 (Primary Accent)
    EMERALD_DARK = RGBColor(5, 150, 105)    # #059669
    EMERALD_LIGHT = RGBColor(236, 253, 245) # #ECFDF5
    SKY_BLUE = RGBColor(14, 165, 233)       # #0EA5E9 (Tech Accent)
    SKY_LIGHT = RGBColor(240, 249, 255)     # #F0F9FF
    AMBER = RGBColor(245, 158, 11)          # #F59E0B
    AMBER_LIGHT = RGBColor(254, 243, 199)   # #FEF3C7
    PURPLE = RGBColor(139, 92, 246)         # #8B5CF6
    PURPLE_LIGHT = RGBColor(245, 243, 255)  # #F5F3FF
    SLATE_BG = RGBColor(248, 250, 252)      # #F8FAFC (Clean Light Canvas)
    SLATE_BORDER = RGBColor(226, 232, 240)  # #E2E8F0
    TEXT_MAIN = RGBColor(15, 23, 42)        # #0F172A
    TEXT_MUTED = RGBColor(100, 116, 139)    # #64748B
    WHITE = RGBColor(255, 255, 255)

    # Asset paths
    logo_path = os.path.abspath("public/assets/logos/joy_true_profile_shield_emblem.png")
    corp_logo_path = os.path.abspath("public/assets/logos/companies/joy_corporate_solutions_logo.png")
    
    # 3D Graphic assets
    img_speed = os.path.abspath("public/assets/3d/speed_3d_instant.jpg")
    img_hero = os.path.abspath("public/assets/3d/hero_3d_verification.jpg")
    img_easy_step = os.path.abspath("public/assets/3d/easy_3step_verify_3d.jpg")
    img_shield_vault = os.path.abspath("public/assets/3d/corporate_shield_vault_3d.jpg")
    img_labor = os.path.abspath("public/assets/3d/labor_3d_management.jpg")
    img_employee = os.path.abspath("public/assets/3d/hero_employee_3d_id.jpg")
    img_digilocker = os.path.abspath("public/assets/3d/digilocker_vault_hero.jpg")
    img_doc_verify = os.path.abspath("public/assets/3d/document_verification.jpg")
    img_pipeline = os.path.abspath("public/assets/3d/warm_amber_pipeline_3d.jpg")
    img_liquid = os.path.abspath("public/assets/3d/liquid_glass_hero_3d.jpg")
    img_trust_shield = os.path.abspath("public/assets/3d/trust_security_shield.jpg")
    img_warm_vault = os.path.abspath("public/assets/3d/warm_amber_vault_3d.jpg")

    def set_run_font(run, text, size_pt, bold=False, color=None, italic=False):
        run.text = text
        run.font.name = FONT_FAMILY
        run.font.size = Pt(size_pt)
        run.font.bold = bold
        run.font.italic = italic
        if color:
            run.font.color.rgb = color

    def add_para(text_frame, text="", size_pt=11, bold=False, color=TEXT_MAIN, alignment=PP_ALIGN.LEFT, space_before_pt=0, italic=False):
        if len(text_frame.paragraphs) == 1 and text_frame.paragraphs[0].text == "":
            p = text_frame.paragraphs[0]
        else:
            p = text_frame.add_paragraph()
        p.alignment = alignment
        if space_before_pt > 0:
            p.space_before = Pt(space_before_pt)
        run = p.add_run()
        set_run_font(run, text, size_pt, bold, color, italic)
        return p

    def add_header(slide, title, category, dark_mode=False):
        # Category Pill
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(3.4), Inches(0.32))
        pill.fill.solid()
        pill.fill.fore_color.rgb = EMERALD_DARK if dark_mode else EMERALD_LIGHT
        pill.line.color.rgb = EMERALD if dark_mode else RGBColor(167, 243, 208)
        pill.line.width = Pt(1)
        tf_pill = pill.text_frame
        tf_pill.word_wrap = True
        p_pill = tf_pill.paragraphs[0]
        p_pill.alignment = PP_ALIGN.CENTER
        run_pill = p_pill.add_run()
        set_run_font(run_pill, category.upper(), 9.5, bold=True, color=WHITE if dark_mode else EMERALD_DARK)

        # Slide Main Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(10.2), Inches(0.65))
        tf_title = tb_title.text_frame
        tf_title.word_wrap = True
        p_t = tf_title.paragraphs[0]
        run_t = p_t.add_run()
        set_run_font(run_t, title, 20, bold=True, color=WHITE if dark_mode else TEXT_MAIN)

        # Top Right Project Logo
        if os.path.exists(logo_path):
            slide.shapes.add_picture(logo_path, Inches(11.8), Inches(0.35), width=Inches(0.8))

    def add_footer(slide, current_page, total_pages=14, dark_mode=False):
        # Footer dividing line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.9), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = NAVY_BORDER if dark_mode else SLATE_BORDER
        line.line.fill.background()

        # Footer Left Text
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(6.95), Inches(9.5), Inches(0.35))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        run = p.add_run()
        set_run_font(run, "JOY TRUE PROFILE  •  JOY CORPORATE SOLUTIONS PRIVATE LIMITED  •  CONFIDENTIAL", 8.5, color=RGBColor(148, 163, 184) if dark_mode else TEXT_MUTED)

        # Footer Slide Number
        tb_num = slide.shapes.add_textbox(Inches(10.5), Inches(6.95), Inches(2.0), Inches(0.35))
        tf_num = tb_num.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.alignment = PP_ALIGN.RIGHT
        run_num = p_num.add_run()
        set_run_font(run_num, f"{current_page} / {total_pages}", 8.5, bold=True, color=RGBColor(148, 163, 184) if dark_mode else TEXT_MUTED)

    def add_card(slide, left, top, width, height, bg_color=WHITE, border_color=SLATE_BORDER):
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
    # SLIDE 1: TITLE SLIDE (Clean, Executive, Project Logo & Tagline)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = NAVY_DEEP
    bg1.line.fill.background()

    # Top accent bar
    top_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = EMERALD
    top_bar.line.fill.background()

    # Brand Category Pill
    pill1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.1), Inches(4.5), Inches(0.38))
    pill1.fill.solid()
    pill1.fill.fore_color.rgb = NAVY_CARD
    pill1.line.color.rgb = EMERALD
    tf1 = pill1.text_frame
    p1 = tf1.paragraphs[0]
    p1.alignment = PP_ALIGN.CENTER
    run1 = p1.add_run()
    set_run_font(run1, "ENTERPRISE VERIFICATION INFRASTRUCTURE", 10, bold=True, color=EMERALD)

    # Project Title
    tb1_title = slide1.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(7.5), Inches(1.5))
    tf1_title = tb1_title.text_frame
    tf1_title.word_wrap = True
    p1_t1 = tf1_title.paragraphs[0]
    run1_t1 = p1_t1.add_run()
    set_run_font(run1_t1, "JOY TRUE PROFILE", 36, bold=True, color=WHITE)

    # Tagline
    p1_t2 = tf1_title.add_paragraph()
    p1_t2.space_before = Pt(6)
    run1_t2 = p1_t2.add_run()
    set_run_font(run1_t2, "Next-Generation Direct Registry Workforce & Vendor Background Verification Rail", 16, bold=True, color=SKY_BLUE)

    # Subtitle Paragraph
    tb1_sub = slide1.shapes.add_textbox(Inches(1.0), Inches(3.3), Inches(7.5), Inches(1.4))
    tf1_sub = tb1_sub.text_frame
    tf1_sub.word_wrap = True
    p1_sub = tf1_sub.paragraphs[0]
    run1_sub = p1_sub.add_run()
    set_run_font(run1_sub, "A sub-45-second direct API verification platform connecting UIDAI Aadhaar, NSDL PAN, NPCI IMPS Penny Drop, EPFO Moonlighting Radar, and DPDP Act 2023 Digital Dossiers.\n\nDeveloped & Powered by JOY CORPORATE SOLUTIONS PRIVATE LIMITED, Coimbatore.", 11.5, color=RGBColor(203, 213, 225))

    # 3 Highlight Cards on Title Slide
    stats = [
        ("⚡ < 45 Seconds SLA", "Direct Registry API Lookups", EMERALD),
        ("🛡️ 100% DPDP Act 2023", "Encrypted Consent & AES-256 Vault", SKY_BLUE),
        ("🤝 11 Statutory Rails", "Workforce & Vendor Due Diligence", AMBER)
    ]
    for idx, (title_stat, sub_stat, clr) in enumerate(stats):
        cx = 1.0 + idx * 2.5
        c_box = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx), Inches(5.1), Inches(2.35), Inches(1.15))
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = NAVY_CARD
        c_box.line.color.rgb = clr
        c_box.line.width = Pt(1.5)
        tf_s = c_box.text_frame
        tf_s.word_wrap = True
        p_s1 = tf_s.paragraphs[0]
        run_s1 = p_s1.add_run()
        set_run_font(run_s1, title_stat, 11, bold=True, color=WHITE)
        p_s2 = tf_s.add_paragraph()
        p_s2.space_before = Pt(4)
        run_s2 = p_s2.add_run()
        set_run_font(run_s2, sub_stat, 9, color=RGBColor(148, 163, 184))

    # Right Logo Emblem & Badge
    if os.path.exists(logo_path):
        slide1.shapes.add_picture(logo_path, Inches(9.2), Inches(1.8), width=Inches(3.2))

    add_footer(slide1, 1, 14, dark_mode=True)

    # =========================================================================
    # SLIDE 2: PURPOSE OF THIS PROJECT
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "Purpose of This Project: The Background Verification Revolution", "Problem Statement & Strategic Purpose")

    # Left Card: Traditional Market Crisis
    add_card(slide2, 0.8, 1.45, 5.7, 5.2, bg_color=RGBColor(254, 242, 242), border_color=RGBColor(254, 202, 202))
    tb2_l = slide2.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf2_l = tb2_l.text_frame
    tf2_l.word_wrap = True
    add_para(tf2_l, "❌ THE TRADITIONAL SCREENING CRISIS", 12, bold=True, color=RGBColor(220, 38, 38))
    
    pains = [
        ("Slow 14-21 Day Turnaround:", "Extended agency screening cycles create candidate dropouts, lost productivity, and delayed joining dates."),
        ("Widespread Paper Forgery:", "High corporate exposure to photoshopped Aadhaar cards, forged relieving letters, and fake salary slips."),
        ("Undetected Moonlighting:", "No real-time visibility into parallel active EPFO PF accounts, exposing enterprises to IP theft and conflicts of interest."),
        ("Ghost Contractor Billing:", "Third-party staffing agencies invoicing for phantom workers without verifiable statutory PF/ESIC deposits."),
        ("Expensive Monthly Retainers:", "Traditional agencies charge high fixed subscription minimums regardless of actual hiring volume.")
    ]
    for h, b in pains:
        p = tf2_l.add_paragraph()
        p.space_before = Pt(7)
        r1 = p.add_run()
        set_run_font(r1, f"• {h} ", 10.5, bold=True, color=TEXT_MAIN)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=RGBColor(71, 85, 105))

    # Right Card: Purpose & Objectives of Joy True Profile
    add_card(slide2, 6.8, 1.45, 5.7, 5.2, bg_color=RGBColor(240, 253, 244), border_color=RGBColor(187, 247, 208))
    tb2_r = slide2.shapes.add_textbox(Inches(7.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf2_r = tb2_r.text_frame
    tf2_r.word_wrap = True
    add_para(tf2_r, "🎯 CORE PURPOSE & STRATEGIC OBJECTIVES", 12, bold=True, color=EMERALD_DARK)

    purposes = [
        ("Sub-45s Direct Registry Rails:", "Direct encrypted queries to UIDAI, NSDL, NPCI, and EPFO to replace slow manual agency screening."),
        ("100% Tamper-Evident Dossiers:", "Deliver cryptographically sealed SHA-256 PDF profile dossiers with scannable QR verification badges."),
        ("Real-Time Anti-Moonlighting Radar:", "Automate concurrent PF deposit audits to protect corporate IP and enforce single-employer compliance."),
        ("CLRA Statutory Labor Compliance:", "Automate Form XVI contractor registers and turnstile gate pass matching to eliminate ghost worker billing."),
        ("Fair Postpaid Commercial SaaS:", "Provide 100% pay-as-you-verify billing with automated month-end 18% GST tax invoices.")
    ]
    for h, b in purposes:
        p = tf2_r.add_paragraph()
        p.space_before = Pt(7)
        r1 = p.add_run()
        set_run_font(r1, f"✔ {h} ", 10.5, bold=True, color=EMERALD_DARK)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=TEXT_MAIN)

    add_footer(slide2, 2, 14)

    # =========================================================================
    # SLIDE 3: FEATURES OF THIS PROJECT
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "Comprehensive Features of JOY TRUE PROFILE", "Platform Capabilities & Verification Matrix")

    features_data = [
        ("🆔 1. Identity & e-KYC Rails", [
            "UIDAI Aadhaar OTP & Offline XML e-KYC",
            "NSDL PAN Card real-time status & name match",
            "Sarathi Driving License & Vahan RC validation",
            "Passport Seva file number & MRZ verification"
        ], EMERALD_DARK, RGBColor(236, 253, 245)),
        ("🏦 2. Financial & Bank Verifications", [
            "NPCI IMPS Penny Drop (₹1 live bank query)",
            "Instant account holder registered name check",
            "IFSC branch validation & account active status",
            "Corporate GSTIN status & 3-year tax filing audit"
        ], SKY_BLUE, RGBColor(240, 249, 255)),
        ("🏢 3. Employment & Anti-Moonlighting", [
            "EPFO UAN direct service history lookup",
            "Establishment search & tenure timeline analysis",
            "Concurrent monthly PF contribution radar",
            "e-Courts nationwide civil & criminal record check"
        ], PURPLE, RGBColor(245, 243, 255)),
        ("📱 4. Mobile Portal & Digital Vault", [
            "WhatsApp & SMS 1-click magic link with PIN",
            "DigiLocker direct academic degree fetch",
            "3D interactive camera face liveness matching",
            "SHA-256 sealed PDF dossier with scannable QR"
        ], AMBER, RGBColor(254, 243, 199))
    ]

    for idx, (f_title, f_items, clr, bg_clr) in enumerate(features_data):
        c_x = 0.8 + idx * 2.95
        add_card(slide3, c_x, 1.5, 2.85, 5.15, bg_color=WHITE, border_color=SLATE_BORDER)
        
        # Header Box
        hb = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(c_x + 0.1), Inches(1.6), Inches(2.65), Inches(0.65))
        hb.fill.solid()
        hb.fill.fore_color.rgb = clr
        hb.line.fill.background()
        tf_h = hb.text_frame
        tf_h.word_wrap = True
        p_h = tf_h.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        run_h = p_h.add_run()
        set_run_font(run_h, f_title, 10.5, bold=True, color=WHITE)

        # Bullets
        tb_b = slide3.shapes.add_textbox(Inches(c_x + 0.1), Inches(2.35), Inches(2.65), Inches(4.1))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for b_idx, item in enumerate(f_items):
            p = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p.space_before = Pt(8)
            run = p.add_run()
            set_run_font(run, f"• {item}", 9.8, color=TEXT_MAIN)

    add_footer(slide3, 3, 14)

    # =========================================================================
    # SLIDE 4: SHORT WORKFLOW OF THIS PROJECT
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "End-to-End Operational Workflow: 5 Frictionless Steps", "Complete Process Architecture")

    workflow_steps = [
        ("Step 1: Intake & Candidate Creation", "HR inputs basic candidate details (or uploads 500+ bulk Excel roster) with automated 28 State & 8 UT dropdown mapping.", EMERALD_DARK),
        ("Step 2: WhatsApp Magic Link Dispatch", "System instantly dispatches a personalized WhatsApp / SMS invitation link containing an encrypted token and secure 4-digit PIN.", SKY_BLUE),
        ("Step 3: Candidate Self-Verification", "Candidate opens mobile link, enters PIN, completes UIDAI Aadhaar OTP e-KYC, DigiLocker degree fetch, and 3D face liveness scan.", PURPLE),
        ("Step 4: Real-Time Registry Validation", "JOY True Profile backend queries UIDAI, NSDL, NPCI, and EPFO APIs concurrently in under 45 seconds with AI facial matching.", AMBER),
        ("Step 5: Certified PDF Dossier Export", "System outputs a tamper-evident master PDF dossier stamped with employer corporate logo, scannable QR code, and SHA-256 seal.", EMERALD)
    ]

    for idx, (s_title, s_desc, s_clr) in enumerate(workflow_steps):
        c_y = 1.5 + idx * 1.02
        add_card(slide4, 0.8, c_y, 11.733, 0.9, bg_color=WHITE, border_color=SLATE_BORDER)
        
        # Step Number Badge
        badge = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.95), Inches(c_y + 0.15), Inches(2.8), Inches(0.6))
        badge.fill.solid()
        badge.fill.fore_color.rgb = s_clr
        badge.line.fill.background()
        tf_bg = badge.text_frame
        tf_bg.word_wrap = True
        p_bg = tf_bg.paragraphs[0]
        p_bg.alignment = PP_ALIGN.CENTER
        run_bg = p_bg.add_run()
        set_run_font(run_bg, s_title, 10.5, bold=True, color=WHITE)

        # Description
        tb_d = slide4.shapes.add_textbox(Inches(3.9), Inches(c_y + 0.12), Inches(8.4), Inches(0.68))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        run_d = p_d.add_run()
        set_run_font(run_d, s_desc, 10.5, color=TEXT_MAIN)

    add_footer(slide4, 4, 14)

    # =========================================================================
    # SLIDE 5: SUPER ADMIN PORTAL — FEATURES & WORKFLOW
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "Portal Architecture (1/5): Super Admin Console", "Multi-Tenant Platform Governance & Infrastructure")

    # Left: Features
    add_card(slide5, 0.8, 1.45, 5.7, 5.2, bg_color=WHITE, border_color=SLATE_BORDER)
    tb5_l = slide5.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf5_l = tb5_l.text_frame
    tf5_l.word_wrap = True
    add_para(tf5_l, "👑 SUPER ADMIN CONSOLE — KEY FEATURES", 12, bold=True, color=PURPLE)

    sa_feats = [
        ("Multi-Tenant Governance:", "Provision, activate, and manage enterprise client companies across India."),
        ("Gateway Telemetry & Health:", "Live monitoring of Neev, UIDAI, NSDL, and EPFO API response latencies and success rates."),
        ("Custom Tariff Configuration:", "Set custom per-verification pricing models, postpaid credit lines, and billing terms per company."),
        ("Global System Audit Trail:", "Track all administrative actions, data exports, login pings, and DPDP compliance logs.")
    ]
    for h, b in sa_feats:
        p = tf5_l.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        set_run_font(r1, f"• {h} ", 10.5, bold=True, color=TEXT_MAIN)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=RGBColor(71, 85, 105))

    # Right: Workflow
    add_card(slide5, 6.8, 1.45, 5.7, 5.2, bg_color=WHITE, border_color=SLATE_BORDER)
    tb5_r = slide5.shapes.add_textbox(Inches(7.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf5_r = tb5_r.text_frame
    tf5_r.word_wrap = True
    add_para(tf5_r, "⚙️ SUPER ADMIN OPERATIONAL WORKFLOW", 12, bold=True, color=PURPLE)

    sa_flow = [
        ("Step 1 (Tenant Onboarding):", "Create client company profile, enter CIN/GSTIN, and generate initial admin activation link."),
        ("Step 2 (Credit & Tariff Setup):", "Configure postpaid credit guardrail, per-check rates, and low-balance automated alert triggers."),
        ("Step 3 (Live Telemetry Monitoring):", "Observe API gateway query success rates, candidate verification throughput, and server load."),
        ("Step 4 (Invoicing & Settlement):", "Review monthly platform-wide aggregated billing summaries and supervise payment reconciliations.")
    ]
    for h, b in sa_flow:
        p = tf5_r.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        set_run_font(r1, f"➔ {h} ", 10.5, bold=True, color=PURPLE)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=TEXT_MAIN)

    add_footer(slide5, 5, 14)

    # =========================================================================
    # SLIDE 6: COMPANY ADMIN PORTAL — FEATURES & WORKFLOW
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "Portal Architecture (2/5): Company Admin Console", "Enterprise Operations, Team Provisioning & Finance")

    # Left: Features
    add_card(slide6, 0.8, 1.45, 5.7, 5.2, bg_color=WHITE, border_color=SLATE_BORDER)
    tb6_l = slide6.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf6_l = tb6_l.text_frame
    tf6_l.word_wrap = True
    add_para(tf6_l, "🏢 COMPANY ADMIN CONSOLE — KEY FEATURES", 12, bold=True, color=SKY_BLUE)

    ca_feats = [
        ("Corporate Identity & Branding:", "Upload official corporate logo, manage registered office addresses, CIN, GSTIN, and company PAN."),
        ("HR Recruiter Provisioning:", "Add and manage HR recruiters, allocate candidate verification quotas, and configure role permissions."),
        ("Postpaid Metered Billing:", "Real-time meter dashboard tracking verified profiles, pending balances, and 18% GST tax invoices."),
        ("Vendor & CLRA Compliance:", "Access contractor labor compliance dashboards and manage supply chain due diligence.")
    ]
    for h, b in ca_feats:
        p = tf6_l.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        set_run_font(r1, f"• {h} ", 10.5, bold=True, color=TEXT_MAIN)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=RGBColor(71, 85, 105))

    # Right: Workflow
    add_card(slide6, 6.8, 1.45, 5.7, 5.2, bg_color=WHITE, border_color=SLATE_BORDER)
    tb6_r = slide6.shapes.add_textbox(Inches(7.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf6_r = tb6_r.text_frame
    tf6_r.word_wrap = True
    add_para(tf6_r, "⚙️ COMPANY ADMIN OPERATIONAL WORKFLOW", 12, bold=True, color=SKY_BLUE)

    ca_flow = [
        ("Step 1 (Corporate Setup):", "Set company profile, upload high-resolution corporate logo, and verify legal entity credentials."),
        ("Step 2 (HR Team Onboarding):", "Create HR recruiter accounts with individual emails and assign department quotas."),
        ("Step 3 (Operations Overview):", "Monitor overall corporate recruitment pipeline across all branches and divisions."),
        ("Step 4 (Invoice Clearance):", "Review monthly 18% GST tax invoice and settle postpaid bill in 1-click via Razorpay or NetBanking.")
    ]
    for h, b in ca_flow:
        p = tf6_r.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        set_run_font(r1, f"➔ {h} ", 10.5, bold=True, color=SKY_BLUE)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=TEXT_MAIN)

    add_footer(slide6, 6, 14)

    # =========================================================================
    # SLIDE 7: HR EXECUTIVE WORKSTATION — FEATURES & WORKFLOW
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, "Portal Architecture (3/5): HR Executive Workstation", "High-Velocity Candidate Intake, Telemetry & Dossier Generation")

    # Left: Features
    add_card(slide7, 0.8, 1.45, 5.7, 5.2, bg_color=WHITE, border_color=SLATE_BORDER)
    tb7_l = slide7.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf7_l = tb7_l.text_frame
    tf7_l.word_wrap = True
    add_para(tf7_l, "👔 HR WORKSTATION — KEY FEATURES", 12, bold=True, color=EMERALD_DARK)

    hr_feats = [
        ("Rapid Profiler & Bulk Excel:", "Intake candidates individually or upload 500+ Excel rows with automated State/UT dropdown mapping."),
        ("1-Click WhatsApp Magic Links:", "Instant dispatch of candidate invitation links via WhatsApp & SMS with automated 4-digit PIN generation."),
        ("Visual Telemetry Pipeline:", "Real-time board tracking candidate status (Link Sent ➔ In Progress ➔ Verified ➔ Dossier Ready)."),
        ("Biometric Face Match Scoring:", "AI facial comparison matching candidate live selfie against official Aadhaar photo with match %."),
        ("1-Click Master PDF Dossier:", "Instant generation of branded, tamper-evident PDF dossiers with scannable QR verification badges.")
    ]
    for h, b in hr_feats:
        p = tf7_l.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        set_run_font(r1, f"• {h} ", 10.5, bold=True, color=TEXT_MAIN)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=RGBColor(71, 85, 105))

    # Right: Workflow
    add_card(slide7, 6.8, 1.45, 5.7, 5.2, bg_color=WHITE, border_color=SLATE_BORDER)
    tb7_r = slide7.shapes.add_textbox(Inches(7.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf7_r = tb7_r.text_frame
    tf7_r.word_wrap = True
    add_para(tf7_r, "⚙️ HR EXECUTIVE OPERATIONAL WORKFLOW", 12, bold=True, color=EMERALD_DARK)

    hr_flow = [
        ("Step 1 (Candidate Intake):", "Enter candidate biographical and contact details, or ingest batch roster via Excel spreadsheet."),
        ("Step 2 (Invitation Dispatch):", "Click 'Send Magic Link' to deliver WhatsApp and SMS onboarding invites with secure PIN."),
        ("Step 3 (Live Telemetry Tracking):", "Track candidate completion in real time on the interactive recruiter pipeline table."),
        ("Step 4 (Review & Export):", "Audit verified Aadhaar, PAN, Bank, and EPFO radar data, then export tamper-proof PDF dossier.")
    ]
    for h, b in hr_flow:
        p = tf7_r.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        set_run_font(r1, f"➔ {h} ", 10.5, bold=True, color=EMERALD_DARK)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=TEXT_MAIN)

    add_footer(slide7, 7, 14)

    # =========================================================================
    # SLIDE 8: CANDIDATE SELF-VERIFICATION PORTAL — FEATURES & WORKFLOW
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, "Portal Architecture (4/5): Candidate Self-Verification Portal", "Frictionless Mobile-First Onboarding & Digital Consent")

    # Left: Features
    add_card(slide8, 0.8, 1.45, 5.7, 5.2, bg_color=WHITE, border_color=SLATE_BORDER)
    tb8_l = slide8.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf8_l = tb8_l.text_frame
    tf8_l.word_wrap = True
    add_para(tf8_l, "📱 CANDIDATE PORTAL — KEY FEATURES", 12, bold=True, color=AMBER)

    cand_feats = [
        ("Zero-Install Mobile Web:", "Candidate opens magic link directly in smartphone browser without installing any mobile app."),
        ("PIN Security Protection:", "Mandatory 4-digit security PIN prevents unauthorized access to candidate personal verification links."),
        ("UIDAI Aadhaar OTP e-KYC:", "Instant paperless identity extraction with automated PII masking (XXXX-XXXX-1234)."),
        ("DigiLocker Integration:", "1-click fetch of authentic academic certificates, 10th/12th marksheets, and driving license."),
        ("3D Camera Face Liveness:", "Interactive multi-angle liveness scan (Straight, Left, Right) preventing static photo spoofing.")
    ]
    for h, b in cand_feats:
        p = tf8_l.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        set_run_font(r1, f"• {h} ", 10.5, bold=True, color=TEXT_MAIN)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=RGBColor(71, 85, 105))

    # Right: Workflow
    add_card(slide8, 6.8, 1.45, 5.7, 5.2, bg_color=WHITE, border_color=SLATE_BORDER)
    tb8_r = slide8.shapes.add_textbox(Inches(7.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf8_r = tb8_r.text_frame
    tf8_r.word_wrap = True
    add_para(tf8_r, "⚙️ CANDIDATE SELF-VERIFICATION WORKFLOW", 12, bold=True, color=AMBER)

    cand_flow = [
        ("Step 1 (Magic Link Access):", "Candidate clicks link received on WhatsApp/SMS and enters 4-digit security PIN."),
        ("Step 2 (Digital Consent & e-KYC):", "Authorizes DPDP Act 2023 digital consent and enters Aadhaar OTP for instant verification."),
        ("Step 3 (Document & Degree Fetch):", "Connects DigiLocker to import verified educational degrees and uploads bank check copy."),
        ("Step 4 (3D Face Liveness & Submit):", "Completes 3D camera facial scan and submits profile for instant sub-45s backend certification.")
    ]
    for h, b in cand_flow:
        p = tf8_r.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        set_run_font(r1, f"➔ {h} ", 10.5, bold=True, color=AMBER)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=TEXT_MAIN)

    add_footer(slide8, 8, 14)

    # =========================================================================
    # SLIDE 9: VENDOR / CONTRACTOR DUE DILIGENCE PORTAL — FEATURES & WORKFLOW
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_header(slide9, "Portal Architecture (5/5): Vendor & Contractor Due Diligence", "11 Statutory Verification Rails & CLRA Labor Compliance")

    # Left: Features
    add_card(slide9, 0.8, 1.45, 5.7, 5.2, bg_color=WHITE, border_color=SLATE_BORDER)
    tb9_l = slide9.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf9_l = tb9_l.text_frame
    tf9_l.word_wrap = True
    add_para(tf9_l, "🤝 VENDOR & CONTRACTOR — KEY FEATURES", 12, bold=True, color=EMERALD_DARK)

    vnd_feats = [
        ("11 Statutory Verification Rails:", "Real-time MCA CIN, GSTIN, Corporate PAN, and MSME Udyam registration validations."),
        ("NPCI IMPS Bank Penny Drop:", "₹1 penny-drop validation ensuring corporate bank account legal entity matches vendor trade name."),
        ("CLRA Form XVI Labor Compliance:", "Automated Contract Labor (Regulation & Abolition) register generation."),
        ("Anti-Ghost Worker Sync:", "Cross-references deployed contractor headcount with turnstile entry badges and active PF/ESIC rolls.")
    ]
    for h, b in vnd_feats:
        p = tf9_l.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        set_run_font(r1, f"• {h} ", 10.5, bold=True, color=TEXT_MAIN)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=RGBColor(71, 85, 105))

    # Right: Workflow
    add_card(slide9, 6.8, 1.45, 5.7, 5.2, bg_color=WHITE, border_color=SLATE_BORDER)
    tb9_r = slide9.shapes.add_textbox(Inches(7.0), Inches(1.6), Inches(5.3), Inches(4.9))
    tf9_r = tb9_r.text_frame
    tf9_r.word_wrap = True
    add_para(tf9_r, "⚙️ VENDOR & CONTRACTOR VERIFICATION WORKFLOW", 12, bold=True, color=EMERALD_DARK)

    vnd_flow = [
        ("Step 1 (Vendor Initiation):", "Admin/HR inputs vendor GSTIN or dispatches magic self-onboarding link to vendor legal head."),
        ("Step 2 (11-Rail Automated Query):", "System queries MCA, GSTIN, MSME, and Bank APIs in parallel in sub-45 seconds."),
        ("Step 3 (Contractor Labor Audit):", "Contractor uploads deployed worker roster; system validates PF/ESIC deposits to stop ghost workers."),
        ("Step 4 (Due Diligence PDF Export):", "Generates official Vendor Due Diligence Audit Certificate & CLRA Form XVI muster.")
    ]
    for h, b in vnd_flow:
        p = tf9_r.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        set_run_font(r1, f"➔ {h} ", 10.5, bold=True, color=EMERALD_DARK)
        r2 = p.add_run()
        set_run_font(r2, b, 10, color=TEXT_MAIN)

    add_footer(slide9, 9, 14)

    # =========================================================================
    # SLIDE 10: HOW IT DIFFERS FROM OTHER BGV PROJECTS
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_header(slide10, "How JOY TRUE PROFILE Differs from Other Background Checks", "Direct Registry vs. Traditional Agency Comparison")

    # Comparison Table
    table_shape = slide10.shapes.add_table(7, 3, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.1))
    table = table_shape.table
    table.columns[0].width = Inches(3.0)
    table.columns[1].width = Inches(4.3)
    table.columns[2].width = Inches(4.433)

    headers = ["Evaluation Parameter", "Traditional BGV Agencies (Legacy)", "JOY TRUE PROFILE (Direct Rail)"]
    for i, head in enumerate(headers):
        cell = table.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = NAVY_DEEP if i != 2 else EMERALD_DARK
        tf = cell.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        set_run_font(run, head, 11, bold=True, color=WHITE)

    rows_data = [
        ("Turnaround Time (TAT)", "14 to 21 business days with manual delays", "Sub-45 seconds instant direct registry lookup"),
        ("Verification Method", "Manual phone calls & unverified photocopies", "Direct government & banking registry APIs"),
        ("Dual-Employment Radar", "Zero visibility into active parallel PF accounts", "Real-time EPFO service history & moonlighting radar"),
        ("Document Security", "Static PDFs vulnerable to manipulation", "Cryptographic SHA-256 seal & scannable QR verification"),
        ("Contractor Compliance", "Manual paper registers with ghost worker billing", "Automated CLRA Form XVI muster & turnstile sync"),
        ("Commercial Model", "High upfront retainer fees and long lock-ins", "100% Postpaid pay-as-you-verify with 18% GST invoice")
    ]

    for row_idx, (param, legacy, joy) in enumerate(rows_data, start=1):
        # Param Cell
        c0 = table.cell(row_idx, 0)
        c0.fill.solid()
        c0.fill.fore_color.rgb = RGBColor(241, 245, 249)
        tf0 = c0.text_frame
        p0 = tf0.paragraphs[0]
        run0 = p0.add_run()
        set_run_font(run0, param, 10, bold=True, color=TEXT_MAIN)

        # Legacy Cell
        c1 = table.cell(row_idx, 1)
        c1.fill.solid()
        c1.fill.fore_color.rgb = RGBColor(254, 242, 242)
        tf1 = c1.text_frame
        p1 = tf1.paragraphs[0]
        run1 = p1.add_run()
        set_run_font(run1, f"❌ {legacy}", 9.8, color=RGBColor(185, 28, 28))

        # Joy Cell
        c2 = table.cell(row_idx, 2)
        c2.fill.solid()
        c2.fill.fore_color.rgb = RGBColor(240, 253, 244)
        tf2 = c2.text_frame
        p2 = tf2.paragraphs[0]
        run2 = p2.add_run()
        set_run_font(run2, f"✔ {joy}", 9.8, bold=True, color=EMERALD_DARK)

    add_footer(slide10, 10, 14)

    # =========================================================================
    # SLIDE 11: UNIQUE IDEAS & IMPLEMENTATION HIGHLIGHTS
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_header(slide11, "Unique Ideas & Technological Innovations in This Project", "Breakthrough Architectural Implementations")

    innovations = [
        ("⚡ 1. Sub-45s Direct Registry Rail", "Completely eliminates manual middleman screening agencies by executing direct asynchronous API lookups across UIDAI, NSDL, NPCI, and EPFO simultaneously.", EMERALD_DARK),
        ("🛡️ 2. Algorithmic EPFO Moonlighting Radar", "Proprietary analyzer cross-checking candidate Universal Account Number (UAN) history and active monthly PF contributions to immediately detect unauthorized parallel employment.", SKY_BLUE),
        ("📸 3. 3D Face Liveness & Biometric Match", "Interactive multi-angle face liveness capture that calculates mathematical facial feature similarity against official Aadhaar/Passport photos, defeating AI deepfakes.", PURPLE),
        ("🏗️ 4. CLRA Form XVI Anti-Ghost Worker Sync", "Direct linkage between factory turnstile gate biometric entries and statutory contractor PF/ESIC registers, stopping fraudulent manpower contractor billing.", AMBER),
        ("🔐 5. Tamper-Evident SHA-256 PDF & Live QR", "Every generated dossier contains a cryptographically signed SHA-256 hash and scannable QR code that allows any third party to verify authentic registry data instantly.", EMERALD)
    ]

    for idx, (i_title, i_desc, i_clr) in enumerate(innovations):
        c_y = 1.5 + idx * 1.02
        add_card(slide11, 0.8, c_y, 11.733, 0.9, bg_color=WHITE, border_color=SLATE_BORDER)
        
        # Pill
        ipill = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.95), Inches(c_y + 0.15), Inches(3.2), Inches(0.6))
        ipill.fill.solid()
        ipill.fill.fore_color.rgb = i_clr
        ipill.line.fill.background()
        tf_ip = ipill.text_frame
        tf_ip.word_wrap = True
        p_ip = tf_ip.paragraphs[0]
        p_ip.alignment = PP_ALIGN.CENTER
        run_ip = p_ip.add_run()
        set_run_font(run_ip, i_title, 10, bold=True, color=WHITE)

        # Desc
        tb_id = slide11.shapes.add_textbox(Inches(4.3), Inches(c_y + 0.12), Inches(8.0), Inches(0.68))
        tf_id = tb_id.text_frame
        tf_id.word_wrap = True
        p_id = tf_id.paragraphs[0]
        run_id = p_id.add_run()
        set_run_font(run_id, i_desc, 10.5, color=TEXT_MAIN)

    add_footer(slide11, 11, 14)

    # =========================================================================
    # SLIDE 12: DATA SECURITY & PRIVACY COMPLIANCE
    # =========================================================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_header(slide12, "Enterprise Data Security & DPDP Act 2023 Compliance", "Bank-Grade Encryption, Privacy Governance & Access Controls")

    security_cards = [
        ("🔒 1. 100% DPDP Act 2023 Compliance", [
            "Mandatory digital consent capture for every check",
            "Immutable audit logs with timestamp, IP & geo-stamp",
            "Granular consent withdrawal and data erasure controls",
            "Full regulatory compliance with Indian data privacy law"
        ], EMERALD_DARK),
        ("🛡️ 2. AES-256 Encryption at Rest", [
            "Military-grade 256-bit AES encryption for stored PII",
            "TLS 1.3 encryption in transit with Perfect Forward Secrecy",
            "Salted cryptographic hashing for all candidate passwords",
            "Secure key management isolated in vault hardware"
        ], SKY_BLUE),
        ("👁️ 3. Automated PII Data Masking", [
            "Aadhaar numbers masked automatically to XXXX-XXXX-1234",
            "PAN and Bank account masking on preview slips",
            "Zero storage of raw Aadhaar biometric fingerprints",
            "Strict adherence to UIDAI data handling guidelines"
        ], PURPLE),
        ("🏢 4. Zero-Trust RBAC Multi-Tenancy", [
            "Strict cryptographic tenant isolation per company",
            "Role-Based Access Control (Super Admin, HR, Candidate)",
            "Automatic session timeout & inactivity screen shield",
            "Real-time fraud telemetry and unauthorized access alerts"
        ], AMBER)
    ]

    for idx, (s_title, s_bullets, s_clr) in enumerate(security_cards):
        c_x = 0.8 + idx * 2.95
        add_card(slide12, c_x, 1.5, 2.85, 5.15, bg_color=WHITE, border_color=SLATE_BORDER)
        
        hb = slide12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(c_x + 0.1), Inches(1.6), Inches(2.65), Inches(0.65))
        hb.fill.solid()
        hb.fill.fore_color.rgb = s_clr
        hb.line.fill.background()
        tf_h = hb.text_frame
        tf_h.word_wrap = True
        p_h = tf_h.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        run_h = p_h.add_run()
        set_run_font(run_h, s_title, 10, bold=True, color=WHITE)

        tb_b = slide12.shapes.add_textbox(Inches(c_x + 0.1), Inches(2.35), Inches(2.65), Inches(4.1))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for b_idx, bullet in enumerate(s_bullets):
            p = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p.space_before = Pt(8)
            run = p.add_run()
            set_run_font(run, f"• {bullet}", 9.8, color=TEXT_MAIN)

    add_footer(slide12, 12, 14)

    # =========================================================================
    # SLIDE 13: COMMERCIAL MODEL & BUSINESS ROI
    # =========================================================================
    slide13 = prs.slides.add_slide(blank_layout)
    add_header(slide13, "Postpaid Commercial Model & Quantifiable Business ROI", "Monetization, Metered Billing & Enterprise Value")

    roi_cards = [
        ("⏱️ 95% Faster Onboarding", "Slashes background verification cycle from 14-21 days to sub-45 seconds, eliminating candidate drop-offs.", EMERALD_DARK),
        ("📉 60% Operational Cost Reduction", "100% postpaid pay-per-profile pricing eliminates expensive monthly agency retainers and overhead fees.", SKY_BLUE),
        ("🎯 99.98% Verification Accuracy", "Direct queries to UIDAI, NSDL, NPCI and EPFO eliminate human screening errors and fraudulent paperwork.", PURPLE),
        ("🧾 Automated 18% GST Invoicing", "System consolidates monthly volume, generates B2B 18% GST tax invoices, and enables 1-click Razorpay settlement.", AMBER)
    ]

    for idx, (rt, rd, rc) in enumerate(roi_cards):
        row = idx // 2
        col = idx % 2
        c_x = 0.8 + col * 5.95
        c_y = 1.55 + row * 2.55
        
        add_card(slide13, c_x, c_y, 5.75, 2.35, bg_color=WHITE, border_color=SLATE_BORDER)
        
        rhb = slide13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(c_x + 0.15), Inches(c_y + 0.15), Inches(5.45), Inches(0.48))
        rhb.fill.solid()
        rhb.fill.fore_color.rgb = rc
        rhb.line.fill.background()
        tf_rh = rhb.text_frame
        p_rh = tf_rh.paragraphs[0]
        run_rh = p_rh.add_run()
        set_run_font(run_rh, rt, 11, bold=True, color=WHITE)

        tb_rd = slide13.shapes.add_textbox(Inches(c_x + 0.2), Inches(c_y + 0.7), Inches(5.35), Inches(1.5))
        tf_rd = tb_rd.text_frame
        tf_rd.word_wrap = True
        p_rd = tf_rd.paragraphs[0]
        run_rd = p_rd.add_run()
        set_run_font(run_rd, rd, 10.5, color=TEXT_MAIN)

    add_footer(slide13, 13, 14)

    # =========================================================================
    # SLIDE 14: THANK YOU & CONCLUSION (Executive Dark Theme)
    # =========================================================================
    slide14 = prs.slides.add_slide(blank_layout)
    bg14 = slide14.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg14.fill.solid()
    bg14.fill.fore_color.rgb = NAVY_DEEP
    bg14.line.fill.background()

    top_bar14 = slide14.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_bar14.fill.solid()
    top_bar14.fill.fore_color.rgb = EMERALD
    top_bar14.line.fill.background()

    pill14 = slide14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(0.95), Inches(4.2), Inches(0.38))
    pill14.fill.solid()
    pill14.fill.fore_color.rgb = NAVY_CARD
    pill14.line.color.rgb = EMERALD
    tf14 = pill14.text_frame
    p14 = tf14.paragraphs[0]
    p14.alignment = PP_ALIGN.CENTER
    run14 = p14.add_run()
    set_run_font(run14, "THANK YOU FOR YOUR TIME & ATTENTION", 10, bold=True, color=EMERALD)

    tb14_t = slide14.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(9.5), Inches(1.3))
    tf14_t = tb14_t.text_frame
    p14_t1 = tf14_t.paragraphs[0]
    run14_t1 = p14_t1.add_run()
    set_run_font(run14_t1, "Transform Your Workforce Verification Today", 32, bold=True, color=WHITE)

    p14_t2 = tf14_t.add_paragraph()
    p14_t2.space_before = Pt(6)
    run14_t2 = p14_t2.add_run()
    set_run_font(run14_t2, "Experience sub-45-second direct registry background verification with zero upfront subscription lock-in.", 13.5, color=SKY_BLUE)

    # 3 Contact / Details Cards
    contact_cards = [
        ("🏢 Corporate Headquarters", "JOY CORPORATE SOLUTIONS PRIVATE LIMITED\nCoimbatore, Tamil Nadu, India\nPIN: 641001", EMERALD),
        ("📧 Enterprise Solutions", "Email: info@joycorporatesolutions.com\nWeb: verification.joycorporatesolutions.com\nPortal: joypeoplehr.com", SKY_BLUE),
        ("📞 Direct Support & Demos", "Phone / WhatsApp: +91 99946 99044\nOperational Hours: Mon - Sat\n9:00 AM - 7:00 PM IST", AMBER)
    ]

    for idx, (ctit, ctxt, cclr) in enumerate(contact_cards):
        c_x = 1.0 + idx * 3.8
        add_card(slide14, c_x, 3.1, 3.6, 3.0, bg_color=NAVY_CARD, border_color=cclr)
        
        tb_c = slide14.shapes.add_textbox(Inches(c_x + 0.15), Inches(3.25), Inches(3.3), Inches(2.7))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        pc1 = tf_c.paragraphs[0]
        run_pc1 = pc1.add_run()
        set_run_font(run_pc1, ctit, 12, bold=True, color=WHITE)
        
        pc2 = tf_c.add_paragraph()
        pc2.space_before = Pt(12)
        run_pc2 = pc2.add_run()
        set_run_font(run_pc2, ctxt, 10.5, color=RGBColor(203, 213, 225))

    add_footer(slide14, 14, 14, dark_mode=True)

    # Save to PowerPoint files
    primary_file = "JOY_TRUE_PROFILE_Professional_Presentation.pptx"
    legacy_file = "JOY_TRUE_PROFILE_Enterprise_Presentation.pptx"
    
    prs.save(primary_file)
    print(f"Presentation successfully created and saved to '{primary_file}' with Times New Roman font and {len(prs.slides)} slides.")
    
    try:
        prs.save(legacy_file)
        print(f"Also updated '{legacy_file}'.")
    except Exception as e:
        print(f"Note: '{legacy_file}' is currently open in PowerPoint/viewer. The updated presentation is available at '{primary_file}'.")

if __name__ == "__main__":
    build_joy_true_profile_presentation()
