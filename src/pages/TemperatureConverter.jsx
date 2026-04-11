import React, { useState, useMemo } from 'react';

// ── Conversion core ─────────────────────────────────────────────────────────
const toKelvin = (value, unit) => {
  switch (unit) {
    case 'C':  return value + 273.15;
    case 'F':  return (value - 32) * (5 / 9) + 273.15;
    case 'K':  return value;
    case 'Ra': return value * (5 / 9);
    case 'Re': return value * (5 / 4) + 273.15;
    default:   return NaN;
  }
};

const fromKelvin = (kelvin, unit) => {
  switch (unit) {
    case 'C':  return kelvin - 273.15;
    case 'F':  return (kelvin - 273.15) * (9 / 5) + 32;
    case 'K':  return kelvin;
    case 'Ra': return kelvin * (9 / 5);
    case 'Re': return (kelvin - 273.15) * (4 / 5);
    default:   return NaN;
  }
};

const UNITS = [
  { id: 'C',  label: 'Celsius',    symbol: '°C',  abbr: 'Celsius (°C)' },
  { id: 'F',  label: 'Fahrenheit', symbol: '°F',  abbr: 'Fahrenheit (°F)' },
  { id: 'K',  label: 'Kelvin',     symbol: 'K',   abbr: 'Kelvin (K)' },
  { id: 'Ra', label: 'Rankine',    symbol: '°Ra', abbr: 'Rankine (°Ra)' },
  { id: 'Re', label: 'Réaumur',   symbol: '°Ré', abbr: 'Réaumur (°Ré)' },
];

// Common reference points in Celsius
const REFERENCES = [
  { label: 'Absolute zero',          C: -273.15 },
  { label: 'Water freezes',          C: 0 },
  { label: 'Room temperature',        C: 22 },
  { label: 'Human body temperature', C: 37 },
  { label: 'Water boils',            C: 100 },
  { label: 'Oven (moderate)',        C: 180 },
];

const fmt = (v) => {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) < 0.0001 && v !== 0) return v.toExponential(4);
  return parseFloat(v.toFixed(6)).toString();
};

// ── Component ────────────────────────────────────────────────────────────────
const TemperatureConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('C');

  const conversions = useMemo(() => {
    const raw = Number(inputValue);
    if (inputValue.trim() === '' || !Number.isFinite(raw)) return null;
    const kelvin = toKelvin(raw, fromUnit);
    if (!Number.isFinite(kelvin)) return null;
    return UNITS.map(u => ({
      ...u,
      value: fromKelvin(kelvin, u.id),
      isSource: u.id === fromUnit,
    }));
  }, [inputValue, fromUnit]);

  const inputClass = 'w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white';
  const sectionLabel = 'block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none';

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">

        {/* Header */}
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">
            Temperature Converter
          </h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Instantly convert between Celsius, Fahrenheit, Kelvin, Rankine, and Réaumur. Results update in real time.
          </p>
        </header>

        {/* Main card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* ── LEFT: Input ── */}
              <div className="space-y-7">

                {/* Unit selector */}
                <div>
                  <label className={sectionLabel}>Input Unit</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {UNITS.map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => { setFromUnit(u.id); }}
                        className={`py-3 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                          fromUnit === u.id
                            ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]'
                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        {u.symbol} {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Value input */}
                <div>
                  <label className={sectionLabel}>Temperature Value</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      className={inputClass + ' pr-16'}
                      placeholder="Enter temperature…"
                      autoFocus
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-[#4F6EF7] text-sm">
                      {UNITS.find(u => u.id === fromUnit)?.symbol}
                    </span>
                  </div>
                </div>

                {/* Quick reference presets */}
                <div>
                  <label className={sectionLabel}>Quick Reference</label>
                  <div className="grid grid-cols-2 gap-2">
                    {REFERENCES.map(ref => {
                      const val = fromKelvin(toKelvin(ref.C, 'C'), fromUnit);
                      return (
                        <button
                          key={ref.label}
                          type="button"
                          onClick={() => setInputValue(parseFloat(val.toFixed(4)).toString())}
                          className="text-left p-3 rounded-xl border-2 border-gray-100 hover:border-[#4F6EF7]/40 hover:bg-[#4F6EF7]/5 transition-all group"
                        >
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#4F6EF7] transition-colors truncate">
                            {ref.label}
                          </p>
                          <p className="text-sm font-extrabold text-[#1E2A5E] mt-0.5">
                            {parseFloat(val.toFixed(2))} {UNITS.find(u => u.id === fromUnit)?.symbol}
                          </p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
                    </svg>
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">
                      Enter a temperature above
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    {conversions.map(conv => (
                      <div
                        key={conv.id}
                        className={`rounded-2xl p-5 border-2 transition-all ${
                          conv.isSource
                            ? 'border-[#4F6EF7] bg-gradient-to-br from-[#4F6EF7]/5 to-[#7C3AED]/5'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${conv.isSource ? 'text-[#4F6EF7]' : 'text-gray-400'}`}>
                              {conv.abbr} {conv.isSource && '· Input'}
                            </p>
                            <p className={`text-2xl font-extrabold mt-0.5 ${conv.isSource ? 'text-[#1E2A5E]' : 'text-[#1E2A5E]'}`}>
                              {fmt(conv.value)}
                              <span className="text-base font-bold ml-2 opacity-50">{conv.symbol}</span>
                            </p>
                          </div>
                          {/* Copy button */}
                          <button
                            type="button"
                            onClick={() => navigator.clipboard?.writeText(fmt(conv.value))}
                            className="p-2 rounded-lg text-gray-300 hover:text-[#4F6EF7] hover:bg-[#4F6EF7]/10 transition-all flex-shrink-0"
                            title="Copy value"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reference table card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.08)] border border-gray-100 overflow-hidden text-left mb-10">
          <div className="p-10 sm:p-14">
            <h2 className="text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-6 leading-none">Common Reference Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 pr-4 text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40">Reference Point</th>
                    {UNITS.map(u => (
                      <th key={u.id} className="pb-3 px-3 text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 text-right">{u.symbol}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REFERENCES.map((ref, i) => {
                    const kelvin = toKelvin(ref.C, 'C');
                    return (
                      <tr key={ref.label} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-gray-50/30' : ''}`}>
                        <td className="py-3 pr-4 text-xs font-bold text-[#1E2A5E]">{ref.label}</td>
                        {UNITS.map(u => (
                          <td key={u.id} className="py-3 px-3 text-xs font-bold text-gray-500 text-right tabular-nums">
                            {parseFloat(fromKelvin(kelvin, u.id).toFixed(2))}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Feature deck */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              t: '5 temperature scales',
              d: 'Covers Celsius, Fahrenheit, Kelvin, Rankine (engineering), and the historical Réaumur scale.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Real-time results',
              d: 'Conversions update instantly as you type. No button needed — see all 5 units change simultaneously.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Quick reference',
              d: 'Tap any common reference point — absolute zero, body temp, boiling point — to instantly load that value.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
            },
          ].map(x => (
            <div key={x.t} className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50">
              <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">
                {x.icon}
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

export default TemperatureConverter;
