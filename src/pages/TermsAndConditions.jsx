import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Section = ({ number, title, children }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-baseline gap-3">
      <span className="text-blue-500 font-black text-lg">{number}.</span>
      {title}
    </h2>
    <div className="text-slate-600 leading-relaxed space-y-3 text-[15px]">
      {children}
    </div>
  </section>
);

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Terms & Conditions — Gugly Mugly';
  }, []);

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Document Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 mb-6">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using Gugly Mugly's tools and services. By using our platform, you agree to be bound by these terms.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-slate-400 text-sm bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Last updated: April 4, 2025
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-12">
          <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-slate-600 font-medium">Terms &amp; Conditions</span>
        </nav>

        {/* Agreement Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4 mb-12">
          <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Important:</strong> By accessing or using any part of Gugly Mugly (guglymugly.com), you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use of our Services immediately.
          </p>
        </div>

        <Section number="1" title="Acceptance of Terms">
          <p>
            These Terms and Conditions ("Terms") govern your access to and use of the Gugly Mugly website (<strong className="text-slate-800">guglymugly.com</strong>) and all associated tools, features, and services (collectively, the "Services"), operated by Gugly Mugly ("we," "our," or "us").
          </p>
          <p>
            By accessing or using our Services, you confirm that you are at least 13 years of age, have read and understood these Terms, and agree to be legally bound by them. If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
          </p>
        </Section>

        <Section number="2" title="Description of Services">
          <p>
            Gugly Mugly provides a suite of free, browser-based online tools including but not limited to:
          </p>
          <ul className="list-none space-y-3 mt-3">
            {[
              { icon: '📄', label: 'PDF Tools', desc: 'Merge, split, compress, convert, protect, and edit PDF files.' },
              { icon: '🖼️', label: 'Image Tools', desc: 'Convert, resize, compress, and crop images in various formats.' },
              { icon: '🧮', label: 'Calculator Tools', desc: 'BMI, age, loan, tax, and other utility calculators.' },
              { icon: '🤖', label: 'AI Tools', desc: 'AI-powered image generation and content tools.' },
            ].map(({ icon, label, desc }) => (
              <li key={label} className="flex gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-semibold text-slate-700 mb-0.5">{label}</p>
                  <p className="text-slate-500">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3">We reserve the right to modify, suspend, or discontinue any Services at any time without prior notice.</p>
        </Section>

        <Section number="3" title="User Responsibilities">
          <p>By using our Services, you agree to:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>Use the Services only for lawful purposes and in compliance with all applicable laws and regulations.</li>
            <li>Not upload, transmit, or share any content that is illegal, harmful, defamatory, infringing, obscene, or otherwise objectionable.</li>
            <li>Not attempt to reverse-engineer, decompile, or extract the source code of any part of our Services.</li>
            <li>Not use automated bots, scrapers, or scripts to access or overload our Services.</li>
            <li>Not upload malware, viruses, or any other malicious code.</li>
            <li>Not use our Services to infringe upon the intellectual property rights of others.</li>
            <li>Maintain the confidentiality of any credentials or access details pertaining to our Services.</li>
          </ul>
        </Section>

        <Section number="4" title="File Uploads & Data Handling">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
            <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-blue-800 mb-1">Automatic File Deletion</p>
              <p className="text-blue-700 text-sm leading-relaxed">
                All files uploaded to our servers for processing (both the source files and any output files) are automatically and permanently deleted within <strong>1 hour</strong>. We do not retain, analyze, or share the contents of your files beyond what is necessary to complete the requested operation.
              </p>
            </div>
          </div>
          <p className="mt-4">
            By uploading files to our Services, you confirm and warrant that:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>You own the files or have the necessary rights, licenses, and permissions to upload and process them.</li>
            <li>The files do not contain malicious code, viruses, or any harmful content.</li>
            <li>Processing the files does not violate any third-party rights, including copyright, trademark, or privacy rights.</li>
          </ul>
          <p className="mt-3">
            We are not responsible for the loss of any files or data. You should always keep backup copies of your original files.
          </p>
        </Section>

        <Section number="5" title="Intellectual Property">
          <p>
            All content on the Gugly Mugly website — including but not limited to text, graphics, logos, icons, images, software, and the overall design — is the property of Gugly Mugly or its content suppliers and is protected by applicable intellectual property laws.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your personal, non-commercial use. You may not:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>Reproduce, duplicate, copy, or sell any portion of our Services without express written permission.</li>
            <li>Use our branding, logos, or trademarks without prior written consent.</li>
            <li>Create derivative works based on our Services or content without authorization.</li>
          </ul>
        </Section>

        <Section number="6" title="Disclaimer of Warranties">
          <p>
            Our Services are provided on an <strong className="text-slate-800">"AS IS"</strong> and <strong className="text-slate-800">"AS AVAILABLE"</strong> basis, without warranties of any kind, either express or implied, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>Implied warranties of merchantability or fitness for a particular purpose</li>
            <li>Warranties that the Services will be uninterrupted, error-free, or secure</li>
            <li>Warranties regarding the accuracy or completeness of any results produced by our tools</li>
          </ul>
          <p className="mt-3">
            We make no warranty that our Services will meet your specific requirements or that any errors or defects will be corrected.
          </p>
        </Section>

        <Section number="7" title="Limitation of Liability">
          <p>
            To the fullest extent permitted by applicable law, Gugly Mugly and its officers, directors, employees, agents, and licensors shall not be liable for:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
            <li>Damages resulting from unauthorized access to or alteration of your files or data</li>
            <li>Damages resulting from any conduct or content of any third party on the Services</li>
            <li>Any errors or inaccuracies in the output generated by our tools</li>
          </ul>
          <p className="mt-3">
            In no event shall our total liability to you exceed the amount of fees paid by you to us in the twelve (12) months preceding the claim (if any).
          </p>
        </Section>

        <Section number="8" title="Third-Party Links & Services">
          <p>
            Our Services may contain links to third-party websites, advertisements, or integrations that are not owned or controlled by Gugly Mugly. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
          </p>
          <p>
            We strongly advise you to read the Terms and Conditions and Privacy Policies of any third-party websites you visit. Our inclusion of a link does not imply endorsement of the linked site.
          </p>
        </Section>

        <Section number="9" title="Privacy Policy">
          <p>
            Your use of our Services is also governed by our{' '}
            <Link to="/privacy-policy" className="text-blue-500 hover:underline font-medium">
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding data collection and use.
          </p>
        </Section>

        <Section number="10" title="Prohibited Uses">
          <p>You are strictly prohibited from using our Services to:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>Process, distribute, or store any content that is illegal under applicable law</li>
            <li>Engage in any activity that infringes or violates the rights of others</li>
            <li>Transmit unsolicited commercial communications (spam)</li>
            <li>Attempt to gain unauthorized access to our servers, systems, or networks</li>
            <li>Engage in any form of data mining or scraping without written permission</li>
            <li>Impersonate any person or entity, or misrepresent your affiliation with a person or entity</li>
            <li>Use the Services for any commercial purposes without our express written consent</li>
          </ul>
        </Section>

        <Section number="11" title="Termination">
          <p>
            We reserve the right to terminate or suspend your access to all or part of our Services at any time, with or without cause, and with or without notice, at our sole discretion. Reasons may include, but are not limited to, violation of these Terms or conduct that we believe is harmful to other users, us, or third parties.
          </p>
          <p>
            Upon termination, all rights granted to you under these Terms will immediately cease, and you must stop all use of the Services.
          </p>
        </Section>

        <Section number="12" title="Changes to Terms">
          <p>
            We reserve the right to update or modify these Terms and Conditions at any time. We will indicate the date of the most recent revision at the top of this page. Your continued use of the Services after any changes become effective constitutes your acceptance of the revised Terms.
          </p>
          <p>
            We encourage you to review these Terms periodically to stay informed of any updates.
          </p>
        </Section>

        <Section number="13" title="Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms or our Services shall be resolved through binding arbitration or in the courts of the applicable jurisdiction, as determined by us.
          </p>
        </Section>

        <Section number="14" title="Contact Us">
          <p>If you have any questions about these Terms and Conditions, please contact us:</p>
          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <p className="font-bold text-slate-800 text-lg">Gugly Mugly</p>
            <p className="flex items-center gap-2 text-slate-600">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:legal@guglymugly.com" className="text-blue-500 hover:underline">
                legal@guglymugly.com
              </a>
            </p>
            <p className="flex items-center gap-2 text-slate-600">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <a href="https://guglymugly.com" className="text-blue-500 hover:underline">guglymugly.com</a>
            </p>
          </div>
        </Section>

        {/* Related Links */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10">
          <p className="text-slate-700 font-semibold mb-4">Related Legal Documents</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/privacy-policy"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Gugly Mugly. All rights reserved.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
