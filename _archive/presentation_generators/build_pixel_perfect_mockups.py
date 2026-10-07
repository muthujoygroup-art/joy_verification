import os
from PIL import Image, ImageDraw, ImageFont

def get_fonts(scale=1.0):
    def load(font_name, size, fallback="arial.ttf"):
        try:
            return ImageFont.truetype(font_name, int(size * scale))
        except Exception:
            try:
                return ImageFont.truetype(fallback, int(size * scale))
            except Exception:
                return ImageFont.load_default()

    return {
        "title": load("segoeuib.ttf", 26, "arialbd.ttf"),
        "h2": load("segoeuib.ttf", 22, "arialbd.ttf"),
        "h3": load("segoeuib.ttf", 18, "arialbd.ttf"),
        "sub": load("segoeui.ttf", 16, "arial.ttf"),
        "bold": load("segoeuib.ttf", 16, "arialbd.ttf"),
        "body": load("segoeui.ttf", 15, "arial.ttf"),
        "small_bold": load("segoeuib.ttf", 14, "arialbd.ttf"),
        "small": load("segoeui.ttf", 13, "arial.ttf"),
        "micro_bold": load("segoeuib.ttf", 12, "arialbd.ttf"),
        "micro": load("segoeui.ttf", 12, "arial.ttf"),
    }

def draw_browser_chrome(draw, w, h, url_text, fonts):
    header_h = 50
    # Chrome bar
    draw.rectangle([(0, 0), (w, header_h)], fill=(241, 245, 249, 255))
    draw.line([(0, header_h), (w, header_h)], fill=(226, 232, 240, 255), width=2)
    
    # Window traffic lights
    draw.ellipse([(20, 18), (32, 30)], fill=(239, 68, 68, 255))
    draw.ellipse([(40, 18), (52, 30)], fill=(245, 158, 11, 255))
    draw.ellipse([(60, 18), (72, 30)], fill=(16, 185, 129, 255))
    
    # URL pill
    draw.rounded_rectangle([(95, 8), (w - 30, header_h - 8)], radius=6, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    draw.text((115, 15), f"🔒  {url_text}", fill=(100, 116, 139, 255), font=fonts["small"])

def generate_super_admin_mockup(output_path):
    w, h = 1400, 840
    canvas = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(canvas)
    fonts = get_fonts()
    header_h = 50

    draw_browser_chrome(draw, w, h, "https://verification.joycorporatesolutions.com/superadmin/console", fonts)

    # Sidebar (Slate/Navy theme)
    sb_w = 280
    draw.rectangle([(0, header_h), (sb_w, h)], fill=(15, 23, 42, 255))
    
    # Sidebar Header
    draw.text((24, header_h + 20), "JOY TRUE PROFILE", fill=(255, 255, 255, 255), font=fonts["h3"])
    draw.text((24, header_h + 46), "Super Admin Master Console", fill=(148, 163, 184, 255), font=fonts["small"])
    draw.line([(20, header_h + 75), (sb_w - 20, header_h + 75)], fill=(51, 65, 85, 255), width=1)

    # Sidebar Menu
    menu_items = [
        ("📊 Master Dashboard", True),
        ("🏢 Enterprise Clients (42)", False),
        ("⚡ Live API Gateways", False),
        ("💳 Tariff & Pricing Engine", False),
        ("🧾 Monthly B2B Invoices", False),
        ("🛡️ DPDP Security Audit", False),
        ("⚙️ System Configuration", False)
    ]
    for idx, (label, active) in enumerate(menu_items):
        my = header_h + 90 + idx * 48
        if active:
            draw.rounded_rectangle([(16, my), (sb_w - 16, my + 40)], radius=8, fill=(5, 150, 105, 255))
            draw.text((32, my + 10), label, fill=(255, 255, 255, 255), font=fonts["bold"])
        else:
            draw.text((32, my + 10), label, fill=(148, 163, 184, 255), font=fonts["body"])

    # Sidebar Footer
    draw.rounded_rectangle([(16, h - 75), (sb_w - 16, h - 20)], radius=8, fill=(30, 41, 59, 255))
    draw.text((28, h - 64), "Super Admin: Master Root", fill=(255, 255, 255, 255), font=fonts["small_bold"])
    draw.text((28, h - 42), "Status: 100% Operational 🟢", fill=(52, 211, 153, 255), font=fonts["micro_bold"])

    # Main Content Area
    cx = sb_w + 25
    cw = w - cx - 25

    # Main Top Bar
    draw.text((cx, header_h + 18), "Super Admin Master Console", fill=(15, 23, 42, 255), font=fonts["title"])
    draw.text((cx, header_h + 52), "Multi-Tenant Enterprise Hub, Gateway Latency Monitoring & Security Audit", fill=(100, 116, 139, 255), font=fonts["small"])

    # Status Pill
    draw.rounded_rectangle([(w - 270, header_h + 20), (w - 25, header_h + 58)], radius=18, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255), width=1)
    draw.text((w - 250, header_h + 30), "● System Health: 99.98%", fill=(5, 150, 105, 255), font=fonts["small_bold"])

    # 4 Metric KPI Cards
    kpis = [
        ("Active Client Companies", "42", "+3 Onboarded this mo.", (5, 150, 105, 255), (236, 253, 245, 255)),
        ("Total Verifications", "148,290", "99.98% First-Pass Rate", (37, 99, 235, 255), (239, 246, 255, 255)),
        ("Avg Gateway Latency", "280 ms", "Sub-45s End-to-End", (124, 58, 237, 255), (245, 243, 255, 255)),
        ("Monthly B2B Revenue", "₹18.4 Lakhs", "100% Postpaid Settled", (217, 119, 6, 255), (254, 243, 199, 255))
    ]
    kpi_w = (cw - 36) // 4
    for idx, (kt, kv, ks, kc, kbg) in enumerate(kpis):
        kx = cx + idx * (kpi_w + 12)
        ky = header_h + 85
        draw.rounded_rectangle([(kx, ky), (kx + kpi_w, ky + 110)], radius=10, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
        draw.text((kx + 16, ky + 14), kt, fill=(100, 116, 139, 255), font=fonts["micro_bold"])
        draw.text((kx + 16, ky + 34), kv, fill=(15, 23, 42, 255), font=fonts["title"])
        draw.rounded_rectangle([(kx + 16, ky + 76), (kx + kpi_w - 16, ky + 100)], radius=4, fill=kbg)
        draw.text((kx + 22, ky + 80), ks, fill=kc, font=fonts["micro_bold"])

    # Middle Section: 4 Gateway Health Bars
    gw_y = header_h + 210
    draw.rounded_rectangle([(cx, gw_y), (cx + cw, gw_y + 160)], radius=10, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
    draw.text((cx + 20, gw_y + 14), "⚡ Live Direct Government & Banking Gateway Performance", fill=(15, 23, 42, 255), font=fonts["bold"])
    
    gateways = [
        ("UIDAI Aadhaar Rail", "OTP & Demographic Match", "310 ms", "99.99% Uptime", (5, 150, 105, 255)),
        ("NSDL PAN Verification", "Instant Name Match Algo", "180 ms", "100.0% Uptime", (5, 150, 105, 255)),
        ("NPCI IMPS Bank Rail", "₹1 Penny Drop Account", "240 ms", "99.95% Uptime", (5, 150, 105, 255)),
        ("EPFO UAN History Rail", "Service & Moonlighting", "420 ms", "99.92% Uptime", (5, 150, 105, 255))
    ]
    gw_box_w = (cw - 60) // 4
    for idx, (gt, gs, gl, gu, gc) in enumerate(gateways):
        gx = cx + 20 + idx * (gw_box_w + 13)
        gy = gw_y + 44
        draw.rounded_rectangle([(gx, gy), (gx + gw_box_w, gy + 100)], radius=8, fill=(248, 250, 252, 255), outline=(226, 232, 240, 255))
        draw.text((gx + 12, gy + 10), gt, fill=(15, 23, 42, 255), font=fonts["small_bold"])
        draw.text((gx + 12, gy + 32), gs, fill=(100, 116, 139, 255), font=fonts["micro"])
        draw.text((gx + 12, gy + 54), f"Latency: {gl}", fill=(37, 99, 235, 255), font=fonts["micro_bold"])
        draw.text((gx + 12, gy + 74), f"● {gu}", fill=gc, font=fonts["micro_bold"])

    # Bottom Section: Enterprise Client Companies Table
    tbl_y = header_h + 385
    tbl_h = h - tbl_y - 20
    draw.rounded_rectangle([(cx, tbl_y), (cx + cw, tbl_y + tbl_h)], radius=10, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
    
    draw.text((cx + 20, tbl_y + 14), "🏢 Registered Enterprise Client Companies (Active Tenants)", fill=(15, 23, 42, 255), font=fonts["bold"])
    
    th_y = tbl_y + 45
    draw.rectangle([(cx + 1, th_y), (cx + cw - 1, th_y + 32)], fill=(241, 245, 249, 255))
    cols = [("Company Legal Name", 270), ("Location / HQ", 150), ("Recruiters", 100), ("Verifications", 120), ("Monthly Plan", 140), ("Status", 120), ("Action", 90)]
    cur_x = cx + 20
    for col_name, col_w in cols:
        draw.text((cur_x, th_y + 8), col_name, fill=(71, 85, 105, 255), font=fonts["micro_bold"])
        cur_x += col_w

    companies_data = [
        ("Joy Corporate Solutions Pvt Ltd", "Coimbatore, TN", "14 Active", "1,420 Checks", "Postpaid Enterprise", "ACTIVE 🟢", "Manage ⚙️"),
        ("Joy Man Power Service", "Tiruppur, TN", "8 Active", "890 Checks", "Postpaid Standard", "ACTIVE 🟢", "Manage ⚙️"),
        ("Titan Logistics Solutions Corp", "Chennai, TN", "22 Active", "3,450 Checks", "Postpaid Enterprise", "ACTIVE 🟢", "Manage ⚙️"),
        ("Apex Precision Manufacturing Ltd", "Bengaluru, KA", "15 Active", "2,100 Checks", "Postpaid Enterprise", "ACTIVE 🟢", "Manage ⚙️"),
        ("Skyline Tech Services LLP", "Hyderabad, TS", "9 Active", "780 Checks", "Postpaid Standard", "ACTIVE 🟢", "Manage ⚙️")
    ]
    for r_idx, (cname, cloc, crec, cchk, cplan, cstat, cact) in enumerate(companies_data):
        row_y = th_y + 32 + r_idx * 50
        bg_row = (255, 255, 255, 255) if r_idx % 2 == 0 else (248, 250, 252, 255)
        draw.rectangle([(cx + 1, row_y), (cx + cw - 1, row_y + 50)], fill=bg_row)
        draw.line([(cx + 1, row_y + 50), (cx + cw - 1, row_y + 50)], fill=(241, 245, 249, 255), width=1)
        
        rx = cx + 20
        draw.text((rx, row_y + 14), cname, fill=(15, 23, 42, 255), font=fonts["small_bold"])
        rx += 270
        draw.text((rx, row_y + 15), cloc, fill=(100, 116, 139, 255), font=fonts["small"])
        rx += 150
        draw.text((rx, row_y + 15), crec, fill=(15, 23, 42, 255), font=fonts["small"])
        rx += 100
        draw.text((rx, row_y + 15), cchk, fill=(37, 99, 235, 255), font=fonts["small_bold"])
        rx += 120
        draw.text((rx, row_y + 15), cplan, fill=(100, 116, 139, 255), font=fonts["small"])
        rx += 140
        draw.rounded_rectangle([(rx, row_y + 10), (rx + 90, row_y + 36)], radius=6, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255))
        draw.text((rx + 8, row_y + 16), cstat, fill=(5, 150, 105, 255), font=fonts["micro_bold"])
        rx += 120
        draw.rounded_rectangle([(rx, row_y + 10), (rx + 80, row_y + 36)], radius=6, fill=(241, 245, 249, 255), outline=(203, 213, 225, 255))
        draw.text((rx + 10, row_y + 16), cact, fill=(71, 85, 105, 255), font=fonts["micro_bold"])

    # Outer border
    draw.rectangle([(0, 0), (w - 1, h - 1)], outline=(203, 213, 225, 255), width=2)
    canvas.save(output_path, "PNG")
    print(f"Generated Super Admin Mockup: {output_path}")

def generate_company_admin_mockup(output_path):
    w, h = 1400, 840
    canvas = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(canvas)
    fonts = get_fonts()
    header_h = 50

    draw_browser_chrome(draw, w, h, "https://verification.joycorporatesolutions.com/joy-corporate-solutions/company/admin", fonts)

    # Top Brand Header Banner
    banner_y = header_h
    banner_h = 95
    draw.rectangle([(0, banner_y), (w, banner_y + banner_h)], fill=(255, 255, 255, 255))
    draw.line([(0, banner_y + banner_h), (w, banner_y + banner_h)], fill=(226, 232, 240, 255), width=1)

    # Company Logo Emulation
    draw.rounded_rectangle([(30, banner_y + 15), (95, banner_y + 80)], radius=10, fill=(37, 99, 235, 255))
    draw.text((42, banner_y + 30), "JOY", fill=(255, 255, 255, 255), font=fonts["h3"])
    
    draw.text((115, banner_y + 20), "JOY CORPORATE SOLUTIONS PRIVATE LIMITED", fill=(15, 23, 42, 255), font=fonts["title"])
    draw.text((115, banner_y + 54), "Company Admin Management Hub • CIN: U74999TZ2023PTC039281 • Coimbatore HQ", fill=(100, 116, 139, 255), font=fonts["small"])

    # Action buttons top right
    draw.rounded_rectangle([(w - 400, banner_y + 28), (w - 220, banner_y + 68)], radius=8, fill=(239, 246, 255, 255), outline=(191, 219, 254, 255))
    draw.text((w - 385, banner_y + 38), "🏢 Company Profile", fill=(37, 99, 235, 255), font=fonts["small_bold"])

    draw.rounded_rectangle([(w - 200, banner_y + 28), (w - 30, banner_y + 68)], radius=8, fill=(5, 150, 105, 255))
    draw.text((w - 185, banner_y + 38), "+ Add HR Recruiter", fill=(255, 255, 255, 255), font=fonts["small_bold"])

    # 4 Metric KPI Cards
    kpis = [
        ("Assigned HR Recruiters", "12 Active", "Full Recruiter Provisioning", (37, 99, 235, 255), (239, 246, 255, 255)),
        ("Total Candidates Verified", "1,420", "99.1% First-Pass Clean", (5, 150, 105, 255), (236, 253, 245, 255)),
        ("Postpaid Credit Limit", "₹2,00,000", "₹1,57,500 Available", (124, 58, 237, 255), (245, 243, 255, 255)),
        ("Current Month Unbilled", "₹42,500", "October 2026 (18% GST)", (217, 119, 6, 255), (254, 243, 199, 255))
    ]
    card_y = banner_y + banner_h + 18
    card_w = (w - 90) // 4
    for idx, (kt, kv, ks, kc, kbg) in enumerate(kpis):
        kx = 30 + idx * (card_w + 10)
        draw.rounded_rectangle([(kx, card_y), (kx + card_w, card_y + 110)], radius=10, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
        draw.text((kx + 16, card_y + 14), kt, fill=(100, 116, 139, 255), font=fonts["micro_bold"])
        draw.text((kx + 16, card_y + 34), kv, fill=(15, 23, 42, 255), font=fonts["title"])
        draw.rounded_rectangle([(kx + 16, card_y + 76), (kx + card_w - 16, card_y + 100)], radius=4, fill=kbg)
        draw.text((kx + 22, card_y + 80), ks, fill=kc, font=fonts["micro_bold"])

    # Left: HR Recruiters Table (Width: 840)
    left_w = 840
    tbl_y = card_y + 130
    tbl_h = h - tbl_y - 20
    draw.rounded_rectangle([(30, tbl_y), (30 + left_w, tbl_y + tbl_h)], radius=10, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
    
    draw.text((50, tbl_y + 16), "👥 HR Recruiter Provisioning & Activity Roster", fill=(15, 23, 42, 255), font=fonts["bold"])
    
    th_y = tbl_y + 48
    draw.rectangle([(31, th_y), (30 + left_w - 1, th_y + 32)], fill=(241, 245, 249, 255))
    cols = [("Recruiter Name", 200), ("Branch / Dept", 180), ("Verified", 110), ("Pass Rate", 110), ("Recruiter Status", 140)]
    rx = 50
    for cn, cw in cols:
        draw.text((rx, th_y + 8), cn, fill=(71, 85, 105, 255), font=fonts["micro_bold"])
        rx += cw

    recruiters_data = [
        ("Agilan (HR Lead)", "Engineering & Tech", "380 Checks", "99.2% Pass", "ACTIVE 🟢"),
        ("Meera (Senior HR)", "Sales & Marketing", "410 Checks", "98.8% Pass", "ACTIVE 🟢"),
        ("Vignesh (HR Specialist)", "Plant Operations", "340 Checks", "100.0% Pass", "ACTIVE 🟢"),
        ("Kavitha (HR Executive)", "Campus Hiring", "290 Checks", "97.5% Pass", "ACTIVE 🟢"),
        ("Praveen (HR Recruiter)", "Logistics & Supply", "180 Checks", "99.0% Pass", "ACTIVE 🟢")
    ]
    for r_idx, (rname, rdept, rchk, rpass, rstat) in enumerate(recruiters_data):
        row_y = th_y + 32 + r_idx * 52
        bg_row = (255, 255, 255, 255) if r_idx % 2 == 0 else (248, 250, 252, 255)
        draw.rectangle([(31, row_y), (30 + left_w - 1, row_y + 52)], fill=bg_row)
        draw.line([(31, row_y + 52), (30 + left_w - 1, row_y + 52)], fill=(241, 245, 249, 255), width=1)
        
        rx = 50
        draw.text((rx, row_y + 16), rname, fill=(15, 23, 42, 255), font=fonts["small_bold"])
        rx += 200
        draw.text((rx, row_y + 17), rdept, fill=(100, 116, 139, 255), font=fonts["small"])
        rx += 180
        draw.text((rx, row_y + 17), rchk, fill=(37, 99, 235, 255), font=fonts["small_bold"])
        rx += 110
        draw.text((rx, row_y + 17), rpass, fill=(5, 150, 105, 255), font=fonts["small_bold"])
        rx += 110
        draw.rounded_rectangle([(rx, row_y + 10), (rx + 95, row_y + 38)], radius=6, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255))
        draw.text((rx + 10, row_y + 16), rstat, fill=(5, 150, 105, 255), font=fonts["micro_bold"])

    # Right: Monthly Invoicing & Wallet
    rw_x = 30 + left_w + 20
    rw_w = w - rw_x - 30
    draw.rounded_rectangle([(rw_x, tbl_y), (rw_x + rw_w, tbl_y + tbl_h)], radius=10, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
    
    draw.text((rw_x + 20, tbl_y + 16), "🧾 Postpaid Tax Billing & Invoices", fill=(15, 23, 42, 255), font=fonts["bold"])
    
    # Invoice Box 1
    inv1_y = tbl_y + 55
    draw.rounded_rectangle([(rw_x + 16, inv1_y), (rw_x + rw_w - 16, inv1_y + 135)], radius=8, fill=(239, 246, 255, 255), outline=(191, 219, 254, 255))
    draw.text((rw_x + 28, inv1_y + 14), "Invoice #JOY-INV-2026-1082", fill=(37, 99, 235, 255), font=fonts["small_bold"])
    draw.text((rw_x + 28, inv1_y + 36), "Billing Period: 01 Oct - 31 Oct 2026", fill=(71, 85, 105, 255), font=fonts["micro"])
    draw.text((rw_x + 28, inv1_y + 60), "Total Amount: ₹42,500", fill=(15, 23, 42, 255), font=fonts["h3"])
    draw.text((rw_x + 28, inv1_y + 86), "Includes 18% GST (B2B Tax Credit Eligible)", fill=(100, 116, 139, 255), font=fonts["micro"])
    
    draw.rounded_rectangle([(rw_x + 28, inv1_y + 104), (rw_x + 220, inv1_y + 128)], radius=4, fill=(37, 99, 235, 255))
    draw.text((rw_x + 36, inv1_y + 109), "📥 Download GST PDF", fill=(255, 255, 255, 255), font=fonts["micro_bold"])

    # Invoice Box 2 (Settled)
    inv2_y = inv1_y + 150
    draw.rounded_rectangle([(rw_x + 16, inv2_y), (rw_x + rw_w - 16, inv2_y + 105)], radius=8, fill=(248, 250, 252, 255), outline=(226, 232, 240, 255))
    draw.text((rw_x + 28, inv2_y + 14), "Invoice #JOY-INV-2026-0941", fill=(15, 23, 42, 255), font=fonts["small_bold"])
    draw.text((rw_x + 28, inv2_y + 36), "September 2026: ₹38,900 • PAID ✔", fill=(5, 150, 105, 255), font=fonts["micro_bold"])
    draw.text((rw_x + 28, inv2_y + 58), "Settled via Razorpay B2B NetBanking", fill=(100, 116, 139, 255), font=fonts["micro"])
    draw.text((rw_x + 28, inv2_y + 78), "Tax Invoice & Receipt Archived", fill=(71, 85, 105, 255), font=fonts["micro"])

    # Outer border
    draw.rectangle([(0, 0), (w - 1, h - 1)], outline=(203, 213, 225, 255), width=2)
    canvas.save(output_path, "PNG")
    print(f"Generated Company Admin Mockup: {output_path}")

def generate_hr_workstation_mockup(output_path):
    w, h = 1400, 840
    canvas = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(canvas)
    fonts = get_fonts()
    header_h = 50

    draw_browser_chrome(draw, w, h, "https://verification.joycorporatesolutions.com/joy-man-power-service/hr/agilan/candidates", fonts)

    # Top Brand Header Banner (Joy Man Power Service)
    banner_y = header_h
    banner_h = 95
    draw.rectangle([(0, banner_y), (w, banner_y + banner_h)], fill=(255, 255, 255, 255))
    draw.line([(0, banner_y + banner_h), (w, banner_y + banner_h)], fill=(226, 232, 240, 255), width=1)

    # Company Logo Emulation (Joy Man Power Service)
    draw.rounded_rectangle([(30, banner_y + 15), (95, banner_y + 80)], radius=10, fill=(5, 150, 105, 255))
    draw.text((38, banner_y + 30), "JMPS", fill=(255, 255, 255, 255), font=fonts["bold"])
    
    draw.text((115, banner_y + 20), "JOY MAN POWER SERVICE", fill=(15, 23, 42, 255), font=fonts["title"])
    draw.text((115, banner_y + 54), "HR Executive Workstation • Recruiter: Agilan (Lead Recruiter) • Live Pipeline", fill=(100, 116, 139, 255), font=fonts["small"])

    # Action buttons top right
    draw.rounded_rectangle([(w - 500, banner_y + 28), (w - 340, banner_y + 68)], radius=8, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255))
    draw.text((w - 485, banner_y + 38), "📥 Export CSV", fill=(5, 150, 105, 255), font=fonts["small_bold"])

    draw.rounded_rectangle([(w - 325, banner_y + 28), (w - 170, banner_y + 68)], radius=8, fill=(239, 246, 255, 255), outline=(191, 219, 254, 255))
    draw.text((w - 315, banner_y + 38), "⬆ Excel Bulk (500+)", fill=(37, 99, 235, 255), font=fonts["small_bold"])

    draw.rounded_rectangle([(w - 155, banner_y + 28), (w - 30, banner_y + 68)], radius=8, fill=(5, 150, 105, 255))
    draw.text((w - 142, banner_y + 38), "+ Add Single", fill=(255, 255, 255, 255), font=fonts["small_bold"])

    # 4 Status Summary Badges
    stat_y = banner_y + banner_h + 16
    stat_w = (w - 90) // 4
    stats = [
        ("Total Candidates in Pipeline", "45", "All batches active", (15, 23, 42, 255), (255, 255, 255, 255)),
        ("Completed & Verified", "38 (84%)", "PDF Dossier Ready", (5, 150, 105, 255), (236, 253, 245, 255)),
        ("In Progress / Link Sent", "6", "Awaiting Candidate OTP", (37, 99, 235, 255), (239, 246, 255, 255)),
        ("Moonlighting Flagged", "1", "PF Dual Employment Alert", (220, 38, 38, 255), (254, 242, 242, 255))
    ]
    for idx, (st_t, st_v, st_s, st_c, st_bg) in enumerate(stats):
        sx = 30 + idx * (stat_w + 10)
        draw.rounded_rectangle([(sx, stat_y), (sx + stat_w, stat_y + 90)], radius=10, fill=st_bg, outline=(226, 232, 240, 255), width=1)
        draw.text((sx + 16, stat_y + 12), st_t, fill=(100, 116, 139, 255), font=fonts["micro_bold"])
        draw.text((sx + 16, stat_y + 32), st_v, fill=st_c, font=fonts["h2"])
        draw.text((sx + 16, stat_y + 64), st_s, fill=(71, 85, 105, 255), font=fonts["micro"])

    # Candidate Pipeline Data Table
    tbl_y = stat_y + 108
    tbl_h = h - tbl_y - 20
    draw.rounded_rectangle([(30, tbl_y), (w - 30, tbl_y + tbl_h)], radius=10, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
    
    # Table Title & Filter bar
    draw.text((50, tbl_y + 16), "📋 Candidate Live Verification Pipeline", fill=(15, 23, 42, 255), font=fonts["bold"])
    draw.text((w - 300, tbl_y + 18), "🔍 Search candidate by name / mobile...", fill=(148, 163, 184, 255), font=fonts["small"])

    th_y = tbl_y + 48
    draw.rectangle([(31, th_y), (w - 31, th_y + 32)], fill=(241, 245, 249, 255))
    cols = [
        ("Candidate Name & Role", 240),
        ("WhatsApp Invite", 140),
        ("Aadhaar e-KYC", 160),
        ("Bank Penny Drop", 160),
        ("EPFO Job History", 180),
        ("AI Face Match", 140),
        ("Dossier Status", 150),
        ("Action", 140)
    ]
    cur_x = 50
    for cn, cw in cols:
        draw.text((cur_x, th_y + 8), cn, fill=(71, 85, 105, 255), font=fonts["micro_bold"])
        cur_x += cw

    candidates = [
        ("Aarav Sharma\nSr. Software Engineer", "SENT ✔\nPIN: 9402", "VERIFIED ✔\nXXXX-XXXX-5829", "MATCHED ✔\nSBI A/C Verified", "CLEAR ✔\nNo Moonlighting", "98.4% MATCH 🟢\nLive 3D Selfie", "DOSSIER READY 🟢", "📥 Download PDF"),
        ("Priya Nair\nFinancial Analyst", "SENT ✔\nPIN: 8134", "VERIFIED ✔\nXXXX-XXXX-1940", "MATCHED ✔\nHDFC Verified", "CLEAR ✔\nNo Moonlighting", "99.1% MATCH 🟢\nLive 3D Selfie", "DOSSIER READY 🟢", "📥 Download PDF"),
        ("Karthik R\nPlant Supervisor", "SENT ✔\nPIN: 3321", "VERIFIED ✔\nXXXX-XXXX-4811", "MATCHED ✔\nICICI Verified", "FLAGGED ⚠️\nDual PF Active", "96.5% MATCH 🟢\nLive 3D Selfie", "UNDER REVIEW ⚠️", "🔍 Inspect Alert"),
        ("Sneha Patel\nQuality Auditor", "SENT ✔\nPIN: 7719", "IN PROGRESS ⏳\nOTP Requested", "PENDING ⏳\nAwaiting OTP", "PENDING ⏳\nAwaiting OTP", "PENDING ⏳\nAwaiting Selfie", "IN PROGRESS ⏳", "🔄 Resend WhatsApp"),
        ("Manoj Kumar\nSupply Chain Lead", "SENT ✔\nPIN: 4509", "VERIFIED ✔\nXXXX-XXXX-7723", "MATCHED ✔\nAxis Verified", "CLEAR ✔\nNo Moonlighting", "97.8% MATCH 🟢\nLive 3D Selfie", "DOSSIER READY 🟢", "📥 Download PDF")
    ]

    for r_idx, cand in enumerate(candidates):
        row_y = th_y + 32 + r_idx * 56
        bg_row = (255, 255, 255, 255) if r_idx % 2 == 0 else (248, 250, 252, 255)
        draw.rectangle([(31, row_y), (w - 31, row_y + 56)], fill=bg_row)
        draw.line([(31, row_y + 56), (w - 31, row_y + 56)], fill=(241, 245, 249, 255), width=1)
        
        rx = 50
        # Col 1: Candidate
        lines1 = cand[0].split("\n")
        draw.text((rx, row_y + 10), lines1[0], fill=(15, 23, 42, 255), font=fonts["small_bold"])
        draw.text((rx, row_y + 32), lines1[1], fill=(100, 116, 139, 255), font=fonts["micro"])
        rx += 240

        # Col 2: WhatsApp
        lines2 = cand[1].split("\n")
        draw.text((rx, row_y + 10), lines2[0], fill=(5, 150, 105, 255), font=fonts["micro_bold"])
        draw.text((rx, row_y + 32), lines2[1], fill=(100, 116, 139, 255), font=fonts["micro"])
        rx += 140

        # Col 3: Aadhaar
        lines3 = cand[2].split("\n")
        c_clr3 = (5, 150, 105, 255) if "VERIFIED" in lines3[0] else (217, 119, 6, 255)
        draw.text((rx, row_y + 10), lines3[0], fill=c_clr3, font=fonts["micro_bold"])
        draw.text((rx, row_y + 32), lines3[1], fill=(71, 85, 105, 255), font=fonts["micro"])
        rx += 160

        # Col 4: Bank
        lines4 = cand[3].split("\n")
        c_clr4 = (5, 150, 105, 255) if "MATCHED" in lines4[0] else (100, 116, 139, 255)
        draw.text((rx, row_y + 10), lines4[0], fill=c_clr4, font=fonts["micro_bold"])
        draw.text((rx, row_y + 32), lines4[1], fill=(71, 85, 105, 255), font=fonts["micro"])
        rx += 160

        # Col 5: EPFO
        lines5 = cand[4].split("\n")
        c_clr5 = (5, 150, 105, 255) if "CLEAR" in lines5[0] else ((220, 38, 38, 255) if "FLAGGED" in lines5[0] else (100, 116, 139, 255))
        draw.text((rx, row_y + 10), lines5[0], fill=c_clr5, font=fonts["micro_bold"])
        draw.text((rx, row_y + 32), lines5[1], fill=(71, 85, 105, 255), font=fonts["micro"])
        rx += 180

        # Col 6: Face Match
        lines6 = cand[5].split("\n")
        c_clr6 = (5, 150, 105, 255) if "MATCH" in lines6[0] else (100, 116, 139, 255)
        draw.text((rx, row_y + 10), lines6[0], fill=c_clr6, font=fonts["micro_bold"])
        draw.text((rx, row_y + 32), lines6[1], fill=(71, 85, 105, 255), font=fonts["micro"])
        rx += 140

        # Col 7: Dossier Status
        st_txt = cand[6]
        if "READY" in st_txt:
            draw.rounded_rectangle([(rx, row_y + 12), (rx + 130, row_y + 40)], radius=6, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255))
            draw.text((rx + 10, row_y + 19), st_txt, fill=(5, 150, 105, 255), font=fonts["micro_bold"])
        elif "REVIEW" in st_txt:
            draw.rounded_rectangle([(rx, row_y + 12), (rx + 130, row_y + 40)], radius=6, fill=(254, 242, 242, 255), outline=(254, 202, 202, 255))
            draw.text((rx + 10, row_y + 19), st_txt, fill=(220, 38, 38, 255), font=fonts["micro_bold"])
        else:
            draw.rounded_rectangle([(rx, row_y + 12), (rx + 130, row_y + 40)], radius=6, fill=(254, 243, 199, 255), outline=(253, 230, 138, 255))
            draw.text((rx + 10, row_y + 19), st_txt, fill=(217, 119, 6, 255), font=fonts["micro_bold"])
        rx += 150

        # Col 8: Action button
        act_txt = cand[7]
        if "PDF" in act_txt:
            draw.rounded_rectangle([(rx, row_y + 10), (rx + 125, row_y + 42)], radius=6, fill=(5, 150, 105, 255))
            draw.text((rx + 10, row_y + 18), act_txt, fill=(255, 255, 255, 255), font=fonts["micro_bold"])
        elif "Inspect" in act_txt:
            draw.rounded_rectangle([(rx, row_y + 10), (rx + 125, row_y + 42)], radius=6, fill=(220, 38, 38, 255))
            draw.text((rx + 10, row_y + 18), act_txt, fill=(255, 255, 255, 255), font=fonts["micro_bold"])
        else:
            draw.rounded_rectangle([(rx, row_y + 10), (rx + 125, row_y + 42)], radius=6, fill=(241, 245, 249, 255), outline=(203, 213, 225, 255))
            draw.text((rx + 10, row_y + 18), act_txt, fill=(71, 85, 105, 255), font=fonts["micro_bold"])

    # Outer border
    draw.rectangle([(0, 0), (w - 1, h - 1)], outline=(203, 213, 225, 255), width=2)
    canvas.save(output_path, "PNG")
    print(f"Generated HR Workstation Mockup: {output_path}")

def generate_candidate_mobile_mockup(output_path):
    w, h = 600, 1200
    canvas = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(canvas)
    fonts = get_fonts(scale=1.35)

    # Smartphone Outer Chassis (Dark Slate Titanium)
    draw.rounded_rectangle([(8, 8), (w - 8, h - 8)], radius=56, fill=(15, 23, 42, 255), outline=(51, 65, 85, 255), width=5)
    
    # Screen Bezel & Canvas
    sx, sy, sw, sh = 24, 60, w - 48, h - 120
    draw.rounded_rectangle([(sx, sy), (sx + sw, sy + sh)], radius=32, fill=(248, 250, 252, 255))

    # Dynamic Island / Camera Notch
    draw.rounded_rectangle([(w//2 - 75, 26), (w//2 + 75, 48)], radius=11, fill=(30, 41, 59, 255))
    draw.ellipse([(w//2 + 45, 32), (w//2 + 60, 42)], fill=(15, 23, 42, 255))

    # Mobile App Header
    draw.rectangle([(sx, sy), (sx + sw, sy + 85)], fill=(255, 255, 255, 255))
    draw.line([(sx, sy + 85), (sx + sw, sy + 85)], fill=(226, 232, 240, 255), width=2)
    draw.text((sx + 24, sy + 18), "JOY TRUE PROFILE", fill=(15, 23, 42, 255), font=fonts["title"])
    draw.text((sx + 24, sy + 50), "Candidate Self-Verification Portal • Mobile Web", fill=(100, 116, 139, 255), font=fonts["small"])

    # Progress Indicator Bar
    draw.rounded_rectangle([(sx + 20, sy + 105), (sx + sw - 20, sy + 150)], radius=10, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255), width=2)
    draw.text((sx + 35, sy + 116), "✔ Step 2 of 4: Direct Identity & e-KYC", fill=(5, 150, 105, 255), font=fonts["bold"])

    # Card 1: 4-Digit PIN Security
    draw.rounded_rectangle([(sx + 20, sy + 165), (sx + sw - 20, sy + 255)], radius=14, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)
    draw.text((sx + 32, sy + 180), "🔒 Security PIN Authentication", fill=(15, 23, 42, 255), font=fonts["bold"])
    draw.text((sx + 32, sy + 212), "PIN Verified from WhatsApp: • • • • (PIN: 9402)", fill=(5, 150, 105, 255), font=fonts["body"])

    # Card 2: UIDAI Aadhaar OTP
    draw.rounded_rectangle([(sx + 20, sy + 270), (sx + sw - 20, sy + 425)], radius=14, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)
    draw.text((sx + 32, sy + 285), "🆔 UIDAI Aadhaar Paperless e-KYC", fill=(15, 23, 42, 255), font=fonts["bold"])
    draw.text((sx + 32, sy + 320), "Masked Aadhaar: XXXX-XXXX-5829", fill=(71, 85, 105, 255), font=fonts["body"])
    draw.rounded_rectangle([(sx + 32, sy + 358), (sx + sw - 32, sy + 405)], radius=8, fill=(240, 253, 244, 255), outline=(187, 247, 208, 255), width=1)
    draw.text((sx + 45, sy + 370), "✔ Aadhaar OTP Verified • Demographics Match", fill=(5, 150, 105, 255), font=fonts["small_bold"])

    # Card 3: DigiLocker Degree
    draw.rounded_rectangle([(sx + 20, sy + 440), (sx + sw - 20, sy + 595)], radius=14, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)
    draw.text((sx + 32, sy + 455), "🎓 DigiLocker Degree & Marksheet", fill=(15, 23, 42, 255), font=fonts["bold"])
    draw.text((sx + 32, sy + 490), "B.Tech Computer Science (Anna University)", fill=(71, 85, 105, 255), font=fonts["body"])
    draw.rounded_rectangle([(sx + 32, sy + 528), (sx + sw - 32, sy + 575)], radius=8, fill=(239, 246, 255, 255), outline=(191, 219, 254, 255), width=1)
    draw.text((sx + 45, sy + 540), "✔ Original DigiLocker Degree Certificate Fetched", fill=(37, 99, 235, 255), font=fonts["small_bold"])

    # Card 4: 3D Live Camera Selfie Scan
    draw.rounded_rectangle([(sx + 20, sy + 610), (sx + sw - 20, sy + 820)], radius=14, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)
    draw.text((sx + 32, sy + 625), "📸 3D Live Camera Face Scan", fill=(15, 23, 42, 255), font=fonts["bold"])
    
    # Camera Viewfinder Mock
    cam_x = w // 2 - 60
    draw.ellipse([(cam_x, sy + 665), (cam_x + 120, sy + 760)], fill=(241, 245, 249, 255), outline=(5, 150, 105, 255), width=3)
    draw.text((cam_x + 30, sy + 700), "👤 LIVE", fill=(5, 150, 105, 255), font=fonts["bold"])
    draw.text((sx + 40, sy + 778), "Liveness: Straight ✔  Left ✔  Right ✔", fill=(5, 150, 105, 255), font=fonts["bold"])

    # Submit Button (Centered with comfortable padding)
    btn_y = sy + 845
    draw.rounded_rectangle([(sx + 20, btn_y), (sx + sw - 20, btn_y + 65)], radius=14, fill=(5, 150, 105, 255))
    draw.text((w//2 - 130, btn_y + 18), "Submit & Verify Dossier ➔", fill=(255, 255, 255, 255), font=fonts["bold"])

    # Home bar
    draw.rounded_rectangle([(w//2 - 80, h - 36), (w//2 + 80, h - 28)], radius=4, fill=(148, 163, 184, 255))
    canvas.save(output_path, "PNG")
    print(f"Generated Candidate Mobile Mockup: {output_path}")

def generate_vendor_studio_mockup(output_path):
    w, h = 1400, 840
    canvas = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(canvas)
    fonts = get_fonts()
    header_h = 50

    draw_browser_chrome(draw, w, h, "https://verification.joycorporatesolutions.com/vendor-verification/studio", fonts)

    # Top Title Banner
    banner_y = header_h
    banner_h = 95
    draw.rectangle([(0, banner_y), (w, banner_y + banner_h)], fill=(255, 255, 255, 255))
    draw.line([(0, banner_y + banner_h), (w, banner_y + banner_h)], fill=(226, 232, 240, 255), width=1)

    draw.rounded_rectangle([(30, banner_y + 15), (95, banner_y + 80)], radius=10, fill=(124, 58, 237, 255))
    draw.text((38, banner_y + 30), "VEND", fill=(255, 255, 255, 255), font=fonts["bold"])
    
    draw.text((115, banner_y + 20), "VENDOR & CONTRACTOR DUE DILIGENCE STUDIO", fill=(15, 23, 42, 255), font=fonts["title"])
    draw.text((115, banner_y + 54), "11 Statutory Verification Rails • CLRA Form XVI Contractor Register • Anti-Ghost Worker Sync", fill=(100, 116, 139, 255), font=fonts["small"])

    draw.rounded_rectangle([(w - 260, banner_y + 28), (w - 30, banner_y + 68)], radius=8, fill=(5, 150, 105, 255))
    draw.text((w - 240, banner_y + 38), "+ Verify New Vendor", fill=(255, 255, 255, 255), font=fonts["small_bold"])

    # 6 Grid Verification Cards
    cards = [
        ("🏛️ MCA Corporate CIN Verification", "CIN: U74999KA2026PTC192841", "Ministry of Corporate Affairs Registry", "Active & Legally Compliant (No Strike-off)", (5, 150, 105, 255), (236, 253, 245, 255)),
        ("🧾 GSTIN Tax Filing History", "GSTIN: 33AABCT1332L1Z2", "Goods & Services Tax Network (GSTN)", "Active • GSTR-3B & GSTR-1 Filed on Time (3 Yrs)", (37, 99, 235, 255), (239, 246, 255, 255)),
        ("💳 Corporate PAN Validation", "PAN: AABCT1332L", "Income Tax Dept / NSDL Database", "Valid • Legal Entity Trade Name 100% Matched", (124, 58, 237, 255), (245, 243, 255, 255)),
        ("🏭 MSME Udyam Registration", "Udyam: UDYAM-TN-03-0019284", "Ministry of MSME Enterprise Portal", "Verified • Category: Small Manufacturing Enterprise", (217, 119, 6, 255), (254, 243, 199, 255)),
        ("🏦 NPCI IMPS Bank Penny Drop", "A/C: 987654321098 • IFSC: SBIN0001234", "National Payments Corp Banking Rail", "₹1 Penny Drop Success • Registered Name Matched", (5, 150, 105, 255), (236, 253, 245, 255)),
        ("👷 CLRA Form XVI Labor Muster", "Contractor Workforce: 48 Deployed Workers", "Contract Labour Regulation & Abolition Act", "100% PF & ESIC Verified • Zero Ghost Workers", (37, 99, 235, 255), (239, 246, 255, 255))
    ]

    card_y_start = banner_y + banner_h + 18
    c_w = (w - 80) // 3
    c_h = 205

    for idx, (title, num, auth, sub, c_clr, c_bg) in enumerate(cards):
        row = idx // 3
        col = idx % 3
        cx = 30 + col * (c_w + 10)
        cy = card_y_start + row * (c_h + 14)
        
        draw.rounded_rectangle([(cx, cy), (cx + c_w, cy + c_h)], radius=12, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
        
        # Pill inside card
        draw.rounded_rectangle([(cx + 16, cy + 14), (cx + c_w - 16, cy + 50)], radius=8, fill=c_bg)
        draw.text((cx + 26, cy + 22), title, fill=c_clr, font=fonts["small_bold"])
        
        draw.text((cx + 20, cy + 65), num, fill=(15, 23, 42, 255), font=fonts["bold"])
        draw.text((cx + 20, cy + 92), auth, fill=(100, 116, 139, 255), font=fonts["small"])
        draw.text((cx + 20, cy + 118), sub, fill=(71, 85, 105, 255), font=fonts["micro"])
        
        # Verified green tag
        draw.rounded_rectangle([(cx + 20, cy + 152), (cx + 150, cy + 182)], radius=6, fill=(240, 253, 244, 255), outline=(187, 247, 208, 255))
        draw.text((cx + 30, cy + 160), "✔ 100% VERIFIED", fill=(5, 150, 105, 255), font=fonts["micro_bold"])

    # Bottom Banner: CLRA Anti-Ghost Worker Sync
    bot_y = card_y_start + 2 * (c_h + 14) + 6
    bot_h = h - bot_y - 20
    draw.rounded_rectangle([(30, bot_y), (w - 30, bot_y + bot_h)], radius=10, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255))
    draw.text((50, bot_y + 14), "🛡️ Turnstile Biometric Gate Sync & CLRA Form XVI Compliance Active", fill=(5, 150, 105, 255), font=fonts["bold"])
    draw.text((50, bot_y + 40), "Automated cross-check: Matches daily turnstile attendance logs directly against contractor EPFO electronic challans. Stops inflated contractor invoices.", fill=(15, 23, 42, 255), font=fonts["small"])

    # Outer border
    draw.rectangle([(0, 0), (w - 1, h - 1)], outline=(203, 213, 225, 255), width=2)
    canvas.save(output_path, "PNG")
    print(f"Generated Vendor Studio Mockup: {output_path}")

def generate_dossier_pdf_mockup(output_path):
    w, h = 1400, 840
    canvas = Image.new("RGBA", (w, h), (241, 245, 249, 255))
    draw = ImageDraw.Draw(canvas)
    fonts = get_fonts()
    header_h = 50

    draw_browser_chrome(draw, w, h, "https://verification.joycorporatesolutions.com/dossier/preview/TOK_JOY_EMP_2026_8921", fonts)

    # Centered Document Sheet (White with shadow)
    sheet_x = 200
    sheet_w = 1000
    sheet_y = header_h + 18
    sheet_h = h - sheet_y - 20

    draw.rounded_rectangle([(sheet_x, sheet_y), (sheet_x + sheet_w, sheet_y + sheet_h)], radius=12, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)

    # Document Corporate Header
    draw.rectangle([(sheet_x, sheet_y), (sheet_x + sheet_w, sheet_y + 95)], fill=(248, 250, 252, 255))
    draw.line([(sheet_x, sheet_y + 95), (sheet_x + sheet_w, sheet_y + 95)], fill=(226, 232, 240, 255), width=1)

    draw.text((sheet_x + 35, sheet_y + 20), "JOY CORPORATE SOLUTIONS PRIVATE LIMITED", fill=(15, 23, 42, 255), font=fonts["title"])
    draw.text((sheet_x + 35, sheet_y + 54), "OFFICIAL EMPLOYEE BACKGROUND VERIFICATION DOSSIER", fill=(5, 150, 105, 255), font=fonts["bold"])

    draw.text((sheet_x + sheet_w - 240, sheet_y + 24), "CERTIFIED DOSSIER", fill=(37, 99, 235, 255), font=fonts["bold"])
    draw.text((sheet_x + sheet_w - 240, sheet_y + 50), "Dossier ID: #JOY-2026-8921", fill=(100, 116, 139, 255), font=fonts["small"])

    # Candidate Profile Section
    prof_y = sheet_y + 115
    draw.ellipse([(sheet_x + 35, prof_y), (sheet_x + 130, prof_y + 95)], fill=(241, 245, 249, 255), outline=(5, 150, 105, 255), width=2)
    draw.text((sheet_x + 58, prof_y + 38), "PHOTO", fill=(100, 116, 139, 255), font=fonts["small_bold"])

    draw.text((sheet_x + 155, prof_y + 5), "Candidate: Aarav Sharma", fill=(15, 23, 42, 255), font=fonts["title"])
    draw.text((sheet_x + 155, prof_y + 36), "Designation: Senior Software Engineer  •  Department: Engineering & Product", fill=(71, 85, 105, 255), font=fonts["body"])
    draw.text((sheet_x + 155, prof_y + 62), "Overall Verification Result: 100% VERIFIED & COMPLIANT ✔", fill=(5, 150, 105, 255), font=fonts["bold"])

    # 4 Verification Result Cards
    badges = [
        ("✔ UIDAI Aadhaar e-KYC", "Masked: XXXX-XXXX-5829 • OTP Verified • Demographics Match"),
        ("✔ NSDL PAN Card Verification", "PAN: ABCPS1234F • Legal Name Match Score: 100.0%"),
        ("✔ NPCI Bank Penny Drop Test", "A/C: 987654321098 • SBI Bank • IMPS Penny Drop Match"),
        ("✔ EPFO Moonlighting Radar", "UAN History Clean • Zero Overlapping Dual Employments")
    ]
    grid_y = prof_y + 120
    for b_idx, (b_t, b_s) in enumerate(badges):
        bx = sheet_x + 35 + (b_idx % 2) * 465
        by = grid_y + (b_idx // 2) * 90
        draw.rounded_rectangle([(bx, by), (bx + 450, by + 80)], radius=8, fill=(248, 250, 252, 255), outline=(226, 232, 240, 255))
        draw.text((bx + 18, by + 16), b_t, fill=(5, 150, 105, 255), font=fonts["bold"])
        draw.text((bx + 18, by + 44), b_s, fill=(71, 85, 105, 255), font=fonts["small"])

    # QR Code & Authenticity Seal (Bottom)
    qr_x, qr_y, qr_size = sheet_x + sheet_w - 230, sheet_y + sheet_h - 195, 155
    draw.rectangle([(qr_x, qr_y), (qr_x + qr_size, qr_y + qr_size)], fill=(248, 250, 252, 255), outline=(15, 23, 42, 255), width=2)
    
    # QR Square patterns
    draw.rectangle([(qr_x + 15, qr_y + 15), (qr_x + 55, qr_y + 55)], fill=(15, 23, 42, 255))
    draw.rectangle([(qr_x + qr_size - 55, qr_y + 15), (qr_x + qr_size - 15, qr_y + 55)], fill=(15, 23, 42, 255))
    draw.rectangle([(qr_x + 15, qr_y + qr_size - 55), (qr_x + 55, qr_y + qr_size - 15)], fill=(15, 23, 42, 255))
    draw.rectangle([(qr_x + 65, qr_y + 65), (qr_x + 95, qr_y + 95)], fill=(5, 150, 105, 255))
    draw.text((qr_x + 16, qr_y + qr_size + 8), "📲 Scan to Verify Dossier", fill=(15, 23, 42, 255), font=fonts["micro_bold"])

    # Cryptographic Hash & Consent Trail
    draw.text((sheet_x + 35, sheet_y + sheet_h - 145), "🔐 Cryptographic SHA-256 Tamper-Proof Stamp:", fill=(15, 23, 42, 255), font=fonts["bold"])
    draw.text((sheet_x + 35, sheet_y + sheet_h - 118), "SHA256: 8f4e2b9c7a1d5e6f3b0c8a2e4d6f8a1c9e3b7a5d1f2e4c6a8b0d2e4f6a8b0c2", fill=(100, 116, 139, 255), font=fonts["micro"])
    draw.text((sheet_x + 35, sheet_y + sheet_h - 85), "DPDP Act 2023 Digital Candidate Consent Logged  •  Direct Government Rail Certified", fill=(5, 150, 105, 255), font=fonts["small_bold"])

    # Outer border
    draw.rectangle([(0, 0), (w - 1, h - 1)], outline=(203, 213, 225, 255), width=2)
    canvas.save(output_path, "PNG")
    print(f"Generated Master Dossier Mockup: {output_path}")

def build_all():
    out_dir = "public/assets/mockups"
    os.makedirs(out_dir, exist_ok=True)
    generate_super_admin_mockup(f"{out_dir}/super_admin_mockup.png")
    generate_company_admin_mockup(f"{out_dir}/company_admin_mockup.png")
    generate_hr_workstation_mockup(f"{out_dir}/hr_workstation_mockup.png")
    generate_candidate_mobile_mockup(f"{out_dir}/candidate_mobile_mockup.png")
    generate_vendor_studio_mockup(f"{out_dir}/vendor_portal_mockup.png")
    generate_dossier_pdf_mockup(f"{out_dir}/dossier_pdf_mockup.png")
    print("All 6 high-definition mockups generated successfully!")

if __name__ == "__main__":
    build_all()
