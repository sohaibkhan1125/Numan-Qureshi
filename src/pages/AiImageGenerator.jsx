import React, { useState } from 'react';

const STYLES = [
  { id: 4, label: 'Default' },
  { id: 1, label: 'Anime' },
  { id: 2, label: 'Realistic' },
  { id: 3, label: 'Fantasy' },
  { id: 5, label: 'Cinematic' },
  { id: 6, label: 'Sketch' },
];

const SIZES = [
  { value: '1-1', label: '1:1 Square' },
  { value: '16-9', label: '16:9 Wide' },
  { value: '9-16', label: '9:16 Portrait' },
];

const SUGGESTIONS = [
  'A futuristic city skyline at sunset',
  'A magical forest with glowing mushrooms',
  'Iron Man and Spider-Man standing together',
  'A majestic dragon over snow-capped mountains',
  'A peaceful Japanese temple in autumn',
];

const AiImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [styleId, setStyleId] = useState(4);
  const [size, setSize] = useState('1-1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first.');
      return;
    }
    setError('');
    setIsGenerating(true);

    try {
      const response = await fetch(
        'https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php',
        {
          method: 'POST',
          headers: {
            'x-rapidapi-key': 'b9b276d0c1msh822603b0c726babp1e9c4djsn4fbc5f965e78',
            'x-rapidapi-host': 'ai-text-to-image-generator-flux-free-api.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt.trim(),
            style_id: styleId,
            size: size,
          }),
        }
      );

      const data = await response.json();

      if (data.final_result && data.final_result.length > 0) {
        const newImages = data.final_result
          .filter((item) => !item.nsfw)
          .map((item) => ({
            id: `${Date.now()}-${item.index}`,
            url: item.origin,
            thumb: item.thumb,
            prompt: prompt.trim(),
          }));

        if (newImages.length === 0) {
          setError('The generated content was flagged. Please try a different prompt.');
        } else {
          setImages((prev) => [...newImages, ...prev]);
        }
      } else {
        setError('No images were returned. Please try again or rephrase your prompt.');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to generate image. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isGenerating) handleGenerate();
  };

  const downloadImage = async (url, promptText) => {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = `gugly-ai-${Date.now()}.webp`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <style>{`
        .img-card { position: relative; overflow: hidden; border-radius: 16px; }
        .img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.3s ease;
          display: flex; flex-direction: column; justify-content: flex-end; padding: 14px;
        }
        .img-card:hover .img-overlay { opacity: 1; }
        .shimmer {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite linear;
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-14">

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-200 mb-5">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800 mb-3">
            AI Image <span className="text-blue-500">Generator</span>
          </h1>
          <p className="text-slate-500 text-base font-medium max-w-xl mx-auto">
            Type a prompt and let our AI create stunning images in seconds — completely free.
          </p>
        </div>

        {/* ── PROMPT INPUT ────────────────────────────────── */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className={`flex items-center bg-white border-2 rounded-2xl pl-5 pr-2 py-2 shadow-sm transition-all ${isGenerating ? 'border-blue-300' : 'border-slate-200 hover:border-slate-300 focus-within:border-blue-400 focus-within:shadow-md focus-within:shadow-blue-500/10'}`}>
            <svg className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <input
              type="text"
              value={prompt}
              onChange={(e) => { setPrompt(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              placeholder="Describe the image you want to generate…"
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-slate-700 font-semibold placeholder-slate-400 py-2 text-sm"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-black text-sm tracking-wide transition-all active:scale-95 shadow-md shadow-blue-500/20 whitespace-nowrap flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                  </svg>
                  Generate
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm font-medium">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* ── STYLE & SIZE CONTROLS ───────────────────────── */}
        <div className="max-w-3xl mx-auto mb-10 flex flex-col sm:flex-row gap-4">
          {/* Style */}
          <div className="flex-1">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Style</p>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyleId(s.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    styleId === s.id
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-500'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="sm:w-56">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Aspect Ratio</p>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    size === s.value
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-500'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── SUGGESTIONS ─────────────────────────────────── */}
        {images.length === 0 && !isGenerating && (
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Try a suggestion</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-500 text-slate-500 text-xs font-semibold rounded-full transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── LOADING SHIMMER ──────────────────────────────── */}
        {isGenerating && (
          <div className="mb-8">
            <p className="text-center text-xs font-black text-blue-500 tracking-[0.3em] uppercase mb-6 animate-pulse">
              ✦ AI is painting your image…
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              <div className="shimmer aspect-square rounded-2xl" />
              <div className="shimmer aspect-square rounded-2xl" />
            </div>
          </div>
        )}

        {/* ── EMPTY STATE ──────────────────────────────────── */}
        {!isGenerating && images.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-400 font-semibold text-sm">Your generated images will appear here</p>
            <p className="text-slate-300 text-xs mt-1">Enter a prompt above and click Generate</p>
          </div>
        )}

        {/* ── IMAGE GRID ───────────────────────────────────── */}
        {images.length > 0 && !isGenerating && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-black text-slate-600">{images.length} image{images.length !== 1 ? 's' : ''} generated</p>
              <button
                onClick={() => setImages([])}
                className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {images.map((img) => (
                <div key={img.id} className="img-card aspect-square bg-slate-100 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="img-overlay">
                    <p className="text-white text-xs font-semibold line-clamp-2 mb-2 leading-relaxed opacity-90">
                      {img.prompt}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadImage(img.url, img.prompt)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-white text-blue-500 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                      <button
                        onClick={() => window.open(img.url, '_blank')}
                        className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
                        title="Open full size"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiImageGenerator;
