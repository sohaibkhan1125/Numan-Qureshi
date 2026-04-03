import React, { useState } from 'react';

const SalesTaxCalculator = () => {
  const [mode, setMode] = useState('add'); // 'add' | 'remove' | 'find'
  const [price, setPrice] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [priceWithTax, setPriceWithTax] = useState('');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const resetOnChange = () => {
    setResult(null);
    setError(null);
  };

  const fail = (msg) => {
    setError(msg);
    setIsCalculating(false);
  };

  const onCalculate = () => {
    setError(null);

    if (mode === 'add') {
      // Add tax to a before-tax price
      const p = Number(price);
      const r = Number(taxRate);

      if (!Number.isFinite(p) || p <= 0) return fail('Enter a valid pre-tax price greater than 0.');
      if (!Number.isFinite(r) || r < 0) return fail('Enter a valid tax rate (0 or more).');
      if (r > 100) return fail('Tax rate cannot exceed 100%.');

      const taxAmount = p * (r / 100);
      const totalPrice = p + taxAmount;

      setResult({ mode: 'add', pretax: p, taxRate: r, taxAmount, totalPrice });

    } else if (mode === 'remove') {
      // Remove tax from a tax-inclusive price (reverse calculation)
      const total = Number(priceWithTax);
      const r = Number(taxRate);

      if (!Number.isFinite(total) || total <= 0) return fail('Enter a valid price (including tax) greater than 0.');
      if (!Number.isFinite(r) || r < 0) return fail('Enter a valid tax rate (0 or more).');
      if (r > 100) return fail('Tax rate cannot exceed 100%.');

      const pretax = total / (1 + r / 100);
      const taxAmount = total - pretax;

      setResult({ mode: 'remove', total, taxRate: r, taxAmount, pretax });

    } else {
      // Find the effective tax rate from before and after prices
      const p = Number(price);
      const total = Number(priceWithTax);

      if (!Number.isFinite(p) || p <= 0) return fail('Enter a valid pre-tax price greater than 0.');
      if (!Number.isFinite(total) || total <= 0) return fail('Enter a valid total price (with tax) greater than 0.');
      if (total < p) return fail('Total price with tax must be greater than or equal to the pre-tax price.');

      const taxAmount = total - p;
      const effectiveRate = (taxAmount / p) * 100;

      setResult({ mode: 'find', pretax: p, total, taxAmount, effectiveRate });
    }

    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  // Quick preset tax rates (common US/global rates)
  const presets = [
    { label: '5%', value: '5' },
    { label: '7%', value: '7' },
    { label: '8.5%', value: '8.5' },
    { label: '10%', value: '10' },
    { label: '15%', value: '15' },
    { label: '20%', value: '20' },
  ];

  const inputClass =
    'w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white';
  const labelClass = 'text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1';

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">
            Sales Tax Calculator
          </h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Add tax to a price, remove tax from a total, or find the effective tax rate — instantly.
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Left: Inputs */}
              <div className="text-left space-y-6">
                {/* Mode selector */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                    Calculation Mode
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'add', label: 'Add Tax to Price' },
                      { id: 'remove', label: 'Remove Tax from Total' },
                      { id: 'find', label: 'Find Tax Rate' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setMode(m.id);
                          resetOnChange();
                        }}
                        className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 text-left pl-5 ${
                          mode === m.id
                            ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]'
                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic inputs based on mode */}
                <div className="space-y-5">
                  <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">
                    Step 2: Enter Values
                  </label>

                  {/* Pre-tax price — shown for 'add' and 'find' */}
                  {(mode === 'add' || mode === 'find') && (
                    <div className="space-y-2">
                      <label className={labelClass}>Pre-tax price</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">$</span>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={price}
                          onChange={(e) => { setPrice(e.target.value); resetOnChange(); }}
                          className={inputClass + ' pl-9'}
                          placeholder="100.00"
                        />
                      </div>
                    </div>
                  )}

                  {/* Total price (with tax) — shown for 'remove' and 'find' */}
                  {(mode === 'remove' || mode === 'find') && (
                    <div className="space-y-2">
                      <label className={labelClass}>
                        {mode === 'find' ? 'Total price (with tax)' : 'Price including tax'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">$</span>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={priceWithTax}
                          onChange={(e) => { setPriceWithTax(e.target.value); resetOnChange(); }}
                          className={inputClass + ' pl-9'}
                          placeholder="108.50"
                        />
                      </div>
                    </div>
                  )}

                  {/* Tax rate — shown for 'add' and 'remove' */}
                  {(mode === 'add' || mode === 'remove') && (
                    <div className="space-y-2">
                      <label className={labelClass}>Tax rate (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.001"
                          value={taxRate}
                          onChange={(e) => { setTaxRate(e.target.value); resetOnChange(); }}
                          className={inputClass + ' pr-9'}
                          placeholder="8.5"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">%</span>
                      </div>

                      {/* Quick preset pills */}
                      <div>
                        <p className={labelClass + ' mb-2 block'}>Quick presets</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {presets.map((p) => (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() => { setTaxRate(p.value); resetOnChange(); }}
                              className={`px-3 py-1.5 rounded-lg border-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                                taxRate === p.value
                                  ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#4F6EF7]'
                                  : 'border-gray-100 text-gray-400 hover:border-[#4F6EF7]/40 hover:text-[#4F6EF7]'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Calculate button */}
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
                  {isCalculating ? 'Calculating...' : 'Calculate Tax'}
                </button>

                {/* Error banner */}
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

              {/* Right: Results */}
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Result
                </label>

                {!result ? (
                  <div className="h-full min-h-[280px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">
                      Enter values to calculate
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4 animate-in fade-in duration-500">

                    {/* Add mode results */}
                    {result.mode === 'add' && (
                      <>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Total Price (with tax)</p>
                          <p className="text-4xl font-extrabold text-[#1E2A5E] mt-1">${result.totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Tax Amount</p>
                            <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">${result.taxAmount.toFixed(2)}</p>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Tax Rate</p>
                            <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">{result.taxRate}%</p>
                          </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Pre-Tax Price</p>
                          <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">${result.pretax.toFixed(2)}</p>
                        </div>
                      </>
                    )}

                    {/* Remove mode results */}
                    {result.mode === 'remove' && (
                      <>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Pre-Tax Price</p>
                          <p className="text-4xl font-extrabold text-[#1E2A5E] mt-1">${result.pretax.toFixed(2)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Tax Amount</p>
                            <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">${result.taxAmount.toFixed(2)}</p>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Tax Rate</p>
                            <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">{result.taxRate}%</p>
                          </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Total (with tax)</p>
                          <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">${result.total.toFixed(2)}</p>
                        </div>
                      </>
                    )}

                    {/* Find rate mode results */}
                    {result.mode === 'find' && (
                      <>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Effective Tax Rate</p>
                          <p className="text-4xl font-extrabold text-[#1E2A5E] mt-1">{result.effectiveRate.toFixed(4)}%</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Tax Amount</p>
                            <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">${result.taxAmount.toFixed(2)}</p>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Pre-Tax Price</p>
                            <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">${result.pretax.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Total (with tax)</p>
                          <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">${result.total.toFixed(2)}</p>
                        </div>
                      </>
                    )}

                    <p className="text-[10px] text-gray-400 font-medium px-1 leading-relaxed">
                      Formula: Tax Amount = Pre-tax Price × (Rate ÷ 100). Results are rounded to two decimal places.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature deck */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              t: 'Three calculation modes',
              d: 'Add tax to a price, strip tax out of a total, or find the effective rate between two amounts.',
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
              ),
            },
            {
              t: 'Quick rate presets',
              d: 'One-click presets for common tax rates (5%, 7%, 8.5%, 10%, 15%, 20%) to speed up calculations.',
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
                </svg>
              ),
            },
            {
              t: 'Accurate & instant',
              d: '100% client-side math. Results are computed in your browser with precise decimal handling — no server needed.',
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ),
            },
          ].map((x) => (
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

export default SalesTaxCalculator;
