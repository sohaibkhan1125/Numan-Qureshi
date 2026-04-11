import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
      {title}
    </h2>
    <div className="text-slate-600 leading-relaxed space-y-3 text-[15px]">
      {children}
    </div>
  </section>
);

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Privacy Policy — Gugly Mugly';
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Shield Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 mb-6">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Your privacy matters to us. This policy explains how Gugly Mugly collects, uses, and protects your information.
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
          <span className="text-slate-600 font-medium">Privacy Policy</span>
        </nav>

        <Section title="1. Introduction">
          <p>
            Welcome to <strong className="text-slate-800">Gugly Mugly</strong> ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
          </p>
          <p>
            This Privacy Policy applies to all information collected through our website{' '}
            <span className="text-blue-500 font-medium">guglymugly.com</span> and any related tools, features, or services we offer (collectively, the "Services").
          </p>
          <p>
            Please read this policy carefully. If you disagree with its terms, please discontinue use of our Services.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect information in the following ways:</p>
          <ul className="list-none space-y-3 mt-2">
            {[
              {
                icon: '📄',
                title: 'Files You Upload',
                desc: 'When you use our PDF, image, or conversion tools, you may temporarily upload files to our servers for processing. These files are automatically deleted within 1 hour of being processed.',
              },
              {
                icon: '📊',
                title: 'Usage Data',
                desc: 'We automatically collect certain usage data when you visit our site, including your IP address, browser type, pages visited, and time spent on each page. This is collected via cookies and similar tracking technologies.',
              },
              {
                icon: '📧',
                title: 'Contact Information',
                desc: 'If you contact us directly (e.g., via email or a contact form), we may collect your name, email address, and the contents of your message.',
              },
              {
                icon: '🍪',
                title: 'Cookies & Local Storage',
                desc: 'We use cookies and local storage to enhance your experience, remember preferences, and analyze traffic patterns.',
              },
            ].map(({ icon, title, desc }) => (
              <li key={title} className="flex gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-semibold text-slate-700 mb-1">{title}</p>
                  <p className="text-slate-500">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>Provide, operate, and maintain our Services</li>
            <li>Process and convert files you upload temporarily</li>
            <li>Improve, personalize, and expand our Services</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you for customer service or related purposes</li>
            <li>Send you updates, security alerts, and support messages (if applicable)</li>
            <li>Find and prevent fraud and abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="4. File Processing & Data Retention">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
            <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-blue-800 mb-1">Automatic File Deletion</p>
              <p className="text-blue-700 text-sm leading-relaxed">
                All files — both uploaded and processed — are automatically and permanently deleted from our servers within <strong>1 hour</strong> of processing. We do not store, share, or analyze the contents of your files beyond what is needed to complete the conversion or operation you requested.
              </p>
            </div>
          </div>
        </Section>

        <Section title="5. Sharing Your Information">
          <p>We do <strong className="text-slate-800">not</strong> sell, trade, or rent your personal information to third parties. We may share information in the following limited circumstances:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li><strong>Service Providers:</strong> Trusted third-party vendors who assist in operating our website (e.g., hosting, analytics) under strict confidentiality agreements.</li>
            <li><strong>Legal Requirements:</strong> If required by law, regulation, or government request, we may disclose information to comply with legal obligations.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
          </ul>
        </Section>

        <Section title="6. Cookies & Tracking Technologies">
          <p>
            We use cookies and similar tracking technologies (such as web beacons and pixels) to track activity on our Services and hold certain information. Cookies are files with small amounts of data that may include an anonymous unique identifier.
          </p>
          <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our Services may not function properly.</p>
          <p>We may use the following types of cookies:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li><strong>Essential Cookies:</strong> Required for the website to function correctly.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (e.g., Google Analytics).</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences for future visits.</li>
          </ul>
        </Section>

        <Section title="7. Third-Party Services">
          <p>
            Our Services may contain links to or integrate with third-party websites, tools, or services (such as Google Analytics or advertising networks). We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party services you visit.
          </p>
        </Section>

        <Section title="8. Data Security">
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li>HTTPS encryption for all data in transit</li>
            <li>Automatic deletion of uploaded files within 1 hour</li>
            <li>Regular security reviews and updates</li>
            <li>Limited internal access to user data</li>
          </ul>
          <p className="mt-3">
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            Our Services are not directed to individuals under the age of <strong className="text-slate-800">13</strong>. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information from our servers immediately.
          </p>
        </Section>

        <Section title="10. Your Rights">
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-1">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data.</li>
            <li><strong>Objection:</strong> Object to our processing of your personal data.</li>
            <li><strong>Data Portability:</strong> Request that we transfer your data to another organization or directly to you.</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, please contact us at the email address listed below.</p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <p className="font-bold text-slate-800 text-lg">Gugly Mugly</p>
            <p className="flex items-center gap-2 text-slate-600">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:privacy@guglymugly.com" className="text-blue-500 hover:underline">
                privacy@guglymugly.com
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

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

export default PrivacyPolicy;
