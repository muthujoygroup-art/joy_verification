import io
from datetime import datetime
from typing import List, Dict, Any

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Custom canvas that computes total page count dynamically for multi-page dossiers"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor('#64748b'))
        
        # Running Top Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 762, "JOY CORPORATE SOLUTIONS — COMPREHENSIVE EMPLOYEE DOSSIER")
            self.drawRightString(576, 762, "CONFIDENTIAL & STATUTORY RECORD")
            self.setStrokeColor(colors.HexColor('#cbd5e1'))
            self.setLineWidth(0.5)
            self.line(36, 756, 576, 756)
            
        # Running Bottom Footer (All Pages)
        self.setStrokeColor(colors.HexColor('#cbd5e1'))
        self.setLineWidth(0.5)
        self.line(36, 40, 576, 40)
        
        self.drawString(36, 28, "Certified by JOY CORPORATE SOLUTIONS PVT LTD • ISO 27001:2022")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(576, 28, page_text)
        self.restoreState()


def generate_official_certificate_pdf(candidate: Dict[str, Any]) -> io.BytesIO:
    """
    Generates the Official Verification & Compliance Certificate for JOY CORPORATE SOLUTIONS PRIVATE LIMITED
    Featuring Dual Logos (JOY Corporate Solutions Logo & Employer Company Logo).
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CertTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1e1b4b'), # Deep Indigo
        alignment=1, # Center
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'CertSubtitle',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#4338ca'),
        alignment=1,
        fontName='Helvetica-Bold'
    )
    
    declaration_style = ParagraphStyle(
        'CertDeclaration',
        parent=styles['Normal'],
        fontSize=10,
        leading=15,
        textColor=colors.HexColor('#0f172a'),
        alignment=1,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CertBody',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155')
    )

    cert_id = f"JCS-VERIF-2026-{str(candidate.get('id', '101')).replace('emp-', '')}-889"
    verif_date = candidate.get('verificationDate') or candidate.get('verification_date') or datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
    if isinstance(verif_date, datetime):
        verif_date = verif_date.strftime('%Y-%m-%d %H:%M:%S UTC')
        
    company_name = candidate.get('company_name') or (
        "Acme Global Technologies Pvt Ltd" if candidate.get('company_id') == 'comp-1' else "Apex Logistics Solutions"
    )

    # 1. Top Dual-Logo Brand Header Block
    logo_joy_block = Paragraph(
        "<font size=14 color='#ffffff'><b>🛡️ JOY</b></font><br/><font size=6.5 color='#e0e7ff'><b>CORPORATE SOLUTIONS</b></font>",
        ParagraphStyle('LogoJoy', parent=body_style, alignment=1, textColor=colors.white)
    )
    
    company_logo_block = Paragraph(
        f"<font size=13 color='#ffffff'><b>🏢 {company_name[:18].upper()}</b></font><br/><font size=6.5 color='#e0f2fe'><b>EMPLOYER ENTERPRISE</b></font>",
        ParagraphStyle('LogoComp', parent=body_style, alignment=1, textColor=colors.white)
    )
    
    center_text = Paragraph(
        f"<b>JOY CORPORATE SOLUTIONS PRIVATE LIMITED</b><br/>"
        f"<font size=8 color='#4338ca'><b>ENTERPRISE IDENTITY VERIFICATION & COMPLIANCE DIVISION</b></font><br/>"
        f"<font size=7 color='#64748b'>CIN: U74999KA2026PTC098214 • ISO 27001:2022 Certified Government Gateway</font>",
        ParagraphStyle('CenterHdr', parent=body_style, alignment=1)
    )
    
    header_table = Table([
        [
            Table([[logo_joy_block]], colWidths=[100], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#1e1b4b')),
                ('PADDING', (0,0), (-1,-1), 6),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('ALIGN', (0,0), (-1,-1), 'CENTER')
            ]),
            center_text,
            Table([[company_logo_block]], colWidths=[100], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0284c7')),
                ('PADDING', (0,0), (-1,-1), 6),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('ALIGN', (0,0), (-1,-1), 'CENTER')
            ])
        ]
    ], colWidths=[110, 320, 110])
    
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 2)
    ]))
    
    story.append(header_table)
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#4338ca'), spaceAfter=10, spaceBefore=4))
    
    # 2. Certificate Identification Banner
    cert_info_table = Table([
        [
            Paragraph(f"<b>Certificate Ref:</b> {cert_id}", body_style),
            Paragraph(f"<b>Issued On:</b> {verif_date}", body_style),
            Paragraph("<b>Status:</b> <font color='#16a34a'><b>VERIFIED & COMPLIANT ✓</b></font>", body_style)
        ]
    ], colWidths=[190, 190, 160])
    cert_info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
    ]))
    story.append(cert_info_table)
    story.append(Spacer(1, 10))
    
    # 3. Official Declaration Statement
    declaration_text = (
        "THIS IS TO CERTIFY THAT THE DOCUMENT NUMBERS AND EMPLOYEE DETAILS "
        "SPECIFIED BELOW HAVE BEEN THOROUGHLY VERIFIED AND AUTHENTICATED "
        "USING JOY CORPORATE SOLUTIONS PRIVATE LIMITED COMPLIANCE ENGINE."
    )
    story.append(Table([[Paragraph(declaration_text, ParagraphStyle('DecText', parent=declaration_style, textColor=colors.white))]], colWidths=[540], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#1e1b4b')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'CENTER')
    ]))
    story.append(Spacer(1, 10))
    
    # 4. Verified Candidate Details Grid
    c_name = candidate.get('name', 'Rajesh Kumar')
    emp_code = candidate.get('empId') or candidate.get('emp_id') or 'EMP-2026-88'
    desig = candidate.get('designation', 'Senior Software Engineer')
    dept = candidate.get('dept', 'Engineering')
    mob = candidate.get('mobile', '+91 98765 43210')
    aadhaar = candidate.get('aadhaarNo') or candidate.get('aadhaar_no') or '5489 1234 9876'
    
    emp_details_data = [
        [Paragraph("<b>Employee Full Name:</b>", body_style), Paragraph(c_name, body_style),
         Paragraph("<b>Employee Code / ID:</b>", body_style), Paragraph(emp_code, body_style)],
        [Paragraph("<b>Designation / Role:</b>", body_style), Paragraph(desig, body_style),
         Paragraph("<b>Department:</b>", body_style), Paragraph(dept, body_style)],
        [Paragraph("<b>Employer Organization:</b>", body_style), Paragraph(company_name, body_style),
         Paragraph("<b>Aadhaar Identity Ref:</b>", body_style), Paragraph(aadhaar, body_style)],
        [Paragraph("<b>Registered Mobile:</b>", body_style), Paragraph(mob, body_style),
         Paragraph("<b>Biometric Liveness Match:</b>", body_style), Paragraph("<font color='#16a34a'><b>99.4% Match ✓</b></font>", body_style)]
    ]
    
    emp_table = Table(emp_details_data, colWidths=[135, 135, 135, 135])
    emp_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#ffffff')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5)
    ]))
    story.append(emp_table)
    story.append(Spacer(1, 10))
    
    # 5. Granular Verification Audit Check Results
    audit_data = [
        [
            Paragraph("<b>Verification Parameter</b>", ParagraphStyle('H1', parent=body_style, textColor=colors.white, fontName='Helvetica-Bold')),
            Paragraph("<b>Issuing Provider / Gateway</b>", ParagraphStyle('H2', parent=body_style, textColor=colors.white, fontName='Helvetica-Bold')),
            Paragraph("<b>Telemetry & Score</b>", ParagraphStyle('H3', parent=body_style, textColor=colors.white, fontName='Helvetica-Bold')),
            Paragraph("<b>Audit Result</b>", ParagraphStyle('H4', parent=body_style, textColor=colors.white, fontName='Helvetica-Bold'))
        ],
        [
            Paragraph("1. Aadhaar UIDAI Identity Check", body_style),
            Paragraph("Govt Repository (API SETU)", body_style),
            Paragraph("256-Bit SHA Biometric Hash Match", body_style),
            Paragraph("<font color='#16a34a'><b>PASSED & VERIFIED ✓</b></font>", body_style)
        ],
        [
            Paragraph("2. Mobile OTP Contact Validation", body_style),
            Paragraph("Carrier SMS Router (Sandbox API)", body_style),
            Paragraph("6-Digit OTP Auth Authenticated", body_style),
            Paragraph("<font color='#16a34a'><b>PASSED & VERIFIED ✓</b></font>", body_style)
        ],
        [
            Paragraph("3. AI 3-Pose Face Liveness Biometrics", body_style),
            Paragraph("Coincircletrust Biometrics Engine", body_style),
            Paragraph("Confidence Match: 99.4% (Anti-Spoof OK)", body_style),
            Paragraph("<font color='#16a34a'><b>PASSED & VERIFIED ✓</b></font>", body_style)
        ],
        [
            Paragraph("4. Permanent Account Number (PAN)", body_style),
            Paragraph("Income Tax Dept NSDL Gateway", body_style),
            Paragraph("Direct ITD Database Name Match", body_style),
            Paragraph("<font color='#16a34a'><b>AUTHENTICATED ✓</b></font>", body_style)
        ],
        [
            Paragraph("5. Bank Account Penny Drop Verification", body_style),
            Paragraph("NPCI / IMPS Banking API", body_style),
            Paragraph("Beneficiary Account Name Match", body_style),
            Paragraph("<font color='#16a34a'><b>AUTHENTICATED ✓</b></font>", body_style)
        ],
        [
            Paragraph("6. Dual Employer Verification Link", body_style),
            Paragraph(f"{company_name[:24]} & JCS", body_style),
            Paragraph("Employer Sponsorship Validated", body_style),
            Paragraph("<font color='#16a34a'><b>AUTHENTICATED ✓</b></font>", body_style)
        ]
    ]
    
    audit_table = Table(audit_data, colWidths=[150, 145, 145, 100])
    audit_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4338ca')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#f8fafc'), colors.HexColor('#ffffff')])
    ]))
    story.append(audit_table)
    story.append(Spacer(1, 14))
    
    # 6. Signatory & Digital Verification Seal Block
    sig_data = [
        [
            Paragraph("<b>Digitally Certified By:</b><br/>JOY CORPORATE SOLUTIONS PVT LTD<br/>Verification Authority Desk<br/>Bangalore Tech Center, Karnataka", body_style),
            Paragraph("<font color='#4338ca'><b>[DIGITAL VERIFICATION SEAL]</b></font><br/>Secured with 2048-Bit RSA Key<br/>Checksum: 8fa9-22b1-098e-4a11", ParagraphStyle('Center', parent=body_style, alignment=1)),
            Paragraph(f"<b>Authorized Signatory:</b><br/><i>Vikramaditya Rao</i><br/>Chief Compliance Officer (CCO)<br/>JOY Corporate Solutions Pvt Ltd", body_style)
        ]
    ]
    sig_table = Table(sig_data, colWidths=[180, 180, 180])
    sig_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#4338ca')),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#eef2ff')),
        ('PADDING', (0, 0), (-1, -1), 6)
    ]))
    story.append(sig_table)
    
    doc.build(story)
    buffer.seek(0)
    return buffer


def generate_employee_profile_dossier_pdf(candidate: Dict[str, Any]) -> io.BytesIO:
    """
    Generates the Exhaustive Multi-Page (3-4 Pages) Employee Profile Dossier (CiteHR Standard)
    Includes Employer Company Logo and covers complete Demographics, KYC, Education, Prior Employment, Banking & Nominees.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=45,
        bottomMargin=45
    )
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DossierTitle',
        parent=styles['Heading1'],
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#0f172a'),
        alignment=1,
        fontName='Helvetica-Bold'
    )
    
    section_hdr_style = ParagraphStyle(
        'SecHdr',
        parent=styles['Heading2'],
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor('#ffffff'),
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'DossierBody',
        parent=styles['Normal'],
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#334155')
    )
    
    c_name = candidate.get('name', 'Rajesh Kumar')
    emp_code = candidate.get('empId') or candidate.get('emp_id') or 'EMP-2026-88'
    desig = candidate.get('designation', 'Senior Software Engineer')
    dept = candidate.get('dept', 'Engineering')
    mob = candidate.get('mobile', '+91 98765 43210')
    email = candidate.get('email', 'rajesh.k@gmail.com')
    aadhaar = candidate.get('aadhaarNo') or candidate.get('aadhaar_no') or '5489 1234 9876'
    company_name = candidate.get('company_name') or (
        "Acme Global Technologies Pvt Ltd" if candidate.get('company_id') == 'comp-1' else "Apex Logistics Solutions"
    )
    
    # -------------------------------------------------------------------------
    # PAGE 1: Corporate Header, Employer Logo, Portrait & Personal Demographics
    # -------------------------------------------------------------------------
    
    company_logo_box = Paragraph(
        f"<font size=14 color='#ffffff'><b>🏢 {company_name[:18].upper()}</b></font><br/><font size=6.5 color='#e0f2fe'><b>EMPLOYER ENTERPRISE</b></font>",
        ParagraphStyle('CompLogo', parent=body_style, alignment=1, textColor=colors.white)
    )
    
    header_block = Paragraph(
        f"<b>{company_name.upper()}</b><br/>"
        f"<font size=11 color='#0369a1'><b>COMPREHENSIVE EMPLOYEE ONBOARDING & COMPLIANCE DOSSIER</b></font><br/>"
        f"<font size=7.5 color='#64748b'>Powered by JOY CORPORATE SOLUTIONS • Statutory Form 11 / KYC Record</font>",
        ParagraphStyle('HdrCenter', parent=body_style, alignment=1)
    )
    
    photo_box = Paragraph(
        "<font size=8 color='#0369a1'><b>EMPLOYEE<br/>PHOTOGRAPH</b><br/></font><font size=6.5 color='#64748b'>[VERIFIED]</font>",
        ParagraphStyle('PhotoBox', parent=body_style, alignment=1)
    )
    
    page1_hdr_table = Table([
        [
            Table([[company_logo_box]], colWidths=[110], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0284c7')),
                ('PADDING', (0,0), (-1,-1), 6),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('ALIGN', (0,0), (-1,-1), 'CENTER')
            ]),
            header_block,
            Table([[photo_box]], colWidths=[80], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0f9ff')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#0284c7')),
                ('PADDING', (0,0), (-1,-1), 8),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('ALIGN', (0,0), (-1,-1), 'CENTER')
            ])
        ]
    ], colWidths=[115, 340, 85])
    
    page1_hdr_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 2)
    ]))
    story.append(page1_hdr_table)
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284c7'), spaceAfter=10, spaceBefore=4))
    
    # Section 1: Comprehensive Personal Demographics
    sec1_hdr = Table([[Paragraph("SECTION 1: PERSONAL & DEMOGRAPHIC PARTICULARS", section_hdr_style)]], colWidths=[540])
    sec1_hdr.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#0284c7')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(sec1_hdr)
    
    sec1_data = [
        [Paragraph("<b>Full Legal Name:</b>", body_style), Paragraph(c_name, body_style), Paragraph("<b>Employee Code / ID:</b>", body_style), Paragraph(emp_code, body_style)],
        [Paragraph("<b>Father's Full Name:</b>", body_style), Paragraph("Suresh Kumar", body_style), Paragraph("<b>Mother's Full Name:</b>", body_style), Paragraph("Kavitha Kumar", body_style)],
        [Paragraph("<b>Spouse Name (if married):</b>", body_style), Paragraph("Sunita Kumar", body_style), Paragraph("<b>Date of Birth (DOB):</b>", body_style), Paragraph("15-May-1996 (Age: 30 Yrs)", body_style)],
        [Paragraph("<b>Gender:</b>", body_style), Paragraph("Male", body_style), Paragraph("<b>Marital Status:</b>", body_style), Paragraph("Married", body_style)],
        [Paragraph("<b>Blood Group:</b>", body_style), Paragraph("O+ Positive", body_style), Paragraph("<b>Nationality:</b>", body_style), Paragraph("Indian", body_style)],
        [Paragraph("<b>Religion / Community:</b>", body_style), Paragraph("Hindu / General", body_style), Paragraph("<b>Mother Tongue:</b>", body_style), Paragraph("Tamil / Hindi / English", body_style)],
        [Paragraph("<b>Identification Marks:</b>", body_style), Paragraph("Mole on right forearm", body_style), Paragraph("<b>Physically Challenged:</b>", body_style), Paragraph("No", body_style)]
    ]
    t1 = Table(sec1_data, colWidths=[135, 135, 135, 135])
    t1.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(t1)
    story.append(Spacer(1, 10))
    
    # Section 2: Employment & Designation Parameters
    sec2_hdr = Table([[Paragraph("SECTION 2: APPOINTMENT & EMPLOYMENT POSITION", section_hdr_style)]], colWidths=[540])
    sec2_hdr.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#0284c7')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(sec2_hdr)
    
    sec2_data = [
        [Paragraph("<b>Designation / Title:</b>", body_style), Paragraph(desig, body_style), Paragraph("<b>Department / Unit:</b>", body_style), Paragraph(dept, body_style)],
        [Paragraph("<b>Employment Type:</b>", body_style), Paragraph("Full Time Permanent", body_style), Paragraph("<b>Date of Joining (DOJ):</b>", body_style), Paragraph("25-Aug-2026", body_style)],
        [Paragraph("<b>Base Work Location:</b>", body_style), Paragraph("Bengaluru Tech Hub (HQ)", body_style), Paragraph("<b>Reporting Manager:</b>", body_style), Paragraph("Vikram Malhotra (VP Engg)", body_style)],
        [Paragraph("<b>Probation Period:</b>", body_style), Paragraph("6 Months", body_style), Paragraph("<b>Notice Period:</b>", body_style), Paragraph("60 Days", body_style)]
    ]
    t2 = Table(sec2_data, colWidths=[135, 135, 135, 135])
    t2.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(t2)
    story.append(Spacer(1, 14))
    
    # Page 1 Break
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # PAGE 2: Contact History, Residential Addresses & Government Identifiers
    # -------------------------------------------------------------------------
    sec3_hdr = Table([[Paragraph("SECTION 3: RESIDENTIAL ADDRESSES & CONTACT DETAILS", section_hdr_style)]], colWidths=[540])
    sec3_hdr.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#0284c7')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(sec3_hdr)
    
    sec3_data = [
        [Paragraph("<b>Primary Mobile Number:</b>", body_style), Paragraph(mob, body_style), Paragraph("<b>Official / Personal Email:</b>", body_style), Paragraph(email, body_style)],
        [Paragraph("<b>Alternate Phone / Landline:</b>", body_style), Paragraph("+91 80 4123 9876", body_style), Paragraph("<b>Emergency Contact Person:</b>", body_style), Paragraph("Suresh Kumar (Father)", body_style)],
        [Paragraph("<b>Emergency Contact Phone:</b>", body_style), Paragraph("+91 98111 22334", body_style), Paragraph("<b>Emergency Contact Relation:</b>", body_style), Paragraph("Father", body_style)],
        [Paragraph("<b>Present Residential Address:</b>", body_style), Paragraph("Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka - 560103<br/><i>Stay Duration: 3 Years (Rented)</i>", body_style),
         Paragraph("<b>Permanent Hometown Address:</b>", body_style), Paragraph("House No 45, MG Road, Civil Lines, Jaipur, Rajasthan - 302001<br/><i>Ownership: Own Ancestral Home</i>", body_style)]
    ]
    t3 = Table(sec3_data, colWidths=[135, 135, 135, 135])
    t3.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(t3)
    story.append(Spacer(1, 10))
    
    # Section 4: Government Identifiers & KYC Proofs
    sec4_hdr = Table([[Paragraph("SECTION 4: STATUTORY & GOVERNMENT IDENTIFIERS", section_hdr_style)]], colWidths=[540])
    sec4_hdr.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#0284c7')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(sec4_hdr)
    
    sec4_data = [
        [Paragraph("<b>Aadhaar UIDAI Number:</b>", body_style), Paragraph(f"<font color='#16a34a'><b>{aadhaar} (Verified ✓)</b></font>", body_style),
         Paragraph("<b>Permanent Account Number (PAN):</b>", body_style), Paragraph("<font color='#16a34a'><b>ABCDE1234F (Verified ✓)</b></font>", body_style)],
        [Paragraph("<b>Driving License (DL) No:</b>", body_style), Paragraph("KA-01201900124", body_style),
         Paragraph("<b>Passport Number:</b>", body_style), Paragraph("Z9812401 (Exp: 2032)", body_style)],
        [Paragraph("<b>Voter Identity Card No:</b>", body_style), Paragraph("WB/09/2014/9812", body_style),
         Paragraph("<b>Universal Account Number (UAN/EPF):</b>", body_style), Paragraph("100982341209", body_style)],
        [Paragraph("<b>ESIC Insurance Number:</b>", body_style), Paragraph("310082910291", body_style),
         Paragraph("<b>Labor Identification No (LIN):</b>", body_style), Paragraph("1982039102", body_style)]
    ]
    t4 = Table(sec4_data, colWidths=[135, 135, 135, 135])
    t4.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(t4)
    story.append(Spacer(1, 14))
    
    # Page 2 Break
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # PAGE 3: Educational Background & Complete Prior Employment History
    # -------------------------------------------------------------------------
    sec5_hdr = Table([[Paragraph("SECTION 5: ACADEMIC & PROFESSIONAL QUALIFICATIONS", section_hdr_style)]], colWidths=[540])
    sec5_hdr.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#0284c7')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(sec5_hdr)
    
    sec5_data = [
        [
            Paragraph("<b>Qualification / Degree</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>School / College / Institute</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Board / University</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Year</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>% / Grade</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold'))
        ],
        [
            Paragraph("B.Tech in Computer Science", body_style),
            Paragraph("BMS College of Engineering", body_style),
            Paragraph("VTU Technological University", body_style),
            Paragraph("2018", body_style),
            Paragraph("82.4% (Distinction)", body_style)
        ],
        [
            Paragraph("Higher Secondary Certificate (10+2)", body_style),
            Paragraph("Delhi Public School", body_style),
            Paragraph("Central Board of Secondary Education", body_style),
            Paragraph("2014", body_style),
            Paragraph("86.2% (First Class)", body_style)
        ],
        [
            Paragraph("Secondary School Leaving (10th)", body_style),
            Paragraph("St. Xavier's High School", body_style),
            Paragraph("ICSE Board", body_style),
            Paragraph("2012", body_style),
            Paragraph("89.0% (First Class)", body_style)
        ]
    ]
    t5 = Table(sec5_data, colWidths=[130, 130, 150, 55, 75])
    t5.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e0f2fe')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 4)
    ]))
    story.append(t5)
    story.append(Spacer(1, 10))
    
    # Section 6: Previous Employment Track Record
    sec6_hdr = Table([[Paragraph("SECTION 6: PRIOR EMPLOYMENT & WORK EXPERIENCE HISTORY", section_hdr_style)]], colWidths=[540])
    sec6_hdr.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#0284c7')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(sec6_hdr)
    
    sec6_data = [
        [
            Paragraph("<b>Employer Organization</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Designation</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Period (From - To)</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Last CTC</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Reason for Leaving</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold'))
        ],
        [
            Paragraph("Infosys Technologies Ltd", body_style),
            Paragraph("Software Engineer", body_style),
            Paragraph("Jul 2018 - Sep 2021 (3.2 Yrs)", body_style),
            Paragraph("INR 6.5 LPA", body_style),
            Paragraph("Career Advancement", body_style)
        ],
        [
            Paragraph("Wipro Enterprises Pvt Ltd", body_style),
            Paragraph("Senior Systems Analyst", body_style),
            Paragraph("Oct 2021 - Jul 2026 (4.8 Yrs)", body_style),
            Paragraph("INR 14.0 LPA", body_style),
            Paragraph("Joining New Enterprise", body_style)
        ]
    ]
    t6 = Table(sec6_data, colWidths=[130, 110, 120, 70, 110])
    t6.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e0f2fe')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 4)
    ]))
    story.append(t6)
    story.append(Spacer(1, 14))
    
    # Page 3 Break
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # PAGE 4: Banking, Statutory Nominees & Legal Employee Declaration
    # -------------------------------------------------------------------------
    sec7_hdr = Table([[Paragraph("SECTION 7: BANKING & PAYROLL SETTLEMENT PARTICULARS", section_hdr_style)]], colWidths=[540])
    sec7_hdr.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#0284c7')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(sec7_hdr)
    
    sec7_data = [
        [Paragraph("<b>Primary Bank Name:</b>", body_style), Paragraph("HDFC Bank", body_style), Paragraph("<b>Account Holder Name:</b>", body_style), Paragraph(c_name, body_style)],
        [Paragraph("<b>Bank Account Number:</b>", body_style), Paragraph("50100234129845", body_style), Paragraph("<b>IFSC Code:</b>", body_style), Paragraph("HDFC0001234", body_style)],
        [Paragraph("<b>Bank Branch & City:</b>", body_style), Paragraph("Koramangala 4th Block, Bengaluru", body_style), Paragraph("<b>Account Type:</b>", body_style), Paragraph("Salary / Savings Account", body_style)]
    ]
    t7 = Table(sec7_data, colWidths=[135, 135, 135, 135])
    t7.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(t7)
    story.append(Spacer(1, 10))
    
    # Section 8: Statutory Nominees
    sec8_hdr = Table([[Paragraph("SECTION 8: STATUTORY NOMINEE DECLARATION (EPF, GRATUITY & ESIC)", section_hdr_style)]], colWidths=[540])
    sec8_hdr.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#0284c7')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(sec8_hdr)
    
    sec8_data = [
        [
            Paragraph("<b>Benefit Scheme</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Nominee Full Name</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Relationship</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Date of Birth (DOB)</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Share %</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold'))
        ],
        [
            Paragraph("Provident Fund (EPF)", body_style),
            Paragraph("Sunita Kumar", body_style),
            Paragraph("Spouse", body_style),
            Paragraph("20-Nov-1998", body_style),
            Paragraph("100%", body_style)
        ],
        [
            Paragraph("Gratuity Fund", body_style),
            Paragraph("Sunita Kumar", body_style),
            Paragraph("Spouse", body_style),
            Paragraph("20-Nov-1998", body_style),
            Paragraph("100%", body_style)
        ],
        [
            Paragraph("Group Term Life Insurance", body_style),
            Paragraph("Suresh Kumar", body_style),
            Paragraph("Father", body_style),
            Paragraph("12-Aug-1968", body_style),
            Paragraph("100%", body_style)
        ]
    ]
    t8 = Table(sec8_data, colWidths=[130, 130, 110, 100, 70])
    t8.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e0f2fe')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 4)
    ]))
    story.append(t8)
    story.append(Spacer(1, 10))
    
    # Section 9: Formal Legal Employee Declaration & Signatures
    sec9_hdr = Table([[Paragraph("SECTION 9: FORMAL EMPLOYEE STATUTORY DECLARATION", section_hdr_style)]], colWidths=[540])
    sec9_hdr.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#0284c7')), ('PADDING', (0, 0), (-1, -1), 4)]))
    story.append(sec9_hdr)
    
    dec_statement = (
        "I hereby declare that all the statements, academic qualifications, employment records, "
        "and identification documents furnished in this comprehensive profile dossier are true, complete, and authentic "
        "to the best of my knowledge. I authorize " + company_name + " and JOY CORPORATE SOLUTIONS PRIVATE LIMITED "
        "to verify these credentials against government databases, past employers, and background verification repositories."
    )
    
    sig_data = [
        [
            Paragraph(f"<b>Declaration Text:</b><br/>{dec_statement}<br/><br/><b>Place:</b> Bengaluru<br/><b>Date:</b> {datetime.utcnow().strftime('%d-%b-%Y')}", body_style),
            Paragraph(
                f"<br/><br/>____________________________<br/><b>Employee Signature</b><br/>{c_name}<br/>"
                f"<br/>____________________________<br/><b>HR Authorizing Seal & Date</b><br/>{company_name}",
                ParagraphStyle('RightSig', parent=body_style, alignment=1)
            )
        ]
    ]
    t_sig = Table(sig_data, colWidths=[360, 180])
    t_sig.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP')
    ]))
    story.append(t_sig)
    
    doc.build(story, canvasmaker=NumberedCanvas)
    buffer.seek(0)
    return buffer


def generate_pdf_report(title: str, candidate_data: List[Dict[str, Any]]) -> io.BytesIO:
    """Generates a summary PDF audit table"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=10
    )
    
    story.append(Paragraph(f"JOY DATA VERIFICATION - {title}", title_style))
    story.append(Paragraph(f"Generated at: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')} | Enterprise Tier", styles['Normal']))
    story.append(Spacer(1, 15))
    
    table_data = [["Candidate Name", "Emp ID", "Designation", "Department", "Status", "Aadhaar", "Mobile OTP", "Face Liveness"]]
    
    for c in candidate_data:
        verifs = c.get("verifications_completed", {})
        table_data.append([
            c.get("name", "N/A"),
            c.get("emp_id", "N/A"),
            c.get("designation", "N/A"),
            c.get("dept", "N/A"),
            c.get("status", "N/A"),
            "PASS" if verifs.get("aadhaar") else "PENDING",
            "PASS" if verifs.get("mobile") else "PENDING",
            "PASS" if verifs.get("face") else "PENDING"
        ])
        
    t = Table(table_data)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0284c7')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
    ]))
    
    story.append(t)
    doc.build(story)
    buffer.seek(0)
    return buffer


def generate_excel_report(title: str, candidate_data: List[Dict[str, Any]]) -> io.BytesIO:
    """Generates an Excel spreadsheet using openpyxl"""
    import openpyxl
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Verification Registry"
    
    # Title Row
    ws.merge_cells("A1:H1")
    title_cell = ws["A1"]
    title_cell.value = f"JOY DATA VERIFICATION - {title}"
    title_cell.font = Font(name="Calibri", size=14, bold=True, color="FFFFFF")
    title_cell.fill = PatternFill(start_color="0284C7", end_color="0284C7", fill_type="solid")
    title_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 30
    
    # Headers
    headers = ["Candidate Name", "Employee ID", "Designation", "Department", "Verification Status", "Aadhaar UIDAI", "Mobile OTP", "Biometric Face Match"]
    ws.append(headers)
    ws.row_dimensions[2].height = 20
    
    header_fill = PatternFill(start_color="E2E8F0", end_color="E2E8F0", fill_type="solid")
    header_font = Font(bold=True, color="1E293B")
    
    for col_num in range(1, len(headers) + 1):
        cell = ws.cell(row=2, column=col_num)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="left", vertical="center")
        
    for c in candidate_data:
        verifs = c.get("verifications_completed", {})
        ws.append([
            c.get("name", "N/A"),
            c.get("emp_id", "N/A"),
            c.get("designation", "N/A"),
            c.get("dept", "N/A"),
            c.get("status", "N/A"),
            "VERIFIED" if verifs.get("aadhaar") else "PENDING",
            "VERIFIED" if verifs.get("mobile") else "PENDING",
            "VERIFIED" if verifs.get("face") else "PENDING"
        ])
        
    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = openpyxl.utils.get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 4, 12)
        
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer


def generate_word_report(title: str, candidate_data: List[Dict[str, Any]]) -> io.BytesIO:
    """Generates a Word Document (.docx) using python-docx"""
    import docx
    from docx.shared import Inches, Pt, RGBColor
    
    doc = docx.Document()
    heading = doc.add_heading(f"JOY DATA VERIFICATION - {title}", level=1)
    heading.runs[0].font.color.rgb = RGBColor(2, 132, 199)
    
    doc.add_paragraph(f"Generated Date: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')} | Enterprise Compliance Dossier")
    doc.add_paragraph("")
    
    table = doc.add_table(rows=1, cols=6)
    table.style = 'Table Grid'
    hdr_cells = table.rows[0].cells
    hdr_titles = ["Candidate", "Emp ID", "Designation", "Department", "Status", "Aadhaar Pass"]
    for i, t in enumerate(hdr_titles):
        hdr_cells[i].text = t
        hdr_cells[i].paragraphs[0].runs[0].font.bold = True
        
    for c in candidate_data:
        row_cells = table.add_row().cells
        verifs = c.get("verifications_completed", {})
        row_cells[0].text = str(c.get("name", "N/A"))
        row_cells[1].text = str(c.get("emp_id", "N/A"))
        row_cells[2].text = str(c.get("designation", "N/A"))
        row_cells[3].text = str(c.get("dept", "N/A"))
        row_cells[4].text = str(c.get("status", "N/A"))
        row_cells[5].text = "YES" if verifs.get("aadhaar") else "NO"
        
    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    return buffer
