import React from 'react';

const stats = [
  { value: '1m+', label: 'Active Users' },
  { value: '10m+', label: 'Files Converted' },
  { value: '200+', label: 'Online Tools' },
  { value: '500k', label: 'PDFs Created' },
];

const StatsSection = () => {
  return (
    <section className="pb-20 pt-10 px-4 md:px-6">
      <div className="container mx-auto px-4 py-8 bg-slate-50/50 rounded-3xl border border-slate-100/50 backdrop-blur-xl hover:shadow-xl hover:shadow-slate-200 transition-all">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-4 group">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-blue to-brand-dark group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </span>
                <div className="h-2 w-2 rounded-full bg-brand-blue mb-1 opacity-50"></div>
              </div>
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 group-hover:text-brand-blue transition-colors">
                {stat.label}
              </span>
              {idx < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-slate-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
