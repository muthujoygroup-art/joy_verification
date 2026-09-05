import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Clock, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  RefreshCw, 
  ExternalLink,
  Sparkles,
  FileText,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { checkNetworkBeforeAction } from '../utils/networkChecker';

export const BlogCmsConsole = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Labor Law & CLRA',
    excerpt: '',
    content: '',
    author_name: 'JOY Compliance Advisory Team',
    author_role: 'Workforce Risk & Legal Counsel',
    read_time_minutes: 5,
    tags: 'contract labor, CLRA, compliance, background verification',
    is_published: true
  });

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.getAllBlogPostsAdmin();
      if (res && res.articles) {
        setArticles(res.articles);
      }
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Labor Law & CLRA',
      excerpt: '',
      content: '',
      author_name: 'JOY Compliance Advisory Team',
      author_role: 'Workforce Risk & Legal Counsel',
      read_time_minutes: 5,
      tags: 'contract labor, CLRA, compliance, background verification',
      is_published: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      slug: article.slug || '',
      category: article.category || 'Labor Law & CLRA',
      excerpt: article.excerpt || '',
      content: article.content || '',
      author_name: article.author_name || 'JOY Advisory Team',
      author_role: article.author_role || 'Legal Counsel',
      read_time_minutes: article.read_time_minutes || 5,
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags || ''),
      is_published: article.is_published ?? true
    });
    setShowModal(true);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    if (!editingArticle) {
      setFormData(prev => ({ ...prev, title: val, slug: generateSlug(val) }));
    } else {
      setFormData(prev => ({ ...prev, title: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    if (!checkNetworkBeforeAction('saving blog post')) return;

    try {
      setLoading(true);
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingArticle) {
        await api.updateBlogPostAdmin(editingArticle.id, payload);
      } else {
        await api.createBlogPostAdmin(payload);
      }

      setShowModal(false);
      fetchArticles();
    } catch (err) {
      alert(err.message || 'Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    if (!checkNetworkBeforeAction('deleting article')) return;
    try {
      setUpdatingId(articleId);
      await api.deleteBlogPostAdmin(articleId);
      setArticles(prev => prev.filter(a => a.id !== articleId));
    } catch (err) {
      alert(err.message || 'Failed to delete article');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTogglePublish = async (article) => {
    if (!checkNetworkBeforeAction('updating publication status')) return;
    try {
      setUpdatingId(article.id);
      const newStatus = !article.is_published;
      await api.updateBlogPostAdmin(article.id, { ...article, is_published: newStatus });
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, is_published: newStatus } : a));
    } catch (err) {
      alert(err.message || 'Failed to update publication status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesSearch = 
      (a.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.is_published).length,
    drafts: articles.filter(a => !a.is_published).length,
    views: articles.reduce((acc, curr) => acc + (curr.views_count || 0), 0)
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>📰 Knowledge Base & Compliance Blog CMS</span>
            <span className="badge badge-purple text-xs font-mono">{articles.length} Articles</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Publish authoritative labor law guides, DPDP compliance articles, and anti-fraud case studies to boost SEO.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/blog"
            target="_blank"
            className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Public Blog Portal ↗</span>
          </Link>
          <button
            onClick={fetchArticles}
            disabled={loading}
            className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn btn-superadmin text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Article</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Articles</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{stats.total}</div>
          <span className="text-[10px] text-slate-500">In CMS repository</span>
        </div>

        <div className="glass-panel p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Published Live</span>
          <div className="text-2xl font-black text-emerald-700 font-mono">{stats.published}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Indexable by Google SEO</span>
        </div>

        <div className="glass-panel p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Drafts</span>
          <div className="text-2xl font-black text-amber-700 font-mono">{stats.drafts}</div>
          <span className="text-[10px] text-amber-600 font-medium">Unpublished</span>
        </div>

        <div className="glass-panel p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Total Reader Views</span>
          <div className="text-2xl font-black text-indigo-700 font-mono">{stats.views.toLocaleString()}</div>
          <span className="text-[10px] text-indigo-600 font-medium">Organic platform reach</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select py-2 text-xs font-bold bg-slate-50 border-slate-200"
          >
            <option value="all">All Categories</option>
            <option value="Labor Law & CLRA">Labor Law & CLRA</option>
            <option value="White-Collar BGV">White-Collar BGV</option>
            <option value="Data Privacy & DPDP">Data Privacy & DPDP</option>
            <option value="Staffing & Contractors">Staffing & Contractors</option>
            <option value="Case Studies">Case Studies</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="glass-panel bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3.5">Article Title & Category</th>
                <th className="p-3.5">Author</th>
                <th className="p-3.5">Read Time & Views</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Last Updated</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    <span>Loading articles from database...</span>
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <span>No articles found. Click "Create Article" to write your first post.</span>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 max-w-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge badge-purple text-[9px] font-bold">{art.category}</span>
                        <span className="font-mono text-[10px] text-slate-400">/{art.slug}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 line-clamp-1 text-xs">
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{art.excerpt}</p>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-800">{art.author_name}</div>
                      <div className="text-[10px] text-slate-400">{art.author_role}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-800 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{art.read_time_minutes || 5} mins</span>
                      </div>
                      <div className="text-[10px] text-indigo-600 font-mono font-bold mt-0.5">
                        {art.views_count || 0} views
                      </div>
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => handleTogglePublish(art)}
                        disabled={updatingId === art.id}
                        className={`badge text-[10px] font-black cursor-pointer ${
                          art.is_published ? 'badge-emerald hover:bg-emerald-200' : 'badge-amber hover:bg-amber-200'
                        }`}
                      >
                        {art.is_published ? 'PUBLISHED ✓' : 'DRAFT'}
                      </button>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {art.updated_at ? new Date(art.updated_at).toLocaleDateString() : 'Recent'}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/blog/${art.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                          title="View live reader"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Edit article"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
                          disabled={updatingId === art.id}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Article Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 flex justify-center items-center animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 text-slate-900 my-8">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  {editingArticle ? 'Edit Article' : 'Create New Knowledge Base Article'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Authoritative SEO content for JOY TrueProfile</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Article Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Contract Labor Regulation Act (CLRA) 2026: Complete Corporate Compliance Guide"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="form-input py-2.5 font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">URL Slug (e.g. /blog/slug) *</label>
                  <input
                    type="text"
                    required
                    placeholder="clra-compliance-guide-2026"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="form-input py-2 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select py-2 text-xs font-bold"
                  >
                    <option value="Labor Law & CLRA">Labor Law & CLRA</option>
                    <option value="White-Collar BGV">White-Collar BGV</option>
                    <option value="Data Privacy & DPDP">Data Privacy & DPDP</option>
                    <option value="Staffing & Contractors">Staffing & Contractors</option>
                    <option value="Case Studies">Case Studies</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Adv. Suresh Nair"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    className="form-input py-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Author Title / Role</label>
                  <input
                    type="text"
                    placeholder="Senior Labor Law Counsel"
                    value={formData.author_role}
                    onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                    className="form-input py-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Read Time (Mins)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.read_time_minutes}
                    onChange={(e) => setFormData({ ...formData, read_time_minutes: Number(e.target.value) })}
                    className="form-input py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Short Excerpt / Meta Description *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="A concise 2-sentence summary that appears on search engines and card previews..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="form-input py-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Article Content (Markdown / Text) *</label>
                <textarea
                  rows="8"
                  required
                  placeholder="### Section Header&#10;&#10;Detailed analysis with bullet points and statutory references..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="form-input py-2 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-bold text-slate-800">Publish immediately to live public blog</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-superadmin text-xs py-2 px-5 font-bold cursor-pointer"
                  >
                    <span>{editingArticle ? 'Save Changes ✓' : 'Publish Article 🚀'}</span>
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
