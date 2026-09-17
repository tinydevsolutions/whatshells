import React from 'react';
import { FaStar, FaQuoteLeft, FaInstagram, FaCircleCheck } from 'react-icons/fa6';
import { INSTAGRAM_HANDLE } from '../data/products';

export default function CustomerReviews() {
  const reviews = [
    {
      id: 1,
      name: 'Riya Kulkarni',
      location: 'Bandra, Mumbai',
      handle: '@riya_interiors',
      product: 'Artisanal Seashell Vanity Mirror',
      rating: 5,
      date: 'Ordered via WhatsApp 2 days ago',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      comment: 'I ordered the seashell mirror directly on WhatsApp. The bot was so fast, took my address and sent a payment link right away. The mirror arrived safely in an eco wooden crate. Absolutely breathtaking quality in person!'
    },
    {
      id: 2,
      name: 'Meera Nair',
      location: 'Kochi, Kerala',
      handle: '@meeranair_art',
      product: 'Handcrafted Coastal Shell Picture Frame',
      rating: 5,
      date: 'Ordered via WhatsApp 1 week ago',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      comment: 'The shell picture frame arrived beautifully wrapped! The mini conches and sea glass details look incredible on my bedside desk. Exceptional craftsmanship.'
    },
    {
      id: 3,
      name: 'Tanya Sengupta',
      location: 'Bangalore, Karnataka',
      handle: '@tanya_aesthetic',
      product: 'Velvet-Lined Seashell Keepsake Trinket Box',
      rating: 5,
      date: 'Ordered via WhatsApp 3 days ago',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      comment: 'Got 3 of these trinket boxes as bridesmaid gifts. The shell mosaic and velvet lining are top-tier luxury. Ordering multiple pieces on WhatsApp was completely effortless.'
    }
  ];

  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#fbf9f5] border-t border-[#ebdcc9] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#8c6b43] uppercase bg-[#f4ebe1] px-3.5 py-1.5 rounded-full">
            <FaStar className="text-amber-500" />
            Loved By Coastal Homes
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#173847] font-bold">
            Real Stories From Our Community
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b]">
            Over 450+ handcrafted seashell pieces delivered safely across India. Here is what our Instagram collectors say.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-7 border border-[#ebdcc9] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                
                {/* Rating & Quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    {[...Array(rev.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <FaQuoteLeft className="text-[#8c6b43]/20 text-xl" />
                </div>

                {/* Review text */}
                <p className="text-xs sm:text-sm text-[#4a5568] leading-relaxed font-body-text italic">
                  "{rev.comment}"
                </p>

                {/* Product Purchased Tag */}
                <div className="text-[11px] font-semibold text-[#8c6b43] bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#e8ddcd] inline-block">
                  Item: {rev.product}
                </div>

              </div>

              {/* Author Row */}
              <div className="pt-4 border-t border-[#f0e6d8] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#ebdcc9]"
                  />
                  <div>
                    <div className="font-serif-luxury text-sm font-bold text-[#173847] flex items-center gap-1">
                      <span>{rev.name}</span>
                      <FaCircleCheck className="text-emerald-500 text-[10px]" title="Verified Buyer" />
                    </div>
                    <div className="text-[10px] text-gray-400">{rev.location} • {rev.handle}</div>
                  </div>
                </div>

                <FaInstagram className="text-pink-600 text-base" />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
