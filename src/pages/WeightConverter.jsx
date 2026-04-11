import React, { useState, useMemo } from 'react';

// ── Unit definitions (conversion factor TO grams) ────────────────────────────
const UNITS = [
  { id: 'kg',    label: 'Kilogram',         symbol: 'kg',    toGram: 1000 },
  { id: 'g',     label: 'Gram',             symbol: 'g',     toGram: 1 },
  { id: 'mg',    label: 'Milligram',        symbol: 'mg',    toGram: 0.001 },
  { id: 'mcg',   label: 'Microgram',        symbol: 'μg',    toGram: 0.000001 },
  { id: 't',     label: 'Metric Ton',       symbol: 't',     toGram: 1_000_000 },
  { id: 'lb',    label: 'Pound',            symbol: 'lb',    toGram: 453.59237 },
  { id: 'oz',    label: 'Ounce',            symbol: 'oz',    toGram: 28.3495231 },
  { id: 'st',    label: 'Stone',            symbol: 'st',    toGram: 6350.29318 },
  { id: 'ton_us',label: 'Short Ton (US)',   symbol: 'ton',   toGram: 907184.74 },
  { id: 'ton_uk',label: 'Long Ton (UK)',    symbol: 'LT',    toGram: 1016046.91 },
  { id: 'ct',    label: 'Carat',            symbol: 'ct',    toGram: 0.2 },
  { id: 'gr',    label: 'Grain',            symbol: 'gr',    toGram: 0.06479891 },
  { id: 'toz',   label: 'Troy Ounce',       symbol: 'toz',   toGram: 31.1034768 },
  { id: 'tlb',   label: 'Troy Pound',       symbol: 'tlb',   toGram: 373.2417216 },
];

const GROUPS = [
  { label: 'Metric', ids: ['kg', 'g', 'mg', 'mcg', 't'] },
  { label: 'Imperial / US', ids: ['lb', 'oz', 'st', 'ton_us', 'ton_uk'] },
  { label: 'Precious Metals', ids: ['ct', 'gr', 'toz', 'tlb'] },
];

// Quick reference weights (in grams)
const REFERENCES = [
  { label: 'Paperclip',           g: 1 },
  { label: 'AA Battery',          g: 23 },
  { label: 'Tennis ball',         g: 57 },
  { label: 'Can of soda',         g: 375 },
  { label: 'Loaf of bread',       g: 680 },
  { label: 'Average brick',       g: 2000 },
];

const fmtVal = (v) => {
  if (!Number.isFinite(v)) return '—';
  if (v === 0) return '0';
  if (Math.abs(v) < 0.000001) return v.toExponential(4);
  if (Math.abs(v) < 0.001) return parseFloat(v.toFixed(8)).toString();
  if (Math.abs(v) < 1) return parseFloat(v.toFixed(6)).toString();
  if (Math.abs(v) < 1000) return parseFloat(v.toFixed(4)).toString();
  return parseFloat(v.toFixed(2)).toLocaleString();
};

// ── Component ─────────────────────────────────────────────────────────────────
const WeightConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('kg');

  const unitMap = useMemo(() => Object.fromEntries(UNITS.map(u => [u.id, u])), []);

  const conversions = useMemo(() => {
    const raw = Number(inputValue);
    if (inputValue.trim() === '' || !Number.isFinite(raw) || raw < 0) return null;
    const grams = raw * unitMap[fromUnit].toGram;
    return UNITS.map(u => ({
      ...u,
      value: grams / u.toGram,
      isSource: u.id === fromUnit,
    }));
  }, [inputValue, fromUnit, unitMap]);

  const sectionLabel = 'block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none';
  const inputClass   = 'w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white';

  const sourceUnit = unitMap[fromUnit];

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">

        {/* Header */}
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Weight Converter</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Convert between 14 weight units across metric, imperial, and precious‑metal scales. Results update in real time.
          </p>
        </header>

        {/* Main card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* ── LEFT: Input + Unit selector ── */}
              <div className="space-y-7">

                {/* Value input */}
                <div>
                  <label className={sectionLabel}>Enter Value</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      className={inputClass + ' pr-16'}
                      placeholder="Enter weight…"
                      autoFocus
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-[#4F6EF7] text-sm">
                      {sourceUnit?.symbol}
                    </span>
                  </div>
                </div>

                {/* Unit selector by group */}
                <div className="space-y-4">
                  <label className={sectionLabel}>Input Unit</label>
                  {GROUPS.map(group => (
                    <div key={group.label}>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2">{group.label}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {group.ids.map(id => {
                          const u = unitMap[id];
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setFromUnit(id)}
                              className={`py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all text-left leading-tight ${
                                fromUnit === id
                                  ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]'
                                  : 'border-gray-100 text-gray-400 hover:border-gray-200'
                              }`}
                            >
                              <span className="text-[11px] font-extrabold block">{u.symbol}</span>
                              <span className="truncate block opacity-70">{u.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick reference */}
                <div>
                  <label className={sectionLabel}>Quick Reference</label>
                  <div className="grid grid-cols-2 gap-2">
                    {REFERENCES.map(ref => {
                      const val = ref.g / unitMap[fromUnit].toGram;
                      return (
                        <button
                          key={ref.label}
                          type="button"
                          onClick={() => setInputValue(parseFloat((ref.g / unitMap[fromUnit].toGram).toFixed(6)).toString())}
                          className="text-left p-3 rounded-xl border-2 border-gray-100 hover:border-[#4F6EF7]/40 hover:bg-[#4F6EF7]/5 transition-all group"
                        >
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#4F6EF7] transition-colors truncate">{ref.label}</p>
                          <p className="text-sm font-extrabold text-[#1E2A5E] mt-0.5">{fmtVal(val)} {sourceUnit?.symbol}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Results ── */}
              <div className="text-left">
                <label className={sectionLabel}>All Conversions</label>

                {!conversions ? (
                  <div className="h-full min-h-[260px] flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30 gap-3">
                    <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter a weight above</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1 custom-scrollbar animate-in fade-in duration-300">
                    {GROUPS.map(group => (
                      <div key={group.label}>
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-4 mb-2 px-1">{group.label}</p>
                        {group.ids.map(id => {
                          const conv = conversions.find(c => c.id === id);
                          return (
                            <div
                              key={id}
                              className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 border-2 mb-2 transition-all ${
                                conv.isSource
                                  ? 'border-[#4F6EF7] bg-[#4F6EF7]/5'
                                  : 'border-gray-100 bg-white hover:border-gray-200'
                              }`}
                            >
                              <div className="min-w-0">
                                <p className={`text-[9px] font-black uppercase tracking-widest ${conv.isSource ? 'text-[#4F6EF7]' : 'text-gray-400'}`}>
                                  {conv.label} {conv.isSource && '· Input'}
                                </p>
                                <p className="text-lg font-extrabold text-[#1E2A5E] mt-0.5 truncate">
                                  {fmtVal(conv.value)}
                                  <span className="text-sm font-bold ml-2 opacity-40">{conv.symbol}</span>
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => navigator.clipboard?.writeText(fmtVal(conv.value))}
                                className="p-2 rounded-lg text-gray-300 hover:text-[#4F6EF7] hover:bg-[#4F6EF7]/10 transition-all flex-shrink-0"
                                title="Copy"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ))}
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
              t: '14 weight units',
              d: 'Covers metric (kg, g, mg, μg, t), imperial/US (lb, oz, st, short/long ton), and precious metal (carat, grain, troy oz/lb) units.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 5.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Real-time results',
              d: 'All 14 conversions update instantly as you type, grouped by Metric, Imperial, and Precious Metal categories.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Quick reference weights',
              d: 'Tap any common object (paperclip, brick, battery, etc.) to instantly load its equivalent weight in your selected unit.',
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

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8f8f8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4F6EF7; }
      `}} />
    </div>
  );
};

export default WeightConverter;
