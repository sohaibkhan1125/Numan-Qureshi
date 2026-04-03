import React, { useState, useMemo } from 'react';

const TIP_PRESETS = [
  { label: '10%', value: 10 },
  { label: '15%', value: 15 },
  { label: '18%', value: 18 },
  { label: '20%', value: 20 },
  { label: '25%', value: 25 },
  { label: '30%', value: 30 },
];

const fmt = (n) => (Number.isFinite(n) ? n.toFixed(2) : '0.00');

const TipCalculator = () => {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState('');
  const [people, setPeople] = useState('1');
  const [roundMode, setRoundMode] = useState('none'); // 'none' | 'up' | 'nearest'
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const reset = () => { setResult(null); setError(null); };

  // Live preview as user types
  const preview = useMemo(() => {
    const b = Number(bill);
    const t = Number(tipPercent);
    const p = Number(people);
    if (!Number.isFinite(b) || b <= 0) return null;
    if (!Number.isFinite(t) || t < 0) return null;
    if (!Number.isFinite(p) || p < 1) return null;
    const tipAmt = b * (t / 100);
    const total = b + tipAmt;
    const perPerson = total / p;
    return { tipAmt, total, perPerson };
  }, [bill, tipPercent, people]);

  const applyRounding = (val, mode) => {
    if (mode === 'up') return Math.ceil(val * 100) / 100;
    if (mode === 'nearest') return Math.round(val);
    return val;
  };

  const onCalculate = () => {
    setError(null);
    const b = Number(bill);
    const t = Number(tipPercent);
    const p = Number(people);

    if (!Number.isFinite(b) || b <= 0) { setError('Enter a valid bill amount greater than 0.'); setIsCalculating(false); return; }
    if (!Number.isFinite(t) || t < 0) { setError('Enter a valid tip percentage (0 or more).'); setIsCalculating(false); return; }
    if (t > 100) { setError('Tip percentage seems unusually high (> 100%). Please double-check.'); setIsCalculating(false); return; }
    if (!Number.isFinite(p) || p < 1 || !Number.isInteger(p)) { setError('Number of people must be a whole number of at least 1.'); setIsCalculating(false); return; }

    const tipAmt = b * (t / 100);
    const total = b + tipAmt;
    const perPerson = total / p;
    const tipPerPerson = tipAmt / p;

    const roundedPerPerson = applyRounding(perPerson, roundMode);
    const roundedTotal = roundedPerPerson * p;
    const roundedTip = roundedTotal - b;

    setResult({ b, t, p, tipAmt, total, perPerson, tipPerPerson, roundedPerPerson, roundedTotal, roundedTip, roundMode });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const inputClass = 'w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white';
  const sectionLabel = 'block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none';
  const labelClass = 'text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1';

  const isPresetActive = (val) => tipPercent === String(val);

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">

        {/* Header */}
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Tip Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Calculate tip amount, total bill, and per-person split — with rounding options for easy cash payment.
          </p>
        </header>

        {/* Main card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* ── LEFT: Inputs ── */}
              <div className="space-y-6">

                {/* Bill amount */}
                <div>
                  <label className={sectionLabel}>Bill Details</label>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className={labelClass}>Bill amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">$</span>
                        <input
                          type="number" min="0.01" step="0.01"
                          value={bill}
                          onChange={e => { setBill(e.target.value); reset(); }}
                          className={inputClass + ' pl-9'}
                          placeholder="50.00"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={labelClass}>Number of people splitting</label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => { const n = Math.max(1, Number(people) - 1); setPeople(String(n)); reset(); }}
                          className="w-11 h-11 rounded-xl border-2 border-gray-100 flex items-center justify-center text-[#1E2A5E] font-black text-lg hover:border-[#4F6EF7]/40 hover:bg-[#4F6EF7]/5 transition-all"
                        >−</button>
                        <input
                          type="number" min="1" step="1"
                          value={people}
                          onChange={e => { setPeople(e.target.value); reset(); }}
                          className={inputClass + ' text-center flex-1'}
                        />
                        <button
                          type="button"
                          onClick={() => { const n = Number(people) + 1; setPeople(String(n)); reset(); }}
                          className="w-11 h-11 rounded-xl border-2 border-gray-100 flex items-center justify-center text-[#1E2A5E] font-black text-lg hover:border-[#4F6EF7]/40 hover:bg-[#4F6EF7]/5 transition-all"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tip % */}
                <div>
                  <label className={sectionLabel}>Tip Percentage</label>
                  {/* Presets */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {TIP_PRESETS.map(p => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => { setTipPercent(String(p.value)); reset(); }}
                        className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                          isPresetActive(p.value)
                            ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]'
                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Custom tip %</label>
                    <div className="relative">
                      <input
                        type="number" min="0" max="100" step="0.5"
                        value={tipPercent}
                        onChange={e => { setTipPercent(e.target.value); reset(); }}
                        className={inputClass + ' pr-9'}
                        placeholder="18"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">%</span>
                    </div>
                  </div>
                </div>

                {/* Rounding */}
                <div>
                  <label className={sectionLabel}>Rounding Mode</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'none', label: 'Exact' },
                      { id: 'nearest', label: 'Round $' },
                      { id: 'up', label: 'Round up ¢' },
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { setRoundMode(m.id); reset(); }}
                        className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                          roundMode === m.id
                            ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]'
                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isCalculating}
                  className="w-full flex items-center justify-center py-5 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)', boxShadow: '0 10px 30px -5px rgba(79,110,247,0.4)' }}
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Tip'}
                </button>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
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

              {/* ── RIGHT: Results ── */}
              <div className="text-left">
                <label className={sectionLabel}>Result</label>

                {/* Live preview strip */}
                {preview && !result && (
                  <div className="mb-4 p-3 rounded-xl bg-[#4F6EF7]/5 border border-[#4F6EF7]/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#4F6EF7] animate-pulse" />
                    <p className="text-[9px] font-black text-[#4F6EF7] uppercase tracking-widest">
                      Live: ${fmt(preview.total)} total · ${fmt(preview.perPerson)}/person
                    </p>
                  </div>
                )}

                {!result ? (
                  <div className="h-full min-h-[260px] flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30 gap-3">
                    <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
                    </svg>
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter bill details above</p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    {/* Hero: per person */}
                    <div className="bg-gradient-to-br from-[#4F6EF7] to-[#7C3AED] rounded-2xl p-6 text-white">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
                        {result.p > 1 ? `Each person pays (${result.p} people)` : 'Total to pay'}
                      </p>
                      <p className="text-4xl font-extrabold mt-1">${fmt(result.roundedPerPerson)}</p>
                      {result.roundMode !== 'none' && result.roundedPerPerson !== result.perPerson && (
                        <p className="text-[9px] font-bold mt-1 opacity-70">Exact: ${fmt(result.perPerson)} · Adjusted for rounding</p>
                      )}
                    </div>

                    {/* Grid breakdown */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Bill Amount</p>
                        <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">${fmt(result.b)}</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Tip ({result.t}%)</p>
                        <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">${fmt(result.roundedTip)}</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Total Bill</p>
                        <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">${fmt(result.roundedTotal)}</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Tip Per Person</p>
                        <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">${fmt(result.tipPerPerson)}</p>
                      </div>
                    </div>

                    {/* Tip quality label */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 rounded-lg transition-all ${i < Math.round(result.t / 6) ? 'bg-[#4F6EF7]' : 'bg-gray-100'}`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">
                        {result.t < 10 ? 'Poor tip' : result.t < 15 ? 'Minimal tip' : result.t < 20 ? 'Standard tip' : result.t < 25 ? 'Good tip' : 'Excellent tip'}
                      </p>
                    </div>

                    <p className="text-[10px] text-gray-400 font-medium px-1 leading-relaxed">
                      Tip = Bill × (Rate ÷ 100). Per-person = Total ÷ People. {result.roundMode !== 'none' && 'Rounding applied to per‑person amount.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature deck */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              t: 'Preset tip rates',
              d: 'One-tap presets for 10%, 15%, 18%, 20%, 25%, and 30% — or enter any custom percentage.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Group bill splitting',
              d: 'Split the total evenly among any number of diners with +/− controls for quick adjustments.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>,
            },
            {
              t: 'Rounding modes',
              d: 'Round to the nearest dollar or always round up cents — makes cash payment simple and avoids awkward change.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
            },
          ].map(x => (
            <div key={x.t} className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50">
              <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">{x.icon}</div>
              <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">{x.t}</h3>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-widest leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TipCalculator;
