from backend.app.routers.auth import router as auth_router
from backend.app.routers.superadmin import router as superadmin_router
from backend.app.routers.company import router as company_router
from backend.app.routers.hr import router as hr_router
from backend.app.routers.verification import router as verification_router
from backend.app.routers.master_data import router as master_data_router
from backend.app.routers.tickets import router as tickets_router
from backend.app.routers.billing import router as billing_router
from backend.app.routers.documents import router as documents_router
from backend.app.routers.settings import router as settings_router

__all__ = [
    "auth_router",
    "superadmin_router",
    "company_router",
    "hr_router",
    "verification_router",
    "master_data_router",
    "tickets_router",
    "billing_router",
    "documents_router",
    "settings_router"
]
