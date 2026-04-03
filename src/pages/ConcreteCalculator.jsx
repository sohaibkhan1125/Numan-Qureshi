import React, { useState } from 'react';

const FT3_PER_M3 = 0.3048 ** 3;
const YD3_PER_M3 = 0.9144 ** 3;
const CU_FT_PER_80LB_BAG = 0.6;

const ConcreteCalculator = () => {
  const [shape, setShape] = useState('slab');
  const [unit, setUnit] = useState('imperial');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [diameter, setDiameter] = useState('');
  const [height, setHeight] = useState('');
  const [wastePct, setWastePct] = useState('5');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const onCalculate = () => {
    setError(null);
    const fail = (msg) => {
      setError(msg);
      setIsCalculating(false);
    };

    const waste = Number(wastePct);
    if (!Number.isFinite(waste) || waste < 0 || waste > 50) {
      fail('Enter waste factor between 0% and 50%.');
      return;
    }
    const factor = 1 + waste / 100;

    let volumeM3;

    if (shape === 'slab') {
      if (unit === 'metric') {
        const l = Number(length);
        const w = Number(width);
        const d = Number(depth);
        if (!Number.isFinite(l) || !Number.isFinite(w) || !Number.isFinite(d) || l <= 0 || w <= 0 || d <= 0) {
          fail('Enter valid length, width, and depth (meters), all greater than 0.');
          return;
        }
        volumeM3 = l * w * d;
      } else {
        const l = Number(length);
        const w = Number(width);
        const dIn = Number(depth);
        if (!Number.isFinite(l) || !Number.isFinite(w) || !Number.isFinite(dIn) || l <= 0 || w <= 0 || dIn <= 0) {
          fail('Enter valid length and width (feet) and depth (inches), all greater than 0.');
          return;
        }
        const dFt = dIn / 12;
        const ft3 = l * w * dFt;
        volumeM3 = ft3 * FT3_PER_M3;
      }
    } else {
      if (unit === 'metric') {
        const d = Number(diameter);
        const h = Number(height);
        if (!Number.isFinite(d) || !Number.isFinite(h) || d <= 0 || h <= 0) {
          fail('Enter valid diameter and height (meters), both greater than 0.');
          return;
        }
        const r = d / 2;
        volumeM3 = Math.PI * r * r * h;
      } else {
        const d = Number(diameter);
        const h = Number(height);
        if (!Number.isFinite(d) || !Number.isFinite(h) || d <= 0 || h <= 0) {
          fail('Enter valid diameter and height (feet), both greater than 0.');
          return;
        }
        const r = d / 2;
        const ft3 = Math.PI * r * r * h;
        volumeM3 = ft3 * FT3_PER_M3;
      }
    }

    const adjustedM3 = volumeM3 * factor;
    const yd3 = adjustedM3 / YD3_PER_M3;
    const ft3 = adjustedM3 / FT3_PER_M3;
    const bags80 = Math.ceil(ft3 / CU_FT_PER_80LB_BAG);

    setResult({
      volumeM3: adjustedM3,
      yd3,
      ft3,
      bags80,
      waste,
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const resetShape = (next) => {
    setShape(next);
    setResult(null);
    setError(null);
  };

  const resetUnit = (next) => {
    setUnit(next);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Concrete Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Estimate volume for slabs and round columns — cubic yards, cubic feet, and 80 lb bag count.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Shape</label>
                <div className="flex gap-2">
                  {[
                    { id: 'slab', label: 'Slab (rectangle)' },
                    { id: 'column', label: 'Round column' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => resetShape(s.id)}
                      className={`flex-1 py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                        shape === s.id ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Units</label>
                <div className="flex gap-2">
                  {[
                    { id: 'imperial', label: 'Imperial (ft / in)' },
                    { id: 'metric', label: 'Metric (m)' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => resetUnit(u.id)}
                      className={`flex-1 py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                        unit === u.id ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>

                {shape === 'slab' ? (
                  <>
                    {unit === 'metric' ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Length (m)</label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={length}
                            onChange={(e) => {
                              setLength(e.target.value);
                              setResult(null);
                              setError(null);
                            }}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                            placeholder="4"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Width (m)</label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={width}
                            onChange={(e) => {
                              setWidth(e.target.value);
                              setResult(null);
                              setError(null);
                            }}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                            placeholder="3"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Depth (m)</label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={depth}
                            onChange={(e) => {
                              setDepth(e.target.value);
                              setResult(null);
                              setError(null);
                            }}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                            placeholder="0.15"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Length (ft)</label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={length}
                            onChange={(e) => {
                              setLength(e.target.value);
                              setResult(null);
                              setError(null);
                            }}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                            placeholder="12"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Width (ft)</label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={width}
                            onChange={(e) => {
                              setWidth(e.target.value);
                              setResult(null);
                              setError(null);
                            }}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                            placeholder="10"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Depth (in)</label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.25"
                            value={depth}
                            onChange={(e) => {
                              setDepth(e.target.value);
                              setResult(null);
                              setError(null);
                            }}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                            placeholder="4"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : unit === 'metric' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Diameter (m)</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={diameter}
                        onChange={(e) => {
                          setDiameter(e.target.value);
                          setResult(null);
                          setError(null);
                        }}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                        placeholder="0.3"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Height (m)</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={height}
                        onChange={(e) => {
                          setHeight(e.target.value);
                          setResult(null);
                          setError(null);
                        }}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                        placeholder="2.4"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Diameter (ft)</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={diameter}
                        onChange={(e) => {
                          setDiameter(e.target.value);
                          setResult(null);
                          setError(null);
                        }}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Height (ft)</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={height}
                        onChange={(e) => {
                          setHeight(e.target.value);
                          setResult(null);
                          setError(null);
                        }}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                        placeholder="8"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Waste factor (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    value={wastePct}
                    onChange={(e) => {
                      setWastePct(e.target.value);
                      setResult(null);
                      setError(null);
                    }}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                    placeholder="5"
                  />
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
                  {isCalculating ? 'Calculating...' : 'Calculate Volume'}
                </button>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-left">
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
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">Result</label>
                {!result ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter dimensions</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Cubic yards</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">{result.yd3.toFixed(3)} yd³</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Cubic feet</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.ft3.toFixed(2)} ft³</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Cubic meters</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.volumeM3.toFixed(3)} m³</p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">80 lb bags (approx.)</p>
                      <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">{result.bags80} bags</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-2 leading-relaxed">
                        Uses ~{CU_FT_PER_80LB_BAG} ft³ per bag as a common rule of thumb; verify with your mix supplier.
                      </p>
                    </div>
                    {result.waste > 0 && (
                      <p className="text-[10px] text-gray-400 font-medium px-1">Includes {result.waste}% waste factor.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Slab or column', d: 'Rectangular pour or round pier — same volume math, clear inputs.' },
            { t: 'Yards & bags', d: 'See cubic yards and a rough 80 lb premix bag count for ordering.' },
            { t: 'Waste buffer', d: 'Add a percentage for spillage and uneven pours before you order.' },
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

export default ConcreteCalculator;
