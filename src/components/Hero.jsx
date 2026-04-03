import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="pt-48 pb-24 px-4 md:px-6 bg-white overflow-hidden relative">
      {/* Precision Background Ornaments (3D Shapes) */}
      
      {/* Pink Cube (Top Left) */}
      <div className="absolute top-20 left-[10%] w-6 h-6 animate-float opacity-80 z-0">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef497e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 8-9-4-9 4 9 4 9-4Z"/><path d="m3 8 9 4 9-4"/><path d="m12 12v9"/><path d="m3 16 9 4 9-4"/><path d="m3 8v8"/><path d="m21 8v8"/></svg>
      </div>

      {/* Yellow Triangle (Top Right) */}
      <div className="absolute top-24 right-[15%] w-8 h-8 animate-pulse-slow opacity-90 z-0">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffcc00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18L12 4z"/></svg>
      </div>

      {/* Blue Pyramid (Bottom Left) */}
      <div className="absolute bottom-20 left-[15%] w-10 h-10 animate-float opacity-70 z-0">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#1ea5ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 10 14-10 6-10-6 10-14Z"/><path d="m2 16 10-2.5 10 2.5"/></svg>
      </div>

      {/* Pink Rect (Mid Right) */}
      <div className="absolute top-1/2 right-[5%] w-6 h-6 animate-pulse opacity-80 z-0">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#ef497e" className="opacity-60"><rect x="0" y="0" width="20" height="20" rx="4"/></svg>
      </div>

      {/* Scattered Dots */}
      <div className="absolute top-1/3 left-[5%] text-slate-200 select-none opacity-40">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="10" cy="10" r="1.5" /><circle cx="30" cy="10" r="1.5" /><circle cx="50" cy="10" r="1.5" />
            <circle cx="10" cy="30" r="1.5" /><circle cx="30" cy="30" r="1.5" /><circle cx="50" cy="30" r="1.5" />
            <circle cx="10" cy="50" r="1.5" /><circle cx="30" cy="50" r="1.5" /><circle cx="50" cy="50" r="1.5" />
        </svg>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-slate-800 leading-[1.2] mb-6 tracking-tight">
          Smart Web Tools to Make <br/>
          <span className="relative inline-block mx-3">
             {/* Orange Solid Box */}
             <span className="relative z-10 bg-[#ff9248] text-white px-6 py-1 rounded-[5px] inline-block shadow-lg shadow-orange-500/20">
                Workflow
             </span>
          </span>
          Simple
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-6 leading-relaxed">
          Gugly Mugly offers PDF, video, image, and other online tools to make your life easier
        </p>
        <p className="text-sm font-bold text-slate-500 mb-14">
          <span className="text-slate-400 uppercase tracking-widest text-xs font-black mr-2">Browse</span>
          <Link to="/pdf-tools" className="text-[#1ea5ed] hover:underline mx-1.5 no-underline decoration-none">
            PDF tools
          </Link>
          <span className="text-slate-300">·</span>
          <Link to="/image-tools" className="text-[#ff9248] hover:underline mx-1.5 no-underline decoration-none font-black">
            Image tools
          </Link>
          <span className="text-slate-300">·</span>
          <Link to="/calculator-tools" className="text-[#6366f1] hover:underline mx-1.5 no-underline decoration-none">
            Calculator tools
          </Link>
        </p>

        {/* Precision Pill Search Bar */}
        <div className="max-w-4xl mx-auto relative group">
          <div className="relative flex items-center p-1.5 bg-white border border-slate-100 rounded-full shadow-[0_20px_50px_-20px_rgba(30,165,237,0.25)] group-focus-within:ring-8 group-focus-within:ring-[#1ea5ed]/10 transition-all">
            <div className="pl-10 pr-4">
              <svg className="text-[#1ea5ed]" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search" 
              className="flex-1 py-5 px-4 text-slate-500 font-medium border-none focus:ring-0 outline-none placeholder:text-slate-400 text-lg"
            />
            <button className="bg-[#1ea5ed] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-600 transition-all transform active:scale-95 shadow-md">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
