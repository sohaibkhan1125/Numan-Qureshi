import React, { useMemo, useState } from 'react';

const LENGTH_UNITS = [
  { id: 'mm', label: 'Millimeter (mm)', toMeters: 0.001 },
  { id: 'cm', label: 'Centimeter (cm)', toMeters: 0.01 },
  { id: 'm', label: 'Meter (m)', toMeters: 1 },
  { id: 'km', label: 'Kilometer (km)', toMeters: 1000 },
  { id: 'in', label: 'Inch (in)', toMeters: 0.0254 },
  { id: 'ft', label: 'Foot (ft)', toMeters: 0.3048 },
  { id: 'yd', label: 'Yard (yd)', toMeters: 0.9144 },
  { id: 'mi', label: 'Mile (mi)', toMeters: 1609.344 },
];

const LengthConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const unitMap = useMemo(() => {
    const map = {};
    LENGTH_UNITS.forEach((u) => {
      map[u.id] = u;
    });
    return map;
  }, []);

  const onCalculate = () => {
    setError(null);
    const value = Number(inputValue);

    if (!Number.isFinite(value)) {
      setError('Enter a valid numeric length value.');
      setIsCalculating(false);
      return;
    }

    const from = unitMap[fromUnit];
    const to = unitMap[toUnit];

    if (!from || !to) {
      setError('Select valid from/to units.');
      setIsCalculating(false);
      return;
    }

    const meters = value * from.toMeters;
    const converted = meters / to.toMeters;

    setResult({
      input: value,
      fromUnit,
      toUnit,
      converted,
      meters,
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const flipUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
    setError(null);
  };

  const onInputChange = (value) => {
    setInputValue(value);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Length Converter</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Convert between metric and imperial length units instantly.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Inputs</label>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Value</label>
                  <input
                    type="number"
                    step="any"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                    placeholder="1"
                  />
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">From</label>
                    <select
                      value={fromUnit}
                      onChange={(e) => {
                        setFromUnit(e.target.value);
                        setResult(null);
                        setError(null);
                      }}
                      className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                    >
                      {LENGTH_UNITS.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={flipUnits}
                    className="mb-[2px] h-[54px] w-[54px] rounded-xl border-2 border-gray-100 text-gray-500 hover:text-[#4F6EF7] hover:border-[#4F6EF7]/30 transition-all flex items-center justify-center"
                    aria-label="Swap units"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">To</label>
                    <select
                      value={toUnit}
                      onChange={(e) => {
                        setToUnit(e.target.value);
                        setResult(null);
                        setError(null);
                      }}
                      className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                    >
                      {LENGTH_UNITS.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.label}
                        </option>
                      ))}
                    </select>
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
                  {isCalculating ? 'Converting...' : 'Convert Length'}
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
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter conversion values</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Converted value</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">
                        {result.converted.toFixed(8)} {result.toUnit}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Meters reference</p>
                      <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.meters.toFixed(8)} m</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium px-1 leading-relaxed">
                      {result.input} {result.fromUnit} equals {result.converted.toFixed(8)} {result.toUnit}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Metric + imperial', d: 'Convert mm, cm, m, km, in, ft, yd, and mi.' },
            { t: 'Fast swap', d: 'Flip from/to units in one click to compare both directions.' },
            { t: 'Browser-only', d: 'All conversion math runs locally with no data sent.' },
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

export default LengthConverter;

