import React, { useEffect, useState } from 'react';

const DAY_MS = 24 * 60 * 60 * 1000;

const parseLocalDate = (value) => {
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const formatDateInput = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const DateCalculator = () => {
  const [mode, setMode] = useState('difference');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseDate, setBaseDate] = useState('');
  const [offsetDays, setOffsetDays] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const today = new Date();
    const todayInput = formatDateInput(today);
    setStartDate(todayInput);
    setEndDate(todayInput);
    setBaseDate(todayInput);
  }, []);

  const onCalculate = () => {
    setError(null);
    const fail = (msg) => {
      setError(msg);
      setIsCalculating(false);
    };

    if (mode === 'difference') {
      const s = parseLocalDate(startDate);
      const e = parseLocalDate(endDate);
      if (!s || !e) return fail('Please enter valid start and end dates.');
      const diffMs = e.getTime() - s.getTime();
      const days = Math.round(diffMs / DAY_MS);
      setResult({
        type: 'difference',
        signedDays: days,
        absDays: Math.abs(days),
        direction: days === 0 ? 'same day' : days > 0 ? 'after' : 'before',
      });
    } else {
      const b = parseLocalDate(baseDate);
      const d = Number(offsetDays);
      if (!b) return fail('Please enter a valid base date.');
      if (!Number.isFinite(d)) return fail('Please enter a valid number of days to add/subtract.');
      const out = new Date(b.getTime() + Math.round(d) * DAY_MS);
      setResult({
        type: 'offset',
        output: formatDateInput(out),
        days: Math.round(d),
      });
    }

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
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Date Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Calculate days between two dates or add/subtract days from a specific date.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">Mode</label>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('difference');
                      setResult(null);
                      setError(null);
                    }}
                    className={`py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      mode === 'difference' ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'
                    }`}
                  >
                    Date difference
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('offset');
                      setResult(null);
                      setError(null);
                    }}
                    className={`py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      mode === 'offset' ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'
                    }`}
                  >
                    Add/Subtract days
                  </button>
                </div>

                <div className="space-y-6">
                  {mode === 'difference' ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Start date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setResult(null);
                            setError(null);
                          }}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">End date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setResult(null);
                            setError(null);
                          }}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Base date</label>
                        <input
                          type="date"
                          value={baseDate}
                          onChange={(e) => {
                            setBaseDate(e.target.value);
                            setResult(null);
                            setError(null);
                          }}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                          Days (+ future, - past)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={offsetDays}
                          onChange={(e) => {
                            setOffsetDays(e.target.value);
                            setResult(null);
                            setError(null);
                          }}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                          placeholder="30"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isCalculating}
                    className="w-full flex items-center justify-center py-5 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #4F6EF7, #7C3AED)', boxShadow: '0 10px 30px -5px rgba(79,110,247,0.4)' }}
                  >
                    {isCalculating ? 'Calculating...' : 'Calculate Date'}
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
                  </div>
                )}
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">Result</label>
                {!result ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter date inputs</p>
                  </div>
                ) : result.type === 'difference' ? (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Total difference</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">{result.absDays} days</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Direction</p>
                      <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">
                        {result.direction === 'same day' ? 'Both dates are the same day' : `End date is ${result.absDays} days ${result.direction} start date`}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Calculated date</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">{result.output}</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Applied shift</p>
                      <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.days} days</p>
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

export default DateCalculator;

