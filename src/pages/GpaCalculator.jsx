import React, { useMemo, useState } from 'react';

const GpaCalculator = () => {
  const [scaleMode, setScaleMode] = useState('4'); // '4' | '5' | 'custom'
  const [customMax, setCustomMax] = useState('4.0');

  const [courses, setCourses] = useState([
    { id: 1, credits: '', points: '' },
    { id: 2, credits: '', points: '' },
    { id: 3, credits: '', points: '' },
  ]);

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const maxPoints = useMemo(() => {
    if (scaleMode === 'custom') return Number(customMax);
    if (scaleMode === '5') return 5;
    return 4;
  }, [customMax, scaleMode]);

  const scaleLabel = useMemo(() => {
    if (scaleMode === 'custom') return `Custom (${Number(customMax).toFixed(2)} max)`;
    if (scaleMode === '5') return '5.0 scale';
    return '4.0 scale';
  }, [customMax, scaleMode]);

  const fail = (msg) => {
    setError(msg);
    setIsCalculating(false);
  };

  const onCalculate = () => {
    setError(null);

    if (!Number.isFinite(maxPoints) || maxPoints <= 0) {
      fail('Enter a valid maximum GPA scale value greater than 0.');
      return;
    }

    let totalCredits = 0;
    let weightedSum = 0;
    let includedAny = false;

    for (const c of courses) {
      const creditsRaw = (c.credits ?? '').toString().trim();
      const pointsRaw = (c.points ?? '').toString().trim();

      if (!creditsRaw && !pointsRaw) continue;

      includedAny = true;

      if (!creditsRaw || !pointsRaw) {
        fail('Each course must have both Credits and Grade points (or leave both blank).');
        return;
      }

      const credits = Number(creditsRaw);
      const points = Number(pointsRaw);

      if (!Number.isFinite(credits) || credits <= 0) {
        fail('Credits must be a number greater than 0.');
        return;
      }
      if (!Number.isFinite(points) || points < 0) {
        fail('Grade points must be a number between 0 and your scale maximum.');
        return;
      }
      if (points > maxPoints) {
        fail(`Grade points cannot exceed your scale maximum (${maxPoints}).`);
        return;
      }

      totalCredits += credits;
      weightedSum += credits * points;
    }

    if (!includedAny || totalCredits <= 0) {
      fail('Add at least one course with credits and grade points.');
      return;
    }

    const gpa = weightedSum / totalCredits;

    setResult({
      gpa,
      totalCredits,
      maxPoints,
      scaleLabel,
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const setCourseField = (id, field, value) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    setResult(null);
    setError(null);
  };

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: Date.now() + Math.floor(Math.random() * 1000), credits: '', points: '' },
    ]);
    setResult(null);
    setError(null);
  };

  const removeCourse = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setResult(null);
    setError(null);
  };

  const switchScale = (next) => {
    setScaleMode(next);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">GPA Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Calculate a credit-weighted GPA from course credits and grade points.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">
                  GPA scale
                </label>

                <div className="flex gap-2">
                  {[
                    { id: '4', label: '4.0 scale' },
                    { id: '5', label: '5.0 scale' },
                    { id: 'custom', label: 'Custom' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => switchScale(u.id)}
                      className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                        scaleMode === u.id
                          ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]'
                          : 'border-gray-100 text-gray-400'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>

                {scaleMode === 'custom' && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                      Maximum grade points
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={customMax}
                      onChange={(e) => {
                        setCustomMax(e.target.value);
                        setResult(null);
                        setError(null);
                      }}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                      placeholder="4.0"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">
                    Courses
                  </label>

                  <div className="space-y-3">
                    {courses.map((c, idx) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-2xl border border-gray-100 bg-gray-50/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                              Course {idx + 1}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                                  Credits
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={c.credits}
                                  onChange={(e) => setCourseField(c.id, 'credits', e.target.value)}
                                  className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                                  placeholder="3"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                                  Grade points
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max={maxPoints || undefined}
                                  step="0.01"
                                  value={c.points}
                                  onChange={(e) => setCourseField(c.id, 'points', e.target.value)}
                                  className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                                  placeholder={`0 - ${maxPoints || '4'}`}
                                />
                              </div>
                            </div>
                          </div>

                          {courses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCourse(c.id)}
                              className="mt-2 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                              aria-label="Remove course"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M8 6V4h8v2" />
                                <path d="M19 6l-1 14H6L5 6" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addCourse}
                    className="w-full py-3 rounded-xl border-2 border-gray-100 text-[#1E2A5E] font-black uppercase tracking-widest text-[9px] hover:border-[#4F6EF7]/40 hover:bg-[#4F6EF7]/5 transition-all"
                  >
                    Add another course
                  </button>
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
                  {isCalculating ? 'Calculating...' : 'Calculate GPA'}
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
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Result
                </label>

                {!result ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">
                      Enter your courses
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">
                        Weighted GPA
                      </p>
                      <p className="text-4xl font-extrabold text-[#1E2A5E] mt-1">
                        {result.gpa.toFixed(2)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">
                          Total credits
                        </p>
                        <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">
                          {result.totalCredits.toFixed(2)}
                        </p>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">
                          Scale
                        </p>
                        <p className="text-sm font-bold text-[#1E2A5E] mt-2">
                          {result.scaleLabel}
                        </p>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-400 font-medium px-1 leading-relaxed">
                      Formula: GPA = (sum of credits * grade points) / total credits. Actual GPA rules vary by school
                      and may treat repeated courses differently.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Credit-weighted', d: 'Heavier courses impact GPA more than lighter ones.' },
            { t: 'Supports custom scales', d: 'Use 4.0, 5.0, or enter your own max grade points.' },
            { t: 'Runs in your browser', d: 'No uploads — all calculations are local.' },
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

export default GpaCalculator;

