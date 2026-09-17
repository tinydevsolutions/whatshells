import React from 'react';
import { FaInstagram, FaHeart, FaComment, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../data/products';
import imgMirror from '../assets/products/images.jpeg';
import imgCollage from '../assets/products/images (1).jpeg';
import imgFrame from '../assets/products/images (2).jpeg';
import imgWreath from '../assets/products/images (3).jpeg';
import imgTrinketBox from '../assets/products/images (4).jpeg';
import imgNecklace from '../assets/products/images (5).jpeg';

export default function InstagramFeed() {
  const posts = [
    {
      id: 1,
      image: imgMirror,
      caption: 'Fresh batch of our Artisanal Vanity Mirrors just got polished and packed in eco-pine boxes! 🐚🪞 Which room would you place this in?',
      likes: '2.4k',
      comments: '184',
    },
    {
      id: 2,
      image: imgCollage,
      caption: 'Golden hour coastal glow across our handcrafted shell decor collection 🌅✨ Hand-assembled with love.',
      likes: '3.8k',
      comments: '215',
    },
    {
      id: 3,
      image: imgFrame,
      caption: 'Every shell frame is hand-encrusted with authentic shoreline shells and frosted sea glass accents 🐚🖼️',
      likes: '3.1k',
      comments: '240',
    },
    {
      id: 4,
      image: imgWreath,
      caption: 'Real sun-dried sugar starfish and scallop clusters on natural grapevine base. Front door oceanic elegance 🌊🌿',
      likes: '4.2k',
      comments: '310',
    },
    {
      id: 5,
      image: imgTrinketBox,
      caption: 'Velvet-lined shell mosaic keepsake box. The most beloved home for rings, pearls, and heirloom jewelry 💍✨',
      likes: '1.9k',
      comments: '112',
    },
    {
      id: 6,
      image: imgNecklace,
      caption: '18K gold plated seashell charm necklace with natural mini cowrie and freshwater pearl 🐚💛',
      likes: '2.9k',
      comments: '198',
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Instagram Follow Button */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#d62976] uppercase bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
              <FaInstagram />
              As Seen On Instagram
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#173847] font-bold">
              Follow Our Shoreline Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Tag <strong>{INSTAGRAM_HANDLE}</strong> or #whatshellshome in your unboxing stories to get featured!
            </p>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            <FaInstagram className="text-base" />
            <span>Follow {INSTAGRAM_HANDLE}</span>
            <FaArrowUpRightFromSquare className="text-xs" />
          </a>
        </div>

        {/* 6-Item Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-200 block shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Hover Dark Overlay with Stats */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                <div className="flex justify-end">
                  <FaInstagram className="text-sm opacity-80" />
                </div>

                <div className="text-[10px] line-clamp-3 leading-snug text-slate-200">
                  {post.caption}
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold pt-1 border-t border-white/20">
                  <div className="flex items-center gap-1">
                    <FaHeart className="text-pink-500 text-xs" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaComment className="text-blue-300 text-xs" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
