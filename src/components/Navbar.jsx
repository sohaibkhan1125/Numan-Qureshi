import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const pdfTools = [
    { name: 'Compress PDF', path: '/compress-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m9 15 3-3 3 3M9 9l3 3 3-3"/></svg> },
    { name: 'Merge PDF', path: '/merge-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7M6 9v2a2 2 0 0 0 2 2h2"/></svg> },
    { name: 'Split PDF', path: '/split-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg> },
    { name: 'PDF to Word', path: '/pdf-to-word', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 13l2 4 4-8"/></svg> },
    { name: 'Word to PDF', path: '/word-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 13l2 4 4-8"/></svg> },
    { name: 'PDF to PPTX', path: '/pdf-to-pptx', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><rect x="8" y="10" width="8" height="6"/></svg> },
    { name: 'PDF to TXT', path: '/pdf-to-txt', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
    { name: 'PDF to HTML', path: '/pdf-to-html', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13l-2 2 2 2m4 0l2-2-2-2"/></svg> },
    { name: 'HTML to PDF', path: '/html-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> },
    { name: 'JPG to PDF', path: '/jpg-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg> },
    { name: 'PDF to JPG', path: '/pdf-to-jpg', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><rect x="8" y="10" width="8" height="6" rx="1"/></svg> },
    { name: 'PDF to PNG', path: '/pdf-to-png', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><rect x="8" y="10" width="8" height="6" rx="1"/></svg> },
    { name: 'PDF to SVG', path: '/pdf-to-svg', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 15h8M8 11h8"/></svg> },
    { name: 'PNG to PDF', path: '/png-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
    { name: 'WebP to PDF', path: '/webp-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
    { name: 'TIFF to PDF', path: '/tiff-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
    { name: 'Office to PDF', path: '/office-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { name: 'PDF OCR', path: '/pdf-ocr', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg> },
    { name: 'Protect PDF', path: '/protect-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
    { name: 'Unlock PDF', path: '/unlock-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
    { name: 'Watermark PDF', path: '/watermark-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22a9.7 9.7 0 0 1-7.1-3 9.7 9.7 0 0 1-2.9-7.1A10 10 0 0 1 12 2a10 10 0 0 1 10 10 9.7 9.7 0 0 1-2.9 7.1A9.7 9.7 0 0 1 12 22z"/><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> },
    { name: 'Rotate PDF', path: '/rotate-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 2v6h-6"/><path d="M21 13a9 9 0 11-3-7.7L21 8"/></svg> },
    { name: 'Delete Pages', path: '/delete-pages', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg> },
    { name: 'Web to PDF', path: '/web-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
    { name: 'MOBI to PDF', path: '/mobi-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> },
    { name: 'EPUB to PDF', path: '/epub-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> },
    { name: 'DJVU to PDF', path: '/djvu-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l3-3 3 3M12 12v6"/></svg> },
    { name: 'EPS to PDF', path: '/eps-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> },
    { name: 'GIF to PDF', path: '/gif-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M21 15l-5-5L5 21"/><circle cx="8.5" cy="8.5" r="1.5"/></svg> },
    { name: 'HEIC to PDF', path: '/heic-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> },
    { name: 'ICO to PDF', path: '/ico-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> },
    { name: 'MSG to PDF', path: '/msg-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6m-3 3l3-3 3 3"/></svg> },
    { name: 'TXT to PDF', path: '/txt-to-pdf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  ];

  const imageTools = [
    { name: 'AI Image Generator', path: '/ai-image-generator', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> },
    { name: 'AI to PNG', path: '/ai-to-png', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V7h2v10z"/></svg> },
    { name: 'AI to WEBP', path: '/ai-to-webp', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V7h2v10z"/></svg> },
    { name: 'BMP to JPG', path: '/bmp-to-jpg', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { name: 'BMP to PNG', path: '/bmp-to-png', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { name: 'BMP to PNM', path: '/bmp-to-pnm', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { name: 'BMP to SVG', path: '/bmp-to-svg', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { name: 'BMP to WEBP', path: '/bmp-to-webp', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { name: 'Color Picker', path: '/color-picker', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486z"/></svg> },
    { name: 'DJVU to JPG', path: '/djvu-to-jpg', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { name: 'DOC to JPG', path: '/doc-to-jpg', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { name: 'DOC to PNG', path: '/doc-to-png', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { name: 'DWF to WEBP', path: '/dwf-to-webp', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { name: 'EPUB to JPG', path: '/epub-to-jpg', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
    { name: 'GIF to JPG', path: '/gif-to-jpg', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M21 15l-5-5L5 21"/><circle cx="8.5" cy="8.5" r="1.5"/></svg> },
    { name: 'HEIC to JPG', path: '/heic-to-jpg', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { name: 'Image Compressor', path: '/image-compressor', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg> },
    { name: 'Image Converter', path: '/image-converter', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10H7z"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 10V4h6"/><path strokeLinecap="round" strokeLinejoin="round" d="M20 14v6h-6"/></svg> },
    { name: 'Image Cropper', path: '/image-cropper', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2"/><path strokeLinecap="round" strokeLinejoin="round" d="M20 16v2a2 2 0 01-2 2h-2"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h2"/><path strokeLinecap="round" strokeLinejoin="round" d="M20 8V6a2 2 0 00-2-2h-2"/><rect x="7" y="7" width="10" height="10" rx="2"/></svg> },
    { name: 'Image Resizer', path: '/image-resizer', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4M16 4h4v4M4 16v4h4M16 20h4v-4"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg> },
    { name: 'JPG to PNG', path: '/jpg-to-png', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { name: 'WEBP to SVG', path: '/webp-to-svg', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4l2 2h8a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg> },
  ];

  const calculatorTools = [
    {
      name: 'Age Calculator',
      path: '/age-calculator',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <path d="M7.5 12h.01" />
          <path d="M12 12h.01" />
          <path d="M16.5 12h.01" />
        </svg>
      ),
    },
    {
      name: 'Aspect Ratio Calculator',
      path: '/aspect-ratio-calculator',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
          <path d="M7 9h4M13 15h4" />
          <path d="M11 9l2 2-2 2" />
        </svg>
      ),
    },
    {
      name: 'BMI Calculator',
      path: '/bmi-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M12 3v18M8 7h8M8 11h8M8 15h5" strokeLinecap="round" />
          <circle cx="12" cy="3" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'BMR Calculator',
      path: '/bmr-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M5 19h14M7 15h10M9 11h6M11 7h2" strokeLinecap="round" />
          <circle cx="12" cy="4" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'Breakeven Point Calculator',
      path: '/breakeven-point-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M4 19h16" />
          <path d="M7 16l3-6 3 3 4-8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="16" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'Calorie Calculator',
      path: '/calorie-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M12 3s4 3.5 4 7a4 4 0 0 1-8 0c0-3.5 4-7 4-7z" />
          <path d="M8 21h8" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Concrete Calculator',
      path: '/concrete-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M4 10h16v10H4z" />
          <path d="M7 10V7a5 5 0 0110 0v3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Date Calculator',
      path: '/date-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="16" y1="2" x2="16" y2="6" />
        </svg>
      ),
    },
    {
      name: 'Discount Calculator',
      path: '/discount-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M20 6L10 16" strokeLinecap="round" />
          <path d="M7 7h.01" />
          <path d="M17 17h.01" />
          <path d="M8 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        </svg>
      ),
    },
    {
      name: 'Due Date Calculator',
      path: '/due-date-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M12 13v5" strokeLinecap="round" />
          <path d="M9 16h6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Flooring Calculator',
      path: '/flooring-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      ),
    },
    {
      name: 'Freelance Rate Calculator',
      path: '/freelance-rate-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 15h10" />
          <path d="M9 11h6" />
        </svg>
      ),
    },
    {
      name: 'Fuel Cost Calculator',
      path: '/fuel-cost-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M4 16h12v4H4z" />
          <path d="M6 12h8l2 4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="18" r="1.5" fill="currentColor" />
          <circle cx="14" cy="18" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'GPA Calculator',
      path: '/gpa-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12v6c0 1.5 3 3 6 3s6-1.5 6-3v-6" />
          <path d="M22 10v7" />
        </svg>
      ),
    },
    {
      name: 'Hourly to Salary Calculator',
      path: '/hourly-to-salary-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: 'Interest Calculator',
      path: '/interest-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <circle cx="8" cy="8" r="2.5" />
          <circle cx="16" cy="16" r="2.5" />
          <path d="M6.5 17.5 17.5 6.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Length Converter',
      path: '/length-converter',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M3 7h18v10H3z" />
          <path d="M7 7v4M11 7v2M15 7v4M19 7v2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: "Ohm's Law Calculator",
      path: '/ohms-law-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M6 12h3l1.5-4 3 8 1.5-4H18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 19h16" />
        </svg>
      ),
    },
    {
      name: 'Pace Calculator',
      path: '/pace-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 12l4-2" strokeLinecap="round" />
          <path d="M12 4v2M20 12h-2M12 20v-2M4 12h2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Paint Calculator',
      path: '/paint-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M14 4a5 5 0 0 1 5 5c0 3-2 4.5-3 6a4 4 0 0 1-8 0c-1-1.5-3-3-3-6a5 5 0 0 1 5-5h4z" />
          <path d="M9 18h6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Password Strength Checker',
      path: '/password-strength-checker',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <rect x="4" y="11" width="16" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'Percentage Calculator',
      path: '/percentage-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <circle cx="7" cy="7" r="2" />
          <circle cx="17" cy="17" r="2" />
          <path d="M6 18L18 6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Profit Margin Calculator',
      path: '/profit-margin-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M3 7h18" />
          <path d="M5 7l4-4 4 4 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 12h10" strokeLinecap="round" />
          <path d="M9 17h6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Sales Tax Calculator',
      path: '/sales-tax-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Recipe Scaler',
      path: '/recipe-scaler',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      name: 'Stitch Counter',
      path: '/stitch-counter',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      name: 'Temperature Converter',
      path: '/temperature-converter',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
        </svg>
      ),
    },
    {
      name: 'Time Card Calculator',
      path: '/time-card-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Tip Calculator',
      path: '/tip-calculator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
        </svg>
      ),
    },
    {
      name: 'Weight Converter',
      path: '/weight-converter',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ),
    },
    {
      name: 'Word Counter',
      path: '/word-counter',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
  ];

  const navItems = [
    { label: 'PDF', dropdown: pdfTools },
    { label: 'Image Tools', dropdown: imageTools },
    { label: 'Calculator', dropdown: calculatorTools },
    { label: 'Video', dropdown: [] },
    { label: 'File', dropdown: [] },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
      {/* Main Navbar */}
      <nav className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo Area */}
        <Link
          to="/"
          className="flex items-center cursor-pointer group decoration-none no-underline shrink-0 mr-2"
        >
          <img
            src={`${process.env.PUBLIC_URL || ''}/gugly-mugly-logo.png`}
            alt="Gugly Mugly — Boost Productivity with Free Online Tools & Tech"
            className="h-9 sm:h-10 w-auto max-w-[min(100vw-10rem,220px)] sm:max-w-[260px] object-contain object-left group-hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden xl:flex items-center gap-10">
          {navItems.map((item) => (
            <div 
              key={item.label}
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
              className="relative py-2"
            >
              <button className={`flex items-center gap-1.5 font-bold text-sm transition-all focus:outline-none group ${openDropdown === item.label ? 'text-[#3b82f6]' : 'text-slate-600 hover:text-[#3b82f6]'}`}>
                {item.label}
                <svg className={`transition-transform text-slate-400 group-hover:text-[#3b82f6] ${openDropdown === item.label ? 'rotate-180 text-[#3b82f6]' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {item.dropdown.length > 0 && openDropdown === item.label && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-[60vh] overflow-y-auto px-1 custom-scrollbar-minimal">
                    <div className="grid grid-cols-1 gap-1">
                      {item.dropdown.map((tool) => (
                        <Link 
                          key={tool.name} 
                          to={tool.path}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group/item no-underline decoration-none"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-[#3b82f6] group-hover/item:bg-white transition-all shadow-sm">
                            {tool.icon}
                          </div>
                          <span className="text-xs font-bold text-slate-600 group-hover/item:text-slate-900 leading-tight">{tool.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Utilities & Search */}
        <div className="flex items-center gap-3 lg:gap-5">
            {/* Theme & Share Icons */}
            <div className="hidden sm:flex items-center gap-3">
                <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 rounded-full transition-all border border-transparent hover:border-slate-100 shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </button>
                <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 rounded-full transition-all border border-transparent hover:border-slate-100 shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                </button>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block h-8 w-px bg-slate-200 mx-1"></div>

            {/* Search Bar */}
            <div className="hidden md:flex relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="text-slate-300 group-focus-within:text-[#3b82f6] transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="pl-12 pr-6 py-2.5 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 w-40 lg:w-56 transition-all focus:w-64 outline-none placeholder:text-slate-400"
                />
            </div>

            {/* Sign In Button */}
            <button className="bg-[#3b82f6] text-white px-7 py-2.5 rounded-xl font-black text-sm hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-500/25 active:scale-95 whitespace-nowrap">
                Sign In
            </button>

            {/* Mobile Menu Icon */}
            <button 
                className="xl:hidden p-2 text-slate-500 hover:text-[#3b82f6] focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? 
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> 
                    : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                }
            </button>
        </div>
      </nav>

      {/* Secondary "Recent Tools" Bar */}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t p-6 flex flex-col gap-5 animate-in slide-in-from-top-4 duration-500 border-b shadow-xl max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
                <div key={item.label}>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group active:scale-95 transition-all">
                        <span className="text-sm font-black text-slate-800 uppercase tracking-widest">{item.label}</span>
                        <svg className="text-[#3b82f6]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                    {item.dropdown.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 p-3 mt-1">
                            {item.dropdown.map((tool) => (
                                <Link 
                                    key={tool.name} 
                                    to={tool.path}
                                    className="flex items-center gap-3 p-3 text-xs font-bold text-slate-600 hover:text-[#3b82f6] decoration-none no-underline"
                                >
                                    {tool.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {/* Search for Mobile */}
            <div className="relative mt-2">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="text-slate-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-12 pr-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none"
                />
            </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
