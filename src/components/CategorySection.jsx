import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ title, desc, count, feature, bgColor, icon, textColor = 'text-white', tools = [], explorePath }) => {
  return (
    <div className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 border border-slate-100/50">
      <div className={`p-8 ${bgColor} relative overflow-hidden transition-transform group-hover:scale-[1.02]`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start mb-6">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-inner">
                  {icon}
              </div>
              <span className={`text-[10px] font-black ${textColor} bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest border border-white/20`}>
                  {count}
              </span>
          </div>
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{title}</h3>
          <p className="text-white/80 text-sm font-medium leading-relaxed mb-4">{desc}</p>
          <Link to={explorePath} className={`${textColor} flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all no-underline decoration-none`}>
             Explore <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
      </div>

      <div className="p-5 bg-white border-t border-slate-50 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {tools.length > 0 ? "Quick Access" : "Featured:"}
              </span>
              {!tools.length && (
                  <button className="text-xs font-black text-brand-blue hover:text-brand-dark transition-colors border-b-2 border-brand-blue/20 hover:border-brand-blue">
                      {feature}
                  </button>
              )}
          </div>
          
          {tools.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar scroll-smooth">
                  {tools.map((tool, idx) => (
                      <Link 
                          key={idx} 
                          to={tool.path}
                          className="shrink-0 text-[11px] font-black text-brand-blue bg-brand-blue/5 hover:bg-brand-blue hover:text-white px-4 py-1.5 rounded-full transition-all border border-brand-blue/10 whitespace-nowrap decoration-none no-underline shadow-sm hover:shadow-md"
                      >
                          {tool.name}
                      </Link>
                  ))}
              </div>
          )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

const pdfToolsList = [
  { name: 'Compress PDF', path: '/compress-pdf' },
  { name: 'Merge PDF', path: '/merge-pdf' },
  { name: 'Split PDF', path: '/split-pdf' },
  { name: 'PDF to Word', path: '/pdf-to-word' },
  { name: 'Word to PDF', path: '/word-to-pdf' },
  { name: 'PDF OCR', path: '/pdf-ocr' },
  { name: 'Web to PDF', path: '/web-to-pdf' },
  { name: 'Protect PDF', path: '/protect-pdf' },
  { name: 'Unlock PDF', path: '/unlock-pdf' },
  { name: 'Watermark PDF', path: '/watermark-pdf' },
  { name: 'Rotate PDF', path: '/rotate-pdf' },
  { name: 'Delete Pages', path: '/delete-pages' },
  { name: 'PDF to PPTX', path: '/pdf-to-pptx' },
  { name: 'PDF to TXT', path: '/pdf-to-txt' },
  { name: 'PDF to HTML', path: '/pdf-to-html' },
  { name: 'HTML to PDF', path: '/html-to-pdf' },
  { name: 'PNG to PDF', path: '/png-to-pdf' },
  { name: 'WebP to PDF', path: '/webp-to-pdf' },
  { name: 'TIFF to PDF', path: '/tiff-to-pdf' },
  { name: 'JPG to PDF', path: '/jpg-to-pdf' },
  { name: 'PDF to JPG', path: '/pdf-to-jpg' },
  { name: 'PDF to PNG', path: '/pdf-to-png' },
  { name: 'PDF to SVG', path: '/pdf-to-svg' },
  { name: 'Office to PDF', path: '/office-to-pdf' },
  { name: 'MOBI to PDF', path: '/mobi-to-pdf' },
  { name: 'EPUB to PDF', path: '/epub-to-pdf' },
  { name: 'DJVU to PDF', path: '/djvu-to-pdf' },
  { name: 'EPS to PDF', path: '/eps-to-pdf' },
  { name: 'GIF to PDF', path: '/gif-to-pdf' },
  { name: 'MSG to PDF', path: '/msg-to-pdf' },
  { name: 'ICO to PDF', path: '/ico-to-pdf' },
  { name: 'TXT to PDF', path: '/txt-to-pdf' },
  { name: 'Crop PDF', path: '/crop-pdf' },
  { name: 'PDF to Excel', path: '/pdf-to-excel' },
  { name: 'To Powerpoint', path: '/pdf-to-powerpoint' },
];

const imageToolsList = [
  { name: 'AI Image Generator', path: '/ai-image-generator' },
  { name: 'AI to PNG', path: '/ai-to-png' },
  { name: 'AI to WEBP', path: '/ai-to-webp' },
  { name: 'BMP to JPG', path: '/bmp-to-jpg' },
  { name: 'BMP to PNG', path: '/bmp-to-png' },
  { name: 'BMP to PNM', path: '/bmp-to-pnm' },
  { name: 'BMP to SVG', path: '/bmp-to-svg' },
  { name: 'BMP to WEBP', path: '/bmp-to-webp' },
  { name: 'Color Picker', path: '/color-picker' },
  { name: 'DJVU to JPG', path: '/djvu-to-jpg' },
  { name: 'DOC to JPG', path: '/doc-to-jpg' },
  { name: 'DOC to PNG', path: '/doc-to-png' },
  { name: 'DWF to WEBP', path: '/dwf-to-webp' },
  { name: 'EPUB to JPG', path: '/epub-to-jpg' },
  { name: 'GIF to JPG', path: '/gif-to-jpg' },
  { name: 'HEIC to JPG', path: '/heic-to-jpg' },
  { name: 'Image Compressor', path: '/image-compressor' },
  { name: 'Image Converter', path: '/image-converter' },
  { name: 'Image Cropper', path: '/image-cropper' },
  { name: 'Image Resizer', path: '/image-resizer' },
  { name: 'JPG to PNG', path: '/jpg-to-png' },
  { name: 'WEBP to SVG', path: '/webp-to-svg' },
];

const calculatorToolsList = [
  { name: 'Age Calculator', path: '/age-calculator' },
  { name: 'Aspect Ratio Calculator', path: '/aspect-ratio-calculator' },
  { name: 'BMI Calculator', path: '/bmi-calculator' },
  { name: 'BMR Calculator', path: '/bmr-calculator' },
  { name: 'Breakeven Point Calculator', path: '/breakeven-point-calculator' },
  { name: 'Calorie Calculator', path: '/calorie-calculator' },
  { name: 'Concrete Calculator', path: '/concrete-calculator' },
  { name: 'Date Calculator', path: '/date-calculator' },
  { name: 'Discount Calculator', path: '/discount-calculator' },
  { name: 'Due Date Calculator', path: '/due-date-calculator' },
  { name: 'Flooring Calculator', path: '/flooring-calculator' },
  { name: 'Freelance Rate Calculator', path: '/freelance-rate-calculator' },
  { name: 'Fuel Cost Calculator', path: '/fuel-cost-calculator' },
  { name: 'GPA Calculator', path: '/gpa-calculator' },
  { name: 'Hourly to Salary Calculator', path: '/hourly-to-salary-calculator' },
  { name: 'Interest Calculator', path: '/interest-calculator' },
  { name: 'Length Converter', path: '/length-converter' },
  { name: "Ohm's Law Calculator", path: '/ohms-law-calculator' },
  { name: 'Pace Calculator', path: '/pace-calculator' },
  { name: 'Paint Calculator', path: '/paint-calculator' },
  { name: 'Password Strength Checker', path: '/password-strength-checker' },
  { name: 'Percentage Calculator', path: '/percentage-calculator' },
  { name: 'Profit Margin Calculator', path: '/profit-margin-calculator' },
  { name: 'Sales Tax Calculator', path: '/sales-tax-calculator' },
  { name: 'Recipe Scaler', path: '/recipe-scaler' },
  { name: 'Stitch Counter', path: '/stitch-counter' },
  { name: 'Temperature Converter', path: '/temperature-converter' },
  { name: 'Time Card Calculator', path: '/time-card-calculator' },
  { name: 'Tip Calculator', path: '/tip-calculator' },
  { name: 'Weight Converter', path: '/weight-converter' },
  { name: 'Word Counter', path: '/word-counter' },
];

const CategorySection = () => {
  const categories = [
    {
      title: 'PDF Tools',
      desc: 'Solve your PDF problems without the stress.',
      count: '45+ Tools',
      explorePath: '/pdf-tools',
      tools: pdfToolsList,
      bgColor: 'bg-[#1ea5ed]',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>
        </svg>
      )
    },
    {
      title: 'Image Tools',
      desc: 'Edit, resize and solve your image problems.',
      count: '32+ Tools',
      explorePath: '/image-tools',
      tools: imageToolsList,
      bgColor: 'bg-[#ff9248]',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
      )
    },
    {
      title: 'Calculator Tools',
      desc: 'Quickly solve all your calculation needs.',
      count: '24+ Tools',
      explorePath: '/calculator-tools',
      tools: calculatorToolsList,
      bgColor: 'bg-[#6366f1]',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 px-4 md:px-6 relative z-10 -mt-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <CategoryCard key={idx} {...cat} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
