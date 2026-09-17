import { products, getProductById, generateWhatsAppEnquiryLink } from '../data/products.js';
import { config } from '../config/config.js';

export const getAllProducts = (req, res) => {
  try {
    const { category, search } = req.query;
    let list = [...products];

    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }

    const enhancedProducts = list.map(p => ({
      ...p,
      whatsappEnquiryUrl: generateWhatsAppEnquiryLink(p, 1, '', config.whatsappPhone)
    }));

    return res.json({
      success: true,
      count: enhancedProducts.length,
      products: enhancedProducts
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getProductDetails = (req, res) => {
  try {
    const { id } = req.params;
    const product = getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const { qty = 1, note = '' } = req.query;
    return res.json({
      success: true,
      product: {
        ...product,
        whatsappEnquiryUrl: generateWhatsAppEnquiryLink(product, Number(qty) || 1, note, config.whatsappPhone)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
