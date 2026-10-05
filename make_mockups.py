import os
from PIL import Image, ImageDraw, ImageFont

def create_browser_mockup(image_path, output_path, url_text="https://verification.joycorporatesolutions.com", width=1200, height=800):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img = Image.open(image_path).convert("RGBA")
    
    # Canvas
    header_height = 48
    canvas_w = width
    canvas_h = height
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Browser Header Background
    draw.rectangle([(0, 0), (canvas_w, header_height)], fill=(241, 245, 249, 255))
    draw.line([(0, header_height), (canvas_w, header_height)], fill=(226, 232, 240, 255), width=2)
    
    # 3 Browser Window Dots (Red, Yellow, Green)
    dot_y = header_height // 2
    draw.ellipse([(20, dot_y - 6), (32, dot_y + 6)], fill=(239, 68, 68, 255))   # Red
    draw.ellipse([(40, dot_y - 6), (52, dot_y + 6)], fill=(245, 158, 11, 255))  # Amber
    draw.ellipse([(60, dot_y - 6), (72, dot_y + 6)], fill=(16, 185, 129, 255))  # Green
    
    # Address Bar
    addr_x1 = 90
    addr_x2 = canvas_w - 40
    addr_y1 = 8
    addr_y2 = header_height - 8
    draw.rounded_rectangle([(addr_x1, addr_y1), (addr_x2, addr_y2)], radius=8, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    
    # Address Text
    try:
        font = ImageFont.truetype("arial.ttf", 14)
    except Exception:
        font = ImageFont.load_default()
    draw.text((addr_x1 + 16, addr_y1 + 6), f"🔒  {url_text}", fill=(100, 116, 139, 255), font=font)
    
    # Resize and paste screenshot
    body_h = canvas_h - header_height
    img_resized = img.resize((canvas_w, body_h), Image.Resampling.LANCZOS)
    canvas.paste(img_resized, (0, header_height), img_resized)
    
    # Subtle outer border
    draw.rectangle([(0, 0), (canvas_w - 1, canvas_h - 1)], outline=(203, 213, 225, 255), width=2)
    canvas.save(output_path, "PNG")
    print(f"Created browser mockup: {output_path}")

def create_mobile_mockup(image_path, output_path, width=420, height=840):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img = Image.open(image_path).convert("RGBA")
    
    canvas = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Phone Body Outer Frame (Dark Slate / Titanium)
    draw.rounded_rectangle([(4, 4), (width - 4, height - 4)], radius=40, fill=(15, 23, 42, 255), outline=(51, 65, 85, 255), width=4)
    
    # Phone Screen Inner Bounds
    screen_margin_x = 16
    screen_top = 40
    screen_bottom = height - 40
    screen_w = width - (screen_margin_x * 2)
    screen_h = screen_bottom - screen_top
    
    # Speaker Notch
    notch_w = 120
    notch_h = 18
    notch_x1 = (width - notch_w) // 2
    draw.rounded_rectangle([(notch_x1, 14), (notch_x1 + notch_w, 14 + notch_h)], radius=9, fill=(30, 41, 59, 255))
    
    # Resize Screenshot and Paste
    img_resized = img.resize((screen_w, screen_h), Image.Resampling.LANCZOS)
    canvas.paste(img_resized, (screen_margin_x, screen_top))
    
    # Bottom Home Indicator Bar
    bar_w = 140
    bar_h = 4
    bar_x1 = (width - bar_w) // 2
    bar_y1 = height - 20
    draw.rounded_rectangle([(bar_x1, bar_y1), (bar_x1 + bar_w, bar_y1 + bar_h)], radius=2, fill=(148, 163, 184, 255))
    
    canvas.save(output_path, "PNG")
    print(f"Created mobile mockup: {output_path}")

if __name__ == "__main__":
    src_dir = "public/assets/presentation_portal_images"
    out_dir = "public/assets/mockups"
    
    # Super Admin Mockup
    create_browser_mockup(
        f"{src_dir}/super_admin.png",
        f"{out_dir}/super_admin_mockup.png",
        "https://verification.joycorporatesolutions.com/superadmin/console"
    )
    
    # Company Admin Mockup
    create_browser_mockup(
        f"{src_dir}/company_admin.png",
        f"{out_dir}/company_admin_mockup.png",
        "https://verification.joycorporatesolutions.com/joy-corporate-solutions/company/admin"
    )
    
    # HR Executive Workstation Mockup
    create_browser_mockup(
        f"{src_dir}/hr_workstation.png",
        f"{out_dir}/hr_workstation_mockup.png",
        "https://verification.joycorporatesolutions.com/joy-man-power-service/hr/agilan/candidates"
    )
    
    # Vendor & Contractor Due Diligence Mockup
    create_browser_mockup(
        f"{src_dir}/vendor_portal.png",
        f"{out_dir}/vendor_portal_mockup.png",
        "https://verification.joycorporatesolutions.com/vendor-verification/studio"
    )
    
    # Certified Dossier PDF Mockup
    create_browser_mockup(
        f"{src_dir}/dossier_pdf.png",
        f"{out_dir}/dossier_pdf_mockup.png",
        "https://verification.joycorporatesolutions.com/dossier/preview/TOK_JOY_EMP"
    )
    
    # Candidate Mobile Mockup
    create_mobile_mockup(
        f"{src_dir}/candidate_portal.png",
        f"{out_dir}/candidate_mobile_mockup.png"
    )
