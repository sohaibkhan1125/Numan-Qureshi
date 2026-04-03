import React, { useState, useRef } from 'react';

const BmpToJpg = () => {
    // ── CONFIG ──────────────────────────────────────────
    const API_KEY = 'bqrqv7pk0Cm0HTkQLwtnpVfrOr9KUxL4';
    const API_URL = 'https://v2.convertapi.com/convert/bmp/to/jpg?Secret=' + API_KEY;

    // ── STATE ───────────────────────────────────────────
    const [selectedFiles, setSelectedFiles] = useState([]); // array of { file, id }
    const [generatedImages, setGeneratedImages] = useState([]); // { name, url, blob }
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [isDropActive, setIsDropActive] = useState(false);
    
    const fileInputRef = useRef(null);

    // ── HELPERS ─────────────────────────────────────────
    const fmt = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB';

    const readB64 = (file) => {
        return new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result.split(',')[1]);
            r.onerror = () => rej(new Error('Read failed'));
            r.readAsDataURL(file);
        });
    };

    const b64ToBlob = (b64, mime = 'image/jpeg') => {
        const bytes = atob(b64);
        const byteNumbers = new Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
            byteNumbers[i] = bytes.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mime });
    };

    const downloadImage = (url, name) => {
        try {
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            console.error('Download failed, falling back to new tab:', err);
            window.open(url, '_blank');
        }
    };

    const downloadAll = () => {
        generatedImages.forEach((img, i) => {
            setTimeout(() => downloadImage(img.url, img.name), i * 400);
        });
    };

    // ── FILE MANAGEMENT ─────────────────────────────────
    const addFiles = (files) => {
        const newFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.bmp')).map(f => ({
            file: f,
            id: Math.random().toString(36).substr(2, 9)
        }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
        setError(null);
    };

    const removeFile = (id) => {
        setSelectedFiles(prev => prev.filter(item => item.id !== id));
    };

    // ── CONVERSION LOGIC ────────────────────────────────
    const handleConvert = async () => {
        if (selectedFiles.length === 0) return;

        setError(null);
        setGeneratedImages([]);
        setIsConverting(true);
        setProgress(0);

        try {
            const results = [];
            for (let i = 0; i < selectedFiles.length; i++) {
                const item = selectedFiles[i];
                const b64 = await readB64(item.file);
                
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Parameters: [
                            { Name: 'File', FileValue: { Name: item.file.name, Data: b64 } }
                        ]
                    })
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => null);
                    throw new Error(`[${item.file.name}] Synthesis Failed: ${errData?.Message || res.status}`);
                }

                const data = await res.json();
                if (data.Files && data.Files.length > 0) {
                    data.Files.forEach(f => {
                        const blob = b64ToBlob(f.FileData);
                        results.push({ name: f.FileName, url: URL.createObjectURL(blob), blob });
                    });
                }
                const pct = ((i + 1) / selectedFiles.length) * 100;
                setProgress(pct);
            }
            setGeneratedImages(results);
        } catch (err) {
            setError(err.message || 'The cloud bridge encountered a synchronization error.');
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fbfcfe]">
            <style dangerouslySetInnerHTML={{ __html: `
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
                .bmp-badge { background: linear-gradient(135deg, #10B981, #059669); }
                .img-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .img-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1); }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4F6EF7; }
            `}} />

            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <header className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight text-[#1E2A5E]">BMP to JPG</h1>
                    <p className="text-[#1E2A5E]/60 text-lg font-bold max-w-2xl mx-auto uppercase tracking-wider">
                        High-efficiency image synthesis. Convert massive bitmap files into optimized JPG gallery assets in seconds.
                    </p>
                </header>

                <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 transition-all duration-500 overflow-hidden text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        
                        {/* LEFT: Upload Zone */}
                        <div className="p-10 sm:p-14 bg-gray-50/30">
                            <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-8">Step 1: Resource Loading</label>
                            
                            <div
                                className={`border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-14 cursor-pointer transition-all bg-white hover:border-[#4F6EF7] hover:bg-blue-50/20 group relative ${isDropActive ? 'drop-active' : ''}`}
                                onDragOver={(e) => { e.preventDefault(); setIsDropActive(true); }}
                                onDragLeave={() => setIsDropActive(false)}
                                onDrop={(e) => { e.preventDefault(); setIsDropActive(false); addFiles(e.dataTransfer.files); }}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <div className="w-16 h-16 rounded-3xl bmp-badge flex items-center justify-center text-white mb-6 shadow-lg transition-transform group-hover:scale-105">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-[#1E2A5E] font-black text-lg italic mb-1 uppercase tracking-tight">Select BMP Images</p>
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">Cloud Ready · Batch Uploads</p>
                                </div>
                                <input ref={fileInputRef} type="file" accept=".bmp" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
                            </div>

                            <div className="mt-12 space-y-6 pt-10 text-left border-t border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 shadow-sm"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg></div>
                                    <p className="text-gray-400 text-[11px] font-black uppercase tracking-[2px] leading-relaxed">Lossy Optimized Compression</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 shadow-sm"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg></div>
                                    <p className="text-gray-400 text-[11px] font-black uppercase tracking-[2px] leading-relaxed">Color Profile Mapping Logic</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Asset Management */}
                        <div className="p-10 sm:p-14 bg-white">
                            <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-8">Step 2: Asset Management</label>
                            
                            {selectedFiles.length === 0 ? (
                                <div className="text-center py-20 opacity-20">
                                    <p className="text-[#1E2A5E] font-black uppercase text-[10px] tracking-[5px]">Waiting for BMP Assets</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedFiles.map((item) => (
                                        <div key={item.id} className="img-card bg-gray-50/50 border border-gray-100 rounded-3xl p-5 flex items-center gap-5 group animate-in slide-in-from-right-2 duration-300">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#4F6EF7] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] font-black text-[9px] uppercase tracking-tighter shrink-0 text-[#1E2A5E]">BMP</div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[#1E2A5E] font-black text-xs truncate uppercase tracking-widest">{item.file.name}</p>
                                                <p className="text-gray-400 text-[10px] font-black uppercase mt-1 tracking-widest leading-none">{fmt(item.file.size)}</p>
                                            </div>
                                            <button onClick={() => removeFile(item.id)} className="text-gray-300 hover:text-red-400 p-2 transition-colors">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-10 pt-8 border-t border-gray-50 uppercase tracking-widest text-[#1E2A5E]">
                                <button
                                    onClick={handleConvert}
                                    disabled={isConverting || selectedFiles.length === 0}
                                    className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-white text-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98] shadow-lg shadow-blue-500/25"
                                    style={{ background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)' }}
                                >
                                    {isConverting ? 'COMPRESSING...' : 'CONVERT TO JPG'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {isConverting && (
                        <div className="p-12 bg-gray-50 border-t border-gray-100 text-center animate-in fade-in duration-500">
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-10 h-10 animate-spin rounded-full border-4 border-[#E2E8F0] border-t-[#4F6EF7]" />
                                <div>
                                    <p className="text-[#1E2A5E] font-black text-sm uppercase tracking-[5px]">COMPRESSING BUFFERS...</p>
                                    <p className="text-gray-400 text-[10px] mt-2 uppercase font-bold tracking-widest leading-none">Mapping Bitmap Objects to Efficient JPG Nodes</p>
                                </div>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-10 max-w-sm mx-auto">
                                <div className="h-full shimmer rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    )}

                    {/* Results Section */}
                    {generatedImages.length > 0 && !isConverting && (
                        <div className="p-10 sm:p-14 bg-white border-t border-gray-100 text-left">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-[#1E2A5E] font-black text-2xl uppercase tracking-tight leading-none">Synthesis Ready!</p>
                                    <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-widest opacity-60">High-Resolution JPG Assets Generated</p>
                                </div>
                                <button onClick={downloadAll} className="text-[10px] font-black uppercase text-[#4F6EF7] tracking-[3px] border-b-2 border-[#4F6EF7] hover:opacity-70 transition-opacity">Batch Download</button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                                {generatedImages.map((img, i) => (
                                    <div key={i} className="img-card bg-gray-50/50 border border-gray-100 rounded-2xl overflow-hidden group animate-in zoom-in-95 duration-500 shadow-sm hover:shadow-xl">
                                        <div className="aspect-square overflow-hidden relative">
                                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-[#1E2A5E]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                 <button onClick={() => downloadImage(img.url, img.name)} className="p-4 bg-white text-[#4F6EF7] rounded-full shadow-lg hover:scale-110 transition-transform">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                 </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div className="p-10 bg-red-50 border-t border-red-100 flex items-start gap-5 text-left transition-all duration-500 animate-in slide-in-from-bottom-5">
                            <svg className="w-7 h-7 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            <div className="flex-1 text-red-900">
                                <p className="font-black text-lg uppercase tracking-tight leading-none">Fault Detected</p>
                                <p className="font-bold text-[10px] mt-2 uppercase tracking-widest opacity-70">{error}</p>
                            </div>
                            <button onClick={() => setError(null)} className="text-red-300 hover:text-red-500 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                        </div>
                    )}
                </div>

                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" /></svg>, title: "Elite Synthesis", text: "Global cloud nodes ensure your massive BMP files are synthesized into efficient JPGs in seconds." },
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L9.03 9.069a1.888 1.888 0 010 3.268L2.166 16.5A2 2 0 010 14.564V6.836c0-1.104.97-1.936 2.166-1.936zM11 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V6z" /></svg>, title: "Batch Logic", text: "Easily upload dozens of BMP files at once. Our system handles massive batch volumes." },
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" /></svg>, title: "Secure Stream", text: "TLS 1.3 encryption ensures your image assets are isolated and purged immediately post-synthesis." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-soft text-left border border-gray-50 flex flex-col items-start gap-6 hover:shadow-xl transition-all h-full">
                            <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg flex items-center justify-center text-white shrink-0">{feature.icon}</div>
                            <div>
                                <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-xs font-black leading-relaxed uppercase tracking-[1px] opacity-70">
                                    {feature.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BmpToJpg;
