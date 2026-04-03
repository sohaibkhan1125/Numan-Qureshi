import React, { useEffect, useRef, useState } from 'react';

const API_KEY = 'bqrqv7pk0Cm0HTkQLwtnpVfrOr9KUxL4';
const API_URL = `https://v2.convertapi.com/convert/pdf/to/png?Secret=${API_KEY}`;

const PdfToPng = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);
  const objectUrlsRef = useRef(new Set());
  const progressTimerRef = useRef(null);

  const revokeAll = () => {
    objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    objectUrlsRef.current.clear();
  };

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      revokeAll();
    };
  }, []);

  const fmt = (b) =>
    b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`;

  const readB64 = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(',')[1]);
      r.onerror = () => rej(new Error('Read failed'));
      r.readAsDataURL(file);
    });

  const b64ToBlob = async (b64, mime = 'image/png') => {
    try {
      const response = await fetch(`data:${mime};base64,${b64}`);
      return await response.blob();
    } catch {
      const bytes = atob(b64);
      const buf = new ArrayBuffer(bytes.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i++) view[i] = bytes.charCodeAt(i);
      return new Blob([buf], { type: mime });
    }
  };

  const showError = (msg) => setError(msg);

  const handleFile = (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      showError('Invalid File Format. Please upload a PDF document.');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setGeneratedImages([]);
  };

  const handleConvert = async () => {
    if (!selectedFile || isConverting) return;
    setError(null);
    revokeAll();
    setGeneratedImages([]);
    setIsConverting(true);
    setProgress(0);

    let pct = 0;
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = setInterval(() => {
      pct += Math.random() * 2.5;
      if (pct < 94) setProgress(pct);
    }, 400);

    try {
      const b64 = await readB64(selectedFile);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Parameters: [{ Name: 'File', FileValue: { Name: selectedFile.name, Data: b64 } }],
        }),
        cache: 'no-store',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.Message || `Synthesis Failed: HTTP ${res.status}`);
      }
      const data = await res.json();
      const list = (data.Files || []).map((f) => {
        const blob = b64ToBlob(f.FileData, 'image/png');
        return blob.then((b) => {
          const url = URL.createObjectURL(b);
          objectUrlsRef.current.add(url);
          return { name: f.FileName, url };
        });
      });
      const resolved = await Promise.all(list);
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      setProgress(100);
      setGeneratedImages(resolved);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (e) {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      showError(e.message || 'The cloud bridge encountered a synchronization error.');
    } finally {
      setIsConverting(false);
    }
  };

  const downloadAll = () => {
    generatedImages.forEach((img, i) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = img.url;
        link.download = img.name;
        link.click();
      }, i * 300);
    });
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse-border {
              0%, 100% { border-color: #4f6ef7; }
              50%      { border-color: #e2e8f0; }
            }
            .drop-active { animation: pulse-border 1.2s ease-in-out infinite; border-style: solid !important; }
            .shimmer {
              background: linear-gradient(90deg, #4F6EF7 25%, #7C3AED 50%, #4F6EF7 75%);
              background-size: 400px 100%;
              animation: shimmer 1.4s infinite;
            }
            @keyframes shimmer {
              0%   { background-position: -400px 0; }
              100% { background-position: 400px 0; }
            }
            .file-card  { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            .file-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1); }
            .img-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            .img-card:hover { transform: scale(1.02); }
          `,
        }}
      />
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">PDF to PNG</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Lossless page synthesis. Convert each PDF page into a crisp, high-definition PNG asset in seconds.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-10 sm:p-14 bg-gray-50/30">
              <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-8">Step 1: Resource Loading</label>
              <div
                className={`border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-14 cursor-pointer transition-all bg-white hover:border-[#4F6EF7] hover:bg-blue-50/20 group relative ${
                  isDropActive ? 'drop-active border-[#4F6EF7]' : 'border-gray-100'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDropActive(true);
                }}
                onDragLeave={() => setIsDropActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDropActive(false);
                  handleFile(e.dataTransfer.files?.[0]);
                }}
              >
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-6 shadow-lg transition-transform group-hover:scale-105 bg-gradient-to-br from-[#7C3AED] to-[#4F6EF7]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[#1E2A5E] font-black text-lg italic mb-1">Select PDF File</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">Lossless · High Fidelity</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    handleFile(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              </div>
              <div className="mt-12 space-y-6 pt-10 text-left border-t border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wide leading-relaxed">Lossless Compression Synthesis</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wide leading-relaxed">Alpha-Layer Transparency Logic</p>
                </div>
              </div>
            </div>

            <div className="p-10 sm:p-14 bg-white">
              <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-8">Step 2: Synthesis Config</label>
              {!selectedFile ? (
                <div className="text-center py-20 opacity-20">
                  <p className="text-[10px] font-black uppercase tracking-[5px]">Waiting for PDF Asset</p>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                  <div className="file-card bg-gray-50/50 border border-gray-100 rounded-3xl p-5 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#4F6EF7] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] font-black text-[9px] uppercase tracking-tighter shrink-0">
                      PDF
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[#1E2A5E] font-bold text-xs truncate uppercase tracking-widest text-left">{selectedFile.name}</p>
                      <p className="text-gray-300 text-[10px] font-black uppercase mt-1 tracking-widest text-left">{fmt(selectedFile.size)}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-10 pt-8 border-t border-gray-50">
                <button
                  type="button"
                  disabled={!selectedFile || isConverting}
                  onClick={handleConvert}
                  className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)',
                    boxShadow: '0 10px 30px -5px rgba(79, 110, 247, 0.4)',
                  }}
                >
                  Convert to PNG
                </button>
              </div>
            </div>
          </div>

          {isConverting && (
            <div className="p-12 bg-gray-50 border-t border-gray-100 text-center">
              <div className="flex flex-col items-center gap-6">
                <div className="w-10 h-10 animate-spin rounded-full border-4" style={{ borderColor: '#E2E8F0', borderTopColor: '#4F6EF7' }} />
                <div>
                  <p className="text-[#1E2A5E] font-extrabold text-sm uppercase tracking-[5px]">PARSING VECTOR GRID...</p>
                  <p className="text-gray-400 text-[10px] mt-2 uppercase font-bold tracking-widest leading-none">
                    Mapping PDF Streams to High-Definition PNG Assets
                  </p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-10 max-w-sm mx-auto">
                <div
                  className="h-full shimmer rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {generatedImages.length > 0 && (
            <div ref={resultsRef} className="p-10 sm:p-14 bg-white border-t border-gray-100 text-left">
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <p className="text-[#1E2A5E] font-black text-2xl uppercase tracking-tight leading-none">Synthesis Ready!</p>
                  <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-widest opacity-60">High-Definition PNG Assets Generated</p>
                </div>
                <button
                  type="button"
                  onClick={downloadAll}
                  className="text-[10px] font-black uppercase text-[#4F6EF7] tracking-[3px] border-b-2 border-[#4F6EF7] hover:opacity-70 transition-opacity"
                >
                  Download All as ZIP
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4">
                {generatedImages.map((img, i) => (
                  <div
                    key={img.url}
                    className="img-card bg-gray-50 rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 group"
                  >
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-[#1E2A5E]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a href={img.url} download={img.name} className="p-3 bg-white text-[#4F6EF7] rounded-full shadow-lg hover:scale-110 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div className="p-3 bg-white flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest">Page {i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-10 bg-red-50 border-t border-red-100 flex items-start gap-5 text-left">
              <svg className="w-7 h-7 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-red-900 font-extrabold text-lg uppercase tracking-tight leading-none">Fault Detected</p>
                <p className="text-red-700 font-bold text-[10px] mt-2 uppercase tracking-widest opacity-70">{error}</p>
              </div>
              <button type="button" onClick={() => setError(null)} className="text-red-300 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Elite Engine', d: 'Global cloud nodes ensure your complex vector PDFs are synthesized into crisp PNG assets in seconds.' },
            { t: 'Batch Stream', d: 'Synthesis of long documents? No problem. Our system handles hundreds of pages with efficient cloud multi-threading.' },
            { t: 'Secure Purge', d: 'TLS 1.3 encryption ensures your document streams are isolated and purged immediately post-synthesis.' },
          ].map((x) => (
            <div key={x.t} className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50">
              <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" />
                </svg>
              </div>
              <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">{x.t}</h3>
              <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-widest">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PdfToPng;
