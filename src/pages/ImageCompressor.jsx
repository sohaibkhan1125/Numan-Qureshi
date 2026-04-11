import React, { useState, useRef } from 'react';

const ImageCompressor = () => {
    // ── STATE ──────────────────────────────────────────
    const [selectedFiles, setSelectedFiles] = useState([]); // { file, id }
    const [generatedAssets, setGeneratedAssets] = useState([]); // { originalName, originalSize, compressedSize, url, name, mime }
    const [fileErrors, setFileErrors] = useState([]); // { fileName, message }
    const [isCompressing, setIsCompressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [quality, setQuality] = useState(80);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);

    // ── HELPERS ────────────────────────────────────────
    const fmtSize = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB';
    const savings = (o, c) => Math.max(0, Math.round((1 - c / o) * 100));

    // ── ACTIONS ────────────────────────────────────────
    const addFiles = (files) => {
        const newFiles = Array.from(files)
            .filter(f => f.type.startsWith('image/'))
            .map(f => ({ file: f, id: Math.random().toString(36).substr(2, 9) }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
        if (newFiles.length > 0) setError(null);
    };

    const removeFile = (id) => {
        setSelectedFiles(prev => prev.filter(item => item.id !== id));
    };

    const handleCompress = async () => {
        if (selectedFiles.length === 0 || isCompressing) return;

        setIsCompressing(true);
        setGeneratedAssets([]);
        setFileErrors([]);
        setProgress(0);
        setError(null);

        // Revoke any previous object URLs to avoid memory leaks when users re-run compression.
        generatedAssets.forEach((asset) => {
            try { URL.revokeObjectURL(asset.url); } catch (_) { /* noop */ }
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            setError('Image compression is not supported in this browser (missing canvas 2D context).');
            setIsCompressing(false);
            return;
        }

        const baseQuality = Math.max(0.01, Math.min(1, Number(quality) / 100));

        try {
            const results = [];
            let i = 0;

            for (const item of selectedFiles) {
                try {
                    // Load image
                    const img = new Image();
                    const src = URL.createObjectURL(item.file);

                    try {
                        await new Promise((res, rej) => {
                            img.onload = res;
                            img.onerror = () => rej(new Error(`Failed to load: ${item.file.name}`));
                            img.src = src;
                        });
                    } finally {
                        // Safe to revoke now: the canvas has the pixels (or the load failed).
                        URL.revokeObjectURL(src);
                    }

                    // Limit canvas dimensions for stability (very large images can break toBlob/preview).
                    const MAX_DIMENSION = 4096;
                    const originalW = img.naturalWidth || img.width;
                    const originalH = img.naturalHeight || img.height;
                    const scale = Math.min(1, MAX_DIMENSION / Math.max(originalW, originalH));
                    const targetW = Math.max(1, Math.round(originalW * scale));
                    const targetH = Math.max(1, Math.round(originalH * scale));

                    canvas.width = targetW;
                    canvas.height = targetH;

                    const originalMime = item.file.type || '';
                    // quality slider must affect output size. PNG (lossless) won't respect quality,
                    // so we convert PNG/GIF to WEBP. JPEG keeps quality behavior.
                    const preferredMime =
                        originalMime === 'image/png' || originalMime === 'image/gif' ? 'image/webp' :
                        originalMime === 'image/webp' ? 'image/webp' :
                        'image/jpeg';

                    const mimeCandidates = preferredMime === 'image/webp'
                        ? ['image/webp', 'image/jpeg'] // fallback if WEBP isn't supported
                        : [preferredMime];

                    const formatExtension = (mime) => {
                        if (mime === 'image/jpeg') return 'jpg';
                        if (!mime.includes('/')) return 'bin';
                        return mime.split('/')[1].replace('jpeg', 'jpg');
                    };

                    // Encode and ensure we actually get a Blob.
                    const shouldFillWhite = (mime) => mime === 'image/jpeg';

                    const fileSize = item.file.size;
                    let finalAsset = null;
                    let bestAsset = null;

                    for (const targetMime of mimeCandidates) {
                        // Prepare background/transparency per target format.
                        if (shouldFillWhite(targetMime)) {
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                        } else {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                        }

                        // Draw resized image.
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        // Encode exactly at the user-selected quality.
                        const blob = await new Promise((res) => {
                            const qParam = (targetMime === 'image/jpeg' || targetMime === 'image/webp') ? baseQuality : undefined;
                            canvas.toBlob(res, targetMime, qParam);
                        });

                        if (!blob) continue;

                        const compressedSize = blob.size;
                        const extension = formatExtension(targetMime);
                        const name = item.file.name.replace(/\.[^/.]+$/, "") + `-compressed.${extension}`;

                        const asset = {
                            originalName: item.file.name,
                            originalSize: item.file.size,
                            compressedSize,
                            url: URL.createObjectURL(blob),
                            name,
                            mime: targetMime
                        };

                        // Prefer a smaller-than-original result when available.
                        if (compressedSize > 0 && compressedSize < fileSize) {
                            finalAsset = asset;
                            break;
                        }

                        // Otherwise keep the smallest candidate we managed to encode.
                        if (!bestAsset || compressedSize < bestAsset.compressedSize) {
                            bestAsset = asset;
                        }
                    }

                    if (!finalAsset) {
                        finalAsset = bestAsset;
                    }

                    if (!finalAsset) {
                        throw new Error(`Compression failed for: ${item.file.name}`);
                    }

                    results.push(finalAsset);
                } catch (fileErr) {
                    setFileErrors((prev) => [
                        ...prev,
                        { fileName: item.file.name, message: fileErr?.message || 'Compression failed for this file.' }
                    ]);
                }

                i++;
                setProgress((i / selectedFiles.length) * 100);
            }

            setGeneratedAssets(results);
        } catch (err) {
            setError(err.message || 'The local hardware bridge encountered a pixel synthesis error.');
        } finally {
            setIsCompressing(false);
        }
    };

    const downloadAll = () => {
        generatedAssets.forEach((asset, i) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = asset.url;
                link.download = asset.name;
                link.click();
            }, i * 300);
        });
    };

    const resetUI = () => {
        generatedAssets.forEach((asset) => {
            try { URL.revokeObjectURL(asset.url); } catch (_) { /* noop */ }
        });
        setSelectedFiles([]);
        setGeneratedAssets([]);
        setFileErrors([]);
        setProgress(0);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
                
                {/* Header */}
                <header className="mb-12 animate-in rotate-in-1 duration-700">
                    <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Image Compressor</h1>
                    <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
                        Precision size reduction. Compress JPG, PNG, WEBP, and GIF images with full quality control — entirely in your browser.
                    </p>
                </header>

                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left transition-all duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        
                        {/* Left: Upload Zone */}
                        <div className="p-10 sm:p-14 bg-gray-50/30">
                            <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-8 font-black uppercase tracking-[4px] text-gray-300 mb-8">Step 1: Resource Loading</label>
                            
                            <div 
                                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#4F6EF7]'); }}
                                onDragLeave={(e) => { e.currentTarget.classList.remove('border-[#4F6EF7]'); }}
                                onDrop={(e) => { 
                                    e.preventDefault(); 
                                    e.currentTarget.classList.remove('border-[#4F6EF7]'); 
                                    addFiles(e.dataTransfer.files); 
                                }}
                                onClick={() => fileInputRef.current.click()}
                                className="border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-14 cursor-pointer transition-all bg-white group relative hover:border-[#4F6EF7] hover:bg-blue-50/20"
                            >
                                <div className="w-16 h-16 rounded-3xl bg-blue-50/50 flex items-center justify-center text-[#4F6EF7] mb-6 border border-blue-100 transition-transform group-hover:scale-105">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-[#1E2A5E] font-black text-lg italic mb-1 uppercase tracking-tight leading-none leading-none">Select Images</p>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none mt-2 opacity-60">JPG · PNG · WEBP · GIF · Multi-File</p>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                            </div>

                            <div className="mt-12 space-y-6 pt-10 text-left border-t border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 shadow-sm"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg></div>
                                    <p className="text-gray-400 text-[11px] font-black uppercase tracking-[2px] leading-relaxed">Before / After Size Delta</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 shadow-sm"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg></div>
                                    <p className="text-gray-400 text-[11px] font-black uppercase tracking-[2px] leading-relaxed">Zero Cloud · 100% Private</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Compression Config Zone */}
                        <div className="p-10 sm:p-14 bg-white font-black uppercase tracking-[4px] text-gray-300 mb-8">
                            <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-8 font-black uppercase tracking-[4px] text-gray-300 mb-8 font-black uppercase tracking-[4px] text-gray-300 mb-8">Step 2: Compression Config</label>
                            
                            {/* Quality Slider Control */}
                            <div className="mb-10 animate-in fade-in duration-700">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 leading-none leading-none">Quality Level</p>
                                    <span className="text-[#4F6EF7] font-black text-sm tracking-widest leading-none leading-none leading-none">{quality}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" max="100" 
                                    value={quality} 
                                    onChange={(e) => setQuality(e.target.value)}
                                    className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#4F6EF7]"
                                />
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-300 mt-4 leading-none leading-none">
                                    <span>Max Compress</span>
                                    <span>Max Quality</span>
                                </div>
                            </div>

                            {/* Preset Logic Pills */}
                            <div className="mb-10">
                                <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest mb-4 opacity-40 leading-none">Quick Presets</p>
                                <div className="flex flex-wrap gap-3">
                                    {[30, 60, 90].map((q) => (
                                        <button 
                                            key={q}
                                            onClick={() => setQuality(q)}
                                            className={`px-5 py-2.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${quality === q ? 'border-[#4F6EF7] text-[#4F6EF7] bg-blue-50/50' : 'border-gray-50 text-gray-300 hover:border-gray-100 hover:text-gray-400'}`}
                                        >
                                            {q === 30 ? 'High Compress' : q === 60 ? 'Balanced' : 'High Quality'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* File List Registry */}
                            <div className="border-t border-gray-50 pt-8 mt-4 overflow-hidden">
                                {selectedFiles.length === 0 ? (
                                    <div className="text-center py-14 opacity-20">
                                        <p className="text-[#1E2A5E] font-black uppercase text-[10px] tracking-[5px]">Waiting for Assets</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar transition-all duration-500">
                                        {selectedFiles.map((item) => (
                                            <div key={item.id} className="bg-gray-50/50 border border-gray-100 rounded-3xl p-5 flex items-center gap-5 group animate-in slide-in-from-right-2 duration-300">
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#4F6EF7] shadow-sm font-black text-[9px] uppercase tracking-tighter shrink-0 text-center text-[#1E2A5E]">
                                                    {item.file.type.split('/')[1].replace('jpeg', 'jpg')}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[#1E2A5E] font-black text-[10px] uppercase tracking-widest truncate">{item.file.name}</p>
                                                    <p className="text-gray-400 text-[10px] font-black uppercase mt-1 tracking-widest">{fmtSize(item.file.size)}</p>
                                                </div>
                                                <button onClick={() => removeFile(item.id)} className="text-gray-300 hover:text-red-400 p-2 transition-colors">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Batch Action Button */}
                            <div className="mt-10 pt-8 border-t border-gray-50">
                                <button 
                                    disabled={selectedFiles.length === 0 || isCompressing}
                                    onClick={handleCompress}
                                    className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-white text-lg transition-all disabled:opacity-20 hover:brightness-110 active:scale-[0.98] shadow-lg shadow-blue-500/30 bg-gradient-to-r from-[#4F6EF7] to-[#7C3AED]"
                                >
                                    {isCompressing ? 'Compressing...' : 'Compress Images'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Engine Segment */}
                    {isCompressing && (
                        <div className="p-12 bg-gray-50 border-t border-gray-100 text-center animate-in fade-in duration-500">
                            <div className="flex flex-col items-center gap-6 text-center">
                                <div className="w-10 h-10 animate-spin rounded-full border-4 border-gray-200 border-top-[#4F6EF7]"></div>
                                <div>
                                    <p className="text-[#1E2A5E] font-black text-sm uppercase tracking-[5px]">COMPRESSING PIXELS...</p>
                                    <p className="text-gray-400 text-[10px] mt-2 uppercase font-black tracking-widest leading-none opacity-50">Optimising Lossiness Thresholds via Canvas Engine</p>
                                </div>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-10 max-w-sm mx-auto shadow-inner">
                                <div 
                                    className="h-full bg-gradient-to-r from-[#4F6EF7] to-[#7C3AED] transition-all duration-300 shimmer rounded-full"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Results Assets Grid */}
                    {generatedAssets.length > 0 && (
                        <div className="p-10 sm:p-14 bg-white border-t border-gray-100 text-left animate-in drift-in-bottom-4 duration-700">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <p className="text-[#1E2A5E] font-black text-2xl uppercase tracking-tight leading-none leading-none">Synthesis Ready!</p>
                                    <p className="text-gray-400 text-[10px] font-black mt-2 uppercase tracking-widest opacity-60">
                                        {generatedAssets.length} Image{generatedAssets.length > 1 ? 's' : ''} · Saved {savings(generatedAssets.reduce((s, a) => s + a.originalSize, 0), generatedAssets.reduce((s, a) => s + a.compressedSize, 0))}%
                                    </p>
                                </div>
                                <button onClick={downloadAll} className="text-[10px] font-black uppercase text-[#4F6EF7] tracking-[3px] border-b-2 border-[#4F6EF7] hover:opacity-70 transition-opacity">Batch Download</button>
                            </div>

                            <div className="space-y-4">
                                {generatedAssets.map((asset, i) => {
                                    const saved = savings(asset.originalSize, asset.compressedSize);
                                    const isSmaller = asset.compressedSize < asset.originalSize;
                                    return (
                                        <div key={i} className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-center group opacity-0 animate-in fade-in duration-500 scale-in-95 fill-mode-forwards" style={{ animationDelay: `${i * 100}ms` }}>
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-gray-100 shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-[1.05]">
                                                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <p className="text-[#1E2A5E] font-black text-[10px] uppercase tracking-[2px] truncate mb-3">{asset.originalName}</p>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-blue-50 text-[#4F6EF7]">
                                                        Original: {fmtSize(asset.originalSize)}
                                                    </span>
                                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${isSmaller ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                        Result: {fmtSize(asset.compressedSize)}
                                                    </span>
                                                    {isSmaller && (
                                                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-green-50 text-green-600 animate-pulse transition-all">
                                                            –{saved}% Saved
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <a href={asset.url} download={asset.name} className="shrink-0 flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-white text-[10px] uppercase tracking-[2px] hover:brightness-110 active:scale-95 transition-all bg-gradient-to-br from-[#4F6EF7] to-[#7C3AED] shadow-md shadow-blue-500/20">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                                Download
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>

                            {fileErrors.length > 0 && (
                                <div className="mt-12 p-8 bg-red-50 border border-red-100 rounded-3xl text-left">
                                    <p className="font-black text-lg uppercase tracking-tight text-red-900 mb-4">Some files failed</p>
                                    <div className="space-y-2">
                                        {fileErrors.map((fe, idx) => (
                                            <p key={idx} className="text-red-700 text-[10px] font-bold uppercase tracking-widest opacity-80 break-words">
                                                {fe.fileName}: {fe.message}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                                <button onClick={resetUI} className="text-[10px] font-black uppercase text-gray-300 tracking-[3px] hover:text-[#4F6EF7] transition-colors leading-none leading-none">Discard & New Session</button>
                            </div>
                        </div>
                    )}

                    {generatedAssets.length === 0 && fileErrors.length > 0 && (
                        <div className="p-10 sm:p-14 bg-white border-t border-gray-100 text-left animate-in drift-in-bottom-4 duration-700">
                            <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-left">
                                <p className="font-black text-lg uppercase tracking-tight text-red-900 mb-4">Some files failed</p>
                                <div className="space-y-2">
                                    {fileErrors.map((fe, idx) => (
                                        <p key={idx} className="text-red-700 text-[10px] font-bold uppercase tracking-widest opacity-80 break-words">
                                            {fe.fileName}: {fe.message}
                                        </p>
                                    ))}
                                </div>
                                <div className="mt-8 text-center">
                                    <button onClick={resetUI} className="text-[10px] font-black uppercase text-gray-300 tracking-[3px] hover:text-[#4F6EF7] transition-colors leading-none leading-none">
                                        Discard & New Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Detailed Fault Notification Banner */}
                    {error && (
                        <div className="p-10 bg-red-50 border-t border-red-100 flex items-start gap-5 text-left transition-all duration-500 animate-in slide-in-from-bottom-5">
                            <svg className="w-7 h-7 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            <div className="flex-1 text-red-900">
                                <p className="font-black text-lg uppercase tracking-tight leading-none leading-none">Fault Detected</p>
                                <p className="font-bold text-[10px] mt-2 uppercase tracking-widest opacity-70">{error}</p>
                            </div>
                            <button onClick={() => setError(null)} className="text-red-300 hover:text-red-500 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                        </div>
                    )}
                </div>

                {/* Performance Features Deck */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {[
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" /></svg>, title: "Quality Gradient", text: "Fine-tune compression from 1% to 100% for exact control over the quality-to-size ratio of every image asset." },
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/></svg>, title: "Before / After Delta", text: "Instantly see the original vs. compressed file size for each image with a clear savings percentage indicator." },
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" /></svg>, title: "Zero-Cloud Privacy", text: "All compression happens entirely in your browser via the Canvas API. Your images never leave your local machine." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-soft flex flex-col items-start gap-6 hover:shadow-xl transition-all h-full border border-gray-50 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg flex items-center justify-center text-white shrink-0 group-hover:rotate-12 transition-transform">{feature.icon}</div>
                            <div className="flex-1">
                                <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">{feature.title}</h3>
                                <p className="text-gray-400 text-xs font-black leading-relaxed uppercase tracking-widest">{feature.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4F6EF7; }
                
                @keyframes shimmer {
                    0% { background-position: -400px 0; }
                    100% { background-position: 400px 0; }
                }
                .shimmer {
                    background: linear-gradient(90deg, #4F6EF7 25%, #7C3AED 50%, #4F6EF7 75%);
                    background-size: 400px 100%;
                    animation: shimmer 1.4s infinite;
                }
            `}} />
        </div>
    );
};

export default ImageCompressor;
