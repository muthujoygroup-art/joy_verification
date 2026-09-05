from pydantic import BaseModel
from typing import Optional, List

class BlogPostCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    excerpt: str
    content: str
    author: Optional[str] = "JOY Compliance Editorial Team"
    cover_image: Optional[str] = None
    category: Optional[str] = "Labor Compliance"
    tags: Optional[List[str]] = []
    read_time_minutes: Optional[int] = 4
    is_published: Optional[bool] = True

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    read_time_minutes: Optional[int] = None
    is_published: Optional[bool] = None
