import React from 'react';
import { FaWhatsapp, FaInstagram, FaHeart, FaShieldHalved, FaTruckFast, FaArrowUp, FaFileContract, FaRotateLeft, FaLocationDot, FaPhone, FaEnvelope } from 'react-icons/fa6';
import { STORE_PHONE, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../data/products';
import logoImg from '../assets/logo.jpg';

export default function Footer({ onOpenPolicy }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#102530] text-[#e2d5c3] pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#d4af37]/60 shadow-sm flex-shrink-0 bg-white">
                <img src={logoImg} alt="What Shells Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury text-2xl font-bold tracking-tight text-white leading-none">
                  whatshells
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#d8cdba] uppercase font-semibold">
                  Artisanal Seashell Decor
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-body-text">
              Handcrafted coastal home decor, statement seashell vanity mirrors, and ocean soy candles. Hand-assembled sustainably along coastal shores. Operating under <strong>Tinydev Solutions</strong>.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-500 text-white flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href={`https://wa.me/${STORE_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">
              Collection
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-body-text">
              <li><a href="#collection" className="hover:text-white transition-colors">Seashell Mirrors</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Conch Wax Candles</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Pearl Oyster Dishes</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Ambient Shell Lamps</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Our Craftsmanship</a></li>
            </ul>
          </div>

          {/* Mandatory Compliance Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
              <FaShieldHalved className="text-xs" />
              <span>Customer Policies</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-body-text">
              <li>
                <button 
                  onClick={() => onOpenPolicy && onOpenPolicy('terms')}
                  className="hover:text-[#d4af37] text-left transition-colors flex items-center gap-1.5"
                >
                  <FaFileContract className="text-[11px] text-[#8c7b67]" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPolicy && onOpenPolicy('privacy')}
                  className="hover:text-[#d4af37] text-left transition-colors flex items-center gap-1.5"
                >
                  <FaShieldHalved className="text-[11px] text-[#8c7b67]" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPolicy && onOpenPolicy('refund')}
                  className="hover:text-[#d4af37] text-left transition-colors flex items-center gap-1.5"
                >
                  <FaRotateLeft className="text-[11px] text-[#8c7b67]" />
                  <span>Cancellation & Refund Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPolicy && onOpenPolicy('shipping')}
                  className="hover:text-[#d4af37] text-left transition-colors flex items-center gap-1.5"
                >
                  <FaTruckFast className="text-[11px] text-[#8c7b67]" />
                  <span>Shipping & Delivery Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPolicy && onOpenPolicy('contact')}
                  className="hover:text-[#d4af37] text-left transition-colors flex items-center gap-1.5 font-medium text-emerald-400"
                >
                  <FaPhone className="text-[11px]" />
                  <span>Contact & Grievance Officer</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Registered Merchant & Workshop Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">
              Registered Merchant
            </h4>
            <div className="space-y-2 text-xs text-slate-300 font-body-text">
              <div className="flex items-start gap-2">
                <FaLocationDot className="text-[#d4af37] text-xs mt-0.5 flex-shrink-0" />
                <span className="text-[11px] leading-relaxed">
                  <strong>Whatshells (Tinydev Solutions)</strong><br />
                  Sri Ganesh Apartment, Pollachi, Coimbatore, Tamil Nadu – 642001, India
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <FaPhone className="text-[#d4af37] text-xs flex-shrink-0" />
                <span className="text-[11px]">+91 93848 28771 / +{STORE_PHONE}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-[#d4af37] text-xs flex-shrink-0" />
                <span className="text-[11px]">support@whatshells.com</span>
              </div>
              <div className="pt-1 text-[10px] text-emerald-400 font-medium">
                ● Secured with 256-Bit SSL & Razorpay
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong>whatshells</strong>. Handcrafted with <FaHeart className="inline text-rose-500 text-xs mx-0.5" /> for oceanic souls.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button onClick={() => onOpenPolicy && onOpenPolicy('terms')} className="hover:text-white transition-colors">
              Terms
            </button>
            <span>•</span>
            <button onClick={() => onOpenPolicy && onOpenPolicy('privacy')} className="hover:text-white transition-colors">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => onOpenPolicy && onOpenPolicy('refund')} className="hover:text-white transition-colors">
              Refunds
            </button>
            <span>•</span>
            <button onClick={() => onOpenPolicy && onOpenPolicy('shipping')} className="hover:text-white transition-colors">
              Shipping
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors ml-2"
            >
              <span>Back to Top</span>
              <FaArrowUp className="text-[10px]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

