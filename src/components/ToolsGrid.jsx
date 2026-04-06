import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const categories = [
  { 
    name: 'All Tools', 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    )
  },
  { 
    name: 'PDF Tools', 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    )
  },
  { 
    name: 'Image Tools', 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
    )
  },
  { 
    name: 'Calculator Tools', 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
      </svg>
    )
  },
  { 
    name: 'Write Tools', 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    )
  },
  { 
    name: 'Downloader', 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    )
  }
];

const tools = [
  { name: 'YouTube Downloader', path: '/youtube-video-downloader', category: 'Downloader', icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 6.186a2.6 2.6 0 0 0-1.824-1.84C18.146 3.9 12 3.9 12 3.9s-6.146 0-7.758.446a2.6 2.6 0 0 0-1.824 1.84C2 7.822 2 12 2 12s0 4.178.418 5.814a2.6 2.6 0 0 0 1.824 1.84C5.854 20.1 12 20.1 12 20.1s6.146 0 7.758-.446a2.6 2.6 0 0 0 1.824-1.84C22 16.178 22 12 22 12s0-4.178-.418-5.814zM9.99 15.116V8.884L15.39 12l-5.4 3.116z"/></svg>
  ), desc: 'Download videos and audio from YouTube in MP4 or MP3 format instantly and securely.', color: 'text-red-500', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
  { name: 'Content Improver', category: 'AI Write', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
  ), desc: 'Improve your content', color: 'text-[#ef497e]', bgColor: 'bg-[#ff9248]/15', iconColor: 'text-[#ff9248]' },
  
  { name: 'Essay Writer', category: 'AI Write', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
  ), desc: 'Easily create an essay with AI', color: 'text-[#ff9248]', bgColor: 'bg-[#eab308]/15', iconColor: 'text-[#eab308]' },
  
  { name: 'Paragraph Writer', category: 'AI Write', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
  ), desc: 'Paragraph Writer', color: 'text-[#ff9248]', bgColor: 'bg-[#eab308]/15', iconColor: 'text-[#eab308]' },

  { name: 'AI Image Generator', category: 'Image Tools', path: '/ai-image-generator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg>
  ), desc: 'Generate stunning AI-powered images in the iconic Ghibli style with our advanced engine.', color: 'text-[#3b82f6]', bgColor: 'bg-[#3b82f6]/10', iconColor: 'text-[#3b82f6]' },

  { name: 'AI to PNG', category: 'Image Tools', path: '/ai-to-png', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg>
  ), desc: 'Convert Adobe Illustrator files into high-density PNG assets with alpha transparency.', color: 'text-[#4F6EF7]', bgColor: 'bg-[#4F6EF7]/10', iconColor: 'text-[#4F6EF7]' },

  { name: 'AI to WEBP', category: 'Image Tools', path: '/ai-to-webp', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg>
  ), desc: 'Convert Adobe Illustrator files into highly optimized WEBP assets with alpha transparency.', color: 'text-[#4F6EF7]', bgColor: 'bg-[#4F6EF7]/10', iconColor: 'text-[#4F6EF7]' },

  { name: 'BMP to JPG', category: 'Image Tools', path: '/bmp-to-jpg', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ), desc: 'High-efficiency image synthesis. Convert massive bitmap files into optimized JPG assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'BMP to PNG', category: 'Image Tools', path: '/bmp-to-png', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ), desc: 'High-fidelity lossless synthesis. Convert massive bitmap files into optimized PNG gallery assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'BMP to PNM', category: 'Image Tools', path: '/bmp-to-pnm', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ), desc: 'High-fidelity format synthesis. Convert massive bitmap files into portable PNM assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'BMP to SVG', category: 'Image Tools', path: '/bmp-to-svg', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ), desc: 'High-fidelity vector synthesis. Convert bitmap images into scalable, resolution-independent SVG assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'BMP to WEBP', category: 'Image Tools', path: '/bmp-to-webp', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ), desc: 'High-efficiency modern synthesis. Convert bulky bitmap files into optimized, high-fidelity WEBP gallery assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'Color Picker', category: 'Image Tools', path: '/color-picker', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486z"/></svg>
  ), desc: 'Pixel-precise color extraction. Click anywhere on your image to instantly decode HEX, RGB, and HSL values.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'DJVU to JPG', category: 'Image Tools', path: '/djvu-to-jpg', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ), desc: 'High-fidelity document synthesis. Convert legacy DJVU files into optimized JPG gallery assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'DOC to JPG', category: 'Image Tools', path: '/doc-to-jpg', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ), desc: 'High-fidelity document synthesis. Convert Microsoft Word files into optimized JPG gallery assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'DOC to PNG', category: 'Image Tools', path: '/doc-to-png', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ), desc: 'High-fidelity lossless synthesis. Convert Word documents into optimized PNG gallery assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'DWF to WEBP', category: 'Image Tools', path: '/dwf-to-webp', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ), desc: 'High-fidelity CAD synthesis. Convert Autodesk DWF drawings into optimized WEBP assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'EPUB to JPG', category: 'Image Tools', path: '/epub-to-jpg', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
  ), desc: 'High-fidelity book synthesis. Convert EPUB documents into optimized JPG gallery assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'GIF to JPG', category: 'Image Tools', path: '/gif-to-jpg', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M21 15l-5-5L5 21"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
  ), desc: 'High-fidelity media synthesis. Convert GIF animations into optimized JPG gallery assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'HEIC to JPG', category: 'Image Tools', path: '/heic-to-jpg', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ), desc: 'High-fidelity photo synthesis. Convert Apple HEIC photos into optimized JPG gallery assets in seconds.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'Image Compressor', category: 'Image Tools', path: '/image-compressor', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
  ), desc: 'Precision size reduction. Compress JPG, PNG, and WEBP images with full quality control — entirely in your browser.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'Image Converter', category: 'Image Tools', path: '/image-converter', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10H7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10V4h6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 14v6h-6" />
    </svg>
  ), desc: 'Client-side JPG, PNG, and WEBP transcoding with zero server latency.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue', },

  { name: 'Image Cropper', category: 'Image Tools', path: '/image-cropper', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 16v2a2 2 0 01-2 2h-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 8V6a2 2 0 00-2-2h-2" />
      <rect x="7" y="7" width="10" height="10" rx="2" />
    </svg>
  ), desc: 'Crop and resize images with precise client-side selection.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'Image Resizer', category: 'Image Tools', path: '/image-resizer', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8V4h4M16 4h4v4M4 16v4h4M16 20h4v-4" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </svg>
  ), desc: 'Resize JPG, PNG, and WebP with aspect lock — 100% client-side canvas output.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'JPG to PNG', category: 'Image Tools', path: '/jpg-to-png', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ), desc: 'Convert JPG photos to lossless PNG with cloud synthesis and batch download.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'WEBP to SVG', category: 'Image Tools', path: '/webp-to-svg', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ), desc: 'Turn WEBP rasters into scalable SVG vectors with ConvertAPI and batch download.', color: 'text-brand-blue', bgColor: 'bg-brand-blue/10', iconColor: 'text-brand-blue' },

  { name: 'Remove Background', category: 'Image Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  ), desc: 'Easily Remove the Background from an image', color: 'text-[#00d2b4]', bgColor: 'bg-[#ef497e]/10', iconColor: 'text-[#ef497e]' },

  { name: 'PNG to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  ), desc: 'Convert PNG images smoothly to PDF documents', color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500', path: '/png-to-pdf' },

  { name: 'PDF to JPG', category: 'Pdf Tools', path: '/pdf-to-jpg', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><rect x="8" y="10" width="8" height="6" rx="1"/></svg>
  ), desc: 'Turn every PDF page into a high-quality JPG image with per-page download.', color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },

  { name: 'PDF to PNG', category: 'Pdf Tools', path: '/pdf-to-png', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><rect x="8" y="10" width="8" height="6" rx="1"/></svg>
  ), desc: 'Export each PDF page as a lossless PNG — ideal for graphics and transparency.', color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },

  { name: 'PDF to SVG', category: 'Pdf Tools', path: '/pdf-to-svg', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 15h8M8 11h8"/></svg>
  ), desc: 'Convert each PDF page into scalable SVG vectors for sharp output at any size.', color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },

  { name: 'Compress PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m9 15 3-3 3 3M9 9l3 3 3-3"/></svg>
  ), desc: 'Compress PDF size without losing quality', color: 'text-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', path: '/compress-pdf' },

  { name: 'Delete PDF Pages', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
  ), desc: 'Remove unnecessary pages from your PDF documents safely', color: 'text-red-500', bgColor: 'bg-red-50', iconColor: 'text-red-500', path: '/delete-pages' },

  { name: 'Merge PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v2a2 2 0 0 0 2 2h2"/></svg>
  ), desc: 'Merge 2 or more PDF files into a single PDF file', color: 'text-[#00d2b4]', bgColor: 'bg-[#eab308]/15', iconColor: 'text-[#eab308]', path: '/merge-pdf' },

  { name: 'Edit PDF', category: 'Pdf Tools', path: '/edit-pdf', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  ), desc: 'Free PDF Editor', color: 'text-[#ef497e]', bgColor: 'bg-[#ef497e]/10', iconColor: 'text-[#ef497e]' },

  { name: 'JPG to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  ), desc: 'Convert JPG images directly into a single PDF document', color: 'text-[#ff9248]', bgColor: 'bg-[#eab308]/15', iconColor: 'text-[#eab308]', path: '/jpg-to-pdf' },

  { name: 'MOBI to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
  ), desc: 'Convert MOBI ebooks to high-quality PDF documents', color: 'text-[#3b82f6]', bgColor: 'bg-[#3b82f6]/10', iconColor: 'text-[#3b82f6]', path: '/mobi-to-pdf' },

  { name: 'MSG to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6m-3 3l3-3 3 3"/></svg>
  ), desc: 'Convert Outlook MSG files to professional PDF documents', color: 'text-[#3b82f6]', bgColor: 'bg-blue-50', iconColor: 'text-[#3b82f6]', path: '/msg-to-pdf' },

  { name: 'Office to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ), desc: 'Convert Word, Excel, and PowerPoint files to PDF instantly', color: 'text-[#2b579a]', bgColor: 'bg-[#2b579a]/10', iconColor: 'text-[#2b579a]', path: '/office-to-pdf' },

  { name: 'PDF OCR', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg>
  ), desc: 'Convert scanned PDF documents into searchable PDF files', color: 'text-emerald-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', path: '/pdf-ocr' },

  { name: 'PDF to HTML', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13l-2 2 2 2m4 0l2-2-2-2"/></svg>
  ), desc: 'Convert PDF documents into interactive HTML webpages', color: 'text-purple-500', bgColor: 'bg-purple-50', iconColor: 'text-purple-500', path: '/pdf-to-html' },

  { name: 'PDF to Word', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 13l2 4 4-8"/></svg>
  ), desc: 'Convert PDF files to editable Word documents seamlessly', color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500', path: '/pdf-to-word' },

  { name: 'Word to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 13l2 4 4-8"/></svg>
  ), desc: 'Transform your Word documents into universally compatible PDF files', color: 'text-orange-500', bgColor: 'bg-orange-50', iconColor: 'text-orange-500', path: '/word-to-pdf' },


  { name: 'PDF to PPTX', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><rect x="8" y="10" width="8" height="6"/></svg>
  ), desc: 'Turn your PDF presentations into editable PowerPoint slides', color: 'text-orange-600', bgColor: 'bg-orange-100', iconColor: 'text-orange-600', path: '/pdf-to-pptx' },

  { name: 'PDF to TXT', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  ), desc: 'Extract all text content from your PDF documents instantly', color: 'text-slate-600', bgColor: 'bg-slate-100', iconColor: 'text-slate-600', path: '/pdf-to-txt' },

  { name: 'Protect PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
  ), desc: 'Encrypt your PDF documents with a strong password to prevent unauthorized access', color: 'text-emerald-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', path: '/protect-pdf' },

  { name: 'Unlock PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
  ), desc: 'Safely remove password protection from your PDF files to re-enable permanent viewing', color: 'text-emerald-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', path: '/unlock-pdf' },

  { name: 'Watermark PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a9.7 9.7 0 0 1-7.1-3 9.7 9.7 0 0 1-2.9-7.1A10 10 0 0 1 12 2a10 10 0 0 1 10 10 9.7 9.7 0 0 1-2.9 7.1A9.7 9.7 0 0 1 12 22z"/><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
  ), desc: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.', color: 'text-indigo-500', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', path: '/watermark-pdf' },

  { name: 'Web to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ), desc: 'Convert live URLs or raw HTML blocks into documented PDF vectors directly in your browser', color: 'text-indigo-500', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', path: '/web-to-pdf' },

  { name: 'Rotate PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M21 13a9 9 0 11-3-7.7L21 8"/></svg>
  ), desc: 'Fix orientation issues by permanently rotating your PDF pages', color: 'text-indigo-500', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', path: '/rotate-pdf' },

  { name: 'Split PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="2"/></svg>
  ), desc: 'Separate one page or a whole set into independent PDF files', color: 'text-indigo-500', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', path: '/split-pdf' },

  { name: 'TXT to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  ), desc: 'Convert raw text strings instantly into ISO-standard compiled PDFs', color: 'text-purple-600', bgColor: 'bg-purple-100', iconColor: 'text-purple-600', path: '/txt-to-pdf' },

  { name: 'WebP to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  ), desc: 'Convert modern WebP images into universally compatible PDF documents locally in your browser', color: 'text-cyan-600', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600', path: '/webp-to-pdf' },

  { name: 'TIFF to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  ), desc: 'Compile multi-layer TIFF raster files into standard PDF architecture', color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500', path: '/tiff-to-pdf' },

  { name: 'HTML to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  ), desc: 'Convert live URLs or HTML code into standard PDF documents', color: 'text-indigo-500', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', path: '/html-to-pdf' },

  { name: 'DJVU to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l3-3 3 3M12 12v6"/></svg>
  ), desc: 'Convert DJVU documents quickly to PDF format', color: 'text-orange-500', bgColor: 'bg-orange-50', iconColor: 'text-orange-500', path: '/djvu-to-pdf' },

  { name: 'EPS to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  ), desc: 'Convert EPS vector files into standard PDF architecture', color: 'text-emerald-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', path: '/eps-to-pdf' },

  { name: 'EPUB to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
  ), desc: 'Convert EPUB ebooks into universally compatible PDF files', color: 'text-pink-500', bgColor: 'bg-pink-50', iconColor: 'text-pink-500', path: '/epub-to-pdf' },

  { name: 'GIF to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M21 15l-5-5L5 21"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
  ), desc: 'Convert GIF animations and images into standard PDF documents', color: 'text-sky-500', bgColor: 'bg-sky-50', iconColor: 'text-sky-500', path: '/gif-to-pdf' },

  { name: 'HEIC to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  ), desc: 'Convert Apple HEIC photos into universally viewable PDF files', color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500', path: '/heic-to-pdf' },

  { name: 'ICO to PDF', category: 'Pdf Tools', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  ), desc: 'Convert ICON files into standard PDF documents', color: 'text-amber-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-500', path: '/ico-to-pdf' },

  { name: 'Age Calculator', category: 'Calculator Tools', path: '/age-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <path d="M7.5 12h.01"/>
        <path d="M12 12h.01"/>
        <path d="M16.5 12h.01"/>
      </svg>
  ), desc: 'Calculate age in years, months, and days for any date.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },

  { name: 'Aspect Ratio Calculator', category: 'Calculator Tools', path: '/aspect-ratio-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
        <path d="M7 9h4M13 15h4"/>
        <path d="M11 9l2 2-2 2"/>
      </svg>
  ), desc: 'Calculate proportional width and height while preserving aspect ratio.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'BMI Calculator', category: 'Calculator Tools', path: '/bmi-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18M8 7h8M8 11h8M8 15h5"/>
        <circle cx="12" cy="3" r="1.5" fill="currentColor"/>
      </svg>
  ), desc: 'Compute body mass index from weight and height in metric or imperial units.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'BMR Calculator', category: 'Calculator Tools', path: '/bmr-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19h14M7 15h10M9 11h6M11 7h2"/>
        <circle cx="12" cy="4" r="1.5" fill="currentColor"/>
      </svg>
  ), desc: 'Estimate basal metabolic rate from age, sex, weight, and height.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Breakeven Point Calculator', category: 'Calculator Tools', path: '/breakeven-point-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19h16"/>
        <path d="M7 16l3-6 3 3 4-8"/>
        <circle cx="7" cy="16" r="1.5" fill="currentColor"/>
      </svg>
  ), desc: 'Compute units and revenue needed to cover fixed + variable costs.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Calorie Calculator', category: 'Calculator Tools', path: '/calorie-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3s4 3.5 4 7a4 4 0 0 1-8 0c0-3.5 4-7 4-7z"/>
        <path d="M8 21h8"/>
      </svg>
  ), desc: 'Estimate daily calories for maintenance, fat loss, or muscle gain.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Concrete Calculator', category: 'Calculator Tools', path: '/concrete-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10h16v10H4z"/>
        <path d="M7 10V7a5 5 0 0110 0v3"/>
      </svg>
  ), desc: 'Estimate concrete volume in cubic yards, feet, meters, and 80 lb bag count.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Date Calculator', category: 'Calculator Tools', path: '/date-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
      </svg>
  ), desc: 'Find days between dates or add/subtract days from a base date.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Discount Calculator', category: 'Calculator Tools', path: '/discount-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L10 16"/>
        <path d="M7 7h.01"/>
        <path d="M17 17h.01"/>
        <path d="M8 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
      </svg>
  ), desc: 'Calculate final price using a fixed or percentage discount.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Due Date Calculator', category: 'Calculator Tools', path: '/due-date-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M12 13v5"/>
        <path d="M9 16h6"/>
      </svg>
  ), desc: 'Estimate pregnancy due date using LMP or ultrasound gestational age.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Flooring Calculator', category: 'Calculator Tools', path: '/flooring-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="1"/>
        <line x1="4" y1="12" x2="20" y2="12"/>
        <line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
  ), desc: 'Calculate room area, waste allowance, boxes, and rough material cost.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Freelance Rate Calculator', category: 'Calculator Tools', path: '/freelance-rate-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <path d="M7 15h10"/>
        <path d="M9 11h6"/>
      </svg>
  ), desc: 'Estimate sustainable hourly and day rates from income goals and billable time.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Fuel Cost Calculator', category: 'Calculator Tools', path: '/fuel-cost-calculator', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 16h12v4H4z"/>
        <path d="M6 12h8l2 4"/>
        <circle cx="8" cy="18" r="1.5" fill="currentColor"/>
        <circle cx="14" cy="18" r="1.5" fill="currentColor"/>
      </svg>
  ), desc: 'Estimate trip fuel volume and cost from distance, economy, and fuel price.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'GPA Calculator', category: 'Calculator Tools', path: '/gpa-calculator', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v6c0 1.5 3 3 6 3s6-1.5 6-3v-6" />
      <path d="M22 10v7" />
    </svg>
  ), desc: 'Calculate a credit-weighted GPA from course credits and grade points.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Hourly to Salary Calculator', category: 'Calculator Tools', path: '/hourly-to-salary-calculator', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ), desc: 'Convert hourly pay into estimated weekly, monthly, and annual salary.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Interest Calculator', category: 'Calculator Tools', path: '/interest-calculator', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="16" r="2.5" />
      <path d="M6.5 17.5 17.5 6.5" />
    </svg>
  ), desc: 'Estimate simple or compound interest from principal, rate, and time.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Length Converter', category: 'Calculator Tools', path: '/length-converter', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h18v10H3z" />
      <path d="M7 7v4M11 7v2M15 7v4M19 7v2" />
    </svg>
  ), desc: 'Convert between common metric and imperial length units instantly.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: "Ohm's Law Calculator", category: 'Calculator Tools', path: '/ohms-law-calculator', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12h3l1.5-4 3 8 1.5-4H18" />
      <path d="M4 19h16" />
    </svg>
  ), desc: 'Solve voltage, current, resistance, or power using Ohm and power laws.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Pace Calculator', category: 'Calculator Tools', path: '/pace-calculator', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12l4-2" />
      <path d="M12 4v2M20 12h-2M12 20v-2M4 12h2" />
    </svg>
  ), desc: 'Calculate pace and speed from distance and total elapsed time.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Paint Calculator', category: 'Calculator Tools', path: '/paint-calculator', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4a5 5 0 0 1 5 5c0 3-2 4.5-3 6a4 4 0 0 1-8 0c-1-1.5-3-3-3-6a5 5 0 0 1 5-5h4z" />
      <path d="M9 18h6" />
    </svg>
  ), desc: 'Estimate paint needed from room size, coats, and paint coverage.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Password Strength Checker', category: 'Calculator Tools', path: '/password-strength-checker', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
    </svg>
  ), desc: 'Evaluate password strength with common security checks.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Percentage Calculator', category: 'Calculator Tools', path: '/percentage-calculator', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M6 18L18 6" />
    </svg>
  ), desc: 'Solve common percent-of, ratio percent, and percent change calculations.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Profit Margin Calculator', category: 'Calculator Tools', path: '/profit-margin-calculator', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M8 7h8" />
      <path d="M7 12h10" />
      <path d="M9 17h6" />
    </svg>
  ), desc: 'Calculate profit and profit margin % from revenue and cost.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Sales Tax Calculator', category: 'Calculator Tools', path: '/sales-tax-calculator', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    </svg>
  ), desc: 'Add tax to a price, strip tax from a total, or find the effective tax rate between two amounts.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Recipe Scaler', category: 'Calculator Tools', path: '/recipe-scaler', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ), desc: 'Scale any recipe up or down. Proportionally adjust all ingredient amounts to any serving count.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Stitch Counter', category: 'Calculator Tools', path: '/stitch-counter', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ), desc: 'Count stitches, adjust for gauge differences, and estimate yarn needed for knitting & crochet projects.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Temperature Converter', category: 'Calculator Tools', path: '/temperature-converter', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
    </svg>
  ), desc: 'Convert between Celsius, Fahrenheit, Kelvin, Rankine and Réaumur with real-time results and reference table.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Time Card Calculator', category: 'Calculator Tools', path: '/time-card-calculator', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ), desc: 'Track weekly hours with clock-in/out entries, break deductions, overtime calculation, and pay estimation.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Tip Calculator', category: 'Calculator Tools', path: '/tip-calculator', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
    </svg>
  ), desc: 'Calculate tip amount, total bill, and per-person split with preset rates and rounding modes.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Weight Converter', category: 'Calculator Tools', path: '/weight-converter', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ), desc: 'Convert between 14 weight units across metric, imperial/US, and precious metal scales in real time.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
  { name: 'Word Counter', category: 'Calculator Tools', path: '/word-counter', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ), desc: 'Count words, characters, sentences, and paragraphs. Get reading time, speaking time, and top word frequency.', color: 'text-[#6366f1]', bgColor: 'bg-[#6366f1]/15', iconColor: 'text-[#6366f1]' },
];

/** Shared catalog for category landing pages (Image Tools, Calculator Tools). */
export const toolsCatalogData = tools;

const ToolsGrid = () => {
  const [activeCategory, setActiveCategory] = useState('All Tools');
  const { searchQuery } = useSearch();

  const isSearching = searchQuery.trim().length > 0;
  const q = searchQuery.trim().toLowerCase();

  const filteredTools = tools.filter((tool) => {
    if (isSearching) {
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      );
    }
    return activeCategory === 'All Tools' ||
      tool.category.toUpperCase().includes(activeCategory.split(' ')[0].toUpperCase());
  });

  return (
    <section id="tools-grid-section" className="py-24 px-4 md:px-6 bg-slate-50/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">Our Most Popular Tools</h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto text-lg opacity-80 decoration-none no-underline">
            We present the best of the best. All free, no catch.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8 text-xs font-black uppercase tracking-[0.2em]">
            <Link
              to="/pdf-tools"
              className="text-[#1ea5ed] hover:opacity-80 transition-opacity no-underline decoration-none"
            >
              All PDF tools
            </Link>
            <Link
              to="/image-tools"
              className="text-[#ff9248] hover:opacity-80 transition-opacity no-underline decoration-none"
            >
              All image tools
            </Link>
            <Link
              to="/calculator-tools"
              className="text-[#6366f1] hover:opacity-80 transition-opacity no-underline decoration-none"
            >
              All calculator tools
            </Link>
          </div>
        </div>

        {/* Category filter — hidden while searching */}
        {!isSearching && (
        <div className="flex justify-center mb-16 px-4 max-w-[100vw]">
            <div className="flex flex-nowrap overflow-x-auto items-center gap-2 p-2 bg-white rounded-[2rem] shadow-[0_15px_40px_-20px_rgba(59,130,246,0.2)] border border-slate-100 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.name;
                    return (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`flex shrink-0 whitespace-nowrap items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-black transition-all uppercase tracking-widest ${
                                isActive 
                                ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/30 scale-105' 
                                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-[#3b82f6]'
                            }`}
                        >
                            <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#3b82f6]'}>
                                {cat.icon}
                            </span>
                            {cat.name}
                        </button>
                    );
                })}
            </div>
        </div>
        )}

        {/* Search result info bar */}
        {isSearching && (
          <div className="flex items-center justify-between mb-8 px-2">
            <p className="text-slate-600 font-semibold">
              <span className="text-[#3b82f6] font-black">{filteredTools.length}</span> result{filteredTools.length !== 1 ? 's' : ''} for{' '}
              <span className="text-slate-800">&ldquo;{searchQuery}&rdquo;</span>
            </p>
          </div>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] transition-all group overflow-hidden"
              >
                <Link to={tool.path || '#'} className="flex flex-col gap-4 no-underline decoration-none">
                  <div className="flex flex-row items-center gap-4">
                    <div className={`shrink-0 w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center ${tool.iconColor} shadow-sm transition-transform duration-500`}>
                      {tool.icon}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-[17px] font-bold text-slate-800 leading-tight group-hover:text-[#3b82f6] transition-colors truncate">
                        {tool.name}
                      </h4>
                      <span className={`text-[12px] font-medium ${tool.color} mt-0.5`}>{tool.category}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-[14px] leading-relaxed font-medium line-clamp-2">{tool.desc}</p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <p className="text-slate-500 font-semibold text-lg">No tools found for &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-slate-400 text-sm mt-1">Try a different keyword like &ldquo;PDF&rdquo;, &ldquo;BMI&rdquo;, or &ldquo;Image&rdquo;</p>
          </div>
        )}

        <div className="mt-20 text-center">
            <Link
              to="/image-tools"
              className="inline-flex items-center px-12 py-5 bg-white text-[#ff9248] border-2 border-[#ff9248]/25 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#ff9248]/5 transition-all shadow-sm hover:shadow-md active:scale-95 group no-underline decoration-none"
            >
                View all image tools
                <svg className="inline-block ml-3 group-hover:translate-x-2 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default ToolsGrid;
