import React, { useState } from 'react';

const PaceCalculator = () => {
  const [unit, setUnit] = useState('km');
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const onCalculate = () => {
    setError(null);

    const d = Number(distance);
    const h = Number(hours || 0);
    const m = Number(minutes || 0);
    const s = Number(seconds || 0);

    if (!Number.isFinite(d) || d <= 0) {
      setError('Enter a valid distance greater than 0.');
      setIsCalculating(false);
      return;
    }
    if (!Number.isFinite(h) || !Number.isFinite(m) || !Number.isFinite(s) || h < 0 || m < 0 || s < 0) {
      setError('Enter valid time values (0 or more).');
      setIsCalculating(false);
      return;
    }
    if (m >= 60 || s >= 60) {
      setError('Minutes and seconds must be less than 60.');
      setIsCalculating(false);
      return;
    }

    const totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds <= 0) {
      setError('Total time must be greater than 0.');
      setIsCalculating(false);
      return;
    }

    const paceSecPerUnit = totalSeconds / d;
    const speedPerHour = d / (totalSeconds / 3600);

    const paceMin = Math.floor(paceSecPerUnit / 60);
    const paceSec = Math.round(paceSecPerUnit % 60);
    const normalizedPaceMin = paceSec === 60 ? paceMin + 1 : paceMin;
    const normalizedPaceSec = paceSec === 60 ? 0 : paceSec;

    const kmh = unit === 'km' ? speedPerHour : speedPerHour * 1.609344;
    const mph = unit === 'mi' ? speedPerHour : speedPerHour / 1.609344;

    setResult({
      paceMin: normalizedPaceMin,
      paceSec: normalizedPaceSec,
      speedPerHour,
      kmh,
      mph,
      unit,
      distance: d,
      totalSeconds,
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
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Pace Calculator</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Calculate pace and speed from your run, walk, or ride distance and time.
          </p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Distance unit</label>
                <div className="flex gap-2">
                  {[
                    { id: 'km', label: 'Kilometers' },
                    { id: 'mi', label: 'Miles' },
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
                        unit === u.id
                          ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]'
                          : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">
                    Distance ({unit})
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={distance}
                    onChange={(e) => onInputChange(setDistance, e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 bg-white"
                    placeholder={unit === 'km' ? '5' : '3.1'}
                  />
                </div>

                <label className="block text-[10px] font-black uppercase tracking-[4px] text-gray-300 leading-none">Time</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Hours</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={hours}
                      onChange={(e) => onInputChange(setHours, e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 bg-white"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Minutes</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      step="1"
                      value={minutes}
                      onChange={(e) => onInputChange(setMinutes, e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 bg-white"
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1">Seconds</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      step="1"
                      value={seconds}
                      onChange={(e) => onInputChange(setSeconds, e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 bg-white"
                      placeholder="0"
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
                  {isCalculating ? 'Calculating...' : 'Calculate Pace'}
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
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter distance and time</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Average pace</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">
                        {result.paceMin}:{String(result.paceSec).padStart(2, '0')} / {result.unit}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Speed ({result.unit}/h)</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{result.speedPerHour.toFixed(3)}</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Time (total)</p>
                        <p className="text-lg font-extrabold text-[#1E2A5E] mt-1">{Math.round(result.totalSeconds)} sec</p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Unit cross-check</p>
                      <p className="text-sm font-bold text-[#1E2A5E] mt-1">{result.kmh.toFixed(3)} km/h</p>
                      <p className="text-sm font-bold text-[#1E2A5E]">{result.mph.toFixed(3)} mph</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { t: 'Pace + speed', d: 'Get both minutes per unit and average speed per hour.' },
            { t: 'KM or MI', d: 'Switch between kilometer and mile workouts easily.' },
            { t: 'Simple race math', d: 'Useful for training checks and rough race planning.' },
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

export default PaceCalculator;

