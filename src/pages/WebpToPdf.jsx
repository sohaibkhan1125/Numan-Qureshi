import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, Loader2, Download, Image as ImageIcon } from 'lucide-react';
import { jsPDF } from 'jspdf';

const WebpToPdf = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const validateFile = (file) => {
        if (!file) return false;
        const isWebp = file.type === 'image/webp' || /\.webp$/i.test(file.name);
        if (!isWebp) {
            setError('Please upload a valid WebP image file.');
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
        setUploadProgress(10);

        try {
            // Read file as Data URL
            const reader = new FileReader();
            
            const imageData = await new Promise((resolve, reject) => {
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => reject(new Error('Failed to read file.'));
                reader.readAsDataURL(file);
            });

            setUploadProgress(40);

            // Create Image object to get dimensions
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(new Error('Failed to load image.'));
                img.src = imageData;
            });

            setUploadProgress(70);

            // Initialize jsPDF
            // orientation: 'p' (portrait) or 'l' (landscape)
            // unit: 'px'
            // format: [width, height]
            const orientation = img.width > img.height ? 'l' : 'p';
            const pdf = new jsPDF({
                orientation,
                unit: 'px',
                format: [img.width, img.height]
            });

            pdf.addImage(imageData, 'WEBP', 0, 0, img.width, img.height);
            
            setUploadProgress(90);

            // Generate Blob URL
            const pdfBlob = pdf.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            
            setUploadProgress(100);
            setResult({
                FileName: file.name.replace(/\.webp$/i, '.pdf'),
                Url: url
            });
            setStatus('success');
        } catch (err) {
            console.error('Conversion error:', err);
            setError(err.message || 'Failed to convert WebP. Please try again.');
            setStatus('error');
        }
    };

    const reset = () => {
        setFile(null);
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100"
                    >
                        <ImageIcon className="w-4 h-4" />
                        Image Tool
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight"
                    >
                        WebP to <span className="text-blue-500">PDF</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg font-medium max-w-2xl mx-auto opacity-80"
                    >
                        Convert modern WebP images into universally compatible PDF documents locally in your browser.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(59,130,246,0.05)] border border-blue-50 relative overflow-hidden"
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
                                            isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50/50'
                                        }`}
                                    >
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange}
                                            accept=".webp,image/webp"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        
                                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 mb-8 ${isDragging ? 'bg-blue-500 text-white scale-110 rotate-12' : 'bg-blue-50 text-blue-500 group-hover:scale-110 group-hover:bg-blue-100 shadow-sm'}`}>
                                            <Upload className="w-10 h-10" />
                                        </div>

                                        <div className="text-center">
                                            <h3 className="text-2xl font-black text-slate-800 mb-3">Drop WebP image here</h3>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fast client-side local conversion</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center">
                                        <div className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 mb-8 relative flex flex-col items-center gap-4">
                                            <button onClick={() => setFile(null)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100 relative overflow-hidden">
                                                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-xl font-black text-slate-800 mb-2 truncate max-w-xs mx-auto">{file.name}</h3>
                                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm w-full"
                                    >
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleConvert}
                                    disabled={!file}
                                    className={`mt-8 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95 ${
                                        file 
                                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/25 hover:shadow-blue-500/40' 
                                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}
                                >
                                    Convert to PDF
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
                                    <div className="absolute inset-0 border-8 border-blue-50 rounded-full"></div>
                                    <svg className="w-full h-full rotate-[-90deg]">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            fill="none"
                                            stroke="url(#blue-gradient)"
                                            strokeWidth="8"
                                            strokeDasharray={351.85}
                                            strokeDashoffset={351.85 * (1 - uploadProgress / 100)}
                                            strokeLinecap="round"
                                            className="transition-all duration-500"
                                        />
                                        <defs>
                                            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#2563eb" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-800">
                                        {Math.round(uploadProgress)}%
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Rendering Locally</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                    Stitching data-blobs into PDF pages...
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
                                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-blue-500/10">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 text-center">Conversion Complete!</h3>
                                <p className="text-slate-500 font-medium text-center mb-12 max-w-md">Your WebP image file has been successfully formatted into a PDF document client-side.</p>
                                
                                <div className="w-full bg-blue-50/50 rounded-3xl p-6 mb-12 border border-blue-100 flex items-center justify-between group hover:bg-blue-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 group-hover:border-blue-200 transition-all">
                                            <ImageIcon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 truncate max-w-[200px]">{result?.FileName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF Document</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={result?.Url}
                                        download={result?.FileName}
                                        className="p-4 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:scale-110 active:scale-95 transition-all outline-none"
                                    >
                                        <Download className="w-6 h-6" />
                                    </a>
                                </div>

                                <button
                                    onClick={reset}
                                    className="px-10 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all active:scale-95"
                                >
                                    Convert another file
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {[
                        { title: 'Local Only', desc: 'Processing happens entirely in your browser. No image data ever leaves your device.' },
                        { title: 'Aspect Mapping', desc: 'Retains exact image proportions mapping them perfectly to custom PDF page bounds.' },
                        { title: 'Zero API', desc: 'No internet required post-load. No conversion credits or API keys needed.' }
                    ].map((feature, i) => (
                        <div key={i} className="p-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 mb-6 shadow-sm border border-blue-100 mx-auto md:mx-0">
                                <ImageIcon className="w-6 h-6" />
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

export default WebpToPdf;
