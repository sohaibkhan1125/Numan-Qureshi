import React, { useMemo, useState } from 'react';

const bmiCategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', hint: 'Below healthy range for most adults.' };
  if (bmi < 25) return { label: 'Normal weight', hint: 'Within the commonly cited healthy range.' };
  if (bmi < 30) return { label: 'Overweight', hint: 'Above normal; consider professional advice.' };
  return { label: 'Obese', hint: 'High; consider consulting a healthcare provider.' };
};

const BmiCalculator = () => {
  const [unit, setUnit] = useState('metric');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightLb, setWeightLb] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const onCalculate = () => {
    setError(null);

    let bmi;

    if (unit === 'metric') {
      const w = Number(weightKg);
      const h = Number(heightCm);
      if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
        setError('Enter a valid weight (kg) and height (cm) greater than 0.');
        return;
      }
      const hm = h / 100;
      bmi = w / (hm * hm);
    } else {
      const w = Number(weightLb);
      const ft = Number(heightFt);
      const inch = Number(heightIn);
      if (!Number.isFinite(w) || w <= 0) {
        setError('Enter a valid weight in pounds greater than 0.');
        return;
      }
      if (!Number.isFinite(ft) || !Number.isFinite(inch) || ft < 0 || inch < 0) {
        setError('Enter height in feet and inches (0 or more for each).');
        return;
      }
      const totalIn = ft * 12 + inch;
      if (totalIn <= 0) {
        setError('Total height must be greater than 0.');
        return;
      }
      bmi = (703 * w) / (totalIn * totalIn);
    }

    const rounded = Math.round(bmi * 10) / 10;
    const cat = bmiCategory(rounded);
    setResult({ bmi: rounded, ...cat });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const categoryColor = useMemo(() => {
    if (!result) return null;
    if (result.bmi < 18.5) return 'text-sky-600';
    if (result.bmi < 25) return 'text-emerald-600';
    if (result.bmi < 30) return 'text-amber-600';
    return 'text-rose-600';
  }, [result]);

  const resetOnUnitChange = (next) => {
    setUnit(next);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">BMI Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Body Mass Index from your weight and height — metric or imperial.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Units
                </label>
                <div className="flex gap-2 mb-8">
                  {[
                    { id: 'metric', label: 'Metric (kg, cm)' },
                    { id: 'imperial', label: 'Imperial (lb, ft/in)' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => resetOnUnitChange(u.id)}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                        unit === u.id
                          ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]'
                          : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>

                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Your measurements
                </label>
                <div className="space-y-6">
                  {unit === 'metric' ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={weightKg}
                          onChange={(e) => {
                            setWeightKg(e.target.value);
                            setResult(null);
                            setError(null);
                          }}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                          placeholder="70"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="0.1"
                          value={heightCm}
                          onChange={(e) => {
                            setHeightCm(e.target.value);
                            setResult(null);
                            setError(null);
                          }}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                          placeholder="175"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                          Weight (lb)
                        </label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={weightLb}
                          onChange={(e) => {
                            setWeightLb(e.target.value);
                            setResult(null);
                            setError(null);
                          }}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                          placeholder="154"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                            Feet
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={heightFt}
                            onChange={(e) => {
                              setHeightFt(e.target.value);
                              setResult(null);
                              setError(null);
                            }}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                            placeholder="5"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                            Inches
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="11"
                            step="0.1"
                            value={heightIn}
                            onChange={(e) => {
                              setHeightIn(e.target.value);
                              setResult(null);
                              setError(null);
                            }}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                            placeholder="9"
                          />
                        </div>
                      </div>
                    </>
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
                    {isCalculating ? 'Calculating...' : 'Calculate BMI'}
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
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Result
                </label>
                {!result ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter weight and height</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Body Mass Index</p>
                      <p className="text-4xl font-extrabold text-[#1E2A5E] mt-1">{result.bmi}</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Category</p>
                      <p className={`text-xl font-extrabold mt-1 ${categoryColor}`}>{result.label}</p>
                      <p className="text-xs font-medium text-gray-500 mt-3 leading-relaxed">{result.hint}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mt-4 px-1 leading-relaxed">
                      BMI is a screening tool, not a diagnosis. Athletes and others with high muscle mass may read higher without health
                      risk.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Dual units', d: 'Switch between kilograms and centimeters or pounds and feet/inches anytime.' },
            { t: 'WHO-style bands', d: 'See underweight, normal, overweight, and obese ranges at a glance.' },
            { t: 'Privacy-first', d: 'All math runs in your browser — nothing is sent to a server.' },
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

export default BmiCalculator;
