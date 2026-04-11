import React, { useEffect, useState } from 'react';

const DAY_MS = 24 * 60 * 60 * 1000;

const formatDateInput = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const parseLocalDate = (value) => {
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const addDays = (date, days) => new Date(date.getTime() + days * DAY_MS);

const DueDateCalculator = () => {
  const [mode, setMode] = useState('lmp');
  const [lmpDate, setLmpDate] = useState('');
  const [ultrasoundDate, setUltrasoundDate] = useState('');
  const [gaWeeks, setGaWeeks] = useState('');
  const [gaDays, setGaDays] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const today = new Date();
    const todayInput = formatDateInput(today);
    setLmpDate(todayInput);
    setUltrasoundDate(todayInput);
    setGaWeeks('8');
    setGaDays('0');
  }, []);

  const fail = (msg) => {
    setError(msg);
    setIsCalculating(false);
  };

  const onCalculate = () => {
    setError(null);

    if (mode === 'lmp') {
      const lmp = parseLocalDate(lmpDate);
      if (!lmp) return fail('Please enter a valid LMP date.');
      const dueDate = addDays(lmp, 280); // 40 weeks
      const today = new Date();
      const gestDaysNow = Math.floor((today.getTime() - lmp.getTime()) / DAY_MS);
      const gestWeeksNow = Math.max(0, Math.floor(gestDaysNow / 7));
      const remDaysNow = Math.max(0, gestDaysNow % 7);

      setResult({
        mode: 'lmp',
        dueDate: formatDateInput(dueDate),
        gestWeeksNow,
        remDaysNow,
      });
      setIsCalculating(false);
      return;
    }

    const usDate = parseLocalDate(ultrasoundDate);
    const w = Number(gaWeeks);
    const d = Number(gaDays);
    if (!usDate) return fail('Please enter a valid ultrasound date.');
    if (!Number.isFinite(w) || w < 0 || w > 45) return fail('Gestational weeks must be between 0 and 45.');
    if (!Number.isFinite(d) || d < 0 || d > 6) return fail('Gestational days must be between 0 and 6.');

    const totalGaDays = Math.floor(w) * 7 + Math.floor(d);
    const remaining = 280 - totalGaDays;
    if (remaining < 0) return fail('Gestational age cannot be more than 40 weeks for this calculator.');

    const dueDate = addDays(usDate, remaining);
    setResult({
      mode: 'ultrasound',
      dueDate: formatDateInput(dueDate),
      atScan: `${Math.floor(w)}w ${Math.floor(d)}d`,
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const clearStateOnModeChange = (nextMode) => {
    setMode(nextMode);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Due Date Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Estimate pregnancy due date from LMP or ultrasound gestational age.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">
                  Method
                </label>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <button
                    type="button"
                    onClick={() => clearStateOnModeChange('lmp')}
                    className={`py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      mode === 'lmp' ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'
                    }`}
                  >
                    LMP Method
                  </button>
                  <button
                    type="button"
                    onClick={() => clearStateOnModeChange('ultrasound')}
                    className={`py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      mode === 'ultrasound' ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'
                    }`}
                  >
                    Ultrasound
                  </button>
                </div>

                <div className="space-y-6">
                  {mode === 'lmp' ? (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                        First day of last menstrual period
                      </label>
                      <input
                        type="date"
                        value={lmpDate}
                        onChange={(e) => {
                          setLmpDate(e.target.value);
                          setResult(null);
                          setError(null);
                        }}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Ultrasound date</label>
                        <input
                          type="date"
                          value={ultrasoundDate}
                          onChange={(e) => {
                            setUltrasoundDate(e.target.value);
                            setResult(null);
                            setError(null);
                          }}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Gestational weeks</label>
                          <input
                            type="number"
                            min="0"
                            max="45"
                            step="1"
                            value={gaWeeks}
                            onChange={(e) => {
                              setGaWeeks(e.target.value);
                              setResult(null);
                              setError(null);
                            }}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                            placeholder="8"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Gestational days</label>
                          <input
                            type="number"
                            min="0"
                            max="6"
                            step="1"
                            value={gaDays}
                            onChange={(e) => {
                              setGaDays(e.target.value);
                              setResult(null);
                              setError(null);
                            }}
                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                            placeholder="0"
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
                    {isCalculating ? 'Calculating...' : 'Calculate Due Date'}
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
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter pregnancy data</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Estimated due date</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">{result.dueDate}</p>
                    </div>

                    {result.mode === 'lmp' ? (
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Current gestational age (approx.)</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.gestWeeksNow}w {result.remDaysNow}d</p>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Gestational age at scan</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.atScan}</p>
                      </div>
                    )}

                    <p className="text-[10px] text-gray-400 font-medium mt-2 leading-relaxed">
                      This estimate is not a diagnosis. Always confirm dates and care plan with your healthcare provider.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'LMP-based estimate', d: 'Uses standard 280-day pregnancy length from LMP.' },
            { t: 'Ultrasound mode', d: 'Back-calculates due date from scan date and gestational age.' },
            { t: 'Fast comparison', d: 'Switch methods instantly and compare likely due dates.' },
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

export default DueDateCalculator;

