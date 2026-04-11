import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unlock, Download, Upload, CheckCircle, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { unprotectPdf } from '../services/api';

const UnlockPdf = () => {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
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

    const handleUnlock = async () => {
        if (!file) return;
        if (!password) {
            setError('Please enter the password to unlock this document.');
            return;
        }

        setStatus('processing');
        setError(null);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev < 95) return prev + Math.random() * 5;
                return prev;
            });
        }, 600);

        try {
            const data = await unprotectPdf(file, password);
            clearInterval(interval);
            setUploadProgress(100);
            setResult(data);
            setStatus('success');
        } catch (err) {
            clearInterval(interval);
            setError(err.message || 'Incorrect password or failed to unlock PDF. Please try again.');
            setStatus('error');
        }
    };

    const reset = () => {
        setFile(null);
        setPassword('');
        setResult(null);
        setStatus('idle');
        setError(null);
        setUploadProgress(0);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100"
                    >
                        <Unlock className="w-4 h-4" />
                        PDF Security
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight"
                    >
                        Unlock <span className="text-emerald-500">PDF</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg font-medium max-w-2xl mx-auto opacity-80"
                    >
                        Remove password protection from your PDF files to permanently enable editing, printing and viewing.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(16,185,129,0.05)] border border-emerald-50 relative overflow-hidden"
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
                                {!file ? (
                                    <div 
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}
                                        className={`w-full aspect-[2/1] min-h-[300px] border-4 border-dashed rounded-[2rem] transition-all duration-300 flex flex-col items-center justify-center p-8 group relative ${
                                            isDragging ? 'border-emerald-400 bg-emerald-50' : 'border-slate-100 hover:border-emerald-300 hover:bg-slate-50/50'
                                        }`}
                                    >
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange}
                                            accept=".pdf,application/pdf"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        
                                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 mb-8 ${isDragging ? 'bg-emerald-500 text-white scale-110 rotate-12' : 'bg-emerald-50 text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-100 shadow-sm'}`}>
                                            <Upload className="w-10 h-10" />
                                        </div>

                                        <div className="text-center">
                                            <h3 className="text-2xl font-black text-slate-800 mb-3">Drop protected PDF here</h3>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Upload your file to unlock it</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center">
                                        <div className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 mb-8 relative flex flex-col items-center gap-4">
                                            <button onClick={() => setFile(null)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                                                <Unlock className="w-10 h-10" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-xl font-black text-slate-800 mb-2 truncate max-w-xs mx-auto">{file.name}</h3>
                                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                            
                                            {/* Password Input Section */}
                                            <div className="w-full max-w-md mt-6">
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                                        <KeyRound className="w-5 h-5" />
                                                    </div>
                                                    <input 
                                                        type="password" 
                                                        placeholder="Enter current password..."
                                                        value={password}
                                                        onChange={(e) => {
                                                            setPassword(e.target.value);
                                                            if (error) setError(null);
                                                        }}
                                                        className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-2 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm w-full max-w-md"
                                    >
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleUnlock}
                                    disabled={!file || !password}
                                    className={`mt-8 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95 ${
                                        file && password 
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/25 hover:shadow-emerald-500/40' 
                                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}
                                >
                                    Unlock PDF
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
                                                <stop offset="100%" stopColor="#059669" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-800">
                                        {Math.round(uploadProgress)}%
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Unlocking Document</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                    Decrypting AES protection layers...
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
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-emerald-500/10">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 text-center">Successfully Unlocked!</h3>
                                <p className="text-slate-500 font-medium text-center mb-12 max-w-md">Your PDF document has been safely decrypted and all restrictions removed.</p>
                                
                                <div className="w-full bg-emerald-50/50 rounded-3xl p-6 mb-12 border border-emerald-100 flex items-center justify-between group hover:bg-emerald-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 group-hover:border-emerald-200 transition-all">
                                            <Unlock className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 truncate max-w-[200px]">{result?.FileName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unlocked PDF Document</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={result?.Url}
                                        download
                                        className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all outline-none"
                                    >
                                        <Download className="w-6 h-6" />
                                    </a>
                                </div>

                                <button
                                    onClick={reset}
                                    className="px-10 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all active:scale-95"
                                >
                                    Unlock another file
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {[
                        { title: 'Full Decryption', desc: 'Securely strip out owner restrictions to completely re-enable copy and print functionalities.' },
                        { title: 'Strict Privacy', desc: 'No one reads your data. The processing servers purge all data traces aggressively right after execution.' },
                        { title: 'No Installation', desc: 'Never download shady local executables again. Break solid protection right inside your browser window.' }
                    ].map((feature, i) => (
                        <div key={i} className="p-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 mb-6 shadow-sm border border-emerald-100 mx-auto md:mx-0">
                                <Unlock className="w-6 h-6" />
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

export default UnlockPdf;
