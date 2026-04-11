import React, { useState } from 'react';

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

const CalorieCalculator = () => {
  const [unit, setUnit] = useState('metric');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightLb, setWeightLb] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const onCalculate = () => {
    setError(null);
    const fail = (msg) => {
      setError(msg);
      setIsCalculating(false);
    };

    const a = Number(age);
    if (!Number.isFinite(a) || a <= 0) return fail('Enter a valid age greater than 0.');

    let weight;
    let height;

    if (unit === 'metric') {
      const w = Number(weightKg);
      const h = Number(heightCm);
      if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
        return fail('Enter valid metric values for weight (kg) and height (cm).');
      }
      weight = w;
      height = h;
    } else {
      const w = Number(weightLb);
      const ft = Number(heightFt);
      const inch = Number(heightIn);
      if (!Number.isFinite(w) || w <= 0) return fail('Enter a valid weight in pounds greater than 0.');
      if (!Number.isFinite(ft) || !Number.isFinite(inch) || ft < 0 || inch < 0) {
        return fail('Enter valid height in feet and inches.');
      }
      const totalInches = ft * 12 + inch;
      if (totalInches <= 0) return fail('Total height must be greater than 0.');
      weight = w * 0.45359237;
      height = totalInches * 2.54;
    }

    const bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * a + 5
      : 10 * weight + 6.25 * height - 5 * a - 161;

    const tdee = bmr * activityMultipliers[activity];
    const target = goal === 'lose' ? tdee - 500 : goal === 'gain' ? tdee + 300 : tdee;

    setResult({
      bmr: Math.round(bmr),
      maintenance: Math.round(tdee),
      target: Math.round(target),
      goalLabel: goal === 'lose' ? 'Weight loss target' : goal === 'gain' ? 'Muscle gain target' : 'Maintenance target',
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Calorie Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Estimate your daily calorie needs for maintenance, fat loss, or muscle gain.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Inputs</label>

                <div className="flex gap-2">
                  {[
                    { id: 'metric', label: 'Metric' },
                    { id: 'imperial', label: 'Imperial' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setUnit(u.id);
                        setResult(null);
                        setError(null);
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                        unit === u.id ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input type="number" min="1" value={age} onChange={(e) => { setAge(e.target.value); setResult(null); setError(null); }} className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" placeholder="Age" />
                  <select value={gender} onChange={(e) => { setGender(e.target.value); setResult(null); setError(null); }} className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {unit === 'metric' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" min="0.1" step="0.1" value={weightKg} onChange={(e) => { setWeightKg(e.target.value); setResult(null); setError(null); }} className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" placeholder="Weight (kg)" />
                    <input type="number" min="1" step="0.1" value={heightCm} onChange={(e) => { setHeightCm(e.target.value); setResult(null); setError(null); }} className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" placeholder="Height (cm)" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <input type="number" min="0.1" step="0.1" value={weightLb} onChange={(e) => { setWeightLb(e.target.value); setResult(null); setError(null); }} className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" placeholder="Weight (lb)" />
                    <input type="number" min="0" value={heightFt} onChange={(e) => { setHeightFt(e.target.value); setResult(null); setError(null); }} className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" placeholder="Ft" />
                    <input type="number" min="0" step="0.1" value={heightIn} onChange={(e) => { setHeightIn(e.target.value); setResult(null); setError(null); }} className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white" placeholder="In" />
                  </div>
                )}

                <select value={activity} onChange={(e) => { setActivity(e.target.value); setResult(null); setError(null); }} className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white">
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light activity</option>
                  <option value="moderate">Moderate activity</option>
                  <option value="very">Very active</option>
                  <option value="extra">Extra active</option>
                </select>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'maintain', label: 'Maintain' },
                    { id: 'lose', label: 'Lose' },
                    { id: 'gain', label: 'Gain' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => { setGoal(g.id); setResult(null); setError(null); }}
                      className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${goal === g.id ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'}`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isCalculating}
                  className="w-full flex items-center justify-center py-5 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)', boxShadow: '0 10px 30px -5px rgba(79,110,247,0.4)' }}
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Calories'}
                </button>

                {error && <p className="text-red-600 text-xs font-bold uppercase tracking-widest">{error}</p>}
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">Result</label>
                {!result ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter your details</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">BMR</p>
                      <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">{result.bmr} kcal/day</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Maintenance calories</p>
                      <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">{result.maintenance} kcal/day</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">{result.goalLabel}</p>
                      <p className="text-2xl font-extrabold text-[#1E2A5E] mt-1">{result.target} kcal/day</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;

