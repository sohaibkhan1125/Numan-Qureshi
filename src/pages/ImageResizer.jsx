import React, { useMemo, useRef, useState } from 'react';

const ImageResizer = () => {
  const [phase, setPhase] = useState('upload');
  const [originalName, setOriginalName] = useState('');
  const [error, setError] = useState(null);
  const [isDropActive, setIsDropActive] = useState(false);

  const [previewSrc, setPreviewSrc] = useState('');
  const [finalSrc, setFinalSrc] = useState('');
  const [finalDimensions, setFinalDimensions] = useState('0 x 0 PX');
  const [finalSize, setFinalSize] = useState('0 KB');

  const [targetWidth, setTargetWidth] = useState('');
  const [targetHeight, setTargetHeight] = useState('');
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [originalRatio, setOriginalRatio] = useState(1);

  const fileInputRef = useRef(null);
  const resultsSectionRef = useRef(null);
  const originalImgRef = useRef(new Image());

  const styleText = useMemo(
    () => `
      @keyframes pulse-border {
        0%, 100% { border-color: #4f6ef7; }
        50%      { border-color: #e2e8f0; }
      }
      .drop-active { animation: pulse-border 1.2s ease-in-out infinite; border-style: solid !important; }
      .img-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      .img-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.1); }
      .aspect-btn {
        padding: 0.625rem 1.25rem;
        border-radius: 0.75rem;
        border: 2px solid #f3f4f6;
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #9ca3af;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: white;
        cursor: pointer;
      }
      .aspect-btn:hover {
        border-color: #4F6EF7;
        color: #4F6EF7;
        background: #f8faff;
        transform: translateY(-1px);
      }
    `,
    []
  );

  const fmtApproxDataUrlSizeKB = (dataUrl) => {
    const head = 'data:image/png;base64,';
    if (!dataUrl || !dataUrl.startsWith('data:')) return '0 KB';
    const size = Math.round(((dataUrl.length - head.length) * 3) / 4 / 1024);
    return `${size} KB`;
  };

  const loadFile = (file) => {
    if (!file?.type?.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setError(null);
    setOriginalName(file.name.split('.').slice(0, -1).join('.') || 'Asset');

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = String(e.target?.result || '');
      const img = originalImgRef.current;
      img.onload = () => {
        const ow = img.naturalWidth;
        const oh = img.naturalHeight;
        setOriginalRatio(ow / oh);
        setTargetWidth(String(ow));
        setTargetHeight(String(oh));
        setPreviewSrc(dataUrl);
        setPhase('editor');
      };
      img.onerror = () => setError('Could not load image.');
      img.src = dataUrl;
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const resetEditor = () => {
    setError(null);
    setPreviewSrc('');
    setFinalSrc('');
    setFinalDimensions('0 x 0 PX');
    setFinalSize('0 KB');
    setTargetWidth('');
    setTargetHeight('');
    setMaintainAspect(true);
    originalImgRef.current = new Image();
    if (fileInputRef.current) fileInputRef.current.value = '';
    setPhase('upload');
  };

  const handleWidthChange = (v) => {
    setTargetWidth(v);
    if (!maintainAspect) return;
    const w = parseInt(v, 10);
    if (!w || !originalRatio) return;
    setTargetHeight(String(Math.round(w / originalRatio)));
  };

  const handleHeightChange = (v) => {
    setTargetHeight(v);
    if (!maintainAspect) return;
    const h = parseInt(v, 10);
    if (!h || !originalRatio) return;
    setTargetWidth(String(Math.round(h * originalRatio)));
  };

  const onResize = () => {
    const tw = parseInt(String(targetWidth), 10);
    const th = parseInt(String(targetHeight), 10);
    if (!tw || !th) {
      setError('Enter valid width and height.');
      return;
    }
    setError(null);

    const img = originalImgRef.current;
    if (!img.complete || !img.naturalWidth) {
      setError('Image not ready.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, tw, th);

    const dataUrl = canvas.toDataURL('image/png');
    setFinalSrc(dataUrl);
    setFinalDimensions(`${tw} x ${th} PX`);
    setFinalSize(fmtApproxDataUrlSizeKB(dataUrl));
    setPhase('results');
    setTimeout(() => {
      resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const downloadResized = () => {
    const a = document.createElement('a');
    a.download = `${originalName}-resized.png`;
    a.href = finalSrc;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 selection:bg-[#4F6EF7]/10 selection:text-[#4F6EF7]">
      <style dangerouslySetInnerHTML={{ __html: styleText }} />

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4F6EF7]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C3AED]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <header className="mb-12 relative">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#4F6EF7] text-[10px] font-black uppercase tracking-[3px] mb-6 border border-blue-100/50">
            v2.1 – Precision Canvas
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 tracking-tight text-[#1E2A5E] leading-[1.1]">
            Precision{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6EF7] to-[#7C3AED]">Image Resizer</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 text-center mx-auto max-w-2xl text-[#1E2A5E]/60 leading-relaxed italic">
            High-fidelity pixel isolation. Instant, secure, and entirely client-side resizing.
          </p>
        </header>

        <main>
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-white/40 transition-all duration-500 overflow-hidden text-left mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            {phase === 'upload' && (
              <div className="p-10 sm:p-20 text-center relative z-10">
                <label className="block text-[10px] font-extrabold uppercase tracking-[4px] text-gray-300 mb-12">Step 1: Resource Loading</label>
                <div
                  className={`border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-16 cursor-pointer transition-all duration-300 bg-gray-50/50 hover:border-[#4F6EF7]/30 hover:bg-blue-50/20 group relative border-gray-200 hover:shadow-2xl hover:shadow-[#4F6EF7]/10 active:scale-[0.99] ${
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
                    const f = e.dataTransfer.files?.[0];
                    if (f) loadFile(f);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="w-16 h-16 rounded-3xl bg-blue-50/50 flex items-center justify-center text-[#4F6EF7] mb-6 border border-blue-100 transition-transform group-hover:scale-105">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#1E2A5E] font-black text-lg italic mb-1">Select Image File</p>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">JPG · PNG · WEBP · 100% Client-Side</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) loadFile(f);
                      e.target.value = '';
                    }}
                  />
                </div>
                {error && (
                  <p className="mt-6 text-red-600 text-sm font-bold">{error}</p>
                )}
              </div>
            )}

            {phase === 'editor' && (
              <div className="flex flex-col relative z-10">
                <div className="p-8 sm:p-12 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-8">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[4px] text-gray-300 mb-2 leading-none">Step 2: Scale Adjustment</label>
                    <p className="text-xs font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Define Output Dimensions</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 sm:p-10 flex flex-col lg:flex-row gap-10">
                  <div className="flex-1 min-h-[400px] max-h-[600px] bg-white rounded-3xl border border-gray-200 overflow-hidden relative shadow-inner flex items-center justify-center p-4">
                    {previewSrc ? (
                      <img src={previewSrc} alt="" className="max-w-full max-h-full block object-contain shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] rounded-lg" />
                    ) : null}
                  </div>
                  <div className="lg:w-80 space-y-8 flex-shrink-0">
                    <div className="space-y-6">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Resize Dimensions</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Width (px)</label>
                          <input
                            type="number"
                            min={1}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                            value={targetWidth}
                            onChange={(e) => handleWidthChange(e.target.value)}
                            placeholder="W"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Height (px)</label>
                          <input
                            type="number"
                            min={1}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                            value={targetHeight}
                            onChange={(e) => handleHeightChange(e.target.value)}
                            placeholder="H"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100">
                        <input
                          type="checkbox"
                          id="checkRatio"
                          className="w-5 h-5 rounded-md border-2 border-gray-200 text-[#4F6EF7]"
                          checked={maintainAspect}
                          onChange={(e) => setMaintainAspect(e.target.checked)}
                        />
                        <label htmlFor="checkRatio" className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest cursor-pointer select-none">
                          Maintain Aspect Ratio
                        </label>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Commit Final</p>
                      <button type="button" onClick={onResize} className="w-full h-16 flex items-center justify-center py-4 bg-[#4F6EF7] rounded-2xl font-black text-white text-xs uppercase tracking-[3px] shadow-lg shadow-blue-200 hover:brightness-110 active:scale-95 transition-all">
                        Resize Image
                      </button>
                      <button type="button" onClick={resetEditor} className="w-full mt-4 text-[10px] font-black uppercase text-gray-300 tracking-[3px] hover:text-red-400 transition-colors">
                        Discard Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {phase === 'results' && (
              <div ref={resultsSectionRef} className="p-10 sm:p-14 bg-white border-t border-gray-100 text-left relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="text-[#1E2A5E] font-black text-2xl uppercase tracking-tight leading-none">Resizing Complete!</p>
                    <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-widest opacity-60">Optimized Responsive Asset Generated</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="flex-1 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 group">
                    <div className="aspect-video relative rounded-2xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                      {finalSrc ? <img src={finalSrc} alt="" className="max-w-full max-h-full object-contain" /> : null}
                    </div>
                    <div className="mt-4 flex justify-between items-center px-2">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{finalDimensions}</p>
                      <p className="text-[9px] font-black text-[#4F6EF7] uppercase tracking-widest">{finalSize}</p>
                    </div>
                  </div>
                  <div className="w-full md:w-80">
                    <label className="block text-[10px] font-extrabold uppercase tracking-[4px] text-gray-300 mb-6 leading-none">Asset Output</label>
                    <button
                      type="button"
                      onClick={downloadResized}
                      className="w-full flex items-center justify-center gap-3 py-6 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                      style={{
                        background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)',
                        boxShadow: '0 10px 30px -5px rgba(79, 110, 247, 0.4)',
                      }}
                    >
                      Download Scaled Asset
                    </button>
                    <button type="button" onClick={resetEditor} className="w-full mt-6 text-[10px] font-black uppercase text-[#4F6EF7] tracking-[3px] border-b-2 border-[#4F6EF7] hover:opacity-70 transition-opacity pb-1 inline-block text-center">
                      New Resize Session
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Bilinear Scaling',
                text: 'Advanced smoothing algorithms ensure your scaled assets maintain edge fidelity and color accuracy.',
              },
              {
                title: 'Zero-Cloud Latency',
                text: '100% browser-based manipulation. Zero data transfer overhead. Instant commit times with absolute privacy.',
              },
              {
                title: 'Atomic Isolation',
                text: 'Your source images never leave your local machine. Every transformation is isolated to your browser memory context.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] text-left border border-gray-50 transition-transform hover:scale-[1.02]"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z"
                    />
                  </svg>
                </div>
                <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">{f.title}</h3>
                <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-widest">{f.text}</p>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ImageResizer;
