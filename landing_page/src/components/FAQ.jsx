import React, { useState } from 'react';
import { FaChevronDown, FaCircleQuestion, FaWhatsapp } from 'react-icons/fa6';
import { STORE_PHONE } from '../data/products';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How does ordering on WhatsApp work?',
      a: 'Simply click "Buy via WhatsApp" on any product on our site. It immediately opens our verified WhatsApp account with a pre-filled enquiry message. Our automated store bot will greet you, record your delivery address, confirm the quantity, and generate a secure payment link. Once paid, your order is recorded instantly and synced to Google Sheets!'
    },
    {
      q: 'Are fragile seashell mirrors and glass safe during courier transit?',
      a: 'Yes! We use custom 5-layer shockproof honeycomb padding, high-density edge guards, and reinforced wooden crates for all mirror shipments. In the rare event of transit damage, we provide a free 100% replacement guarantee.'
    },
    {
      q: 'Can I request custom sizes or personalized gift notes?',
      a: 'Absolutely! You can type your personalization or gift note directly when prompted by our WhatsApp bot or in the product modal. Our artisans will include a handwritten wax-sealed note card at no extra cost.'
    },
    {
      q: 'Which payment methods are accepted in the WhatsApp checkout?',
      a: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm, BHIM), Net Banking, Debit/Credit Cards, and Wallets via our verified payment gateway link.'
    },
    {
      q: 'How long does dispatch and delivery take?',
      a: 'Because our pieces are handcrafted, in-stock items are dispatched within 24 to 48 hours. Custom orders take 3 to 4 days. Standard express delivery takes 2-4 business days across India.'
    },
    {
      q: 'Are the shells sustainably and ethically sourced?',
      a: 'Yes, 100%. We only use shells that are naturally cast onto shores by tidal waves. We work with local coastal collectors and never disturb living marine ecosystems.'
    }
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-white border-t border-[#ebdcc9] scroll-mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#8c6b43] uppercase bg-[#f4ebe1] px-3.5 py-1.5 rounded-full">
            <FaCircleQuestion />
            Got Questions?
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#173847] font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b]">
            Everything you need to know about our shells, WhatsApp checkout, and shipping.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#ebdcc9] bg-[#FAF7F2] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif-luxury text-sm sm:text-base font-bold text-[#173847] hover:text-[#8c6b43] transition-colors"
                >
                  <span>{faq.q}</span>
                  <FaChevronDown
                    className={`text-xs text-[#8c6b43] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#556370] leading-relaxed font-body-text border-t border-[#f0e6d8]/60 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact WhatsApp Callout */}
        <div className="mt-12 text-center p-6 bg-[#FAF7F2] rounded-3xl border border-[#ebdcc9] space-y-3">
          <div className="text-xs text-gray-500">Still have a question or custom design request?</div>
          <a
            href={`https://wa.me/${STORE_PHONE}?text=${encodeURIComponent("Hi Whatshells! 🐚✨ I have a question about custom orders / shipping.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-sm"
          >
            <FaWhatsapp className="text-base" />
            <span>Chat Directly with our Artisan on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
