import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Upload,
    CheckCircle, 
    AlertCircle, 
    Download, 
    ArrowLeft, 
    Code,
    FileCode
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { convertPdfToHtml } from '../services/api';

const PdfToHtml = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
            if (isPdf) {
                setFile(selectedFile);
                setError(null);
                setStatus('idle');
                setResult(null);
            } else {
                setError('Please upload a valid PDF file.');
                setFile(null);
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const isPdf = droppedFile.type === 'application/pdf' || droppedFile.name.toLowerCase().endsWith('.pdf');
            if (isPdf) {
                setFile(droppedFile);
                setError(null);
                setStatus('idle');
                setResult(null);
            } else {
                setError('Please upload a valid PDF file.');
                setFile(null);
            }
        }
    };

    const handleConvert = async () => {
        if (!file) return;

        setStatus('processing');
        setError(null);
        setResult(null);
        setProgress(0);

        console.log('Initiating PDF to HTML conversion for:', file.name);

        // Simulate progress for UI feel
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev < 90) return prev + 2;
                return prev;
            });
        }, 800);

        try {
            const convertedFile = await convertPdfToHtml(file);
            console.log('HTML file received:', convertedFile);
            clearInterval(progressInterval);
            setProgress(100);
            setResult(convertedFile);
            setStatus('success');
        } catch (err) {
            console.error('PDF to HTML Process Error:', err);
            clearInterval(progressInterval);
            setError(err.message || 'An error occurred during conversion. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto">
                <Link to="/pdf-tools" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to PDF Tools
                </Link>

                <div className="text-center mb-12">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-blue-600 rounded-3xl mb-6 mx-auto flex items-center justify-center shadow-lg shadow-blue-200"
                    >
                        <FileCode className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF to HTML</h1>
                    <p className="text-xl text-gray-600">Convert your PDF documents into interactive HTML webpages</p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div 
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                    className={`relative group cursor-pointer rounded-[2rem] border-2 border-dashed transition-all duration-300 p-12 text-center
                                        ${file ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                        className="hidden"
                                    />
                                    <div className="mb-6">
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                            <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                    {file ? (
                                        <div>
                                            <p className="text-xl font-semibold text-gray-900 mb-2">{file.name}</p>
                                            <p className="text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-2xl font-bold text-gray-900 mb-2">Choose PDF File</p>
                                            <p className="text-gray-500">or drop PDF here</p>
                                        </>
                                    )}
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center"
                                    >
                                        <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </motion.div>
                                )}

                                <button
                                    disabled={!file}
                                    onClick={handleConvert}
                                    className={`w-full mt-8 py-5 rounded-2xl font-bold text-lg transition-all transform hover:-translate-y-1 active:scale-95
                                        ${file ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                >
                                    Convert to HTML
                                </button>
                            </motion.div>
                        )}

                        {status === 'processing' && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-12"
                            >
                                <div className="relative w-48 h-48 mx-auto mb-8">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            fill="none"
                                            stroke="#F3F4F6"
                                            strokeWidth="12"
                                        />
                                        <motion.circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            fill="none"
                                            stroke="#2563EB"
                                            strokeWidth="12"
                                            strokeDasharray={552.92}
                                            initial={{ strokeDashoffset: 552.92 }}
                                            animate={{ strokeDashoffset: 552.92 - (552.92 * progress) / 100 }}
                                            transition={{ type: "tween", ease: "easeInOut" }}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-blue-600">{Math.round(progress)}%</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Converting PDF...</h3>
                                <p className="text-gray-500">Generating HTML structure and styling</p>
                            </motion.div>
                        )}

                        {status === 'success' && result && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">Conversion Complete!</h3>
                                <p className="text-gray-600 mb-10">Your PDF has been successfully converted to HTML</p>
                                
                                <div className="bg-gray-50 rounded-3xl p-6 mb-8 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                            <FileCode className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900 truncate max-w-[200px] md:max-w-md">{result.FileName}</p>
                                            <p className="text-sm text-gray-500">HTML Webpage</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={result.Url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Download
                                    </a>
                                </div>

                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-gray-500 font-bold hover:text-gray-700 transition-colors"
                                >
                                    Convert another file
                                </button>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                                    <AlertCircle className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Conversion Failed</h3>
                                <p className="text-red-500 mb-8 max-w-md mx-auto">{error}</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/20">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                            <Code className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Precise Structure</h4>
                        <p className="text-gray-600 text-sm">Maintains original layout, fonts, and images from your PDF document.</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/20">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                            <Upload className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Fast Processing</h4>
                        <p className="text-gray-600 text-sm">Industrial-grade conversion engine handles complex documents in seconds.</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/20">
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Ready to Web</h4>
                        <p className="text-gray-600 text-sm">Result is highly optimized HTML code that ready to be used on any website.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfToHtml;
