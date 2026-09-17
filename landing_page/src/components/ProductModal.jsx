import React, { useState } from 'react';
import { FaWhatsapp, FaXmark, FaStar, FaPlus, FaMinus, FaCheck, FaShieldHeart, FaTruckFast, FaBagShopping } from 'react-icons/fa6';
import { generateWhatsAppLink, STORE_PHONE } from '../data/products';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const totalPrice = product.price * quantity;
  const whatsappUrl = generateWhatsAppLink(product, quantity, customNote, STORE_PHONE);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      
      {/* Modal Container */}
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#ebdcc9] my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[#173847] hover:bg-[#FAF7F2] flex items-center justify-center shadow-md transition-colors"
          aria-label="Close modal"
        >
          <FaXmark className="text-base" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto overscroll-contain">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 bg-[#FAF7F2] p-6 flex flex-col justify-between">
            {/* Main Preview Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-inner mb-4 relative">
              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-[#173847] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx ? 'border-[#173847] scale-105 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Key Assurance Highlights */}
            <div className="mt-6 pt-4 border-t border-[#ebdcc9] grid grid-cols-2 gap-2 text-xs text-[#556370]">
              <div className="flex items-center gap-2">
                <FaShieldHeart className="text-rose-500 flex-shrink-0" />
                <span>Zero-breakage packing</span>
              </div>
              <div className="flex items-center gap-2">
                <FaTruckFast className="text-emerald-600 flex-shrink-0" />
                <span>Free Express Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & WhatsApp Actions */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Category & Ratings */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8c6b43]">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <FaStar />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title & SKU */}
              <div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#173847] leading-tight">
                  {product.name}
                </h2>
                <div className="text-xs font-mono text-gray-400 mt-1">
                  SKU: {product.sku} • {product.stockStatus}
                </div>
              </div>

              {/* Price Calculation Display */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#ebdcc9] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#718096]">Price per piece</div>
                  <div className="text-xl font-bold text-[#173847]">
                    ₹{product.price}{' '}
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through font-normal">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-[#718096]">Subtotal ({quantity} {quantity > 1 ? 'items' : 'item'})</div>
                  <div className="text-2xl font-extrabold text-[#173847]">₹{totalPrice}</div>
                </div>
              </div>

              {/* Full Description */}
              <p className="text-xs sm:text-sm text-[#4a5568] leading-relaxed font-body-text">
                {product.description}
              </p>

              {/* Specifications */}
              <div className="space-y-1.5 text-xs text-[#2d3748] bg-white p-3 rounded-xl border border-gray-100">
                <div><strong>Dimensions:</strong> {product.dimensions}</div>
                <div><strong>Materials:</strong> {product.material}</div>
              </div>

              {/* Features bullets */}
              {product.features && (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-[#173847]">Craftsmanship Highlights:</div>
                  <ul className="space-y-1">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-[#556370] flex items-start gap-2">
                        <FaCheck className="text-emerald-500 text-[10px] mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Picker & Custom Notes */}
              <div className="pt-2 border-t border-[#f0e6d8] space-y-3">
                
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#173847]">Quantity:</label>
                  <div className="flex items-center border border-[#d8cdba] rounded-full overflow-hidden bg-[#FAF7F2]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 hover:bg-[#e4d6c3] transition-colors text-xs text-[#173847]"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus className="text-[10px]" />
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-[#173847] min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 hover:bg-[#e4d6c3] transition-colors text-xs text-[#173847]"
                      aria-label="Increase quantity"
                    >
                      <FaPlus className="text-[10px]" />
                    </button>
                  </div>
                </div>

                {/* Custom Note Input */}
                <div>
                  <label className="text-xs font-bold text-[#173847] block mb-1">
                    Personalization or Gift Note (Optional):
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Include a handwritten gift card for Anita..."
                    className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#e2d5c3] rounded-xl text-[#173847] focus:outline-none focus:border-[#173847]"
                  />
                </div>

              </div>

              {/* WhatsApp Message Preview Bubble */}
              <div className="bg-[#e7f7ea] border border-[#a8e5d3] p-3 rounded-xl text-[11px] text-[#13503f] space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs text-[#075e54]">
                  <FaWhatsapp className="text-emerald-600" />
                  Pre-filled WhatsApp message ready:
                </div>
                <div className="italic font-mono text-[10px] text-gray-700 bg-white/70 p-2 rounded-lg leading-relaxed whitespace-pre-line">
                  {`Hi Whatshells! 🐚✨\nI want to buy: *${product.name}* (SKU: ${product.sku})\nQuantity: ${quantity} | Total: ₹${totalPrice}${customNote ? `\nCustom Note: "${customNote}"` : ''}\nCould you please confirm availability and guide me through the address & payment details?`}
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              {/* Dual Action: Add to Bag & Direct WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    if (onAddToCart) {
                      setIsAdded(true);
                      onAddToCart(product, quantity, customNote);
                      setTimeout(() => {
                        onClose();
                      }, 400);
                    }
                  }}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 ${
                    isAdded
                      ? 'bg-emerald-600 text-white scale-[1.02]'
                      : 'bg-[#173847] hover:bg-[#2a596f] text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <FaCheck className="text-base text-white animate-in zoom-in-50 duration-200" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <FaBagShopping className="text-base text-[#d4af37]" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-98"
                >
                  <FaWhatsapp className="text-lg" />
                  <span>Buy via WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
