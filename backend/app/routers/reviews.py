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
        "name": "Rajesh K. Singhania",
        "role": "VP – Human Resources & Industrial Relations",
        "company": "Premier Auto Components Ltd (Sriperumbudur Hub)",
        "industry": "labor",
        "rating": 5,
        "title": "Eradicated Ghost Worker Invoicing Across Contractor Agencies",
        "content": "JOY TrueProfile completely eradicated ghost worker invoicing across our 12 contractor agencies. We now onboard and verify 350+ factory workers daily with automated Form XVI gate passes.",
        "is_approved": True,
        "is_featured": True,
        "status": "approved"
    },
    {
        "id": "REV-2026-002",
        "name": "Ananya Deshmukh",
        "role": "Chief Compliance & Legal Officer",
        "company": "Nexus 3PL & Supply Chain Logistics",
        "industry": "logistics",
        "rating": 5,
        "title": "Instant Commercial Driver Verification via WhatsApp Magic Links",
        "content": "Verifying commercial driving licenses and court litigation history for 2,000+ pan-India fleet drivers used to take 10 business days. With JOY TrueProfile, our drivers are verified instantly via WhatsApp magic links on the spot.",
        "is_approved": True,
        "is_featured": True,
        "status": "approved"
    },
    {
        "id": "REV-2026-003",
        "name": "Vikram Malhotra",
        "role": "Head of Talent Acquisition & Background Screening",
        "company": "Zenith Global Technologies",
        "industry": "corporate",
        "rating": 5,
        "title": "EPFO UAN Moonlighting Radar Caught Dual Employment Cases",
        "content": "The UAN moonlighting detection radar caught 14 undeclared dual-employment cases in our senior engineering hiring stream last quarter. The audit dossiers are tamper-proof and fully DPDP Act 2023 compliant.",
        "is_approved": True,
        "is_featured": True,
        "status": "approved"
    },
    {
        "id": "REV-2026-004",
        "name": "Capt. Suresh Nambiar",
        "role": "Director of Plant Security & HSE",
        "company": "Apex Heavy Infrastructure & EPC Ltd",
        "industry": "labor",
        "rating": 5,
        "title": "Sub-Second QR Gate Turnstile Passes for Factory Sites",
        "content": "Our project sites have zero tolerance for unverified labor. JOY TrueProfile generates instant QR gate passes that our security guards scan at the gate turnstiles. Real-time, fast, and rock solid.",
        "is_approved": True,
        "is_featured": True,
        "status": "approved"
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
            "client_name": r.name,
            "role": r.role or "Verified Client",
            "designation": r.role or "Verified Client",
            "company": r.company,
            "company_name": r.company,
            "industry": r.industry or "labor",
            "rating": r.rating or 5,
            "title": r.title or "Verified Client Testimonial",
            "review_title": r.title or "Verified Client Testimonial",
            "content": r.content,
            "review_text": r.content,
            "is_featured": r.is_featured,
            "status": r.status or "approved",
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
            status="approved",
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
    return {
        "success": True,
        "reviews": [
            {
                "id": r.id,
                "name": r.name,
                "client_name": r.name,
                "role": r.role,
                "designation": r.role or "Verified Client",
                "company": r.company,
                "company_name": r.company,
                "industry": r.industry or "labor",
                "rating": r.rating or 5,
                "title": r.title or "Verified Review",
                "review_title": r.title or "Verified Review",
                "content": r.content,
                "review_text": r.content,
                "is_approved": r.is_approved,
                "is_featured": r.is_featured,
                "status": r.status or ("approved" if r.is_approved else "pending"),
                "created_at": r.created_at.isoformat() if r.created_at else None
            }
            for r in reviews
        ]
    }

@router.put("/admin/{review_id}/moderate")
def moderate_review(review_id: str, payload: ClientReviewModeration, db: Session = Depends(get_db)):
    """Super Admin endpoint to approve, reject, or feature a review"""
    rev = db.query(ClientReview).filter(ClientReview.id == review_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Review not found")

    if payload.is_approved is not None:
        rev.is_approved = payload.is_approved
        rev.status = "approved" if payload.is_approved else "rejected"
    if payload.is_featured is not None:
        rev.is_featured = payload.is_featured
    if payload.status is not None:
        rev.status = payload.status.lower()
        rev.is_approved = (payload.status.lower() == "approved")
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
