import React, { useState } from 'react';

const AiImageGenerator = () => {
    // ── CONFIG ──────────────────────────────────────────
    const RAPIDAPI_KEY  = '1c527b6cbfmshd48e2f54850385bp1730d3jsnea2a99dd803b';
    const RAPIDAPI_HOST = 'ghibli-image-generator-api-open-ai-4o-image-generation-free.p.rapidapi.com';
    const API_URL       = 'https://ghibli-image-generator-api-open-ai-4o-image-generation-free.p.rapidapi.com/generateghibliimage.php';

    // ── STATE ───────────────────────────────────────────
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [images, setImages] = useState([
        { id: 1, url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=500&q=80', originalPrompt: 'Sample Ghibli 1' },
        { id: 2, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80', originalPrompt: 'Sample Ghibli 2' },
        { id: 3, url: 'https://images.unsplash.com/photo-1620121692029-d088224efc74?auto=format&fit=crop&w=500&q=80', originalPrompt: 'Sample Ghibli 3' },
        { id: 4, url: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&w=500&q=80', originalPrompt: 'Sample Ghibli 4' }
    ]);

    // ── GENERATION LOGIC ────────────────────────────────
    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert("Please enter a prompt first!");
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    size: '1-1',
                    refImage: 'https://pub-static.aiease.ai/ai-storage/2025/09/02/dd9808737f694e25bb3f380508ad262f.jpeg',
                    refWeight: 1
                })
            });

            const data = await response.json();

            if (data.code === 200 && data.result?.data?.results?.length > 0) {
                const result = data.result.data.results[0];
                const newImage = {
                    id: Date.now(),
                    url: result.origin,
                    originalPrompt: prompt
                };
                setImages([newImage, ...images]);
                setPrompt(''); // Clear input after success
            } else {
                throw new Error(data.message || "Cloud generation error");
            }

        } catch (error) {
            console.error("API Error:", error);
            alert("Failed to generate image. Please check your API key or try again later.");
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadImage = async (url) => {
        try {
            const response = await fetch(url, { mode: 'cors' });
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `ghibli-ai-${Date.now()}.webp`;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(link.href);
            }, 100);
        } catch (err) {
            console.warn("Direct download blocked by security origin policy. Opening image in new tab.");
            window.open(url, '_blank');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleGenerate();
    };

    return (
        <div className="min-h-screen bg-white">
            <style dangerouslySetInnerHTML={{ __html: `
                .shimmer {
                    background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
                    background-size: 400px 100%;
                    animation: shimmer 1.5s infinite linear;
                }
                @keyframes shimmer {
                    0%   { background-position: -400px 0; }
                    100% { background-position: 400px 0; }
                }
                .img-container { position: relative; overflow: hidden; border-radius: 20px; }
                .img-overlay {
                    position: absolute; inset: 0; background: rgba(0, 0, 0, 0.4);
                    display: flex; align-items: center; justify-content: center; opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .img-container:hover .img-overlay { opacity: 1; }
            `}} />

            <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                {/* ── HEADER SECTION ──────────────────────────── */}
                <header className="mb-12">
                    <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight text-slate-800">
                        AI Image <span className="text-[#0084FF]">Generator</span>
                    </h1>
                    <p className="text-slate-500 text-base font-semibold max-w-xl mx-auto">
                        Turn your imagination into stunning Ghibli-style artwork with our advanced AI engine.
                    </p>
                </header>

                {/* ── PROMPT BAR SECTION ───────────────────────── */}
                <div className="max-w-3xl mx-auto mb-16 relative">
                    <div className="flex items-center bg-white border border-slate-200 rounded-full pl-6 pr-2 py-2 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.05)] transition-all hover:border-slate-300 focus-within:border-[#0084FF] focus-within:ring-4 focus-within:ring-[#0084FF]/10">
                        <div className="text-slate-400 mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isGenerating}
                            placeholder="Describe what you want to generate (e.g., 'A peaceful cottage in the woods')"
                            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 font-bold placeholder-slate-400 py-2 outline-none text-sm"
                        />
                        
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="bg-[#0084FF] hover:bg-[#0074E0] text-white px-10 py-3 rounded-full font-black text-sm tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                        >
                            {isGenerating ? 'GENREATING...' : 'GENERATE'}
                        </button>
                    </div>
                </div>

                {/* ── LOADER INDICATOR ─────────────────────────── */}
                {isGenerating && (
                    <div className="mt-[-2rem] mb-12 text-center animate-pulse">
                        <p className="text-[10px] font-black text-[#0084FF] tracking-[0.3em] uppercase">Ghibli Engine Synchronizing...</p>
                    </div>
                )}

                {/* ── OUTPUT GRID SECTION ──────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Active Generating Shimmer */}
                    {isGenerating && (
                        <div className="img-container aspect-square shimmer rounded-3xl border border-slate-100"></div>
                    )}

                    {images.map((img) => (
                        <div key={img.id} className="img-container aspect-square overflow-hidden bg-slate-50 border border-slate-100 group shadow-sm hover:shadow-xl transition-all duration-500">
                            <img
                                src={img.url}
                                alt={img.originalPrompt}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            />
                            <div className="img-overlay">
                                <button
                                    onClick={() => downloadImage(img.url)}
                                    className="bg-white text-[#0084FF] p-4 rounded-full shadow-2xl hover:bg-slate-50 transition-all hover:scale-110 active:scale-90"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AiImageGenerator;
