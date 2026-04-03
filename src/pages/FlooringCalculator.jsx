import React, { useState } from 'react';

const M2_PER_FT2 = 0.09290304;

const FlooringCalculator = () => {
  const [unit, setUnit] = useState('imperial');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [wastePct, setWastePct] = useState('10');
  const [boxCoverage, setBoxCoverage] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const onCalculate = () => {
    setError(null);
    const fail = (msg) => {
      setError(msg);
      setIsCalculating(false);
    };

    const l = Number(length);
    const w = Number(width);
    if (!Number.isFinite(l) || !Number.isFinite(w) || l <= 0 || w <= 0) {
      fail('Enter valid room length and width greater than 0.');
      return;
    }

    const waste = Number(wastePct);
    if (!Number.isFinite(waste) || waste < 0 || waste > 50) {
      fail('Waste factor must be between 0% and 50%.');
      return;
    }
    const factor = 1 + waste / 100;

    let areaFt2;
    let areaM2;
    if (unit === 'imperial') {
      areaFt2 = l * w;
      areaM2 = areaFt2 * M2_PER_FT2;
    } else {
      areaM2 = l * w;
      areaFt2 = areaM2 / M2_PER_FT2;
    }

    const adjFt2 = areaFt2 * factor;
    const adjM2 = areaM2 * factor;

    const boxRaw = boxCoverage.trim();
    const boxVal = boxRaw === '' ? null : Number(boxCoverage);
    if (boxRaw !== '' && (!Number.isFinite(boxVal) || boxVal <= 0)) {
      fail('Box coverage must be a positive number (or leave blank).');
      return;
    }

    let boxes = null;
    if (boxVal != null) {
      if (unit === 'imperial') {
        boxes = Math.ceil(adjFt2 / boxVal);
      } else {
        const boxM2 = boxVal;
        boxes = Math.ceil(adjM2 / boxM2);
      }
    }

    const priceRaw = pricePerUnit.trim();
    const priceVal = priceRaw === '' ? null : Number(pricePerUnit);
    if (priceRaw !== '' && (!Number.isFinite(priceVal) || priceVal < 0)) {
      fail('Price per unit must be 0 or more (or leave blank).');
      return;
    }

    let estCost = null;
    if (priceVal != null) {
      estCost = unit === 'imperial' ? adjFt2 * priceVal : adjM2 * priceVal;
    }

    setResult({
      areaFt2,
      areaM2,
      adjFt2,
      adjM2,
      waste,
      boxes,
      boxLabel: unit === 'imperial' ? 'sq ft per box' : 'm² per box',
      estCost,
      priceLabel: unit === 'imperial' ? 'per sq ft' : 'per m²',
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const switchUnit = (next) => {
    setUnit(next);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Flooring Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Room area, waste allowance, and optional box count and material cost.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Units</label>
                <div className="flex gap-2">
                  {[
                    { id: 'imperial', label: 'Feet' },
                    { id: 'metric', label: 'Meters' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => switchUnit(u.id)}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                        unit === u.id ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Length</label>
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
                      placeholder={unit === 'imperial' ? '12' : '4'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Width</label>
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
                      placeholder={unit === 'imperial' ? '10' : '3'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Waste (%)</label>
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
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                    Coverage per box (optional)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={boxCoverage}
                    onChange={(e) => {
                      setBoxCoverage(e.target.value);
                      setResult(null);
                      setError(null);
                    }}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                    placeholder={unit === 'imperial' ? '24' : '1.8'}
                  />
                  <p className="text-[10px] text-gray-400 font-medium">
                    {unit === 'imperial' ? 'Square feet covered by one box.' : 'Square meters covered by one box.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                    Material price (optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pricePerUnit}
                    onChange={(e) => {
                      setPricePerUnit(e.target.value);
                      setResult(null);
                      setError(null);
                    }}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                    placeholder="3.5"
                  />
                  <p className="text-[10px] text-gray-400 font-medium">
                    {unit === 'imperial' ? 'Price per square foot.' : 'Price per square meter.'}
                  </p>
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
                  {isCalculating ? 'Calculating...' : 'Calculate Flooring'}
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
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter room size</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Room area</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.areaFt2.toFixed(2)} ft²</p>
                        <p className="text-sm font-bold text-gray-500 mt-1">{result.areaM2.toFixed(3)} m²</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Needed with waste</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.adjFt2.toFixed(2)} ft²</p>
                        <p className="text-sm font-bold text-gray-500 mt-1">{result.adjM2.toFixed(3)} m²</p>
                        {result.waste > 0 && (
                          <p className="text-[10px] text-gray-400 font-medium mt-2">Includes {result.waste}% waste.</p>
                        )}
                      </div>
                    </div>
                    {result.boxes != null && (
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Boxes (rounded up)</p>
                        <p className="text-2xl font-extrabold text-[#1E2A5E] mt-1">{result.boxes}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-2">Based on {result.boxLabel}.</p>
                      </div>
                    )}
                    {result.estCost != null && (
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Estimated material cost</p>
                        <p className="text-2xl font-extrabold text-[#1E2A5E] mt-1">{result.estCost.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-2">Uses price {result.priceLabel} on area with waste.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Dual units', d: 'Work in feet or meters; see both ft² and m² in results.' },
            { t: 'Waste buffer', d: 'Add a realistic cut and scrap allowance before you order.' },
            { t: 'Order helpers', d: 'Optional box count and rough material cost from your coverage and price.' },
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

export default FlooringCalculator;
