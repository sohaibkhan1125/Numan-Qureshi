import React, { useState } from 'react';

const PaintCalculator = () => {
  const [unit, setUnit] = useState('imperial');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [doors, setDoors] = useState('1');
  const [windows, setWindows] = useState('2');
  const [coats, setCoats] = useState('2');
  const [coverage, setCoverage] = useState('350');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const onInputChange = (setter, value) => {
    setter(value);
    setResult(null);
    setError(null);
  };

  const onCalculate = () => {
    setError(null);
    const l = Number(length);
    const w = Number(width);
    const h = Number(height);
    const d = Number(doors);
    const win = Number(windows);
    const c = Number(coats);
    const cov = Number(coverage);

    if (![l, w, h, d, win, c, cov].every((x) => Number.isFinite(x))) {
      setError('Please enter valid numeric values in all fields.');
      setIsCalculating(false);
      return;
    }
    if (l <= 0 || w <= 0 || h <= 0) {
      setError('Room length, width, and height must be greater than 0.');
      setIsCalculating(false);
      return;
    }
    if (d < 0 || win < 0 || c <= 0 || cov <= 0) {
      setError('Doors/windows must be 0 or more. Coats and coverage must be greater than 0.');
      setIsCalculating(false);
      return;
    }

    let wallArea = 2 * h * (l + w);
    let ceilingArea = l * w;

    const doorArea = unit === 'imperial' ? 21 : 1.95; // ft² / m²
    const windowArea = unit === 'imperial' ? 12 : 1.1; // ft² / m²
    const openingsArea = d * doorArea + win * windowArea;

    let paintableArea = wallArea + ceilingArea - openingsArea;
    if (paintableArea <= 0) {
      setError('Openings area is too large for the provided room dimensions.');
      setIsCalculating(false);
      return;
    }

    const totalAreaWithCoats = paintableArea * c;
    const paintNeeded = totalAreaWithCoats / cov;

    setResult({
      wallArea,
      ceilingArea,
      openingsArea,
      paintableArea,
      totalAreaWithCoats,
      paintNeeded,
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
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Paint Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Estimate paint needed based on room size, openings, coats, and coverage rate.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Units</label>
                <div className="flex gap-2">
                  {[
                    { id: 'imperial', label: 'Feet / ft² / gal' },
                    { id: 'metric', label: 'Meters / m² / L' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setUnit(u.id);
                        onInputChange(setCoverage, u.id === 'imperial' ? '350' : '10');
                      }}
                      className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                        unit === u.id ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Length</label>
                    <input type="number" min="0.1" step="0.1" value={length} onChange={(e) => onInputChange(setLength, e.target.value)} className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" placeholder={unit === 'imperial' ? '12' : '3.5'} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Width</label>
                    <input type="number" min="0.1" step="0.1" value={width} onChange={(e) => onInputChange(setWidth, e.target.value)} className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" placeholder={unit === 'imperial' ? '10' : '3.0'} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Height</label>
                    <input type="number" min="0.1" step="0.1" value={height} onChange={(e) => onInputChange(setHeight, e.target.value)} className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" placeholder={unit === 'imperial' ? '8' : '2.5'} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Doors</label>
                    <input type="number" min="0" step="1" value={doors} onChange={(e) => onInputChange(setDoors, e.target.value)} className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Windows</label>
                    <input type="number" min="0" step="1" value={windows} onChange={(e) => onInputChange(setWindows, e.target.value)} className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Coats</label>
                    <input type="number" min="1" step="1" value={coats} onChange={(e) => onInputChange(setCoats, e.target.value)} className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                      Coverage ({unit === 'imperial' ? 'ft²/gal' : 'm²/L'})
                    </label>
                    <input type="number" min="0.1" step="0.1" value={coverage} onChange={(e) => onInputChange(setCoverage, e.target.value)} className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isCalculating}
                  className="w-full flex items-center justify-center py-5 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)', boxShadow: '0 10px 30px -5px rgba(79,110,247,0.4)' }}
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Paint Needed'}
                </button>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-left">
                    <svg className="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-extrabold text-lg uppercase tracking-tight leading-none text-red-900">Fault Detected</p>
                      <p className="font-bold text-[10px] mt-2 uppercase tracking-widest opacity-70 text-red-700">{error}</p>
                    </div>
                    <button type="button" onClick={() => setError(null)} className="text-red-300 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">Result</label>
                {!result ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter room details</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Paint needed</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">
                        {result.paintNeeded.toFixed(2)} {unit === 'imperial' ? 'gal' : 'L'}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Paintable area</p>
                      <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">
                        {result.paintableArea.toFixed(2)} {unit === 'imperial' ? 'ft²' : 'm²'}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium mt-2">Includes walls + ceiling minus doors/windows.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Walls</p>
                        <p className="text-sm font-extrabold text-[#1E2A5E] mt-1">{result.wallArea.toFixed(2)}</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Ceiling</p>
                        <p className="text-sm font-extrabold text-[#1E2A5E] mt-1">{result.ceilingArea.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Room-based estimate', d: 'Uses wall and ceiling area from room dimensions.' },
            { t: 'Openings adjustment', d: 'Subtracts doors and windows for better paint planning.' },
            { t: 'Coats + coverage', d: 'Adjusts liters/gallons by number of coats and product coverage.' },
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

export default PaintCalculator;

