import React, { useState, useMemo, useEffect } from 'react';
import {
  HardDrive,
  Database,
  Server,
  Cloud,
  Layers,
  FileCheck2,
  Users,
  Building2,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  FolderLock,
  ShieldCheck,
  Edit,
  Save,
  X,
  Sparkles,
  PieChart,
  Sliders,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StorageManagementConsole = () => {
  const {
    companies,
    storageMetrics,
    isLoadingStorageMetrics,
    fetchStorageMetrics,
    updateCompanyStorageQuota,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'normal' | 'near_limit' | 'critical'
  const [editingCompany, setEditingCompany] = useState(null);
  const [newQuotaGb, setNewQuotaGb] = useState(25);
  const [isSavingQuota, setIsSavingQuota] = useState(false);
  const [selectedBreakdownCompany, setSelectedBreakdownCompany] = useState(null);

  // Auto-fetch storage metrics on mount
  useEffect(() => {
    if (typeof fetchStorageMetrics === 'function') {
      fetchStorageMetrics();
    }
  }, []);

  const projectStorage = storageMetrics?.project_storage || {
    used_mb: 0.47,
    used_gb: 0.001,
    total_allocated_gb: 100,
    total_files: 260,
    allocated_utilization_pct: 0.5
  };

  const serverDisk = storageMetrics?.server_disk || {
    total_gb: 475.77,
    used_gb: 165.54,
    free_gb: 310.23,
    usage_percentage: 34.8
  };

  const categories = storageMetrics?.categories || {
    candidate_kyc: { label: 'Candidate KYC & Biometrics', mb: 0, files: 0 },
    company_contracts: { label: 'Company Contracts & Statutory Proofs', mb: 0, files: 0 },
    exported_reports: { label: 'Verification Certificates & Dossiers', mb: 0, files: 0 },
    database_records: { label: 'System Database (PostgreSQL/SQLite)', mb: 0.47, files: 1 },
    public_media: { label: 'Brand Assets & Visual Media', mb: 47.87, files: 259 }
  };

  // Merge companies list with backend breakdown data
  const companiesList = useMemo(() => {
    const backendCompanies = storageMetrics?.companies || [];
    const backendMap = new Map();
    backendCompanies.forEach(c => {
      backendMap.set(c.id, c);
      if (c.code) backendMap.set(c.code, c);
    });

    return (companies || []).map(comp => {
      const bInfo = backendMap.get(comp.id) || backendMap.get(comp.code) || {};
      const allocatedGb = parseFloat(comp.storage_limit_gb || bInfo.allocated_gb || 25);
      const usedMb = parseFloat(comp.storage_used_mb ?? bInfo.used_mb ?? 0);
      const usedGb = usedMb / 1024;
      const allocatedMb = allocatedGb * 1024;
      const pct = allocatedMb > 0 ? (usedMb / allocatedMb) * 100 : 0;
      
      let status = 'Normal';
      if (pct >= 90) status = 'Critical';
      else if (pct >= 70) status = 'Near Limit';

      return {
        ...comp,
        allocated_gb: allocatedGb,
        used_mb: usedMb,
        used_gb: roundNum(usedGb, 3),
        used_percentage: roundNum(pct, 2),
        file_count: comp.storage_file_count || bInfo.file_count || 0,
        status: bInfo.status || status,
        breakdown: bInfo.breakdown || comp.storage_breakdown || {}
      };
    });
  }, [companies, storageMetrics]);

  // Filtered list
  const filteredCompanies = useMemo(() => {
    return companiesList.filter(c => {
      const matchSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      if (filterStatus === 'normal') return c.status === 'Normal';
      if (filterStatus === 'near_limit') return c.status === 'Near Limit';
      if (filterStatus === 'critical') return c.status === 'Critical';
      return true;
    });
  }, [companiesList, searchTerm, filterStatus]);

  // Aggregate totals
  const totalAllocatedGbAcrossAll = useMemo(() => {
    return companiesList.reduce((acc, c) => acc + (parseFloat(c.allocated_gb) || 25), 0);
  }, [companiesList]);

  const handleOpenEditModal = (comp) => {
    setEditingCompany(comp);
    setNewQuotaGb(comp.allocated_gb || 25);
  };

  const handleSaveQuota = async (e) => {
    e.preventDefault();
    if (!editingCompany) return;
    setIsSavingQuota(true);
    try {
      await updateCompanyStorageQuota(editingCompany.id, newQuotaGb);
      setEditingCompany(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingQuota(false);
    }
  };

  function roundNum(num, dec = 2) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Quick Controls */}
      <div className="glass-panel p-6 border-slate-200 bg-white rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Enterprise Cloud Storage & Vault Management</span>
                <span className="badge badge-purple text-[10px] font-black uppercase tracking-wider">DPDP Act 2023 Compliant</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Real-time storage calculation, company vault quota provisioning, and physical host server metrics
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={isLoadingStorageMetrics}
            onClick={() => fetchStorageMetrics()}
            className="btn btn-secondary text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer hover:bg-slate-100"
            title="Recalculate Storage Metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStorageMetrics ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
            <span>Recalculate Storage</span>
          </button>
        </div>
      </div>

      {/* 2. Top Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Project Storage Currently Used */}
        <div className="glass-panel p-5 bg-white border-slate-200 rounded-3xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Project Used</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-outfit">
              {projectStorage.used_mb < 1024 
                ? `${projectStorage.used_mb} MB` 
                : `${roundNum(projectStorage.used_mb / 1024, 2)} GB`}
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              ({projectStorage.total_files || 0} Files)
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Uploads, Database & Brand Media</span>
          </div>
        </div>

        {/* KPI 2: Total Storage Allocated to Tenants */}
        <div className="glass-panel p-5 bg-white border-slate-200 rounded-3xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Allocated Quota</span>
            <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FolderLock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-outfit">
              {totalAllocatedGbAcrossAll || projectStorage.total_allocated_gb} GB
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              ({companiesList.length} Tenants)
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-purple-700 font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>Dedicated isolated tenant vaults</span>
          </div>
        </div>

        {/* KPI 3: Host Server Free Capacity */}
        <div className="glass-panel p-5 bg-white border-slate-200 rounded-3xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Host Server Disk</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-outfit">
              {serverDisk.free_gb} GB Free
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              / {serverDisk.total_gb} GB
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, serverDisk.usage_percentage || 30)}%` }}
            />
          </div>
        </div>

        {/* KPI 4: DPDP Compliance & Encryption */}
        <div className="glass-panel p-5 bg-white border-slate-200 rounded-3xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Vault Security</span>
            <span className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-outfit">
              AES-256
            </span>
            <span className="text-[11px] font-bold text-emerald-600">
              SHA-256 Hashes
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-sky-700 font-bold">
            <FolderLock className="w-3.5 h-3.5" />
            <span>Per-tenant tenant folder isolation</span>
          </div>
        </div>

      </div>

      {/* 3. Category Breakdown & Global Distribution */}
      <div className="glass-panel p-6 border-slate-200 bg-white rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <span>Project Storage Distribution by Category</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Granular breakdown of candidate dossiers, statutory business proofs, certificates, and database records
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            Total Used: <strong className="text-slate-800">{projectStorage.used_mb} MB</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {Object.entries(categories).map(([key, cat]) => (
            <div key={key} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate max-w-[130px]" title={cat.label}>
                  {cat.label}
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-700">
                  {cat.files || 0} files
                </span>
              </div>
              <div className="text-lg font-black text-slate-900 font-outfit">
                {cat.mb < 1024 ? `${cat.mb} MB` : `${roundNum(cat.mb / 1024, 2)} GB`}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {key === 'candidate_kyc' && 'KYC IDs, Biometrics & Face Scans'}
                {key === 'company_contracts' && 'COI, GSTIN, PAN & Signatory Proofs'}
                {key === 'exported_reports' && 'PDF Reports & Tamper-Evident Dossiers'}
                {key === 'database_records' && 'Relational Tables, Users & Audit Logs'}
                {key === 'public_media' && 'Logos, Seals & Emblems'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Company Cloud Vault Quota Management Table */}
      <div className="glass-panel p-6 border-slate-200 bg-white rounded-3xl shadow-sm space-y-4">
        
        {/* Table Controls: Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Company Vault Storage Quotas ({filteredCompanies.length} Registered)</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Manage allocated storage limits per enterprise, monitor utilization, and adjust quotas on demand
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search company or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input text-xs pl-8.5 pr-3 py-1.5 rounded-xl border-slate-200"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
              {[
                { id: 'all', label: 'All' },
                { id: 'normal', label: 'Safe (<70%)' },
                { id: 'near_limit', label: 'Warning (70-90%)' },
                { id: 'critical', label: 'Critical (>90%)' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    filterStatus === f.id
                      ? 'bg-white text-slate-900 shadow-2xs font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-extrabold text-[11px] tracking-wider">
                <th className="py-3.5 px-4 min-w-[240px]">Company</th>
                <th className="py-3.5 px-4 min-w-[150px]">Plan Tier</th>
                <th className="py-3.5 px-4 min-w-[180px]">Allocated Quota</th>
                <th className="py-3.5 px-4 min-w-[200px]">Storage Used</th>
                <th className="py-3.5 px-4 text-center min-w-[100px]">Files</th>
                <th className="py-3.5 px-4 text-center min-w-[120px]">Vault Status</th>
                <th className="py-3.5 px-4 text-right min-w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <HardDrive className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold text-xs">No companies match your search or filter</p>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map(comp => {
                  const logoUrl = comp.logo || comp.logo_url || comp.company_logo;
                  const pct = comp.used_percentage || 0;

                  return (
                    <tr key={comp.id} className="hover:bg-slate-50/80 transition-all">
                      
                      {/* 1. Company Name & Code */}
                      <td className="py-4 px-4 min-w-[240px]">
                        <div className="flex items-center gap-3">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={comp.name}
                              className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 p-1 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs font-outfit uppercase">
                              {(comp.name || 'CO').slice(0, 2)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-extrabold text-slate-900 text-xs leading-snug truncate" title={comp.name}>
                              {comp.name}
                            </div>
                            <div className="text-slate-400 text-[10px] font-mono mt-0.5 flex items-center gap-1.5">
                              <span className="badge badge-purple text-[8.5px] font-bold px-1 py-0.2">{comp.code || comp.id}</span>
                              <span>•</span>
                              <span className="truncate">{comp.contactPerson || comp.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Subscribed Plan Tier */}
                      <td className="py-4 px-4 min-w-[150px]">
                        <div className="font-bold text-slate-800 text-xs truncate" title={comp.plan}>
                          {comp.plan || 'Standard Tier'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Quota: {comp.maxLimit || 100} candidates
                        </div>
                      </td>

                      {/* 3. Allocated Cloud Quota */}
                      <td className="py-4 px-4 min-w-[180px]">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-black text-slate-900 text-xs font-mono flex items-center gap-1">
                            <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{comp.allocated_gb} GB</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(comp)}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1"
                            title="Adjust Allocated Storage Quota"
                          >
                            <Edit className="w-2.5 h-2.5" />
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Dedicated isolated vault
                        </div>
                      </td>

                      {/* 4. Storage Used & Utilization Bar */}
                      <td className="py-4 px-4 min-w-[200px]">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              pct >= 90
                                ? 'bg-rose-500'
                                : pct >= 70
                                ? 'bg-amber-500'
                                : 'bg-indigo-600'
                            }`}
                            style={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span>
                            {comp.used_mb < 1024 
                              ? `${comp.used_mb} MB` 
                              : `${comp.used_gb} GB`} used
                          </span>
                          <span className={`font-mono font-bold ${pct >= 90 ? 'text-rose-600 font-black' : pct >= 70 ? 'text-amber-600' : 'text-slate-700'}`}>
                            {pct}%
                          </span>
                        </div>
                      </td>

                      {/* 5. Files Count */}
                      <td className="py-4 px-4 text-center min-w-[100px]">
                        <span className="font-mono font-bold text-slate-800 text-xs">
                          {comp.file_count || 0}
                        </span>
                      </td>

                      {/* 6. Vault Status Badge */}
                      <td className="py-4 px-4 text-center min-w-[120px]">
                        {comp.status === 'Critical' ? (
                          <span className="badge badge-rose text-[9px] font-black py-0.5 px-2 border border-rose-300">
                            🔴 CRITICAL ({pct}%)
                          </span>
                        ) : comp.status === 'Near Limit' ? (
                          <span className="badge badge-amber text-[9px] font-black py-0.5 px-2 border border-amber-300">
                            🟡 NEAR LIMIT ({pct}%)
                          </span>
                        ) : (
                          <span className="badge badge-emerald text-[9px] font-black py-0.5 px-2 border border-emerald-300">
                            🟢 HEALTHY ({pct}%)
                          </span>
                        )}
                      </td>

                      {/* 7. Action Button */}
                      <td className="py-4 px-4 text-right min-w-[140px]">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(comp)}
                            className="btn btn-secondary text-[11px] py-1 px-2.5 font-bold text-indigo-700 hover:bg-indigo-50 border-indigo-200 cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <Sliders className="w-3 h-3 text-indigo-600" />
                            <span>Provision Quota</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 5. Edit Company Storage Quota Modal */}
      {editingCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Provision Storage Quota</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{editingCompany.name} ({editingCompany.code})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCompany(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuota} className="space-y-4">
              
              {/* Current Usage Status */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Current Consumption:</span>
                  <strong className="text-slate-900 font-mono">
                    {editingCompany.used_mb < 1024 
                      ? `${editingCompany.used_mb} MB` 
                      : `${editingCompany.used_gb} GB`}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Current Quota:</span>
                  <strong className="text-indigo-600 font-mono">{editingCompany.allocated_gb} GB</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Current Utilization:</span>
                  <strong className="text-slate-900 font-mono">{editingCompany.used_percentage}%</strong>
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold text-xs">Select Cloud Vault Quota Preset</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[10, 25, 50, 100, 500].map(gb => (
                    <button
                      key={gb}
                      type="button"
                      onClick={() => setNewQuotaGb(gb)}
                      className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        newQuotaGb === gb
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs scale-102'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {gb} GB
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold text-xs">Or Enter Custom GB Quota</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={newQuotaGb}
                    onChange={(e) => setNewQuotaGb(Math.max(1, parseFloat(e.target.value) || 25))}
                    className="form-input text-xs font-mono font-bold pl-3 pr-12"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">GB</span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Isolated cloud vault disk space provisioned exclusively for this tenant.
                </span>
              </div>

              {/* Calculated New Utilization Preview */}
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs flex items-center justify-between">
                <span className="text-indigo-900 font-medium">Projected Utilization:</span>
                <span className="font-mono font-black text-indigo-700">
                  {roundNum((editingCompany.used_mb / (newQuotaGb * 1024)) * 100, 2)}%
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCompany(null)}
                  className="btn btn-secondary text-xs font-bold py-2 px-3 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingQuota}
                  className="btn btn-superadmin text-xs font-black py-2 px-4 shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingQuota ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Quota Allocation</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
