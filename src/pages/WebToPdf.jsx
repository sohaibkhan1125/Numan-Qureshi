import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ShieldCheck, Download, Link as LinkIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { convertWebToPdf } from '../services/api';

const WebToPdf = () => {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [progress, setProgress] = useState(0);

    const validateUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleConvert = async () => {
        if (!validateUrl(url)) {
            setError('Please enter a valid website URL (including http/https).');
            return;
        }

        setStatus('processing');
        setError(null);
        setProgress(10);

        // Simulation for smoother UX
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev < 90) return prev + Math.random() * 5;
                return prev;
            });
        }, 800);

        try {
            const data = await convertWebToPdf(url);
            clearInterval(interval);
            setProgress(100);
            setResult({
                FileName: data.FileName || 'web-capture.pdf',
                Url: data.Url
            });
            setStatus('success');
        } catch (err) {
            clearInterval(interval);
            console.error('Conversion error:', err);
            setError(err.message || 'Failed to convert website to PDF. Please try again.');
            setStatus('error');
        }
    };

    const reset = () => {
        setUrl('');
        setResult(null);
        setStatus('idle');
        setError(null);
        setProgress(0);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-indigo-100"
                    >
                        <Globe className="w-4 h-4" />
                        Web Utility
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight"
                    >
                        Web to <span className="text-indigo-500">PDF</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg font-medium max-w-2xl mx-auto opacity-80"
                    >
                        Convert any website URL into a professional, high-fidelity PDF document in seconds using our advanced cloud renderer.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(99,102,241,0.05)] border border-indigo-50 relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-full max-w-2xl">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <LinkIcon className="w-6 h-6" />
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="Enter website URL (e.g., https://google.com)"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-6 pl-16 pr-8 font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 transition-all text-lg"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-8 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-3 text-red-600 font-bold text-sm w-full max-w-2xl shadow-sm"
                                    >
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleConvert}
                                    disabled={!url}
                                    className={`mt-10 px-16 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95 ${
                                        url 
                                        ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/25 hover:shadow-indigo-500/40' 
                                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}
                                >
                                    Convert to PDF
                                </button>
                                
                                <p className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    Supports full page layout rendering
                                </p>
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
                                    <div className="absolute inset-0 border-8 border-indigo-50 rounded-full"></div>
                                    <svg className="w-full h-full rotate-[-90deg]">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            fill="none"
                                            stroke="url(#indigo-gradient-api)"
                                            strokeWidth="8"
                                            strokeDasharray={351.85}
                                            strokeDashoffset={351.85 * (1 - progress / 100)}
                                            strokeLinecap="round"
                                            className="transition-all duration-500"
                                        />
                                        <defs>
                                            <linearGradient id="indigo-gradient-api" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#4f46e5" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-800">
                                        {Math.round(progress)}%
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Remote Rendering</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                    Capturing website viewport...
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
                                <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-500/10">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 text-center">Ready!</h3>
                                <p className="text-slate-500 font-medium text-center mb-12 max-w-md">Your website has been successfully converted to a PDF document.</p>
                                
                                <div className="w-full bg-indigo-50/50 rounded-3xl p-6 mb-12 border border-indigo-100 flex items-center justify-between group hover:bg-indigo-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 group-hover:border-indigo-200 transition-all">
                                            <Globe className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 truncate max-w-[200px]">{result?.FileName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Web Capture PDF</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={result?.Url}
                                        download={result?.FileName}
                                        className="p-4 bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 hover:scale-110 active:scale-95 transition-all outline-none"
                                    >
                                        <Download className="w-6 h-6" />
                                    </a>
                                </div>

                                <button
                                    onClick={reset}
                                    className="px-10 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all active:scale-95"
                                >
                                    Convert another URL
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {[
                        { title: 'High Fidelity', desc: 'Retains all fonts, styles, and layout elements exactly as seen in your browser.' },
                        { title: 'Multi-Page Support', desc: 'Automatically splits long webpages into properly formatted PDF pages.' },
                        { title: 'Cloud Processing', desc: 'Fast, secure cloud-based rendering ensures zero data loss and accurate captura.' }
                    ].map((feature, i) => (
                        <div key={i} className="p-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-indigo-100 mx-auto md:mx-0">
                                <ShieldCheck className="w-6 h-6" />
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

export default WebToPdf;
