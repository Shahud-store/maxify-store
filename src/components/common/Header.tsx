import { motion } from 'motion/react';
import { ShoppingCart, Search, User, Menu, Bell } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { cn } from '../../lib/utils';

export default function Header() {
  const { items } = useCart();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-display font-black text-white">M</div>
          <span className="text-xl font-display font-black tracking-tighter text-cobalt">MAXIFY</span>
        </div>

        {/* Search Bar (Optional) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-cobalt/20 outline-none" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </motion.span>
            )}
          </button>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

