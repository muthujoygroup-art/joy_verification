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

        # Safety guard: Prevent memory exhaustion on oversized base64 payloads (>15MB)
        if len(b64_data) > 20 * 1024 * 1024:
            logger.warning("File upload rejected: Payload exceeds 15MB safety limit.")
            return ""

        file_bytes = base64.b64decode(b64_data)
        file_name = f"{filename_prefix}_{uuid.uuid4().hex[:8]}{ext}"
        file_path = os.path.join(target_folder, file_name)

        with open(file_path, "wb") as f:
            f.write(file_bytes)

        return os.path.relpath(file_path, BASE_DIR).replace("\\", "/")
    except Exception as e:
        logger.error(f"Failed to save file: {e}")
        return ""


def get_directory_size_and_count(dir_path: str) -> tuple:
    """Recursively computes total size in bytes and file count for a directory."""
    if not os.path.exists(dir_path):
        return 0, 0
    total_bytes = 0
    file_count = 0
    try:
        for root, _, files in os.walk(dir_path):
            for f in files:
                fp = os.path.join(root, f)
                try:
                    total_bytes += os.path.getsize(fp)
                    file_count += 1
                except (OSError, FileNotFoundError):
                    pass
    except Exception as e:
        logger.warning(f"Error reading directory {dir_path}: {e}")
    return total_bytes, file_count


def get_company_storage_usage(company_id: str, comp_code: str = None, features_dict: dict = None) -> dict:
    """Calculates disk and payload storage used by a specific company."""
    safe_id = "".join(c for c in str(company_id) if c.isalnum() or c in ("-", "_")).strip()
    safe_code = "".join(c for c in str(comp_code or "") if c.isalnum() or c in ("-", "_")).strip()

    candidate_bytes, candidate_files = 0, 0
    contract_bytes, contract_files = 0, 0
    invoice_bytes, invoice_files = 0, 0
    hr_bytes, hr_files = 0, 0
    root_bytes, root_files = 0, 0

    checked_folders = set()
    for candidate_dir in [safe_id, safe_code]:
        if not candidate_dir:
            continue
        comp_folder = os.path.join(UPLOADS_ROOT, "companies", candidate_dir)
        if comp_folder in checked_folders or not os.path.exists(comp_folder):
            continue
        checked_folders.add(comp_folder)

        # Candidates folder
        cb, cf = get_directory_size_and_count(os.path.join(comp_folder, "candidates"))
        candidate_bytes += cb
        candidate_files += cf

        # Contracts & statutory documents folder
        ctb, ctf = get_directory_size_and_count(os.path.join(comp_folder, "contracts"))
        contract_bytes += ctb
        contract_files += ctf

        # Invoices
        ib, if_ = get_directory_size_and_count(os.path.join(comp_folder, "invoices"))
        invoice_bytes += ib
        invoice_files += if_

        # HR users folder
        hb, hf = get_directory_size_and_count(os.path.join(comp_folder, "hr"))
        hr_bytes += hb
        hr_files += hf

        # Root files in company folder (e.g., logo)
        try:
            for item in os.listdir(comp_folder):
                fp = os.path.join(comp_folder, item)
                if os.path.isfile(fp):
                    root_bytes += os.path.getsize(fp)
                    root_files += 1
        except OSError:
            pass

    # Also compute size of inline base64 documents if present in features/documents
    inline_bytes = 0
    inline_count = 0
    if features_dict and isinstance(features_dict, dict):
        docs = features_dict.get("documents") or {}
        if isinstance(docs, dict):
            for k, val in docs.items():
                if isinstance(val, str) and (val.startswith("data:") or len(val) > 200):
                    inline_bytes += int(len(val) * 0.75)
                    inline_count += 1
        logo_val = features_dict.get("logo") or features_dict.get("logo_url")
        if isinstance(logo_val, str) and (logo_val.startswith("data:") or len(logo_val) > 200):
            inline_bytes += int(len(logo_val) * 0.75)
            inline_count += 1

    total_bytes = candidate_bytes + contract_bytes + invoice_bytes + hr_bytes + root_bytes + inline_bytes
    total_files = candidate_files + contract_files + invoice_files + hr_files + root_files + inline_count

    return {
        "used_bytes": total_bytes,
        "used_mb": round(total_bytes / (1024 * 1024), 2),
        "used_gb": round(total_bytes / (1024 * 1024 * 1024), 4),
        "file_count": total_files,
        "breakdown": {
            "candidates_mb": round(candidate_bytes / (1024 * 1024), 2),
            "contracts_mb": round(contract_bytes / (1024 * 1024), 2),
            "invoices_mb": round(invoice_bytes / (1024 * 1024), 2),
            "hr_mb": round(hr_bytes / (1024 * 1024), 2),
            "root_mb": round((root_bytes + inline_bytes) / (1024 * 1024), 2),
        }
    }


def get_overall_project_storage(db=None) -> dict:
    """
    Computes system-wide storage analytics:
    - Entire project usage (Uploads, Public assets, Database)
    - Server disk metrics (Total, Free, Used)
    - Company-wise allocations and current consumption
    """
    from sqlalchemy import text

    # 1. Server Host Disk Metrics
    try:
        disk_total, disk_used, disk_free = shutil.disk_usage(BASE_DIR)
        disk_usage_pct = round((disk_used / disk_total) * 100, 1) if disk_total > 0 else 0
    except Exception:
        disk_total, disk_used, disk_free, disk_usage_pct = 500 * (1024**3), 100 * (1024**3), 400 * (1024**3), 20.0

    # 2. Uploads Directory Size & File Count
    uploads_bytes, uploads_files = get_directory_size_and_count(UPLOADS_ROOT)

    # 3. Public Media & Brand Assets
    public_dir = os.path.join(BASE_DIR, "public")
    public_bytes, public_files = get_directory_size_and_count(public_dir)

    # 4. Database Storage Calculation
    db_bytes = 0
    db_dialect = "unknown"
    if db:
        try:
            bind = db.get_bind()
            db_dialect = bind.dialect.name
            with bind.connect() as conn:
                if db_dialect == "postgresql":
                    db_bytes = conn.execute(text("SELECT pg_database_size(current_database());")).scalar() or 0
                elif db_dialect == "sqlite":
                    page_count = conn.execute(text("PRAGMA page_count;")).scalar() or 0
                    page_size = conn.execute(text("PRAGMA page_size;")).scalar() or 4096
                    db_bytes = page_count * page_size
        except Exception as e:
            logger.warning(f"Could not calculate database size: {e}")
            db_bytes = 10 * 1024 * 1024 # ~10MB fallback

    # 5. Candidate KYC & Dossiers on disk
    candidates_dir = os.path.join(UPLOADS_ROOT, "candidates")
    cand_bytes, cand_files = get_directory_size_and_count(candidates_dir)

    # 6. Exports & Certificates on disk
    exports_dir = os.path.join(UPLOADS_ROOT, "exports")
    export_bytes, export_files = get_directory_size_and_count(exports_dir)

    # 7. Total Project Used Bytes
    project_used_bytes = uploads_bytes + public_bytes + db_bytes
    project_used_mb = round(project_used_bytes / (1024 * 1024), 2)
    project_used_gb = round(project_used_bytes / (1024 * 1024 * 1024), 3)

    # 8. Per-Company Allocations & Consumption Breakdown
    companies_breakdown = []
    total_allocated_gb = 0.0
    total_companies_used_bytes = 0

    if db:
        try:
            from backend.app.models.company import Company
            companies = db.query(Company).order_by(Company.created_at.desc()).all()
            for c in companies:
                c_storage = get_company_storage_usage(c.id, c.code, c.features)
                allocated_gb = float(c.storage_limit_gb or 25.0)
                total_allocated_gb += allocated_gb
                c_used_bytes = c_storage["used_bytes"]
                total_companies_used_bytes += c_used_bytes

                allocated_bytes = allocated_gb * (1024 ** 3)
                used_pct = round((c_used_bytes / allocated_bytes) * 100, 2) if allocated_bytes > 0 else 0.0

                if used_pct >= 90.0:
                    status = "Critical"
                elif used_pct >= 70.0:
                    status = "Near Limit"
                else:
                    status = "Normal"

                companies_breakdown.append({
                    "id": c.id,
                    "name": c.name or "Unnamed Company",
                    "code": c.code or "",
                    "plan": c.plan or "Standard Tier",
                    "status_governance": c.status or "Active",
                    "allocated_gb": allocated_gb,
                    "used_bytes": c_used_bytes,
                    "used_mb": c_storage["used_mb"],
                    "used_gb": c_storage["used_gb"],
                    "used_percentage": used_pct,
                    "file_count": c_storage["file_count"],
                    "status": status,
                    "breakdown": c_storage["breakdown"]
                })
        except Exception as e:
            logger.error(f"Error querying company storage breakdown: {e}")

    # Fallback allocated quota if no companies in DB
    if total_allocated_gb == 0:
        total_allocated_gb = 100.0

    return {
        "project_storage": {
            "used_bytes": project_used_bytes,
            "used_mb": project_used_mb,
            "used_gb": project_used_gb,
            "total_files": uploads_files + public_files,
            "total_allocated_gb": round(total_allocated_gb, 1),
            "allocated_utilization_pct": round((project_used_gb / total_allocated_gb) * 100, 2) if total_allocated_gb > 0 else 0.0
        },
        "server_disk": {
            "total_gb": round(disk_total / (1024**3), 2),
            "used_gb": round(disk_used / (1024**3), 2),
            "free_gb": round(disk_free / (1024**3), 2),
            "usage_percentage": disk_usage_pct
        },
        "categories": {
            "candidate_kyc": {
                "label": "Candidate KYC & Biometrics",
                "bytes": cand_bytes,
                "mb": round(cand_bytes / (1024 * 1024), 2),
                "files": cand_files
            },
            "company_contracts": {
                "label": "Company Contracts & Statutory Proofs",
                "bytes": uploads_bytes - cand_bytes - export_bytes if uploads_bytes >= (cand_bytes + export_bytes) else 0,
                "mb": round(max(0, (uploads_bytes - cand_bytes - export_bytes)) / (1024 * 1024), 2),
                "files": max(0, uploads_files - cand_files - export_files)
            },
            "exported_reports": {
                "label": "Verification Certificates & Dossiers",
                "bytes": export_bytes,
                "mb": round(export_bytes / (1024 * 1024), 2),
                "files": export_files
            },
            "database_records": {
                "label": f"System Database ({db_dialect.upper()})",
                "bytes": db_bytes,
                "mb": round(db_bytes / (1024 * 1024), 2),
                "files": 1
            },
            "public_media": {
                "label": "Brand Assets & Visual Media",
                "bytes": public_bytes,
                "mb": round(public_bytes / (1024 * 1024), 2),
                "files": public_files
            }
        },
        "companies": companies_breakdown
    }
