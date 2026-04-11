import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const allPdfTools = [
  { 
    name: 'Compress PDF', 
    path: '/compress-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m9 15 3-3 3 3M9 9l3 3 3-3"/></svg>,
    desc: 'Reduce the file size of a PDF file',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    featured: true
  },
  { 
    name: 'Merge PDF', 
    path: '/merge-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7M6 9v2a2 2 0 0 0 2 2h2"/></svg>,
    desc: 'Merge 2 or more PDF files into a single PDF file',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
    featured: true
  },
  { 
    name: 'Split PDF', 
    path: '/split-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg>,
    desc: 'Split into one or multiple PDF files',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  { 
    name: 'PDF to Word', 
    path: '/pdf-to-word', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 13l2 4 4-8"/></svg>,
    desc: 'Convert a PDF to Word document',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500',
    featured: true
  },
  { 
    name: 'Word to PDF', 
    path: '/word-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 13l2 4 4-8"/></svg>,
    desc: 'Convert a Word document into PDF',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    featured: true
  },
  { 
    name: 'PDF to PPTX', 
    path: '/pdf-to-pptx', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><rect x="8" y="10" width="8" height="6"/></svg>,
    desc: 'Upload a PDF and download as a PowerPoint Presentation',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500'
  },
  { 
    name: 'PDF to TXT', 
    path: '/pdf-to-txt', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    desc: 'Convert PDF file to TXT file',
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-500'
  },
  { 
    name: 'PDF to HTML', 
    path: '/pdf-to-html', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13l-2 2 2 2m4 0l2-2-2-2"/></svg>,
    desc: 'Convert PDF documents into interactive HTML webpages',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500'
  },
  { 
    name: 'HTML to PDF', 
    path: '/html-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>,
    desc: 'Convert HTML code or URLs to PDF format',
    bgColor: 'bg-blue-600',
    iconColor: 'text-white'
  },
  { 
    name: 'JPG to PDF', 
    path: '/jpg-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
    desc: 'Upload images and receive as a PDF',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500'
  },
  {
    name: 'PDF to JPG',
    path: '/pdf-to-jpg',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><rect x="8" y="10" width="8" height="6" rx="1"/></svg>,
    desc: 'Convert each page of a PDF into high-quality JPG images',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-500'
  },
  {
    name: 'PDF to PNG',
    path: '/pdf-to-png',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><rect x="8" y="10" width="8" height="6" rx="1"/></svg>,
    desc: 'Convert each page of a PDF into lossless PNG images',
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-500'
  },
  {
    name: 'PDF to SVG',
    path: '/pdf-to-svg',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 15h8M8 11h8"/></svg>,
    desc: 'Convert each page of a PDF into scalable SVG vector files',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500'
  },
  { 
    name: 'PNG to PDF', 
    path: '/png-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    desc: 'Upload images and receive as a PDF',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500'
  },
  { 
    name: 'WebP to PDF', 
    path: '/webp-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    desc: 'Convert WebP images to PDF',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-500'
  },
  { 
    name: 'TIFF to PDF', 
    path: '/tiff-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    desc: 'Convert TIFF images to PDF',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500'
  },
  { 
    name: 'Office to PDF', 
    path: '/office-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    desc: 'Convert Word, Excel, and PowerPoint files to PDF instantly',
    bgColor: 'bg-blue-900/10',
    iconColor: 'text-blue-900'
  },
  { 
    name: 'PDF OCR', 
    path: '/pdf-ocr', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg>,
    desc: 'Convert scanned PDF documents into searchable PDF files',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500'
  },
  { 
    name: 'Protect PDF', 
    path: '/protect-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    desc: 'Add a password and encrypt your PDF file',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500'
  },
  { 
    name: 'Unlock PDF', 
    path: '/unlock-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    desc: 'Remove the password from a PDF (requires password)',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500'
  },
  { 
    name: 'Watermark PDF', 
    path: '/watermark-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a9.7 9.7 0 0 1-7.1-3 9.7 9.7 0 0 1-2.9-7.1A10 10 0 0 1 12 2a10 10 0 0 1 10 10 9.7 9.7 0 0 1-2.9 7.1A9.7 9.7 0 0 1 12 22z"/><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>,
    desc: 'Add text or image watermark to your PDF',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  { 
    name: 'Rotate PDF', 
    path: '/rotate-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M21 13a9 9 0 11-3-7.7L21 8"/></svg>,
    desc: 'Rotate your PDF pages and save them',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  { 
    name: 'Delete Pages', 
    path: '/delete-pages', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
    desc: 'Delete specific pages from your PDF file',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500'
  },
  { 
    name: 'Web to PDF', 
    path: '/web-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    desc: 'Convert any webpage into a PDF document',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  { 
    name: 'MOBI to PDF', 
    path: '/mobi-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
    desc: 'Convert MOBI ebooks to high-quality PDF documents',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500'
  },
  { 
    name: 'EPUB to PDF', 
    path: '/epub-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
    desc: 'Convert EPUB documents to PDF format',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500'
  },
  { 
    name: 'DJVU to PDF', 
    path: '/djvu-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l3-3 3 3M12 12v6"/></svg>,
    desc: 'Convert DJVU documents to PDF format',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500'
  },
  { 
    name: 'EPS to PDF', 
    path: '/eps-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    desc: 'Convert EPS files to PDF format',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500'
  },
  { 
    name: 'GIF to PDF', 
    path: '/gif-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M21 15l-5-5L5 21"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>,
    desc: 'Convert GIF images to PDF documents',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500'
  },
  { 
    name: 'HEIC to PDF', 
    path: '/heic-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    desc: 'Convert HEIC (iPhone) photos to PDF format',
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-500'
  },
  { 
    name: 'ICO to PDF', 
    path: '/ico-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    desc: 'Convert ICO icons to PDF documents',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-500'
  },
  { 
    name: 'MSG to PDF', 
    path: '/msg-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6m-3 3l3-3 3 3"/></svg>,
    desc: 'Convert Outlook MSG files to PDF format',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  { 
    name: 'TXT to PDF', 
    path: '/txt-to-pdf', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    desc: 'Convert plain text files into PDF documents',
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-500'
  },
];

const PdfTools = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = allPdfTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredTools = allPdfTools.filter(tool => tool.featured);

  return (
    <div className="bg-slate-50/10 min-h-screen relative overflow-hidden">
      
      {/* Search/Explore Section */}
      <div className="container mx-auto px-4 md:px-6 pt-20 pb-12 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-3 tracking-tight">Explore PDF Tools</h1>
        <p className="text-slate-500 font-medium text-[15px] mb-12">All your PDF needs in one place, synchronized and powerful.</p>
        
        <div className="max-w-xl mx-auto mb-12 relative">
          <div className="relative flex items-center p-1.5 bg-white border border-slate-200 rounded-full shadow-[0_15px_30px_-15px_rgba(0,0,0,0.1)] transition-all overflow-hidden focus-within:border-[#3b82f6] focus-within:ring-4 focus-within:ring-blue-100">
            <div className="pl-6 pr-3">
              <svg className="text-[#3b82f6]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search PDF Tools..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-3 text-slate-600 font-medium border-none focus:ring-0 outline-none placeholder:text-slate-400 text-[15px]"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-24 relative z-10">
        
        {/* Featured Section */}
        {!searchQuery && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-[#3b82f6] rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Featured Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTools.map((tool, idx) => (
                <Link
                  key={idx}
                  to={tool.path}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 group"
                >
                  <div className={`w-14 h-14 ${tool.bgColor} rounded-2xl flex items-center justify-center ${tool.iconColor} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <div className="w-7 h-7">{tool.icon}</div>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-[#3b82f6] transition-colors">{tool.name}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All PDF Tools Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-[#3b82f6] rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {searchQuery ? `Search Results (${filteredTools.length})` : "All PDF Tools"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {filteredTools.map((tool, idx) => (
              <Link
                key={idx}
                to={tool.path}
                className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col gap-3 min-h-[140px]"
              >
                <div className="flex flex-row items-center gap-4">
                  <div className={`shrink-0 w-11 h-11 ${tool.bgColor} rounded-xl flex items-center justify-center ${tool.iconColor} shadow-sm group-hover:scale-105 transition-transform`}>
                    <div className="w-5 h-5">{tool.icon}</div>
                  </div>
                  <div className="flex flex-col pr-2">
                    <h4 className="text-[15px] font-bold text-slate-800 leading-tight group-hover:text-[#3b82f6] transition-colors line-clamp-1">
                      {tool.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5 tracking-wide">PDF Tools</span>
                  </div>
                </div>
                <p className="text-[#8492a6] text-[13px] leading-relaxed font-medium line-clamp-2 pr-2">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PdfTools;
