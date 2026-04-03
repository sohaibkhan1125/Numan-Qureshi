import React, { useState } from 'react';

const BreakevenPointCalculator = () => {
  const [fixedCost, setFixedCost] = useState('');
  const [variableCostPerUnit, setVariableCostPerUnit] = useState('');
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState('');
  const [unitsSold, setUnitsSold] = useState('');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const onCalculate = () => {
    setError(null);

    const fail = (msg) => {
      setError(msg);
      setIsCalculating(false);
    };

    const fixed = Number(fixedCost);
    const variable = Number(variableCostPerUnit);
    const price = Number(sellingPricePerUnit);
    const soldRaw = unitsSold.trim();
    const sold = soldRaw === '' ? null : Number(soldRaw);

    if (!Number.isFinite(fixed) || fixed < 0) {
      fail('Enter a valid Fixed Cost (0 or more).');
      return;
    }
    if (!Number.isFinite(variable) || variable < 0) {
      fail('Enter a valid Variable Cost per Unit (0 or more).');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      fail('Enter a valid Selling Price per Unit (greater than 0).');
      return;
    }

    if (soldRaw !== '' && (!Number.isFinite(sold) || sold < 0)) {
      fail('Units sold must be 0 or more (leave blank to skip).');
      return;
    }

    const contribution = price - variable;
    if (contribution <= 0) {
      fail('Break-even is not possible when selling price is less than or equal to variable cost.');
      return;
    }

    const breakevenUnits = fixed / contribution;
    const breakevenUnitsRoundedUp = Math.ceil(breakevenUnits);
    const breakevenRevenue = breakevenUnits * price;

    const profit =
      sold == null ? null : (contribution * sold - fixed);

    setResult({
      fixed,
      variable,
      price,
      contribution,
      breakevenUnits,
      breakevenUnitsRoundedUp,
      breakevenRevenue,
      unitsSold: sold,
      profit,
      profitLabel:
        profit == null ? null : profit > 0 ? 'Profit' : profit < 0 ? 'Loss' : 'Break-even',
    });

    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const onClearError = () => setError(null);

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">
            Breakeven Point Calculator
          </h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Calculate how many units you need to sell to cover fixed and variable costs.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Step 1: Costs & Pricing
                </label>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                      Fixed Cost
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={fixedCost}
                      onChange={(e) => {
                        setFixedCost(e.target.value);
                        setResult(null);
                        setError(null);
                      }}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                      placeholder="1000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                      Variable Cost per Unit
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variableCostPerUnit}
                      onChange={(e) => {
                        setVariableCostPerUnit(e.target.value);
                        setResult(null);
                        setError(null);
                      }}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                      placeholder="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                      Selling Price per Unit
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={sellingPricePerUnit}
                      onChange={(e) => {
                        setSellingPricePerUnit(e.target.value);
                        setResult(null);
                        setError(null);
                      }}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                      placeholder="10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                      Units Sold (optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={unitsSold}
                      onChange={(e) => {
                        setUnitsSold(e.target.value);
                        setResult(null);
                        setError(null);
                      }}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                      placeholder="150"
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
                    {isCalculating ? 'Calculating...' : 'Calculate Breakeven'}
                  </button>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-left">
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
                    <button type="button" onClick={onClearError} className="text-red-300 hover:text-red-500 transition-colors">
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
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Step 2: Breakeven Result
                </label>

                {!result ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">
                      Enter your costs & pricing
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">
                          Contribution margin / unit
                        </p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.contribution.toFixed(2)}</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">
                          Breakeven revenue
                        </p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.breakevenRevenue.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Breakeven units</p>
                      <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">
                        Exact: {result.breakevenUnits.toFixed(2)} units
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-2">
                        To cover all costs (rounded up): {result.breakevenUnitsRoundedUp} units
                      </p>
                    </div>

                    {result.profit != null && (
                      <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Profit preview</p>
                        <p className={`text-xl font-extrabold mt-1 ${result.profit > 0 ? 'text-emerald-600' : result.profit < 0 ? 'text-red-600' : 'text-[#1E2A5E]'}`}>
                          {result.profitLabel}: {result.profit.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-2">
                          Based on selling {result.unitsSold} units at the inputs above.
                        </p>
                      </div>
                    )}

                    <p className="text-[10px] text-gray-400 font-medium mt-4 px-1 leading-relaxed">
                      Breakeven calculations are simplified. Real-world costs and prices can change over time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Break-even math', d: 'Uses fixed / (price − variable cost) for units needed.' },
            { t: 'No-solution guardrails', d: 'Shows an error when price is <= variable cost.' },
            { t: 'Profit preview', d: 'Optionally estimate profit/loss for a specific units sold.' },
          ].map((x) => (
            <div key={x.t} className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50">
              <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4h12v12H4z" />
                  <path d="M6 6h8v2H6z" />
                  <path d="M6 10h5v2H6z" />
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

export default BreakevenPointCalculator;

