import React, { useState } from 'react';

const COMPOUND_OPTIONS = [
  { id: 'simple', label: 'Simple', n: null },
  { id: '1', label: 'Yearly', n: 1 },
  { id: '4', label: 'Quarterly', n: 4 },
  { id: '12', label: 'Monthly', n: 12 },
  { id: '365', label: 'Daily', n: 365 },
];

const InterestCalculator = () => {
  const [mode, setMode] = useState('12'); // compound frequency id
  const [principal, setPrincipal] = useState('');
  const [annualRatePct, setAnnualRatePct] = useState('');
  const [years, setYears] = useState('');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const onCalculate = () => {
    setError(null);

    const P = Number(principal);
    const ratePct = Number(annualRatePct);
    const t = Number(years);

    if (!Number.isFinite(P) || P < 0) {
      setError('Enter a valid principal amount (0 or more).');
      setIsCalculating(false);
      return;
    }
    if (!Number.isFinite(ratePct) || ratePct < 0) {
      setError('Enter a valid annual interest rate (0 or more).');
      setIsCalculating(false);
      return;
    }
    if (!Number.isFinite(t) || t <= 0) {
      setError('Enter a time period greater than 0 (years).');
      setIsCalculating(false);
      return;
    }

    const R = ratePct / 100;
    let finalAmount;
    let interestEarned;

    const selected = COMPOUND_OPTIONS.find((o) => o.id === mode);
    const n = selected?.n;

    if (mode === 'simple' || n == null) {
      finalAmount = P * (1 + R * t);
    } else {
      finalAmount = P * (1 + R / n) ** (n * t);
    }

    interestEarned = finalAmount - P;

    setResult({
      principal: P,
      annualRatePct: ratePct,
      years: t,
      modeLabel: selected?.label ?? '—',
      finalAmount,
      interestEarned,
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const onInputChange = (setter, value) => {
    setter(value);
    setResult(null);
    setError(null);
  };

  const switchMode = (next) => {
    setMode(next);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Interest Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Estimate simple or compound growth from principal, rate, and time.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Inputs</label>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                    Principal
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={principal}
                    onChange={(e) => onInputChange(setPrincipal, e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                    placeholder="10000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                      Annual rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={annualRatePct}
                      onChange={(e) => onInputChange(setAnnualRatePct, e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                      Time (years)
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={years}
                      onChange={(e) => onInputChange(setYears, e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                      placeholder="10"
                    />
                  </div>
                </div>

                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Interest type</label>
                <div className="flex flex-wrap gap-2">
                  {COMPOUND_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => switchMode(o.id)}
                      className={`py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                        mode === o.id
                          ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]'
                          : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
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
                  {isCalculating ? 'Calculating...' : 'Calculate Interest'}
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
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter loan or savings inputs</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Estimated balance</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">{result.finalAmount.toFixed(2)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Interest earned</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.interestEarned.toFixed(2)}</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Compounding</p>
                        <p className="text-sm font-bold text-[#1E2A5E] mt-2">{result.modeLabel}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium px-1 leading-relaxed">
                      {result.modeLabel === 'Simple'
                        ? 'Simple: balance = principal × (1 + r × t).'
                        : 'Compound: balance = principal × (1 + r/n)^(n×t), n = periods per year.'}{' '}
                      Illustrative only — not financial advice.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Simple or compound', d: 'Compare simple interest with yearly, quarterly, monthly, or daily compounding.' },
            { t: 'Clear inputs', d: 'Principal, annual rate, and time in years — adjust decimals for partial years.' },
            { t: 'Runs locally', d: 'All calculations happen in your browser; nothing is uploaded.' },
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

export default InterestCalculator;
