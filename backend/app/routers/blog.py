import uuid
import re
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.blog import BlogPost
from backend.app.schemas.blog import BlogPostCreate, BlogPostUpdate

router = APIRouter(prefix="/blog", tags=["Blog & Case Studies"])

INITIAL_BLOG_POSTS = [
    {
        "id": "BLOG-2026-001",
        "title": "How to Automate CLRA Contract Labor Compliance in India",
        "slug": "how-to-automate-clra-contract-labor-compliance-india",
        "excerpt": "A complete practical guide for plant HRs and operations managers to achieve 100% statutory labor audit readiness with digital worker dossiers.",
        "content": "### Why Contract Labor Compliance is Critical in 2026\n\nUnder the **Contract Labour (Regulation and Abolition) Act, 1970 (CLRA)**, principal employers are directly held responsible for statutory health, safety, ESIC, EPFO, and minimum wage compliance of contractor laborers on their plant premises.\n\n#### The 3 Major Pitfalls in Traditional Labor Management:\n1. **Ghost Workers & Contractor Overbilling**: Contractors often bill factories for 100 workers while only 75 are physically on-site.\n2. **Missing Wage Proofs**: Non-payment of minimum wages or PF contributions can lead to hefty penalties and plant closure notices.\n3. **Paper Dossier Chaos**: Managing thousands of physical paper forms during surprise government labor inspections is prone to errors.\n\n#### How JOY TrueProfile Solves CLRA Compliance:\n- **Instant Mobile Onboarding in < 45s**: Workers authenticate via Aadhaar OTP on their phone.\n- **Biometric Deduplication**: Stops ghost worker registrations with real-time AI face matching.\n- **1-Click Audit Dossier**: Generates complete 5-page statutory labor dossiers and digital QR worker ID cards.",
        "author": "Priya Sundaram (Head of Compliance)",
        "cover_image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
        "category": "Labor Compliance",
        "tags": ["CLRA", "Contract Labor", "Statutory Audit", "Factory HR"],
        "read_time_minutes": 5,
        "is_published": True,
        "views_count": 1420
    },
    {
        "id": "BLOG-2026-002",
        "title": "Eliminating Ghost Workers on Factory Floors with AI Biometrics",
        "slug": "eliminating-ghost-workers-factory-floors-ai-biometrics",
        "excerpt": "Learn how top manufacturing and infrastructure leaders save up to 18% in monthly contractor payroll by eliminating duplicate and non-existent workers.",
        "content": "### The Real Cost of Ghost Workers in Manufacturing\n\nIn high-turnover industries like construction, manufacturing, and warehousing, contractor billing fraud remains a multi-crore problem.\n\n#### Key Strategies to Eliminate Ghost Worker Billing:\n1. **Aadhaar Cryptographic Uniqueness**: Every registered laborer must have a verified 12-digit UIDAI token.\n2. **AI Facial Neural Matching**: Real-time 3D selfie matching prevents contractors from swapping identities between shifts.\n3. **Direct IMPS Wage Verification**: Verify bank accounts directly before approving contractor wage disbursement invoices.\n\nJOY TrueProfile provides real-time deduplication at the factory gate with zero manual paperwork.",
        "author": "Dr. Rajeshwar Rao (VP Industrial Operations)",
        "cover_image": "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=60",
        "category": "Ghost Worker Prevention",
        "tags": ["Ghost Workers", "Biometrics", "Contractor Fraud", "Manufacturing"],
        "read_time_minutes": 4,
        "is_published": True,
        "views_count": 980
    },
    {
        "id": "BLOG-2026-003",
        "title": "EPFO Career History Audits: The Modern Defense Against Moonlighting",
        "slug": "epfo-career-history-audits-moonlighting-defense",
        "excerpt": "How direct government employment repository audits uncover genuine tenures, company legal names, and dual employment in corporate hiring.",
        "content": "### Resume Fraud vs. Authenticated Government Data\n\nOver 28% of modern tech and corporate resumes contain exaggerated tenures or omit simultaneous full-time employment (moonlighting).\n\n#### Why Traditional HR Background Verification Fails:\n- Manual HR email verification takes 10 to 14 days.\n- Former company HRs often do not respond in time.\n- Fake experience certificate syndicates issue convincing forged documents.\n\n#### The JOY TrueProfile Advantage:\nBy performing real-time authenticated service timeline audits against official EPFO records, hiring teams immediately see:\n- Exact date of joining and date of exit.\n- Authenticated legal establishment name.\n- Complete overlap analysis for dual employment.",
        "author": "Karan Malhotra (Talent Strategy Advisor)",
        "cover_image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
        "category": "Verification Tech",
        "tags": ["EPFO", "Moonlighting", "Background Screening", "Corporate HR"],
        "read_time_minutes": 6,
        "is_published": True,
        "views_count": 2150
    }
]

def generate_slug(title: str) -> str:
    s = title.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s

def seed_default_blogs_if_empty(db: Session):
    count = db.query(BlogPost).count()
    if count == 0:
        for b in INITIAL_BLOG_POSTS:
            post = BlogPost(
                id=b["id"],
                title=b["title"],
                slug=b["slug"],
                excerpt=b["excerpt"],
                content=b["content"],
                author=b["author"],
                cover_image=b["cover_image"],
                category=b["category"],
                tags=b["tags"],
                read_time_minutes=b["read_time_minutes"],
                is_published=b["is_published"],
                views_count=b["views_count"],
                published_at=datetime.utcnow(),
                created_at=datetime.utcnow()
            )
            db.add(post)
        db.commit()

@router.get("/public")
def get_public_blogs(category: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    """Public endpoint to fetch published blog articles"""
    seed_default_blogs_if_empty(db)
    query = db.query(BlogPost).filter(BlogPost.is_published == True)
    
    if category and category.lower() != 'all':
        query = query.filter(BlogPost.category.ilike(category))
    
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter((BlogPost.title.ilike(term)) | (BlogPost.excerpt.ilike(term)) | (BlogPost.content.ilike(term)))
        
    posts = query.order_by(BlogPost.published_at.desc()).all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "excerpt": p.excerpt,
            "author": p.author,
            "cover_image": p.cover_image,
            "category": p.category,
            "tags": p.tags or [],
            "read_time_minutes": p.read_time_minutes,
            "views_count": p.views_count,
            "published_at": p.published_at.isoformat() if p.published_at else None
        }
        for p in posts
    ]

@router.get("/public/{slug}")
def get_blog_by_slug(slug: str, db: Session = Depends(get_db)):
    """Public endpoint to fetch a single blog article by slug"""
    seed_default_blogs_if_empty(db)
    post = db.query(BlogPost).filter(BlogPost.slug == slug, BlogPost.is_published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog article not found")
    
    post.views_count = (post.views_count or 0) + 1
    db.commit()

    return {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "excerpt": post.excerpt,
        "content": post.content,
        "author": post.author,
        "cover_image": post.cover_image,
        "category": post.category,
        "tags": post.tags or [],
        "read_time_minutes": post.read_time_minutes,
        "views_count": post.views_count,
        "published_at": post.published_at.isoformat() if post.published_at else None
    }

@router.get("/admin/all")
def get_admin_blogs(db: Session = Depends(get_db)):
    """Super Admin endpoint to fetch all blog posts (drafts & published)"""
    seed_default_blogs_if_empty(db)
    posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "excerpt": p.excerpt,
            "content": p.content,
            "author": p.author,
            "cover_image": p.cover_image,
            "category": p.category,
            "tags": p.tags or [],
            "read_time_minutes": p.read_time_minutes,
            "is_published": p.is_published,
            "views_count": p.views_count,
            "published_at": p.published_at.isoformat() if p.published_at else None,
            "created_at": p.created_at.isoformat() if p.created_at else None
        }
        for p in posts
    ]

@router.post("/admin")
def create_blog_post(payload: BlogPostCreate, db: Session = Depends(get_db)):
    """Super Admin endpoint to create a new blog article"""
    try:
        slug = payload.slug.strip() if payload.slug else generate_slug(payload.title)
        existing = db.query(BlogPost).filter(BlogPost.slug == slug).first()
        if existing:
            slug = f"{slug}-{uuid.uuid4().hex[:4]}"

        post_id = f"BLOG-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        post = BlogPost(
            id=post_id,
            title=payload.title.strip(),
            slug=slug,
            excerpt=payload.excerpt.strip(),
            content=payload.content.strip(),
            author=payload.author or "JOY Compliance Editorial Team",
            cover_image=payload.cover_image,
            category=payload.category or "Labor Compliance",
            tags=payload.tags or [],
            read_time_minutes=payload.read_time_minutes or 4,
            is_published=payload.is_published if payload.is_published is not None else True,
            views_count=0,
            published_at=datetime.utcnow() if payload.is_published else None,
            created_at=datetime.utcnow()
        )
        db.add(post)
        db.commit()
        db.refresh(post)
        return {"success": True, "message": "Blog post created successfully", "blog_id": post.id, "slug": post.slug}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create blog post: {str(e)}")

@router.put("/admin/{blog_id}")
def update_blog_post(blog_id: str, payload: BlogPostUpdate, db: Session = Depends(get_db)):
    """Super Admin endpoint to edit an existing blog article"""
    post = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog article not found")

    if payload.title is not None:
        post.title = payload.title.strip()
    if payload.slug is not None and payload.slug.strip():
        post.slug = payload.slug.strip()
    if payload.excerpt is not None:
        post.excerpt = payload.excerpt.strip()
    if payload.content is not None:
        post.content = payload.content.strip()
    if payload.author is not None:
        post.author = payload.author
    if payload.cover_image is not None:
        post.cover_image = payload.cover_image
    if payload.category is not None:
        post.category = payload.category
    if payload.tags is not None:
        post.tags = payload.tags
    if payload.read_time_minutes is not None:
        post.read_time_minutes = payload.read_time_minutes
    if payload.is_published is not None:
        post.is_published = payload.is_published
        if payload.is_published and not post.published_at:
            post.published_at = datetime.utcnow()

    post.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(post)
    return {"success": True, "message": f"Blog post {blog_id} updated successfully"}

@router.delete("/admin/{blog_id}")
def delete_blog_post(blog_id: str, db: Session = Depends(get_db)):
    """Super Admin endpoint to delete a blog article"""
    post = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog article not found")
    db.delete(post)
    db.commit()
    return {"success": True, "message": f"Blog post {blog_id} deleted successfully"}
