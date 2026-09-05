import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.review import ClientReview
from backend.app.schemas.review import ClientReviewCreate, ClientReviewModeration

router = APIRouter(prefix="/reviews", tags=["Client Reviews"])

INITIAL_SEED_REVIEWS = [
    {
        "id": "REV-2026-001",
        "name": "Rameshwar Patil",
        "role": "VP – Human Resources & Compliance",
        "company": "Apex Industrial Infrastructure Pvt Ltd",
        "industry": "labor",
        "rating": 5,
        "title": "Onboarding 6,000+ factory workers every month with zero ghost workers!",
        "content": "JOY TrueProfile has completely transformed our contract labor management across 4 industrial plants. We verify Aadhaar, police records, and bank accounts right at the factory gate on mobile. Ghost worker billing by contractors dropped to absolute zero.",
        "is_approved": True,
        "is_featured": True,
        "status": "Approved"
    },
    {
        "id": "REV-2026-002",
        "name": "Ananya Deshmukh",
        "role": "Head of People & Culture",
        "company": "LogiFast Supply Chain & Logistics",
        "industry": "logistics",
        "rating": 5,
        "title": "Instant commercial driver verification in under 45 seconds",
        "content": "We manage over 2,500 fleet drivers. Checking driving licenses, criminal backgrounds, and Aadhaar on basic mobile phones with WhatsApp links has reduced our driver hiring TAT from 12 days to just 3 minutes.",
        "is_approved": True,
        "is_featured": True,
        "status": "Approved"
    },
    {
        "id": "REV-2026-003",
        "name": "Siddharth Menon",
        "role": "Chief Talent Officer",
        "company": "Nexis Cloud Technologies Ltd",
        "industry": "corporate",
        "rating": 5,
        "title": "Eliminated moonlighting and fraudulent experience certificates permanently",
        "content": "The authenticated EPFO career history audit is an absolute game-changer. We caught multiple candidates holding dual overlapping full-time jobs. The audit-ready 5-page PDF dossier gives our board 100% confidence.",
        "is_approved": True,
        "is_featured": True,
        "status": "Approved"
    },
    {
        "id": "REV-2026-004",
        "name": "Bhavani Shankar",
        "role": "Operations & Labor Contractor Director",
        "company": "Vanguard Staffing & Facility Services",
        "industry": "labor",
        "rating": 5,
        "title": "100% CLRA audit compliance and instant worker ID passes",
        "content": "As a major staffing agency providing 10,000+ security guards and facility workers, JOY TrueProfile gives us instant digital labor passes with QR verification and automatic CLRA compliance reports for labor officers.",
        "is_approved": True,
        "is_featured": True,
        "status": "Approved"
    }
]

def seed_default_reviews_if_empty(db: Session):
    count = db.query(ClientReview).count()
    if count == 0:
        for r in INITIAL_SEED_REVIEWS:
            rev = ClientReview(
                id=r["id"],
                name=r["name"],
                role=r["role"],
                company=r["company"],
                industry=r["industry"],
                rating=r["rating"],
                title=r["title"],
                content=r["content"],
                is_approved=r["is_approved"],
                is_featured=r["is_featured"],
                status=r["status"],
                created_at=datetime.utcnow()
            )
            db.add(rev)
        db.commit()

@router.get("/public")
def get_public_reviews(db: Session = Depends(get_db)):
    """Fetch all approved client reviews for public marketing landing page"""
    seed_default_reviews_if_empty(db)
    reviews = db.query(ClientReview).filter(ClientReview.is_approved == True).order_by(ClientReview.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "name": r.name,
            "role": r.role or "Verified Client",
            "company": r.company,
            "industry": r.industry,
            "rating": r.rating,
            "title": r.title or "Verified Review",
            "content": r.content,
            "is_featured": r.is_featured,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in reviews
    ]

@router.post("/submit")
def submit_review(payload: ClientReviewCreate, db: Session = Depends(get_db)):
    """Public endpoint for clients to submit a new review"""
    try:
        rev_id = f"REV-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        rev = ClientReview(
            id=rev_id,
            name=payload.name.strip(),
            role=payload.role.strip() if payload.role else "Enterprise Client",
            company=payload.company.strip(),
            industry=payload.industry or "labor",
            rating=max(1, min(5, payload.rating)),
            title=payload.title.strip() if payload.title else "Verified Client Feedback",
            content=payload.content.strip(),
            is_approved=True,
            is_featured=False,
            status="Approved",
            created_at=datetime.utcnow()
        )
        db.add(rev)
        db.commit()
        db.refresh(rev)
        return {
            "success": True,
            "message": "Review submitted successfully! Thank you for your feedback.",
            "review": {
                "id": rev.id,
                "name": rev.name,
                "company": rev.company,
                "rating": rev.rating
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit review: {str(e)}")

@router.get("/admin/all")
def get_admin_reviews(db: Session = Depends(get_db)):
    """Super Admin endpoint to view all reviews including pending/rejected"""
    seed_default_reviews_if_empty(db)
    reviews = db.query(ClientReview).order_by(ClientReview.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "name": r.name,
            "role": r.role,
            "company": r.company,
            "industry": r.industry,
            "rating": r.rating,
            "title": r.title,
            "content": r.content,
            "is_approved": r.is_approved,
            "is_featured": r.is_featured,
            "status": r.status,
            "moderation_notes": r.moderation_notes,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in reviews
    ]

@router.put("/admin/{review_id}/moderate")
def moderate_review(review_id: str, payload: ClientReviewModeration, db: Session = Depends(get_db)):
    """Super Admin endpoint to approve, reject, or feature a review"""
    rev = db.query(ClientReview).filter(ClientReview.id == review_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Review not found")

    if payload.is_approved is not None:
        rev.is_approved = payload.is_approved
        rev.status = "Approved" if payload.is_approved else "Rejected"
    if payload.is_featured is not None:
        rev.is_featured = payload.is_featured
    if payload.status is not None:
        rev.status = payload.status
        rev.is_approved = (payload.status == "Approved")
    if payload.moderation_notes is not None:
        rev.moderation_notes = payload.moderation_notes

    db.commit()
    db.refresh(rev)
    return {"success": True, "message": f"Review {review_id} updated", "status": rev.status, "is_approved": rev.is_approved}

@router.delete("/admin/{review_id}")
def delete_review(review_id: str, db: Session = Depends(get_db)):
    """Super Admin endpoint to delete a review"""
    rev = db.query(ClientReview).filter(ClientReview.id == review_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(rev)
    db.commit()
    return {"success": True, "message": f"Review {review_id} deleted successfully"}
