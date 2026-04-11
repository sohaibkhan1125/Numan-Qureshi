import React, { useState } from 'react';

const ContentImprover = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const API_KEY = 'cca330428dmsh4b459b029c77e3cp1a7504jsn8f61efbba564';

  const handleImprove = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setOutputText('');
    setCopied(false);

    try {
      const response = await fetch('https://chatgpt-api8.p.rapidapi.com/', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'chatgpt-api8.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            content: 'You are an expert AI content editor. Your job is to improve the user\'s text. Fix any grammatical errors, enhance the vocabulary, and make the text more engaging and professional. Preserve the original meaning. Do not write introductory or concluding phrases like "Here is the improved text:". Output ONLY the improved text.',
            role: 'system',
          },
          {
            content: inputText,
            role: 'user',
          },
        ]),
      });

      if (!response.ok) {
        throw new Error('API Request Failed. Please ensure the RapidAPI server is active.');
      }

      const data = await response.json();
      
      if (data && data.text) {
        setOutputText(data.text);
      } else {
        throw new Error('Invalid response received from intelligence engine.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to process content.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sectionLabel = 'block text-[10px] font-black uppercase tracking-[4px] text-gray-300 mb-4 leading-none';

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto text-center">

        {/* ── HEADER ── */}
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Content Improver</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Instantly fix grammar, rewrite sentences for better flow, and elevate your vocabulary using advanced AI.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* ── LEFT: Text Input ── */}
          <div className="space-y-4 flex flex-col">
            <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(239,73,126,0.12)] border border-gray-100 overflow-hidden flex-1 flex flex-col">
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <label className={sectionLabel + ' mb-0'}>Your Text</label>
                  {inputText && !isLoading && (
                    <button
                      type="button"
                      onClick={() => setInputText('')}
                      className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-400 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or type the content you want to improve..."
                  className="w-full flex-1 min-h-[250px] resize-none rounded-xl border-2 border-gray-100 px-5 py-4 font-medium text-[#1E2A5E] outline-none transition-all focus:border-[#ef497e]/30 focus:shadow-lg focus:shadow-rose-50 bg-white text-sm leading-relaxed custom-scrollbar"
                />
              </div>
              <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                <button
                  type="button"
                  onClick={handleImprove}
                  disabled={!inputText.trim() || isLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-extrabold text-white text-md transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #ef497e, #ff9248)',
                    boxShadow: '0 8px 20px -5px rgba(239, 73, 126, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Improving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                      </svg>
                      Improve Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Output View ── */}
          <div className="space-y-4 flex flex-col">
            <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(239,73,126,0.12)] border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-[350px]">
              <div className="p-8 flex-1 flex flex-col relative">
                <div className="flex items-center justify-between mb-4">
                  <label className={sectionLabel + ' mb-0'}>Improved Output</label>
                  {outputText && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`text-[9px] font-black uppercase tracking-widest transition-colors ${copied ? 'text-green-500' : 'text-[#ef497e] hover:brightness-110'}`}
                    >
                      {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ef497e] rounded-full animate-spin mb-4" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1E2A5E]">Rewriting intelligence active...</p>
                  </div>
                ) : error ? (
                  <div className="flex-1 flex items-center justify-center text-center p-6 bg-red-50 rounded-xl border border-red-100">
                    <div>
                      <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <p className="text-red-800 text-xs font-bold leading-relaxed">{error}</p>
                    </div>
                  </div>
                ) : outputText ? (
                  <div className="flex-1 text-[#1E2A5E] bg-gray-50/50 rounded-xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar border border-gray-100">
                    {outputText}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-20 transition-opacity duration-300">
                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <p className="font-black uppercase tracking-[5px] text-[10px]">Awaiting Content</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── FEATURE DECK ── */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              t: 'Grammatically Perfect',
              d: 'Instantly identifies and resolves grammatical errors, typo structures, and semantic faults without altering your core narrative.',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            },
            {
              t: 'Dynamic Phrasing',
              d: 'Elevates your vocabulary by seamlessly swapping out repetitive words for deeply engaging contextual synonyms.',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>,
            },
            {
              t: 'Professional Polish',
              d: 'Uses the powerful ChatGPT intelligence engine to ensure your text reads like a carefully edited, highly professional master copy.',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
            },
          ].map(x => (
            <div key={x.t} className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50">
              <div className="w-12 h-12 rounded-2xl bg-[#ef497e] shadow-lg mb-8 flex items-center justify-center text-white">{x.icon}</div>
              <h3 className="text-[#1E2A5E] font-black text-lg uppercase tracking-tight mb-4">{x.t}</h3>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-widest leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef497e; }
      `}} />
    </div>
  );
};

export default ContentImprover;
