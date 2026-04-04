import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "What is Gugly Mugly?",
    answer: "Gugly Mugly is a comprehensive suite of free online tools designed to make your daily tasks easier. We offer a wide range of utilities, including PDF converters, image editors, calculators, and AI generation tools, all accessible directly from your browser without any software installation."
  },
  {
    question: "Do I need to pay to use these tools?",
    answer: "No, all of the tools on Gugly Mugly are 100% free to use. We believe in providing accessible, high-quality utilities for everyone without hidden fees or premium subscriptions."
  },
  {
    question: "Are my files safe and private?",
    answer: "Yes, your privacy and data security are our top priority. All files uploaded for processing (like PDFs or images) are automatically and totally deleted from our servers within 1 hour after processing. We do not store, share, or analyze your personal documents."
  },
  {
    question: "Do I need to create an account to use the tools?",
    answer: "No account creation is required! You can use all our tools immediately as a guest. This keeps your workflow fast and frictionless."
  },
  {
    question: "Can I use Gugly Mugly on my mobile phone?",
    answer: "Absolutely. Our website is completely mobile-responsive, meaning you can access and use all of our tools comfortably from your smartphone or tablet, whether you're using iOS or Android."
  },
  {
    question: "How does the AI Image Generator work?",
    answer: "Our AI Image Generator utilizes advanced AI models to turn your text descriptions into stunning images. Simply type in a prompt of what you want to see, select your preferred artistic style and aspect ratio, and our AI will generate the image for you in seconds."
  },
  {
    question: "Is there a limit to how many files I can convert?",
    answer: "Currently, there are no strict daily limitations on the number of files you can process. However, to ensure fair usage and server stability for everyone, unusually high automated traffic may be temporarily rate-limited."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 md:px-6 bg-white border-t border-slate-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-500 font-medium">Have questions? We're here to help.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-[#3b82f6] shadow-md bg-blue-50/10' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                >
                  <span className={`font-bold text-[17px] ${isOpen ? 'text-[#3b82f6]' : 'text-slate-700'}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-[#3b82f6] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 text-slate-500 leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
