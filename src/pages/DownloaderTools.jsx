import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const downloaderTools = [
  { 
    name: 'YouTube Downloader', 
    path: '/youtube-video-downloader', 
    icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 6.186a2.6 2.6 0 0 0-1.824-1.84C18.146 3.9 12 3.9 12 3.9s-6.146 0-7.758.446a2.6 2.6 0 0 0-1.824 1.84C2 7.822 2 12 2 12s0 4.178.418 5.814a2.6 2.6 0 0 0 1.824 1.84C5.854 20.1 12 20.1 12 20.1s6.146 0 7.758-.446a2.6 2.6 0 0 0 1.824-1.84C22 16.178 22 12 22 12s0-4.178-.418-5.814zM9.99 15.116V8.884L15.39 12l-5.4 3.116z"/></svg>, 
    desc: 'Download videos and audio from YouTube in MP4 or MP3 format instantly and securely.', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50' 
  },
  { 
    name: 'TikTok Downloader', 
    path: '/tiktok-video-downloader', 
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-3v5.5a4 4 0 0 1-4 4z"/></svg>, 
    desc: 'Download TikTok videos without watermarks in high quality.', 
    color: 'text-slate-800', 
    bgColor: 'bg-slate-100' 
  },
  { 
    name: 'Instagram Downloader', 
    path: '/instagram-video-downloader', 
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, 
    desc: 'Download Instagram Reels, Photos, and IGTV videos.', 
    color: 'text-pink-600', 
    bgColor: 'bg-pink-50' 
  },
  { 
    name: 'Facebook Downloader', 
    path: '/facebook-video-downloader', 
    icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>, 
    desc: 'Download Facebook videos easily in High Definition or Standard Definition.', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  { 
    name: 'Twitter Downloader', 
    path: '#', 
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>, 
    desc: 'Save Twitter videos and GIFs to your device easily.', 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-50' 
  }
];

const DownloaderTools = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Downloader Tools — Gugly Mugly';
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-900 to-slate-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/30 mb-6">
            <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Downloader Tools
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">
            Download your favorite videos and audio from popular social media platforms effortlessly.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-12">
          <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-slate-600 font-medium">Downloader Tools</span>
        </nav>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloaderTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] transition-all group overflow-hidden"
            >
              <Link to={tool.path} className="flex flex-col gap-4 no-underline decoration-none">
                <div className="flex flex-row items-center gap-4">
                  <div className={`shrink-0 w-14 h-14 ${tool.bgColor} rounded-xl flex items-center justify-center ${tool.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-[17px] font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h4>
                    {tool.path === '#' && (
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Coming Soon</span>
                    )}
                  </div>
                </div>
                <p className="text-slate-500 text-[14px] leading-relaxed font-medium">
                  {tool.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloaderTools;
