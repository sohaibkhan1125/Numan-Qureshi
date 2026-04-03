import React, { useEffect, useMemo, useRef, useState } from 'react';

const CROPPER_CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css';
const CROPPER_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js';

function ensureCropperLoaded() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Cropper) return Promise.resolve(true);

  // Load CSS first (idempotent).
  const existingCss = document.querySelector('link[data-cropperjs-css="true"]');
  if (!existingCss) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CROPPER_CSS_URL;
    link.setAttribute('data-cropperjs-css', 'true');
    document.head.appendChild(link);
  }

  // Load JS (idempotent).
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-cropperjs-js="true"]');
    if (existingScript) {
      // Another instance is currently loading it; wait a bit.
      const t = setInterval(() => {
        if (window.Cropper) {
          clearInterval(t);
          resolve(true);
        }
      }, 50);
      setTimeout(() => {
        clearInterval(t);
        resolve(!!window.Cropper);
      }, 10000);
      return;
    }

    const script = document.createElement('script');
    script.src = CROPPER_JS_URL;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-cropperjs-js', 'true');
    script.onload = () => resolve(!!window.Cropper);
    script.onerror = () => reject(new Error('Failed to load Cropper.js'));
    document.head.appendChild(script);
  });
}

const ImageCropper = () => {
  const [phase, setPhase] = useState('upload'); // upload | editor | results
  const [originalName, setOriginalName] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [activeRatioLabel, setActiveRatioLabel] = useState('Free');

  const [isCropperReady, setIsCropperReady] = useState(false);
  const [error, setError] = useState(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const cropperRef = useRef(null);
  const imageElementRef = useRef(null);
  const fileInputRef = useRef(null);

  const styleText = useMemo(
    () => `
      body { font-family: 'Inter', sans-serif; background-color: #fbfcfe; color: #1e2a5e; }

      @keyframes pulse-border {
        0%, 100% { border-color: #4f6ef7; }
        50%      { border-color: #e2e8f0; }
      }
      .drop-active { animation: pulse-border 1.2s ease-in-out infinite; border-style: solid !important; }

      .img-card   { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      .img-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.1); }

      .btn-pill { transition: all 0.2s ease; }
      .btn-pill:hover { filter: brightness(1.1); transform: translateY(-1px); }
      .btn-pill:active { transform: translateY(0); scale: 0.98; }

      /* Custom Cropper Styles to match theme */
      .cropper-view-box, .cropper-face { border-radius: 0; }
      .cropper-line, .cropper-point { background-color: #4F6EF7; }
      .cropper-view-box { outline: 1px solid #4F6EF7; outline-color: rgba(79, 110, 247, 0.75); }

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
      .aspect-btn.active {
        border-color: #4F6EF7;
        background: #4F6EF7;
        color: white;
        box-shadow: 0 10px 15px -3px rgba(79, 110, 247, 0.25);
      }

      /* Tailwind class fallbacks used by the original HTML */
      .shadow-soft {
        box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      .shadow-card {
        box-shadow: 0 10px 40px -10px rgba(79, 110, 247, 0.12);
      }
    `,
    []
  );

  const aspectButtons = useMemo(
    () => [
      { label: 'Free', ratio: NaN },
      { label: '1:1', ratio: 1 },
      { label: '4:3', ratio: 1.3333333333333333 },
      { label: '16:9', ratio: 1.7777777777777777 }
    ],
    []
  );

  useEffect(() => {
    let alive = true;
    ensureCropperLoaded()
      .then((ok) => {
        if (!alive) return;
        setIsCropperReady(ok);
      })
      .catch(() => {
        if (!alive) return;
        setIsCropperReady(false);
        setError('Failed to load Cropper.js. Please refresh and try again.');
      });
    return () => {
      alive = false;
    };
  }, []);

  // Cleanup cropper instance + preview URLs.
  useEffect(() => {
    return () => {
      if (cropperRef.current) {
        try {
          cropperRef.current.destroy();
        } catch (_) {
          // noop
        }
        cropperRef.current = null;
      }
    };
  }, []);

  const destroyCropper = () => {
    if (cropperRef.current) {
      try {
        cropperRef.current.destroy();
      } catch (_) {
        // noop
      }
      cropperRef.current = null;
    }
  };

  const initCropper = () => {
    if (!window.Cropper) {
      throw new Error('Cropper.js not ready');
    }
    if (!imageElementRef.current) return;

    destroyCropper();
    cropperRef.current = new window.Cropper(imageElementRef.current, {
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 0.8,
      restore: false,
      guides: true,
      center: true,
      highlight: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false
    });
  };

  const loadFile = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) return;

    setError(null);
    setIsLoadingFile(true);
    setPreviewSrc('');
    setOriginalName(file.name.split('.').slice(0, -1).join('.') || 'Asset');

    try {
      if (!isCropperReady) {
        // If still loading, wait briefly; if it fails, we’ll surface an error.
        await ensureCropperLoaded();
      }

      const reader = new FileReader();
      const result = await new Promise((res, rej) => {
        reader.onload = (e) => res(e.target?.result);
        reader.onerror = () => rej(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      if (imageElementRef.current) {
        imageElementRef.current.src = String(result || '');
      }

      // Match HTML: switch from upload to editor only after imageElement is set.
      setPhase('editor');
      setActiveRatioLabel('Free');

      // Initialize cropper.
      initCropper();

      // Ensure aspect ratio is reset to "Free"
      if (cropperRef.current) cropperRef.current.setAspectRatio(NaN);
    } catch (e) {
      console.error(e);
      setError('Could not load image. Please try another file.');
    } finally {
      setIsLoadingFile(false);
    }
  };

  const onDropZoneClick = () => fileInputRef.current?.click();

  const onConvertCrop = () => {
    try {
      if (!cropperRef.current) return;
      const canvas = cropperRef.current.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });

      const dataUrl = canvas.toDataURL('image/png');
      setPreviewSrc(dataUrl);
      setPhase('results');
    } catch (e) {
      console.error(e);
      setError('Crop failed. Please try again.');
      try {
        alert('Crop synthesis fault: Could not commit crop.');
      } catch (_) {
        // noop
      }
    }
  };

  const downloadCropped = () => {
    try {
      const a = document.createElement('a');
      a.download = `${originalName}-cropped.png`;
      a.href = previewSrc;
      a.click();
    } catch (e) {
      console.error(e);
      setError('Download failed.');
    }
  };

  const resetEditor = () => {
    setError(null);
    destroyCropper();
    setPreviewSrc('');
    setOriginalName('');
    setActiveRatioLabel('Free');

    if (imageElementRef.current) imageElementRef.current.src = '';
    if (fileInputRef.current) fileInputRef.current.value = '';

    setPhase('upload');
  };

  const applyRotateLeft = () => cropperRef.current?.rotate(-90);
  const applyRotateRight = () => cropperRef.current?.rotate(90);
  const applyScaleX = () => {
    if (!cropperRef.current) return;
    const { scaleX } = cropperRef.current.getData();
    cropperRef.current.scaleX(scaleX === 1 ? -1 : 1);
  };
  const applyScaleY = () => {
    if (!cropperRef.current) return;
    const { scaleY } = cropperRef.current.getData();
    cropperRef.current.scaleY(scaleY === 1 ? -1 : 1);
  };

  const onSelectAspect = (ratio, label) => {
    setActiveRatioLabel(label);
    if (!cropperRef.current) return;
    // Preserve original HTML behavior: Free uses NaN.
    cropperRef.current.setAspectRatio(Number.isNaN(ratio) ? NaN : ratio);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] selection:bg-[#4F6EF7]/10 selection:text-[#4F6EF7]">
      <style dangerouslySetInnerHTML={{ __html: styleText }} />

      {/* Subtle Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4F6EF7]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C3AED]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        {/* ── HEADER ──────────────────────────────────────────── */}
        <header className="mb-12 relative">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#4F6EF7] text-[10px] font-black uppercase tracking-[3px] mb-6 border border-blue-100/50">
            v2.0 – Optimized Engine
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 tracking-tight text-[#1E2A5E] leading-[1.1]">
            Precision{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6EF7] to-[#7C3AED]">
              Image Cropper
            </span>
          </h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 text-center mx-auto max-w-2xl text-[#1E2A5E]/60 leading-relaxed italic">
            High-fidelity vector isolation. Instant, secure, and entirely client-side manipulation.
          </p>
        </header>

        {/* ── MAIN CONTENT ─────────────────────────────────── */}
        <main>
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-white/40 transition-all duration-500 overflow-hidden text-left mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            {/* Step 1: Upload (Visible when no image) */}
            {phase === 'upload' && (
              <div className="p-10 sm:p-20 text-center" id="stepUpload">
                <label className="block text-[10px] font-extrabold uppercase tracking-[4px] text-gray-300 mb-12 leading-none">
                  Step 1: Resource Loading
                </label>

                <div
                  id="dropZone"
                  className={`border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-16 cursor-pointer transition-all duration-300 bg-gray-50/50 hover:border-[#4F6EF7]/30 hover:bg-blue-50/20 group relative border-gray-200 hover:shadow-2xl hover:shadow-[#4F6EF7]/10 active:scale-[0.99] ${
                    isDropActive ? 'drop-active' : ''
                  }`}
                  onClick={onDropZoneClick}
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onDropZoneClick();
                  }}
                >
                  <div className="w-16 h-16 rounded-3xl bg-[#4F6EF7]/50 flex items-center justify-center text-[#4F6EF7] mb-6 border border-[#4F6EF7]/20 transition-transform group-hover:scale-105">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-[#1E2A5E] font-black text-lg italic mb-1">Select Image File</p>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                      JPG · PNG · WEBP · 100% Client-Side
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) loadFile(f);
                      // allow re-selecting same file
                      e.target.value = '';
                    }}
                  />
                </div>

                {error && (
                  <div className="mt-6 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-left">
                    <p className="text-red-900 font-black text-[10px] uppercase tracking-widest">{error}</p>
                  </div>
                )}

                {isLoadingFile && (
                  <div className="mt-6 text-gray-400 text-[11px] font-bold uppercase tracking-widest opacity-70">
                    Loading image...
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Editor (Visible when image loaded) */}
            {phase === 'editor' && (
              <div className="flex flex-col" id="stepEditor">
                <div className="p-8 sm:p-12 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-8">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[4px] text-gray-300 mb-2 leading-none">
                      Step 2: Precision Cropping
                    </label>
                    <p className="text-xs font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Adjust Selection Nodes</p>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar max-w-full">
                    {aspectButtons.map((b) => (
                      <button
                        key={b.label}
                        type="button"
                        className={`aspect-btn ${activeRatioLabel === b.label ? 'active' : ''}`}
                        data-ratio={Number.isNaN(b.ratio) ? 'NaN' : b.ratio}
                        onClick={() => onSelectAspect(b.ratio, b.label)}
                      >
                        {b.label === 'Free' ? 'Free' : b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 sm:p-10 flex flex-col lg:flex-row gap-10">
                  {/* Transformation Canvas */}
                  <div className="flex-1 min-h-[400px] max-h-[600px] bg-white rounded-3xl border border-gray-200 overflow-hidden relative shadow-inner">
                    <img ref={imageElementRef} className="max-w-full block" alt="Crop source" id="imageElement" />
                  </div>

                  {/* Side Controls */}
                  <div className="lg:w-64 space-y-8 flex-shrink-0">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Transform Nodes</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={applyRotateLeft} className="aspect-btn flex items-center justify-center py-4">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={applyRotateRight}
                          className="aspect-btn flex items-center justify-center py-4 scale-x-[-1]"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                        </button>
                        <button type="button" onClick={applyScaleX} className="aspect-btn flex items-center justify-center py-4">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                          </svg>
                        </button>
                        <button type="button" onClick={applyScaleY} className="aspect-btn flex items-center justify-center py-4">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 12l4-4m-4 4l-4-4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Commit Final</p>
                      <button
                        type="button"
                        onClick={onConvertCrop}
                        className="w-full h-16 flex items-center justify-center py-4 bg-[#4F6EF7] rounded-2xl font-black text-xs uppercase tracking-[3px] shadow-lg shadow-blue-200 hover:brightness-110 active:scale-95 transition-all"
                      >
                        Crop Image
                      </button>
                      <button
                        type="button"
                        onClick={resetEditor}
                        className="w-full mt-4 text-[10px] font-black uppercase text-gray-300 tracking-[3px] hover:text-red-400 transition-colors"
                      >
                        Discard Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Previews Grid (Visible when cropped) */}
            {phase === 'results' && (
              <div id="resultsSection" className="p-10 sm:p-14 bg-white border-t border-gray-100 text-left">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="text-[#1E2A5E] font-black text-2xl uppercase tracking-tight leading-none">Synthesis Ready!</p>
                    <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-widest opacity-60">
                      Optimized Responsive Asset Generated
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="flex-1 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 group">
                    <div className="aspect-video relative rounded-2xl overflow-hidden border border-gray-200 bg-white">
                      <img id="previewImage" className="w-full h-full object-contain" src={previewSrc || ''} alt="Cropped preview" />
                    </div>
                  </div>

                  <div className="w-full md:w-80">
                    <label className="block text-[10px] font-extrabold uppercase tracking-[4px] text-gray-300 mb-6 leading-none">
                      Asset Output
                    </label>

                    <button
                      type="button"
                      id="downloadBtn"
                      onClick={downloadCropped}
                      className="w-full flex items-center justify-center gap-3 py-6 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                      style={{
                        background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)',
                        boxShadow: '0 10px 30px -5px rgba(79, 110, 247, 0.4)'
                      }}
                    >
                      Download Image
                    </button>

                    <button
                      type="button"
                      onClick={resetEditor}
                      className="w-full mt-6 text-[10px] font-black uppercase text-[#4F6EF7] tracking-[3px] border-b-2 border-[#4F6EF7] hover:opacity-70 transition-opacity pb-1 inline-block text-center"
                    >
                      New Crop Session
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ── FEATURE DECK ─────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-soft text-left border border-gray-50">
            <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z"
                />
              </svg>
            </div>
            <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">Atomic Edge Precision</h3>
            <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-widest leading-relaxed">
              Sub-pixel selection nodes allow you to isolate the exact region of any image asset with absolute fidelity.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-soft text-left border border-gray-50">
            <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.9L9.03 9.069a1.888 1.888 0 010 3.268L2.166 16.5A2 2 0 010 14.564V6.836c0-1.104.97-1.936 2.166-1.936zM11 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V6z"
                />
              </svg>
            </div>
            <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">Zero-Cloud Latency</h3>
            <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-widest leading-relaxed">
              No API calls. No data transfers. 100% client-side manipulation ensures total privacy and instantaneous commit times.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-soft text-left border border-gray-50">
            <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">Encrypted Isolation</h3>
            <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-widest leading-relaxed">
              Your source images never leave your local machine. Every transformation is isolated to your browser memory context.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ImageCropper;

