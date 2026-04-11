import React from 'react';

const PremiumPromo = () => {
  return (
    <section className="py-24 px-4 md:px-6 relative overflow-hidden bg-white">
      {/* Background Glows */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl opacity-50 pulse-slow animate-pulse-slow"></div>
      <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-brand-teal/5 rounded-full blur-3xl opacity-30 animate-float"></div>

      <div className="container mx-auto px-8 md:px-20 py-20 bg-brand-dark rounded-[4rem] overflow-hidden relative shadow-[0_40px_80px_-20px_rgba(30,58,138,0.4)]">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-blue/20 via-transparent to-transparent"></div>
        <div className="absolute top-10 right-20 text-white/5 transform rotate-12 select-none">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="text-white">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
              Get more with <br/>
              <span className="text-brand-blue inline-flex items-center gap-4">
                Premium
                <span className="px-3 py-1 bg-brand-blue/20 text-brand-blue rounded-full text-xs font-black uppercase tracking-widest border border-brand-blue/30">Go Pro</span>
              </span>
            </h2>
            <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-lg leading-relaxed font-medium">
              Take your productivity to the next level with tools that work smarter. Unlock the full potential of Gugly Mugly.
            </p>

            <ul className="space-y-8 mb-14">
              {[
                { title: 'Ad-free Experience', desc: 'No distractions, just pure professional tools.' },
                { title: 'Unlimited Usage', desc: 'Break through all caps and process files freely.' },
                { title: 'Priority Support', desc: 'Get faster processing and 24/7 dedicated help.' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-6 group">
                  <div className="bg-brand-blue/30 p-2 rounded-2xl group-hover:bg-brand-blue transition-all duration-300 shadow-lg shadow-brand-blue/20">
                    <svg className="text-brand-blue group-hover:text-white transition-colors" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <h4 className="font-black text-xl mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-base font-medium">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <button className="bg-white text-brand-dark px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-brand-blue hover:text-white transition-all transform active:scale-95 shadow-2xl hover:shadow-brand-blue/40">
              Get Started for $5.99/mo
            </button>
          </div>

          <div className="relative group perspective-1000">
            {/* Glossy Backdrop for Laptop */}
            <div className="absolute inset-0 bg-brand-blue/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] transform lg:rotate-3 lg:group-hover:rotate-0 transition-transform duration-1000 border-8 border-white/5 backdrop-blur-sm">
              <img 
                src="file:///C:/Users/Sohaib Khan/.gemini/antigravity/brain/659abbef-485a-4894-956c-55e9aa486381/laptop_mockup_premium_1775033033752.png" 
                alt="Premium Dashboard" 
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating Elements on Laptop Overlay */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-brand-blue/60 to-transparent rounded-full blur-[80px] animate-pulse-slow"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-tr from-brand-teal/40 to-transparent rounded-full blur-[80px] animate-float"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumPromo;
