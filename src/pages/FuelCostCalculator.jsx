import React, { useState } from 'react';

const FuelCostCalculator = () => {
  const [unit, setUnit] = useState('imperial');
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const onCalculate = () => {
    setError(null);
    const fail = (msg) => {
      setError(msg);
      setIsCalculating(false);
    };

    const d = Number(distance);
    const e = Number(efficiency);
    const p = Number(fuelPrice);

    if (!Number.isFinite(d) || d <= 0) return fail('Enter a valid trip distance greater than 0.');
    if (!Number.isFinite(e) || e <= 0) return fail('Enter a valid fuel economy greater than 0.');
    if (!Number.isFinite(p) || p < 0) return fail('Enter a valid fuel price (0 or more).');

    let fuelUsed;
    let fuelUnit;
    let cost;

    if (unit === 'imperial') {
      fuelUsed = d / e;
      fuelUnit = 'gal';
      cost = fuelUsed * p;
    } else {
      fuelUsed = (d * e) / 100;
      fuelUnit = 'L';
      cost = fuelUsed * p;
    }

    setResult({
      fuelUsed,
      fuelUnit,
      cost,
      distance: d,
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
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
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Fuel Cost Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Estimate trip fuel use and cost from distance, economy, and price per unit.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Units</label>
                <div className="flex gap-2">
                  {[
                    { id: 'imperial', label: 'Miles / MPG / $/gal' },
                    { id: 'metric', label: 'km / L·100km / $/L' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => resetUnit(u.id)}
                      className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                        unit === u.id ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                    Trip distance ({unit === 'imperial' ? 'miles' : 'km'})
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.1"
                    value={distance}
                    onChange={(e) => {
                      setDistance(e.target.value);
                      setResult(null);
                      setError(null);
                    }}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                    placeholder={unit === 'imperial' ? '150' : '240'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                    {unit === 'imperial' ? 'Fuel economy (MPG US)' : 'Consumption (L / 100 km)'}
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.1"
                    value={efficiency}
                    onChange={(e) => {
                      setEfficiency(e.target.value);
                      setResult(null);
                      setError(null);
                    }}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                    placeholder={unit === 'imperial' ? '28' : '7.5'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                    {unit === 'imperial' ? 'Price per gallon' : 'Price per liter'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={fuelPrice}
                    onChange={(e) => {
                      setFuelPrice(e.target.value);
                      setResult(null);
                      setError(null);
                    }}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                    placeholder={unit === 'imperial' ? '3.45' : '1.55'}
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
                  {isCalculating ? 'Calculating...' : 'Calculate Fuel Cost'}
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
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter trip details</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Estimated fuel</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">
                        {result.fuelUsed.toFixed(2)} {result.fuelUnit}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Trip fuel cost</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">{result.cost.toFixed(2)}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium px-1 leading-relaxed">
                      Based on {result.distance.toFixed(1)} {unit === 'imperial' ? 'mi' : 'km'} at your entered economy and price. Actual use varies with driving conditions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Imperial or metric', d: 'MPG and $/gal, or L/100 km and price per liter.' },
            { t: 'Trip math', d: 'Fuel = distance ÷ MPG, or distance × L/100km ÷ 100.' },
            { t: 'Quick quotes', d: 'Rough cost for budgeting — not a substitute for the pump total.' },
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

export default FuelCostCalculator;
