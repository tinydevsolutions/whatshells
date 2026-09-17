import React, { useState, useMemo } from 'react';
import { FaWhatsapp, FaStar, FaEye, FaMagnifyingGlass, FaFilter, FaWandMagicSparkles, FaBagShopping, FaPlus, FaCheck } from 'react-icons/fa6';
import { products, generateWhatsAppLink } from '../data/products';

export default function ProductCatalog({ onSelectProduct, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [addedId, setAddedId] = useState(null);

  const categories = [
    { id: 'all', name: 'All Pieces' },
    { id: 'mirrors', name: 'Seashell Mirrors' },
    { id: 'decor', name: 'Coastal Decor' },
    { id: 'wall-art', name: 'Wall Decor' },
    { id: 'dishes', name: 'Trinket Boxes' },
    { id: 'jewelry', name: 'Ocean Jewelry' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // Default featured order
      });
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <section id="collection" className="py-16 md:py-24 bg-[#fbf9f5] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#8c6b43] uppercase bg-[#f4ebe1] px-3.5 py-1.5 rounded-full">
            <FaWandMagicSparkles className="text-xs" />
            Curated Artisanal Collection
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#173847] font-bold">
            Handcrafted Seashell Creations
          </h2>
          <p className="text-[#64748b] text-sm sm:text-base font-body-text">
            Each piece is individually assembled using cleaned, authentic natural shells. Click <strong>Buy via WhatsApp</strong> to instantly enquire or order.
          </p>
        </div>

        {/* Filters & Search Bar */}
        <div className="mb-10 space-y-4">
          
          {/* Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#173847] text-white shadow-sm'
                    : 'bg-white text-[#52606d] hover:bg-[#f0e7dc] border border-[#e8ddcd]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search and Sort Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mirrors, candles, dishes..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#e2d5c3] rounded-full focus:outline-none focus:border-[#173847] text-[#173847]"
              />
            </div>

            {/* Product Count & Sort */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 text-xs text-[#64748b]">
              <span>Showing <strong>{filteredProducts.length}</strong> items</span>
              <div className="flex items-center gap-1.5">
                <FaFilter className="text-gray-400 text-xs" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#e2d5c3] rounded-lg px-2.5 py-1 text-xs text-[#173847] focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#ebdcc9] p-8 space-y-3">
            <span className="text-4xl">🐚</span>
            <h3 className="font-serif-luxury text-xl font-bold text-[#173847]">No matching shell pieces found</h3>
            <p className="text-sm text-gray-500">Try searching for different keywords or reset your filters.</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 text-xs font-semibold bg-[#173847] text-white rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product) => {
              const whatsappUrl = generateWhatsAppLink(product, 1);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#ebdcc9] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Product Card Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-[#faf5ec]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {product.badge && (
                        <span className="bg-[#173847] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          {product.badge}
                        </span>
                      )}
                      {product.discount && (
                        <span className="bg-[#e53e3e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          {product.discount}
                        </span>
                      )}
                    </div>

                    {/* Quick View Floating Button */}
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-[#173847] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                      title="Quick View Details"
                    >
                      <FaEye className="text-xs" />
                    </button>

                    {/* SKU tag overlay */}
                    <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                      {product.sku}
                    </div>
                  </div>

                  {/* Product Content Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      
                      {/* Rating and Stock */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <FaStar className="text-xs" />
                          <span>{product.rating}</span>
                          <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                        </div>
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {product.stockStatus}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 
                        onClick={() => onSelectProduct(product)}
                        className="font-serif-luxury text-lg font-bold text-[#173847] hover:text-[#8c6b43] cursor-pointer transition-colors line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-[#6b7280] line-clamp-2 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {/* Dimension snippet */}
                      <div className="text-[11px] text-[#8c7b67] bg-[#FAF7F2] p-1.5 rounded-lg">
                        <strong>Size:</strong> {product.dimensions}
                      </div>

                    </div>

                    {/* Price and Action Buttons */}
                    <div className="pt-2 border-t border-[#f0e6d8] space-y-2.5">
                      
                      {/* Pricing Row */}
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xl font-bold text-[#173847]">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-[11px] text-emerald-600 font-semibold">Free Express Shipping</span>
                      </div>

                      {/* Main Action Buttons: Add to Bag & WhatsApp */}
                      <div className="grid grid-cols-12 gap-2">
                        {/* Add to Bag Button */}
                        <button
                          onClick={() => {
                            if (onAddToCart) {
                              onAddToCart(product, 1);
                              setAddedId(product.id);
                              setTimeout(() => {
                                setAddedId((current) => current === product.id ? null : current);
                              }, 1400);
                            }
                          }}
                          className={`col-span-5 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all shadow-2xs active:scale-95 ${
                            addedId === product.id
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800 scale-[1.02]'
                              : 'bg-[#FAF7F2] hover:bg-[#ebdcc9] text-[#173847] border-[#d8cdba] hover:shadow-xs'
                          }`}
                          title="Add item to shopping bag"
                        >
                          {addedId === product.id ? (
                            <>
                              <FaCheck className="text-xs text-emerald-600 animate-in zoom-in-50 duration-200" />
                              <span className="text-emerald-700">Added!</span>
                            </>
                          ) : (
                            <>
                              <FaBagShopping className="text-xs text-[#8c6b43]" />
                              <span>+ Bag</span>
                            </>
                          )}
                        </button>

                        {/* Primary WhatsApp Order Link Button */}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="col-span-7 flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md active:scale-98"
                          title="Open WhatsApp chat with pre-filled enquiry message"
                        >
                          <FaWhatsapp className="text-sm" />
                          <span>Buy 1-Click</span>
                        </a>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
