import React, { useState, useRef, useEffect } from 'react';

const ColorPicker = () => {
    // ── STATE ──────────────────────────────────────────
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [history, setHistory] = useState([]);
    const [sampledColor, setSampledColor] = useState({ hex: '#4F6EF7', rgb: '79, 110, 247', hsl: '229°, 90%, 64%' });
    const [copyFeedback, setCopyFeedback] = useState({ hex: false, rgb: false, hsl: false });
    const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0, show: false, color: '#4F6EF7' });
    const [manualColor, setManualColor] = useState('#4F6EF7');

    const canvasRef = useRef(null);
    const canvasWrapRef = useRef(null);
    const [image, setImage] = useState(null);

    // ── HELPERS ─────────────────────────────────────────
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgbToHslStr = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
                default: break;
            }
        }
        return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
    };

    const updateColorState = (r, g, b) => {
        const hex = rgbToHex(r, g, b);
        setSampledColor({
            hex,
            rgb: `${r}, ${g}, ${b}`,
            hsl: rgbToHslStr(r, g, b)
        });
    };

    const addToHistory = (r, g, b) => {
        const hex = rgbToHex(r, g, b);
        setHistory(prev => {
            if (prev[0] === hex) return prev;
            const next = [hex, ...prev];
            return next.slice(0, 20);
        });
    };

    // ── FILE HANDLING ──────────────────────────────────
    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setIsImageLoaded(true);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            // Scaled fit
            const maxW = Math.min(image.width, 760);
            const scale = maxW / image.width;
            canvas.width = maxW;
            canvas.height = image.height * scale;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    }, [image]);

    // ── INTERACTION ────────────────────────────────────
    const handleMouseMove = (e) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        const ctx = canvas.getContext('2d');
        const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);

        setMagnifierPos({
            x: e.clientX - rect.left - 32,
            y: e.clientY - rect.top - 80,
            show: true,
            color: hex
        });
    };

    const handleMouseLeave = () => setMagnifierPos(prev => ({ ...prev, show: false }));

    const handleClick = (e) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        const ctx = canvas.getContext('2d');
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        
        updateColorState(pixel[0], pixel[1], pixel[2]);
        addToHistory(pixel[0], pixel[1], pixel[2]);

        // Feedback ring
        canvas.style.outline = `3px solid ${rgbToHex(pixel[0], pixel[1], pixel[2])}`;
        setTimeout(() => canvas.style.outline = '', 500);
    };

    const handleManualInput = (e) => {
        const hex = e.target.value;
        setManualColor(hex);
        const rgb = hexToRgb(hex);
        if (rgb) {
            setSampledColor({
                hex: hex.toUpperCase(),
                rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
                hsl: rgbToHslStr(rgb.r, rgb.g, rgb.b)
            });
        }
    };

    const handleHistoryClick = (hex) => {
        const rgb = hexToRgb(hex);
        if (rgb) updateColorState(rgb.r, rgb.g, rgb.b);
    };

    const copyToClipboard = (key, text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyFeedback(prev => ({ ...prev, [key]: true }));
            setTimeout(() => setCopyFeedback(prev => ({ ...prev, [key]: false })), 2000);
        });
    };

    const reset = () => {
        setIsImageLoaded(false);
        setImage(null);
        setHistory([]);
        setManualColor('#4F6EF7');
        setSampledColor({ hex: '#4F6EF7', rgb: '79, 110, 247', hsl: '229°, 90%, 64%' });
    };

    return (
        <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
                
                {/* Header */}
                <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Color Picker</h1>
                    <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
                        Pixel-precise color extraction. Click anywhere on your image to instantly decode HEX, RGB, and HSL values.
                    </p>
                </header>

                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
                    
                    {!isImageLoaded ? (
                        /* Step 1: Upload */
                        <div className="p-10 sm:p-20 text-center">
                            <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-12 leading-none">Step 1: Resource Loading</label>

                            <div 
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                                onClick={() => document.getElementById('fileInput').click()}
                                className="border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center p-16 cursor-pointer transition-all bg-gray-50/50 hover:border-[#4F6EF7] hover:bg-blue-50/20 group mb-10"
                            >
                                <div className="w-16 h-16 rounded-3xl bg-blue-50/50 border border-blue-100 flex items-center justify-center text-[#4F6EF7] mb-6 transition-transform group-hover:scale-105">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                                </div>
                                <p className="text-[#1E2A5E] font-black text-lg italic mb-1 uppercase tracking-tight">Select Image File</p>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1 leading-none">JPG · PNG · WEBP · Click to Pick Color</p>
                                <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                            </div>

                            <div className="border-t border-gray-100 pt-10 flex flex-col items-center gap-4">
                                <p className="text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">— or pick a color manually —</p>
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="w-14 h-14 rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm flex-shrink-0 transition-transform group-hover:scale-105 relative">
                                        <input 
                                            type="color" 
                                            value={manualColor} 
                                            onChange={handleManualInput}
                                            className="absolute inset-0 w-20 h-20 -translate-x-2 -translate-y-2 cursor-pointer border-none" 
                                        />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[#1E2A5E] font-black text-sm uppercase tracking-widest leading-none">Manual Color Input</p>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-2 font-black opacity-60">Browser Native · Instant Decode</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    ) : (
                        /* Step 2: Picker */
                        <div className="animate-in fade-in duration-500">
                            <div className="p-8 sm:p-10 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-2 leading-none">Step 2: Pixel Extraction</label>
                                    <p className="text-xs font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Click anywhere on the image</p>
                                </div>
                                <button onClick={reset} className="text-[10px] font-black uppercase text-gray-300 tracking-[3px] hover:text-red-400 transition-colors border-b border-gray-200 hover:border-red-300 pb-0.5">Load New Image</button>
                            </div>

                            <div className="p-6 sm:p-10 flex flex-col xl:flex-row gap-10 bg-gray-50">
                                <div className="flex-1 relative bg-white rounded-3xl p-4 shadow-sm border border-gray-100/50" ref={canvasWrapRef}>
                                    <canvas 
                                        ref={canvasRef}
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={handleClick}
                                        className="cursor-crosshair block max-w-full rounded-2xl mx-auto shadow-inner"
                                    />
                                    {magnifierPos.show && (
                                        <div 
                                            className="absolute w-16 h-16 rounded-full border-4 border-white shadow-xl pointer-events-none z-20 overflow-hidden"
                                            style={{ 
                                                left: magnifierPos.x, 
                                                top: magnifierPos.y, 
                                                backgroundColor: magnifierPos.color,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    )}
                                    <div className="absolute top-8 right-8 text-[9px] font-black uppercase tracking-widest text-white bg-brand-navy/70 px-4 py-2 rounded-xl pointer-events-none opacity-80 backdrop-blur-sm">Click to sample</div>
                                </div>

                                <div className="w-full xl:w-80 space-y-6 flex-shrink-0">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 leading-none">Sampled Color</p>
                                        <div className="w-full h-32 rounded-3xl border border-white shadow-premium transition-colors duration-200" style={{ backgroundColor: sampledColor.hex }}></div>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            { label: 'HEX', value: sampledColor.hex, key: 'hex' },
                                            { label: 'RGB', value: sampledColor.rgb, key: 'rgb' },
                                            { label: 'HSL', value: sampledColor.hsl, key: 'hsl' }
                                        ].map(item => (
                                            <div key={item.key} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-4 shadow-sm">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-[3px] text-gray-300 mb-2">{item.label}</p>
                                                    <p className="text-[#1E2A5E] font-black text-sm uppercase tracking-widest">{item.value}</p>
                                                </div>
                                                <button 
                                                    onClick={() => copyToClipboard(item.key, item.value)}
                                                    className={`px-5 py-2 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                                                        copyFeedback[item.key] 
                                                        ? 'bg-green-50 border-green-200 text-green-500' 
                                                        : 'border-gray-100 text-gray-400 hover:border-[#4F6EF7] hover:text-[#4F6EF7]'
                                                    }`}
                                                >
                                                    {copyFeedback[item.key] ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 leading-none">Color History</p>
                                        <div className="flex flex-wrap gap-3">
                                            {history.length > 0 ? history.map((c, i) => (
                                                <button 
                                                    key={i} 
                                                    onClick={() => handleHistoryClick(c)}
                                                    className="w-10 h-10 rounded-xl border-4 border-white shadow-md hover:scale-110 transition-transform flex-shrink-0"
                                                    style={{ backgroundColor: c }}
                                                    title={c}
                                                />
                                            )) : (
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-200">No samples yet</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manual Panel (shown alongside upload or if no image) */}
                    {!isImageLoaded && (
                        <div className="p-10 border-t border-gray-50 bg-white animate-in slide-in-from-bottom-2 duration-500">
                             <p className="text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-8 leading-none">Sampled Color</p>
                             <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
                                <div className="w-32 h-32 rounded-[2rem] border-8 border-gray-50 shadow-premium shrink-0 transition-colors duration-200" style={{ backgroundColor: sampledColor.hex }}></div>
                                <div className="space-y-4 flex-1 w-full">
                                    {[
                                        { label: 'HEX', value: sampledColor.hex, key: 'hex' },
                                        { label: 'RGB', value: sampledColor.rgb, key: 'rgb' },
                                        { label: 'HSL', value: sampledColor.hsl, key: 'hsl' }
                                    ].map(item => (
                                        <div key={item.key} className="bg-gray-50/50 rounded-2xl border border-gray-100/50 p-5 flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[3px] text-gray-300 mb-2">{item.label}</p>
                                                <p className="text-[#1E2A5E] font-black text-sm tracking-wider uppercase">{item.value}</p>
                                            </div>
                                            <button 
                                                onClick={() => copyToClipboard(item.key, item.value)}
                                                className={`px-5 py-2 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                                                    copyFeedback[item.key] 
                                                    ? 'bg-green-50 border-green-200 text-green-500 shadow-sm' 
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-[#4F6EF7] hover:text-[#4F6EF7] shadow-sm'
                                                }`}
                                            >
                                                {copyFeedback[item.key] ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486z"/></svg>, title: "Sub-Pixel Accuracy", text: "Our Canvas API engine reads pixel-level RGBA values directly from image data for atom-precise color extraction." },
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/></svg>, title: "Triple-Format Output", text: "Instantly decode any pixel into HEX, RGB, and HSL format, each with a one-click copy button for seamless integration." },
                        { icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/></svg>, title: "Zero-Cloud Privacy", text: "No data leaves your browser. All color detection happens entirely in local memory using the HTML5 Canvas API." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-soft text-left border border-gray-50 flex flex-col items-start gap-6 hover:shadow-xl transition-all h-full">
                            <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg flex items-center justify-center text-white shrink-0">{feature.icon}</div>
                            <div className="flex-1">
                                <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4 leading-none">{feature.title}</h3>
                                <p className="text-gray-400 text-[11px] font-black uppercase leading-relaxed tracking-[1px] opacity-70 italic">{feature.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;
