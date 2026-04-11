import React, { useState } from 'react';

const UNITS = [
  'cup', 'tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'L', 'fl oz', 'pint', 'quart', 'gallon', 'piece', 'slice', 'whole', 'pinch', 'dash', 'handful',
];

const defaultIngredients = () => [
  { id: 1, name: '', amount: '', unit: 'cup' },
  { id: 2, name: '', amount: '', unit: 'tbsp' },
  { id: 3, name: '', amount: '', unit: 'g' },
];

const RecipeScaler = () => {
  const [originalServings, setOriginalServings] = useState('');
  const [targetServings, setTargetServings] = useState('');
  const [ingredients, setIngredients] = useState(defaultIngredients());
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const reset = () => { setResult(null); setError(null); };

  // ── Ingredient CRUD ──────────────────────────────────────────
  const setField = (id, field, value) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
    reset();
  };

  const addIngredient = () => {
    setIngredients(prev => [
      ...prev,
      { id: Date.now() + Math.floor(Math.random() * 1000), name: '', amount: '', unit: 'cup' },
    ]);
    reset();
  };

  const removeIngredient = (id) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
    reset();
  };

  // ── Calculation ──────────────────────────────────────────────
  const onCalculate = () => {
    setError(null);

    const orig = Number(originalServings);
    const target = Number(targetServings);

    if (!Number.isFinite(orig) || orig <= 0) {
      setError('Enter a valid original serving count greater than 0.');
      setIsCalculating(false);
      return;
    }
    if (!Number.isFinite(target) || target <= 0) {
      setError('Enter a valid target serving count greater than 0.');
      setIsCalculating(false);
      return;
    }

    const factor = target / orig;

    const filled = ingredients.filter(i => i.name.trim() || i.amount.toString().trim());
    if (filled.length === 0) {
      setError('Add at least one ingredient with a name or amount.');
      setIsCalculating(false);
      return;
    }

    const scaled = filled.map(i => {
      const raw = Number(i.amount);
      const hasAmount = i.amount.toString().trim() !== '' && Number.isFinite(raw) && raw > 0;
      const scaledAmt = hasAmount ? raw * factor : null;
      return {
        id: i.id,
        name: i.name.trim() || '(unnamed)',
        originalAmount: hasAmount ? raw : null,
        scaledAmount: scaledAmt,
        unit: i.unit,
      };
    });

    setResult({ originalServings: orig, targetServings: target, factor, scaled });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  // ── Helpers ──────────────────────────────────────────────────
  const fmtAmount = (val) => {
    if (val === null) return '—';
    if (Number.isInteger(val)) return val.toString();
    // Show up to 3 significant decimal places, trim trailing zeros
    return parseFloat(val.toFixed(4)).toString();
  };

  const inputClass = 'w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white text-sm';
  const labelClass = 'text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1';

  // Quick scaling presets
  const servingPresets = [
    { label: '½×', value: (s) => s ? String(Number(s) * 0.5) : '0.5' },
    { label: '2×', value: (s) => s ? String(Number(s) * 2) : '2' },
    { label: '3×', value: (s) => s ? String(Number(s) * 3) : '3' },
    { label: '4×', value: (s) => s ? String(Number(s) * 4) : '4' },
  ];

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto text-center">

        {/* Header */}
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Recipe Scaler</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Scale any recipe up or down. Enter your servings and ingredients — get perfectly proportioned amounts instantly.
          </p>
        </header>

        {/* Main card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* ── LEFT: Inputs ── */}
              <div className="space-y-7">

                {/* Serving counts */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-5 leading-none">
                    Step 1: Serving Counts
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Original servings</label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={originalServings}
                        onChange={e => { setOriginalServings(e.target.value); reset(); }}
                        className={inputClass}
                        placeholder="4"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Target servings</label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={targetServings}
                        onChange={e => { setTargetServings(e.target.value); reset(); }}
                        className={inputClass}
                        placeholder="8"
                      />
                    </div>
                  </div>

                  {/* Quick scale presets */}
                  {originalServings && Number(originalServings) > 0 && (
                    <div className="mt-3">
                      <p className={labelClass + ' mb-2 block'}>Quick scale from original</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {servingPresets.map(p => {
                          const computed = p.value(originalServings);
                          return (
                            <button
                              key={p.label}
                              type="button"
                              onClick={() => { setTargetServings(computed); reset(); }}
                              className={`px-4 py-1.5 rounded-lg border-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                                targetServings === computed
                                  ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#4F6EF7]'
                                  : 'border-gray-100 text-gray-400 hover:border-[#4F6EF7]/40 hover:text-[#4F6EF7]'
                              }`}
                            >
                              {p.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ingredient rows */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-5 leading-none">
                    Step 2: Ingredients
                  </label>

                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr_80px_90px_24px] gap-2 mb-2 px-1">
                    <span className={labelClass}>Ingredient name</span>
                    <span className={labelClass}>Amount</span>
                    <span className={labelClass}>Unit</span>
                    <span />
                  </div>

                  <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                    {ingredients.map((ing, idx) => (
                      <div key={ing.id} className="grid grid-cols-[1fr_80px_90px_24px] gap-2 items-center animate-in slide-in-from-right-2 duration-300">
                        {/* Name */}
                        <input
                          type="text"
                          value={ing.name}
                          onChange={e => setField(ing.id, 'name', e.target.value)}
                          className={inputClass}
                          placeholder={`Ingredient ${idx + 1}`}
                        />
                        {/* Amount */}
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={ing.amount}
                          onChange={e => setField(ing.id, 'amount', e.target.value)}
                          className={inputClass}
                          placeholder="1"
                        />
                        {/* Unit */}
                        <select
                          value={ing.unit}
                          onChange={e => setField(ing.id, 'unit', e.target.value)}
                          className={inputClass + ' cursor-pointer appearance-none'}
                        >
                          {UNITS.map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                        {/* Remove */}
                        {ingredients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIngredient(ing.id)}
                            className="p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                            aria-label="Remove ingredient"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        {ingredients.length === 1 && <span />}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addIngredient}
                    className="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-gray-100 text-[#1E2A5E] font-black uppercase tracking-widest text-[9px] hover:border-[#4F6EF7]/40 hover:bg-[#4F6EF7]/5 transition-all flex items-center justify-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 4v16M4 12h16" /></svg>
                    Add another ingredient
                  </button>
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
                  {isCalculating ? 'Scaling...' : 'Scale Recipe'}
                </button>

                {/* Error */}
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

              {/* ── RIGHT: Results ── */}
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Scaled Result
                </label>

                {!result ? (
                  <div className="h-full min-h-[320px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <div className="text-center space-y-2">
                      <svg className="w-10 h-10 text-gray-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter your recipe details</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4 animate-in fade-in duration-500">

                    {/* Summary pill */}
                    <div className="bg-gradient-to-br from-[#4F6EF7] to-[#7C3AED] rounded-2xl p-5 text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Scale factor</p>
                      <p className="text-4xl font-extrabold mt-1">{result.factor % 1 === 0 ? result.factor : result.factor.toFixed(3)}×</p>
                      <p className="text-[10px] font-bold mt-2 opacity-70 uppercase tracking-widest">
                        {result.originalServings} → {result.targetServings} servings
                      </p>
                    </div>

                    {/* Column headers */}
                    <div className="grid grid-cols-[1fr_70px_70px_60px] gap-2 px-2 pt-1">
                      <span className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40">Ingredient</span>
                      <span className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 text-right">Original</span>
                      <span className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 text-right">Scaled</span>
                      <span className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 text-right">Unit</span>
                    </div>

                    {/* Ingredient rows */}
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                      {result.scaled.map((item, i) => (
                        <div
                          key={item.id}
                          className="bg-white border border-gray-100 rounded-2xl px-4 py-3 grid grid-cols-[1fr_70px_70px_60px] gap-2 items-center animate-in fade-in duration-300"
                          style={{ animationDelay: `${i * 40}ms` }}
                        >
                          <p className="text-[#1E2A5E] font-black text-xs truncate">{item.name}</p>
                          <p className="text-gray-400 font-bold text-xs text-right">
                            {item.originalAmount !== null ? fmtAmount(item.originalAmount) : '—'}
                          </p>
                          <p className={`font-extrabold text-sm text-right ${item.scaledAmount !== null ? 'text-[#4F6EF7]' : 'text-gray-300'}`}>
                            {fmtAmount(item.scaledAmount)}
                          </p>
                          <p className="text-gray-400 font-bold text-xs text-right truncate">{item.unit}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-gray-400 font-medium px-1 leading-relaxed">
                      Formula: Scaled amount = Original × (Target ÷ Original servings). Fractional amounts are displayed as decimals.
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
              t: 'Any scale factor',
              d: 'Scale up to feed a crowd or halve a recipe for one. Any original-to-target ratio is supported.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Multi-ingredient',
              d: 'Add as many ingredients as your recipe needs. All amounts are scaled simultaneously with the same factor.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>,
            },
            {
              t: '19 unit types',
              d: 'Choose from cups, tbsp, tsp, oz, lb, g, kg, ml, litres, fl oz, pints, quarts, gallons, pieces, and more.',
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

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8f8f8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4F6EF7; }
      `}} />
    </div>
  );
};

export default RecipeScaler;
