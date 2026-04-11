import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const YoutubeDownloader = () => {
  const [url, setUrl] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState(null);
  
  const [videoInfo, setVideoInfo] = useState(null);
  const [downloadLinks, setDownloadLinks] = useState([]);

  const startDownload = async () => {
    if (!url.trim() || (!url.includes('youtube.com') && !url.includes('youtu.be') && !url.includes('soundcloud.com'))) {
      setError('Please enter a valid YouTube or SoundCloud URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDownloadLinks([]);
    setVideoInfo(null);
    setProgressMsg('Fetching media information...');

    try {
      const encodedUrl = encodeURIComponent(url);
      const isSoundcloud = url.includes('soundcloud.com');
      const endpoint = isSoundcloud ? '/api/v1/soundcloud-media/info' : '/api/v1/youtube-media/info';
      
      const apiPath = `${endpoint}?url=${encodedUrl}`;
      
      const response = await fetch(`https://youtube-video-audio-downloader.p.rapidapi.com${apiPath}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'b9b276d0c1msh822603b0c726babp1e9c4djsn4fbc5f965e78',
          'x-rapidapi-host': 'youtube-video-audio-downloader.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      });
      
      const resData = await response.json();
      
      if (!response.ok || resData.status !== 'success' || !resData.data) {
        throw new Error(resData.message || 'Failed to fetch media information.');
      }

      setVideoInfo(resData.data);
      
      if (resData.data.links && resData.data.links.length > 0) {
          setDownloadLinks(resData.data.links);
          setIsLoading(false);
      } else {
         setError('No download links found for this media.');
         setIsLoading(false);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while communicating with the API.');
      setIsLoading(false);
    }
  };

  const reset = () => {
    setUrl('');
    setDownloadLinks([]);
    setVideoInfo(null);
    setError(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 mb-8 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-slate-400 font-medium">
          <Link to="/" className="hover:text-[#3b82f6] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/downloader-tools" className="hover:text-[#3b82f6] transition-colors">Downloader Tools</Link>
          <span>›</span>
          <span className="text-slate-600">YouTube &amp; SoundCloud Downloader</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 mb-6 group-hover:scale-110 transition-transform shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">Media Downloader</h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
            Download your favorite tracks and videos from YouTube or SoundCloud directly to your device.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
          {/* Main Input Area */}
          {!videoInfo && !isLoading && (
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Media URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                     <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') startDownload(); }}
                    placeholder="https://www.youtube.com/watch?v=... or https://soundcloud.com/..."
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#3b82f6] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-5 py-4 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100 mt-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button
                onClick={startDownload}
                className="w-full bg-[#1ea5ed] hover:bg-blue-600 text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 mt-4 active:scale-[0.98]"
              >
                Fetch Options
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="animate-spin -ml-1 mr-3 h-12 w-12 text-[#1ea5ed] mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">{progressMsg}</h3>
              <p className="text-slate-500 mt-2 font-medium">Please wait while we retrieve the download links.</p>
            </div>
          )}

          {/* Completed State */}
          <AnimatePresence>
            {videoInfo && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center mt-4"
              >
                <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center gap-4 text-center shadow-sm mb-8 relative overflow-hidden">
                  {videoInfo.thumbnail ? (
                      <img src={videoInfo.thumbnail} alt={videoInfo.title} className="w-full h-48 object-cover rounded-xl" />
                  ) : (
                      <div className="w-full h-48 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      </div>
                  )}
                  <div className="pt-2">
                    <h3 className="font-black text-slate-800 text-lg leading-snug px-4">{videoInfo.title}</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">{videoInfo.uploader} • {videoInfo.duration}</p>
                  </div>
                </div>

                {downloadLinks.length > 0 ? (
                  <div className="w-full">
                    <h4 className="text-slate-700 font-bold mb-4 text-left px-2">Available Downloads:</h4>
                    <div className="flex flex-col gap-3 w-full">
                      {downloadLinks.map((linkObj, index) => (
                        <a
                           key={index}
                           href={linkObj.download_url}
                           target="_blank"
                           rel="noreferrer"
                           className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl hover:border-[#3b82f6] hover:shadow-md transition-all active:scale-[0.99] no-underline decoration-none group"
                        >
                           <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${linkObj.type === 'audio' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                {linkObj.type === 'audio' ? (
                                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                                ) : (
                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                )}
                              </div>
                              <div className="text-left">
                                <span className="block font-bold text-slate-800 uppercase text-sm tracking-wider">{linkObj.type || 'Download'}</span>
                                <span className="block text-slate-500 text-xs font-medium">High Quality Extraction</span>
                              </div>
                           </div>
                           <div className="bg-slate-50 text-[#3b82f6] font-bold p-2 px-4 rounded-lg group-hover:bg-[#3b82f6] group-hover:text-white transition-colors text-sm">
                             Download
                           </div>
                        </a>
                      ))}
                    </div>

                    <button
                      onClick={reset}
                      className="w-full mt-8 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 font-bold py-4 px-6 rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98]"
                    >
                      Process Another Audio/Video
                    </button>
                  </div>
                ) : (
                  <div className="text-center w-full">
                    <p className="text-red-500 font-bold mb-4">{error || "Could not retrieve download links."}</p>
                    <button onClick={reset} className="bg-slate-100 text-slate-600 font-bold py-3 px-6 rounded-xl">Try Again</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default YoutubeDownloader;
