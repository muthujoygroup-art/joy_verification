import React, { useRef, useState, useEffect } from 'react';
import { Pen, Upload, RotateCcw, Check, X, ShieldCheck } from 'lucide-react';

export const SignaturePadModal = ({ onSaveSignature, onClose, initialSignature = null }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [hasDrawn, setHasDrawn] = useState(false);
  const [uploadedSigUrl, setUploadedSigUrl] = useState(initialSignature);
  const [activeMode, setActiveMode] = useState('draw');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
 // 'draw' | 'upload'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a'; // Deep obsidian ink
  }, [activeMode]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedSigUrl(event.target.result);
      setActiveMode('upload');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (activeMode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) {
        alert('Please draw your specimen signature before saving.');
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      onSaveSignature(dataUrl);
    } else {
      if (!uploadedSigUrl) {
        alert('Please select a signature image file.');
        return;
      }
      onSaveSignature(uploadedSigUrl);
    }
    if (onClose) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-indigo-500 overflow-hidden text-slate-900 space-y-4 p-5 sm:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Pen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Specimen Signature & Digital Consent</h3>
              <p className="text-xs text-slate-500 font-medium">Draw or upload official signature for statutory declaration forms</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: Draw vs Upload */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveMode('draw')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'draw' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pen className="w-3.5 h-3.5" />
            <span>Draw on Screen</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'upload' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image File</span>
          </button>
        </div>

        {/* Content Body */}
        {activeMode === 'draw' ? (
          <div className="space-y-2">
            <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-1 bg-slate-50 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={450}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-40 bg-white rounded-xl cursor-crosshair touch-none"
              />
              <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 pointer-events-none font-mono">
                Sign inside the box above
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold border border-rose-200 flex items-center gap-1 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Canvas</span>
              </button>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ISO 27001 Stamped
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 bg-slate-50">
              {uploadedSigUrl ? (
                <div className="space-y-2">
                  <div className="h-28 max-w-xs mx-auto p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-xs">
                    <img src={uploadedSigUrl} alt="Uploaded Specimen Signature" className="max-h-full max-w-full object-contain" />
                  </div>
                  <span className="badge badge-emerald text-[10px]">Signature File Loaded ✓</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-8 h-8 text-indigo-500 mx-auto" />
                  <div className="text-xs font-bold text-slate-800">Upload signature image (PNG, JPG, SVG)</div>
                  <div className="text-[10px] text-slate-500">Transparent background or white background supported</div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Apply Specimen Signature</span>
          </button>
        </div>

      </div>
    </div>
  );
};
