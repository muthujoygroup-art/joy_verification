import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomReportBuilderModal } from './CustomReportBuilderModal';
import { 
  FolderDown, 
  Search, 
  FileText, 
  Download, 
  ShieldCheck, 
  FileCheck, 
  FileSpreadsheet, 
  FileImage, 
  KeyRound, 
  Smartphone, 
  Building2, 
  User, 
  CheckCircle2, 
  X,
  Filter,
  Eye,
  Calendar,
  Lock,
  Layers,
  Sparkles,
  Sliders
} from 'lucide-react';

export const DocumentStorageHub = () => {
  const { candidates, companies, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'identity' | 'education' | 'financial' | 'biometrics' | 'certificates'
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showCustomBuilderModal, setShowCustomBuilderModal] = useState(false);

  // Generate complete document storage vault items from candidates
  const allStoredDocuments = candidates.flatMap(cand => {
    const comp = companies.find(c => c.id === cand.companyId) || { name: 'Acme Global' };
    const dateStr = cand.verificationDate || '2026-08-20 12:30';

    return [
      {
        id: `doc_cert_${cand.id}`,
        title: `Official Verification Certificate - ${cand.name}`,
        candidateName: cand.name,
        empId: cand.empId,
        companyName: comp.name,
        companyId: cand.companyId,
        category: 'certificates',
        categoryLabel: 'System Certificate',
        fileType: 'PDF Document',
        fileExt: '.pdf',
        fileSize: '245 KB',
        uploadDate: dateStr,
        status: cand.status === 'Verified' ? 'Verified ✅' : 'Pending 🟡',
        securityLevel: 'Encrypted & Certified',
        downloadAction: () => downloadDoc(`Certificate_${cand.name.replace(/\s+/g, '_')}.pdf`, `
JOY DATA VERIFICATION - OFFICIAL CERTIFICATE
Ref Token: ${cand.token}
Employee Name: ${cand.name} (${cand.empId})
Designation: ${cand.designation}
Status: VERIFIED & COMPLIANT ✓
Verified Date: ${dateStr}
`, 'application/pdf')
      },
      {
        id: `doc_aadhaar_${cand.id}`,
        title: `Aadhaar UIDAI Govt Proof - ${cand.name}`,
        candidateName: cand.name,
        empId: cand.empId,
        companyName: comp.name,
        companyId: cand.companyId,
        category: 'identity',
        categoryLabel: 'Identity Proof',
        fileType: 'Word Transcript',
        fileExt: '.docx',
        fileSize: '180 KB',
        uploadDate: dateStr,
        status: cand.verificationsCompleted.aadhaar ? 'Verified ✅' : 'Pending 🟡',
        securityLevel: 'Government DigiLocker',
        downloadAction: () => downloadDoc(`Aadhaar_Proof_${cand.name.replace(/\s+/g, '_')}.docx`, `
Aadhaar UIDAI Identity Receipt
Candidate: ${cand.name}
Aadhaar Number: ${cand.aadhaarNo}
Status: VERIFIED_DIGILOCKER_PASSED
Date: ${dateStr}
`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      },
      {
        id: `doc_excel_${cand.id}`,
        title: `Audit Ledger Data Sheet - ${cand.name}`,
        candidateName: cand.name,
        empId: cand.empId,
        companyName: comp.name,
        companyId: cand.companyId,
        category: 'financial',
        categoryLabel: 'Audit Ledger',
        fileType: 'Excel Spreadsheet',
        fileExt: '.csv',
        fileSize: '42 KB',
        uploadDate: dateStr,
        status: 'Verified ✅',
        securityLevel: 'Enterprise Restricted',
        downloadAction: () => downloadDoc(`Audit_Ledger_${cand.name.replace(/\s+/g, '_')}.csv`, `Candidate Name,Employee ID,Company,Aadhaar Status,Mobile Status,Face Status,Final Status\n"${cand.name}","${cand.empId}","${comp.name}","Passed","Passed","Passed","${cand.status}"\n`, 'text/csv')
      },
      {
        id: `doc_face_${cand.id}`,
        title: `AI WebCam Liveness Snapshots - ${cand.name}`,
        candidateName: cand.name,
        empId: cand.empId,
        companyName: comp.name,
        companyId: cand.companyId,
        category: 'biometrics',
        categoryLabel: 'Biometric Snapshots',
        fileType: 'PNG Image Bundle',
        fileExt: '.png',
        fileSize: '1.2 MB',
        uploadDate: dateStr,
        status: cand.verificationsCompleted.face ? 'Verified ✅' : 'Pending 🟡',
        securityLevel: 'Biometric Encrypted',
        downloadAction: () => downloadDoc(`Biometrics_${cand.name.replace(/\s+/g, '_')}.png`, cand.faceImages?.straight || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300', 'image/png')
      }
    ];
  });

  const downloadDoc = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded document "${filename}"!`);
  };

  const filteredDocuments = allStoredDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.empId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesCompany = selectedCompanyFilter === 'all' || doc.companyId === selectedCompanyFilter;
    return matchesSearch && matchesCategory && matchesCompany;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900">
      
      {/* Top Header & Search Bar */}
      <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald">Enterprise Storage Vault</span>
              <span className="text-xs text-slate-500 font-bold">• {filteredDocuments.length} Documents Managed</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Document Storage Management System (DMS)</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Centralized vault for candidate verification files, statutory proofs, and audit certificates.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowCustomBuilderModal(true)}
              className="btn btn-superadmin text-xs py-2 px-3.5 flex items-center gap-2 font-bold shadow-md"
              title="Build Custom Filtered Report"
            >
              <Sliders className="w-4 h-4" />
              <span>Custom Multi-Filter Exporter 🛠️</span>
            </button>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                placeholder="Search documents by candidate name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-9 text-xs shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Category & Company Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Category Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto font-bold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Files ({allStoredDocuments.length})
            </button>
            <button
              onClick={() => setSelectedCategory('certificates')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'certificates' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📄 Certificates
            </button>
            <button
              onClick={() => setSelectedCategory('identity')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'identity' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛡️ Identity Proofs
            </button>
            <button
              onClick={() => setSelectedCategory('biometrics')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'biometrics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🖼️ Biometric Photos
            </button>
            <button
              onClick={() => setSelectedCategory('financial')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'financial' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Audit Ledgers
            </button>
          </div>

          {/* Company Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Company:</span>
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="form-select bg-slate-50 border-slate-300 text-slate-900 text-xs font-bold w-auto"
            >
              <option value="all">All Client Companies</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Document Grid / Table View */}
      <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <FolderDown className="w-5 h-5 text-indigo-600" />
            <span>Stored Document Vault Registry</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">Showing {filteredDocuments.length} files</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold">
                <th className="py-3 px-4">Document Title & Type</th>
                <th className="py-3 px-4">Candidate & Company</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Date & Size</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredDocuments.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors font-medium">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 font-bold shrink-0">
                        {doc.fileExt === '.pdf' && <FileCheck className="w-5 h-5" />}
                        {doc.fileExt === '.csv' && <FileSpreadsheet className="w-5 h-5" />}
                        {doc.fileExt === '.docx' && <FileText className="w-5 h-5" />}
                        {doc.fileExt === '.png' && <FileImage className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{doc.title}</div>
                        <div className="text-[11px] text-slate-500">{doc.categoryLabel} • {doc.securityLevel}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{doc.candidateName}</div>
                    <div className="text-[11px] text-slate-500">ID #{doc.empId} • {doc.companyName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="badge badge-purple text-[10px] font-bold">{doc.fileType}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="badge badge-emerald text-[10px] font-bold">{doc.status}</span>
                  </td>
                  <td className="py-4 px-4 text-center text-slate-500 text-[11px]">
                    <div>{doc.uploadDate}</div>
                    <div className="font-mono font-bold text-slate-700">{doc.fileSize}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewDocument(doc)}
                        className="btn btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1 font-bold"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={doc.downloadAction}
                        className="btn btn-superadmin text-xs px-2.5 py-1.5 flex items-center gap-1 font-bold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Quick Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 space-y-4 border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold">{previewDocument.title}</h3>
              </div>
              <button onClick={() => setPreviewDocument(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Candidate:</span>
                <span className="font-bold text-slate-900">{previewDocument.candidateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Employee Code:</span>
                <span className="font-mono text-slate-900">{previewDocument.empId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Company Account:</span>
                <span className="font-bold text-slate-900">{previewDocument.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Document Format:</span>
                <span className="badge badge-purple text-[10px]">{previewDocument.fileType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">File Size:</span>
                <span className="font-mono font-bold text-slate-700">{previewDocument.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Security & Encryption:</span>
                <span className="text-emerald-700 font-bold">256-Bit SSL Certified ✅</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setPreviewDocument(null)} className="btn btn-secondary text-xs font-bold">Close Preview</button>
              <button onClick={() => { previewDocument.downloadAction(); setPreviewDocument(null); }} className="btn btn-superadmin text-xs font-bold flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Report Builder Modal */}
      {showCustomBuilderModal && (
        <CustomReportBuilderModal onClose={() => setShowCustomBuilderModal(false)} />
      )}

    </div>
  );
};
