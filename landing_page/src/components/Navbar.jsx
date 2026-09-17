import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaInstagram, FaBars, FaXmark, FaRobot, FaTruckFast, FaBagShopping } from 'react-icons/fa6';
import { STORE_PHONE, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../data/products';
import logoImg from '../assets/logo.jpg';

export default function Navbar({ onOpenSimulator, onOpenTracker, onOpenCart, cartCount = 0 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-[#173847] text-[#f4efe6] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-white/10">
        <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
        <span>Instagram Special: <strong>Free Insured Express Shipping</strong> on all WhatsApp Orders today! 🚚🐚</span>
        <a 
          href={INSTAGRAM_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 underline underline-offset-2 opacity-90 hover:opacity-100 font-semibold"
        >
          Follow {INSTAGRAM_HANDLE}
        </a>
      </div>

      {/* Main Glass Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'glass-nav shadow-sm py-3' : 'bg-[#fbf9f5]/90 backdrop-blur-md py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#d4af37]/60 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0 bg-white">
              <img src={logoImg} alt="What Shells Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-[#173847] group-hover:text-[#2a596f] transition-colors leading-none">
                whatshells
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#8c7b67] uppercase font-semibold">
                Handcrafted Studio
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4a5568]">
            <a href="#collection" className="hover:text-[#173847] transition-colors">
              Collection
            </a>
            <a href="#how-it-works" className="hover:text-[#173847] transition-colors">
              How WhatsApp Orders Work
            </a>
            <a href="#about" className="hover:text-[#173847] transition-colors">
              Our Story
            </a>
            <a href="#reviews" className="hover:text-[#173847] transition-colors">
              Reviews
            </a>
            <a href="#faq" className="hover:text-[#173847] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Shopping Bag Button with Counter */}
            <button
              onClick={onOpenCart}
              className={`relative flex items-center gap-2.5 text-xs font-bold px-4 py-2.5 text-[#173847] bg-[#FAF7F2] hover:bg-[#ebdcc9] rounded-full transition-all border border-[#e2d5c3] shadow-xs hover:shadow-md active:scale-95 ${
                isPulsing ? 'scale-105 border-[#173847] ring-2 ring-[#173847]/20 shadow-md' : ''
              }`}
              title="View Shopping Bag"
            >
              <FaBagShopping className={`text-sm text-[#8c6b43] transition-transform ${isPulsing ? 'scale-110 rotate-[-6deg]' : ''}`} />
              <span>Shopping Bag</span>
              {cartCount > 0 && (
                <span className={`inline-flex items-center justify-center bg-[#173847] text-white text-[11px] font-bold w-5 h-5 rounded-full shadow-xs transition-transform ${
                  isPulsing ? 'scale-125 bg-emerald-700' : ''
                }`}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Hamburger & Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Bag Button */}
            <button
              onClick={onOpenCart}
              className={`relative p-2 text-[#173847] bg-[#ebdcc9]/50 rounded-full border border-[#d8cdba] transition-all ${
                isPulsing ? 'scale-110 border-[#173847] ring-2 ring-[#173847]/20' : ''
              }`}
              title="View Bag"
            >
              <FaBagShopping className="text-base" />
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 bg-[#173847] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-transform ${
                  isPulsing ? 'scale-125 bg-emerald-700' : ''
                }`}>
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#173847] hover:bg-[#ebdcc9]/50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaXmark className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#e2d5c3] px-5 py-5 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3 text-base font-medium text-[#2d3748]">
              <a 
                href="#collection" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#173847]"
              >
                Explore Collection
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#173847]"
              >
                How WhatsApp Orders Work
              </a>
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#173847]"
              >
                Our Story & Craftsmanship
              </a>
              <a 
                href="#reviews" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#173847]"
              >
                Customer Love
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#173847]"
              >
                FAQ & Shipping
              </a>
            </nav>

            <div className="pt-3 border-t border-[#e2d5c3] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 text-[#173847] bg-[#ebdcc9] rounded-xl border border-[#d8cdba] shadow-xs"
              >
                <FaBagShopping className="text-[#8c6b43]" />
                <span>View Shopping Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
