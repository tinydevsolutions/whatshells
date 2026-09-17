import React from 'react';
import { FaLeaf, FaGem, FaHandHoldingHeart, FaBoxArchive } from 'react-icons/fa6';
import imgCraft from '../assets/products/images (1).jpeg';

export default function AboutCraft() {
  const pillars = [
    {
      icon: <FaLeaf className="text-emerald-600 text-xl" />,
      title: 'Ethically Foraged Shells',
      desc: 'We never harvest living shells. All our shells are naturally washed ashore, collected by coastal communities and cleaned with organic saline wash.'
    },
    {
      icon: <FaHandHoldingHeart className="text-[#8c6b43] text-xl" />,
      title: 'Artisan Crafted by Hand',
      desc: 'Every single mirror border, candle shell, and jewelry tray is individually arranged, glued, and gilded by skilled craftspeople in Goa and Kerala.'
    },
    {
      icon: <FaGem className="text-amber-500 text-xl" />,
      title: '24K Gold & Pearl Accents',
      desc: 'We highlight the natural iridescence of nacre and oyster shells with authentic 24k gold leaf foil and cultured freshwater pearls.'
    },
    {
      icon: <FaBoxArchive className="text-[#173847] text-xl" />,
      title: 'Zero-Breakage Packaging',
      desc: 'All mirrors and fragile shells travel in shock-absorbing honeycomb eco-cushioning and reinforced crates with 100% transit insurance.'
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white border-t border-[#ebdcc9] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Storytelling */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#ebdcc9] aspect-[4/5] bg-[#faf5ec]">
              <img
                src={imgCraft}
                alt="Crafting Whatshells seashell art"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173847]/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase tracking-widest text-[#ebd7be] font-bold">Studio Philosophy</span>
                <h3 className="font-serif-luxury text-2xl font-bold">Honoring the Spirit of the Sea</h3>
                <p className="text-xs text-slate-200 mt-1">Born on the coastlines of India, bringing timeless oceanic serenity into your everyday spaces.</p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#FAF7F2] border border-[#ebdcc9] p-4 rounded-2xl shadow-xl hidden sm:block">
              <div className="text-2xl font-bold text-[#173847] font-serif-luxury">100%</div>
              <div className="text-[11px] text-[#718096] font-medium">Eco-Friendly & Sustainable</div>
            </div>
          </div>

          {/* Right Column: Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest text-[#8c6b43] uppercase bg-[#f4ebe1] px-3.5 py-1.5 rounded-full">
                Our Craft & Promise
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#173847] font-bold leading-tight">
                Slow Crafted, Naturally Unique, Timelessly Aesthetic.
              </h2>
              <p className="text-sm sm:text-base text-[#556370] font-body-text leading-relaxed">
                Whatshells started as an Instagram art project celebrating marine textures and raw shoreline beauty. No two natural shells are ever identical, meaning every vanity mirror or trinket tray you own is truly one-of-a-kind.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {pillars.map((p, idx) => (
                <div key={idx} className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#ebdcc9] space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#ebdcc9] flex items-center justify-center shadow-2xs">
                    {p.icon}
                  </div>
                  <h4 className="font-serif-luxury text-base font-bold text-[#173847]">
                    {p.title}
                  </h4>
                  <p className="text-xs text-[#64748b] leading-relaxed font-body-text">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
