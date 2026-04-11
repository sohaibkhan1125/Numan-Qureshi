import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Section = ({ number, title, children }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-baseline gap-3">
      <span className="text-rose-500 font-black text-lg">{number}.</span>
      {title}
    </h2>
    <div className="text-slate-600 leading-relaxed space-y-3 text-[15px]">
      {children}
    </div>
  </section>
);

const Disclaimer = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Disclaimer — Gugly Mugly';
  }, []);

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Warning Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-400/30 mb-6">
            <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Disclaimer
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Important information about the limitations of our Services and the nature of the content and tools available on Gugly Mugly.
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
          <span className="text-slate-600 font-medium">Disclaimer</span>
        </nav>

        {/* Top Notice */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex gap-4 mb-12">
          <svg className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-rose-800 text-sm leading-relaxed">
            <strong>Please Read Carefully:</strong> By using Gugly Mugly's tools and services, you acknowledge that you have read, understood, and agreed to this Disclaimer. If you do not agree, please discontinue use of our Services.
          </p>
        </div>

        <Section number="1" title="General Disclaimer">
          <p>
            The information and tools provided on <strong className="text-slate-800">Gugly Mugly</strong> (guglymugly.com) are offered for general informational and productivity purposes only. While we strive to keep our tools accurate and up to date, we make <strong className="text-slate-800">no representations or warranties</strong> of any kind — express or implied — about the completeness, accuracy, reliability, suitability, or availability of our Services, or the information, products, services, or related graphics contained on the website for any purpose.
          </p>
          <p>
            Any reliance you place on such information or output from our tools is strictly at your own risk.
          </p>
        </Section>

        <Section number="2" title="No Professional Advice">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {[
              {
                icon: '⚖️',
                title: 'Not Legal Advice',
                desc: 'Nothing on this website constitutes legal advice. For legal matters, please consult a qualified attorney.',
              },
              {
                icon: '🏥',
                title: 'Not Medical Advice',
                desc: 'Our health and fitness calculators (BMI, BMR, calorie, etc.) are for informational purposes only. Always consult a medical professional.',
              },
              {
                icon: '💰',
                title: 'Not Financial Advice',
                desc: 'Our financial calculators (interest, profit margin, freelance rate, etc.) do not constitute financial advice. Consult a financial advisor.',
              },
              {
                icon: '📐',
                title: 'Not Engineering Advice',
                desc: 'Results from tools such as our concrete or flooring calculators are estimates only and should be verified by a qualified professional.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-semibold text-slate-700 mb-1 text-[14px]">{title}</p>
                  <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4">
            The results produced by any calculator or tool on this site are estimates based on the data you provide. Always verify critical results with a qualified professional before making important decisions.
          </p>
        </Section>

        <Section number="3" title="File Processing Disclaimer">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
            <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-blue-800 mb-1">Automatic File Deletion</p>
              <p className="text-blue-700 text-sm leading-relaxed">
                All files uploaded to our servers — both source and output files — are automatically and permanently deleted within <strong>1 hour</strong> of processing. We do not store, review, or share your file contents.
              </p>
            </div>
          </div>
          <p className="mt-4">
            While we take reasonable precautions to ensure secure file handling, we strongly recommend:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>Always keeping original backup copies of your files before uploading them.</li>
            <li>Not uploading files containing highly sensitive personal, financial, or confidential information unless absolutely necessary.</li>
            <li>Downloading your processed files promptly, as they will be deleted after 1 hour.</li>
          </ul>
          <p className="mt-3">
            We are <strong className="text-slate-800">not responsible</strong> for any loss, corruption, or damage to files during the upload, processing, or download stages. Use our file tools at your own discretion.
          </p>
        </Section>

        <Section number="4" title="Tool Accuracy Disclaimer">
          <p>
            Our online conversion, calculation, and processing tools are designed to produce accurate results under standard conditions. However:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>Results may vary depending on the quality, format, or content of the files or data you provide.</li>
            <li>Converted files (PDFs, images, etc.) may vary in quality depending on the source format.</li>
            <li>Calculator results are mathematical estimates and may not account for real-world variables.</li>
            <li>AI-generated content and images are produced by machine learning models and may contain inaccuracies, biases, or errors.</li>
          </ul>
          <p className="mt-3">
            Gugly Mugly does not guarantee that the output of any tool will meet your specific requirements or be free from errors or inaccuracies.
          </p>
        </Section>

        <Section number="5" title="AI-Generated Content Disclaimer">
          <p>
            Gugly Mugly offers AI-powered tools including image generation and other AI-based features. Please be aware of the following:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>AI-generated content is produced automatically and may not always be accurate, appropriate, or suitable for every purpose.</li>
            <li>We do not endorse, verify, or take responsibility for the accuracy or quality of AI-generated outputs.</li>
            <li>AI-generated images should not be used for medical, legal, financial, or other professional purposes without independent expert review.</li>
            <li>You are solely responsible for how you use any AI-generated content produced through our Services.</li>
          </ul>
        </Section>

        <Section number="6" title="Third-Party Links Disclaimer">
          <p>
            Our website may contain links to external websites, services, or resources that are not owned or controlled by Gugly Mugly. These links are provided for your convenience only.
          </p>
          <p>
            We have <strong className="text-slate-800">no control</strong> over the content, privacy policies, or practices of any third-party websites and bear no responsibility for them. We do not warrant or make any representations concerning the accuracy, legality, decency, or any other aspect of the content on those websites.
          </p>
          <p>
            The inclusion of any link does not imply endorsement by Gugly Mugly of the linked site. Use such links at your own risk.
          </p>
        </Section>

        <Section number="7" title="Availability & Uptime Disclaimer">
          <p>
            We strive to keep our Services available at all times; however, we do not guarantee that our website or tools will be available without interruption or error. We reserve the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>Modify, suspend, or discontinue any part of our Services at any time without notice.</li>
            <li>Perform scheduled or emergency maintenance that may cause temporary downtime.</li>
            <li>Impose usage limits or restrictions without prior notice.</li>
          </ul>
          <p className="mt-3">
            Gugly Mugly shall not be liable to you or any third party for any losses arising from the unavailability of the Services.
          </p>
        </Section>

        <Section number="8" title="Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Gugly Mugly and its affiliates, officers, employees, agents, and licensors shall not be liable for:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>Any direct, indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of data, files, profits, revenue, or goodwill</li>
            <li>Errors or inaccuracies in tool outputs or calculations</li>
            <li>Unauthorized access to or use of our servers and any personal information stored therein</li>
            <li>Any interruption or cessation of transmission to or from our Services</li>
            <li>Any bugs, viruses, or other harmful code that may be transmitted to or through our Services</li>
          </ul>
          <p className="mt-3">
            This limitation of liability applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other legal theory.
          </p>
        </Section>

        <Section number="9" title="Your Responsibility">
          <p>
            You are solely responsible for:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>Verifying that you have the legal right to upload, convert, or process any files you use with our Services.</li>
            <li>Ensuring that the files you upload do not infringe upon any third-party copyrights, trademarks, or other intellectual property rights.</li>
            <li>The accuracy of data you input into any of our calculators or tools.</li>
            <li>Any decisions you make based on the outputs or results produced by our tools.</li>
            <li>Downloading and saving your processed files within the 1-hour window before automatic deletion.</li>
          </ul>
        </Section>

        <Section number="10" title="Changes to This Disclaimer">
          <p>
            We reserve the right to update or modify this Disclaimer at any time without prior notice. Changes will be effective immediately upon posting to the website. The "Last updated" date at the top of this page will reflect the most recent revision.
          </p>
          <p>
            Your continued use of our Services following any changes constitutes your acceptance of the updated Disclaimer.
          </p>
        </Section>

        <Section number="11" title="Contact Us">
          <p>If you have any questions about this Disclaimer, please contact us:</p>
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

        {/* Related Legal Documents */}
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
            <Link
              to="/terms-and-conditions"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Terms &amp; Conditions
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

export default Disclaimer;
