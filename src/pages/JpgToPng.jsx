import React, { useEffect, useRef, useState } from 'react';

const API_KEY = 'bqrqv7pk0Cm0HTkQLwtnpVfrOr9KUxL4';
const API_URL = `https://v2.convertapi.com/convert/jpg/to/png?Secret=${API_KEY}`;

const JpgToPng = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const fileInputRef = useRef(null);
  const objectUrlsRef = useRef(new Set());

  const revokeAll = () => {
    objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    objectUrlsRef.current.clear();
  };

  useEffect(() => {
    return () => revokeAll();
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

  const addFiles = (files) => {
    const next = Array.from(files)
      .filter((f) => /\.(jpg|jpeg)$/i.test(f.name))
      .map((f) => ({ file: f, id: Math.random().toString(36).substr(2, 9) }));
    setSelectedFiles((prev) => [...prev, ...next]);
    if (next.length) setError(null);
  };

  const removeFile = (id) => setSelectedFiles((prev) => prev.filter((x) => x.id !== id));

  const handleConvert = async () => {
    if (!selectedFiles.length || isConverting) return;
    setError(null);
    revokeAll();
    setGeneratedImages([]);
    setIsConverting(true);
    setProgress(0);

    const out = [];
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const item = selectedFiles[i];
        const b64 = await readB64(item.file);
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Parameters: [{ Name: 'File', FileValue: { Name: item.file.name, Data: b64 } }],
          }),
          cache: 'no-store',
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(`[${item.file.name}] ${errData?.Message || res.status}`);
        }
        const data = await res.json();
        if (data.Files?.length) {
          for (const f of data.Files) {
            const blob = await b64ToBlob(f.FileData);
            const url = URL.createObjectURL(blob);
            objectUrlsRef.current.add(url);
            out.push({ name: f.FileName, url });
          }
        }
        setProgress(((i + 1) / selectedFiles.length) * 100);
      }
      setGeneratedImages(out);
    } catch (e) {
      setError(e.message || 'The cloud bridge encountered a synchronization error.');
    } finally {
      setIsConverting(false);
    }
  };

  const downloadImage = (url, name) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    generatedImages.forEach((img, i) => {
      setTimeout(() => downloadImage(img.url, img.name), i * 400);
    });
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">JPG to PNG</h1>
          <p className="text-[#1E2A5E]/60 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Lossless format upgrade. Convert JPG photos into high-quality PNG files with full alpha channel support.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-10 sm:p-14 bg-gray-50/30">
              <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-8 leading-none">Step 1: Resource Loading</label>
              <div
                className={`border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-14 cursor-pointer transition-all bg-white hover:border-[#4F6EF7] hover:bg-blue-50/20 group ${
                  isDropActive ? 'border-[#4F6EF7]' : 'border-gray-200'
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
                  addFiles(e.dataTransfer.files);
                }}
              >
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-6 shadow-lg transition-transform group-hover:scale-105 bg-gradient-to-br from-[#1E2A5E] to-[#3B5BDB]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-[#1E2A5E] font-black text-lg italic mb-1">Select JPG Files</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1 leading-none">Multi-File · Drag & Drop</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = '';
                  }}
                />
              </div>
              <div className="mt-12 space-y-6 pt-10 border-t border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wide leading-relaxed">Alpha Channel Unlock</p>
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
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wide leading-relaxed">High-Fidelity lossless Output</p>
                </div>
              </div>
            </div>

            <div className="p-10 sm:p-14 bg-white">
              <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-8 leading-none">Step 2: Synthesis Management</label>
              {selectedFiles.length === 0 ? (
                <div className="text-center py-20 opacity-20">
                  <p className="text-[#1E2A5E] font-black uppercase text-[10px] tracking-[5px]">Waiting for Images</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar-jpgpng">
                  {selectedFiles.map((item) => (
                    <div key={item.id} className="img-card bg-gray-50/50 border border-gray-100 rounded-3xl p-5 flex items-center gap-5 group">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] font-black text-[9px] uppercase tracking-tighter shrink-0 text-[#1E2A5E]">
                        JPG
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[#1E2A5E] font-bold text-xs truncate uppercase tracking-widest">{item.file.name}</p>
                        <p className="text-gray-400 text-[10px] font-black uppercase mt-1 tracking-widest">{fmt(item.file.size)}</p>
                      </div>
                      <button type="button" onClick={() => removeFile(item.id)} className="text-gray-300 hover:text-red-400 p-2 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-10 pt-8 border-t border-gray-50">
                <button
                  type="button"
                  disabled={!selectedFiles.length || isConverting}
                  onClick={handleConvert}
                  className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg,#4F6EF7,#7C3AED)',
                    boxShadow: '0 10px 30px -5px rgba(79,110,247,0.4)',
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
                  <p className="text-[#1E2A5E] font-extrabold text-sm uppercase tracking-[5px]">PARSING IMAGE NODES...</p>
                  <p className="text-gray-400 text-[10px] mt-2 uppercase font-bold tracking-widest leading-none">
                    Mapping JPG Raster Bits to Lossless PNG Buffers
                  </p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-10 max-w-sm mx-auto">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-[#4F6EF7] via-[#7C3AED] to-[#4F6EF7] bg-[length:400px_100%] animate-pulse"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {generatedImages.length > 0 && (
            <div className="p-10 sm:p-14 bg-white border-t border-gray-100 text-left">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[#1E2A5E] font-black text-2xl uppercase tracking-tight leading-none">Synthesis Ready!</p>
                  <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-widest opacity-60">High-Fidelity PNG Assets Generated</p>
                </div>
                <button
                  type="button"
                  onClick={downloadAll}
                  className="text-[10px] font-black uppercase text-[#4F6EF7] tracking-[3px] border-b-2 border-[#4F6EF7] hover:opacity-70 transition-opacity"
                >
                  Batch Download
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                {generatedImages.map((img) => (
                  <div key={img.url} className="img-card bg-gray-50/50 border border-gray-100 rounded-2xl overflow-hidden group">
                    <div className="aspect-[3/2] overflow-hidden relative jpgpng-transparent-bg">
                      <img src={img.url} alt="" className="w-full h-full object-contain p-3" />
                      <div className="absolute inset-0 bg-[#1E2A5E]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => downloadImage(img.url, img.name)}
                          className="p-4 bg-white text-[#4F6EF7] rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
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
              <div className="flex-1 text-red-900">
                <p className="font-extrabold text-lg uppercase tracking-tight leading-none">Fault Detected</p>
                <p className="font-bold text-[10px] mt-2 uppercase tracking-widest opacity-70">{error}</p>
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
            { t: 'Elite PNG Engine', d: 'Global cloud nodes ensure your JPG photos are synthesized into lossless, high-density PNG assets in seconds.' },
            { t: 'Sequential Processing', d: 'Upload multiple JPG files at once. Our sequential cloud engine processes each file with maximum stability.' },
            { t: 'Secure Asset Stream', d: 'TLS 1.3 encryption ensures your image files are isolated and purged immediately post-synthesis.' },
          ].map((x) => (
            <div key={x.t} className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50">
              <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" />
                </svg>
              </div>
              <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">{x.t}</h3>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-widest leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar-jpgpng::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-jpgpng::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar-jpgpng::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar-jpgpng::-webkit-scrollbar-thumb:hover { background: #4F6EF7; }
        .jpgpng-transparent-bg {
          background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `,
        }}
      />
    </div>
  );
};

export default JpgToPng;
