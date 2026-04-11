import React from 'react';

const featured = [
  {
    title: 'PDF Creator',
    desc: 'Create single-page PDFs quickly and easily with our professional free PDF creator.',
    tag: 'NEW TOOLS',
    image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=800',
    color: 'bg-brand-blue/5',
  },
  {
    title: 'Background Remover',
    desc: 'Remove any image background with just one click using our high-accuracy AI.',
    tag: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=800',
    color: 'bg-brand-orange/5',
  },
  {
    title: 'Photo Cleanup',
    desc: 'Use AI to remove unwanted objects from your photos without losing any detail.',
    tag: 'FREE',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    color: 'bg-brand-teal/5',
  },
];

const FeaturedTools = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-white overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-[-10%] w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-[-10%] w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl opacity-50"></div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight leading-[1.1]">
              Free Tools You'd <br/> Usually Pay For
            </h2>
            <div className="flex items-center gap-2 text-slate-500 font-black text-xs uppercase tracking-widest">
              <span className="text-brand-blue">No Limits. No Sign-Up.</span>
              <span className="h-2 w-2 rounded-full bg-slate-200"></span>
              <span>More tools added weekly.</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="w-16 h-16 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 hover:border-brand-blue hover:text-brand-blue transition-all bg-white shadow-sm hover:shadow-lg hover:shadow-brand-blue/10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="w-16 h-16 rounded-full bg-brand-blue flex items-center justify-center text-white hover:bg-brand-dark transition-all transform active:scale-95 shadow-[0_15px_30px_-10px_rgba(30,165,237,0.5)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featured.map((item, idx) => (
            <div key={idx} className="group rounded-[2.5rem] border-2 border-slate-50 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-700 bg-white flex flex-col hover:-translate-y-3 cursor-pointer">
              <div className="p-10 pb-0">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">{item.tag}</span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-3 group-hover:text-brand-blue transition-colors tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">{item.desc}</p>
                <div className="flex items-center gap-2 text-brand-blue font-black text-xs group-hover:gap-5 transition-all uppercase tracking-[0.2em]">
                  Get Started
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </div>
              </div>
              <div className="mt-10 px-6 pb-6">
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl shadow-slate-900/10 group-hover:shadow-brand-blue/10 transition-all duration-700 border-2 border-transparent group-hover:border-brand-blue/5">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60"></div>
                  {/* Floating Action Button inside Image Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-75 group-hover:scale-100">
                     <div className="bg-white/95 backdrop-blur-sm p-5 rounded-full shadow-2xl text-brand-blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTools;
