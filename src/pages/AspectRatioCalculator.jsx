import React, { useMemo, useState } from 'react';

const AspectRatioCalculator = () => {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [newWidth, setNewWidth] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const gcd = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  };

  const reducedRatio = useMemo(() => {
    if (!result) return null;
    const g = gcd(result.baseW, result.baseH);
    return `${result.baseW / g}:${result.baseH / g}`;
  }, [result]);

  const onCalculate = () => {
    setError(null);
    const w = Number(width);
    const h = Number(height);
    const nw = newWidth === '' ? null : Number(newWidth);
    const nh = newHeight === '' ? null : Number(newHeight);

    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      setError('Please enter valid base width and height greater than 0.');
      return;
    }

    if ((nw == null || nw <= 0) && (nh == null || nh <= 0)) {
      setError('Enter either new width or new height to calculate scaled dimensions.');
      return;
    }

    if (nw != null && nh != null && (nw <= 0 || nh <= 0)) {
      setError('Scaled width and height must be greater than 0.');
      return;
    }

    let outW = nw;
    let outH = nh;
    const ratio = w / h;

    if (outW != null && (outH == null || outH <= 0)) {
      outH = Math.round(outW / ratio);
    } else if (outH != null && (outW == null || outW <= 0)) {
      outW = Math.round(outH * ratio);
    }

    // If both are supplied, keep them and show "actual" ratio difference too.
    const outRatio = outW / outH;
    const mismatchPct = Math.abs((outRatio - ratio) / ratio) * 100;

    setResult({
      baseW: Math.round(w),
      baseH: Math.round(h),
      scaledW: Math.round(outW),
      scaledH: Math.round(outH),
      ratio,
      outRatio,
      mismatchPct,
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Aspect Ratio Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Calculate proportional dimensions and simplified aspect ratio instantly.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Step 1: Enter Dimensions
                </label>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Width</label>
                      <input
                        type="number"
                        min="1"
                        value={width}
                        onChange={(e) => {
                          setWidth(e.target.value);
                          setResult(null);
                          setError(null);
                        }}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                        placeholder="1920"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Height</label>
                      <input
                        type="number"
                        min="1"
                        value={height}
                        onChange={(e) => {
                          setHeight(e.target.value);
                          setResult(null);
                          setError(null);
                        }}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                        placeholder="1080"
                      />
                    </div>
                  </div>

                  <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 pt-2 leading-none">
                    Step 2: Scaled Target (fill one or both)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">New Width</label>
                      <input
                        type="number"
                        min="1"
                        value={newWidth}
                        onChange={(e) => {
                          setNewWidth(e.target.value);
                          setResult(null);
                          setError(null);
                        }}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                        placeholder="1280"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">New Height</label>
                      <input
                        type="number"
                        min="1"
                        value={newHeight}
                        onChange={(e) => {
                          setNewHeight(e.target.value);
                          setResult(null);
                          setError(null);
                        }}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                        placeholder="720"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isCalculating}
                    className="w-full flex items-center justify-center py-5 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                    style={{
                      background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)',
                      boxShadow: '0 10px 30px -5px rgba(79,110,247,0.4)',
                    }}
                  >
                    {isCalculating ? 'Calculating...' : 'Calculate Ratio'}
                  </button>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-left">
                    <svg className="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="font-extrabold text-lg uppercase tracking-tight leading-none text-red-900">Fault Detected</p>
                      <p className="font-bold text-[10px] mt-2 uppercase tracking-widest opacity-70 text-red-700">{error}</p>
                    </div>
                    <button type="button" onClick={() => setError(null)} className="text-red-300 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Step 3: Result
                </label>
                {!result ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter dimensions to calculate</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Simplified ratio</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">{reducedRatio}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Scaled width</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.scaledW}px</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Scaled height</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.scaledH}px</p>
                      </div>
                    </div>

                    <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Ratio difference</p>
                      <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.mismatchPct.toFixed(2)}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Proportional Scaling', d: 'Instantly compute matching dimensions while preserving aspect ratio.' },
            { t: 'Quick Validation', d: 'Detect ratio mismatches when both custom width and height are provided.' },
            { t: 'Responsive UI', d: 'Built to work smoothly across mobile and desktop interfaces.' },
          ].map((x) => (
            <div key={x.t} className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50">
              <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4h12v12H4z" />
                  <path d="M7 7h6v6H7z" />
                </svg>
              </div>
              <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">{x.t}</h3>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-widest leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AspectRatioCalculator;

