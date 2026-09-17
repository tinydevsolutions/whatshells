import React, { useState } from 'react';
import { FaXmark, FaShieldHalved, FaFileContract, FaRotateLeft, FaTruckFast, FaPhone, FaLocationDot, FaEnvelope } from 'react-icons/fa6';
import { STORE_PHONE, INSTAGRAM_HANDLE } from '../data/products';
import logoImg from '../assets/logo.jpg';

export default function PolicyModal({ initialTab = 'terms', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'terms', name: 'Terms of Service', icon: FaFileContract },
    { id: 'privacy', name: 'Privacy Policy', icon: FaShieldHalved },
    { id: 'refund', name: 'Refund & Cancellation', icon: FaRotateLeft },
    { id: 'shipping', name: 'Shipping & Delivery', icon: FaTruckFast },
    { id: 'contact', name: 'Contact & Grievance', icon: FaPhone },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#ebdcc9] my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#173847] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#d4af37]/60 flex-shrink-0 bg-white shadow-sm">
              <img src={logoImg} alt="What Shells Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold tracking-wide">
                Whatshells Legal & Compliance Policies
              </h2>
              <p className="text-xs text-[#a2c2d2]">
                Official Policies • RBI & Razorpay Verified Compliance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            aria-label="Close policies modal"
          >
            <FaXmark className="text-lg" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-3 bg-[#FAF7F2] border-b border-[#e8ddcd] scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#173847] text-white shadow-xs'
                    : 'bg-white text-[#52606d] hover:bg-[#eee4d5] border border-[#e2d5c3]'
                }`}
              >
                <Icon className={`text-xs ${isActive ? 'text-[#d4af37]' : 'text-[#8c6b43]'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Policy Content Area */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto overscroll-contain text-xs sm:text-sm text-[#374151] leading-relaxed space-y-4 font-body-text">
          
          {/* TAB 1: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="border-b border-[#ebdcc9] pb-3">
                <h3 className="font-serif-luxury text-lg font-bold text-[#173847]">Terms & Conditions</h3>
                <p className="text-xs text-gray-500">Last updated: September 2026 • Governed under Laws of India</p>
              </div>

              <p>
                Welcome to <strong>Whatshells</strong> (an artisanal e-commerce brand operating under <em>Tinydev Solutions</em>). By browsing our website, placing an order via our online store or WhatsApp bot, you agree to comply with and be bound by the following terms and conditions.
              </p>

              <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#ebdcc9]">
                <h4 className="font-bold text-[#173847]">1. Artisanal & Handcrafted Products</h4>
                <p>
                  All seashell mirrors, conch candles, oyster dishes, and coastal lighting are individually handcrafted using cleaned, ethically sourced natural shells. Due to the authentic nature of natural sea shells, slight variations in size, color tone, and texture are natural characteristics that make each piece unique.
                </p>

                <h4 className="font-bold text-[#173847]">2. Pricing & Currency</h4>
                <p>
                  All prices displayed on Whatshells are in <strong>Indian National Rupees (INR ₹)</strong> and are inclusive of all applicable taxes. We offer <strong>Free Express Insured Shipping</strong> on all domestic orders across India.
                </p>

                <h4 className="font-bold text-[#173847]">3. Payment & Security</h4>
                <p>
                  We accept secure online payments via <strong>Razorpay Payment Gateway</strong> supporting UPI (Google Pay, PhonePe, Paytm, BHIM), NetBanking, Debit/Credit Cards, and Wallets. All transactions are protected with 256-bit SSL encryption.
                </p>

                <h4 className="font-bold text-[#173847]">4. Governing Jurisdiction</h4>
                <p>
                  Any dispute or claim arising out of or in connection with our services or products shall be governed by and construed in accordance with the laws of India, subject to the exclusive jurisdiction of the courts in Coimbatore / Pollachi, Tamil Nadu.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="border-b border-[#ebdcc9] pb-3">
                <h3 className="font-serif-luxury text-lg font-bold text-[#173847]">Privacy Policy</h3>
                <p className="text-xs text-gray-500">Your privacy is protected with industry-standard 256-bit encryption</p>
              </div>

              <p>
                At <strong>Whatshells</strong>, we are committed to safeguarding the privacy of our customers. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or place an order.
              </p>

              <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#ebdcc9]">
                <h4 className="font-bold text-[#173847]">1. Information We Collect</h4>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li><strong>Contact Details:</strong> Customer Name, WhatsApp Phone Number, and Email Address.</li>
                  <li><strong>Delivery Information:</strong> Shipping Address, Landmark, City, State, and 6-digit Pincode.</li>
                  <li><strong>Order Information:</strong> Items selected, custom gift notes, and transaction reference IDs.</li>
                </ul>

                <h4 className="font-bold text-[#173847]">2. How We Use Your Data</h4>
                <p>
                  Your information is strictly used to fulfill and dispatch your orders, send real-time courier tracking updates via WhatsApp, process payments/refunds through Razorpay, and provide customer support.
                </p>

                <h4 className="font-bold text-[#173847]">3. Payment Security & Zero Card Storage</h4>
                <p>
                  We do not collect or store your credit/debit card numbers, CVVs, or UPI PINs on our servers. All financial transactions are processed directly through <strong>Razorpay (PCI-DSS Level 1 compliant gateway)</strong>.
                </p>

                <h4 className="font-bold text-[#173847]">4. Non-Disclosure & Third Parties</h4>
                <p>
                  We never sell, rent, or trade your personal information to third parties. Data is shared solely with certified courier partners (e.g., Delhivery, BlueDart, DTDC) strictly for delivery purposes.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: REFUND & CANCELLATION POLICY */}
          {activeTab === 'refund' && (
            <div className="space-y-4">
              <div className="border-b border-[#ebdcc9] pb-3">
                <h3 className="font-serif-luxury text-lg font-bold text-[#173847]">Cancellation & Refund Policy</h3>
                <p className="text-xs text-emerald-700 font-semibold">100% Guaranteed Refunds & Zero-Breakage Assurance</p>
              </div>

              <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#ebdcc9]">
                <h4 className="font-bold text-[#173847]">1. Order Cancellation (Before Dispatch)</h4>
                <p>
                  Customers can cancel their order <strong>anytime before the product is dispatched from our workshop</strong> (within 24 hours of placing the order). You can cancel instantly on WhatsApp by sending <code>cancel WS-XXXXXX</code> or contacting support.
                </p>

                <h4 className="font-bold text-[#173847]">2. Instant Refund Timeline</h4>
                <p>
                  Upon cancellation approval:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li><strong>UPI Payments (GPay, PhonePe, Paytm):</strong> Full refund is processed <strong>instantly</strong> back to your bank/UPI VPA.</li>
                  <li><strong>Debit / Credit Cards & NetBanking:</strong> Refund is credited within <strong>5 to 7 business days</strong> to the original payment source.</li>
                </ul>

                <h4 className="font-bold text-[#173847]">3. Zero-Breakage Transit Guarantee & Replacements</h4>
                <p>
                  Every handcrafted mirror and delicate shell creation is packed in custom triple-layer shockproof crates. If an item arrives damaged in transit, please share an unboxing photo/video within <strong>48 hours of delivery</strong> to our WhatsApp or email. We will immediately dispatch a <strong>free brand-new replacement</strong> or issue a <strong>100% full refund</strong>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SHIPPING & DELIVERY POLICY */}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="border-b border-[#ebdcc9] pb-3">
                <h3 className="font-serif-luxury text-lg font-bold text-[#173847]">Shipping & Delivery Policy</h3>
                <p className="text-xs text-gray-500">Free Express Insured Shipping Pan-India</p>
              </div>

              <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#ebdcc9]">
                <h4 className="font-bold text-[#173847]">1. Shipping Coverage</h4>
                <p>
                  We deliver to all serviceable pincodes across India covering 28 states and union territories.
                </p>

                <h4 className="font-bold text-[#173847]">2. Dispatch & Delivery Timelines</h4>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li><strong>Order Processing & Curing:</strong> 24 to 48 hours (each piece receives a final artisanal inspection).</li>
                  <li><strong>Transit Time:</strong> <strong>3 to 7 business days</strong> depending on your delivery location.</li>
                </ul>

                <h4 className="font-bold text-[#173847]">3. Shipping Charges</h4>
                <p>
                  <strong>Free Express Shipping</strong> applies to all orders on Whatshells. No hidden courier charges or handling fees are added at checkout.
                </p>

                <h4 className="font-bold text-[#173847]">4. Live Shipment Tracking</h4>
                <p>
                  As soon as your parcel is handed over to our courier partner (Delhivery / BlueDart / DTDC), you will receive an official WhatsApp tracking link and SMS with the AWB number.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT & GRIEVANCE */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="border-b border-[#ebdcc9] pb-3">
                <h3 className="font-serif-luxury text-lg font-bold text-[#173847]">Official Business Contact & Grievance</h3>
                <p className="text-xs text-gray-500">Registered Indian Merchant Information</p>
              </div>

              <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#ebdcc9]">
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <FaLocationDot className="text-[#8c6b43] mt-1 text-sm flex-shrink-0" />
                    <div>
                      <strong className="block text-[#173847]">Operating & Registered Address:</strong>
                      <span>Whatshells (Tinydev Solutions), Sri Ganesh Apartment, Pollachi, Coimbatore, Tamil Nadu – 642001, India</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <FaPhone className="text-[#8c6b43] text-sm flex-shrink-0" />
                    <div>
                      <strong className="text-[#173847]">Contact Phone:</strong> +91 93848 28771 / +{STORE_PHONE}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <FaEnvelope className="text-[#8c6b43] text-sm flex-shrink-0" />
                    <div>
                      <strong className="text-[#173847]">Support Email:</strong> support@whatshells.com / naveen@tinydevsolutions.com
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#ebdcc9] text-xs text-gray-600">
                    <strong>Grievance Officer:</strong> Navaneetha Krishnan M <br />
                    <strong>Business Hours:</strong> Monday to Saturday: 9:00 AM – 8:00 PM IST
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF7F2] px-6 py-4 border-t border-[#ebdcc9] flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            🔒 Secured & Verified by Razorpay
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#173847] hover:bg-[#20495c] text-white text-xs font-bold transition-all shadow-xs"
          >
            Close Policy
          </button>
        </div>

      </div>
    </div>
  );
}
