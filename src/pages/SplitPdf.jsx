import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Download, Upload, CheckCircle, AlertCircle, Loader2, File, ExternalLink } from 'lucide-react';
import { splitPdf } from '../services/api';

const SplitPdf = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

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
            setResults([]);
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
            setResults([]);
            setStatus('idle');
        }
    }, []);

    const handleSplit = async () => {
        if (!file) return;

        setStatus('processing');
        setError(null);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev < 95) return prev + Math.random() * 5;
                return prev;
            });
        }, 800);

        try {
            const files = await splitPdf(file);
            clearInterval(interval);
            setUploadProgress(100);
            setResults(files);
            setStatus('success');
        } catch (err) {
            clearInterval(interval);
            setError(err.message || 'Failed to split PDF. Please try again.');
            setStatus('error');
        }
    };

    const reset = () => {
        setFile(null);
        setResults([]);
        setStatus('idle');
        setError(null);
        setUploadProgress(0);
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
                        <Scissors className="w-4 h-4" />
                        PDF Optimization
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight"
                    >
                        Split <span className="text-emerald-500">PDF</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg font-medium max-w-2xl mx-auto opacity-80"
                    >
                        Separate one PDF into individual pages or sets. Each page will be saved as its own high-quality PDF document.
                    </motion.p>
                </div>

                {/* Main Action Card */}
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
                                        <Upload className="w-10 h-10" />
                                    </div>

                                    {file ? (
                                        <div className="text-center animate-in fade-in zoom-in duration-300">
                                            <h3 className="text-xl font-black text-slate-800 mb-2 truncate max-w-xs mx-auto">{file.name}</h3>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <h3 className="text-2xl font-black text-slate-800 mb-3">Drop your PDF to split</h3>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs text-center px-4">Instantly split every page into a separate document</p>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm w-full"
                                    >
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleSplit}
                                    disabled={!file}
                                    className={`mt-10 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95 ${
                                        file 
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/25 hover:shadow-emerald-500/40' 
                                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}
                                >
                                    Split PDF Now
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
                                            strokeDashoffset={351.85 * (1 - uploadProgress / 100)}
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
                                        {Math.round(uploadProgress)}%
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Splitting document</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                    Creating individual page files...
                                </p>
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
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 text-center">Split Complete!</h3>
                                <p className="text-slate-500 font-medium text-center mb-12 max-w-md">Your PDF has been split into {results.length} separate documents.</p>
                                
                                <div className="w-full max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="grid grid-cols-1 gap-4 mb-12">
                                        {results.map((res, index) => (
                                            <div key={index} className="w-full bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100 flex items-center justify-between group hover:bg-emerald-50/30 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100 group-hover:border-emerald-200 transition-all">
                                                        <File className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 truncate max-w-[200px] text-sm">{res.FileName}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page {index + 1}</p>
                                                    </div>
                                                </div>
                                                <a 
                                                    href={res.Url}
                                                    download
                                                    className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={reset}
                                    className="px-10 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-emerald-500 transition-all active:scale-95"
                                >
                                    Split another file
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Features Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {[
                        { title: 'Page-by-Page', desc: 'Automatically extract every single page from your PDF into its own file.' },
                        { title: 'Quality Preserved', desc: 'The split process maintains the original resolution and vector data of your document.' },
                        { title: 'Cloud Processing', desc: 'Secure encryption and automatic file deletion mean your documents never stay on our server.' }
                    ].map((feature, i) => (
                        <div key={i} className="p-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 mb-6 shadow-sm border border-slate-100 mx-auto md:mx-0">
                                <Scissors className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-black text-slate-800 mb-3 tracking-tight">{feature.title}</h4>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SplitPdf;
