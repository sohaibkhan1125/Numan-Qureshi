import React, { useState } from 'react';

const FreelanceRateCalculator = () => {
  const [incomeGoal, setIncomeGoal] = useState('');
  const [weeklyHours, setWeeklyHours] = useState('');
  const [billablePct, setBillablePct] = useState('60');
  const [workingWeeks, setWorkingWeeks] = useState('48');
  const [overheadPct, setOverheadPct] = useState('20');
  const [taxPct, setTaxPct] = useState('25');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const fail = (msg) => {
    setError(msg);
    setIsCalculating(false);
  };

  const onCalculate = () => {
    setError(null);

    const goal = Number(incomeGoal);
    const hrs = Number(weeklyHours);
    const bill = Number(billablePct);
    const weeks = Number(workingWeeks);
    const overhead = Number(overheadPct);
    const tax = Number(taxPct);

    if (!Number.isFinite(goal) || goal <= 0) return fail('Enter a valid annual income goal greater than 0.');
    if (!Number.isFinite(hrs) || hrs <= 0) return fail('Enter valid weekly hours greater than 0.');
    if (!Number.isFinite(bill) || bill <= 0 || bill > 100) return fail('Billable percentage must be between 1 and 100.');
    if (!Number.isFinite(weeks) || weeks <= 0 || weeks > 52) return fail('Working weeks must be between 1 and 52.');
    if (!Number.isFinite(overhead) || overhead < 0 || overhead > 100) return fail('Overhead percentage must be between 0 and 100.');
    if (!Number.isFinite(tax) || tax < 0 || tax > 100) return fail('Tax percentage must be between 0 and 100.');

    const yearlyBillableHours = hrs * weeks * (bill / 100);
    if (yearlyBillableHours <= 0) return fail('Calculated billable hours must be greater than 0.');

    const requiredRevenue = goal / (1 - tax / 100 - overhead / 100);
    if (!Number.isFinite(requiredRevenue) || requiredRevenue <= 0) {
      return fail('Overhead + tax is too high. Keep the total below 100%.');
    }

    const hourlyRate = requiredRevenue / yearlyBillableHours;
    const dayRate = hourlyRate * 8;
    const monthRevenue = requiredRevenue / 12;

    setResult({
      yearlyBillableHours,
      requiredRevenue,
      hourlyRate,
      dayRate,
      monthRevenue,
    });
    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const onInputChange = (setter, value) => {
    setter(value);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Freelance Rate Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Estimate a sustainable hourly and day rate from your income target, billable time, overhead, and taxes.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Inputs</label>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Annual take-home goal</label>
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={incomeGoal}
                    onChange={(e) => onInputChange(setIncomeGoal, e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                    placeholder="60000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Weekly hours</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={weeklyHours}
                      onChange={(e) => onInputChange(setWeeklyHours, e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                      placeholder="40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Working weeks/year</label>
                    <input
                      type="number"
                      min="1"
                      max="52"
                      step="1"
                      value={workingWeeks}
                      onChange={(e) => onInputChange(setWorkingWeeks, e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                      placeholder="48"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Billable %</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      value={billablePct}
                      onChange={(e) => onInputChange(setBillablePct, e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Overhead %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={overheadPct}
                      onChange={(e) => onInputChange(setOverheadPct, e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                      placeholder="20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Tax %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={taxPct}
                      onChange={(e) => onInputChange(setTaxPct, e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none focus:border-[#4F6EF7]/30 bg-white"
                      placeholder="25"
                    />
                  </div>
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
                  {isCalculating ? 'Calculating...' : 'Calculate Rate'}
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
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none">Result</label>
                {!result ? (
                  <div className="h-full min-h-[220px] flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30">
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter freelancer inputs</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Suggested hourly rate</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">{result.hourlyRate.toFixed(2)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Suggested day rate</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.dayRate.toFixed(2)}</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Billable hours/year</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.yearlyBillableHours.toFixed(0)}</p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Required yearly revenue</p>
                      <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.requiredRevenue.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-2">~{result.monthRevenue.toFixed(2)} per month average</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Real billable time', d: 'Accounts for non-billable admin, sales, and project management hours.' },
            { t: 'Overhead + tax', d: 'Builds business costs and taxes into a sustainable minimum rate.' },
            { t: 'Hourly and day rates', d: 'Get both pricing anchors to quote projects confidently.' },
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

export default FreelanceRateCalculator;

