import React, { useEffect, useMemo, useState } from 'react';

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [asOfDate, setAsOfDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setAsOfDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const parseLocalDate = (value) => {
    // value is expected in YYYY-MM-DD (from input[type="date"])
    const [y, m, d] = value.split('-').map((x) => Number(x));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const lastDayOfMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate();

  const addMonthsClamped = (date, deltaMonths) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const totalMonths = month + deltaMonths;
    const targetYear = year + Math.floor(totalMonths / 12);
    const targetMonthIndex = ((totalMonths % 12) + 12) % 12;
    const targetDay = Math.min(day, lastDayOfMonth(targetYear, targetMonthIndex));
    return new Date(targetYear, targetMonthIndex, targetDay);
  };

  const formatParts = useMemo(() => {
    if (!result) return null;
    return {
      years: result.years,
      months: result.months,
      days: result.days,
      totalDays: result.totalDays,
      totalWeeks: result.totalWeeks,
    };
  }, [result]);

  const calculateAge = () => {
    setError(null);

    if (!birthDate) {
      setError('Please select your birth date.');
      return;
    }
    if (!asOfDate) {
      setError('Please select the "as of" date.');
      return;
    }

    const birth = parseLocalDate(birthDate);
    const asOf = parseLocalDate(asOfDate);
    if (!birth || !asOf) {
      setError('Invalid date input.');
      return;
    }

    // Normalize to local midnight
    const birthMidnight = new Date(birth.getFullYear(), birth.getMonth(), birth.getDate());
    const asOfMidnight = new Date(asOf.getFullYear(), asOf.getMonth(), asOf.getDate());

    if (asOfMidnight < birthMidnight) {
      setError('"As of" date must be on or after your birth date.');
      return;
    }

    // Compute years/months by advancing from birth date
    let years = asOfMidnight.getFullYear() - birthMidnight.getFullYear();
    let anniversary = new Date(
      birthMidnight.getFullYear() + years,
      birthMidnight.getMonth(),
      birthMidnight.getDate()
    );

    if (anniversary > asOfMidnight) {
      years -= 1;
      anniversary = new Date(
        birthMidnight.getFullYear() + years,
        birthMidnight.getMonth(),
        birthMidnight.getDate()
      );
    }

    let months = 0;
    let cursor = anniversary;
    while (true) {
      const next = addMonthsClamped(cursor, 1);
      if (next <= asOfMidnight) {
        months += 1;
        cursor = next;
      } else {
        break;
      }
      // Safety: months will never exceed 12
      if (months > 240) break;
    }

    const msPerDay = 86400000;
    const totalDays = Math.max(0, Math.floor((asOfMidnight - birthMidnight) / msPerDay));
    const days = Math.floor((asOfMidnight - cursor) / msPerDay);
    const totalWeeks = Math.floor(totalDays / 7);

    setResult({ years, months, days, totalDays, totalWeeks });
    setIsCalculating(false);
  };

  const onSubmit = async () => {
    if (isCalculating) return;
    setIsCalculating(true);
    // Keep async signature so future UI changes don't break UX
    setTimeout(() => calculateAge(), 0);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Age Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Calculate your age in years, months, and days for any "as of" date.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Step 1: Enter Details
                </label>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                      Birth date
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => {
                        setBirthDate(e.target.value);
                        setResult(null);
                        setError(null);
                      }}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                      As of date
                    </label>
                    <input
                      type="date"
                      value={asOfDate}
                      onChange={(e) => {
                        setAsOfDate(e.target.value);
                        setResult(null);
                        setError(null);
                      }}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white"
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
                    {isCalculating ? 'Calculating...' : 'Calculate Age'}
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
                      <p className="font-bold text-[10px] mt-2 uppercase tracking-widest opacity-70 text-red-700">
                        {error}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="text-red-300 hover:text-red-500 transition-colors"
                      aria-label="Dismiss error"
                    >
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
                  Step 2: Result
                </label>
                {!formatParts ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">
                      Enter dates to calculate
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6">
                    <div className="flex items-end gap-4 flex-wrap">
                      <div>
                        <p className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40">Years</p>
                        <p className="text-5xl font-extrabold text-[#1E2A5E] leading-none mt-2">{formatParts.years}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40">Months</p>
                        <p className="text-5xl font-extrabold text-[#1E2A5E] leading-none mt-2">{formatParts.months}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40">Days</p>
                        <p className="text-5xl font-extrabold text-[#1E2A5E] leading-none mt-2">{formatParts.days}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Total days</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{formatParts.totalDays}</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Total weeks</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{formatParts.totalWeeks}</p>
                      </div>
                    </div>

                    <div className="mt-5 text-[11px] font-bold uppercase tracking-widest text-gray-400 opacity-70">
                      Age as of {asOfDate}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              t: 'Instant Calculation',
              d: 'No uploads, no APIs—your age is computed locally in your browser.',
            },
            {
              t: 'Accurate Breakdown',
              d: 'Calculates years, months, and days using calendar-aware logic.',
            },
            {
              t: 'Responsive UI',
              d: 'Designed to work smoothly on both desktop and mobile screens.',
            },
          ].map((x) => (
            <div
              key={x.t}
              className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 000 2h6a2 2 0 012 2v6a1 1 0 102 0V6a4 4 0 00-4-4H9z"
                    clipRule="evenodd"
                  />
                  <path d="M5 8a4 4 0 014-4h0a4 4 0 014 4v7a4 4 0 01-4 4h0a4 4 0 01-4-4V8z" />
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

export default AgeCalculator;

