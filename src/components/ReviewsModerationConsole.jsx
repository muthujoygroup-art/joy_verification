import React, { useState, useEffect } from 'react';
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  RefreshCw, 
  Search, 
  Filter, 
  Award, 
  Sparkles, 
  Building2, 
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Plus,
  Eye,
  EyeOff,
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { api } from '../services/api';
import { checkNetworkBeforeAction } from '../utils/networkChecker';
import { useApp } from '../context/AppContext';

export const ReviewsModerationConsole = () => {
  const { landingPageContent, updateLandingPageContent } = useApp() || {};
  const isGlobalReviewsEnabled = landingPageContent?.enableClientReviews !== false;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFeatureInfo, setShowFeatureInfo] = useState(false);

  const [addForm, setAddForm] = useState({
    client_name: '',
    company_name: '',
    designation: '',
    industry_category: 'labor',
    rating: 5,
    review_title: '',
    review_text: '',
    verified_metric: 'Verified Enterprise Client ✓'
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.getAllReviewsAdmin(statusFilter !== 'all' ? statusFilter : undefined);
      if (res && res.reviews) {
        setReviews(res.reviews);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleToggleGlobalReviews = () => {
    if (updateLandingPageContent) {
      const nextState = !isGlobalReviewsEnabled;
      updateLandingPageContent({
        ...(landingPageContent || {}),
        enableClientReviews: nextState
      });
    }
  };

  const handleModerate = async (reviewId, newStatus, isFeatured) => {
    if (!checkNetworkBeforeAction('moderating review')) return;
    try {
      setUpdatingId(reviewId);
      const isApproved = newStatus === 'approved';
      await api.moderateReview(reviewId, newStatus, isFeatured);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: newStatus, is_approved: isApproved, is_featured: isFeatured ?? r.is_featured } : r));
    } catch (err) {
      alert(err.message || 'Failed to moderate review');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (review) => {
    if (!checkNetworkBeforeAction('toggling featured status')) return;
    try {
      setUpdatingId(review.id);
      const newFeatured = !review.is_featured;
      await api.moderateReview(review.id, review.status, newFeatured);
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, is_featured: newFeatured } : r));
    } catch (err) {
      alert(err.message || 'Failed to toggle featured status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this client review?')) return;
    if (!checkNetworkBeforeAction('deleting review')) return;
    try {
      setUpdatingId(reviewId);
      await api.deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    if (!checkNetworkBeforeAction('adding review')) return;
    try {
      setLoading(true);
      await api.submitReview({
        ...addForm,
        status: 'approved',
        is_featured: true
      });
      setShowAddModal(false);
      setAddForm({
        client_name: '',
        company_name: '',
        designation: '',
        industry_category: 'labor',
        rating: 5,
        review_title: '',
        review_text: '',
        verified_metric: 'Verified Enterprise Client ✓'
      });
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(r => {
    const term = searchTerm.toLowerCase();
    return (
      (r.client_name || '').toLowerCase().includes(term) ||
      (r.company_name || '').toLowerCase().includes(term) ||
      (r.review_text || '').toLowerCase().includes(term) ||
      (r.review_title || '').toLowerCase().includes(term)
    );
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => (r.status || '').toLowerCase() === 'pending').length,
    approved: reviews.filter(r => (r.status || '').toLowerCase() === 'approved' || r.is_approved === true).length,
    disabled: reviews.filter(r => (r.status || '').toLowerCase() === 'disabled' || (r.status || '').toLowerCase() === 'rejected').length,
    featured: reviews.filter(r => r.is_featured).length
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>⭐ Client Reviews & Testimonials Console</span>
              <span className="badge badge-amber text-xs font-mono">{reviews.length} Total</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage, approve, disable, and spotlight verified enterprise client testimonials across the public platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Global Toggle Button */}
          <button
            type="button"
            onClick={handleToggleGlobalReviews}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              isGlobalReviewsEnabled 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' 
                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
            }`}
            title="Enable or disable the entire Client Reviews section on the homepage"
          >
            {isGlobalReviewsEnabled ? (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-600" />
                <span>Homepage Reviews: ENABLED</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-slate-400" />
                <span>Homepage Reviews: DISABLED</span>
              </>
            )}
          </button>

          <button
            onClick={fetchReviews}
            disabled={loading}
            className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-superadmin text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client Review</span>
          </button>
        </div>
      </div>

      {/* Feature Meaning Explanatory Callout Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-extrabold text-indigo-950">What is &quot;Featured&quot;?</strong>
            <p className="text-[11px] text-indigo-800 font-medium mt-0.5">
              Featuring a review pins it to the <strong>Spotlight Section</strong> on the homepage with a purple badge and top priority placement. Unfeatured reviews remain visible as standard client testimonials.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowFeatureInfo(!showFeatureInfo)}
          className="text-[11px] font-bold text-indigo-700 hover:underline shrink-0 flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showFeatureInfo ? 'Hide Guide' : 'Learn More'}</span>
        </button>
      </div>

      {showFeatureInfo && (
        <div className="p-4 rounded-2xl bg-white border border-indigo-200 text-slate-700 text-xs space-y-2 animate-fadeIn">
          <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-600" /> Review Status & Control Guide
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
            <li><strong className="text-emerald-700">Enable / Approved:</strong> Review is live and visible on the main landing page.</li>
            <li><strong className="text-amber-700">Disable / Hidden:</strong> Review is hidden from the public API and landing page, but preserved safely in SuperAdmin DB.</li>
            <li><strong className="text-purple-700">Feature (Spotlight):</strong> Highlighted with a special purple badge on the front page as a top-tier client case study.</li>
            <li><strong className="text-rose-700">Delete:</strong> Permanently removes the review entry from the database.</li>
          </ul>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Feedback</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{stats.total}</div>
          <span className="text-[10px] text-slate-500">All submissions</span>
        </div>

        <div className="glass-panel p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Moderation</span>
          <div className="text-2xl font-black text-amber-700 font-mono">{stats.pending}</div>
          <span className="text-[10px] text-amber-600 font-medium">Needs review</span>
        </div>

        <div className="glass-panel p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Approved Live</span>
          <div className="text-2xl font-black text-emerald-700 font-mono">{stats.approved}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Visible in public API</span>
        </div>

        <div className="glass-panel p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Featured Spotlight</span>
          <div className="text-2xl font-black text-purple-700 font-mono">{stats.featured}</div>
          <span className="text-[10px] text-purple-600 font-medium">Homepage spotlight</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by client name, company, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select py-2 text-xs font-bold bg-slate-50 border-slate-200"
          >
            <option value="all">All Moderation Statuses</option>
            <option value="approved">Approved / Live</option>
            <option value="pending">Pending Only</option>
            <option value="disabled">Disabled / Hidden</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400 glass-panel bg-white border border-slate-200 rounded-3xl">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
            <span>Loading reviews moderation queue...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 glass-panel bg-white border border-slate-200 rounded-3xl">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
            <span>No reviews match the selected filter.</span>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isApproved = (rev.status || '').toLowerCase() === 'approved' || rev.is_approved === true;
            const isDisabled = (rev.status || '').toLowerCase() === 'disabled' || (rev.status || '').toLowerCase() === 'rejected';
            
            return (
              <div
                key={rev.id}
                className={`glass-panel p-5 bg-white border-2 rounded-3xl shadow-sm space-y-4 transition-all flex flex-col justify-between ${
                  isApproved ? 'border-emerald-200' :
                  isDisabled ? 'border-slate-300 bg-slate-50/60 opacity-80' :
                  'border-amber-300 bg-amber-50/20'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Header & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <h3 className="font-black text-sm text-slate-900 leading-snug">
                        &quot;{rev.review_title || 'Client Testimonial'}&quot;
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`badge text-[10px] font-bold ${
                        isApproved ? 'badge-emerald' :
                        isDisabled ? 'badge-slate' :
                        'badge-amber'
                      }`}>
                        {isApproved ? 'APPROVED LIVE' : isDisabled ? 'DISABLED (HIDDEN)' : 'PENDING'}
                      </span>
                      {rev.is_featured && (
                        <span className="badge badge-purple text-[9px] font-black flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>FEATURED</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {rev.review_text}
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="font-extrabold text-slate-900 block">{rev.client_name}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{rev.designation} • <strong>{rev.company_name}</strong></span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                </div>

                {/* Moderation Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {!isApproved ? (
                      <button
                        onClick={() => handleModerate(rev.id, 'approved', rev.is_featured)}
                        disabled={updatingId === rev.id}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Enable and publish review live on homepage"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Enable / Publish</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleModerate(rev.id, 'disabled', false)}
                        disabled={updatingId === rev.id}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Disable review to hide from public homepage"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Disable / Hide</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleFeatured(rev)}
                      disabled={updatingId === rev.id}
                      className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer border ${
                        rev.is_featured 
                          ? 'bg-purple-100 text-purple-900 border-purple-300' 
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                      title="Spotlight review as a featured case study"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>{rev.is_featured ? 'Unfeature' : 'Feature'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(rev.id)}
                    disabled={updatingId === rev.id}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 flex justify-center items-center animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 text-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-slate-900">Add Verified Client Review</h3>
                <p className="text-xs text-slate-500 font-medium">Create and publish an enterprise client case study</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddReviewSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patil"
                  value={addForm.client_name}
                  onChange={(e) => setAddForm({ ...addForm, client_name: e.target.value })}
                  className="form-input py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Industrial Infrastructure"
                    value={addForm.company_name}
                    onChange={(e) => setAddForm({ ...addForm, company_name: e.target.value })}
                    className="form-input py-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Designation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. VP – HR & Compliance"
                    value={addForm.designation}
                    onChange={(e) => setAddForm({ ...addForm, designation: e.target.value })}
                    className="form-input py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Industry Category</label>
                  <select
                    value={addForm.industry_category}
                    onChange={(e) => setAddForm({ ...addForm, industry_category: e.target.value })}
                    className="form-select py-2 text-xs font-bold"
                  >
                    <option value="labor">Contract / Factory Labor</option>
                    <option value="logistics">Logistics & Fleet Drivers</option>
                    <option value="corporate">Corporate / IT / BFSI</option>
                    <option value="staffing">Staffing Agency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Star Rating (1-5)</label>
                  <select
                    value={addForm.rating}
                    onChange={(e) => setAddForm({ ...addForm, rating: Number(e.target.value) })}
                    className="form-select py-2 text-xs font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Review Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Onboarding 6,000+ factory workers every month with zero ghost workers!"
                  value={addForm.review_title}
                  onChange={(e) => setAddForm({ ...addForm, review_title: e.target.value })}
                  className="form-input py-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Detailed Client Testimonial *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detailed quote on turnaround time, fraud reduction, and ROI..."
                  value={addForm.review_text}
                  onChange={(e) => setAddForm({ ...addForm, review_text: e.target.value })}
                  className="form-input py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-superadmin text-xs py-2 px-4 font-bold cursor-pointer"
                >
                  <span>Publish & Feature Review ⭐</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
