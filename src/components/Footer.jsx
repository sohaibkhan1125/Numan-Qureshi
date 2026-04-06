import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer bg-white border-t border-slate-100 pt-16 pb-6">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-8 mb-12">
          
          {/* Logo and About (Spans 2 columns) */}
          <div className="lg:col-span-2 pr-8">
            <Link to="/" className="inline-block mb-6 cursor-pointer decoration-none no-underline">
              <img
                src={`${process.env.PUBLIC_URL || ''}/gugly-mugly-logo.png`}
                alt="Gugly Mugly — Boost Productivity with Free Online Tools & Tech"
                className="h-auto w-full max-w-[280px] object-contain object-left"
              />
            </Link>
            <p className="text-[#8492a6] text-[15px] leading-relaxed">
              Gugly Mugly provides free online conversion, PDF, and other handy tools to help you solve problems of all types. All files both processed and unprocessed are deleted after 1 hour
            </p>
          </div>

          {/* Navigate */}
          <div className="lg:col-span-1">
            <h4 className="text-slate-700 font-bold mb-6 text-lg tracking-tight">Navigate</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-[#8492a6] hover:text-[#3b82f6] transition-colors text-[15px] font-medium">Home</Link></li>
              <li><Link to="/privacy-policy" className="text-[#8492a6] hover:text-[#3b82f6] transition-colors text-[15px] font-medium">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-[#8492a6] hover:text-[#3b82f6] transition-colors text-[15px] font-medium">Terms &amp; Conditions</Link></li>
              <li><Link to="/disclaimer" className="text-[#8492a6] hover:text-[#3b82f6] transition-colors text-[15px] font-medium">Disclaimer</Link></li>
              <li><Link to="/contact" className="text-[#8492a6] hover:text-[#3b82f6] transition-colors text-[15px] font-medium">Contact</Link></li>
              <li><Link to="/blog" className="text-[#8492a6] hover:text-[#3b82f6] transition-colors text-[15px] font-medium">Blog</Link></li>
              <li><button className="text-[#8492a6] hover:text-[#3b82f6] transition-colors text-[15px] font-medium text-left">About</button></li>
            </ul>
          </div>

          {/* Tools Category 1 */}
          <div className="lg:col-span-1">
            <h4 className="text-slate-700 font-bold mb-6 text-lg tracking-tight">Tools</h4>
            <ul className="space-y-4">
              {['AI Image Generator', 'Image Compressor', 'Image Converter', 'Color Picker'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(/\\s+/g, '-')}`} className="text-[#8492a6] hover:text-[#3b82f6] transition-colors text-[15px] font-medium text-left block">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Category 2 */}
          <div className="lg:col-span-1 pt-0 lg:pt-14">
             <ul className="space-y-4">
              {['Merge PDF', 'Split PDF', 'PDF to JPG', 'PDF to PNG'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(/\\s+/g, '-')}`} className="text-[#8492a6] hover:text-[#3b82f6] transition-colors text-[15px] font-medium text-left block">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Category 3 */}
          <div className="lg:col-span-1 pt-0 lg:pt-14">
             <ul className="space-y-4">
              {['JPG to PDF', 'Compress PDF', 'Word to PDF', 'Watermark PDF'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(/\\s+/g, '-')}`} className="text-[#8492a6] hover:text-[#3b82f6] transition-colors text-[15px] font-medium text-left block">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Category 4 */}
          <div className="lg:col-span-1 pt-0 lg:pt-14">
             <ul className="space-y-4">
              {['BMI Calculator', 'Age Calculator', 'Password Strength Checker'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(/\\s+/g, '-')}`} className="text-[#8492a6] hover:text-[#3b82f6] transition-colors text-[15px] font-medium text-left block">{item}</Link>
                </li>
              ))}
                <li>
                  <Link to="/" className="text-[#3b82f6] hover:text-blue-600 transition-colors text-[15px] font-medium text-left block">Others</Link>
                </li>
            </ul>
          </div>

        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="w-full bg-[#fafafa] border-t border-slate-50 mt-10 py-6 text-center">
        <p className="text-slate-500 text-sm font-medium">
          &copy; {new Date().getFullYear()} Gugly Mugly. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
