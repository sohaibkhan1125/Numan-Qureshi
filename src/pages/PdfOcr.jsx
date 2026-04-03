import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { convertPdfToOcr } from '../services/api';

const PdfOcr = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [progress, setProgress] = useState(0);

    const validateFile = (file) => {
        if (!file) return false;
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        if (!isPdf) {
            setError('Please upload a valid PDF file.');
            return false;
        }
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            setError('File size exceeds 50MB limit.');
            return false;
        }
        return true;
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
            setError(null);
            setResult(null);
            setStatus('idle');
        }
    };

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
            setFile(droppedFile);
            setError(null);
            setResult(null);
            setStatus('idle');
        }
    }, []);

    const handleConvert = async () => {
        if (!file) return;

        setStatus('processing');
        setError(null);
        setResult(null);
        setProgress(0);

        console.log('Initiating OCR for file:', file.name);

        // Simulate progress for UI feel
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev < 90) return prev + 2;
                return prev;
            });
        }, 800);

        try {
            const convertedFile = await convertPdfToOcr(file);
            console.log('OCR file received:', convertedFile);
            clearInterval(progressInterval);
            setProgress(100);
            setResult(convertedFile);
            setStatus('success');
        } catch (err) {
            console.error('OCR Process Component Error:', err);
            clearInterval(progressInterval);
            setError(err.message || 'An error occurred during OCR processing. Please check your file and try again.');
            setStatus('error');
        }
    };

    const reset = () => {
        setFile(null);
        setResult(null);
        setStatus('idle');
        setError(null);
        setProgress(0);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg>
                        PDF Tools
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight"
                    >
                        PDF <span className="text-emerald-500">OCR</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg font-medium max-w-2xl mx-auto opacity-80"
                    >
                        Convert scanned PDFs into searchable, high-quality PDF documents with advanced OCR technology.
                    </motion.p>
                </div>

                {/* Main Action Tool */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center"
                            >
                                <div 
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                    className={`w-full aspect-[2/1] min-h-[300px] border-4 border-dashed rounded-[2rem] transition-all duration-300 flex flex-col items-center justify-center p-8 group relative ${
                                        isDragging ? 'border-emerald-400 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50/50'
                                    }`}
                                >
                                    <input 
                                        type="file" 
                                        onChange={handleFileChange}
                                        accept=".pdf,application/pdf"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 mb-8 ${isDragging ? 'bg-emerald-500 text-white scale-110 rotate-12' : 'bg-emerald-50 text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-100 shadow-sm'}`}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="12" y1="18" x2="12" y2="12" />
                                            <line x1="9" y1="15" x2="15" y2="15" />
                                        </svg>
                                    </div>

                                    {file ? (
                                        <div className="text-center animate-in fade-in zoom-in duration-300">
                                            <h3 className="text-xl font-black text-slate-800 mb-2 truncate max-w-xs mx-auto">{file.name}</h3>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <h3 className="text-2xl font-black text-slate-800 mb-3">Upload your PDF</h3>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Drag and drop or click to browse</p>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm w-full"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleConvert}
                                    disabled={!file}
                                    className={`mt-10 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95 ${
                                        file 
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/25 hover:shadow-emerald-500/40' 
                                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}
                                >
                                    Start OCR Process
                                </button>
                            </motion.div>
                        )}

                        {status === 'processing' && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center py-12"
                            >
                                <div className="relative w-32 h-32 mb-10">
                                    <div className="absolute inset-0 border-8 border-emerald-50 rounded-full"></div>
                                    <svg className="w-full h-full rotate-[-90deg]">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            fill="none"
                                            stroke="url(#emerald-gradient)"
                                            strokeWidth="8"
                                            strokeDasharray={351.85}
                                            strokeDashoffset={351.85 * (1 - progress / 100)}
                                            strokeLinecap="round"
                                            className="transition-all duration-500"
                                        />
                                        <defs>
                                            <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#34d399" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-800">
                                        {progress}%
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Analyzing Document</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></span>
                                    Applying OCR Technology...
                                </p>
                                
                                <div className="mt-12 w-full max-w-sm h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center py-6"
                            >
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-emerald-500/10">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 text-center">OCR Completed!</h3>
                                <p className="text-slate-500 font-medium text-center mb-12 max-w-md">Your document is now searchable. Download the result below.</p>
                                
                                <div className="w-full bg-slate-50 rounded-3xl p-6 mb-12 border border-slate-100 flex items-center justify-between group hover:bg-emerald-50/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100 group-hover:border-emerald-200 transition-all">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 truncate max-w-[200px]">{result?.FileName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ready to download</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={result?.Url}
                                        download
                                        className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                    </a>
                                </div>

                                <button
                                    onClick={reset}
                                    className="px-10 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-emerald-500 transition-all active:scale-95"
                                >
                                    Process another file
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Info Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="p-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 mb-6 shadow-sm border border-slate-100 mx-auto md:mx-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </div>
                        <h4 className="text-lg font-black text-slate-800 mb-3 tracking-tight">Enterprise Security</h4>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">Your documents are processed securely and deleted automatically after 1 hour.</p>
                    </div>
                    <div className="p-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 mb-6 shadow-sm border border-slate-100 mx-auto md:mx-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <h4 className="text-lg font-black text-slate-800 mb-3 tracking-tight">Searchable Result</h4>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">Instantly convert scanned pages into text-selectable, fully searchable PDF files.</p>
                    </div>
                    <div className="p-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 mb-6 shadow-sm border border-slate-100 mx-auto md:mx-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                        <h4 className="text-lg font-black text-slate-800 mb-3 tracking-tight">Privacy First</h4>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">No data is permanently stored. We value your privacy and security above all.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfOcr;
