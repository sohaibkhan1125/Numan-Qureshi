import React, { useMemo, useState } from 'react';

const DiscountCalculator = () => {
  const [price, setPrice] = useState('');
  const [mode, setMode] = useState('percent'); // 'percent' | 'fixed'
  const [percentOff, setPercentOff] = useState('');
  const [fixedOff, setFixedOff] = useState('');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const computed = useMemo(() => {
    const p = Number(price);
    if (!Number.isFinite(p) || p <= 0) return null;

    if (mode === 'percent') {
      const perc = Number(percentOff);
      if (!Number.isFinite(perc)) return null;
      const discAmount = p * (perc / 100);
      const final = p - discAmount;
      const effectivePercent = p === 0 ? 0 : (discAmount / p) * 100;
      return { p, perc, discAmount, final, effectivePercent };
    }

    const fixed = Number(fixedOff);
    if (!Number.isFinite(fixed)) return null;
    const discAmount = fixed;
    const final = p - discAmount;
    const effectivePercent = p === 0 ? 0 : (discAmount / p) * 100;
    return { p, fixed, discAmount, final, effectivePercent };
  }, [price, mode, percentOff, fixedOff]);

  const fail = (msg) => {
    setError(msg);
    setIsCalculating(false);
  };

  const onCalculate = () => {
    setError(null);

    const p = Number(price);
    if (!Number.isFinite(p) || p <= 0) return fail('Enter a valid original price greater than 0.');

    let discAmount;
    let effectivePercent;

    if (mode === 'percent') {
      const perc = Number(percentOff);
      if (!Number.isFinite(perc) || perc < 0) return fail('Enter a valid percentage discount (0 to 100).');
      if (perc > 100) return fail('Percentage discount cannot be greater than 100.');
      discAmount = p * (perc / 100);
      effectivePercent = perc;
    } else {
      const fixed = Number(fixedOff);
      if (!Number.isFinite(fixed) || fixed < 0) return fail('Enter a valid fixed discount (0 or more).');
      if (fixed > p) return fail('Fixed discount cannot be greater than the original price.');
      discAmount = fixed;
      effectivePercent = p === 0 ? 0 : (discAmount / p) * 100;
    }

    const final = p - discAmount;

    setResult({
      original: p,
      discountAmount: discAmount,
      final,
      effectivePercent,
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const resetOnChange = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Discount Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Calculate final price from a percentage or fixed discount.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Step 1: Pricing
                </label>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                      Original price
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        resetOnChange();
                      }}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                      placeholder="100"
                    />
                  </div>

                  <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                    Discount type
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('percent');
                        resetOnChange();
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                        mode === 'percent' ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      Percent
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('fixed');
                        resetOnChange();
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                        mode === 'fixed' ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      Fixed amount
                    </button>
                  </div>

                  {mode === 'percent' ? (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                        % off
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={percentOff}
                        onChange={(e) => {
                          setPercentOff(e.target.value);
                          resetOnChange();
                        }}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                        placeholder="20"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                        Discount amount
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={fixedOff}
                        onChange={(e) => {
                          setFixedOff(e.target.value);
                          resetOnChange();
                        }}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                        placeholder="15"
                      />
                    </div>
                  )}

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
                    {isCalculating ? 'Calculating...' : 'Calculate Discount'}
                  </button>

                  {error && (
                    <div className="mt-2 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-left">
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
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Result
                </label>

                {!result ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter price and discount</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Discount amount</p>
                      <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.discountAmount.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-500 font-medium mt-2">
                        Effective: {result.effectivePercent.toFixed(2)}%
                      </p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Final price</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">{result.final.toFixed(2)}</p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Original price</p>
                      <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.original.toFixed(2)}</p>
                    </div>

                    {computed && mode === 'percent' && (
                      <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                        Preview uses your inputs in real-time; calculation is applied when you press the button.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Two discount modes', d: 'Choose percentage or fixed amount.' },
            { t: 'Effective percent', d: 'Shows the equivalent discount percent automatically.' },
            { t: 'Accurate math', d: 'Handles decimals and validates boundary cases.' },
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

export default DiscountCalculator;

