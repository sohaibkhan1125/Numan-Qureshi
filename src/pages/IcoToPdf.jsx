import React, { useState, useRef } from 'react';
import { convertIcoToPdf } from '../services/api';

const IcoToPdf = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);
  const resultRef = useRef(null);
  const progressRef = useRef(null);

  const formatBytes = (b) => {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(2) + ' MB';
  };

  const b64ToBlob = (b64, mime) => {
    const bytes = atob(b64);
    const chunks = [];
    for (let i = 0; i < bytes.length; i += 512) {
      chunks.push(new Uint8Array([...bytes.slice(i, i + 512)].map(c => c.charCodeAt(0))));
    }
    return new Blob(chunks, { type: mime });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    if (!file.name.toLowerCase().endsWith('.ico')) {
      alert('Please select an ICO file.');
      return;
    }

    const MAX_SIZE = 50 * 1024 * 1024; // 50MB limit
    if (file.size > MAX_SIZE) {
      alert('File is too large. Please select an ICO smaller than 50MB.');
      return;
    }

    setSelectedFile(file);
    setStatus('idle');
    setResult(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setStatus('idle');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setStatus('processing');
    setProgress(0);
    setErrorMsg('');

    setTimeout(() => {
      if (progressRef.current) {
        progressRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);

    let pct = 0;
    const progressTimer = setInterval(() => {
      pct += Math.random() * 5;
      if (pct < 95) setProgress(pct);
    }, 300);

    try {
      const fileResult = await convertIcoToPdf(selectedFile);
      const blob = b64ToBlob(fileResult.FileData, 'application/pdf');

      clearInterval(progressTimer);
      setProgress(100);

      setTimeout(() => {
        setResult({
          blob,
          originalSize: selectedFile.size,
          resultSize: blob.size,
          downloadUrl: URL.createObjectURL(blob),
          filename: fileResult.FileName || selectedFile.name.replace('.ico', '.pdf')
        });
        setStatus('success');
        
        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }, 500);

    } catch (err) {
      clearInterval(progressTimer);
      setErrorMsg(err.message || 'An error occurred during conversion.');
      setStatus('error');
    }
  };

  return (
    <div className="bg-[#f8fafc]/50 min-h-screen font-sans text-left pb-20">
      <style>{`
        @keyframes pulse-border {
          0%, 100% { border-color: #4F6EF7; }
          50% { border-color: #7C3AED; }
        }
        .drag-active { animation: pulse-border 1.2s ease-in-out infinite; border-style: solid !important; }

        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .shimmer-active {
          background: linear-gradient(90deg, #4F6EF7 25%, #7C3AED 50%, #4F6EF7 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
        }

        .ico-badge-gradient { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .pdf-badge-gradient { background: linear-gradient(135deg, #4F6EF7, #7C3AED); }
      `}</style>
      
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 text-center">
        
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E2A5E] mb-3 tracking-tight">ICO to PDF</h1>
          <p className="text-slate-500 text-base md:text-lg font-medium opacity-80">Convert your ICO icons to PDF format instantly</p>
        </header>

        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 sm:p-14 border border-slate-100 transition-all duration-500 shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)]">
          
          {!selectedFile && (
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed border-slate-200 rounded-2xl md:rounded-3xl p-8 md:p-14 flex flex-col items-center justify-center gap-4 md:gap-6 cursor-pointer transition-all duration-300 group ${dragActive ? 'drag-active bg-blue-50/30 border-[#4F6EF7]' : 'hover:border-[#4F6EF7] hover:bg-blue-50/30'}`}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl ico-badge-gradient flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-[#1E2A5E] font-bold text-xl mb-2">Drag & drop ICO file here</p>
                <p className="text-slate-400 font-medium">or <span className="text-[#4F6EF7] font-semibold">click to browse</span></p>
              </div>
              <input ref={fileInputRef} type="file" accept=".ico" className="hidden" onChange={handleFileChange} />
            </div>
          )}

          {selectedFile && (
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between transition-all duration-500">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl ico-badge-gradient flex items-center justify-center text-white text-[10px] font-bold shadow-sm">ICO</div>
                <div className="text-left">
                  <p className="text-[#1E2A5E] font-bold text-base truncate max-w-[150px] sm:max-w-md">{selectedFile.name}</p>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">{formatBytes(selectedFile.size)}</p>
                </div>
              </div>
              <button 
                onClick={removeFile} 
                disabled={status === 'processing'}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </button>
            </div>
          )}

          <div className="mt-14">
            <button 
              disabled={!selectedFile || status === 'processing'} 
              onClick={handleConvert}
              className="w-full py-5 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)', boxShadow: '0 10px 30px -5px rgba(79, 110, 247, 0.4)' }}
            >
              Convert to PDF
            </button>
          </div>

          {status === 'processing' && (
            <div ref={progressRef} className="mt-10 p-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-center transition-all duration-500">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-6 h-6 animate-spin rounded-full border-2" style={{ borderColor: '#E2E8F0', borderTopColor: '#4F6EF7' }}></div>
                <p className="text-[#1E2A5E] font-extrabold text-sm tracking-widest uppercase">CONVERTING TO PDF...</p>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full shimmer-active rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {status === 'success' && result && (
            <div ref={resultRef} className="mt-10 bg-[#f0fdf4] border border-[#dcfce7] rounded-[2rem] p-10 space-y-8 overflow-hidden transition-all duration-500">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#10b981] rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[#14532d] font-extrabold text-2xl">Converted!</p>
                    <p className="text-[#15803d] text-sm font-bold mt-0.5 tracking-tight">Your PDF is ready for download.</p>
                  </div>
                </div>
                <a href={result.downloadUrl} download={result.filename}
                   className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 rounded-2xl font-extrabold text-white transition-all shadow-lg hover:brightness-110"
                   style={{ background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)' }}>
                   Download PDF
                </a>
              </div>
              
              <div className="grid grid-cols-2 gap-px bg-[#bbf7d0] overflow-hidden rounded-2xl outline outline-1 outline-[#bbf7d0]">
                <div className="bg-white/40 p-5 backdrop-blur-sm">
                  <p className="text-[10px] text-[#15803d] font-extrabold uppercase tracking-widest opacity-60 mb-1 leading-none">ICO Size</p>
                  <p className="text-[#14532d] font-extrabold text-lg leading-none">{formatBytes(result.originalSize)}</p>
                </div>
                <div className="bg-white/40 p-5 backdrop-blur-sm">
                   <p className="text-[10px] text-[#15803d] font-extrabold uppercase tracking-widest opacity-60 mb-1 leading-none">PDF Size</p>
                   <p className="text-[#14532d] font-extrabold text-lg leading-none">{formatBytes(result.resultSize)}</p>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-10 bg-[#fef2f2] border border-[#fee2e2] rounded-3xl p-8 flex items-start gap-3 transition-all duration-500">
              <svg className="w-6 h-6 text-[#ef4444] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              <div className="text-left">
                <p className="text-[#7f1d1d] font-extrabold text-lg leading-none mb-1">Conversion Error</p>
                <p className="text-[#b91c1c] font-medium text-xs">{errorMsg}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default IcoToPdf;
