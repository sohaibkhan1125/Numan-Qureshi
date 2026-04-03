import React, { useState } from 'react';

const YARN_WEIGHTS = [
  { label: 'Lace (0)', stitchPer100m: 400 },
  { label: 'Super Fine / Sock (1)', stitchPer100m: 320 },
  { label: 'Fine / Sport (2)', stitchPer100m: 260 },
  { label: 'Light / DK (3)', stitchPer100m: 210 },
  { label: 'Medium / Worsted (4)', stitchPer100m: 160 },
  { label: 'Bulky (5)', stitchPer100m: 110 },
  { label: 'Super Bulky (6)', stitchPer100m: 70 },
  { label: 'Jumbo (7)', stitchPer100m: 40 },
];

const StitchCounter = () => {
  const [mode, setMode] = useState('count'); // 'count' | 'gauge' | 'yarn'

  // ── Mode 1: Total stitch count ───────────────────────────
  const [stitchesPerRow, setStitchesPerRow] = useState('');
  const [numRows, setNumRows] = useState('');

  // ── Mode 2: Gauge adjuster ───────────────────────────────
  const [unit, setUnit] = useState('inch'); // 'inch' | 'cm'
  const [patternGauge, setPatternGauge] = useState(''); // sts per unit
  const [myGauge, setMyGauge] = useState('');           // sts per unit
  const [patternStitches, setPatternStitches] = useState('');
  const [patternRows, setPatternRows] = useState('');       // rows used in pattern
  const [patternRowGauge, setPatternRowGauge] = useState(''); // rows per unit in pattern
  const [myRowGauge, setMyRowGauge] = useState('');          // rows per unit (mine)

  // ── Mode 3: Yarn estimator ───────────────────────────────
  const [totalStitchesYarn, setTotalStitchesYarn] = useState('');
  const [yarnWeightIdx, setYarnWeightIdx] = useState(4); // default Worsted

  // ── Shared ───────────────────────────────────────────────
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const reset = () => { setResult(null); setError(null); };
  const fail = (msg) => { setError(msg); setIsCalculating(false); };

  // ── Calculation ──────────────────────────────────────────
  const onCalculate = () => {
    setError(null);

    if (mode === 'count') {
      const spr = Number(stitchesPerRow);
      const rows = Number(numRows);
      if (!Number.isFinite(spr) || spr <= 0) return fail('Enter a valid number of stitches per row/round (> 0).');
      if (!Number.isFinite(rows) || rows <= 0) return fail('Enter a valid number of rows/rounds (> 0).');

      const total = spr * rows;
      setResult({ mode: 'count', stitchesPerRow: spr, numRows: rows, total });
    }

    else if (mode === 'gauge') {
      const pg = Number(patternGauge);
      const mg = Number(myGauge);
      const ps = Number(patternStitches);

      if (!Number.isFinite(pg) || pg <= 0) return fail('Enter a valid pattern stitch gauge (stitches per ' + (unit === 'inch' ? 'inch' : 'cm') + ').');
      if (!Number.isFinite(mg) || mg <= 0) return fail('Enter a valid my gauge (stitches per ' + (unit === 'inch' ? 'inch' : 'cm') + ').');
      if (!Number.isFinite(ps) || ps <= 0) return fail('Enter a valid pattern stitch count (> 0).');

      const scaleFactor = mg / pg;
      const adjustedStitches = Math.round(ps * scaleFactor);

      // Optional row adjustment
      let rowResult = null;
      const pr = Number(patternRows);
      const prg = Number(patternRowGauge);
      const mrg = Number(myRowGauge);
      if (Number.isFinite(pr) && pr > 0 && Number.isFinite(prg) && prg > 0 && Number.isFinite(mrg) && mrg > 0) {
        const rowScaleFactor = mrg / prg;
        rowResult = { adjustedRows: Math.round(pr * rowScaleFactor), rowScaleFactor };
      }

      setResult({ mode: 'gauge', pg, mg, ps, scaleFactor, adjustedStitches, unit, rowResult });
    }

    else {
      const ts = Number(totalStitchesYarn);
      if (!Number.isFinite(ts) || ts <= 0) return fail('Enter a valid total stitch count (> 0).');

      const weight = YARN_WEIGHTS[yarnWeightIdx];
      const estimatedMeters = (ts / weight.stitchPer100m) * 100;
      const estimatedYards = estimatedMeters * 1.09361;

      setResult({
        mode: 'yarn',
        totalStitches: ts,
        yarnLabel: weight.label,
        estimatedMeters,
        estimatedYards,
      });
    }

    setIsCalculating(false);
  };

  const onSubmit = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTimeout(onCalculate, 0);
  };

  const inputClass = 'w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white';
  const labelClass = 'text-[9px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-40 ml-1';
  const sectionLabel = 'block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none';

  const modes = [
    { id: 'count', label: 'Total Stitch Count' },
    { id: 'gauge', label: 'Gauge Adjuster' },
    { id: 'yarn', label: 'Yarn Estimator' },
  ];

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">

        {/* Header */}
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">
            Stitch Counter
          </h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Count total stitches, adjust for gauge differences, or estimate yarn needed for any knitting or crochet project.
          </p>
        </header>

        {/* Main card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden text-left mb-10 transition-all duration-500">
          <div className="p-10 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* ── LEFT: Inputs ── */}
              <div className="text-left space-y-7">

                {/* Mode tabs */}
                <div>
                  <label className={sectionLabel}>Calculation Mode</label>
                  <div className="flex flex-col gap-2">
                    {modes.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { setMode(m.id); reset(); }}
                        className={`w-full py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 text-left ${
                          mode === m.id
                            ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]'
                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── MODE 1: Total Count ── */}
                {mode === 'count' && (
                  <div className="space-y-5">
                    <label className={sectionLabel}>Stitch Details</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className={labelClass}>Stitches per row/round</label>
                        <input
                          type="number" min="1" step="1"
                          value={stitchesPerRow}
                          onChange={e => { setStitchesPerRow(e.target.value); reset(); }}
                          className={inputClass} placeholder="40"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Number of rows/rounds</label>
                        <input
                          type="number" min="1" step="1"
                          value={numRows}
                          onChange={e => { setNumRows(e.target.value); reset(); }}
                          className={inputClass} placeholder="60"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── MODE 2: Gauge Adjuster ── */}
                {mode === 'gauge' && (
                  <div className="space-y-5">
                    <div>
                      <label className={sectionLabel}>Unit</label>
                      <div className="flex gap-2">
                        {[{ id: 'inch', label: 'Per inch' }, { id: 'cm', label: 'Per 10 cm' }].map(u => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => { setUnit(u.id); reset(); }}
                            className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                              unit === u.id ? 'border-[#4F6EF7] bg-[#4F6EF7]/5 text-[#1E2A5E]' : 'border-gray-100 text-gray-400'
                            }`}
                          >
                            {u.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className={sectionLabel}>Stitch Gauge</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className={labelClass}>Pattern gauge (sts/{unit === 'inch' ? 'in' : '10cm'})</label>
                        <input
                          type="number" min="0.5" step="0.5"
                          value={patternGauge}
                          onChange={e => { setPatternGauge(e.target.value); reset(); }}
                          className={inputClass} placeholder="20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>My gauge (sts/{unit === 'inch' ? 'in' : '10cm'})</label>
                        <input
                          type="number" min="0.5" step="0.5"
                          value={myGauge}
                          onChange={e => { setMyGauge(e.target.value); reset(); }}
                          className={inputClass} placeholder="22"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Pattern stitch count to adjust</label>
                      <input
                        type="number" min="1" step="1"
                        value={patternStitches}
                        onChange={e => { setPatternStitches(e.target.value); reset(); }}
                        className={inputClass} placeholder="120"
                      />
                    </div>

                    {/* Optional row gauge */}
                    <label className={sectionLabel}>Row Gauge (optional)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className={labelClass}>Pattern rows/{unit === 'inch' ? 'in' : '10cm'}</label>
                        <input
                          type="number" min="0.5" step="0.5"
                          value={patternRowGauge}
                          onChange={e => { setPatternRowGauge(e.target.value); reset(); }}
                          className={inputClass} placeholder="28"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>My rows/{unit === 'inch' ? 'in' : '10cm'}</label>
                        <input
                          type="number" min="0.5" step="0.5"
                          value={myRowGauge}
                          onChange={e => { setMyRowGauge(e.target.value); reset(); }}
                          className={inputClass} placeholder="30"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Pattern row count to adjust</label>
                      <input
                        type="number" min="1" step="1"
                        value={patternRows}
                        onChange={e => { setPatternRows(e.target.value); reset(); }}
                        className={inputClass} placeholder="80"
                      />
                    </div>
                  </div>
                )}

                {/* ── MODE 3: Yarn Estimator ── */}
                {mode === 'yarn' && (
                  <div className="space-y-5">
                    <label className={sectionLabel}>Project Details</label>
                    <div className="space-y-2">
                      <label className={labelClass}>Total stitch count</label>
                      <input
                        type="number" min="1" step="1"
                        value={totalStitchesYarn}
                        onChange={e => { setTotalStitchesYarn(e.target.value); reset(); }}
                        className={inputClass} placeholder="2400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Yarn weight</label>
                      <select
                        value={yarnWeightIdx}
                        onChange={e => { setYarnWeightIdx(Number(e.target.value)); reset(); }}
                        className={inputClass + ' cursor-pointer'}
                      >
                        {YARN_WEIGHTS.map((w, i) => (
                          <option key={i} value={i}>{w.label}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed px-1">
                      Estimates are based on average stitch yarn consumption per weight category. Add 10–15% buffer for weaving in ends and tension variations.
                    </p>
                  </div>
                )}

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
                  {isCalculating ? 'Calculating...' : 'Calculate'}
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

              {/* ── RIGHT: Result ── */}
              <div className="text-left">
                <label className={sectionLabel}>Result</label>

                {!result ? (
                  <div className="h-full min-h-[260px] flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/30 gap-3">
                    <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter values to calculate</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 space-y-4 animate-in fade-in duration-500">

                    {/* Mode 1 result */}
                    {result.mode === 'count' && (
                      <>
                        <div className="bg-white border border-gray-100 rounded-2xl p-5">
                          <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Total Stitches</p>
                          <p className="text-4xl font-extrabold text-[#1E2A5E] mt-1">{result.total.toLocaleString()}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Stitches / Row</p>
                            <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">{result.stitchesPerRow}</p>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Rows / Rounds</p>
                            <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">{result.numRows}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium px-1 leading-relaxed">
                          Formula: Total = Stitches per row × Number of rows.
                        </p>
                      </>
                    )}

                    {/* Mode 2 result */}
                    {result.mode === 'gauge' && (
                      <>
                        <div className="bg-white border border-gray-100 rounded-2xl p-5">
                          <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Adjusted Stitch Count</p>
                          <p className="text-4xl font-extrabold text-[#1E2A5E] mt-1">{result.adjustedStitches.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-2">Rounded to nearest whole stitch</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Scale Factor</p>
                            <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">{result.scaleFactor.toFixed(4)}×</p>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Original Count</p>
                            <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">{result.ps.toLocaleString()}</p>
                          </div>
                        </div>
                        {result.rowResult && (
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Adjusted Row Count</p>
                            <p className="text-2xl font-extrabold text-[#1E2A5E] mt-1">{result.rowResult.adjustedRows.toLocaleString()} rows</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-1">Row scale factor: {result.rowResult.rowScaleFactor.toFixed(4)}×</p>
                          </div>
                        )}
                        <p className="text-[10px] text-gray-400 font-medium px-1 leading-relaxed">
                          Adjusted = Pattern stitches × (My gauge ÷ Pattern gauge). Always knit a gauge swatch to verify.
                        </p>
                      </>
                    )}

                    {/* Mode 3 result */}
                    {result.mode === 'yarn' && (
                      <>
                        <div className="bg-gradient-to-br from-[#4F6EF7] to-[#7C3AED] rounded-2xl p-5 text-white">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Estimated Yarn</p>
                          <p className="text-4xl font-extrabold mt-1">{Math.ceil(result.estimatedMeters)} m</p>
                          <p className="text-sm font-bold mt-1 opacity-80">{Math.ceil(result.estimatedYards)} yards</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Total Stitches</p>
                            <p className="text-xl font-extrabold text-[#1E2A5E] mt-1">{result.totalStitches.toLocaleString()}</p>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">With 15% Buffer</p>
                            <p className="text-xl font-extrabold text-[#4F6EF7] mt-1">{Math.ceil(result.estimatedMeters * 1.15)} m</p>
                          </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-[#1E2A5E] uppercase tracking-widest opacity-60">Yarn Weight</p>
                          <p className="text-sm font-bold text-[#1E2A5E] mt-2">{result.yarnLabel}</p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium px-1 leading-relaxed">
                          Estimates are approximate. Tension, stitch pattern, and fibre type all affect actual yarn usage. Always add a safety buffer.
                        </p>
                      </>
                    )}

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
              t: 'Total stitch count',
              d: 'Multiply stitches per row by number of rows or rounds to get the exact total stitch count for any project.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Gauge adjuster',
              d: 'Your tension differs from the pattern? Rescale stitch and row counts automatically to match your personal gauge.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Yarn estimator',
              d: 'Enter your total stitch count and yarn weight to get a meters/yards estimate — with an automatic 15% safety buffer.',
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
    </div>
  );
};

export default StitchCounter;
