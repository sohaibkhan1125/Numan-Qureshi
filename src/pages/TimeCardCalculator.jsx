import React, { useState, useMemo } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultRows = () =>
  DAYS.map((day, i) => ({
    id: i,
    day,
    clockIn: '',
    clockOut: '',
    breakMin: '0',
    enabled: i < 5, // Mon–Fri on by default
  }));

// Parse "HH:MM" → decimal hours. Returns null if invalid.
const parseTime = (str) => {
  if (!str || !str.includes(':')) return null;
  const [h, m] = str.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h + m / 60;
};

const decimalToHM = (decimal) => {
  if (!Number.isFinite(decimal) || decimal < 0) return '0h 0m';
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return `${h}h ${m}m`;
};

const fmt2 = (n) => (Number.isFinite(n) ? n.toFixed(2) : '—');

const TimeCardCalculator = () => {
  const [rows, setRows] = useState(defaultRows());
  const [otThreshold, setOtThreshold] = useState('40');   // weekly OT threshold
  const [dailyOt, setDailyOt] = useState('8');             // daily OT threshold
  const [hourlyRate, setHourlyRate] = useState('');
  const [otMultiplier, setOtMultiplier] = useState('1.5');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const setRowField = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    setResult(null); setError(null);
  };

  const toggleDay = (id) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    setResult(null); setError(null);
  };

  // Live per-row hours computation (for preview column)
  const liveHours = useMemo(() =>
    rows.map(r => {
      if (!r.enabled || !r.clockIn || !r.clockOut) return null;
      const cin = parseTime(r.clockIn);
      const cout = parseTime(r.clockOut);
      if (cin === null || cout === null) return null;
      let worked = cout - cin;
      if (worked < 0) worked += 24; // overnight
      const brk = Number(r.breakMin) / 60;
      const net = worked - (Number.isFinite(brk) && brk >= 0 ? brk : 0);
      return Math.max(0, net);
    }), [rows]);

  const onCalculate = () => {
    setError(null);

    const dailyOtH = Number(dailyOt);
    const weeklyOtH = Number(otThreshold);

    if (!Number.isFinite(dailyOtH) || dailyOtH <= 0) {
      setError('Enter a valid daily overtime threshold (hours).');
      setIsCalculating(false); return;
    }
    if (!Number.isFinite(weeklyOtH) || weeklyOtH <= 0) {
      setError('Enter a valid weekly overtime threshold (hours).');
      setIsCalculating(false); return;
    }

    const dayResults = [];
    let totalNet = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.enabled) {
        dayResults.push({ day: r.day, worked: 0, regular: 0, daily_ot: 0, skipped: true });
        continue;
      }
      if (!r.clockIn || !r.clockOut) {
        dayResults.push({ day: r.day, worked: 0, regular: 0, daily_ot: 0, skipped: true });
        continue;
      }

      const cin = parseTime(r.clockIn);
      const cout = parseTime(r.clockOut);
      if (cin === null || cout === null) {
        setError(`Invalid time format on ${r.day}. Use HH:MM (24-hour).`);
        setIsCalculating(false); return;
      }

      let worked = cout - cin;
      if (worked < 0) worked += 24; // overnight shift

      const brk = Number(r.breakMin);
      if (!Number.isFinite(brk) || brk < 0) {
        setError(`Invalid break time on ${r.day}.`);
        setIsCalculating(false); return;
      }
      const net = Math.max(0, worked - brk / 60);
      const dailyRegular = Math.min(net, dailyOtH);
      const dailyOtAmt = Math.max(0, net - dailyOtH);

      totalNet += net;
      dayResults.push({ day: r.day, worked: net, regular: dailyRegular, daily_ot: dailyOtAmt });
    }

    if (totalNet === 0) {
      setError('No valid time entries found. Enable at least one day and enter clock-in/out times.');
      setIsCalculating(false); return;
    }

    // Weekly OT: any hours beyond weeklyOtH (applied on top of daily OT)
    const weeklyOtAmt = Math.max(0, totalNet - weeklyOtH);
    const totalRegular = Math.max(0, totalNet - weeklyOtAmt - dayResults.reduce((s, d) => s + d.daily_ot, 0));
    const totalDailyOt = dayResults.reduce((s, d) => s + d.daily_ot, 0);
    const totalOt = Math.max(totalDailyOt, weeklyOtAmt); // use whichever is larger
    const finalRegular = totalNet - totalOt;

    const rate = Number(hourlyRate);
    const mult = Number(otMultiplier);
    let pay = null;
    if (Number.isFinite(rate) && rate > 0 && Number.isFinite(mult) && mult > 0) {
      pay = finalRegular * rate + totalOt * rate * mult;
    }

    setResult({
      dayResults,
      totalNet,
      finalRegular: Math.max(0, finalRegular),
      totalOt,
      pay,
      rate: Number.isFinite(rate) && rate > 0 ? rate : null,
      mult,
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white text-sm';
  const sectionLabel = 'block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none';
  const labelClass = 'text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40';

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto text-center">

        {/* Header */}
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Time Card Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Enter clock-in and clock-out times for each day to calculate total hours, overtime, and optional pay.
          </p>
        </header>

        {/* Main card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10">
          <div className="p-10 sm:p-14">

            {/* Settings row */}
            <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Daily OT after (hrs)</label>
                <input type="number" min="1" max="24" step="0.5" value={dailyOt}
                  onChange={e => { setDailyOt(e.target.value); setResult(null); }}
                  className={inputClass} placeholder="8" />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Weekly OT after (hrs)</label>
                <input type="number" min="1" step="0.5" value={otThreshold}
                  onChange={e => { setOtThreshold(e.target.value); setResult(null); }}
                  className={inputClass} placeholder="40" />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Hourly rate ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">$</span>
                  <input type="number" min="0" step="0.01" value={hourlyRate}
                    onChange={e => { setHourlyRate(e.target.value); setResult(null); }}
                    className={inputClass + ' pl-8'} placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>OT multiplier</label>
                <select value={otMultiplier} onChange={e => { setOtMultiplier(e.target.value); setResult(null); }}
                  className={inputClass + ' cursor-pointer'}>
                  <option value="1.5">1.5× (time & half)</option>
                  <option value="2.0">2.0× (double time)</option>
                  <option value="1.25">1.25×</option>
                  <option value="1.0">1.0× (no premium)</option>
                </select>
              </div>
            </div>

            {/* Day rows */}
            <div>
              <label className={sectionLabel}>Weekly Time Entries</label>

              {/* Column headers */}
              <div className="hidden sm:grid sm:grid-cols-[120px_1fr_1fr_90px_70px] gap-3 mb-2 px-1">
                <span className={labelClass}>Day</span>
                <span className={labelClass}>Clock In</span>
                <span className={labelClass}>Clock Out</span>
                <span className={labelClass}>Break (min)</span>
                <span className={labelClass + ' text-right'}>Net hrs</span>
              </div>

              <div className="space-y-2.5">
                {rows.map((r, i) => (
                  <div key={r.id} className={`grid grid-cols-1 sm:grid-cols-[120px_1fr_1fr_90px_70px] gap-3 items-center p-4 rounded-2xl border-2 transition-all ${
                    r.enabled ? 'border-gray-100 bg-white' : 'border-dashed border-gray-100 bg-gray-50/30 opacity-50'
                  }`}>
                    {/* Day toggle */}
                    <button
                      type="button"
                      onClick={() => toggleDay(r.id)}
                      className={`flex items-center gap-2 text-left group`}
                    >
                      <span className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all ${
                        r.enabled ? 'bg-[#4F6EF7] border-[#4F6EF7]' : 'border-gray-200 bg-white'
                      }`}>
                        {r.enabled && (
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <span className="text-xs font-black text-[#1E2A5E] uppercase tracking-widest">{r.day.slice(0, 3)}</span>
                    </button>

                    {/* Clock In */}
                    <input
                      type="time"
                      value={r.clockIn}
                      disabled={!r.enabled}
                      onChange={e => setRowField(r.id, 'clockIn', e.target.value)}
                      className={inputClass + (!r.enabled ? ' opacity-40 cursor-not-allowed' : '')}
                    />

                    {/* Clock Out */}
                    <input
                      type="time"
                      value={r.clockOut}
                      disabled={!r.enabled}
                      onChange={e => setRowField(r.id, 'clockOut', e.target.value)}
                      className={inputClass + (!r.enabled ? ' opacity-40 cursor-not-allowed' : '')}
                    />

                    {/* Break */}
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={r.breakMin}
                      disabled={!r.enabled}
                      onChange={e => setRowField(r.id, 'breakMin', e.target.value)}
                      className={inputClass + (!r.enabled ? ' opacity-40 cursor-not-allowed' : '')}
                      placeholder="0"
                    />

                    {/* Live preview */}
                    <div className="text-right">
                      <span className={`text-xs font-extrabold ${liveHours[i] !== null ? 'text-[#4F6EF7]' : 'text-gray-200'}`}>
                        {liveHours[i] !== null ? decimalToHM(liveHours[i]) : '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculate button + error */}
            <div className="mt-8 space-y-4">
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
                {isCalculating ? 'Calculating...' : 'Calculate Time Card'}
              </button>

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
          </div>
        </div>

        {/* Results card */}
        {result && (
          <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 animate-in fade-in duration-500">
            <div className="p-10 sm:p-14">
              <label className={sectionLabel}>Results</label>

              {/* Summary row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-[#4F6EF7] to-[#7C3AED] rounded-2xl p-5 text-white col-span-2 sm:col-span-1">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Total Hours</p>
                  <p className="text-3xl font-extrabold mt-1">{decimalToHM(result.totalNet)}</p>
                  <p className="text-[9px] font-bold mt-1 opacity-70">{fmt2(result.totalNet)} decimal hrs</p>
                </div>
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
                  <p className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Regular Hours</p>
                  <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">{decimalToHM(result.finalRegular)}</p>
                </div>
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
                  <p className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Overtime Hours</p>
                  <p className={`text-xl font-extrabold mt-1 ${result.totalOt > 0 ? 'text-amber-500' : 'text-[#1E2A5E]'}`}>{decimalToHM(result.totalOt)}</p>
                </div>
                {result.pay !== null ? (
                  <div className="bg-white border-2 border-[#4F6EF7]/30 rounded-2xl p-5">
                    <p className="text-[9px] font-black text-[#4F6EF7] uppercase tracking-widest opacity-80">Est. Pay</p>
                    <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">${result.pay.toFixed(2)}</p>
                    <p className="text-[9px] text-gray-400 font-medium mt-1">${result.rate}/hr · {result.mult}× OT</p>
                  </div>
                ) : (
                  <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-2xl p-5 flex items-center justify-center">
                    <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest text-center">Enter rate for pay</p>
                  </div>
                )}
              </div>

              {/* Daily breakdown table */}
              <div>
                <p className={sectionLabel}>Daily Breakdown</p>
                <div className="hidden sm:grid sm:grid-cols-[1fr_80px_80px_80px] gap-3 mb-2 px-2">
                  <span className={labelClass}>Day</span>
                  <span className={labelClass + ' text-right'}>Net hrs</span>
                  <span className={labelClass + ' text-right'}>Regular</span>
                  <span className={labelClass + ' text-right'}>Overtime</span>
                </div>
                <div className="space-y-2">
                  {result.dayResults.filter(d => !d.skipped || d.worked > 0).map(d => (
                    <div key={d.day} className="grid grid-cols-2 sm:grid-cols-[1fr_80px_80px_80px] gap-3 items-center bg-white border border-gray-100 rounded-2xl px-4 py-3">
                      <p className="text-xs font-black text-[#1E2A5E]">{d.day}</p>
                      <p className="text-xs font-bold text-gray-600 text-right">{decimalToHM(d.worked)}</p>
                      <p className="text-xs font-bold text-gray-500 text-right">{decimalToHM(d.regular)}</p>
                      <p className={`text-xs font-extrabold text-right ${d.daily_ot > 0 ? 'text-amber-500' : 'text-gray-300'}`}>{d.daily_ot > 0 ? decimalToHM(d.daily_ot) : '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature deck */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              t: 'Daily & weekly OT',
              d: 'Calculates both daily overtime (after 8 hrs/day) and weekly overtime (after 40 hrs/week) with configurable thresholds.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Break deduction',
              d: 'Enter unpaid break minutes per day. Net working hours are automatically calculated after deducting all breaks.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Pay estimation',
              d: 'Enter your hourly rate and overtime multiplier (1.25×, 1.5×, 2×) to get an estimated gross pay for the week.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" /></svg>,
            },
          ].map(x => (
            <div key={x.t} className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50">
              <div className="w-12 h-12 rounded-2xl bg-[#4F6EF7] shadow-lg mb-8 flex items-center justify-center text-white">{x.icon}</div>
              <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">{x.t}</h3>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-widest leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeCardCalculator;
