import React, { useState, useEffect, useRef } from 'react';
import { FaBagShopping, FaCheck, FaXmark, FaArrowRight } from 'react-icons/fa6';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import WhatsAppFlowExplainer from './components/WhatsAppFlowExplainer';
import AboutCraft from './components/AboutCraft';
import InstagramFeed from './components/InstagramFeed';
import CustomerReviews from './components/CustomerReviews';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import PolicyModal from './components/PolicyModal';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activePolicyTab, setActivePolicyTab] = useState(null);
  const [toast, setToast] = useState({ visible: false, product: null, quantity: 1 });
  const toastTimeoutRef = useRef(null);

  // Load cart from localStorage or start empty
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('whatshells_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('whatshells_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
  }, [cart]);

  // Lock background body and html scroll whenever modal, drawer, or policy is open
  useEffect(() => {
    if (isCartOpen || selectedProduct || activePolicyTab) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isCartOpen, selectedProduct, activePolicyTab]);

  const addToCart = (product, quantity = 1, customNote = '') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          customNote: customNote || updated[existingIndex].customNote,
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity, customNote }];
      }
    });

    // Show non-intrusive luxury toast confirmation
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ visible: true, product, quantity });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, product: null, quantity: 1 });
    }, 4000);
  };

  const updateCartQty = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleOpenProductModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] text-[#1c2833] selection:bg-[#f3dfbf]">
      {/* Sticky Navigation Header */}
      <Navbar 
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero 
          onSelectProduct={handleOpenProductModal}
          onAddToCart={addToCart}
        />

        <ProductCatalog 
          onSelectProduct={handleOpenProductModal}
          onAddToCart={addToCart}
        />

        <WhatsAppFlowExplainer />

        <AboutCraft />

        <InstagramFeed />

        <CustomerReviews />

        <FAQ />
      </main>

      {/* Footer */}
      <Footer onOpenPolicy={(tab) => setActivePolicyTab(tab)} />

      {/* Compliance Policy Modal (Terms, Privacy, Refund, Shipping, Contact) */}
      {activePolicyTab && (
        <PolicyModal 
          initialTab={activePolicyTab}
          onClose={() => setActivePolicyTab(null)}
        />
      )}

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={handleCloseProductModal}
          onAddToCart={addToCart}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />

      {/* Floating Add-to-Bag Toast Notification */}
      {toast.visible && toast.product && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#173847] text-white rounded-2xl p-3.5 shadow-2xl border border-white/15 flex items-center gap-3.5 max-w-sm backdrop-blur-md">
            {/* Product Thumbnail */}
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 border border-white/20">
              <img 
                src={toast.product.image} 
                alt={toast.product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <FaCheck className="text-xs" />
                <span>Added to your bag!</span>
              </div>
              <p className="text-xs font-bold truncate text-white">
                {toast.product.name} {toast.quantity > 1 ? `(x${toast.quantity})` : ''}
              </p>
            </div>

            {/* Action */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  setToast({ visible: false, product: null, quantity: 1 });
                  setIsCartOpen(true);
                }}
                className="px-3 py-1.5 rounded-full bg-[#d4af37] hover:bg-[#c49f27] text-[#173847] text-xs font-bold transition-all shadow-xs flex items-center gap-1"
              >
                <span>View Bag</span>
                <FaArrowRight className="text-[10px]" />
              </button>

              <button
                onClick={() => setToast({ visible: false, product: null, quantity: 1 })}
                className="p-1 text-white/60 hover:text-white transition-colors"
                aria-label="Dismiss notification"
              >
                <FaXmark className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


