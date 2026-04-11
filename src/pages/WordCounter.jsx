import React, { useState, useMemo } from 'react';

// Common English stop words to exclude from frequency analysis
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'is','it','as','be','by','that','this','was','are','from','has','have',
  'he','she','they','we','i','you','not','no','so','do','up','if','its',
  'his','her','their','our','your','my','me','him','us','them','who','what',
  'how','when','where','which','had','been','were','will','would','could',
  'should','may','can','did','than','then','there','about','into','out','more',
  'also','just','all','any','some','one','two','three','new','also','said',
  'get','got','much','such','even','only','over','after','before','also',
]);

const analyzeText = (text) => {
  if (!text || !text.trim()) return null;

  const charWithSpaces = text.length;
  const charNoSpaces = text.replace(/\s/g, '').length;

  // Words: sequences of word chars including hyphens and apostrophes
  const wordMatches = text.match(/\b[\w''-]+\b/g) || [];
  const words = wordMatches.length;

  // Sentences: end with . ! ?
  const sentences = (text.match(/[^.!?]*[.!?]+/g) || []).filter(s => s.trim().length > 0).length || (text.trim().length > 0 ? 1 : 0);

  // Paragraphs: separated by blank lines
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  // Lines
  const lines = text.split('\n').length;

  // Reading time: avg 238 wpm
  const readingMinutes = words / 238;
  const readingSec = Math.round(readingMinutes * 60);

  // Speaking time: avg 130 wpm
  const speakingMinutes = words / 130;
  const speakingSec = Math.round(speakingMinutes * 60);

  const fmtTime = (totalSec) => {
    if (totalSec < 60) return `${totalSec}s`;
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  // Word frequency (top 10 excluding stop words)
  const freq = {};
  wordMatches.forEach(w => {
    const lower = w.toLowerCase().replace(/['']/g, "'").replace(/^'+|'+$/g, '');
    if (lower.length > 1 && !STOP_WORDS.has(lower)) {
      freq[lower] = (freq[lower] || 0) + 1;
    }
  });
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Avg word length
  const totalLetters = wordMatches.reduce((s, w) => s + w.replace(/[^a-zA-Z]/g, '').length, 0);
  const avgWordLen = words > 0 ? (totalLetters / words).toFixed(1) : 0;

  // Unique words
  const unique = new Set(wordMatches.map(w => w.toLowerCase())).size;

  return {
    charWithSpaces, charNoSpaces, words, sentences,
    paragraphs, lines, avgWordLen, unique,
    readingTime: fmtTime(readingSec),
    speakingTime: fmtTime(speakingSec),
    topWords,
    maxFreq: topWords.length > 0 ? topWords[0][1] : 1,
  };
};

const WordCounter = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => analyzeText(text), [text]);

  const sectionLabel = 'block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none';

  const StatCard = ({ label, value, sub, accent }) => (
    <div className={`rounded-2xl p-4 border-2 ${accent ? 'border-[#4F6EF7]/30 bg-[#4F6EF7]/5' : 'border-gray-100 bg-white'}`}>
      <p className={`text-[9px] font-black uppercase tracking-widest ${accent ? 'text-[#4F6EF7]' : 'text-gray-400'}`}>{label}</p>
      <p className={`text-2xl font-extrabold mt-1 ${accent ? 'text-[#1E2A5E]' : 'text-[#1E2A5E]'}`}>{value}</p>
      {sub && <p className="text-[9px] text-gray-400 font-medium mt-0.5">{sub}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto text-center">

        {/* Header */}
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Word Counter</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Instantly count words, characters, sentences, and paragraphs. Get reading time, speaking time, and top word frequency.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">

          {/* ── LEFT: Text input ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <label className={sectionLabel + ' mb-0'}>Your Text</label>
                  {text && (
                    <button
                      type="button"
                      onClick={() => setText('')}
                      className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-400 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Paste or type your text here…"
                  rows={18}
                  className="w-full resize-none rounded-xl border-2 border-gray-100 px-5 py-4 font-medium text-[#1E2A5E] outline-none transition-all focus:border-[#4F6EF7]/30 focus:shadow-lg focus:shadow-blue-50 bg-white text-sm leading-relaxed custom-scrollbar"
                />
                {/* Live mini-bar */}
                <div className="mt-3 flex flex-wrap gap-4">
                  {[
                    { label: 'Words', val: stats?.words ?? 0 },
                    { label: 'Chars', val: stats?.charWithSpaces ?? 0 },
                    { label: 'Sentences', val: stats?.sentences ?? 0 },
                  ].map(x => (
                    <span key={x.label} className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      {x.label}: <span className="text-[#4F6EF7]">{x.val.toLocaleString()}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Stats ── */}
          <div className="space-y-6">

            {!stats ? (
              <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 p-12 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-[#1E2A5E] font-black uppercase tracking-[5px] text-[10px] opacity-20">Enter text to analyze</p>
              </div>
            ) : (
              <>
                {/* Primary stats */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 p-8 animate-in fade-in duration-400">
                  <label className={sectionLabel}>Text Statistics</label>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard label="Words" value={stats.words.toLocaleString()} accent />
                    <StatCard label="Characters" value={stats.charWithSpaces.toLocaleString()} sub="with spaces" />
                    <StatCard label="Characters" value={stats.charNoSpaces.toLocaleString()} sub="without spaces" />
                    <StatCard label="Unique Words" value={stats.unique.toLocaleString()} />
                    <StatCard label="Sentences" value={stats.sentences.toLocaleString()} />
                    <StatCard label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
                    <StatCard label="Lines" value={stats.lines.toLocaleString()} />
                    <StatCard label="Avg Word Length" value={`${stats.avgWordLen} ch`} />
                  </div>
                </div>

                {/* Time estimates */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 p-8 animate-in fade-in duration-400">
                  <label className={sectionLabel}>Time Estimates</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-gradient-to-br from-[#4F6EF7] to-[#7C3AED] p-5 text-white">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Reading Time</p>
                      <p className="text-3xl font-extrabold mt-1">{stats.readingTime}</p>
                      <p className="text-[9px] font-bold mt-1 opacity-70">@ 238 wpm avg</p>
                    </div>
                    <div className="rounded-2xl border-2 border-gray-100 bg-white p-5">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Speaking Time</p>
                      <p className="text-3xl font-extrabold text-[#1E2A5E] mt-1">{stats.speakingTime}</p>
                      <p className="text-[9px] font-medium text-gray-400 mt-1">@ 130 wpm avg</p>
                    </div>
                  </div>
                </div>

                {/* Top word frequency */}
                {stats.topWords.length > 0 && (
                  <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(79,110,247,0.12)] border border-gray-100 p-8 animate-in fade-in duration-400">
                    <label className={sectionLabel}>Top Words (excl. common words)</label>
                    <div className="space-y-2">
                      {stats.topWords.map(([word, count]) => (
                        <div key={word} className="flex items-center gap-3">
                          <span className="text-xs font-black text-[#1E2A5E] w-24 truncate">{word}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#4F6EF7] to-[#7C3AED] transition-all duration-500"
                              style={{ width: `${(count / stats.maxFreq) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-gray-400 w-8 text-right">{count}×</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Feature deck */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              t: 'Complete text metrics',
              d: 'Words, characters (with/without spaces), sentences, paragraphs, lines, unique words, and average word length — all at once.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Reading & speaking time',
              d: 'Estimated reading time (238 wpm) and speaking time (130 wpm) so you can plan presentations, blog posts, and essays.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>,
            },
            {
              t: 'Word frequency analysis',
              d: 'See the top 10 most-used meaningful words with a visual frequency bar chart. Common stop words are automatically excluded.',
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>,
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

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8f8f8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4F6EF7; }
      `}} />
    </div>
  );
};

export default WordCounter;
