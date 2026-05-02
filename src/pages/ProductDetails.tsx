import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowLeft, ShieldCheck, Zap, Truck, Star } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { useCart } from '../hooks/useCart';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCart(state => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products`);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        if (result.success) {
          // Find the specific product since we don't have a single product API endpoint yet
          const found = result.data.find((p: any) => String(p.id) === id);
          setProduct(found || null);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-cobalt border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-black text-cobalt mb-4">PRODUCT NOT FOUND</h2>
        <button onClick={() => navigate('/')} className="text-amber font-bold underline">Go Back Home</button>
      </div>
    );
  }

  const handleWhatsAppOrder = () => {
    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "923000000000";
    const title = product.title || product.name || "Untitled Product";
    const price = formatCurrency(product.discount_price || product.price);
    const message = `Assalam-o-Alaikum, I want to order this product:\n\n*Product:* ${title}\n*Price:* ${price}\n\n*My Address:* `;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
  };

  const itemTitle = product.title || product.name || "Untitled Product";
  const itemImage = product.image || (product.images && product.images[0]) || null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-cobalt mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        BACK TO BROWSE
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square rounded-3xl bg-white border border-gray-100 p-8 shadow-sm flex items-center justify-center overflow-hidden">
            {itemImage ? (
              <img src={itemImage} alt={itemTitle} className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="text-gray-300 italic">No Image Available</div>
            )}
          </div>
          
          {/* Thumbnails Placeholder - Simulating premium experience */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-xl bg-gray-100 border border-gray-200" />
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col h-full"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-cobalt text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Maxify Verified</span>
                {product.compare_at_price && (
                  <span className="bg-amber text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase animate-pulse">On Sale</span>
                )}
                <div className="flex text-amber">
                   <Star className="w-3 h-3 fill-current" />
                   <Star className="w-3 h-3 fill-current" />
                   <Star className="w-3 h-3 fill-current" />
                   <Star className="w-3 h-3 fill-current" />
                   <Star className="w-3 h-3 fill-current" />
                </div>
              </div>
              <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 leading-none">
                {itemTitle}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-cobalt">{formatCurrency(product.discount_price || product.price)}</span>
              {product.compare_at_price ? (
                <span className="text-xl text-gray-300 line-through font-bold">{formatCurrency(product.compare_at_price)}</span>
              ) : product.discount_price && (
                <span className="text-xl text-gray-300 line-through font-bold">{formatCurrency(product.price)}</span>
              )}
              {product.compare_at_price && product.compare_at_price > (product.discount_price || product.price) && (
                <div className="bg-amber/10 text-amber text-xs font-black px-3 py-1 rounded-full">
                  SAVE {Math.round((1 - ((product.discount_price || product.price) / product.compare_at_price)) * 100)}%
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-4 text-sm">
                 <Truck className="w-5 h-5 text-cobalt" />
                 <div>
                    <p className="font-bold text-slate-900 uppercase text-xs tracking-tighter">Fast Delivery</p>
                    <p className="text-slate-500 text-xs">Estimated arrival in 3-5 business days.</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                 <ShieldCheck className="w-5 h-5 text-cobalt" />
                 <div>
                    <p className="font-bold text-slate-900 uppercase text-xs tracking-tighter">Secure Transaction</p>
                    <p className="text-slate-500 text-xs">Your data is encrypted and protected by Maxify Cyber-Shield.</p>
                 </div>
              </div>
            </div>

            <div className="prose prose-sm text-slate-600">
               <h3 className="text-slate-900 font-bold uppercase text-xs tracking-widest mb-2">Description</h3>
               <p className="leading-relaxed">
                 {product.description || "Premium imported product sourced directly from best-selling AliExpress vendors. Rigorously inspected by the Maxify Quality Assurance team to ensure structural integrity and performance benchmarks."}
               </p>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addItem(product)}
                className="flex-1 bg-slate-900 text-white h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-cobalt transition-colors group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Add to Cart
              </button>
              
              <button 
                onClick={handleWhatsAppOrder}
                className="flex-1 bg-[#25D366] text-white h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-green-600 transition-colors"
              >
                <Zap className="w-5 h-5" />
                Order on WhatsApp
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-cobalt">JS</div>
               <div>
                  <p className="text-xs font-black text-slate-900">John Seller</p>
                  <p className="text-[10px] uppercase font-bold text-amber">Top Rated Plus</p>
               </div>
            </div>
            <button className="text-xs font-bold text-cobalt border border-cobalt/20 px-4 py-2 rounded-lg hover:bg-cobalt hover:text-white transition-all">
              Visit Store
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
