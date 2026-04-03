import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const pdfTools = [
  { name: 'Compress PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m9 15 3-3 3 3M9 9l3 3 3-3"/></svg>
  ), desc: 'Reduce the size of your PDF files without losing quality.', color: 'text-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', path: '/compress-pdf' },

  { name: 'Delete PDF Pages', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
  ), desc: 'Remove unwanted pages from your PDF documents.', color: 'text-red-500', bgColor: 'bg-red-50', iconColor: 'text-red-500', path: '/delete-pages' },

  { name: 'Merge PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v2a2 2 0 0 0 2 2h2"/></svg>
  ), desc: 'Combine multiple PDF files into one single document.', color: 'text-[#00d2b4]', bgColor: 'bg-[#eab308]/15', iconColor: 'text-[#eab308]', path: '/merge-pdf' },

  { name: 'Split PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg>
  ), desc: 'Divide one PDF into multiple smaller files or pages.', color: 'text-indigo-500', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', path: '/split-pdf' },

  { name: 'Edit PDF', category: 'Pdf Tools', path: '/edit-pdf', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  ), desc: 'Free online PDF editor to modify your documents.', color: 'text-[#ef497e]', bgColor: 'bg-[#ef497e]/10', iconColor: 'text-[#ef497e]' },

  { name: 'JPG to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  ), desc: 'Convert JPG images directly into a single PDF document.', color: 'text-[#ff9248]', bgColor: 'bg-[#eab308]/15', iconColor: 'text-[#eab308]', path: '/jpg-to-pdf' },

  { name: 'PNG to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  ), desc: 'Convert PNG images smoothly to PDF documents.', color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500', path: '/png-to-pdf' },

  { name: 'WebP to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  ), desc: 'Convert modern WebP images into universally compatible PDFs.', color: 'text-cyan-600', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600', path: '/webp-to-pdf' },

  { name: 'TIFF to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  ), desc: 'Compile multi-layer TIFF files into standard PDF architecture.', color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500', path: '/tiff-to-pdf' },

  { name: 'Word to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 13l2 4 4-8"/></svg>
  ), desc: 'Transform your Word documents into compatible PDF files.', color: 'text-orange-500', bgColor: 'bg-orange-50', iconColor: 'text-orange-500', path: '/word-to-pdf' },

  { name: 'PDF to Word', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 13l2 4 4-8"/></svg>
  ), desc: 'Convert PDF files to editable Word documents seamlessly.', color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500', path: '/pdf-to-word' },

  { name: 'Office to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ), desc: 'Convert Word, Excel, and PowerPoint files to PDF instantly.', color: 'text-[#2b579a]', bgColor: 'bg-[#2b579a]/10', iconColor: 'text-[#2b579a]', path: '/office-to-pdf' },

  { name: 'PDF OCR', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg>
  ), desc: 'Convert scanned PDF documents into searchable PDF files.', color: 'text-emerald-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', path: '/pdf-ocr' },

  { name: 'PDF to PPTX', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><rect x="8" y="10" width="8" height="6"/></svg>
  ), desc: 'Turn your PDF presentations into editable PowerPoint slides.', color: 'text-orange-600', bgColor: 'bg-orange-100', iconColor: 'text-orange-600', path: '/pdf-to-pptx' },

  { name: 'PDF to TXT', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  ), desc: 'Extract all text content from your PDF documents instantly.', color: 'text-slate-600', bgColor: 'bg-slate-100', iconColor: 'text-slate-600', path: '/pdf-to-txt' },

  { name: 'Protect PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
  ), desc: 'Encrypt your PDF documents with a strong password.', color: 'text-emerald-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', path: '/protect-pdf' },

  { name: 'Unlock PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
  ), desc: 'Safely remove password protection from your PDF files.', color: 'text-emerald-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', path: '/unlock-pdf' },

  { name: 'Watermark PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a9.7 9.7 0 0 1-7.1-3 9.7 9.7 0 0 1-2.9-7.1A10 10 0 0 1 12 2a10 10 0 0 1 10 10 9.7 9.7 0 0 1-2.9 7.1A9.7 9.7 0 0 1 12 22z"/><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
  ), desc: 'Stamp an image or text over your PDF in seconds.', color: 'text-indigo-500', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', path: '/watermark-pdf' },

  { name: 'Web to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ), desc: 'Convert live URLs or raw HTML into documented PDF vectors.', color: 'text-indigo-500', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', path: '/web-to-pdf' },

  { name: 'Rotate PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M21 13a9 9 0 11-3-7.7L21 8"/></svg>
  ), desc: 'Fix orientation issues by permanently rotating your pages.', color: 'text-indigo-500', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', path: '/rotate-pdf' },

  { name: 'TXT to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  ), desc: 'Convert raw text strings instantly into ISO-standard GIFs.', color: 'text-purple-600', bgColor: 'bg-purple-100', iconColor: 'text-purple-600', path: '/txt-to-pdf' },

  { name: 'HTML to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  ), desc: 'Convert live URLs or HTML code into standard PDF documents.', color: 'text-indigo-500', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', path: '/html-to-pdf' },

  { name: 'DJVU to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l3-3 3 3M12 12v6"/></svg>
  ), desc: 'Convert DJVU documents quickly to PDF format.', color: 'text-orange-500', bgColor: 'bg-orange-50', iconColor: 'text-orange-500', path: '/djvu-to-pdf' },

  { name: 'EPS to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  ), desc: 'Convert EPS vector files into standard PDF architecture.', color: 'text-emerald-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', path: '/eps-to-pdf' },

  { name: 'EPUB to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
  ), desc: 'Convert EPUB ebooks into universally compatible PDF files.', color: 'text-pink-500', bgColor: 'bg-pink-50', iconColor: 'text-pink-500', path: '/epub-to-pdf' },

  { name: 'GIF to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M21 15l-5-5L5 21"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
  ), desc: 'Convert GIF animations and images into PDF documents.', color: 'text-sky-500', bgColor: 'bg-sky-50', iconColor: 'text-sky-500', path: '/gif-to-pdf' },

  { name: 'HEIC to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  ), desc: 'Convert Apple HEIC photos into viewable PDF files.', color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500', path: '/heic-to-pdf' },

  { name: 'ICO to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  ), desc: 'Convert ICON files into standard PDF documents.', color: 'text-amber-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-500', path: '/ico-to-pdf' },

  { name: 'MSG to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6m-3 3l3-3 3 3"/></svg>
  ), desc: 'Convert Outlook MSG files to professional PDF documents.', color: 'text-[#3b82f6]', bgColor: 'bg-blue-50', iconColor: 'text-[#3b82f6]', path: '/msg-to-pdf' },

  { name: 'MOBI to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
  ), desc: 'Convert MOBI ebooks to high-quality PDF documents.', color: 'text-[#3b82f6]', bgColor: 'bg-[#3b82f6]/10', iconColor: 'text-[#3b82f6]', path: '/mobi-to-pdf' },

  { name: 'PDF to EPUB', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
  ), desc: 'Convert PDF file to EPUB ebook format.', color: 'text-[#ff9248]', bgColor: 'bg-[#ffeedb]', iconColor: 'text-[#ff9248]', path: '/pdf-to-epub' },

  { name: 'PDF to HTML', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13l-2 2 2 2m4 0l2-2-2-2"/></svg>
  ), desc: 'Convert PDF documents into interactive HTML webpages.', color: 'text-purple-500', bgColor: 'bg-purple-50', iconColor: 'text-purple-500', path: '/pdf-to-html' },

    { name: 'Crop PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>
  ), desc: 'Crop and adjust your PDF dimensions easily.', color: 'text-[#8b5cf6]', bgColor: 'bg-[#f3e8ff]', iconColor: 'text-[#8b5cf6]', path: '/crop-pdf' },

    { name: 'PDF to Excel', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M12 11h.01M16 11h.01M8 11h.01M12 15h.01M16 15h.01M8 15h.01M12 19h.01M16 19h.01M8 19h.01"/></svg>
  ), desc: 'Extract PDF data into editable Excel spreadsheets.', color: 'text-[#22c55e]', bgColor: 'bg-[#dcfce7]', iconColor: 'text-[#22c55e]', path: '/pdf-to-excel' },

    { name: 'PDF to Powerpoint', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><rect x="8" y="10" width="8" height="6"/></svg>
  ), desc: 'Transform your PDF into professional PPT presentations.', color: 'text-[#f59e0b]', bgColor: 'bg-[#fff7ed]', iconColor: 'text-[#f97316]', path: '/pdf-to-powerpoint' },
];

const ExplorePdfTools = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-white overflow-hidden relative border-t border-slate-50">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-1 bg-[#3b82f6] rounded-full"></div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-[#3b82f6]">Hand-Picked Suite</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
                    Explore <span className="text-[#3b82f6]">PDF Tools</span>
                </h2>
                <p className="text-slate-500 font-medium max-w-xl text-lg opacity-80 leading-relaxed">
                    Access our full suite of professional-grade PDF utilities. No sign-up required, 100% free for all your document needs.
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    const container = document.getElementById('pdf-horizontal-scroll');
                    container.scrollBy({ left: -400, behavior: 'smooth' });
                  }}
                  className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all bg-white shadow-sm hover:shadow-lg active:scale-95"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button 
                  onClick={() => {
                    const container = document.getElementById('pdf-horizontal-scroll');
                    container.scrollBy({ left: 400, behavior: 'smooth' });
                  }}
                  className="w-14 h-14 rounded-full bg-[#3b82f6] flex items-center justify-center text-white hover:bg-blue-600 transition-all transform active:scale-95 shadow-lg shadow-blue-500/20"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6 6-6" transform="rotate(180 12 12)"/></svg>
                </button>
            </div>
        </div>

        {/* Horizontal Smooth Scroll Container */}
        <div 
          id="pdf-horizontal-scroll"
          className="flex gap-6 overflow-x-auto pb-10 pt-4 px-2 no-scrollbar snap-x snap-mandatory"
        >
          {pdfTools.map((tool, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8 }}
              className="min-w-[300px] md:min-w-[350px] snap-start"
            >
                <Link to={tool.path} className="block group no-underline decoration-none h-full">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full border-b-4 border-b-transparent hover:border-b-[#3b82f6]">
                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-16 h-16 ${tool.bgColor} rounded-2xl flex items-center justify-center ${tool.iconColor} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                {tool.icon}
                            </div>
                            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
                                <svg className="text-slate-300 group-hover:text-[#3b82f6] transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-[#3b82f6] transition-colors tracking-tight leading-tight">
                            {tool.name}
                        </h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 flex-1">
                            {tool.desc}
                        </p>
                        
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] bg-blue-50 px-4 py-1.5 rounded-full">
                                {tool.category}
                            </span>
                        </div>
                    </div>
                </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
};

export default ExplorePdfTools;
