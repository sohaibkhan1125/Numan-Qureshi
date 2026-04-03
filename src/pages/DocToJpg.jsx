import React, { useState } from 'react';

const DocToJpg = () => {
    // ── CONFIG ──────────────────────────────────────────
    const API_KEY = 'bqrqv7pk0Cm0HTkQLwtnpVfrOr9KUxL4';
    const API_URL = 'https://v2.convertapi.com/convert/docx/to/jpg?Secret=' + API_KEY;
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB Limit

    // ── STATE ───────────────────────────────────────────
    const [selectedFiles, setSelectedFiles] = useState([]); // array of { file, id }
    const [generatedImages, setGeneratedImages] = useState([]); // { name, blob, url }
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentFile, setCurrentFile] = useState(null);
    const [error, setError] = useState(null);

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

    const b64ToBlob = async (b64, mime = 'image/jpeg') => {
        // High-performance async blob synthesis via data-URL fetch
        try {
            const response = await fetch(`data:${mime};base64,${b64}`);
            return await response.blob();
        } catch (e) {
            const bytes = atob(b64);
            const buf = new ArrayBuffer(bytes.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < bytes.length; i++) view[i] = bytes.charCodeAt(i);
            return new Blob([buf], { type: mime });
        }
    };

    // ── ACTIONS ──────────────────────────────────────────
    const addFiles = (files) => {
        const newFiles = Array.from(files)
            .filter(f => {
                const ext = f.name.toLowerCase().split('.').pop();
                const isValid = ['doc', 'docx'].includes(ext);
                if (f.size > MAX_FILE_SIZE) {
                    setError(`File "${f.name}" exceeds the 50MB stability limit.`);
                    return false;
                }
                return isValid;
            })
            .map(f => ({ file: f, id: Math.random().toString(36).substr(2, 9) }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
        if (newFiles.length > 0) setError(null);
    };

    const removeFile = (id) => {
        setSelectedFiles(prev => prev.filter(item => item.id !== id));
    };

    const handleConvert = async () => {
        if (selectedFiles.length === 0 || isConverting) return;

        setError(null);
        setGeneratedImages([]);
        setIsConverting(true);
        setProgress(0);

        try {
            const results = [];
            let i = 0;

            for (const item of selectedFiles) {
                setCurrentFile(item.file.name);
                
                const b64 = await readB64(item.file);
                
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        Parameters: [{ Name: 'File', FileValue: { Name: item.file.name, Data: b64 } }] 
                    }),
                    cache: 'no-store'
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => null);
                    throw new Error(errData?.Message || `Synthesis Failed: HTTP ${res.status}`);
                }

                const data = await res.json();
                
                for (const f of data.Files) {
                    const blob = await b64ToBlob(f.FileData);
                    results.push({ name: f.FileName, url: URL.createObjectURL(blob), blob });
                }

                i++;
                setProgress((i / selectedFiles.length) * 100);
            }

            setGeneratedImages(results);
            setCurrentFile(null);
        } catch (err) {
            setError(err.message || 'The cloud bridge encountered a synchronization error.');
        } finally {
            setIsConverting(false);
            setCurrentFile(null);
        }
    };

    const downloadAll = () => {
        generatedImages.forEach((img, i) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = img.url;
                link.download = img.name;
                link.click();
            }, i * 400);
        });
    };

    return (
        <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
                
                {/* Header */}
                <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">DOC to JPG</h1>
                    <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
                        High-fidelity document synthesis. Convert Microsoft Word files into optimized JPG gallery assets in seconds.
                    </p>
                </header>

                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left transition-all duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        
                        {/* Left: Upload Zone */}
                        <div className="p-10 sm:p-14 bg-gray-50/30">
                            <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-8">Step 1: Resource Loading</label>
                            
                            <div 
                                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#4F6EF7]'); }}
                                onDragLeave={(e) => { e.currentTarget.classList.remove('border-[#4F6EF7]'); }}
                                onDrop={(e) => { 
                                    e.preventDefault(); 
                                    e.currentTarget.classList.remove('border-[#4F6EF7]'); 
                                    addFiles(e.dataTransfer.files); 
                                }}
                                onClick={() => document.getElementById('fileInput').click()}
                                className="border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-14 cursor-pointer transition-all bg-white group relative hover:border-[#4F6EF7] hover:bg-blue-50/20"
                            >
                                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#1E2A5E] to-[#3B5BDB] flex items-center justify-center text-white mb-6 shadow-lg transition-transform group-hover:scale-105">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-[#1E2A5E] font-black text-lg italic mb-1 uppercase tracking-tight">Select Word Files</p>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none mt-1 opacity-60">Cloud Ready · Multiple Assets</p>
                                </div>
                                <input id="fileInput" type="file" accept=".doc,.docx" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                            </div>

                            <div className="mt-12 space-y-6 pt-10 text-left border-t border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 shadow-sm"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg></div>
                                    <p className="text-gray-400 text-[11px] font-black uppercase tracking-[2px] leading-relaxed">Multi-Page Document Splitting</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 shadow-sm"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg></div>
                                    <p className="text-gray-400 text-[11px] font-black uppercase tracking-[2px] leading-relaxed">High-Res Layout Preservation Logic</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Asset List */}
                        <div className="p-10 sm:p-14 bg-white">
                            <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-8">Step 2: Synthesis Config</label>
                            
                            {selectedFiles.length === 0 ? (
                                <div className="text-center py-20 opacity-20">
                                    <p className="text-[#1E2A5E] font-black uppercase text-[10px] tracking-[5px]">Waiting for Word Docs</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedFiles.map((item) => (
                                        <div key={item.id} className="bg-gray-50/50 border border-gray-100 rounded-3xl p-5 flex items-center gap-5 group animate-in slide-in-from-right-2 duration-300">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#4F6EF7] shadow-sm font-black text-[9px] uppercase tracking-tighter shrink-0 text-center">DOC</div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[#1E2A5E] font-black text-[10px] uppercase tracking-widest truncate">{item.file.name}</p>
                                                <p className="text-gray-400 text-[10px] font-black uppercase mt-1 tracking-widest leading-none">{fmt(item.file.size)}</p>
                                            </div>
                                            <button onClick={() => removeFile(item.id)} className="text-gray-300 hover:text-red-400 p-2 transition-colors">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-10 pt-8 border-t border-gray-50">
                                <button 
                                    disabled={selectedFiles.length === 0 || isConverting}
                                    onClick={handleConvert}
                                    className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-white text-lg transition-all disabled:opacity-20 hover:brightness-110 active:scale-[0.98] shadow-lg shadow-blue-500/30 bg-gradient-to-r from-[#4F6EF7] to-[#7C3AED]"
                                >
                                    {isConverting ? 'Synthesizing...' : 'Convert to JPG'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ProgressMonitor */}
                    {isConverting && (
                        <div className="p-12 bg-gray-50 border-t border-gray-100 text-center animate-in fade-in duration-500">
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-10 h-10 animate-spin rounded-full border-4 border-[#E2E8F0] border-top-[#4F6EF7]"></div>
                                <div>
                                    <p className="text-[#1E2A5E] font-black text-sm uppercase tracking-[5px]">
                                        {currentFile ? `Synthesizing: ${currentFile}` : 'PARSING DOCUMENT NODES...'}
                                    </p>
                                    <p className="text-gray-400 text-[10px] mt-2 uppercase font-black tracking-widest leading-none opacity-50">Mapping Document Buffers to Optimized JPG Nodes</p>
                                </div>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-10 max-w-sm mx-auto">
                                <div 
                                    className="h-full bg-gradient-to-r from-[#4F6EF7] to-[#7C3AED] transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Success Assets Grid */}
                    {generatedImages.length > 0 && (
                        <div className="p-10 sm:p-14 bg-white border-t border-gray-100 text-left animate-in fade-in duration-700">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-[#1E2A5E] font-black text-2xl uppercase tracking-tight leading-none">Synthesis Ready!</p>
                                    <p className="text-gray-400 text-[10px] font-black mt-2 uppercase tracking-widest opacity-60">High-Resolution JPG Pages Generated</p>
                                </div>
                                <button onClick={downloadAll} className="text-[10px] font-black uppercase text-[#4F6EF7] tracking-[3px] border-b-2 border-[#4F6EF7] hover:opacity-70 transition-opacity">Batch Download</button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                                {generatedImages.map((img, i) => (
                                    <div key={i} className="group bg-gray-50/50 border border-gray-100 rounded-2xl overflow-hidden relative animate-in zoom-in-95 duration-500 shadow-sm hover:shadow-xl transition-all">
                                        <div className="aspect-[3/4] overflow-hidden relative">
                                            <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-[#1E2A5E]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                 <a href={img.url} download={img.name} className="p-4 bg-white text-[#4F6EF7] rounded-full shadow-lg hover:scale-110 transition-transform">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                 </a>
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

                {/* Features Section */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {[
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" /></svg>, title: "Elite Engine", text: "Global cloud nodes ensure your Word documents are synthesized into high-density JPG assets in seconds without layout loss." },
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L9.03 9.069a1.888 1.888 0 010 3.268L2.166 16.5A2 2 0 010 14.564V6.836c0-1.104.97-1.936 2.166-1.936zM11 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V6z" /></svg>, title: "Batch Logic", text: "Easily upload multiple DOC/DOCX files at once. Our system handles massive batch volumes with cloud-isolated threads." },
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" /></svg>, title: "Secure Stream", text: "TLS 1.3 encryption ensures your document assets are isolated and purged immediately post-synthesis." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-soft flex flex-col items-start gap-6 hover:shadow-xl transition-all h-full border border-gray-50">
                            <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg flex items-center justify-center text-white shrink-0">{feature.icon}</div>
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
            `}} />
        </div>
    );
};

export default DocToJpg;
