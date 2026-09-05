from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, JSON
from datetime import datetime
from backend.app.database import Base

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'BLOG-2026-001'
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    excerpt = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    author = Column(String(100), default="JOY Compliance Editorial Team")
    cover_image = Column(String(500), nullable=True)
    category = Column(String(100), default="Labor Compliance") # 'Labor Compliance' | 'Ghost Worker Prevention' | 'Verification Tech' | 'Case Studies'
    tags = Column(JSON, default=list) # ['CLRA', 'Aadhaar', 'Factory Labor']
    read_time_minutes = Column(Integer, default=4)
    is_published = Column(Boolean, default=True)
    views_count = Column(Integer, default=0)
    published_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
