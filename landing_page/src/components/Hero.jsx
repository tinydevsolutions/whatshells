import React, { useState } from 'react';
import { FaWhatsapp, FaInstagram, FaShieldHalved, FaLeaf, FaArrowRight, FaWandMagicSparkles, FaBagShopping, FaCheck } from 'react-icons/fa6';
import { STORE_PHONE, INSTAGRAM_HANDLE, INSTAGRAM_URL, products } from '../data/products';

export default function Hero({ onSelectProduct, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);
  const featuredProduct = products[0]; // Seashell Mirror

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#fbf9f5] via-[#faf5ec] to-[#f5eee3]">
      {/* Subtle coastal ambient background circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#ebd7be]/30 to-[#99c2cc]/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#f0deb9]/30 rounded-full blur-2xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Instagram Verified Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#e2d5c3] shadow-xs backdrop-blur-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-[#173847] flex items-center gap-1.5">
                <FaInstagram className="text-pink-600" />
                Featured Instagram Brand: <strong>{INSTAGRAM_HANDLE}</strong>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#173847] font-bold tracking-tight leading-[1.15]">
              Handcrafted Seashell Art <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#8c6b43] bg-gradient-to-r from-[#8c6b43] to-[#b38e5d] bg-clip-text text-transparent">
                For Oceanic Elegance
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#556370] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-body-text">
              Transform your sanctuary with one-of-a-kind statement seashell mirrors, artisan conch candles, and 24k gold-edged pearl oyster trays. Handcrafted sustainably along coastal shores and delivered directly to your doorstep.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#collection"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#173847] hover:bg-[#20495c] text-white font-medium text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98"
              >
                <span>Explore Artisanal Collection</span>
                <FaArrowRight className="text-xs" />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#e8ddcd] max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xl font-bold text-[#173847] font-serif-luxury">100%</span>
                <span className="text-[11px] text-[#718096] font-medium leading-tight">Ethically Sourced Natural Shells</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xl font-bold text-[#173847] font-serif-luxury">4.9 ★</span>
                <span className="text-[11px] text-[#718096] font-medium leading-tight">From 450+ Happy Homes</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xl font-bold text-[#173847] font-serif-luxury">Fast & Safe</span>
                <span className="text-[11px] text-[#718096] font-medium leading-tight">Zero-Breakage Guarantee</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Product Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Background Aesthetic Card Frame */}
            <div className="relative w-full max-w-md bg-white rounded-3xl p-4 shadow-xl border border-[#ebdcc9] transition-transform hover:scale-[1.01]">
              
              {/* Product Badge */}
              <div className="absolute top-7 left-7 z-10 bg-[#173847] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <FaWandMagicSparkles className="text-yellow-400 text-xs" />
                <span>Instagram Signature</span>
              </div>

              {/* Main Product Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#faf5ec] group">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Quick Price Tag */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-white/60">
                  <div className="text-[10px] text-[#718096] font-medium">Boutique Price</div>
                  <div className="text-sm font-bold text-[#173847]">₹{featuredProduct.price} <span className="text-[11px] line-through text-gray-400 font-normal">₹{featuredProduct.originalPrice}</span></div>
                </div>
              </div>

              {/* Product Info Bar */}
              <div className="mt-4 px-2 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury text-lg font-bold text-[#173847]">
                    {featuredProduct.name}
                  </h3>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                    In Stock
                  </span>
                </div>
                
                <p className="text-xs text-[#6b7280] line-clamp-2">
                  {featuredProduct.shortDescription}
                </p>

                {/* Instant Action Row */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onAddToCart) {
                        onAddToCart(featuredProduct, 1);
                        setIsAdded(true);
                        setTimeout(() => setIsAdded(false), 1400);
                      }
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 ${
                      isAdded
                        ? 'bg-emerald-600 text-white scale-[1.02]'
                        : 'bg-[#173847] hover:bg-[#2a596f] text-white'
                    }`}
                    title="Add featured mirror to shopping bag"
                  >
                    {isAdded ? (
                      <>
                        <FaCheck className="text-xs text-white animate-in zoom-in-50 duration-200" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <FaBagShopping className="text-xs text-[#d4af37]" />
                        <span>+ Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSelectProduct(featuredProduct)}
                    className="flex-1 py-2.5 px-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#eee4d5] text-[#173847] text-xs font-semibold border border-[#d8cdba] transition-colors"
                  >
                    Details
                  </button>

                  <a
                    href={`https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(`Hi Whatshells! 🐚 I want to buy the *${featuredProduct.name}* (₹${featuredProduct.price}). Could you confirm availability?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <FaWhatsapp className="text-sm" />
                    <span>Buy 1-Click</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
