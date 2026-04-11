import React, { useEffect, useRef, useState, useMemo } from 'react';

const RemoveBackground = () => {
  // ── STATE ──────────────────────────────────────────
  const [selectedFiles, setSelectedFiles] = useState([]); // { file, id }
  const [generatedAssets, setGeneratedAssets] = useState([]); // { name, url, size }
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDropActive, setIsDropActive] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const resultsSectionRef = useRef(null);

  // ── REMOVE.BG API KEY ──────────────────────────────
  const API_KEY = 'cbWpRdG9FmnxqrPgGUdXzP22';

  // ── HELPERS ────────────────────────────────────────
  const fmtSize = (b) => (b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB');

  const getTypeBadge = (file) => {
    const mime = file?.type || '';
    if (mime.includes('/')) return mime.split('/')[1].replace('jpeg', 'jpg');
    const ext = (file?.name || '').split('.').pop()?.toLowerCase();
    return ext ? ext : 'img';
  };

  const downloadAsset = (url, name) => {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
    } catch (err) {
      console.error('Download failed:', err);
      window.open(url, '_blank');
    }
  };

  const downloadAll = () => {
    generatedAssets.forEach((img, i) => {
      setTimeout(() => downloadAsset(img.url, img.name), i * 300);
    });
  };

  // Revoke blob URLs when component unmounts.
  useEffect(() => {
    return () => {
      generatedAssets.forEach((a) => {
        try {
          URL.revokeObjectURL(a.url);
        } catch (_) {
          // noop
        }
      });
      selectedFiles.forEach((f) => {
        try {
          if (f.preview) URL.revokeObjectURL(f.preview);
        } catch (_) {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = (files) => {
    const newFiles = Array.from(files)
      .filter((f) => f && typeof f.type === 'string' && f.type.startsWith('image/'))
      .map((f) => ({ file: f, id: Math.random().toString(36).substr(2, 9), preview: URL.createObjectURL(f) }));

    if (newFiles.length === 0) return;
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setError(null);
  };

  const removeFile = (id) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((item) => item.id === id);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const resetUI = () => {
    // Revoke generated URLs to avoid leaks on new session.
    generatedAssets.forEach((a) => {
      try {
        URL.revokeObjectURL(a.url);
      } catch (_) {
        // noop
      }
    });

    selectedFiles.forEach((f) => {
      try {
        if (f.preview) URL.revokeObjectURL(f.preview);
      } catch (_) {}
    });

    setSelectedFiles([]);
    setGeneratedAssets([]);
    setIsConverting(false);
    setProgress(0);
    setError(null);
  };

  // ── CORE CONVERSION (remove.bg API) ────────────────
  const handleConvert = async () => {
    if (selectedFiles.length === 0 || isConverting) return;

    setError(null);
    setIsConverting(true);
    setProgress(0);

    // Revoke previous outputs first.
    generatedAssets.forEach((a) => {
      try {
        URL.revokeObjectURL(a.url);
      } catch (_) {
        // noop
      }
    });
    setGeneratedAssets([]);

    try {
      const results = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const item = selectedFiles[i];

        const formData = new FormData();
        formData.append('image_file', item.file);
        formData.append('size', 'auto');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': API_KEY,
          },
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json();
          const errTitle = errData.errors && errData.errors.length > 0
            ? errData.errors[0].title
            : 'Synthesis Fault: Could not transcode asset node.';
          throw new Error(errTitle);
        }

        const blob = await response.blob();
        if (!blob) throw new Error(`Failed to retrieve transparent data: ${item.file.name}`);

        const newName = item.file.name.split('.').slice(0, -1).join('.') + '-rmbg.png';

        results.push({
          name: newName,
          url: URL.createObjectURL(blob),
          size: blob.size,
        });

        setProgress(((i + 1) / selectedFiles.length) * 100);
      }

      setTimeout(() => {
        setGeneratedAssets(results);
        setIsConverting(false);
        try {
          setTimeout(() => {
            resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        } catch (_) {
          // noop
        }
      }, 400);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Synthesis Fault: Could not connect to extraction intelligence.');
      setIsConverting(false);
    }
  };

  // ── STYLES (ported matching ImageConverter) ────────
  const styles = useMemo(
    () => `
      body { font-family: 'Inter', sans-serif; background-color: #fbfcfe; color: #1e2a5e; }
      @keyframes pulse-border { 0%, 100% { border-color: #ef497e; } 50% { border-color: #e2e8f0; } }
      .drop-active { animation: pulse-border 1.2s ease-in-out infinite; border-style: solid !important; }
      .img-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      .img-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.1); }
      .btn-pill { transition: all 0.2s ease; }
      .btn-pill:hover { filter: brightness(1.1); transform: translateY(-1px); }
      .btn-pill:active { transform: translateY(0); scale: 0.98; }

      @keyframes shimmer {
        0% { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      .shimmer {
        background: linear-gradient(90deg, #ef497e 25%, #00d2b4 50%, #ef497e 75%);
        background-size: 400px 100%;
        animation: shimmer 1.4s infinite;
      }
    `,
    []
  );

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <style dangerouslySetInnerHTML={{ __html: styles }} />

        {/* ── HEADER ──────────────────────────────────────────── */}
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-[#1E2A5E]">Remove Background</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 text-center mx-auto max-w-2xl text-[#1E2A5E]/60">
            Intelligent Edge-Detection. Automatically detect and remove the background of any image with precision.
          </p>
        </header>

        {/* ── MAIN CARD ───────────────────────────────────────── */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(239,73,126,0.12)] border border-gray-100 transition-all duration-500 overflow-hidden text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* ── LEFT: Upload Zone ──────────────────────────── */}
            <div className="p-10 sm:p-14 bg-gray-50/30">
              <label className="block text-[10px] font-extrabold uppercase tracking-[4px] text-gray-300 mb-8 leading-none">
                Step 1: Resource Loading
              </label>

              <div
                id="dropZone"
                className={`border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-14 cursor-pointer transition-all bg-white hover:border-[#ef497e] hover:bg-rose-50/20 group relative border-gray-200 ${
                  isDropActive ? 'drop-active' : ''
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
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                }}
              >
                <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-[#ef497e] mb-6 border border-rose-100 transition-transform group-hover:scale-105">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>

                <div className="text-center">
                  <p className="text-[#1E2A5E] font-black text-lg italic mb-1">Select Images</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1 leading-none">
                    Multi-File · API Powered
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    // allow selecting the same file again
                    e.target.value = '';
                  }}
                />
              </div>

              {/* Highlight Features */}
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
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wide leading-relaxed">
                    AI-powered extraction intelligence
                  </p>
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
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wide leading-relaxed">
                    Hair and complex edge isolation
                  </p>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Synthesis Management ───────────────────── */}
            <div className="p-10 sm:p-14 bg-white">
              <label className="block text-[10px] font-extrabold uppercase tracking-[4px] text-gray-300 mb-8 leading-none">
                Step 2: Execution Queue
              </label>

              {/* File List Scroller */}
              {selectedFiles.length === 0 ? (
                <div id="fileListEmpty" className="text-center py-14 opacity-20 border-t border-gray-50 mt-10">
                  <p className="text-[#1E2A5E] font-black uppercase text-[10px] tracking-[5px]">Waiting for Assets</p>
                </div>
              ) : (
                <div
                  id="fileList"
                  className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar text-left text-[#1E2A5E] border-t border-gray-50 pt-8 mt-4"
                >
                  {selectedFiles.map((item) => (
                    <div
                      key={item.id}
                      className="img-card bg-gray-50/50 border border-gray-100 rounded-3xl p-5 flex items-center gap-5 group animate-in slide-in-from-right-2 duration-300"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] shrink-0">
                        {item.preview ? (
                          <img src={item.preview} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-[#ef497e] font-black text-[9px] uppercase tracking-tighter text-[#1E2A5E]">
                            {getTypeBadge(item.file)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[#1E2A5E] font-bold text-xs truncate uppercase tracking-widest">
                          {item.file.name}
                        </p>
                        <p className="text-gray-400 text-[10px] font-black uppercase mt-1 tracking-widest">
                          {fmtSize(item.file.size)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        className="text-gray-300 hover:text-red-400 p-2 transition-colors"
                      >
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

              {/* Action Bar */}
              <div className="mt-10 pt-8 border-t border-gray-50">
                <button
                  type="button"
                  disabled={selectedFiles.length === 0 || isConverting}
                  onClick={handleConvert}
                  className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #ef497e, #00d2b4)',
                    boxShadow: '0 10px 30px -5px rgba(239, 73, 126, 0.4)'
                  }}
                >
                  Remove Background
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mt-6 p-6 bg-red-50 border-t border-red-100 text-left">
                  <p className="font-black text-red-900 uppercase tracking-tight leading-none">Fault Detected</p>
                  <p className="text-red-700 text-[10px] mt-3 font-bold uppercase tracking-widest opacity-80 break-words">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="mt-4 text-red-500 hover:text-red-700 text-[11px] font-bold uppercase tracking-widest"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Progress Section */}
          {isConverting && (
            <div ref={resultsSectionRef} className="p-12 bg-gray-50 border-t border-gray-100 text-center animate-in fade-in duration-500">
              <div className="flex flex-col items-center gap-6">
                <div
                  className="w-10 h-10 animate-spin rounded-full border-4"
                  style={{ borderColor: '#E2E8F0', borderTopColor: '#ef497e' }}
                />
                <div>
                  <p className="text-[#1E2A5E] font-extrabold text-sm uppercase tracking-[5px]">
                    ANALYZING EDGES...
                  </p>
                  <p className="text-gray-400 text-[10px] mt-2 uppercase font-bold tracking-widest leading-none">
                    Running complex detection models on AI server
                  </p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-10 max-w-sm mx-auto">
                <div className="h-full shimmer rounded-full transition-all duration-300 w-full" />
              </div>
            </div>
          )}

          {/* Success Section */}
          {generatedAssets.length > 0 && !isConverting && (
            <div ref={resultsSectionRef} className="p-10 sm:p-14 bg-white border-t border-gray-100 text-left">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[#1E2A5E] font-black text-2xl uppercase tracking-tight leading-none">Extraction Complete!</p>
                  <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-widest opacity-60">
                    Transparent PNGs are ready for download
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-4">
                {generatedAssets.map((img, i) => (
                  <div
                    key={i}
                    className="img-card bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden group animate-in zoom-in-95 duration-500 shadow-sm hover:shadow-xl transition-all flex flex-col"
                  >
                    <div className="relative flex-1 flex flex-col items-center justify-center p-8 min-h-[300px]">
                      <img src={img.url} className="max-w-full h-auto object-contain drop-shadow-xl" alt={img.name} />
                    </div>
                    
                    <div className="p-6 border-t border-gray-100 bg-white">
                      <button
                        type="button"
                        onClick={() => downloadAsset(img.url, img.name)}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-extrabold text-white text-md transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                        style={{
                          background: 'linear-gradient(135deg, #ef497e, #00d2b4)',
                          boxShadow: '0 8px 20px -5px rgba(239, 73, 126, 0.3)'
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                <button
                  type="button"
                  onClick={resetUI}
                  className="text-[10px] font-black uppercase text-gray-300 tracking-[3px] hover:text-[#ef497e] transition-colors"
                >
                  Start New Session
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── FEATURE DECK ─────────────────────────────────────── */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] text-left border border-gray-50">
            <div className="w-12 h-12 rounded-2xl bg-[#ef497e] shadow-lg mb-8 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1h2.5a1.5 1.5 0 011.5 1.5v2H16a1 1 0 011 1v2a1 1 0 01-1 1h-1v2.5a1.5 1.5 0 01-1.5 1.5H11v1a1 1 0 11-2 0v-1H6.5A1.5 1.5 0 015 14v-2.5H4a1 1 0 01-1-1v-2a1 1 0 011-1h1V5.5A1.5 1.5 0 016.5 4H9V3a1 1 0 011-1z"
                />
              </svg>
            </div>
            <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">Precision Intelligence</h3>
            <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-widest leading-relaxed">
              Our tool leverages advanced AI models capable of identifying complex foreground boundaries like fur, hair, and soft edges with uncompromised accuracy.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] text-left border border-gray-50">
            <div className="w-12 h-12 rounded-2xl bg-[#ef497e] shadow-lg mb-8 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z"
                />
              </svg>
            </div>
            <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">Instantaneous Output</h3>
            <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-widest leading-relaxed">
              Achieve perfectly masked images within seconds. Bypass manual selection processes in Photoshop or equivalent image editing suites.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] text-left border border-gray-50">
            <div className="w-12 h-12 rounded-2xl bg-[#ef497e] shadow-lg mb-8 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">Transparent Native</h3>
            <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-widest leading-relaxed">
              Converted foreground objects are instantly encoded into alpha-supportive PNGs, optimizing further compositing immediately upon batch download.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
