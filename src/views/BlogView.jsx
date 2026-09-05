import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Tag, 
  Search, 
  Sparkles, 
  Share2, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  HardHat, 
  ShieldCheck, 
  ChevronRight,
  Bookmark,
  Building2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export const BlogView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // Fallback initial articles
  const defaultBlogs = [
    {
      id: "BLOG-2026-001",
      title: "How to Automate CLRA Contract Labor Compliance in India",
      slug: "how-to-automate-clra-contract-labor-compliance-india",
      excerpt: "A complete practical guide for plant HRs and operations managers to achieve 100% statutory labor audit readiness with digital worker dossiers.",
      content: `### Why Contract Labor Compliance is Critical in 2026

Under the **Contract Labour (Regulation and Abolition) Act, 1970 (CLRA)**, principal employers are directly held responsible for statutory health, safety, ESIC, EPFO, and minimum wage compliance of contractor laborers on their plant premises.

#### The 3 Major Pitfalls in Traditional Labor Management:
1. **Ghost Workers & Contractor Overbilling**: Contractors often bill factories for 100 workers while only 75 are physically on-site.
2. **Missing Wage Proofs**: Non-payment of minimum wages or PF contributions can lead to hefty penalties and plant closure notices.
3. **Paper Dossier Chaos**: Managing thousands of physical paper forms during surprise government labor inspections is prone to errors.

#### How JOY TrueProfile Solves CLRA Compliance:
- **Instant Mobile Onboarding in < 45s**: Workers authenticate via Aadhaar OTP on their phone without app installation.
- **Biometric Deduplication**: Stops ghost worker registrations with real-time AI face matching.
- **1-Click Audit Dossier**: Generates complete 5-page statutory labor dossiers and digital QR worker ID cards.
- **Direct Wage Bank IMPS Verification**: Matches account names directly with bank records to prevent payroll rejections.`,
      author: "Priya Sundaram (Head of Compliance)",
      cover_image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
      category: "Labor Compliance",
      tags: ["CLRA", "Contract Labor", "Statutory Audit", "Factory HR"],
      read_time_minutes: 5,
      views_count: 1420,
      published_at: "2026-09-01T10:00:00Z"
    },
    {
      id: "BLOG-2026-002",
      title: "Eliminating Ghost Workers on Factory Floors with AI Biometrics",
      slug: "eliminating-ghost-workers-factory-floors-ai-biometrics",
      excerpt: "Learn how top manufacturing and infrastructure leaders save up to 18% in monthly contractor payroll by eliminating duplicate and non-existent workers.",
      content: `### The Real Cost of Ghost Workers in Manufacturing

In high-turnover industries like construction, manufacturing, and warehousing, contractor billing fraud remains a multi-crore problem.

#### Key Strategies to Eliminate Ghost Worker Billing:
1. **Aadhaar Cryptographic Uniqueness**: Every registered laborer must have a verified 12-digit UIDAI token.
2. **AI Facial Neural Matching**: Real-time 3D selfie matching prevents contractors from swapping identities between shifts.
3. **Direct IMPS Wage Verification**: Verify bank accounts directly before approving contractor wage disbursement invoices.

JOY TrueProfile provides real-time deduplication at the factory gate with zero manual paperwork.`,
      author: "Dr. Rajeshwar Rao (VP Industrial Operations)",
      cover_image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=60",
      category: "Ghost Worker Prevention",
      tags: ["Ghost Workers", "Biometrics", "Contractor Fraud", "Manufacturing"],
      read_time_minutes: 4,
      views_count: 980,
      published_at: "2026-08-25T14:30:00Z"
    },
    {
      id: "BLOG-2026-003",
      title: "EPFO Career History Audits: The Modern Defense Against Moonlighting",
      slug: "epfo-career-history-audits-moonlighting-defense",
      excerpt: "How direct government employment repository audits uncover genuine tenures, company legal names, and dual employment in corporate hiring.",
      content: `### Resume Fraud vs. Authenticated Government Data

Over 28% of modern tech and corporate resumes contain exaggerated tenures or omit simultaneous full-time employment (moonlighting).

#### Why Traditional HR Background Verification Fails:
- Manual HR email verification takes 10 to 14 days.
- Former company HRs often do not respond in time.
- Fake experience certificate syndicates issue convincing forged documents.

#### The JOY TrueProfile Advantage:
By performing real-time authenticated service timeline audits against official EPFO records, hiring teams immediately see:
- Exact date of joining and date of exit.
- Authenticated legal establishment name.
- Complete overlap analysis for dual employment.`,
      author: "Karan Malhotra (Talent Strategy Advisor)",
      cover_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
      category: "Verification Tech",
      tags: ["EPFO", "Moonlighting", "Background Screening", "Corporate HR"],
      read_time_minutes: 6,
      views_count: 2150,
      published_at: "2026-08-18T09:15:00Z"
    }
  ];

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        if (slug) {
          const res = await api.get(`/api/blog/public/${slug}`).catch(() => null);
          if (res && res.data) {
            setCurrentArticle(res.data);
          } else {
            const fallback = defaultBlogs.find(b => b.slug === slug);
            setCurrentArticle(fallback || defaultBlogs[0]);
          }
        } else {
          const res = await api.get('/api/blog/public').catch(() => null);
          if (res && Array.isArray(res.data) && res.data.length > 0) {
            setBlogs(res.data);
          } else {
            setBlogs(defaultBlogs);
          }
        }
      } catch (e) {
        setBlogs(defaultBlogs);
        if (slug) {
          const fallback = defaultBlogs.find(b => b.slug === slug);
          setCurrentArticle(fallback || defaultBlogs[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = selectedCategory === 'all' || b.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !searchTerm || 
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* 🌐 Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          
          <Link to="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
            <img 
              src="/joy_logo.png" 
              alt="JOY TrueProfile Logo" 
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-lg lg:text-xl text-slate-900 tracking-tight leading-none">
                  JOY <span className="text-indigo-600">TrueProfile</span>
                </span>
                <span className="badge badge-purple text-[8px] sm:text-[9px] py-0.5 px-1.5 font-black shrink-0">
                  INSIGHTS
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">
                Labor & Verification Knowledge Base
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="btn btn-secondary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/#portals"
              className="btn btn-superadmin text-xs py-2 px-4 font-black shadow-md hidden sm:flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Client Portal</span>
            </Link>
          </div>

        </div>
      </header>

      {/* 📖 ARTICLE READER VIEW (when :slug is active) */}
      {slug && currentArticle ? (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8 animate-fadeIn">
          
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>

          {/* Article Header */}
          <div className="space-y-4 border-b border-slate-200 pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-purple text-xs font-black uppercase tracking-wider">
                {currentArticle.category}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {currentArticle.read_time_minutes || 4} min read
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {currentArticle.views_count || 1200} reads
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {currentArticle.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              {currentArticle.excerpt}
            </p>

            {/* Author & Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{currentArticle.author}</div>
                  <div className="text-[11px] text-slate-500">JOY TrueProfile Compliance Editorial</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{copySuccess ? 'Link Copied! ✓' : 'Share Article'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {currentArticle.cover_image && (
            <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-video max-h-[420px] w-full">
              <img 
                src={currentArticle.cover_image} 
                alt={currentArticle.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <article className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-5 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
            {currentArticle.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return <h3 key={idx} className="text-xl sm:text-2xl font-black text-slate-900 pt-4">{paragraph.replace('### ', '')}</h3>;
              }
              if (paragraph.startsWith('#### ')) {
                return <h4 key={idx} className="text-lg font-extrabold text-indigo-950 pt-2">{paragraph.replace('#### ', '')}</h4>;
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n- ');
                return (
                  <ul key={idx} className="space-y-1.5 list-disc pl-5 font-medium text-slate-700">
                    {items.map((it, i) => (
                      <li key={i}>{it.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\./.test(paragraph)) {
                const items = paragraph.split(/\n\d+\.\s+/);
                return (
                  <ol key={idx} className="space-y-1.5 list-decimal pl-5 font-medium text-slate-700">
                    {items.map((it, i) => (
                      <li key={i}>{it.replace(/^\d+\.\s+/, '')}</li>
                    ))}
                  </ol>
                );
              }
              return <p key={idx} className="font-medium text-slate-700 leading-relaxed">{paragraph}</p>;
            })}
          </article>

          {/* Bottom Enterprise CTA Banner */}
          <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-indigo-300">Enterprise Compliance Solution</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Ready to Automate Labor Verification & Eliminate Ghost Workers?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
              Start creating verified digital labor profiles with instant Aadhaar KYC, police checks, and CLRA statutory compliance in under 45 seconds.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/#pricing" className="btn btn-superadmin text-xs py-2.5 px-5 font-black">
                <span>View Prepaid Credit Plans ⚡</span>
              </Link>
              <Link to="/" className="btn btn-secondary text-xs py-2.5 px-5 font-bold bg-white/10 hover:bg-white/20 text-white border-white/20">
                <span>Explore Live Platform</span>
              </Link>
            </div>
          </div>

        </main>
      ) : (
        /* 📚 BLOG DIRECTORY & LISTING VIEW */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fadeIn">
          
          {/* Header Banner */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="badge badge-purple text-xs font-black uppercase tracking-wider">
              Knowledge Base & Insights
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Labor Compliance & Verification Insights
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Actionable guides, regulatory updates, and case studies on factory workforce management, CLRA compliance, and fraud prevention.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
            
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles & case studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 py-2 text-xs w-full"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
              {['all', 'Labor Compliance', 'Ghost Worker Prevention', 'Verification Tech'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Topics' : cat}
                </button>
              ))}
            </div>

          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article 
                key={blog.id} 
                className="glass-panel bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:border-indigo-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group card-hover-lift"
              >
                <div>
                  {blog.cover_image && (
                    <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                      <img 
                        src={blog.cover_image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 badge badge-purple text-[9px] font-black uppercase tracking-wider backdrop-blur-md">
                        {blog.category}
                      </span>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.read_time_minutes || 4} min
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {blog.views_count || 1000} reads
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      <Link to={`/blog/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 text-[11px] truncate max-w-[160px]">
                    ✍️ {blog.author}
                  </span>

                  <Link 
                    to={`/blog/${blog.slug}`}
                    className="font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </main>
      )}

      {/* 🏢 Enterprise Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-xs border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-black text-white text-sm">JOY TrueProfile</h4>
            <p className="text-[11px] text-slate-500">© 2026 JOY CORPORATE SOLUTIONS PVT LTD. All Rights Reserved.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-white transition-colors">Knowledge Base</Link>
            <Link to="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/#faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
