NEEV_81_ENDPOINTS = [
    {
        "id": 1,
        "name": "Aadhaar Detail Verification V2",
        "category": "Identity Verification",
        "path": "/aadhaar-detail-verification-v2",
        "sample": {
            "aadhaar_number": "555555555555",
            "otp": "482913"
        },
        "desc": "Verifies Aadhaar using UIDAI OTP validation."
    },
    {
        "id": 2,
        "name": "Aadhaar Link Check",
        "category": "Identity Verification",
        "path": "/aadhaar-link-check",
        "sample": {
            "id_type": "MOBILE",
            "mobile": "9942817491",
            "aadhaar_number": "555555555555"
        },
        "desc": "Checks if Mobile or Email is linked to Aadhaar."
    },
    {
        "id": 3,
        "name": "Aadhaar To PAN",
        "category": "Identity Verification",
        "path": "/aadhaar-to-pan",
        "sample": {
            "aadhaar_number": "555555555555"
        },
        "desc": "Retrieves PAN linked to Aadhaar."
    },
    {
        "id": 4,
        "name": "Aadhaar to PAN (masked) V2",
        "category": "Identity Verification",
        "path": "/aadhaar-to-pan-masked-v2",
        "sample": {
            "aadhaar_number": "555555555555"
        },
        "desc": "Retrieves masked PAN linked to Aadhaar."
    },
    {
        "id": 5,
        "name": "Aadhaar To PAN (Unmasked) V2",
        "category": "Identity Verification",
        "path": "/aadhaar-to-pan-unmasked-v2",
        "sample": {
            "aadhaar_number": "555555555555"
        },
        "desc": "Retrieves unmasked PAN linked to Aadhaar."
    },
    {
        "id": 6,
        "name": "Aadhaar To PAN CKYC",
        "category": "Identity Verification",
        "path": "/aadhaar-to-pan-ckyc",
        "sample": {
            "aadhaar_number": "555555555555"
        },
        "desc": "Cross-verifies CKYC registry for Aadhaar and PAN linkage."
    },
    {
        "id": 7,
        "name": "Aadhaar To PAN(Unmasked)",
        "category": "Identity Verification",
        "path": "/aadhaar-to-pan-unmasked",
        "sample": {
            "aadhaar_number": "555555555555"
        },
        "desc": "Aadhaar to PAN direct unmasked mapping."
    },
    {
        "id": 8,
        "name": "Aadhaar Validation V2",
        "category": "Identity Verification",
        "path": "/aadhaar-validation-v2",
        "sample": {
            "aadhaarNumber": "555555555555"
        },
        "desc": "Validates Aadhaar format and state registry presence."
    },
    {
        "id": 9,
        "name": "Aadhaar Verify",
        "category": "Identity Verification",
        "path": "/aadhaar-verify",
        "sample": {
            "aadhaar_number": "555555555555"
        },
        "desc": "Direct demographic validation of Aadhaar."
    },
    {
        "id": 10,
        "name": "Driving License Details",
        "category": "Identity Verification",
        "path": "/driving-license-details",
        "sample": {
            "driving_license_number": "KA0120200004910",
            "date_of_birth": "15-05-1996"
        },
        "desc": "Fetches complete MoRTH Sarathi DL record, vehicle categories, and validity."
    },
    {
        "id": 11,
        "name": "Generate Aadhaar OTP V2",
        "category": "Identity Verification",
        "path": "/generate-aadhaar-otp-v2",
        "sample": {
            "aadhaar_number": "555555555555"
        },
        "desc": "Dispatches UIDAI Aadhaar verification OTP."
    },
    {
        "id": 12,
        "name": "Identity Verification with Digilocker",
        "category": "Identity Verification",
        "path": "/identity-verification-with-digilocker",
        "sample": {},
        "desc": "Initiates DigiLocker document verification workflow."
    },
    {
        "id": 13,
        "name": "Mobile Number To Challan Details",
        "category": "Identity Verification",
        "path": "/mobile-number-to-challan-details",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Searches traffic challans linked to phone number."
    },
    {
        "id": 14,
        "name": "Mobile To PAN V2",
        "category": "Identity Verification",
        "path": "/mobile-number-to-pan-v2",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Retrieves PAN numbers associated with mobile number."
    },
    {
        "id": 15,
        "name": "Mobile To Profile Advance",
        "category": "Identity Verification",
        "path": "/mobile-to-profile-advance",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Comprehensive 360-degree telecom identity lookup."
    },
    {
        "id": 16,
        "name": "Mobile360",
        "category": "Identity Verification",
        "path": "/mobile360",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Aggregated carrier telecom identity profile."
    },
    {
        "id": 17,
        "name": "PAN Details V1",
        "category": "Identity Verification",
        "path": "/pan-details-v1",
        "sample": {
            "pan": "ABCDE1234F",
            "consent": "Y"
        },
        "desc": "Authoritative NSDL Income Tax PAN verification."
    },
    {
        "id": 18,
        "name": "Passport Verification",
        "category": "Identity Verification",
        "path": "/passport-verification",
        "sample": {
            "fileNumber": "V9481920",
            "dob": "1996-05-15",
            "name": "MUTHUKUMAR P"
        },
        "desc": "Verifies Indian Passport with MEA Passport Seva."
    },
    {
        "id": 19,
        "name": "Voter ID Details",
        "category": "Identity Verification",
        "path": "/voter-id-details",
        "sample": {
            "fileNumber": "ABC1234567",
            "dob": "1996-05-15"
        },
        "desc": "Election Commission of India EPIC voter verification."
    },
    {
        "id": 20,
        "name": "CRIF High Mark Credit",
        "category": "Financial & Credit",
        "path": "/crif",
        "sample": {
            "pan": "ABCDE1234F",
            "name": "MUTHUKUMAR P",
            "mobile": "9942817491"
        },
        "desc": "Commercial and retail credit bureau check."
    },
    {
        "id": 21,
        "name": "Mobile To Account V2",
        "category": "Financial & Credit",
        "path": "/mobile-to-account-v2",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Identifies active bank accounts linked to mobile."
    },
    {
        "id": 22,
        "name": "Mobile to Account V3",
        "category": "Financial & Credit",
        "path": "/mobile-to-account-v3",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Advanced bank account discovery by mobile."
    },
    {
        "id": 23,
        "name": "Mobile To Primary UPI ID",
        "category": "Financial & Credit",
        "path": "/mobile-to-primary-upi-id",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Finds default VPA / UPI handle for mobile."
    },
    {
        "id": 24,
        "name": "Mobile To UAN V2",
        "category": "Financial & Credit",
        "path": "/mobile-to-uan-v2",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Finds EPFO UAN number linked to mobile."
    },
    {
        "id": 25,
        "name": "Mobile To Verified UPI IDs",
        "category": "Financial & Credit",
        "path": "/mobile-to-verified-upi-ids",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Lists verified UPI handles for phone."
    },
    {
        "id": 26,
        "name": "PAN Basic",
        "category": "Financial & Credit",
        "path": "/pan-basic",
        "sample": {
            "pan_number": "ABCDE1234F"
        },
        "desc": "Validates PAN format and status."
    },
    {
        "id": 27,
        "name": "PAN Experian Credit",
        "category": "Financial & Credit",
        "path": "/pan-experian",
        "sample": {
            "pan": "ABCDE1234F",
            "name": "MUTHUKUMAR P",
            "mobile": "9942817491"
        },
        "desc": "Experian credit score and default check."
    },
    {
        "id": 28,
        "name": "PAN Info",
        "category": "Financial & Credit",
        "path": "/pan-info",
        "sample": {
            "pan_number": "ABCDE1234F"
        },
        "desc": "PAN holder and category information."
    },
    {
        "id": 29,
        "name": "PAN Info V2",
        "category": "Financial & Credit",
        "path": "/pan-info-v2",
        "sample": {
            "pan_number": "ABCDE1234F"
        },
        "desc": "Comprehensive PAN details with Aadhaar seeding flag."
    },
    {
        "id": 30,
        "name": "PAN To Insurance",
        "category": "Financial & Credit",
        "path": "/pan-to-insurance",
        "sample": {
            "pan_number": "ABCDE1234F"
        },
        "desc": "Checks IRDAI insurance policies linked to PAN."
    },
    {
        "id": 31,
        "name": "PAN to ITR",
        "category": "Financial & Credit",
        "path": "/pan-to-itr",
        "sample": {
            "pan_number": "ABCDE1234F"
        },
        "desc": "Income Tax Return filing status by PAN."
    },
    {
        "id": 32,
        "name": "UPI ID Payment Analyser",
        "category": "Financial & Credit",
        "path": "/upi-id-payment-analyser",
        "sample": {
            "upi_id": "muthukumar@okaxis"
        },
        "desc": "Analyzes UPI transaction health and reliability."
    },
    {
        "id": 33,
        "name": "UPI To Account",
        "category": "Financial & Credit",
        "path": "/upi-to-account",
        "sample": {
            "upi_id": "muthukumar@okaxis"
        },
        "desc": "Maps UPI ID to bank account details."
    },
    {
        "id": 34,
        "name": "Verify UPI ID",
        "category": "Financial & Credit",
        "path": "/verify-upi-id",
        "sample": {
            "upi_id": "muthukumar@okaxis"
        },
        "desc": "Validates UPI VPA handle existence."
    },
    {
        "id": 35,
        "name": "Account Validation (Penny Drop)",
        "category": "Banking & UPI",
        "path": "/account-validation",
        "sample": {
            "account_number": "501002349845",
            "ifsc_code": "HDFC0000128"
        },
        "desc": "NPCI IMPS \u20b91.00 Penny Drop bank account verification."
    },
    {
        "id": 36,
        "name": "IFSC Lookup",
        "category": "Banking & UPI",
        "path": "/ifsc-lookup",
        "sample": {
            "ifsc_code": "HDFC0000128"
        },
        "desc": "RBI IFSC branch name, address, and RTGS/NEFT support lookup."
    },
    {
        "id": 37,
        "name": "UPI Verification",
        "category": "Banking & UPI",
        "path": "/upi-verification",
        "sample": {
            "vpa": "joycorp@upi"
        },
        "desc": "Direct NPCI VPA verification."
    },
    {
        "id": 38,
        "name": "CIN To Company Details",
        "category": "Business & Compliance",
        "path": "/cin-to-company-details",
        "sample": {
            "cin": "U72900KA2020PTC131920"
        },
        "desc": "MCA master company profile by CIN."
    },
    {
        "id": 39,
        "name": "CIN to Directors Lookup",
        "category": "Business & Compliance",
        "path": "/cin-to-directors-lookup",
        "sample": {
            "cin": "U72900KA2020PTC131920"
        },
        "desc": "Board of directors list by CIN."
    },
    {
        "id": 40,
        "name": "CIN To GST",
        "category": "Business & Compliance",
        "path": "/cin-to-gst",
        "sample": {
            "cin": "U72900KA2020PTC131920"
        },
        "desc": "Finds all GSTIN registrations of a company."
    },
    {
        "id": 41,
        "name": "CIN To GST V2",
        "category": "Business & Compliance",
        "path": "/cin-to-gst-v2",
        "sample": {
            "cin": "U72900KA2020PTC131920"
        },
        "desc": "State-wise GST registrations by CIN."
    },
    {
        "id": 42,
        "name": "CIN To MCA",
        "category": "Business & Compliance",
        "path": "/cin-to-mca",
        "sample": {
            "cin": "U72900KA2020PTC131920"
        },
        "desc": "Ministry of Corporate Affairs registry snapshot."
    },
    {
        "id": 43,
        "name": "Company Name To CIN",
        "category": "Business & Compliance",
        "path": "/company-name-to-cin",
        "sample": {
            "company_name": "JOY CORPORATE SOLUTIONS"
        },
        "desc": "Searches MCA CIN numbers by legal name."
    },
    {
        "id": 44,
        "name": "Company Name To GST Report",
        "category": "Business & Compliance",
        "path": "/company-name-to-gst-report",
        "sample": {
            "company_name": "JOY CORPORATE SOLUTIONS"
        },
        "desc": "GST compliance report by company name."
    },
    {
        "id": 45,
        "name": "DIN To Director Details",
        "category": "Business & Compliance",
        "path": "/din-to-director-details",
        "sample": {
            "din": "08192830"
        },
        "desc": "MCA Director details and other directorships by DIN."
    },
    {
        "id": 46,
        "name": "DIN to MCA",
        "category": "Business & Compliance",
        "path": "/din-to-mca",
        "sample": {
            "din": "08192830"
        },
        "desc": "Director filings with MCA."
    },
    {
        "id": 47,
        "name": "FSSAI Verification",
        "category": "Business & Compliance",
        "path": "/fssai-verification",
        "sample": {
            "fssai_number": "10019043002910"
        },
        "desc": "Food Safety and Standards Authority license check."
    },
    {
        "id": 48,
        "name": "GST Advance Report",
        "category": "Business & Compliance",
        "path": "/gst-advance-report",
        "sample": {
            "gstin": "29AABCJ1234D1Z5"
        },
        "desc": "Detailed GST filing history and compliance rating."
    },
    {
        "id": 49,
        "name": "GST Details (Basic) V2",
        "category": "Business & Compliance",
        "path": "/gst-details-basic-v2",
        "sample": {
            "gstin": "29AABCJ1234D1Z5"
        },
        "desc": "Basic GST status, legal name, trade name, and principal place."
    },
    {
        "id": 50,
        "name": "GST Report",
        "category": "Business & Compliance",
        "path": "/gst-report",
        "sample": {
            "gstin": "29AABCJ1234D1Z5"
        },
        "desc": "Full GST returns summary."
    },
    {
        "id": 51,
        "name": "LLPIN To Company Details",
        "category": "Business & Compliance",
        "path": "/llpin-to-company-details",
        "sample": {
            "llpin": "AAA-1234"
        },
        "desc": "Limited Liability Partnership profile by LLPIN."
    },
    {
        "id": 52,
        "name": "MCA Company Search",
        "category": "Business & Compliance",
        "path": "/mca-company-search",
        "sample": {
            "company_name": "JOY CORPORATE"
        },
        "desc": "Fuzzy MCA company search."
    },
    {
        "id": 53,
        "name": "PAN To GST Numbers",
        "category": "Business & Compliance",
        "path": "/pan-to-gst-numbers",
        "sample": {
            "pan": "ABCDE1234F"
        },
        "desc": "Finds all GSTINs registered under a PAN."
    },
    {
        "id": 54,
        "name": "PAN to GST Numbers V2",
        "category": "Business & Compliance",
        "path": "/pan-to-gst-numbers-v2",
        "sample": {
            "pan": "ABCDE1234F"
        },
        "desc": "Multi-state GST discovery for PAN."
    },
    {
        "id": 55,
        "name": "Udyam Advance",
        "category": "Business & Compliance",
        "path": "/udyam-advance",
        "sample": {
            "udyam_number": "UDYAM-KR-03-0012345"
        },
        "desc": "MSME Udyam registration complete verification."
    },
    {
        "id": 56,
        "name": "Udyam List",
        "category": "Business & Compliance",
        "path": "/udyam-list",
        "sample": {
            "mobile": "9942817491"
        },
        "desc": "Finds MSME certificates linked to mobile/PAN."
    },
    {
        "id": 57,
        "name": "Udyam Report",
        "category": "Business & Compliance",
        "path": "/udyam-report",
        "sample": {
            "udyam_number": "UDYAM-KR-03-0012345"
        },
        "desc": "Udyam enterprise details and classification."
    },
    {
        "id": 58,
        "name": "Challan Number To Challan Details",
        "category": "Vehicle & RC",
        "path": "/challan-number-to-challan-details",
        "sample": {
            "challan_number": "KA012023004819"
        },
        "desc": "Traffic violation challan detail search."
    },
    {
        "id": 59,
        "name": "Challan status",
        "category": "Vehicle & RC",
        "path": "/challan-status",
        "sample": {
            "rc_number": "KA01AB1234"
        },
        "desc": "Pending traffic challans on vehicle RC."
    },
    {
        "id": 60,
        "name": "Fastag Details",
        "category": "Vehicle & RC",
        "path": "/fastag-details",
        "sample": {
            "vehicle_number": "KA01AB1234"
        },
        "desc": "NETC FASTag issuer bank and status."
    },
    {
        "id": 61,
        "name": "Mobile Number to Vehicle RC",
        "category": "Vehicle & RC",
        "path": "/mobile-number-to-vehicle-rc",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Finds vehicle registration numbers registered on mobile."
    },
    {
        "id": 62,
        "name": "Mobile To Dl",
        "category": "Vehicle & RC",
        "path": "/mobile-to-dl",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Driving licenses linked to phone number."
    },
    {
        "id": 63,
        "name": "RC advance",
        "category": "Vehicle & RC",
        "path": "/rc-advance",
        "sample": {
            "rc_number": "KA01AB1234"
        },
        "desc": "Full Vahan RC report with hypothecation, insurance, and fitness."
    },
    {
        "id": 64,
        "name": "RC Details",
        "category": "Vehicle & RC",
        "path": "/rc-details",
        "sample": {
            "rc_number": "KA01AB1234"
        },
        "desc": "Basic vehicle RC details from MoRTH."
    },
    {
        "id": 65,
        "name": "RC Details Advance",
        "category": "Vehicle & RC",
        "path": "/rc-details-advance",
        "sample": {
            "rc_number": "KA01AB1234"
        },
        "desc": "Extended RC attributes and owner details."
    },
    {
        "id": 66,
        "name": "RC To Mobile Number",
        "category": "Vehicle & RC",
        "path": "/rc-to-mobile-number",
        "sample": {
            "rc_number": "KA01AB1234"
        },
        "desc": "Finds registered mobile number for RC."
    },
    {
        "id": 67,
        "name": "RC to Number",
        "category": "Vehicle & RC",
        "path": "/rc-to-number",
        "sample": {
            "rc_number": "KA01AB1234"
        },
        "desc": "Vehicle registration number formatting validation."
    },
    {
        "id": 68,
        "name": "Vehicle Number To Challan Details",
        "category": "Vehicle & RC",
        "path": "/vehicle-number-to-challan-details",
        "sample": {
            "vehicle_number": "KA01AB1234"
        },
        "desc": "Searches challans by vehicle plate number."
    },
    {
        "id": 69,
        "name": "DIN To PAN",
        "category": "Employment & UAN",
        "path": "/din-to-pan",
        "sample": {
            "din": "08192830"
        },
        "desc": "Finds PAN of a company Director."
    },
    {
        "id": 70,
        "name": "Employment History V2",
        "category": "Employment & UAN",
        "path": "/employment-history-v2",
        "sample": {
            "uan": "101239019283"
        },
        "desc": "EPFO past employment records and tenures."
    },
    {
        "id": 71,
        "name": "ESIC Data",
        "category": "Employment & UAN",
        "path": "/esic-data",
        "sample": {
            "id_type": "MOBILE",
            "mobile": "9942817491"
        },
        "desc": "Employee State Insurance Corporation (ESIC) member records by Mobile or UAN."
    },
    {
        "id": 72,
        "name": "Mobile To PAN",
        "category": "Employment & UAN",
        "path": "/mobile-to-pan",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Finds PAN linked to mobile number."
    },
    {
        "id": 73,
        "name": "Mobile To UAN",
        "category": "Employment & UAN",
        "path": "/mobile-to-uan",
        "sample": {
            "mobile_number": "9942817491"
        },
        "desc": "Finds EPFO UAN by mobile number."
    },
    {
        "id": 74,
        "name": "PAN To DIN",
        "category": "Employment & UAN",
        "path": "/pan-to-din",
        "sample": {
            "pan": "ABCDE1234F"
        },
        "desc": "Finds Director Identification Numbers (DIN) of a PAN."
    },
    {
        "id": 75,
        "name": "UAN Advance",
        "category": "Employment & UAN",
        "path": "/uan-advance",
        "sample": {
            "uan": "101239019283"
        },
        "desc": "Detailed UAN profile with passbook contributions."
    },
    {
        "id": 76,
        "name": "UAN to Employment History V2",
        "category": "Employment & UAN",
        "path": "/uan-to-employment-history-v2",
        "sample": {
            "uan": "101239019283"
        },
        "desc": "UAN employment timeline and exit reasons."
    },
    {
        "id": 77,
        "name": "UAN to Employment History V3",
        "category": "Employment & UAN",
        "path": "/uan-to-employment-history-v3",
        "sample": {
            "uan": "101239019283"
        },
        "desc": "Latest V3 employment history and dual employment audit."
    },
    {
        "id": 78,
        "name": "UAN To Employment Profile",
        "category": "Employment & UAN",
        "path": "/uan-to-employment-profile",
        "sample": {
            "uan": "101239019283"
        },
        "desc": "Full EPFO member profile, KYC statuses, and active establishments."
    },
    {
        "id": 79,
        "name": "UAN To Employment Records",
        "category": "Employment & UAN",
        "path": "/uan-to-employment-records",
        "sample": {
            "uan": "101239019283"
        },
        "desc": "EPFO service records and employer PF contribution status."
    },
    {
        "id": 80,
        "name": "Realtime Court Case Search",
        "category": "Court & Criminal",
        "path": "/realtime-court-case-search",
        "sample": {
            "name": "MUTHUKUMAR P",
            "father_name": "Suresh Kumar P",
            "address": "Bengaluru, Karnataka",
            "dob": "1996-05-15"
        },
        "desc": "Realtime search across All India High Courts, District Courts, Tribunals, and e-Courts."
    },
    {
        "id": 81,
        "name": "Domain Search",
        "category": "Other",
        "path": "/domain-search",
        "sample": {
            "domain_name": "joycorporatesolutions.com"
        },
        "desc": "Corporate domain WHOIS and MX verification."
    }
]
