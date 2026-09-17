import React from 'react';
import { 
  FaWhatsapp, 
  FaCartShopping, 
  FaAddressCard, 
  FaCreditCard, 
  FaTableList, 
  FaCircleCheck, 
  FaRobot, 
  FaArrowRight 
} from 'react-icons/fa6';

export default function WhatsAppFlowExplainer() {
  const steps = [
    {
      step: '01',
      title: 'Click & Redirect to WhatsApp',
      desc: 'Browse our seashell pieces and tap "Buy via WhatsApp". A structured enquiry message with SKU & details is pre-filled automatically.',
      icon: <FaWhatsapp className="text-[#25D366] text-2xl" />,
      tag: 'Instant 1-Click Link'
    },
    {
      step: '02',
      title: 'WhatsApp Automation Greets You',
      desc: 'Our store workflow bot immediately greets you, confirms item availability, and requests your Name & Phone Number.',
      icon: <FaRobot className="text-[#173847] text-2xl" />,
      tag: 'Zero Wait Time'
    },
    {
      step: '03',
      title: 'Address & Quantity Confirmation',
      desc: 'Share your delivery address, pincode, and desired quantity or custom personalization notes directly in chat.',
      icon: <FaAddressCard className="text-[#8c6b43] text-2xl" />,
      tag: 'Automated State Machine'
    },
    {
      step: '04',
      title: 'Secure Payment Link Generated',
      desc: 'Receive an instant UPI / Payment gateway link in chat to pay seamlessly with verified payment confirmation.',
      icon: <FaCreditCard className="text-[#0b5c4f] text-2xl" />,
      tag: 'UPI / Cards / NetBanking'
    },
    {
      step: '05',
      title: 'Auto Sync to Google Sheets & Dispatch',
      desc: 'Once paid, an Order ID (#WS-XXXXX) is issued and all order details are automatically uploaded to Google Sheets for our workshop team to pack and ship!',
      icon: <FaTableList className="text-emerald-600 text-2xl" />,
      tag: 'Google Sheets API Sync'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-[#f5eee3] via-[#FAF7F2] to-[#fbf9f5] border-y border-[#ebdcc9] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#075e54] uppercase bg-[#e6f7f2] px-3.5 py-1.5 rounded-full border border-[#a8e5d3]">
            <FaRobot className="text-sm" />
            Seamless WhatsApp Automation Workflow
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#173847] font-bold">
            How WhatsApp Ordering Works
          </h2>
          <p className="text-[#556370] text-sm sm:text-base font-body-text">
            Experience the future of boutique e-commerce. From Instagram discovery to automated WhatsApp checkout and real-time Google Sheets tracking.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-6 border border-[#ebdcc9] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif-luxury text-2xl font-bold text-[#8c6b43]/40 group-hover:text-[#8c6b43] transition-colors">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#ebdcc9] flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 mb-4">
                <h3 className="font-serif-luxury text-base font-bold text-[#173847] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed font-body-text">
                  {item.desc}
                </p>
              </div>

              {/* Tag footer */}
              <div className="pt-3 border-t border-[#f0e6d8] flex items-center gap-1.5 text-[10px] font-semibold text-[#075e54]">
                <FaCircleCheck className="text-emerald-500 text-xs" />
                <span>{item.tag}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
