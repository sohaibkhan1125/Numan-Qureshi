import React, { useState } from 'react';

const EssayWriter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Exact same ChatGPT API endpoint
  const API_KEY = 'cca330428dmsh4b459b029c77e3cp1a7504jsn8f61efbba564';

  const handleGenerate = async () => {
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
            content: 'You are an expert academic essay writer. You will be given a topic or prompt. Generate a well-structured, coherent, thoughtfully argued, and comprehensive essay on the provided topic. Ensure proper paragraphs, introduction, body, and conclusion. Do not include conversational filler like "Here is your essay:". Output ONLY the essay.',
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
      setError(err.message || 'Failed to generate essay.');
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
          <h1 className="text-4xl sm:text-5xl font-black text-[#1E2A5E] mb-4 tracking-tight">Essay Writer</h1>
          <p className="text-gray-500 text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Instantly generate well-structured, coherent, and highly engaging essays on any given topic using ChatGPT intelligence.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* ── LEFT: Text Input ── */}
          <div className="space-y-4 flex flex-col">
            <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(234,179,8,0.12)] border border-gray-100 overflow-hidden flex-1 flex flex-col">
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <label className={sectionLabel + ' mb-0'}>Essay Topic & Details</label>
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
                  placeholder="Enter your essay topic, prompt, or detailed instructions here..."
                  className="w-full flex-1 min-h-[250px] resize-none rounded-xl border-2 border-gray-100 px-5 py-4 font-medium text-[#1E2A5E] outline-none transition-all focus:border-[#eab308]/30 focus:shadow-lg focus:shadow-yellow-50 bg-white text-sm leading-relaxed custom-scrollbar"
                />
              </div>
              <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!inputText.trim() || isLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-extrabold text-white text-md transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #eab308, #ff9248)',
                    boxShadow: '0 8px 20px -5px rgba(234, 179, 8, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Writing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.14l-2.81.936a.75.75 0 01-.95-.95l.935-2.81a4.5 4.5 0 011.14-1.89l13.626-13.626z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.875 4.5" />
                      </svg>
                      Generate Essay
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Output View ── */}
          <div className="space-y-4 flex flex-col">
            <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(234,179,8,0.12)] border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-[350px]">
              <div className="p-8 flex-1 flex flex-col relative">
                <div className="flex items-center justify-between mb-4">
                  <label className={sectionLabel + ' mb-0'}>Generated Essay</label>
                  {outputText && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`text-[9px] font-black uppercase tracking-widest transition-colors ${copied ? 'text-green-500' : 'text-[#ff9248] hover:brightness-110'}`}
                    >
                      {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#eab308] rounded-full animate-spin mb-4" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1E2A5E]">Drafting synthesis active...</p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                    </svg>
                    <p className="font-black uppercase tracking-[5px] text-[10px]">Awaiting Topic</p>
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
              t: 'Academic Structuring',
              d: 'Automatically formats your essay with a compelling introduction, deeply argued body paragraphs, and a comprehensive conclusion.',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>,
            },
            {
              t: 'Thematic Flow',
              d: 'Constructs strong, coherent sentences that cleanly transition from topic to topic, maintaining highly engaged readability.',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
            },
            {
              t: 'ChatGPT Powered',
              d: 'Drives output utilizing one of the highest reasoning intelligence engines, perfectly fulfilling complex instructions at unmatched speeds.',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
            },
          ].map(x => (
            <div key={x.t} className="bg-white p-10 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50">
              <div className="w-12 h-12 rounded-2xl bg-[#eab308] shadow-lg mb-8 flex items-center justify-center text-white">{x.icon}</div>
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #eab308; }
      `}} />
    </div>
  );
};

export default EssayWriter;
