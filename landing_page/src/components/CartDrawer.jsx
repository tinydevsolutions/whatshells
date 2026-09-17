import React, { useState } from 'react';
import { 
  FaXmark, 
  FaTrashCan, 
  FaPlus, 
  FaMinus, 
  FaBagShopping, 
  FaWhatsapp, 
  FaRobot, 
  FaTruckFast, 
  FaShieldHeart, 
  FaArrowRight 
} from 'react-icons/fa6';
import { generateWhatsAppCartLink } from '../data/products';
import logoImg from '../assets/logo.jpg';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOpenSimulator
}) {
  const [customNote, setCustomNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!isOpen) return null;

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * (item.quantity || 1)), 0);
  const whatsappUrl = generateWhatsAppCartLink(cart, customNote);

  const handleCheckoutSimulator = () => {
    onClose();
    if (onOpenSimulator) {
      onOpenSimulator(cart);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden overscroll-contain">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-md bg-[#FAF7F2] text-[#1c2833] shadow-2xl flex flex-col border-l border-[#e2d5c3] animate-in slide-in-from-right duration-300 pointer-events-auto"
        >
          
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-[#173847] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg">
                🛍️
              </div>
              <div>
                <h2 className="font-serif-luxury text-lg font-bold tracking-wide">
                  Your Seashell Bag
                </h2>
                <p className="text-xs text-[#a2c2d2]">
                  {totalItems === 0 ? '0 items' : `${totalItems} handcrafted ${totalItems === 1 ? 'item' : 'items'}`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
              aria-label="Close cart"
            >
              <FaXmark className="text-lg" />
            </button>
          </div>

          {/* Free Shipping Banner */}
          <div className="bg-[#e6f7f2] border-b border-[#a8e5d3] px-6 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-[#0b5c4f]">
            <FaTruckFast className="text-sm text-[#25D366]" />
            <span>You qualify for <strong>Free Express Shipping</strong> today! 🚚✨</span>
          </div>

          {/* Main Cart Body */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#d4af37]/60 flex items-center justify-center shadow-md bg-white">
                  <img src={logoImg} alt="What Shells" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif-luxury text-xl font-bold text-[#173847]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#64748b] max-w-xs">
                    Explore our collection of handcrafted shell mirrors, scented conch candles, and pearl dishes.
                  </p>
                </div>
                <a
                  href="#collection"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173847] hover:bg-[#2a596f] text-white text-xs font-bold rounded-full shadow-sm transition-all"
                >
                  <span>Explore Collection</span>
                  <FaArrowRight className="text-xs" />
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const p = item.product;
                  const qty = item.quantity || 1;
                  const itemTotal = p.price * qty;

                  return (
                    <div 
                      key={p.id}
                      className="bg-white rounded-2xl p-4 border border-[#e8ddcd] shadow-xs flex gap-3.5 relative group hover:border-[#d4af37]/60 transition-colors"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#faf5ec] flex-shrink-0 border border-[#f0e6d8]">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif-luxury text-sm font-bold text-[#173847] truncate">
                              {p.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(p.id)}
                              className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                              title="Remove item"
                            >
                              <FaTrashCan className="text-xs" />
                            </button>
                          </div>
                          <span className="text-[10px] font-mono text-[#8c7b67] bg-[#FAF7F2] px-1.5 py-0.5 rounded">
                            {p.sku}
                          </span>
                        </div>

                        {/* Quantity Stepper & Price */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-[#e2d5c3] rounded-lg bg-[#FAF7F2] overflow-hidden">
                            <button
                              onClick={() => onUpdateQty(p.id, Math.max(1, qty - 1))}
                              className="px-2.5 py-1 text-xs text-[#173847] hover:bg-[#ebdcc9] transition-colors"
                              disabled={qty <= 1}
                              title="Decrease quantity"
                            >
                              <FaMinus className="text-[9px]" />
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-[#173847] min-w-[28px] text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => onUpdateQty(p.id, qty + 1)}
                              className="px-2.5 py-1 text-xs text-[#173847] hover:bg-[#ebdcc9] transition-colors"
                              title="Increase quantity"
                            >
                              <FaPlus className="text-[9px]" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-[#173847]">₹{itemTotal}</span>
                            {qty > 1 && (
                              <p className="text-[10px] text-gray-400 font-normal">₹{p.price} each</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Custom Gift Note / Instructions Toggle */}
                <div className="pt-2">
                  {!showNoteInput ? (
                    <button
                      onClick={() => setShowNoteInput(true)}
                      className="text-xs text-[#8c6b43] hover:text-[#173847] font-semibold underline underline-offset-2 flex items-center gap-1"
                    >
                      <span>+ Add custom gift message or packing note</span>
                    </button>
                  ) : (
                    <div className="bg-white rounded-2xl p-3 border border-[#e2d5c3] space-y-1.5">
                      <label className="text-[11px] font-bold text-[#173847] block">
                        📝 Custom Gift Message / Request:
                      </label>
                      <textarea
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        placeholder="e.g. Please wrap in gift paper with a birthday note for Priya..."
                        rows={2}
                        className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#e2d5c3] rounded-xl focus:outline-none focus:border-[#173847] text-[#173847]"
                      />
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Drawer Footer / Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#e2d5c3] shadow-lg space-y-4">
              
              {/* Price Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#64748b]">
                  <span>Items Subtotal ({totalItems} pcs):</span>
                  <span className="font-semibold text-[#173847]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#64748b]">
                  <span>Express Insured Shipping:</span>
                  <span className="font-bold text-emerald-600 uppercase">FREE</span>
                </div>
                <div className="pt-2 border-t border-[#f0e6d8] flex justify-between items-baseline">
                  <span className="font-serif-luxury text-sm font-bold text-[#173847]">Total Amount:</span>
                  <span className="text-xl font-bold text-[#173847]">₹{subtotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                {/* Primary Buy All via WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98"
                >
                  <FaWhatsapp className="text-xl" />
                  <span>Order {totalItems} {totalItems === 1 ? 'Item' : 'Items'} via WhatsApp</span>
                </a>
              </div>

              {/* Guarantees & Clear */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-[#8c7b67]">
                <div className="flex items-center gap-1">
                  <FaShieldHeart className="text-[#25D366]" />
                  <span>100% Authentic Seashells</span>
                </div>
                <button
                  onClick={onClearCart}
                  className="hover:text-red-500 underline transition-colors"
                >
                  Clear Bag
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
