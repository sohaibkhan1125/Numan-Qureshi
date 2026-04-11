import React, { useState } from 'react';

const ProfitMarginCalculator = () => {
  const [mode, setMode] = useState('revenue-cost'); // revenue-cost | revenue-margin | cost-margin
  const [revenue, setRevenue] = useState('');
  const [cost, setCost] = useState('');
  const [marginPct, setMarginPct] = useState('');

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

    const R = Number(revenue);
    const C = Number(cost);
    const M = Number(marginPct);

    const validNum = (n) => Number.isFinite(n);

    if (mode === 'revenue-cost') {
      if (!validNum(R) || R <= 0) {
        setError('Enter a valid revenue greater than 0.');
        setIsCalculating(false);
        return;
      }
      if (!validNum(C) || C < 0) {
        setError('Enter a valid cost (0 or more).');
        setIsCalculating(false);
        return;
      }

      const profit = R - C;
      const margin = (profit / R) * 100;
      setResult({
        revenue: R,
        cost: C,
        profit,
        marginPct: margin,
      });
    } else if (mode === 'revenue-margin') {
      if (!validNum(R) || R <= 0) {
        setError('Enter a valid revenue greater than 0.');
        setIsCalculating(false);
        return;
      }
      if (!validNum(M)) {
        setError('Enter a valid margin percentage.');
        setIsCalculating(false);
        return;
      }
      if (M >= 100) {
        setError('Margin must be less than 100%.');
        setIsCalculating(false);
        return;
      }

      const profit = (M / 100) * R;
      const calculatedCost = R - profit;
      setResult({
        revenue: R,
        cost: calculatedCost,
        profit,
        marginPct: M,
      });
    } else {
      // cost-margin
      if (!validNum(C) || C < 0) {
        setError('Enter a valid cost (0 or more).');
        setIsCalculating(false);
        return;
      }
      if (!validNum(M)) {
        setError('Enter a valid margin percentage.');
        setIsCalculating(false);
        return;
      }
      if (M >= 100) {
        setError('Margin must be less than 100%.');
        setIsCalculating(false);
        return;
      }
      if (M === 100) {
        setError('Margin cannot be exactly 100%.');
        setIsCalculating(false);
        return;
      }
      if (C === 0) {
        setError('Cost of 0 makes revenue undefined for a given margin.');
        setIsCalculating(false);
        return;
      }

      // Margin = (R - C) / R
      // => R = C / (1 - margin)
      const margin = M / 100;
      const denom = 1 - margin;
      if (denom <= 0) {
        setError('Margin results in invalid revenue. Try a smaller margin.');
        setIsCalculating(false);
        return;
      }

      const calculatedRevenue = C / denom;
      const profit = calculatedRevenue - C;
      setResult({
        revenue: calculatedRevenue,
        cost: C,
        profit,
        marginPct: M,
      });
    }

    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const switchMode = (next) => {
    setMode(next);
    setResult(null);
    setError(null);
  };

  const modeLabel =
    mode === 'revenue-cost'
      ? 'Revenue & Cost'
      : mode === 'revenue-margin'
        ? 'Revenue & Margin %'
        : 'Cost & Margin %';

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Profit Margin Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Estimate profit and margin % from revenue and cost, or from a margin % input.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Mode</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: 'revenue-cost', label: 'Revenue + Cost' },
                    { id: 'revenue-margin', label: 'Revenue + Margin %' },
                    { id: 'cost-margin', label: 'Cost + Margin %' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => switchMode(m.id)}
                      className={`py-3 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                        mode === m.id
                          ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]'
                          : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Revenue</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={revenue}
                    onChange={(e) => onInputChange(setRevenue, e.target.value)}
                    disabled={mode === 'cost-margin'}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="1000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Cost</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cost}
                    onChange={(e) => onInputChange(setCost, e.target.value)}
                    disabled={mode === 'revenue-margin'}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Margin %</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={marginPct}
                    onChange={(e) => onInputChange(setMarginPct, e.target.value)}
                    disabled={mode === 'revenue-cost'}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="40"
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
                  {isCalculating ? 'Calculating...' : 'Calculate Margin'}
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
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">
                      Enter values ({modeLabel})
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Profit</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">{result.profit.toFixed(2)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Revenue</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.revenue.toFixed(2)}</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Cost</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.cost.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Profit Margin</p>
                      <p className="text-2xl font-extrabold text-[#1E2A5E] mt-1">
                        {result.marginPct.toFixed(2)}%
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium mt-2">
                        Margin = (Revenue - Cost) / Revenue × 100
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Flexible inputs', d: 'Choose revenue+cost, revenue+margin%, or cost+margin%.' },
            { t: 'Consistent margin math', d: 'Always uses margin = (R - C) / R × 100.' },
            { t: 'Client-side only', d: 'Runs locally — no uploads or external calls.' },
          ].map((x) => (
            <div key={x.t} className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50">
              <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4h12v12H4z" />
                  <path d="M7 7h6v2H7z" />
                  <path d="M7 11h4v2H7z" />
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

export default ProfitMarginCalculator;

