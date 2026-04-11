import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, CheckCircle, AlertCircle, Loader2, Type, FileOutput } from 'lucide-react';
import { convertTxtToPdf } from '../services/api';

const TxtToPdf = () => {
    const [text, setText] = useState('');
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleTextChange = (e) => {
        setText(e.target.value);
        if (error) setError(null);
    };

    const handleConvert = async () => {
        const trimmedText = text.trim();
        if (!trimmedText) {
            setError('Please enter some text to convert.');
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
            const data = await convertTxtToPdf(trimmedText);
            clearInterval(interval);
            setUploadProgress(100);
            setResult(data);
            setStatus('success');
        } catch (err) {
            clearInterval(interval);
            setError(err.message || 'Failed to convert text to PDF. Please try again.');
            setStatus('error');
        }
    };

    const reset = () => {
        setText('');
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-purple-100"
                    >
                        <Type className="w-4 h-4" />
                        Write Tool
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight"
                    >
                        Text to <span className="text-purple-600">PDF</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg font-medium max-w-2xl mx-auto opacity-80"
                    >
                        Instantly compile your plain text, notes, and writings into a structured and portable PDF format.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(168,85,247,0.05)] border border-purple-50 relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center w-full"
                            >
                                <div className="w-full relative group">
                                    <div className="absolute top-4 left-4 text-purple-500 pointer-events-none">
                                        <FileText className="w-6 h-6 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                                    </div>
                                    <textarea 
                                        value={text}
                                        onChange={handleTextChange}
                                        placeholder="Start typing or paste your text here to convert into a PDF..."
                                        className="w-full min-h-[300px] bg-slate-50 border-4 border-dashed border-slate-100 hover:border-purple-300 focus:border-purple-400 focus:bg-purple-50/10 rounded-[2rem] p-8 pl-12 pt-12 resize-none transition-all duration-300 outline-none text-slate-700 font-medium leading-relaxed shadow-inner"
                                    />
                                    <div className="absolute bottom-6 right-6 flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{text.length > 0 ? `${text.trim().split(/\s+/).length} words` : ''}</span>
                                    </div>
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
                                    onClick={handleConvert}
                                    disabled={!text.trim()}
                                    className={`mt-10 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95 ${
                                        text.trim() 
                                        ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/25 hover:shadow-purple-500/40' 
                                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}
                                >
                                    Generate PDF File
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
                                    <div className="absolute inset-0 border-8 border-purple-50 rounded-full"></div>
                                    <svg className="w-full h-full rotate-[-90deg]">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            fill="none"
                                            stroke="url(#purple-gradient)"
                                            strokeWidth="8"
                                            strokeDasharray={351.85}
                                            strokeDashoffset={351.85 * (1 - uploadProgress / 100)}
                                            strokeLinecap="round"
                                            className="transition-all duration-500"
                                        />
                                        <defs>
                                            <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#a855f7" />
                                                <stop offset="100%" stopColor="#7e22ce" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-800">
                                        {Math.round(uploadProgress)}%
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Compiling Text</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                                    Structuring lines into PDF vectors...
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
                                <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-purple-500/10">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 text-center">Conversion Complete!</h3>
                                <p className="text-slate-500 font-medium text-center mb-12 max-w-md">Your text input was successfully compiled and embedded into a standard PDF.</p>
                                
                                <div className="w-full bg-purple-50/50 rounded-3xl p-6 mb-12 border border-purple-100 flex items-center justify-between group hover:bg-purple-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-100 group-hover:border-purple-200 transition-all">
                                            <FileOutput className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 truncate max-w-[200px]">{result?.FileName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF Document</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={result?.Url}
                                        download
                                        className="p-4 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-600/30 hover:bg-purple-700 hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <Download className="w-6 h-6" />
                                    </a>
                                </div>

                                <button
                                    onClick={reset}
                                    className="px-10 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all active:scale-95"
                                >
                                    Write another note
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {[
                        { title: 'Immediate Processing', desc: 'Conversions are done instantly entirely independent of complex GUI interfaces.' },
                        { title: 'Standard Encoding', desc: 'Compiles using universally accepted UTF-8 encoding fonts to maintain formatting.' },
                        { title: 'Data Privacy', desc: 'Text arrays are dumped from volatile memory permanently directly post-execution.' }
                    ].map((feature, i) => (
                        <div key={i} className="p-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 mb-6 shadow-sm border border-purple-100 mx-auto md:mx-0">
                                <FileText className="w-6 h-6" />
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

export default TxtToPdf;
