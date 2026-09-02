import os
import shutil
import base64
import uuid
import logging

logger = logging.getLogger("joy_backend")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOADS_ROOT = os.path.join(BASE_DIR, "uploads")

def ensure_base_directories():
    """Ensure root upload directories exist"""
    os.makedirs(os.path.join(UPLOADS_ROOT, "companies"), exist_ok=True)
    os.makedirs(os.path.join(UPLOADS_ROOT, "candidates"), exist_ok=True)
    os.makedirs(os.path.join(UPLOADS_ROOT, "exports"), exist_ok=True)

ensure_base_directories()

def get_company_folder(company_id: str) -> str:
    """Creates and returns the dedicated physical storage directory for a company"""
    safe_id = "".join(c for c in str(company_id) if c.isalnum() or c in ("-", "_")).strip() or "general"
    folder = os.path.join(UPLOADS_ROOT, "companies", safe_id)
    os.makedirs(folder, exist_ok=True)
    os.makedirs(os.path.join(folder, "hr"), exist_ok=True)
    os.makedirs(os.path.join(folder, "candidates"), exist_ok=True)
    os.makedirs(os.path.join(folder, "invoices"), exist_ok=True)
    os.makedirs(os.path.join(folder, "contracts"), exist_ok=True)
    return folder

def get_hr_folder(company_id: str, hr_id: str) -> str:
    """Creates and returns the dedicated storage folder for an HR user"""
    comp_folder = get_company_folder(company_id)
    safe_hr_id = "".join(c for c in str(hr_id) if c.isalnum() or c in ("-", "_")).strip() or "general_hr"
    folder = os.path.join(comp_folder, "hr", safe_hr_id)
    os.makedirs(folder, exist_ok=True)
    return folder

def get_candidate_folder(company_id: str, candidate_id: str) -> str:
    """Creates and returns the dedicated storage folder for a candidate / employee"""
    comp_folder = get_company_folder(company_id or "default")
    safe_cand_id = "".join(c for c in str(candidate_id) if c.isalnum() or c in ("-", "_")).strip() or "general_cand"
    folder = os.path.join(comp_folder, "candidates", safe_cand_id)
    os.makedirs(folder, exist_ok=True)
    os.makedirs(os.path.join(folder, "kyc_docs"), exist_ok=True)
    os.makedirs(os.path.join(folder, "face_biometrics"), exist_ok=True)
    os.makedirs(os.path.join(folder, "certificates"), exist_ok=True)
    return folder

def save_base64_file(data_uri_or_base64: str, target_folder: str, filename_prefix: str = "doc") -> str:
    """Saves a base64 string or dataURI directly into the profile directory."""
    if not data_uri_or_base64:
        return ""
    try:
        if "," in data_uri_or_base64:
            header, b64_data = data_uri_or_base64.split(",", 1)
            ext = ".jpg"
            if "png" in header:
                ext = ".png"
            elif "pdf" in header:
                ext = ".pdf"
            elif "webp" in header:
                ext = ".webp"
        else:
            b64_data = data_uri_or_base64
            ext = ".jpg"

        file_bytes = base64.b64decode(b64_data)
        file_name = f"{filename_prefix}_{uuid.uuid4().hex[:8]}{ext}"
        file_path = os.path.join(target_folder, file_name)

        with open(file_path, "wb") as f:
            f.write(file_bytes)

        return os.path.relpath(file_path, BASE_DIR).replace("\\", "/")
    except Exception as e:
        logger.error(f"Failed to save file: {e}")
        return ""
