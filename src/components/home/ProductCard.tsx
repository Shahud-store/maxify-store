import { motion } from 'motion/react';
import { Star, ShoppingCart, ShieldCheck, Zap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { cn, formatCurrency } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart(state => state.addItem);
  const navigate = useNavigate();

  // Social Proof Logic (Mocked)
  const socialProofCount = product.sales_count_last_hour || Math.floor(Math.random() * 50);
  const isSellersPick = Math.random() > 0.8;

  const stockPercentage = Math.round((product.stock_count / 100) * 100);

  const itemTitle = product.title || product.name || "Untitled Product";
  const itemImage = product.image || (product.images && product.images[0]) || null;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all group flex flex-col relative cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-40 bg-gray-50 rounded-lg mb-3 overflow-hidden group-hover:cursor-pointer">
        {itemImage ? (
          <img 
            src={itemImage} 
            alt={itemTitle} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 italic text-[10px]">
            No Image
          </div>
        )}
        {product.vendor?.is_verified && (
          <div className="absolute top-2 left-2 bg-black/60 text-white text-tiny px-2 py-0.5 rounded backdrop-blur-md font-bold">
            Maxify Mall
          </div>
        )}
        {product.compare_at_price && (
          <div className="absolute top-2 right-2 bg-amber text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm z-10">
            SALE
          </div>
        )}
        
        {/* Quick Add Overlay on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <button 
            onClick={(e) => { e.stopPropagation(); addItem(product); }}
            className="bg-cobalt text-white py-1.5 px-4 rounded text-xs font-bold shadow-lg hover:bg-slate-800 transition-colors"
           >
             Add to Cart
           </button>
        </div>
      </div>
 
      {/* Content */}
      <div className="flex-1 flex flex-col space-y-1">
        <h3 className="text-xs font-bold line-clamp-2 h-8 text-foreground group-hover:text-cobalt transition-colors">
          {itemTitle}
        </h3>

        <div className="flex items-center justify-between gap-2 mt-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "923000000000";
              const message = `Assalam-o-Alaikum, I want to order this product:\n\n*Product:* ${itemTitle}\n*Price:* ${formatCurrency(product.discount_price || product.price)}\n\n*My Address:* `;
              const encodedMessage = encodeURIComponent(message);
              window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
            }}
            className="flex-1 bg-[#25D366] text-white py-1.5 px-3 rounded text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
          >
            <ShoppingCart className="w-3 h-3" />
            Order on WhatsApp
          </button>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-cobalt font-black text-sm">{formatCurrency(product.discount_price || product.price)}</span>
          {product.compare_at_price ? (
            <span className="text-tiny text-gray-300 line-through font-normal">{formatCurrency(product.compare_at_price)}</span>
          ) : product.discount_price && (
            <span className="text-tiny text-gray-300 line-through font-normal">{formatCurrency(product.price)}</span>
          )}
        </div>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber text-tiny">
            <Star className="w-2.5 h-2.5 fill-current" />
            <Star className="w-2.5 h-2.5 fill-current" />
            <Star className="w-2.5 h-2.5 fill-current" />
            <Star className="w-2.5 h-2.5 fill-current" />
            <Star className="w-2.5 h-2.5 fill-current" />
          </div>
          <span className="text-tiny text-gray-400 font-bold">{product.vendor?.seller_rating || 4.8} Seller Rating</span>
        </div>

        {/* Dynamic Nudges */}
        <div className="mt-auto space-y-1.5">
          {product.stock_count < 10 ? (
            <div className="flex justify-between items-center bg-red-50 p-1.5 rounded">
              <span className="text-tiny text-red-600 font-bold uppercase tracking-tighter">🔥 Scarcity Nudge</span>
              <span className="text-tiny text-red-800 font-black">Only {product.stock_count} Left!</span>
            </div>
          ) : (
            <div className="bg-blue-50 p-1.5 rounded flex justify-between">
              <span className="text-tiny text-blue-700 font-bold uppercase tracking-tighter">SOCIAL PROOF</span>
              <span className="text-tiny text-blue-800 font-black">{socialProofCount} bought in 1h</span>
            </div>
          )}

          {/* Inventory Progress Bar */}
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000",
                product.stock_count < 10 ? "bg-red-500 w-[10%]" : "bg-amber"
              )}
              style={{ width: `${Math.max(10, product.stock_count)}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
