import React, { useState, useRef } from 'react';
import { convertMsgToPdf } from '../services/api';

const MsgToPdf = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultFile, setResultFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const progressRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    if (!file.name.toLowerCase().endsWith('.msg')) {
      setErrorMsg('Please upload a valid .msg file.');
      setStatus('error');
      return;
    }
    setSelectedFile(file);
    setStatus('idle');
    setErrorMsg('');
  };

  const b64ToBlob = (b64, mime) => {
    const byteCharacters = atob(b64);
    const byteArrays = [];
    const sliceSize = 512;

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mime });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setStatus('processing');
    setProgress(0);
    setErrorMsg('');

    // Smooth progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 5;
      });
    }, 200);

    try {
      const fileResult = await convertMsgToPdf(selectedFile);
      
      clearInterval(interval);
      setProgress(100);
      
      const blob = b64ToBlob(fileResult.FileData, 'application/pdf');
      const url = URL.createObjectURL(blob);
      
      setResultFile({
        url,
        name: fileResult.FileName,
        size: (blob.size / 1024).toFixed(2) + ' KB'
      });
      
      setStatus('success');
    } catch (error) {
      clearInterval(interval);
      console.error(error);
      setErrorMsg(error.message || 'An error occurred during conversion.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (resultFile) {
      const link = document.createElement('a');
      link.href = resultFile.url;
      link.download = resultFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setResultFile(null);
    setStatus('idle');
    setProgress(0);
    setErrorMsg('');
  };

  return (
    <div className="bg-slate-50/10 min-h-screen py-20 px-4">
      <style>{`
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(59, 130, 246, 0.5); }
          50% { border-color: rgba(59, 130, 246, 1); }
        }
        .drag-active {
          animation: pulse-border 2s infinite;
          background-color: rgba(59, 130, 246, 0.05);
        }
        .shimmer-active {
          background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">
            MSG to <span className="text-[#3b82f6]">PDF</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Convert your Outlook MSG files to professional PDF documents instantly.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100">
          {status === 'idle' || status === 'error' ? (
            <div className="space-y-8">
              {!selectedFile ? (
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center cursor-pointer transition-all duration-300 group ${dragActive ? 'drag-active bg-blue-50/30 border-[#3b82f6]' : 'hover:border-[#3b82f6] hover:bg-blue-50/30'}`}
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="text-[#3b82f6]" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M12 18v-6m-3 3l3-3 3 3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Upload MSG File</h3>
                  <p className="text-slate-400 font-medium">Drag and drop your file here or click to browse</p>
                  <input ref={fileInputRef} type="file" accept=".msg" className="hidden" onChange={handleFileChange} />
                </div>
              ) : (
                <div className="flex items-center justify-between p-6 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in fade-in zoom-in duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#3b82f6] shadow-sm">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 line-clamp-1">{selectedFile.name}</h4>
                      <p className="text-sm text-slate-500 font-medium">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in slide-in-from-top-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errorMsg}
                </div>
              )}

              <button 
                disabled={!selectedFile || status === 'processing'}
                onClick={handleConvert}
                className="w-full bg-[#3b82f6] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none tracking-tight"
              >
                Convert to PDF
              </button>
            </div>
          ) : status === 'processing' ? (
            <div ref={progressRef} className="py-12 text-center space-y-8 animate-in fade-in duration-500">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#3b82f6] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-[#3b82f6]">
                  {progress}%
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-800">Converting MSG...</h3>
                <p className="text-slate-500 font-medium">Please wait while we process your file.</p>
              </div>
              <div className="max-w-md mx-auto h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full shimmer-active rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in zoom-in fade-in duration-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-[#22c55e]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-2">Conversion Ready!</h3>
                <p className="text-slate-500 font-medium">Your file has been successfully converted to PDF.</p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center justify-between group hover:border-[#3b82f6] transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#ff4f4f] shadow-sm border border-slate-50">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l3-3 3 3M12 12v6"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 line-clamp-1">{resultFile?.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-100 text-slate-400 font-bold uppercase tracking-wider">PDF</span>
                      <span className="text-xs text-slate-400 font-bold">{resultFile?.size}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleDownload}
                  className="bg-slate-800 text-white p-4 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleDownload}
                  className="bg-[#3b82f6] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-[0.98] tracking-tight"
                >
                  Download PDF
                </button>
                <button 
                  onClick={reset}
                  className="bg-slate-50 text-slate-600 py-5 rounded-2xl font-black text-lg border border-slate-200 hover:bg-slate-100 transition-all active:scale-[0.98]"
                >
                  Convert Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#3b82f6] mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Secure & Private</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Your MSG files are processed securely and deleted from our servers immediately after conversion.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#22c55e] mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Lightning Fast</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Our advanced conversion engine transforms MSGs to PDFs in seconds without quality loss.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-[#8b5cf6] mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Preserves Content</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Retains all formatting, email headers, and attachments correctly in the final PDF file.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MsgToPdf;
