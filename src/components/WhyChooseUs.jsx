import React from 'react';
import { Shield, Zap, Heart, CloudLightning, Lock, Users } from 'lucide-react';

const reasons = [
  { 
    title: 'Bank-Grade Security', 
    desc: 'Your files are processed securely and deleted from our servers automatically.', 
    icon: <Lock className="text-brand-blue" size={24} /> 
  },
  { 
    title: 'Lightning Fast', 
    desc: 'Our optimized infrastructure ensures your files are processed in seconds.', 
    icon: <Zap className="text-brand-orange" size={24} /> 
  },
  { 
    title: '100% Free', 
    desc: 'No hidden costs, no subscription required for our basic powerful tools.', 
    icon: <Heart className="text-brand-pink" size={24} /> 
  },
  { 
    title: 'Cloud Powered', 
    desc: 'Access your tools from anywhere, on any device, with no installation.', 
    icon: <CloudLightning className="text-brand-teal" size={24} /> 
  },
  { 
    title: 'Privacy First', 
    desc: 'We never sell your data. Your privacy is our top priority.', 
    icon: <Shield className="text-brand-purple" size={24} /> 
  },
  { 
    title: 'Community Driven', 
    desc: 'Join millions of users who trust Gugly Mugly for their daily tasks.', 
    icon: <Users className="text-brand-blue" size={24} /> 
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-slate-50/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">Why Choose Gugly Mugly?</h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">Trusted by millions of users worldwide for professional document and media processing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{reason.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
