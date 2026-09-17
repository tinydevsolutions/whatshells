import imgMirror from '../assets/products/images.jpeg';
import imgCollage from '../assets/products/images (1).jpeg';
import imgFrame from '../assets/products/images (2).jpeg';
import imgWreath from '../assets/products/images (3).jpeg';
import imgTrinketBox from '../assets/products/images (4).jpeg';
import imgNecklace from '../assets/products/images (5).jpeg';
import imgWallHanging from '../assets/products/images (6).jpeg';
import imgVase from '../assets/products/images (7).jpeg';

export const STORE_PHONE = '15556559552';
export const INSTAGRAM_HANDLE = '@whatshells';
export const INSTAGRAM_URL = 'https://instagram.com/whatshells';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const products = [
  {
    id: 'ws-mr-01',
    sku: 'WS-MR-01',
    name: 'Artisanal Seashell Vanity Mirror',
    category: 'mirrors',
    categoryName: 'Seashell Mirrors',
    price: 2499,
    originalPrice: 3299,
    discount: '24% OFF',
    rating: 4.9,
    reviewsCount: 128,
    badge: 'Bestseller',
    shortDescription: 'Handcrafted circular vanity mirror framed with iridescent cowries, scallop, and murex shells.',
    description: 'Transform your bedroom vanity or foyer with our signature Whatshells statement piece. Meticulously handcrafted by coastal artisans, each mirror is individually bordered with hand-selected, polished natural seashells, reflecting soft oceanic elegance.',
    dimensions: '14" Diameter (Mirror 9.5" + 4.5" shell border)',
    material: 'Natural Shells, HD Silver Glass Mirror, Engineered Pine Backing',
    stockStatus: 'In Stock (Limited Batch)',
    image: imgMirror,
    gallery: [imgMirror, imgCollage, imgWreath],
    features: [
      '100% sustainably collected natural seashells',
      'Reinforced velvet-lined back with sturdy brass hanging hook',
      'Packaged in zero-plastic shatter-safe eco wooden crate',
      'Includes microfibre cleaning cloth & care guide'
    ]
  },
  {
    id: 'ws-pf-02',
    sku: 'WS-PF-02',
    name: 'Handcrafted Coastal Shell Picture Frame',
    category: 'decor',
    categoryName: 'Coastal Decor',
    price: 1299,
    originalPrice: 1699,
    discount: '23% OFF',
    rating: 4.8,
    reviewsCount: 94,
    badge: 'Trending',
    shortDescription: 'Artisanal wooden photo frame encrusted with miniature spiral conches and mother-of-pearl.',
    description: 'Preserve your treasured ocean memories in authentic coastal beauty. Every frame is hand-layered with natural beach shells, sea glass accents, and a protective UV glass front.',
    dimensions: '8" x 10" (Fits 5" x 7" Photo)',
    material: 'Natural Seashells, Solid Teakwood Backing, HD Float Glass',
    stockStatus: 'In Stock',
    image: imgFrame,
    gallery: [imgFrame, imgCollage],
    features: [
      'Hand-selected natural shells with pearl shimmer',
      'Versatile tabletop easel stand & wall mount hook',
      'Triple-coated moisture resistant protective glaze',
      'Gift boxed in sustainable recycled kraft packaging'
    ]
  },
  {
    id: 'ws-wr-03',
    sku: 'WS-WR-03',
    name: 'Natural Starfish & Seashell Ocean Wreath',
    category: 'wall-art',
    categoryName: 'Wall Decor',
    price: 1899,
    originalPrice: 2499,
    discount: '24% OFF',
    rating: 5.0,
    reviewsCount: 156,
    badge: 'Customer Favorite',
    shortDescription: 'Showstopper entryway wreath adorned with natural white starfish, sugar shells, and dried sea grass.',
    description: 'Greet your guests with the breezy serenity of the sea. Meticulously hand-bound on a natural grapevine base, crowned with sun-dried starfish and shimmering white scallop shells.',
    dimensions: '16" Diameter',
    material: 'Natural Sugar Starfish, White Scallop Shells, Natural Grapevine Wreath Base',
    stockStatus: 'In Stock',
    image: imgWreath,
    gallery: [imgWreath, imgWallHanging, imgCollage],
    features: [
      'Real sun-dried sugar starfish and scallop clusters',
      'Sturdy woven grapevine wreath base with hanging loop',
      'Lightweight and suitable for indoor or covered patio display',
      'Sealed with protective matte finish for long-lasting durability'
    ]
  },
  {
    id: 'ws-tb-04',
    sku: 'WS-TB-04',
    name: 'Velvet-Lined Seashell Keepsake Trinket Box',
    category: 'dishes',
    categoryName: 'Trinket Boxes',
    price: 899,
    originalPrice: 1199,
    discount: '25% OFF',
    rating: 4.9,
    reviewsCount: 82,
    badge: 'Limited Edition',
    shortDescription: 'Handmade keepsake jewelry box encrusted with mosaic shells and soft velvet interior.',
    description: 'The perfect sanctuary for rings, heirlooms, and precious trinkets. Hand-encrusted with intricate seashell mosaic patterns on all sides with a luxurious velvet-cushioned interior.',
    dimensions: '5" x 4" x 3.5"',
    material: 'Natural Sea Shells, Handcrafted Pine Base, Royal Blue Velvet Lining',
    stockStatus: 'In Stock',
    image: imgTrinketBox,
    gallery: [imgTrinketBox, imgCollage],
    features: [
      'Intricate hand-placed shell mosaic lid and perimeter',
      'Plush velvet-lined interior prevents jewelry scratches',
      'Magnetic lid closure keeps keepsakes safe',
      'Ideal for bridal vanity table and engagement ring presentation'
    ]
  },
  {
    id: 'ws-nk-05',
    sku: 'WS-NK-05',
    name: '18K Gold Plated Seashell Charm Necklace',
    category: 'jewelry',
    categoryName: 'Ocean Jewelry',
    price: 699,
    originalPrice: 999,
    discount: '30% OFF',
    rating: 4.8,
    reviewsCount: 118,
    badge: 'Popular',
    shortDescription: 'Delicate 18K gold-plated pendant necklace with natural miniature cowrie shell and freshwater pearl.',
    description: 'Carry the calm ocean energy everywhere you go. Featuring a natural mini cowrie shell pendant dipped in 18K gold plating on an anti-tarnish stainless steel chain.',
    dimensions: '18" Chain Length + 2" Extender',
    material: '18K Gold Plated Stainless Steel, Natural Mini Cowrie, Freshwater Pearl',
    stockStatus: 'In Stock',
    image: imgNecklace,
    gallery: [imgNecklace],
    features: [
      'Hypoallergenic & nickel-free 18K gold plating',
      'Anti-tarnish water-resistant chain',
      'Features real natural mini cowrie charm',
      'Comes in branded Whatshells velvet jewelry pouch'
    ]
  },
  {
    id: 'ws-wh-06',
    sku: 'WS-WH-06',
    name: 'Bohemian Macramé Seashell Wall Tapestry',
    category: 'wall-art',
    categoryName: 'Wall Decor',
    price: 1599,
    originalPrice: 2199,
    discount: '27% OFF',
    rating: 4.7,
    reviewsCount: 67,
    badge: 'Handmade',
    shortDescription: 'Handwoven natural cotton macramé tapestry with polished cowrie shells on coastal driftwood.',
    description: 'Infuse your living room, hallway, or bedroom with beach bohemian charm. Featuring sustainably gathered coastal driftwood, intricate bohemian knotwork, and cascading natural cowrie shells.',
    dimensions: '16" Width x 28" Total Length',
    material: 'Natural Bleached Cowrie Shells, 100% Unbleached Cotton Rope, Coastal Driftwood',
    stockStatus: 'In Stock',
    image: imgWallHanging,
    gallery: [imgWallHanging, imgWreath, imgCollage],
    features: [
      'Authentic reclaimed coastal driftwood rod',
      'Over 40 hand-selected symmetrical cowrie shells',
      'Reinforced braided cotton hanging loop',
      '100% biodegradable and plastic-free materials'
    ]
  },
  {
    id: 'ws-vs-07',
    sku: 'WS-VS-07',
    name: 'Tiger Cowrie & Sea Glass Ceramic Vase Set',
    category: 'decor',
    categoryName: 'Coastal Decor',
    price: 1199,
    originalPrice: 1599,
    discount: '25% OFF',
    rating: 4.9,
    reviewsCount: 74,
    badge: 'New Arrival',
    shortDescription: 'Matte ceramic bud vase hand-adorned with rare tiger cowrie shells and frosted sea glass.',
    description: 'Bring organic ocean warmth to your coffee table, bookshelf, or dining setup. Designed for dried florals, pampas grass, or as a standalone coastal sculpture.',
    dimensions: '7" Height x 4.5" Base Diameter',
    material: 'Handmade Ceramic, Natural Tiger Cowrie Shells, Frosted Sea Glass',
    stockStatus: 'In Stock',
    image: imgVase,
    gallery: [imgVase, imgCollage],
    features: [
      'Hand-adorned with rare tiger cowrie shells',
      'Waterproof interior glaze for fresh or dried botanicals',
      'Felted bottom pad prevents surface scratching',
      'Carefully cushioned in reinforced eco-crate'
    ]
  }
];

export const generateWhatsAppLink = (product, quantity = 1, customNote = '', phoneNumber = STORE_PHONE) => {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const greeting = `Hi Whatshells! 🐚✨`;
  const productLine = `I want to buy: *${product.name}* (SKU: ${product.sku})`;
  const priceLine = `Quantity: ${quantity} | Total: ₹${product.price * quantity}`;
  const noteLine = customNote ? `Custom Note: "${customNote}"` : '';
  const ctaLine = `Could you please confirm availability and guide me through the address & payment details?`;

  const fullText = [greeting, productLine, priceLine, noteLine, ctaLine]
    .filter(Boolean)
    .join('\n\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullText)}`;
};

export const generateWhatsAppCartLink = (cartItems = [], customNote = '', phoneNumber = STORE_PHONE) => {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const greeting = `Hi Whatshells! 🐚✨\n\nI would like to order the following items from your collection:`;
  
  const itemList = cartItems.map((item, idx) => {
    const p = item.product;
    const qty = item.quantity || 1;
    const itemTotal = p.price * qty;
    return `${idx + 1}. *${p.name}* (${p.sku}) x ${qty} - ₹${itemTotal}`;
  }).join('\n');

  const totalQty = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.price * (item.quantity || 1)), 0);

  const summaryLine = `━━━━━━━━━━━━━━━━━━━━\n📦 *Total:* ${totalQty} item(s) | 💰 *Total Amount:* ₹${totalAmount} (Free Express Shipping Today! 🚚)\n━━━━━━━━━━━━━━━━━━━━`;
  const noteLine = customNote ? `📝 *Custom Note / Gift Message:* "${customNote}"` : '';
  const ctaLine = `Could you please confirm availability and guide me through the address & payment details?`;

  const fullText = [greeting, itemList, summaryLine, noteLine, ctaLine]
    .filter(Boolean)
    .join('\n\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullText)}`;
};

